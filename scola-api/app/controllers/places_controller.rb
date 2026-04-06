class PlacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_place, only: [:show, :update]

  # GET /places
  # 쿼리: q, category, gender_type, is_24hours, has_restaurant, has_sleep_room,
  #        has_massage, has_gym, kids_facility, sort, page, per
  def index
    scope = Place.all

    # 키워드 검색
    if params[:q].present?
      q = "%#{params[:q]}%"
      scope = scope.where("name ILIKE ? OR address ILIKE ? OR road_address ILIKE ?", q, q, q)
    end

    # 카테고리 필터 (배열 컬럼 — ANY 사용)
    scope = scope.where("? = ANY(app_category)", params[:category]) if params[:category].present?

    # 불리언 필터
    %w[is_24hours has_restaurant has_sleep_room has_massage has_gym kids_facility membership_available].each do |flag|
      scope = scope.where(flag => true) if params[flag] == "true"
    end

    # 성별 구분 필터
    scope = scope.where(gender_type: params[:gender_type]) if params[:gender_type].present?

    # 정렬
    scope = case params[:sort]
            when "review"    then scope.order(visitor_review_count: :desc)
            when "rating"    then scope.order(rating: :desc)
            when "name"      then scope.order(name: :asc)
            else                  scope.order(visitor_review_count: :desc)
            end

    total = scope.count
    per   = (params[:per] || 20).to_i.clamp(1, 100)
    page  = (params[:page] || 1).to_i.clamp(1, Float::INFINITY)
    places = scope.limit(per).offset((page - 1) * per)

    render json: {
      status: { code: 200 },
      meta: { total: total, page: page, per: per, total_pages: (total.to_f / per).ceil },
      data: places
    }
  end

  # GET /places/:id
  def show
    render json: { status: { code: 200 }, data: @place }
  end

  # PATCH /places/:id  — 수동 데이터 보강용 (인증 필요)
  def update
    authenticate_user!
    if @place.update(place_params)
      render json: { status: { code: 200 }, data: @place }
    else
      render json: { status: { code: 422 }, errors: @place.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_place
    @place = Place.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '장소를 찾을 수 없습니다.' } }, status: :not_found
  end

  def place_params
    params.require(:place).permit(
      :app_category, :rating, :review_count, :price_range, :open_hours,
      :gender_type, :sauna_type, :room_count,
      :sauna_temp, :hot_bath_temp, :cold_bath_temp,
      :pool_info, :age_restriction, :admission_fee,
      :is_24hours, :membership_available, :has_restaurant,
      :has_sleep_room, :has_massage, :has_gym, :kids_facility,
      :parking_count,
      bath_types: [], special_rooms: [], amenities: [], tags: [],
      price_tiers: {}
    )
  end
end
