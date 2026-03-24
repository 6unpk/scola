class Student < ApplicationRecord
  belongs_to :user
  has_many :lesson_enrollments, dependent: :destroy
  has_many :lessons, through: :lesson_enrollments
  has_many :attendances, dependent: :destroy

  enum :status, { active: 'active', inactive: 'inactive', pending: 'pending' }

  validates :name, presence: true
  validates :status, presence: true
end
