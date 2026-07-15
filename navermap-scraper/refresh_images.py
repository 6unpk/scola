# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "playwright>=1.58.0",
#   "playwright-stealth>=2.0.2",
#   "boto3>=1.34.0",
#   "pillow>=10.0.0",
#   "httpx>=0.27.0",
#   "python-dotenv>=1.0.0",
# ]
# ///

"""
이미지 없는(또는 만료된) 장소를 pcmap og:image로 재스크랩해서 R2에 저장.

원래 크롤링이 썸네일을 못 받은 장소도 pcmap 상세엔 대표 이미지(og:image)가 있는 경우가 많다.
naver_place_id 목록(JSON 배열)을 받아 각 장소의 최신 대표 이미지를 R2에 올리고
{place_id, thumbnail} 매핑을 저장. DB 반영은 rails places:set_thumbnails로 별도 수행.

사용:
  uv run refresh_images.py no_image_ids.json                 # 목록 전체
  uv run refresh_images.py no_image_ids.json --limit 20      # 테스트
  uv run refresh_images.py no_image_ids.json --resume        # 중단분 이어서
  uv run refresh_images.py no_image_ids.json --out refresh_map.json
"""

import argparse
import asyncio
import json
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

from dotenv import load_dotenv

load_dotenv()

from scraper import NaverMapScraper
import r2

PCMAP_URL = "https://pcmap.place.naver.com/place/{id}/home"


def unwrap_image(url: str | None) -> str | None:
    """search.pstatic.net 프록시 URL이면 원본 이미지(src)로 풀기."""
    if not url:
        return url
    if "search.pstatic.net" in url and "src=" in url:
        src = parse_qs(urlparse(url).query).get("src", [None])[0]
        if src:
            return unquote(src)
    return url


async def fresh_image_url(page, pid: str) -> str | None:
    await page.goto(PCMAP_URL.format(id=pid), wait_until="domcontentloaded", timeout=30000)
    await asyncio.sleep(1.5)
    og = await page.evaluate(
        "() => document.querySelector('meta[property=\"og:image\"]')?.content || null"
    )
    return unwrap_image(og) if og else None


async def run(ids: list[str], out_file: str, headless: bool):
    mapping: list[dict] = []
    if Path(out_file).exists():
        mapping = json.load(open(out_file, encoding="utf-8"))
    done_ids = {m["place_id"] for m in mapping}

    todo = [str(i) for i in ids if str(i) not in done_ids]
    print(f"재스크랩 대상 {len(todo)}곳 (이미 완료 {len(done_ids)})")

    processed = 0
    async with NaverMapScraper(headless=headless, min_delay=0.8, max_delay=1.6,
                               long_break_interval=40, long_break_duration=(15, 30)) as s:
        for pid in todo:
            processed += 1
            try:
                src = await fresh_image_url(s.page, pid)
                if src:
                    url = r2.upload_place_image(pid, src)
                    if url:
                        mapping.append({"place_id": pid, "thumbnail": url})
            except Exception as e:
                print(f"  [{pid}] 오류: {e}")

            await s._random_delay()
            await s._maybe_long_break()

            if processed % 25 == 0:
                print(f"  {processed}/{len(todo)} 처리 (누적 확보 {len(mapping)})")
                json.dump(mapping, open(out_file, "w", encoding="utf-8"),
                          ensure_ascii=False, indent=2)

    json.dump(mapping, open(out_file, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"\n완료: 이미지 확보 {len(mapping)}곳 → {out_file}")
    print("다음: (scola-api에서) bundle exec rails "
          f"'places:set_thumbnails[../navermap-scraper/{out_file}]'")


def main():
    parser = argparse.ArgumentParser(description="이미지 없는 장소 og:image 재스크랩 → R2")
    parser.add_argument("ids_file", help="naver_place_id 배열 JSON 파일")
    parser.add_argument("--out", default="refresh_map.json", help="결과 매핑 파일")
    parser.add_argument("--limit", type=int, default=None, help="처리 수 제한(테스트)")
    parser.add_argument("--resume", action="store_true", help="(기본 동작) 이미 완료분 스킵")
    parser.add_argument("--headful", action="store_true", help="브라우저 표시")
    args = parser.parse_args()

    if not r2.configured():
        raise SystemExit("R2 환경변수 미설정 — .env 확인")
    if not r2.check_connection():
        raise SystemExit("R2 버킷 접근 실패")

    ids = json.load(open(args.ids_file, encoding="utf-8"))
    if args.limit:
        ids = ids[: args.limit]

    asyncio.run(run(ids, args.out, headless=not args.headful))


if __name__ == "__main__":
    main()
