class PlaceSuggestion < ApplicationRecord
  belongs_to :place
  belongs_to :user, optional: true

  ALLOWED_FIELDS = {
    'sauna_type' => :string, 'sauna_temp' => :string, 'hot_bath_temp' => :string,
    'cold_bath_temp' => :string, 'gender_type' => :string, 'open_hours' => :string,
    'admission_fee' => :string, 'age_restriction' => :string, 'pool_info' => :string,
    'room_count' => :integer, 'parking_count' => :integer,
    'is_24hours' => :boolean, 'membership_available' => :boolean,
    'has_restaurant' => :boolean, 'has_sleep_room' => :boolean, 'has_massage' => :boolean,
    'has_gym' => :boolean, 'kids_facility' => :boolean,
    'bath_types' => :array, 'special_rooms' => :array, 'amenities' => :array, 'tags' => :array
  }.freeze

  GENDER_TYPES = ['남성전용', '여성전용', '남녀공용'].freeze
  SAUNA_TYPES  = ['건식', '습식', '건식+습식'].freeze
  STATUSES = %w[pending approved rejected].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :author_name, presence: true, length: { maximum: 20 }, if: -> { user_id.nil? }
  validates :note, length: { maximum: 200 }
  validates :note, format: { without: %r{https?://|www\.}i, message: '링크는 포함할 수 없습니다' },
            if: -> { user_id.nil? && note.present? }
  validate :payload_has_allowed_fields
  validate :enum_values_valid

  def self.ransackable_attributes(_auth_object = nil)
    %w[id place_id user_id author_name status created_at updated_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[place user]
  end

  def display_name
    user&.name || author_name
  end

  def coerced_payload
    payload.each_with_object({}) do |(key, value), acc|
      type = ALLOWED_FIELDS[key]
      acc[key] = coerce(value, type) if type
    end
  end

  def apply!
    place.update!(coerced_payload)
    update!(status: 'approved')
  end

  private

  def payload_has_allowed_fields
    keys = payload.is_a?(Hash) ? payload.keys : []
    meaningful = keys.select { |k| payload[k].present? || payload[k] == false }
    errors.add(:payload, '제보할 정보를 하나 이상 입력해주세요') if meaningful.empty?

    unknown = keys - ALLOWED_FIELDS.keys
    errors.add(:payload, "허용되지 않은 항목: #{unknown.join(', ')}") if unknown.any?
  end

  def enum_values_valid
    return unless payload.is_a?(Hash)

    gt = payload['gender_type']
    errors.add(:payload, '성별 구분 값이 올바르지 않습니다') if gt.present? && GENDER_TYPES.exclude?(gt)

    st = payload['sauna_type']
    errors.add(:payload, '사우나 종류 값이 올바르지 않습니다') if st.present? && SAUNA_TYPES.exclude?(st)
  end

  def coerce(value, type)
    case type
    when :integer then value.to_s.strip.empty? ? nil : value.to_i
    when :boolean then ActiveModel::Type::Boolean.new.cast(value)
    when :array   then Array(value).map { |v| v.to_s.strip }.reject(&:empty?)
    else value
    end
  end
end
