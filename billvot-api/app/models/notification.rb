class Notification < ApplicationRecord
  belongs_to :user

  validates :notification_type, presence: true
  validates :message, presence: true

  scope :unread, -> { where(is_read: false) }
  scope :recent, -> { order(created_at: :desc) }

  TYPES = {
    reply: 'reply'
  }.freeze
end
