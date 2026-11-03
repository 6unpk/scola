module PlaceQuality
  MIN_INDEX_REVIEWS = 10
  SHORT_DESCRIPTION = 10
  STALE_DAYS = 30

  CHECKS = {
    "thumbnail" => ["썸네일 없음", ->(s) { s.where("thumbnail IS NULL OR thumbnail = ''") }],
    "phone" => ["전화번호 없음", ->(s) { s.where("phone IS NULL OR phone = ''") }],
    "coordinates" => ["좌표 없음", ->(s) { s.where("latitude IS NULL OR longitude IS NULL") }],
    "description" => ["설명 없음", ->(s) { s.where("description IS NULL OR trim(description) = ''") }],
    "short_description" => ["설명이 지나치게 짧음", ->(s) { s.where("char_length(trim(description)) BETWEEN 1 AND ?", SHORT_DESCRIPTION - 1) }],
    "no_profile" => ["AI 분석 없음", ->(s) { s.where("place_profile IS NULL OR place_profile = '{}'::jsonb") }],
    "unknown_24h" => ["24시간 여부 미확인", ->(s) { s.where(is_24hours: nil) }],
    "noindex" => ["리뷰 10건 미만 (구글 noindex)", ->(s) { s.where("COALESCE(visitor_review_count, 0) < ?", MIN_INDEX_REVIEWS) }],
    "stale_stats" => ["통계 30일 이상 미갱신", ->(s) { s.where("stats_refreshed_at IS NULL OR stats_refreshed_at < ?", STALE_DAYS.days.ago) }]
  }.freeze

  module_function

  def scope(key)
    CHECKS.fetch(key).last.call(Place.all)
  end

  def label(key)
    CHECKS.fetch(key).first
  end

  def counts
    CHECKS.keys.to_h { |key| [key, scope(key).count] }
  end
end
