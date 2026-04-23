"""
네이버 지도 리뷰 수집 + Gemini 요약/생성 파이프라인

흐름:
  1. 사우나_results.json 로드
  2. 각 장소 → 네이버 방문자 리뷰 크롤링
  3. 리뷰 + 장소 정보 → Gemini → description + 앱용 리뷰 생성
  4. enriched_results.json 저장 (Rails import 바로 가능)

실행:
  uv run enrich.py                          # 전체
  uv run enrich.py --limit 10              # 테스트용 10개만
  uv run enrich.py --resume                # 이미 처리된 건 스킵
"""

# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "playwright>=1.58.0",
#   "playwright-stealth>=2.0.2",
#   "google-generativeai>=0.8.0",
#   "python-dotenv>=1.0.0",
# ]
# ///

import argparse
import asyncio
import json
import os
import random
import time
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from playwright_stealth import Stealth


# ─── 설정 ─────────────────────────────────────────────────────────────────────

INPUT_FILE  = "사우나_results.json"
OUTPUT_FILE = "enriched_results.json"

GEMINI_MODEL  = "gemini-2.5-flash-lite"
MAX_REVIEWS_TO_SCRAPE = 30   # 장소당 수집할 네이버 리뷰 최대 수

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
]


# ─── 리뷰 크롤러 ──────────────────────────────────────────────────────────────

@dataclass
class NaverReview:
    rating: int          # 1~5
    text: str
    date: str = ""


async def scrape_naver_reviews(page, place_id: str, max_count: int = 15) -> list[NaverReview]:
    """네이버 지도 방문자 리뷰 크롤링"""
    reviews: list[NaverReview] = []

    try:
        # 메인 상세 페이지로 먼저 진입 (직접 /review/visitor로 가면 리다이렉트됨)
        url = f"https://map.naver.com/p/entry/place/{place_id}"
        await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
        await asyncio.sleep(random.uniform(2.5, 4.0))

        frame = page.frame_locator("#entryIframe")

        # 리뷰 탭 클릭
        review_tab = frame.locator("a[href*='review'], button:has-text('리뷰'), .veBoZ a:has-text('리뷰')")
        if await review_tab.count() > 0:
            await review_tab.first.click()
            await asyncio.sleep(random.uniform(1.5, 2.5))

        # 더보기 반복 클릭
        for _ in range(7):
            try:
                more_btn = frame.locator("a.fvwqf, button.fvwqf, .zPfVt")
                if await more_btn.count() > 0:
                    await more_btn.first.click()
                    await asyncio.sleep(random.uniform(1.5, 2.5))
                else:
                    break
            except Exception:
                break

        # 리뷰 카드 파싱
        review_cards = frame.locator(".pui__X35jYm, .place_review_list li, .EjjAW")
        count = min(await review_cards.count(), max_count)

        for i in range(count):
            card = review_cards.nth(i)

            # 별점
            star_el = card.locator(".PXMot, .StarScore_star_score__x4MwP, em.pui__jhkE4i")
            rating = 5
            if await star_el.count() > 0:
                txt = (await star_el.first.text_content() or "5").strip()
                try:
                    rating = int(float(txt))
                except ValueError:
                    rating = 5
            rating = max(1, min(5, rating))

            # 본문
            body_el = card.locator(".pui__vn15t2, .place_review_text, .zPfVt, .YH6m5")
            text = ""
            if await body_el.count() > 0:
                text = (await body_el.first.text_content() or "").strip()

            # 날짜
            date_el = card.locator(".pui__blind, .place_review_date, time")
            date = ""
            if await date_el.count() > 0:
                date = (await date_el.first.text_content() or "").strip()

            if text:
                reviews.append(NaverReview(rating=rating, text=text, date=date))

    except PlaywrightTimeout:
        pass
    except Exception as e:
        print(f"    리뷰 크롤링 오류: {e}")

    return reviews


# ─── Gemini 처리 ──────────────────────────────────────────────────────────────

