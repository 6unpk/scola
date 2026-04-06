# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "playwright>=1.58.0",
#   "playwright-stealth>=2.0.2",
# ]
# ///

"""
네이버 지도 전국 사우나 크롤러
API 인터셉트 + 상세 페이지 파싱
"""

import asyncio
import json
import random
from dataclasses import dataclass, asdict, field
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from playwright_stealth import Stealth


@dataclass
class PlaceInfo:
    """사우나 장소 상세 정보"""
    place_id: str
    name: str
    category: str | None = None            # 네이버 카테고리
    search_keyword: str | None = None      # 수집에 사용된 검색어
    address: str | None = None
    road_address: str | None = None
    phone: str | None = None
    business_hours: str | None = None      # 영업 상태 요약
    business_hours_detail: list[str] | None = None  # 요일별 영업시간
    visitor_review_count: int | None = None   # 방문자 리뷰 수
    blog_review_count: int | None = None      # 블로그/카페 리뷰 수
    x: float | None = None                # 경도
    y: float | None = None                # 위도
    homepage: str | None = None
    description: str | None = None
    thumbnail: str | None = None
    # 사우나 특화 정보
    amenities: list[str] | None = None        # 편의시설 (황토방, 불한증막, 수영장 등)
    parking: str | None = None                # 주차 정보 텍스트
    parking_count: int | None = None          # 주차 가능 대수
    admission_fee: str | None = None          # 입장료 요약
    price_info: list[str] | None = None       # 가격 raw 목록
    price_tiers: dict | None = None           # 어른/청소년/어린이/노인 요금 구조화
    gender_type: str | None = None            # 남성전용 / 여성전용 / 남녀공용
    age_restriction: str | None = None        # 연령 제한 (예: "만 12세 이상")
    sauna_type: str | None = None             # 건식 / 습식 / 건식+습식
    room_count: int | None = None             # 사우나방 개수
    sauna_temp: str | None = None             # 사우나 온도 (예: "80~100°C")
    hot_bath_temp: str | None = None          # 온탕/열탕 온도
    cold_bath_temp: str | None = None         # 냉탕 온도 (예: "15°C")
    bath_types: list[str] | None = None       # 탕 종류 (온탕, 냉탕, 노천탕 등)
    special_rooms: list[str] | None = None    # 특수 시설 (소금방, 얼음방, 숯가마 등)
    pool_info: str | None = None              # 수영장 정보
    is_24hours: bool | None = None            # 24시간 운영 여부
    membership_available: bool | None = None  # 회원권/정기권 여부
    has_restaurant: bool | None = None        # 식당/매점 여부
    has_sleep_room: bool | None = None        # 수면실 여부
    has_massage: bool | None = None           # 세신/마사지 여부
    has_gym: bool | None = None               # 헬스장 여부
    kids_facility: bool | None = None         # 키즈 시설 여부


@dataclass
class GridPoint:
    lat: float
    lng: float
    name: str = ""


USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
]


