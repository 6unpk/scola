class CreatePlaces < ActiveRecord::Migration[7.2]
  def change
    create_table :places do |t|
      # 네이버 기본 정보
      t.string   :naver_place_id, null: false
      t.string   :name,           null: false
      t.string   :naver_category
      t.string   :search_keyword
      t.string   :address
      t.string   :road_address
      t.string   :phone
      t.string   :homepage
      t.text     :description
      t.string   :thumbnail
      t.decimal  :longitude, precision: 10, scale: 7   # x
      t.decimal  :latitude,  precision: 10, scale: 7   # y

      # 영업시간
      t.string   :business_hours
      t.string   :business_hours_detail, array: true, default: []

      # 리뷰
      t.integer  :visitor_review_count
      t.integer  :blog_review_count

      # 가격 (네이버에서 긁은 raw)
      t.string   :admission_fee
      t.jsonb    :price_info, default: []

      # 주차
      t.string   :parking
      t.integer  :parking_count

      # 사우나 특화 — 수동 입력
      t.string   :gender_type       # 남성전용 / 여성전용 / 남녀공용
      t.string   :sauna_type        # 건식 / 습식 / 건식+습식
      t.integer  :room_count
      t.string   :sauna_temp
      t.string   :hot_bath_temp
      t.string   :cold_bath_temp
      t.string   :bath_types,    array: true, default: []
      t.string   :special_rooms, array: true, default: []
      t.string   :amenities,     array: true, default: []
      t.string   :pool_info
      t.string   :age_restriction
      t.boolean  :is_24hours
      t.boolean  :membership_available
      t.boolean  :has_restaurant
      t.boolean  :has_sleep_room
      t.boolean  :has_massage
      t.boolean  :has_gym
      t.boolean  :kids_facility
      t.jsonb    :price_tiers, default: {}

      # 앱에서 쓸 추가 필드
      t.string   :app_category      # sauna / jjimjilbang / spa
      t.decimal  :rating, precision: 3, scale: 1
      t.integer  :review_count
      t.string   :price_range       # 저렴 / 보통 / 고급
      t.string   :tags, array: true, default: []
      t.string   :open_hours        # 표시용 요약 영업시간

      t.timestamps
    end

    add_index :places, :naver_place_id, unique: true
    add_index :places, :app_category
    add_index :places, :road_address
    add_index :places, [:latitude, :longitude]
  end
end
