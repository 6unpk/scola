class SearchQuery < ApplicationRecord
  validates :term, presence: true, uniqueness: true

  # 검색어 정규화: 앞뒤 공백 제거 + 내부 연속 공백을 하나로 (대소문자는 원문 유지)
  def self.normalize(raw)
    raw.to_s.strip.gsub(/\s+/, ' ')
  end

  # 검색 1건 기록. 동일 검색어면 count 원자적 증가.
  def self.record(raw)
    term = normalize(raw)
    return if term.blank? || term.length > 50

    rec = find_or_create_by!(term: term)
    where(id: rec.id).update_all('count = count + 1')
  rescue ActiveRecord::RecordNotUnique
    retry
  end

  # 인기 검색어 상위 목록
  def self.popular(limit = 8)
    order(count: :desc, updated_at: :desc).limit(limit).pluck(:term)
  end
end