class NaverMapScraper:
    """네이버 지도 크롤러"""

    BASE_URL = "https://map.naver.com/p"

    KOREA_BOUNDS = {
        "min_lat": 33.0,
        "max_lat": 38.6,
        "min_lng": 124.5,
        "max_lng": 132.0,
    }

    def __init__(
        self,
        headless: bool = True,
        min_delay: float = 2.0,
        max_delay: float = 5.0,
        long_break_interval: int = 30,
        long_break_duration: tuple[int, int] = (30, 60),
    ):
        self.headless = headless
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.long_break_interval = long_break_interval
        self.long_break_duration = long_break_duration

        self.browser = None
        self.context = None
        self.page = None
        self.collected_places: dict[str, PlaceInfo] = {}
        self.request_count = 0

    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def start(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=self.headless,
            args=["--disable-blink-features=AutomationControlled"]
        )
        await self._new_context()

    async def _new_context(self):
        if self.context:
            await self.context.close()

        self.context = await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=random.choice(USER_AGENTS),
            locale="ko-KR",
            timezone_id="Asia/Seoul",
        )
        self.page = await self.context.new_page()

        stealth = Stealth(
            navigator_languages_override=("ko-KR", "ko"),
            navigator_platform_override="MacIntel",
        )
        await stealth.apply_stealth_async(self.page)

    async def close(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def _random_delay(self):
        await asyncio.sleep(random.uniform(self.min_delay, self.max_delay))

    async def _maybe_long_break(self):
        self.request_count += 1
        if self.request_count % self.long_break_interval == 0:
            duration = random.randint(*self.long_break_duration)
            print(f"\n  [휴식 {duration}초]")
            await asyncio.sleep(duration)
            await self._new_context()

    def generate_grid_points(self, step_km: float = 20.0, shuffle: bool = False) -> list[GridPoint]:
        lat_step = step_km / 111.0
        lng_step = step_km / 88.0
        points = []
        lat = self.KOREA_BOUNDS["min_lat"]
        while lat <= self.KOREA_BOUNDS["max_lat"]:
            lng = self.KOREA_BOUNDS["min_lng"]
            while lng <= self.KOREA_BOUNDS["max_lng"]:
                points.append(GridPoint(lat=lat, lng=lng))
                lng += lng_step
            lat += lat_step
        if shuffle:
            random.shuffle(points)
        return points

    def generate_major_city_points(self, shuffle: bool = False) -> list[GridPoint]:
        points = [
            GridPoint(37.5665, 126.9780, "서울"),
            GridPoint(37.4563, 126.7052, "인천"),
            GridPoint(37.2636, 127.0286, "수원"),
            GridPoint(37.3943, 127.1110, "성남"),
            GridPoint(35.1796, 129.0756, "부산"),
            GridPoint(35.8714, 128.6014, "대구"),
            GridPoint(35.1595, 126.8526, "광주"),
            GridPoint(36.3504, 127.3845, "대전"),
            GridPoint(35.5384, 129.3114, "울산"),
            GridPoint(36.4800, 127.2890, "세종"),
            GridPoint(37.8813, 127.7298, "춘천"),
            GridPoint(37.4563, 129.1658, "강릉"),
            GridPoint(36.9910, 127.0926, "천안"),
            GridPoint(36.6424, 127.4890, "청주"),
            GridPoint(35.8242, 127.1480, "전주"),
            GridPoint(34.8118, 126.3922, "목포"),
            GridPoint(35.9782, 129.3930, "포항"),
            GridPoint(33.4996, 126.5312, "제주"),
        ]
        if shuffle:
            random.shuffle(points)
        return points

    def _parse_place_from_api(self, item: dict, search_keyword: str | None = None) -> PlaceInfo:
        """검색 API 응답에서 기본 정보 추출"""
        category = None
        if item.get("category"):
            category = " > ".join(item["category"])

        business_hours = None
        if item.get("businessStatus") and item["businessStatus"].get("status"):
            status = item["businessStatus"]["status"]
            business_hours = f"{status.get('text', '')} {status.get('detailInfo', '')}".strip()

        # 리뷰 수 분리 (방문자 / 블로그)
        visitor_review_count = item.get("visitorReviewCount") or item.get("reviewCount")
        blog_review_count = item.get("blogCafeReviewCount")

        return PlaceInfo(
            place_id=item.get("id", ""),
            name=item.get("name", ""),
            category=category,
            search_keyword=search_keyword,
            address=item.get("address"),
            road_address=item.get("roadAddress"),
            phone=item.get("tel"),
            business_hours=business_hours,
            visitor_review_count=visitor_review_count,
            blog_review_count=blog_review_count,
            x=float(item["x"]) if item.get("x") else None,
            y=float(item["y"]) if item.get("y") else None,
            homepage=item.get("homePage"),
            description=item.get("description"),
            thumbnail=item.get("thumUrl"),
        )

    async def search_at_coordinate(
        self,
        query: str,
        lat: float,
        lng: float,
        zoom: int = 14
    ) -> list[PlaceInfo]:
        """검색 API 인터셉트"""
        results = []
        captured_data = []

        async def handle_response(response):
            if "api/search/allSearch" in response.url:
                try:
                    data = await response.json()
                    captured_data.append(data)
                except:
                    pass

        self.page.on("response", handle_response)

        try:
            search_url = f"{self.BASE_URL}/search/{query}?c={lng},{lat},{zoom},0,0,0,dh"
            await self.page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(random.uniform(3, 5))

            # 페이지네이션
            for page_num in range(2, random.randint(3, 5)):
                try:
                    search_frame = self.page.frame_locator("#searchIframe")
                    next_btn = search_frame.locator(f"a.zRM9F:has-text('{page_num}')")
                    if await next_btn.count() > 0:
                        await asyncio.sleep(random.uniform(1, 2))
                        await next_btn.click()
                        await asyncio.sleep(random.uniform(2, 3))
                except:
                    break

        except PlaywrightTimeout:
            print(f"  타임아웃")
        except Exception as e:
            print(f"  오류: {e}")
        finally:
            self.page.remove_listener("response", handle_response)

        for data in captured_data:
            try:
                place_list = data.get("result", {}).get("place", {}).get("list", [])
                for item in place_list:
                    place = self._parse_place_from_api(item, search_keyword=query)
                    if place.place_id:
                        results.append(place)
            except:
                continue

        return results

    async def get_place_detail(self, place: PlaceInfo) -> PlaceInfo:
        """상세 페이지에서 기본 정보 보완"""
        try:
            url = f"{self.BASE_URL}/entry/place/{place.place_id}"
            await self.page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(random.uniform(2, 4))

            frame = self.page.frame_locator("#entryIframe")

            # ── 영업시간 상세 ─────────────────────────────────────────
            hours_detail = frame.locator(".H3ua4")
            if await hours_detail.count() > 0:
                hours_list = []
                for i in range(await hours_detail.count()):
                    text = await hours_detail.nth(i).text_content()
                    if text:
                        hours_list.append(text.strip())
                if hours_list:
                    place.business_hours_detail = hours_list

            # ── 주소 보완 ─────────────────────────────────────────────
            if not place.road_address:
                addr_elem = frame.locator(".LDgIH")
                if await addr_elem.count() > 0:
                    place.road_address = (await addr_elem.first.text_content() or "").strip() or None

            # ── 홈페이지 보완 ─────────────────────────────────────────
            if not place.homepage:
                homepage_elem = frame.locator(".jO09N")
                if await homepage_elem.count() > 0:
                    place.homepage = (await homepage_elem.first.text_content() or "").strip() or None

            # ── 가격/입장료 ───────────────────────────────────────────
            price_lines: list[str] = []
            for selector in [".GXS1X", ".tD3eg", ".MXkg6", "dt", "li"]:
                elems = frame.locator(selector)
                count = await elems.count()
                for i in range(min(count, 30)):
                    try:
                        text = (await elems.nth(i).text_content() or "").strip()
                        if any(kw in text for kw in ["원", "₩", "입장", "요금", "가격", "권"]) and len(text) < 100:
                            price_lines.append(text)
                    except:
                        continue
                if price_lines:
                    break
            if price_lines:
                place.price_info = price_lines[:10]
                place.admission_fee = price_lines[0]

            # ── 주차 ─────────────────────────────────────────────────
            for selector in [".jVIwr", ".nQ7Lh"]:
                parking_elem = frame.locator(selector)
                if await parking_elem.count() > 0:
                    text = await parking_elem.first.text_content() or ""
                    if "주차" in text:
                        place.parking = text.strip()
                        break

        except Exception as e:
            print(f"    상세 오류: {e}")

        return place

    async def crawl_nationwide(
        self,
        query: str = "회의실",
        use_grid: bool = True,
        grid_step_km: float = 30.0,
        get_details: bool = True,
        save_interval: int = 50,
        output_file: str = "results.json",
        start_index: int = 0,  # 시작 인덱스 (resume용)
        shuffle: bool = False,  # 순서 섞기 (resume시 False 권장)
    ):
        """전국 크롤링"""
        if use_grid:
            points = self.generate_grid_points(grid_step_km, shuffle=shuffle)
        else:
            points = self.generate_major_city_points(shuffle=shuffle)

        print(f"총 {len(points)}개 좌표에서 '{query}' 검색")
        print(f"시작 인덱스: {start_index}, 상세 정보: {get_details}")
        print("=" * 60)

        for idx, point in enumerate(points[start_index:], start=start_index):
            point_name = point.name or f"({point.lat:.2f}, {point.lng:.2f})"
            print(f"\n[{idx+1}/{len(points)}] {point_name}")

            places = await self.search_at_coordinate(query, point.lat, point.lng)
            new_count = 0

            for place in places:
                if place.place_id in self.collected_places:
                    continue

                # 상세 정보 수집
                if get_details:
                    place = await self.get_place_detail(place)
                    await self._random_delay()
                    await self._maybe_long_break()

                self.collected_places[place.place_id] = place
                new_count += 1
                fee = f" | {place.admission_fee}" if place.admission_fee else ""
                gender = f" | {place.gender_type}" if place.gender_type else ""
                amenity_count = len(place.amenities or [])
                print(f"    + {place.name}{fee}{gender} ({amenity_count}개 시설)")

            print(f"  → +{new_count}개 (총 {len(self.collected_places)}개)")

            # 중간 저장
            if len(self.collected_places) % save_interval < new_count and len(self.collected_places) > 0:
                self._save_results(output_file)
                print(f"  [저장됨]")

            await self._random_delay()
            await self._maybe_long_break()

        self._save_results(output_file)
        print("\n" + "=" * 60)
        print(f"완료! 총 {len(self.collected_places)}개")
        print(f"저장: {output_file}")

    def _save_results(self, output_file: str):
        output = [asdict(p) for p in self.collected_places.values()]
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

    def load_results(self, output_file: str) -> int:
        """기존 결과 로드 (resume용)"""
        try:
            with open(output_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for item in data:
                place = PlaceInfo(**item)
                self.collected_places[place.place_id] = place
            print(f"기존 데이터 {len(self.collected_places)}개 로드됨")
            return len(self.collected_places)
        except FileNotFoundError:
            print("기존 파일 없음, 새로 시작")
            return 0


SAUNA_KEYWORDS = ["사우나", "불가마", "한증막", "찜질방", "스파"]
OUTPUT_FILE = "사우나_results.json"
PROGRESS_FILE = "사우나_progress.json"


def load_progress() -> dict:
    """어느 키워드까지 완료됐는지 추적"""
    try:
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_progress(progress: dict):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)


async def main():
    progress = load_progress()

    async with NaverMapScraper(
        headless=True,
        min_delay=2.0,
        max_delay=4.0,
        long_break_interval=20,
        long_break_duration=(20, 40),
    ) as scraper:
        # 기존 수집 결과 이어받기 (place_id 기준 중복 제거)
        scraper.load_results(OUTPUT_FILE)

        for keyword in SAUNA_KEYWORDS:
            if progress.get(keyword) == "done":
                print(f"[스킵] '{keyword}' — 이미 완료됨")
                continue

            print(f"\n{'='*60}")
            print(f"키워드 시작: '{keyword}'")

            await scraper.crawl_nationwide(
                query=keyword,
                use_grid=True,
                grid_step_km=30.0,   # 전국 격자 (~480 포인트/키워드)
                get_details=True,
                save_interval=30,
                output_file=OUTPUT_FILE,
                start_index=0,
                shuffle=False,
            )

            progress[keyword] = "done"
            save_progress(progress)
            print(f"키워드 완료: '{keyword}' — 누적 {len(scraper.collected_places)}개")

    print(f"\n{'='*60}")
    print(f"전체 완료! 총 {len(scraper.collected_places)}개 수집 → {OUTPUT_FILE}")


def main_sync():
    asyncio.run(main())


if __name__ == "__main__":
    main_sync()
