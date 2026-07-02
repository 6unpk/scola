export interface Place {
  id: number;
  naver_place_id: string;
  name: string;
  naver_category: string | null;
  search_keyword: string | null;
  address: string | null;
  road_address: string | null;
  phone: string | null;
  homepage: string | null;
  description: string | null;
  thumbnail: string | null;
  longitude: number | null;
  latitude: number | null;
  business_hours: string | null;
  business_hours_detail: string[];
  visitor_review_count: number | null;
  blog_review_count: number | null;
  admission_fee: string | null;
  price_info: string[];
  price_tiers: Record<string, string>;
  parking: string | null;
  parking_count: number | null;
  gender_type: string | null;
  age_restriction: string | null;
  sauna_type: string | null;
  room_count: number | null;
  sauna_temp: string | null;
  hot_bath_temp: string | null;
  cold_bath_temp: string | null;
  bath_types: string[];
  special_rooms: string[];
  amenities: string[];
  pool_info: string | null;
  is_24hours: boolean | null;
  membership_available: boolean | null;
  has_restaurant: boolean | null;
  has_sleep_room: boolean | null;
  has_massage: boolean | null;
  has_gym: boolean | null;
  kids_facility: boolean | null;
  // 앱 전용 필드 (수동 입력)
  app_category: ('sauna' | 'jjimjilbang' | 'spa' | 'seshin' | 'hotel' | 'waterpark')[];
  rating: number | null;
  review_count: number | null;
  tags: string[];
  open_hours: string | null;
  place_profile: {
    summary: string | null;
    highlights: string[];
    atmosphere: string | null;
    recommended_for: string[];
    best_time: string | null;
    tips: string[];
    caution: string | null;
    price_value: string | null;
    cleanliness: string | null;
    parking: string | null;
    signature: string | null;
  } | null;
  review_summary: {
    overall: string | null;
    pros: string[];
    cons: string[];
    keywords: string[];
    sentiment_breakdown: { positive: number; neutral: number; negative: number } | null;
    representative_reviews: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PlacesResponse {
  status: { code: number };
  meta: { total: number; page: number; per: number; total_pages: number };
  data: Place[];
}

// 지도용 경량 마커 (GET /places/markers)
export interface PlaceMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  app_category: string[];
  thumbnail: string | null;
  road_address: string | null;
}
