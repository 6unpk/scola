# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "playwright>=1.58.0",
#   "playwright-stealth>=2.0.2",
#   "google-generativeai>=0.8.0",
#   "python-dotenv>=1.0.0",
# ]
# ///

"""
네이버 플레이스 ID(또는 지도 URL)만 넣으면 장소를 스크래핑 + AI 요약까지 만들어 DB에 추가.

흐름:
  1. pcmap __APOLLO_STATE__ 에서 기본 정보 + get_place_detail(가격/주차) 재사용
  2. (기본) 네이버 리뷰 수집 → Gemini → place_profile + review_summary  [enrich.py 재사용]
  3. manual_results.json 저장
  4. rails places:import → import:enriched → auto_categorize 로 DB 반영

사용:
  uv run add_place.py 1820969                      # 스크랩 + AI 요약 + DB 반영
  uv run add_place.py https://map.naver.com/p/entry/place/1820969
  uv run add_place.py 1820969 32399 11820          # 여러 개
  uv run add_place.py 1820969 --no-enrich          # AI 요약 생략(빠름)
  uv run add_place.py 1820969 --no-import          # JSON만
  uv run add_place.py 1820969 --headful            # 브라우저 띄우기
"""

import argparse
import asyncio
import json
import os
import re
import subprocess
from dataclasses import asdict
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

from dotenv import load_dotenv

from scraper import NaverMapScraper, PlaceInfo
from enrich import scrape_naver_reviews, call_gemini, GEMINI_MODEL, MAX_REVIEWS_TO_SCRAPE

load_dotenv()

OUTPUT_FILE = "manual_results.json"
PCMAP_URL = "https://pcmap.place.naver.com/place/{id}/home"


def parse_place_id(raw: str) -> str | None:
    """'1820969' 또는 지도 URL에서 place id(숫자) 추출."""
    raw = raw.strip()
    if raw.isdigit():
        return raw
    m = re.search(r"/place/(\d+)", raw)
    if m:
        return m.group(1)
    m = re.search(r"(\d{5,})", raw)
    return m.group(1) if m else None


def _first(d: dict, *keys):
    for k in keys:
        v = d.get(k)
        if v not in (None, "", []):
            return v
    return None


