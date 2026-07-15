class Post < ApplicationRecord
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  validates :title, presence: true
  validates :slug,  presence: true, uniqueness: true

  scope :published, -> { where(published: true).order(published_at: :desc, created_at: :desc) }

  # ─── SEO 자동 폴백 ──────────────────────────────────────────────
  def effective_meta_title
    meta_title.presence || title
  end

  def effective_meta_description
    (meta_description.presence || excerpt.presence || strip_markdown(body.to_s)).to_s.strip.truncate(155)
  end

  # 본문 마크다운에서 태그/기호를 제거해 순수 텍스트만 남김(설명문 자동 생성용)
  def strip_markdown(text)
    text
      .gsub(/```.*?```/m, ' ')                 # 코드블록
      .gsub(/!\[[^\]]*\]\([^)]*\)/, ' ')       # 이미지
      .gsub(/\[([^\]]*)\]\([^)]*\)/, '\1')     # 링크 → 텍스트
      .gsub(/[#>*_`~\-]+/, ' ')                # 마크다운 기호
      .gsub(/\s+/, ' ')
      .strip
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id title slug category author_name published published_at created_at]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end

  private

  def generate_slug
    base = title.gsub(/\s+/, '-').gsub(/[^a-zA-Z가-힣0-9\-]/, '').downcase
    base = 'post' if base.blank?
    candidate = base
    n = 1
    while Post.where(slug: candidate).where.not(id: id).exists?
      candidate = "#{base}-#{n}"
      n += 1
    end
    self.slug = candidate
  end
end
