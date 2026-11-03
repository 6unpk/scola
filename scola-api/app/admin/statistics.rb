ActiveAdmin.register_page "Statistics" do
  menu priority: 4, label: "장소 분석"

  content title: "장소 분석" do
    days = AdminMetrics.days(params[:days])
    current = AdminMetrics.current(days)
    previous = AdminMetrics.previous(days)
    leads = AdminMetrics.leads.where(created_at: current)
    now = leads.group(:event_type).count
    before = AdminMetrics.leads.where(created_at: previous).group(:event_type).count
    labels = { "call" => "전화", "naver_map" => "길찾기", "homepage" => "홈페이지" }

    pivot = Hash.new { |hash, key| hash[key] = Hash.new(0) }
    leads.group(:place_id, :event_type).count.each do |(place_id, type), count|
      pivot[place_id][type] += count
      pivot[place_id][:total] += count
    end
    top_ids = pivot.sort_by { |_, row| -row[:total] }.first(20).map(&:first)
    places_by_id = Place.where(id: top_ids).index_by(&:id)

    text_node admin_period_links(days)
    text_node admin_kpis(
      [["리드 클릭 합계", number_with_delimiter(now.values.sum), AdminMetrics.delta(now.values.sum, before.values.sum)]] +
      labels.map { |type, label| [label, number_with_delimiter(now.fetch(type, 0)), AdminMetrics.delta(now.fetch(type, 0), before.fetch(type, 0))] } +
      [["공유", number_with_delimiter(PlaceEvent.where(event_type: "share", created_at: current).count), nil]]
    )

    panel "일별 리드 클릭" do
      series = labels.map { |type, label| { name: label, data: AdminMetrics.by_day(AdminMetrics.leads.where(event_type: type), days) } }
      text_node line_chart(series, height: "260px")
    end

    columns do
      column do
        panel "리드가 많은 장소 (제휴 영업 후보)" do
          if top_ids.any?
            table_for top_ids do
              column("장소") { |id| link_to(places_by_id[id]&.name || "##{id}", admin_place_path(id)) }
              column("전화") { |id| pivot[id]["call"] }
              column("길찾기") { |id| pivot[id]["naver_map"] }
              column("홈페이지") { |id| pivot[id]["homepage"] }
              column("합계") { |id| pivot[id][:total] }
            end
          else
            para "이 기간에 수집된 리드 클릭이 없습니다."
          end
        end
      end

      column do
        panel "지역별 리드 클릭" do
          regions = leads.joins(:place).group(Arel.sql("split_part(places.road_address, ' ', 1)")).count
          table_for regions.sort_by { |_, count| -count }.first(17) do
            column("지역") { |region, _| region.presence || "주소 없음" }
            column("클릭") { |_, count| number_with_delimiter(count) }
          end
        end

        panel "카테고리별 리드 클릭" do
          categories = leads.joins(:place).group(Arel.sql("unnest(places.app_category)")).count
          table_for categories.sort_by { |_, count| -count } do
            column("카테고리") { |category, _| Place::CATEGORIES[category] || category }
            column("클릭") { |_, count| number_with_delimiter(count) }
          end
        end
      end
    end

    columns do
      column do
        panel "누적 조회수 상위 장소" do
          table_for Place.order(views: :desc).limit(15) do
            column("장소") { |place| link_to(place.name, admin_place_path(place)) }
            column("조회수") { |place| number_with_delimiter(place.views) }
            column("방문자 리뷰") { |place| place.visitor_review_count }
          end
        end
      end

      column do
        panel "카테고리별 장소 수" do
          rows = ActiveRecord::Base.connection.select_rows(
            "SELECT cat, COUNT(*) AS cnt FROM (SELECT unnest(app_category) AS cat FROM places) s WHERE cat <> '' GROUP BY cat ORDER BY cnt DESC"
          )
          table_for rows do
            column("카테고리") { |row| Place::CATEGORIES[row[0]] || row[0] }
            column("개수") { |row| number_with_delimiter(row[1].to_i) }
          end
        end
      end
    end
  end
end
