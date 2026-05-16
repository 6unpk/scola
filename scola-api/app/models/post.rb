class Post < ApplicationRecord
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  validates :title, presence: true
  validates :slug,  presence: true, uniqueness: true

  scope :published, -> { where(published: true).order(published_at: :desc, created_at: :desc) }

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
