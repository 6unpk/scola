"""
뉴스 크롤러
- 네이버 정치 뉴스 헤드라인 수집
- https://news.naver.com/section/100
"""

import httpx
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from dataclasses import dataclass
import asyncio
import config


@dataclass
class NewsItem:
    """뉴스 데이터 모델"""
    title: str
    url: str
    source: str = ""
    image_url: str = ""


class NewsCrawler:
    """네이버 정치 뉴스 크롤러"""

    NEWS_URL = "https://news.naver.com/section/100"

    def __init__(self):
        self.news: list[NewsItem] = []

    async def crawl(self, limit: int = 10) -> list[NewsItem]:
        """뉴스 헤드라인 크롤링"""
        print(f"[뉴스 크롤러] 네이버 정치 뉴스 수집 시작...")

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=config.HEADLESS)
            page = await browser.new_page()

            await page.goto(self.NEWS_URL, wait_until="networkidle")
            await page.wait_for_timeout(2000)

            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 헤드라인 뉴스 아이템
            items = soup.select(".sa_list .sa_item")

            for item in items[:limit]:
                title_elem = item.select_one(".sa_text_title")
                if not title_elem:
                    continue

                title = title_elem.get_text(strip=True)
                url = title_elem.get("href", "")

                # 언론사
                source_elem = item.select_one(".sa_text_press")
                source = source_elem.get_text(strip=True) if source_elem else ""

                # 이미지
                img_elem = item.select_one("img")
                image_url = img_elem.get("src", "") if img_elem else ""

                if title and url:
                    news_item = NewsItem(
                        title=title,
                        url=url,
                        source=source,
                        image_url=image_url,
                    )
                    self.news.append(news_item)

            await browser.close()

        print(f"[뉴스 크롤러] {len(self.news)}개 뉴스 수집 완료")
        return self.news

    async def save_to_api(self) -> None:
        """수집한 뉴스를 Rails API로 전송"""
        print("[뉴스 크롤러] API로 데이터 전송 중...")

        async with httpx.AsyncClient(timeout=30.0) as client:
            # 기존 뉴스 삭제 (최신 뉴스로 교체)
            try:
                await client.delete(f"{config.API_BASE_URL}/news/clear")
            except:
                pass

            for news in self.news:
                try:
                    response = await client.post(
                        f"{config.API_BASE_URL}/news",
                        json={
                            "title": news.title,
                            "url": news.url,
                            "source": news.source,
                            "image_url": news.image_url,
                        }
                    )
                    if response.status_code in [200, 201]:
                        print(f"  ✓ {news.title[:40]}...")
                    else:
                        print(f"  ✗ {news.title[:40]}... ({response.status_code})")
                except Exception as e:
                    print(f"  ✗ {news.title[:40]}... (Error: {e})")

        print("[뉴스 크롤러] API 전송 완료")


async def main():
    """테스트 실행"""
    crawler = NewsCrawler()
    news = await crawler.crawl(limit=5)

    for item in news:
        print(f"[{item.source}] {item.title}")
        print(f"  URL: {item.url}")
        print()


if __name__ == "__main__":
    asyncio.run(main())
