"""
enriched_results.json → Rails API로 description 업데이트 + 리뷰 생성

실행:
  uv run import_to_db.py
  uv run import_to_db.py --api-url http://localhost:3001  # 로컬 Rails
  uv run import_to_db.py --dry-run                        # 실제 요청 없이 확인만
"""

# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "httpx>=0.27.0",
# ]
# ///

import argparse
import json
import time
from pathlib import Path

import httpx


INPUT_FILE = "enriched_results.json"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-url", default="http://localhost:3001", help="Rails API 베이스 URL")
    parser.add_argument("--token", default="", help="Bearer 토큰 (필요시)")
    parser.add_argument("--dry-run", action="store_true", help="실제 요청 없이 확인만")
    args = parser.parse_args()

    if not Path(INPUT_FILE).exists():
        raise SystemExit(f"{INPUT_FILE} 없음. enrich.py 먼저 실행하세요.")

    with open(INPUT_FILE, encoding="utf-8") as f:
        places: list[dict] = json.load(f)

    headers = {"Content-Type": "application/json"}
    if args.token:
        headers["Authorization"] = f"Bearer {args.token}"

    client = httpx.Client(base_url=args.api_url, headers=headers, timeout=15.0)

    # place_id(네이버) → DB id 매핑 조회
    print("DB 장소 목록 조회 중...")
    resp = client.get("/places", params={"per": 500})
    resp.raise_for_status()
    db_places = resp.json()["data"]
    naver_to_db: dict[str, int] = {p["naver_place_id"]: p["id"] for p in db_places}
    print(f"DB에 {len(naver_to_db)}개 장소 있음\n")

    ok_count = desc_count = review_count = skip_count = 0

    for place in places:
        naver_id = str(place.get("place_id", ""))
        name = place.get("name", "")
        db_id = naver_to_db.get(naver_id)

        if not db_id:
            print(f"[스킵] {name} — DB에 없음 (naver_id={naver_id})")
            skip_count += 1
            continue

        # ── description 업데이트 ─────────────────────────────────
        description = place.get("description")
        if description:
            if args.dry_run:
                print(f"[DRY] PATCH /places/{db_id} description ({len(description)}자)")
            else:
                r = client.patch(f"/places/{db_id}", json={"place": {"description": description}})
                if r.is_success:
                    desc_count += 1
                else:
                    print(f"  description 업데이트 실패: {r.status_code}")

        # ── 생성된 리뷰 INSERT ───────────────────────────────────
        generated = place.get("generated_reviews", [])
        for rev in generated:
            payload = {
                "review": {
                    "place_id": db_id,
                    "body": rev.get("body", ""),
                    "rating": rev.get("rating", 5),
                    "visited_at": rev.get("visited_at"),
                    "author_name": rev.get("author"),   # guest 리뷰용 필드 (있다면)
                }
            }
            if args.dry_run:
                print(f"  [DRY] POST /reviews — {rev.get('author')} ({rev.get('rating')}점)")
            else:
                r = client.post("/reviews", json=payload)
                if r.is_success:
                    review_count += 1
                else:
                    print(f"  리뷰 생성 실패: {r.status_code} — {r.text[:80]}")
                time.sleep(0.1)

        ok_count += 1
        print(f"[{ok_count}] {name} — description {'O' if description else '-'}, 리뷰 {len(generated)}개")

    print("\n" + "=" * 60)
    print(f"처리: {ok_count}개 | 스킵: {skip_count}개")
    print(f"description 업데이트: {desc_count}개")
    print(f"리뷰 생성: {review_count}개")


if __name__ == "__main__":
    main()
