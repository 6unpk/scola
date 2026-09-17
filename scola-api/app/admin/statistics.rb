ActiveAdmin.register_page "Statistics" do
  menu priority: 2, label: "통계"

  content title: "통계" do
    month_start = Time.zone.now.beginning_of_month

    events_month = PlaceEvent.where("created_at >= ?", month_start).group(:event_type).count
    events_total = PlaceEvent.group(:event_type).count
    ev = ->(h, k) { h[k] || 0 }

    kpis = [
      ["장소 수", number_with_delimiter(Place.count)],
      ["회원/게스트 리뷰", number_with_delimiter(Review.count)],
      ["누적 조회수", number_with_delimiter(Place.sum(:views))],
      ["검토 대기 제보", number_with_delimiter(PlaceSuggestion.where(status: "pending").count)],
      ["전화 클릭 (이번 달 / 누적)", "#{ev.call(events_month, 'call')} / #{ev.call(events_total, 'call')}"],
      ["길찾기 클릭 (이번 달 / 누적)", "#{ev.call(events_month, 'naver_map')} / #{ev.call(events_total, 'naver_map')}"],
      ["홈페이지 클릭 (이번 달 / 누적)", "#{ev.call(events_month, 'homepage')} / #{ev.call(events_total, 'homepage')}"],
    ]

    pivot = Hash.new { |h, k| h[k] = Hash.new(0) }
    PlaceEvent.where("created_at >= ?", month_start).group(:place_id, :event_type).count.each do |(pid, type), n|
      pivot[pid][type] += n
      pivot[pid][:total] += n
    end
    top_ids = pivot.sort_by { |_, v| -v[:total] }.first(20).map(&:first)
    places_by_id = Place.where(id: top_ids).index_by(&:id)

    cat_labels = {
      "sauna" => "사우나", "bath" => "목욕탕", "jjimjilbang" => "찜질방", "spa" => "스파",
      "seshin" => "세신샵", "hotel" => "호텔", "waterpark" => "워터파크"
    }
    cat_rows = ActiveRecord::Base.connection.select_rows(
      "SELECT cat, COUNT(*) AS cnt FROM (SELECT unnest(app_category) AS cat FROM places) s WHERE cat <> '' GROUP BY cat ORDER BY cnt DESC"
    )

    columns do
      column do
        panel "핵심 지표" do
          table_for kpis do
            column("항목") { |r| r[0] }
            column("값") { |r| r[1] }
          end
        end

        panel "카테고리 분포" do
          table_for cat_rows do
            column("카테고리") { |r| cat_labels[r[0]] || r[0] }
            column("개수") { |r| number_with_delimiter(r[1].to_i) }
          end
        end
      end

      column do
        panel "아웃바운드 리드 · 이번 달 상위 장소" do
          if top_ids.any?
            table_for top_ids do
              column("장소") { |pid| link_to(places_by_id[pid]&.name || "##{pid}", admin_place_path(pid)) }
              column("전화") { |pid| pivot[pid]["call"] }
              column("길찾기") { |pid| pivot[pid]["naver_map"] }
              column("홈페이지") { |pid| pivot[pid]["homepage"] }
              column("합계") { |pid| pivot[pid][:total] }
            end
          else
            para "이번 달 수집된 아웃바운드 이벤트가 아직 없습니다. (배포 후 사용자 클릭이 쌓이면 표시됩니다)"
          end
        end

        panel "조회수 상위 장소" do
          table_for Place.order(views: :desc).limit(15) do
            column("장소") { |p| link_to(p.name, admin_place_path(p)) }
            column("조회수") { |p| number_with_delimiter(p.views) }
            column("리뷰") { |p| p.review_count }
            column("평점") { |p| p.rating }
          end
        end
      end
    end
  end
end
