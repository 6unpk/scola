// 지역 랜딩페이지(/sauna/[region])용 시·도 정보.
// slug(URL) ↔ name(백엔드 region 파라미터·표시명) 매핑.

export interface RegionInfo {
  slug: string;
  name: string;   // 백엔드 /places?region= 값 & 표시명
  blurb: string;  // 지역 소개(SEO 텍스트)
}

export const REGIONS: RegionInfo[] = [
  { slug: 'seoul', name: '서울', blurb: '도심 한복판의 프리미엄 스파부터 24시간 찜질방까지, 서울 곳곳의 사우나를 모았습니다.' },
  { slug: 'busan', name: '부산', blurb: '해운대·서면의 바다뷰 스파와 온천, 부산의 사우나·찜질방을 한눈에.' },
  { slug: 'incheon', name: '인천', blurb: '송도·부평 일대의 대형 스파와 찜질방까지, 인천 사우나 정보.' },
  { slug: 'daegu', name: '대구', blurb: '대구 도심과 근교의 사우나·찜질방·불한증막을 모았습니다.' },
  { slug: 'gwangju', name: '광주', blurb: '광주 지역의 사우나, 찜질방, 스파 정보를 한눈에.' },
  { slug: 'daejeon', name: '대전', blurb: '유성온천을 비롯한 대전의 온천·사우나·찜질방 정보.' },
  { slug: 'ulsan', name: '울산', blurb: '울산 지역의 사우나와 찜질방, 스파를 모았습니다.' },
  { slug: 'sejong', name: '세종', blurb: '세종시의 사우나·찜질방·스파 정보를 한눈에.' },
  { slug: 'gyeonggi', name: '경기', blurb: '수원·성남·고양 등 경기 전역의 대형 찜질방과 스파를 모았습니다.' },
  { slug: 'gangwon', name: '강원', blurb: '강릉·춘천의 온천과 바다뷰 스파, 강원의 사우나 정보.' },
  { slug: 'chungbuk', name: '충북', blurb: '청주를 중심으로 한 충북 지역의 사우나·찜질방·온천 정보.' },
  { slug: 'chungnam', name: '충남', blurb: '천안·아산 온천을 비롯한 충남의 사우나·찜질방 정보.' },
  { slug: 'jeonbuk', name: '전북', blurb: '전주 등 전북 지역의 사우나, 찜질방, 스파를 모았습니다.' },
  { slug: 'jeonnam', name: '전남', blurb: '여수·순천 일대의 사우나와 찜질방, 전남 지역 정보.' },
  { slug: 'gyeongbuk', name: '경북', blurb: '포항·경주 등 경북 지역의 온천·사우나·찜질방 정보.' },
  { slug: 'gyeongnam', name: '경남', blurb: '창원·김해 일대의 사우나와 스파, 경남 지역 정보.' },
  { slug: 'jeju', name: '제주', blurb: '제주 여행 중 들르기 좋은 스파와 사우나, 찜질방 정보.' },
];

export function regionBySlug(slug: string): RegionInfo | undefined {
  return REGIONS.find((r) => r.slug === slug);
}
