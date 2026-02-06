"""
법안 크롤러
- 국회 의안정보시스템에서 법안 데이터 수집
- https://likms.assembly.go.kr/bill/
"""

import httpx
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from dataclasses import dataclass
import asyncio
import re
import config


@dataclass
class Bill:
    """법안 데이터 모델"""
    bill_id: str           # 의안 고유 ID
    bill_no: str           # 의안번호
    bill_name: str         # 의안명
    proposer: str          # 제안자
    propose_date: str      # 제안일
    committee: str         # 소관위원회
    status: str            # 심사진행상태
    detail_url: str        # 상세페이지 URL


class BillsCrawler:
    """국회 의안정보시스템 크롤러"""

    BASE_URL = "https://likms.assembly.go.kr/bill"
    LIST_URL = f"{BASE_URL}/bi/bill/state/mooringBillPage.do"  # 계류의안 목록

    def __init__(self):
        self.bills: list[Bill] = []

    async def crawl(self, limit: int = 50) -> list[Bill]:
        """
        법안 목록 크롤링

        Args:
            limit: 가져올 법안 수
        """
        print(f"[법안 크롤러] 국회 의안정보시스템 수집 시작...")

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=config.HEADLESS)
            page = await browser.new_page()

            await page.goto(self.LIST_URL, wait_until="networkidle")
            await page.wait_for_timeout(2000)

            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 첫 번째 테이블에서 법안 정보 추출
            table = soup.select_one("table")
            if not table:
                print("[법안 크롤러] 테이블을 찾을 수 없습니다.")
                await browser.close()
                return []

            rows = table.select("tbody tr")

            for row in rows[:limit]:
                cols = row.select("td")
                if len(cols) >= 7:
                    # 의안번호
                    bill_no = cols[0].get_text(strip=True)

                    # 의안명 링크에서 정보 추출
                    link = cols[1].select_one("a[data-bill-id]")
                    if not link:
                        continue

                    bill_id = link.get("data-bill-id", "")
                    title_text = link.get("title", "")
                    # 제목에서 법안명과 제안자 분리
                    # 예: "국방·군사시설 사업에 관한 법률 일부개정법률안(박선원의원 등 11인)"
                    bill_name, proposer = self._parse_title(title_text)

                    # 제안일자
                    propose_date = cols[3].get_text(strip=True)

                    # 소관위원회
                    committee = cols[5].get_text(strip=True)

                    # 심사진행상태
                    status = cols[6].get_text(strip=True)

                    # 상세 URL
                    detail_url = f"{self.BASE_URL}/bi/billDetailPage.do?billId={bill_id}"

                    bill = Bill(
                        bill_id=bill_id,
                        bill_no=bill_no,
                        bill_name=bill_name,
                        proposer=proposer,
                        propose_date=propose_date,
                        committee=committee,
                        status=status,
                        detail_url=detail_url,
                    )
                    self.bills.append(bill)

            await browser.close()

        print(f"[법안 크롤러] {len(self.bills)}개 법안 수집 완료")
        return self.bills

    def _parse_title(self, title: str) -> tuple[str, str]:
        """제목에서 법안명과 제안자 분리"""
        # "(새창 열림)" 제거
        title = re.sub(r"\s*\(새창 열림\)", "", title)
        # 마지막 괄호 안의 제안자 추출
        match = re.search(r"^(.+?)\(([^)]+의원[^)]*)\)$", title)
        if match:
            bill_name = match.group(1).strip()
            proposer = match.group(2).strip()
        else:
            bill_name = title
            proposer = ""
        return bill_name, proposer

    async def save_to_api(self) -> None:
        """수집한 법안을 Rails API로 전송"""
        print("[법안 크롤러] API로 데이터 전송 중...")

        async with httpx.AsyncClient(timeout=30.0) as client:
            for bill in self.bills:
                try:
                    response = await client.post(
                        f"{config.API_BASE_URL}/votes",
                        json={
                            "title": bill.bill_name,
                            "content": "",
                            "author": bill.proposer,
                            "bill_number": bill.bill_no,
                            "proposed_date": bill.propose_date,
                            "session": "제22대",
                            "process_step": bill.status,
                            "committee": bill.committee,
                            "external_url": bill.detail_url,
                        }
                    )
                    if response.status_code in [200, 201]:
                        print(f"  ✓ {bill.bill_name[:40]}...")
                    else:
                        print(f"  ✗ {bill.bill_name[:40]}... ({response.status_code})")
                except Exception as e:
                    print(f"  ✗ {bill.bill_name[:40]}... (Error: {e})")

        print("[법안 크롤러] API 전송 완료")


async def main():
    """테스트 실행"""
    crawler = BillsCrawler()
    bills = await crawler.crawl(limit=5)

    for bill in bills:
        print(f"[{bill.bill_no}] {bill.bill_name}")
        print(f"  제안자: {bill.proposer}")
        print(f"  제안일: {bill.propose_date}")
        print(f"  위원회: {bill.committee}")
        print(f"  상태: {bill.status}")
        print(f"  URL: {bill.detail_url}")
        print()


if __name__ == "__main__":
    asyncio.run(main())