GEMINI_PROMPT = """\
당신은 사우나·찜질방 앱의 콘텐츠 분석 전문가입니다.
아래 장소 정보와 실제 네이버 방문자 리뷰를 분석해 JSON을 반환하세요.
절대 내용을 지어내지 마세요. 리뷰에 근거한 내용만 작성하고, 근거 없으면 null.

## 장소 정보
{place_info}

## 네이버 방문자 리뷰 (원문, {review_count}개)
{naver_reviews}

## 지시사항

### place_profile (장소 프로필) — 리뷰 기반으로 추출
- **summary**: 이 장소를 한 문장으로 표현. 가장 두드러진 특징 중심. (30자 이내)
- **highlights**: 리뷰에서 자주 언급된 장점·특징 3~5개. 짧고 구체적인 문장으로.
- **atmosphere**: 공간의 분위기와 주요 이용객층을 1~2문장으로.
- **recommended_for**: 이 장소가 특히 잘 맞는 방문 목적 또는 대상. 2~4개.
- **best_time**: 방문하기 좋은 시간대 또는 피해야 할 시간대. 근거 없으면 null.
- **tips**: 실제 방문자들이 언급한 유용한 꿀팁 1~3개. 근거 없으면 빈 배열.
- **caution**: 단점, 불편함, 주의사항. 근거 없으면 null.
- **price_value**: 가격 대비 만족도. "가성비 좋음" / "적당함" / "비싼 편" 중 하나. 근거 없으면 null.
- **cleanliness**: 청결도. "매우 깨끗함" / "보통" / "아쉬운 편" 중 하나. 근거 없으면 null.
- **parking**: 주차 관련 내용 요약. 근거 없으면 null.
- **signature**: 이 장소만의 가장 독특한 특징 한 가지. 근거 없으면 null.

### review_summary (리뷰 종합 요약) — 실제 방문자 리뷰 전체를 분석한 요약
- **overall**: 전반적인 만족도와 평판을 2~3문장으로 요약. 리뷰들의 공통된 의견 중심.
- **pros**: 여러 리뷰에서 공통으로 언급된 장점. 3~5개.
- **cons**: 여러 리뷰에서 공통으로 언급된 단점이나 아쉬운 점. 1~3개. 없으면 빈 배열.
- **keywords**: 리뷰에서 가장 자주 등장한 핵심 키워드. 5~8개. (예: "넓은 욕탕", "친절한 직원", "주차 편리")
- **sentiment_breakdown**: 리뷰 전체의 긍정/부정/중립 비율. 예: {{"positive": 80, "neutral": 15, "negative": 5}} (합계 100)
- **representative_reviews**: 리뷰 원문 중 가장 대표적인 문장 2~3개를 그대로 발췌. 요약하거나 수정하지 말 것.

반드시 아래 JSON 스키마로만 응답하세요. 다른 텍스트 없이 JSON만:
{{
  "place_profile": {{
    "summary": "string",
    "highlights": ["string"],
    "atmosphere": "string",
    "recommended_for": ["string"],
    "best_time": "string | null",
    "tips": ["string"],
    "caution": "string | null",
    "price_value": "string | null",
    "cleanliness": "string | null",
    "parking": "string | null",
    "signature": "string | null"
  }},
  "review_summary": {{
    "overall": "string",
    "pros": ["string"],
    "cons": ["string"],
    "keywords": ["string"],
    "sentiment_breakdown": {{"positive": number, "neutral": number, "negative": number}},
    "representative_reviews": ["string"]
  }}
}}
"""


def build_place_info(place: dict) -> str:
    lines = [
        f"이름: {place.get('name', '')}",
        f"주소: {place.get('road_address') or place.get('address', '')}",
        f"카테고리: {place.get('category', '')}",
    ]
    if place.get("amenities"):
        lines.append(f"편의시설: {', '.join(place['amenities'])}")
    if place.get("sauna_type"):
        lines.append(f"사우나 종류: {place['sauna_type']}")
    if place.get("bath_types"):
        lines.append(f"탕 종류: {', '.join(place['bath_types'])}")
    if place.get("special_rooms"):
        lines.append(f"특수시설: {', '.join(place['special_rooms'])}")
    if place.get("admission_fee"):
        lines.append(f"입장료: {place['admission_fee']}")
    if place.get("is_24hours"):
        lines.append("24시간 운영")
    if place.get("description"):
        lines.append(f"기존 설명: {place['description']}")
    return "\n".join(lines)


