class Attendance < ApplicationRecord
  belongs_to :lesson
  belongs_to :student

  enum :status, { present: 'present', absent: 'absent', late: 'late', excused: 'excused' }

  validates :date, presence: true
  validates :status, presence: true
  validates :student_id, uniqueness: { scope: [:lesson_id, :date] }
end
