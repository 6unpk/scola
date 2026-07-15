class PlacesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_place, only: [:show, :update]

  REGION_PREFIXES = {
    '서울' => '서울특별시',
    '부산' => '부산광역시',
    '인천' => '인천광역시',
    '대구' => '대구광역시',
    '광주' => '광주광역시',
    '대전' => '대전광역시',
    '울산' => '울산광역시',
    '세종' => '세종특별자치시',
    '경기' => '경기도',
    '강원' => '강원특별자치도',
    '충북' => '충청북도',
    '충남' => '충청남도',
    '전북' => '전북특별자치도',
    '전남' => '전라남도',
    '경북' => '경상북도',
    '경남' => '경상남도',
    '제주' => '제주특별자치도',
  }.freeze

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

    # 카테고리 필터 (다중 선택 — app_category 배열과 겹치면 매칭)
    if params[:category].present?
      cats = Array(params[:category]).reject(&:blank?)
      scope = scope.where("app_category && ARRAY[?]::varchar[]", cats) if cats.any?
    end

    # 지역 필터 (다중 선택) — 행정구역명 전체로 매핑 후 주소 앞부분 매칭, 선택 지역끼리는 OR
    if params[:region].present?
      regions = Array(params[:region]).reject(&:blank?)
      if regions.any?
        clauses = []
        values  = []
        regions.each do |r|
          prefix = REGION_PREFIXES[r] || r
          clauses << "(road_address ILIKE ? OR (road_address IS NULL AND address ILIKE ?))"
          values << "#{prefix}%" << "#{prefix}%"
        end
        scope = scope.where(clauses.join(" OR "), *values)
      end
    end

    # 불리언 필터
    %w[is_24hours has_restaurant has_sleep_room has_massage has_gym kids_facility membership_available].each do |flag|
      scope = scope.where(flag => true) if params[flag] == "true"
    end

    # 성별 구분 필터
    scope = scope.where(gender_type: params[:gender_type]) if params[:gender_type].present?

    # 대표 이미지 있는 곳만
    scope = scope.where("thumbnail IS NOT NULL AND thumbnail <> ''") if params[:has_image] == "true"

    # 정렬
    # 회원 후기 평점은 베이지안 평균으로 반영 → 후기 표본이 적으면 기준값(PRIOR_MEAN)으로
    # 수렴하므로, 후기 1~2개짜리 장소가 만점으로 상단을 독점하지 못하게 함.
    prior_mean   = 3.8   # 사전 평균(리뷰가 없을 때의 기준 평점)
    prior_weight = 20    # 사전 표본 수(이만큼 후기가 쌓여야 실제 평점이 절반 반영)
    bayes_rating = "((COALESCE(review_count, 0) * COALESCE(rating, #{prior_mean}) + #{prior_weight} * #{prior_mean}) / (COALESCE(review_count, 0) + #{prior_weight}))"
    # 평점 기여도(≈76~100)와 방문자 수 기여도(LOG, 최대 ≈150)를 비슷한 스케일로 맞춤
    base_score   = "(#{bayes_rating} * 20 + LOG(COALESCE(visitor_review_count, 0) + 1) * 20)"
    # 인기순: 점수 기반이지만 ±50점 jitter → 상위 그룹 내에서 매번 다른 순서
    popular_jitter  = Arel.sql("(#{base_score} + random() * 50) DESC")
    # 추천순: jitter 폭을 넓혀 품질 하한선을 유지하면서 훨씬 다양한 결과 노출
    recommend_score = Arel.sql("(#{base_score} + random() * 180) DESC")

    scope = case params[:sort]
            when "popular"   then scope.order(popular_jitter)
            when "recommend" then scope.order(recommend_score)
            when "rating"    then scope.order(rating: :desc, visitor_review_count: :desc)
            when "recent"    then scope.order(created_at: :desc)
            when "name"      then scope.order(name: :asc)
            when "daily"     then scope.order(Arel.sql("md5(naver_place_id || CURRENT_DATE::text)"))
            else                  scope.order(recommend_score)
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

  # GET /places/markers  — 지도용 경량 마커 목록 (좌표 있는 전량, 페이지네이션 없음)
  def markers
    scope = Place.where.not(latitude: nil).where.not(longitude: nil)

    if params[:category].present?
      cats = Array(params[:category]).reject(&:blank?)
      scope = scope.where("app_category && ARRAY[?]::varchar[]", cats) if cats.any?
    end

    places = scope.select(:id, :name, :latitude, :longitude, :app_category, :thumbnail, :road_address, :address)

    render json: {
      status: { code: 200 },
      data: places.map { |p|
        {
          id: p.id,
          name: p.name,
          latitude: p.latitude.to_f,
          longitude: p.longitude.to_f,
          app_category: p.app_category,
          thumbnail: p.thumbnail,
          road_address: p.road_address || p.address,
        }
      }
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
      :rating, :review_count, :price_range, :open_hours,
      :gender_type, :sauna_type, :room_count,
      :sauna_temp, :hot_bath_temp, :cold_bath_temp,
      :pool_info, :age_restriction, :admission_fee,
      :is_24hours, :membership_available, :has_restaurant,
      :has_sleep_room, :has_massage, :has_gym, :kids_facility,
      :parking_count,
      app_category: [], bath_types: [], special_rooms: [], amenities: [], tags: [],
      price_tiers: {}
    )
  end
end
