class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :students, dependent: :destroy
  has_many :lessons, dependent: :destroy
  has_many :reviews, dependent: :destroy

  def self.ransackable_attributes(_auth_object = nil)
    %w[admin created_at email id name]
  end

  def self.ransackable_associations(_auth_object = nil)
    []
  end
end