def call_gemini(model, place: dict, naver_reviews: list[NaverReview]) -> dict | None:
    review_text = "\n".join(
        f"[{r.rating}점] {r.text}" for r in naver_reviews
    ) or "리뷰 없음"

    prompt = GEMINI_PROMPT.format(
        place_info=build_place_info(place),
        naver_reviews=review_text,
        review_count=len(naver_reviews),
    )

    for attempt in range(3):
        try:
            response = model.generate_content(prompt)
            raw = response.text.strip()
            # 코드블록 제거
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            return json.loads(raw.strip())
        except json.JSONDecodeError as e:
            print(f"    JSON 파싱 실패 (시도 {attempt+1}): {e}")
            time.sleep(2)
        except Exception as e:
            print(f"    Gemini 오류 (시도 {attempt+1}): {e}")
            time.sleep(5)

    return None


# ─── 메인 파이프라인 ──────────────────────────────────────────────────────────

async def run(limit: int | None, resume: bool):
    # Gemini 초기화
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise SystemExit("GEMINI_API_KEY 환경변수를 설정하세요.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(GEMINI_MODEL)

    # 입력 로드
    with open(INPUT_FILE, encoding="utf-8") as f:
        places: list[dict] = json.load(f)

    if limit:
        places = places[:limit]

    # 기존 결과 로드 (resume)
    enriched: dict[str, dict] = {}
    if resume and Path(OUTPUT_FILE).exists():
        with open(OUTPUT_FILE, encoding="utf-8") as f:
            for item in json.load(f):
                enriched[item["place_id"]] = item
        print(f"기존 결과 {len(enriched)}개 로드됨")

    print(f"처리 대상: {len(places)}개 장소")
    print("=" * 60)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=random.choice(USER_AGENTS),
            locale="ko-KR",
            timezone_id="Asia/Seoul",
        )
        page = await context.new_page()
        stealth = Stealth(
            navigator_languages_override=("ko-KR", "ko"),
            navigator_platform_override="MacIntel",
        )
        await stealth.apply_stealth_async(page)

        for idx, place in enumerate(places):
            pid = place.get("place_id", "")
            name = place.get("name", "")

            if resume and pid in enriched:
                print(f"[{idx+1}/{len(places)}] {name} — 스킵")
                continue

            print(f"\n[{idx+1}/{len(places)}] {name} (id={pid})")

            # 1. 네이버 리뷰 수집
            reviews = await scrape_naver_reviews(page, pid, MAX_REVIEWS_TO_SCRAPE)
            print(f"  → 네이버 리뷰 {len(reviews)}개 수집")

            # 2. Gemini 처리
            result = call_gemini(model, place, reviews)
            if result is None:
                print("  → Gemini 실패, 스킵")
                continue

            # 3. 결과 병합
            profile = result.get("place_profile", {})
            review_summary = result.get("review_summary", {})
            enriched_place = {
                **place,
                "place_profile": profile,
                "review_summary": review_summary,
                "naver_review_count": len(reviews),
                "naver_review_sample": [
                    {"rating": r.rating, "text": r.text, "date": r.date}
                    for r in reviews
                ],
            }
            enriched[pid] = enriched_place
            print(f"  → 프로필 완료, 리뷰 요약 완료 (근거 리뷰 {len(reviews)}개)")

            # 중간 저장
            _save(list(enriched.values()))

            # 요청 간격 (Gemini 레이트리밋 + 네이버 차단 방지)
            await asyncio.sleep(random.uniform(3.0, 6.0))

            # 20개마다 긴 휴식
            if (idx + 1) % 20 == 0:
                pause = random.randint(30, 60)
                print(f"\n  [휴식 {pause}초]")
                await asyncio.sleep(pause)
                # 컨텍스트 갱신
                await context.close()
                context = await browser.new_context(
                    viewport={"width": 1920, "height": 1080},
                    user_agent=random.choice(USER_AGENTS),
                    locale="ko-KR",
                    timezone_id="Asia/Seoul",
                )
                page = await context.new_page()
                await stealth.apply_stealth_async(page)

        await browser.close()

    _save(list(enriched.values()))
    print("\n" + "=" * 60)
    print(f"완료! {len(enriched)}개 → {OUTPUT_FILE}")


def _save(data: list[dict]):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    parser = argparse.ArgumentParser(description="네이버 리뷰 수집 + Gemini 보강")
    parser.add_argument("--limit", type=int, default=None, help="처리할 장소 수 (테스트용)")
    parser.add_argument("--resume", action="store_true", help="이미 처리된 장소 스킵")
    args = parser.parse_args()

    asyncio.run(run(args.limit, args.resume))


if __name__ == "__main__":
    main()
