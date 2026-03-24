class Lesson < ApplicationRecord
  belongs_to :user
  has_many :lesson_enrollments, dependent: :destroy
  has_many :students, through: :lesson_enrollments
  has_many :attendances, dependent: :destroy

  VALID_DAYS = %w[mon tue wed thu fri sat sun].freeze

  enum :status, { active: 'active', inactive: 'inactive' }

  validates :name, presence: true
  validates :start_time, :end_time, presence: true
  validates :days_of_week, presence: { message: '요일을 최소 1개 이상 선택해주세요.' }
  validate :days_of_week_must_be_valid
  validate :end_time_must_be_after_start_time

  private

  def days_of_week_must_be_valid
    return if days_of_week.blank?

    invalid = days_of_week - VALID_DAYS
    errors.add(:days_of_week, "유효하지 않은 요일이 포함되어 있습니다: #{invalid.join(', ')}") if invalid.any?
  end

  def end_time_must_be_after_start_time
    return if start_time.blank? || end_time.blank?

    errors.add(:end_time, '종료 시간은 시작 시간보다 이후여야 합니다.') if end_time <= start_time
  end
end
