class Review < ApplicationRecord
  belongs_to :user
  belongs_to :place

  validates :body, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :place_id, message: '이미 후기를 작성했습니다' }
end
