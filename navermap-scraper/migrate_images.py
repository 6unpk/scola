# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "boto3>=1.34.0",
#   "pillow>=10.0.0",
#   "httpx>=0.27.0",
#   "python-dotenv>=1.0.0",
# ]
# ///

"""
기존 장소 이미지를 전부 Cloudflare R2로 이관.

흐름: API에서 장소 목록 수집 → 네이버 thumbnail 다운로드 → 리사이즈/최적화 → R2 업로드
     → {place_id, thumbnail(R2 URL)} 매핑을 thumbnail_map.json에 저장.
DB 반영은 rails `places:set_thumbnails[thumbnail_map.json]`로 별도 수행.

사용:
  uv run migrate_images.py --limit 5                       # 5장만 테스트
  uv run migrate_images.py                                 # 로컬 API(기본) 전체
  uv run migrate_images.py --api-url https://api.scola.kr  # 운영 API 대상
  uv run migrate_images.py --resume                        # 이미 R2인 건 스킵
"""

import argparse
import json
from concurrent.futures import ThreadPoolExecutor

import httpx
from dotenv import load_dotenv

load_dotenv()

from r2 import configured, check_connection, is_r2_url, upload_place_image

OUTPUT_FILE = "thumbnail_map.json"


def fetch_all_places(api_url: str) -> list[dict]:
    # ⚠️ /places 기본 정렬은 random 이라 페이지네이션 시 중복/누락 발생.
    # sort=name 으로 결정적 순서 확보 후 place_id 기준 dedupe.
    seen: set[str] = set()
    places: list[dict] = []
    with httpx.Client(base_url=api_url, timeout=30.0) as c:
        page = 1
        while True:
            r = c.get("/places", params={"per": 100, "page": page, "sort": "name"})
            r.raise_for_status()
            j = r.json()
            for p in j.get("data", []):
                pid = str(p.get("naver_place_id"))
                if pid not in seen:
                    seen.add(pid)
                    places.append(p)
            meta = j.get("meta", {})
            if page >= meta.get("total_pages", 1):
                break
            page += 1
    return places


def load_places_file(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        raw = json.load(f)
    seen: set[str] = set()
    out: list[dict] = []
    for p in raw:
        pid = str(p.get("place_id") or p.get("naver_place_id"))
        if pid and pid not in seen:
            seen.add(pid)
            out.append({"naver_place_id": pid, "thumbnail": p.get("thumbnail")})
    return out


def main():
    parser = argparse.ArgumentParser(description="장소 이미지 R2 이관")
    parser.add_argument("--api-url", default="http://localhost:3000", help="Rails API 베이스 URL")
    parser.add_argument("--places-file", default=None, help="DB에서 덤프한 장소 목록 JSON(권장, 페이지네이션 버그 회피)")
    parser.add_argument("--limit", type=int, default=None, help="처리할 장소 수(테스트용)")
    parser.add_argument("--workers", type=int, default=8, help="동시 처리 수")
    args = parser.parse_args()

    if not configured():
        raise SystemExit("R2 환경변수 미설정 — .env에 R2_* 값을 넣으세요.")
    if not check_connection():
        raise SystemExit("R2 버킷 접근 실패 — 자격증명/버킷명을 확인하세요.")

    if args.places_file:
        print(f"장소 목록 파일: {args.places_file}")
        places = load_places_file(args.places_file)
    else:
        print(f"장소 목록 조회: {args.api_url}")
        places = fetch_all_places(args.api_url)

    # 썸네일 있고 아직 R2가 아닌 것만 (이미 R2면 스킵 = 멱등)
    targets = [p for p in places if p.get("thumbnail") and not is_r2_url(p.get("thumbnail"))]
    if args.limit:
        targets = targets[: args.limit]
    print(f"대상 {len(targets)}곳 (전체 {len(places)}곳)")

    mapping: list[dict] = []
    failed: list[str] = []
    done = 0

    def work(p: dict):
        pid = str(p["naver_place_id"])
        url = upload_place_image(pid, p["thumbnail"])
        return pid, url

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        for pid, url in ex.map(work, targets):
            done += 1
            if url:
                mapping.append({"place_id": pid, "thumbnail": url})
            else:
                failed.append(pid)
            if done % 50 == 0:
                print(f"  {done}/{len(targets)} 처리 (성공 {len(mapping)}, 실패 {len(failed)})")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
    if failed:
        with open("expired_places.json", "w", encoding="utf-8") as f:
            json.dump(failed, f, ensure_ascii=False, indent=2)

    print(f"\n완료: 업로드 {len(mapping)}장 / 실패(만료 추정) {len(failed)}장")
    print(f"  매핑 → {OUTPUT_FILE}")
    if failed:
        print("  실패 place_id → expired_places.json (재스크랩 대상: refresh_images.py)")
    print("다음: (scola-api에서) bundle exec rails "
          f"'places:set_thumbnails[../navermap-scraper/{OUTPUT_FILE}]'")


if __name__ == "__main__":
    main()
