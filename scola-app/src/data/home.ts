import type { Review } from '@/types/place';

export const RECENT_REVIEWS: Review[] = [
  { id: 1, place_id: 1, place_name: '용산 불한증막', author: '뜨끈뜨끈맨', rating: 5, content: '진짜 시원하게 땀 빼고 왔어요. 불한증막 온도가 딱 좋고 수면실도 깔끔해서 자고 왔습니다. 강추!', created_at: '2025-03-28' },
  { id: 2, place_id: 5, place_name: '부산 해운대 스파', author: '힐링러버', rating: 5, content: '뷰가 너무 예뻐요. 바다 보면서 스파 즐기는 기분이 최고. 조금 비싸지만 그 값을 합니다.', created_at: '2025-03-25' },
  { id: 3, place_id: 2, place_name: '강남 스파 레포츠', author: '워라밸마스터', rating: 4, content: '수영장이랑 사우나 같이 이용 가능해서 좋아요. 주말엔 좀 붐비는 편이지만 평일엔 쾌적합니다.', created_at: '2025-03-22' },
  { id: 4, place_id: 4, place_name: '수원 왕갈비 찜질방', author: '찜질방달인', rating: 5, content: '먹거리가 특히 맛있어요! 찜질하고 왕갈비 한 접시 먹으면 천국이 따로 없습니다. 가족 나들이 추천!', created_at: '2025-03-20' },
  { id: 5, place_id: 3, place_name: '홍대 한증탕', author: '알뜰여행자', rating: 4, content: '가격 대비 최고예요. 황토방 온도도 적당하고 직원분들도 친절해요. 홍대 근처 살면 정기권 끊을 것 같아요.', created_at: '2025-03-18' },
];

export const HERO_BANNERS = [
  // { id: 1, tag: '이번 주 추천', title: '용산 불한증막\n최고의 힐링 코스', sub: '서울 용산구', bg: 'linear-gradient(135deg, #7A1818 0%, #A62121 100%)', href: '/place/1' },
  // { id: 2, tag: '신규 오픈', title: '부산 해운대\n루프탑 스파', sub: '부산 해운대구', bg: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', href: '/place/5' },
  // { id: 3, tag: '가이드', title: '사우나\n제대로 즐기는 법', sub: '입문자 필독 가이드', bg: 'linear-gradient(135deg, #3d2b00 0%, #8a6200 100%)', href: '/guide' },
  // { id: 4, tag: '인기 급상승', title: '수원 왕갈비\n찜질방', sub: '경기 수원시', bg: 'linear-gradient(135deg, #1a4a1a 0%, #2d8a2d 100%)', href: '/place/4' },
];

export const CATEGORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'sauna', label: '사우나' },
  { value: 'jjimjilbang', label: '찜질방' },
  { value: 'spa', label: '스파' },
  { value: 'seshin', label: '세신샵' },
  { value: 'hotel', label: '호텔' },
  { value: 'waterpark', label: '워터파크' },
];

export const SUGGESTION_POOL = [
  // 지역
  '서울', '부산', '경기', '인천', '대구', '광주', '대전', '울산',
  '수원', '성남', '용인', '고양', '창원', '청주', '전주', '천안',
  '강릉', '춘천', '제주', '여수', '순천', '포항', '구미', '안동',
  '강남', '홍대', '이태원', '해운대', '동래', '센텀', '서면',
  '종로', '신촌', '건대', '성수', '잠실', '영등포', '마포',
  // 시설 유형
  '사우나', '찜질방', '스파', '황토방', '불한증막', '온천',
  '노천탕', '냉탕', '온탕', '한증막', '히노키탕', '버블탕',
  '숯가마', '맥반석찜질', '소금방', '황토찜질', '얼음방',
  // 편의시설
  '수영장', '헬스장', '수면실', '식당', '카페', '루프탑',
  '주차', '발마사지', '안마의자', '때밀이', '이발소',
  // 특징·컨셉
  '24시간', '남녀공용', '가족탕', '커플탕', '단체',
  '프리미엄', '럭셔리', '저렴', '깨끗', '넓은', '조용한',
  '뷰 좋은', '야경', '바다뷰', '산뷰', '도심',
  // 세부 검색
  '용산 불한증막', '해운대 사우나', '강남 스파', '홍대 찜질방',
  '강릉 온천', '제주 스파', '부산 온천', '이태원 사우나',
  '동래 온천', '수원 찜질방', '인천 스파', '판교 사우나',
];
