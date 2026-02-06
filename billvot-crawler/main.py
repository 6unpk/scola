#!/usr/bin/env python3
"""
Billvot 크롤러

사용법:
    uv run main.py                    # 전체 크롤링 (법안 + 뉴스)
    uv run main.py --bills            # 법안만 크롤링
    uv run main.py --news             # 뉴스만 크롤링
    uv run main.py --dry-run          # 크롤링만 (저장 안함)
    uv run main.py --limit 100        # 최대 100개 수집
"""

import asyncio
import argparse
from crawlers import BillsCrawler, NewsCrawler


async def crawl_bills(save: bool = True, limit: int = 50):
    """법안 크롤링 실행"""
    crawler = BillsCrawler()
    bills = await crawler.crawl(limit=limit)

    if save and bills:
        await crawler.save_to_api()

    return bills


async def crawl_news(save: bool = True, limit: int = 10):
    """뉴스 크롤링 실행"""
    crawler = NewsCrawler()
    news = await crawler.crawl(limit=limit)

    if save and news:
        await crawler.save_to_api()

    return news


async def main():
    parser = argparse.ArgumentParser(description="Billvot 크롤러")
    parser.add_argument("--bills", action="store_true", help="법안만 크롤링")
    parser.add_argument("--news", action="store_true", help="뉴스만 크롤링")
    parser.add_argument("--dry-run", action="store_true", help="크롤링만 실행 (API 저장 안함)")
    parser.add_argument("--limit", type=int, default=50, help="수집할 항목 수 (기본: 50)")

    args = parser.parse_args()

    print("=" * 50)
    print("Billvot 크롤러 시작")
    print("=" * 50)

    save = not args.dry_run

    # 아무 옵션도 없으면 전체 크롤링
    if not args.bills and not args.news:
        await crawl_bills(save=save, limit=args.limit)
        await crawl_news(save=save, limit=10)
    else:
        if args.bills:
            await crawl_bills(save=save, limit=args.limit)
        if args.news:
            await crawl_news(save=save, limit=args.limit)

    print("=" * 50)
    print("크롤링 완료")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
