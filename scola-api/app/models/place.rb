class Place < ApplicationRecord
  has_many :reviews, dependent: :destroy

  def self.ransackable_attributes(auth_object = nil)
    %w[address admission_fee age_restriction amenities app_category bath_types
       blog_review_count business_hours cold_bath_temp created_at description
       gender_type has_gym has_massage has_restaurant has_sleep_room homepage
       hot_bath_temp id is_24hours kids_facility latitude longitude
       membership_available name naver_category naver_place_id open_hours
       parking parking_count phone pool_info rating review_count
       road_address room_count sauna_temp sauna_type search_keyword special_rooms
       tags thumbnail updated_at visitor_review_count]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end
end
