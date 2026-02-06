class Comment < ApplicationRecord
  belongs_to :vote
  belongs_to :parent, class_name: "Comment", optional: true
  has_many :replies, class_name: "Comment", foreign_key: :parent_id, dependent: :destroy

  validates :content, presence: true
  validates :nickname, presence: true

  scope :root_comments, -> { where(parent_id: nil) }

  def as_json_with_replies
    {
      id: id,
      content: content,
      nickname: nickname,
      user_id: user_id,
      likes_count: likes_count,
      created_at: created_at,
      replies: replies.order(created_at: :asc).map(&:as_json_simple)
    }
  end

  def as_json_simple
    {
      id: id,
      content: content,
      nickname: nickname,
      user_id: user_id,
      likes_count: likes_count,
      created_at: created_at
    }
  end
end
