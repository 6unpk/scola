ActiveAdmin.register Place do
  menu label: '장소', priority: 9

  permit_params :naver_place_id,
                :name, :road_address, :naver_category,
                :address, :phone, :homepage, :business_hours, :description,
                :visitor_review_count, :blog_review_count,
                :thumbnail,
                :gender_type, :sauna_type,
                :open_hours, :admission_fee, :rating, :review_count,
                :room_count, :sauna_temp, :hot_bath_temp, :cold_bath_temp,
                :pool_info, :age_restriction,
                :is_24hours, :membership_available, :has_restaurant,
                :has_sleep_room, :has_massage, :has_gym, :kids_facility,
                :parking_count,
                :bath_types, :special_rooms, :amenities, :tags,
                app_category: []

  # ── 목록 ─────────────────────────────────────────────��────────────────────
  index do
    selectable_column
    id_column
    column :name
    column :road_address
    column(:카테고리) { |p| p.app_category&.join(', ') }
    column :gender_type
    column :sauna_type
    column :is_24hours
    column(:리뷰, sortable: :visitor_review_count) { |p| p.visitor_review_count }
    column(:조회수, sortable: :views) { |p| number_with_delimiter(p.views) }
    column(:썸네일) { |p| image_tag(p.thumbnail, height: 40, loading: 'lazy') if p.thumbnail.present? }
    column(:수정일, sortable: :updated_at) { |p| p.updated_at.strftime('%Y-%m-%d') }
    actions
  end

  # ── 필터 ─────────────��────────────────────────────────────────────────────
  filter :name_cont, label: '이름'
  filter :road_address_cont, label: '주소'
  filter :with_category, as: :select,
         collection: Place::CATEGORIES.invert.to_a,
         label: '카테고리'
  filter :gender_type, as: :select, collection: ['남성전용', '여성전용', '남녀공용']
  filter :is_24hours
  filter :has_restaurant
  filter :has_sleep_room
  filter :has_massage
  filter :has_gym

  # ── 상세 ─────────────────────��──────────────────────────────���─────────────
  show do
    attributes_table do
      row :name
      row :naver_place_id
      row :naver_category
      row :road_address
      row :address
      row :phone
      row :homepage
      row :business_hours
      row :description
      row :visitor_review_count
      row :blog_review_count
      row :admission_fee
      row :price_info
    end

    panel '앱 분류 (수동 입력)' do
      attributes_table_for place do
        row :app_category
        row :gender_type
        row :sauna_type
        row :open_hours
        row :rating
        row :review_count
        row :is_24hours
        row :membership_available
        row :has_restaurant
        row :has_sleep_room
        row :has_massage
        row :has_gym
        row :kids_facility
        row :room_count
        row :sauna_temp
        row :hot_bath_temp
        row :cold_bath_temp
        row :bath_types
        row :special_rooms
        row :amenities
        row :pool_info
        row :age_restriction
        row :parking_count
      end
    end

    summary = place.review_summary.to_h
    if summary.present?
      panel '리뷰 분석' do
        sentiment = summary['sentiment_breakdown'].to_h
        attributes_table_for place do
          row('긍정 / 중립 / 부정') { "#{sentiment['positive']}% / #{sentiment['neutral']}% / #{sentiment['negative']}%" }
          row('요약') { summary['overall'] }
          row('좋은 점') { Array(summary['pros']).join(', ') }
          row('아쉬운 점') { Array(summary['cons']).join(', ') }
          row('키워드') { Array(summary['keywords']).join(', ') }
        end
      end
    end

    panel '최근 90일 일별 리드 클릭' do
      text_node line_chart(AdminMetrics.by_day(AdminMetrics.leads.where(place_id: place.id), 90), height: '200px')
    end

    columns do
      column do
        panel 'GA 조회수 (최근 28일)' do
          views = GoogleAnalytics.page_views("/place/#{place.id}", AdminMetrics::DEFAULT_PERIOD)
          if views.ok?
            row = views.rows.first
            para "조회 #{row&.fetch('screenPageViews', 0).to_i}회, 방문자 #{row&.fetch('activeUsers', 0).to_i}명"
          else
            para views.error
          end
        end
      end
      column do
        panel '이 장소로 들어온 구글 검색어 (최근 28일)' do
          queries = SearchConsole.page_queries("/place/#{place.id}", AdminMetrics::DEFAULT_PERIOD)
          if queries.rows.any?
            table_for queries.rows do
              column('검색어') { |row| row['query'] }
              column('클릭') { |row| row['clicks'].to_i }
              column('노출') { |row| row['impressions'].to_i }
              column('평균 순위') { |row| row['position'].round(1) }
            end
          else
            para queries.error || '기록된 검색어가 없습니다.'
          end
        end
      end
    end
  end

  # ── 편집 폼 ─────────────────────────────────────────────────────────��─────
  form do |f|
    f.inputs '네이버 기본 정보' do
      f.input :naver_place_id, hint: '유니크 값이라 중복이면 저장이 실패해요.'
      f.input :name
      f.input :road_address
      f.input :address
      f.input :phone
      f.input :homepage
      f.input :naver_category
      f.input :business_hours
      f.input :description, as: :text
      f.input :visitor_review_count
      f.input :blog_review_count
      f.input :admission_fee
      f.input :thumbnail, hint: '이미지 URL(대표 썸네일)'
    end

    f.inputs '앱 분류' do
      f.input :app_category, as: :check_boxes,
              collection: Place::CATEGORIES.invert.to_a,
              label: '카테고리 (복수 선택 가능)'
      f.input :gender_type, as: :select,
              collection: ['남성전용', '여성전용', '남녀공용'],
              include_blank: '-- 선택 --'
      f.input :open_hours, placeholder: '예: 24시간 / 06:00 - 23:00'
      f.input :rating, as: :number, step: 0.1, min: 0, max: 5
      f.input :review_count
    end

    f.inputs '사우나 스펙' do
      f.input :sauna_type, as: :select,
              collection: ['건식', '습식', '건식+습식'],
              include_blank: '-- 선택 --'
      f.input :room_count
      f.input :sauna_temp, placeholder: '예: 80~100°C'
      f.input :hot_bath_temp, placeholder: '예: 42°C'
      f.input :cold_bath_temp, placeholder: '예: 15°C'
      f.input :pool_info
      f.input :age_restriction
      f.input :parking_count
    end

    f.inputs '탕 종류 (쉼표 구분)' do
      f.input :bath_types, as: :string,
              input_html: { value: f.object.bath_types&.join(', ') },
              hint: '예: 온탕, 냉탕, 노천탕'
    end

    f.inputs '특수 시설 (쉼표 구분)' do
      f.input :special_rooms, as: :string,
              input_html: { value: f.object.special_rooms&.join(', ') },
              hint: '예: 소금방, 황토방, 숯가마'
    end

    f.inputs '편의시설 (쉼표 구분)' do
      f.input :amenities, as: :string,
              input_html: { value: f.object.amenities&.join(', ') },
              hint: '예: 식당, 수면실, 헬스장'
    end

    f.inputs '태그 (쉼표 구분)' do
      f.input :tags, as: :string,
              input_html: { value: f.object.tags&.join(', ') },
              hint: '예: 불한증막, 프리미엄, 루프탑'
    end

    f.inputs '운영 조건' do
      f.input :is_24hours
      f.input :membership_available
      f.input :has_restaurant
      f.input :has_sleep_room
      f.input :has_massage
      f.input :has_gym
      f.input :kids_facility
    end

    f.actions
  end

  # 쉼표 구분 문자열 -> 배열 변환
  before_save do |place|
    %i[bath_types special_rooms amenities tags].each do |field|
      val = params[:place][field]
      if val.is_a?(String)
        place.send(:"#{field}=", val.split(',').map(&:strip).reject(&:empty?))
      end
    end
  end

end