def _to_int(v):
    if v is None:
        return None
    try:
        return int(str(v).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


def unwrap_image(url: str | None) -> str | None:
    """search.pstatic.net 프록시 URL이면 원본 이미지(src)로 풀어준다.
    프록시 URL은 hotlink 차단으로 브라우저에서 안 뜨는 경우가 있어 원본이 안전."""
    if not url:
        return url
    if "search.pstatic.net" in url and "src=" in url:
        src = parse_qs(urlparse(url).query).get("src", [None])[0]
        if src:
            return unquote(src)
    return url


def _extract_from_apollo(state: dict, place_id: str) -> dict | None:
    """__APOLLO_STATE__의 PlaceDetailBase에서 기본 필드 추출."""
    base = state.get(f"PlaceDetailBase:{place_id}")
    if not base:
        base = next(
            (v for v in state.values()
             if isinstance(v, dict) and v.get("__typename") == "PlaceDetailBase"),
            None,
        )
    if not base or not base.get("name"):
        return None

    coord = base.get("coordinate") or {}
    x = float(coord["x"]) if coord.get("x") else None
    y = float(coord["y"]) if coord.get("y") else None

    return {
        "name": base.get("name"),
        "category": _first(base, "category"),
        "address": _first(base, "address"),
        "road_address": _first(base, "roadAddress"),
        "phone": _first(base, "phone", "virtualPhone"),
        "x": x,
        "y": y,
        "visitor_review_count": _to_int(_first(base, "visitorReviewsTotal")),
        "blog_review_count": _to_int(_first(base, "cafeBlogReviewsTotal")),
    }


async def fetch_place(scraper: NaverMapScraper, place_id: str) -> PlaceInfo | None:
    page = scraper.page
    try:
        await page.goto(PCMAP_URL.format(id=place_id), wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2.5)
        state = await page.evaluate("() => window.__APOLLO_STATE__ || null")
    except Exception as e:
        print(f"  [{place_id}] 페이지 로드 실패: {e}")
        return None

    if not state:
        print(f"  [{place_id}] __APOLLO_STATE__ 없음 — ID가 유효한지 확인하세요.")
        return None

    data = _extract_from_apollo(state, place_id)
    if not data or not data.get("name"):
        print(f"  [{place_id}] 장소 정보 추출 실패.")
        return None

    # 썸네일: og:image → 프록시면 원본으로 풀기
    try:
        og = await page.evaluate(
            "() => document.querySelector('meta[property=\"og:image\"]')?.content || null"
        )
        if og:
            data["thumbnail"] = unwrap_image(og)
    except Exception:
        pass

    place = PlaceInfo(place_id=place_id, search_keyword="manual", **data)

    # 상세(가격/주차/영업시간)는 기존 스크래퍼 로직 재사용
    try:
        place = await scraper.get_place_detail(place)
    except Exception as e:
        print(f"  [{place_id}] 상세 보강 건너뜀: {e}")

    print(f"  [{place_id}] + {place.name}"
          f" | {place.road_address or place.address or '주소 미상'}"
          f" | ({place.y}, {place.x})"
          f" | 리뷰 {place.visitor_review_count or 0}")
    return place


def make_gemini_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(GEMINI_MODEL)


async def scrape_ids(place_ids: list[str], headless: bool, model) -> list[dict]:
    results: list[dict] = []
    async with NaverMapScraper(headless=headless, min_delay=1.0, max_delay=2.0) as scraper:
        for pid in place_ids:
            place = await fetch_place(scraper, pid)
            if not place:
                continue
            item = asdict(place)

            # AI 요약 (enrich.py 재사용) — 네이버 리뷰 수집 → Gemini
            if model:
                try:
                    reviews = await scrape_naver_reviews(scraper.page, pid, MAX_REVIEWS_TO_SCRAPE)
                    res = call_gemini(model, item, reviews)
                    if res:
                        item["place_profile"] = res.get("place_profile", {})
                        item["review_summary"] = res.get("review_summary", {})
                        print(f"  [{pid}] AI 요약 완료 (근거 리뷰 {len(reviews)}개)")
                    else:
                        print(f"  [{pid}] AI 요약 실패 — 기본 정보만 저장")
                except Exception as e:
                    print(f"  [{pid}] AI 요약 오류: {e}")

            results.append(item)
    return results


def _run_rake(api_dir: Path, task: str) -> bool:
    cmd = f"cd '{api_dir}' && bundle exec rails '{task}'"
    print(f"\n▶ {task}")
    result = subprocess.run(["zsh", "-lc", cmd], capture_output=True, text=True)
    print((result.stdout or "").strip())
    if result.returncode != 0:
        print((result.stderr or "").strip())
        return False
    return True


def run_import(file_path: str, enriched: bool):
    api_dir = Path(__file__).resolve().parent.parent / "scola-api"
    rel = f"../navermap-scraper/{file_path}"

    ok = _run_rake(api_dir, f"places:import[{rel}]")
    if ok and enriched:
        _run_rake(api_dir, f"import:enriched[{rel}]")
    if ok:
        _run_rake(api_dir, "places:auto_categorize")

    if not ok:
        print("\n자동 import 실패. scola-api에서 직접 실행하세요:")
        print(f"  bundle exec rails 'places:import[{rel}]'")
        print(f"  bundle exec rails 'import:enriched[{rel}]'")
        print(f"  bundle exec rails places:auto_categorize")


def main():
    parser = argparse.ArgumentParser(description="네이버 플레이스 ID로 장소 추가")
    parser.add_argument("ids", nargs="+", help="네이버 플레이스 ID 또는 지도 URL")
    parser.add_argument("--no-enrich", action="store_true", help="AI 요약(제미나이) 생략")
    parser.add_argument("--no-import", action="store_true", help="JSON만 만들고 DB import 생략")
    parser.add_argument("--headful", action="store_true", help="브라우저를 띄워서 실행")
    args = parser.parse_args()

    place_ids: list[str] = []
    for raw in args.ids:
        pid = parse_place_id(raw)
        if pid:
            place_ids.append(pid)
        else:
            print(f"[무시] ID를 추출할 수 없음: {raw}")
    if not place_ids:
        raise SystemExit("유효한 플레이스 ID가 없습니다.")

    model = None
    if not args.no_enrich:
        model = make_gemini_model()
        if model is None:
            print("⚠ GEMINI_API_KEY 없음 — AI 요약 없이 기본 정보만 수집합니다 (.env 확인).")

    print(f"수집할 장소 {len(place_ids)}개: {', '.join(place_ids)}"
          f"{' (+AI 요약)' if model else ''}")
    results = asyncio.run(scrape_ids(place_ids, headless=not args.headful, model=model))

    if not results:
        raise SystemExit("수집된 장소가 없습니다.")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n{len(results)}개 저장 → {OUTPUT_FILE}")

    enriched = any(item.get("place_profile") for item in results)

    if args.no_import:
        print("`--no-import` 지정됨. 수동 반영:")
        print(f"  bundle exec rails 'places:import[../navermap-scraper/{OUTPUT_FILE}]'")
        if enriched:
            print(f"  bundle exec rails 'import:enriched[../navermap-scraper/{OUTPUT_FILE}]'")
        print(f"  bundle exec rails places:auto_categorize")
    else:
        run_import(OUTPUT_FILE, enriched)
        print("\n완료! 새 장소가 DB에 반영됐습니다.")


if __name__ == "__main__":
    main()
