class BillVote < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :vote

  validates :user_id, presence: true
  validates :vote_id, presence: true
  validates :vote_type, presence: true, inclusion: { in: %w[agree disagree] }
  validates :user_id, uniqueness: { scope: :vote_id, message: "이미 투표하셨습니다" }
end
