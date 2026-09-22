class PlaceEvent < ApplicationRecord
  belongs_to :place

  EVENT_TYPES = %w[call naver_map homepage share].freeze

  validates :event_type, inclusion: { in: EVENT_TYPES }

  def self.ransackable_attributes(_auth_object = nil)
    %w[id place_id event_type created_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[place]
  end
end
