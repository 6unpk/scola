class Review < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :place

  validates :body, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :rating, presence: true, inclusion: { in: 1..5 }
  # 회원은 장소당 1개. 게스트(user_id nil)는 uniqueness 미적용.
  validates :user_id, uniqueness: { scope: :place_id, message: '이미 후기를 작성했습니다' }, if: -> { user_id.present? }
  # 게스트는 닉네임 필수 + 링크 차단(드라이브바이 스팸 최소 방어)
  # ponytail: rate-limit/captcha 없음. 스팸 심해지면 그때 추가.
  validates :author_name, presence: true, length: { maximum: 20 }, if: -> { user_id.nil? }
  validates :body, format: { without: %r{https?://|www\.}i, message: '링크는 포함할 수 없습니다' }, if: -> { user_id.nil? }

  after_save    :refresh_place_rating
  after_destroy :refresh_place_rating

  def display_name
    user&.name || author_name
  end

  private

  # 회원 후기 평균을 장소의 rating/review_count 컬럼에 반영.
  # 후기가 하나도 없으면 rating은 null로 되돌려 카드가 네이버 방문자 수로 폴백하도록 함.
  def refresh_place_rating
    scope = place.reviews
    avg   = scope.average(:rating)
    place.update_columns(
      rating: avg&.round(1),
      review_count: scope.count
    )
  end
end
