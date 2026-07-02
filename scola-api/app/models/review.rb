class Review < ApplicationRecord
  belongs_to :user
  belongs_to :place

  validates :body, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :place_id, message: '이미 후기를 작성했습니다' }

  after_save    :refresh_place_rating
  after_destroy :refresh_place_rating

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
