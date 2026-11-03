ActiveAdmin.register_page "Data Quality" do
  menu priority: 5, label: "데이터 품질"

  content title: "데이터 품질" do
    counts = PlaceQuality.counts
    selected = PlaceQuality::CHECKS.key?(params[:check]) ? params[:check] : nil

    panel "항목별 건수 (전체 #{number_with_delimiter(Place.count)}곳)" do
      table_for counts.to_a do
        column("항목") { |key, _| link_to(PlaceQuality.label(key), admin_data_quality_path(check: key)) }
        column("건수") { |_, count| number_with_delimiter(count) }
      end
    end

    if selected
      panel PlaceQuality.label(selected) do
        places = PlaceQuality.scope(selected).order(visitor_review_count: :desc).page(params[:page]).per(50)
        paginated_collection(places, download_links: false) do
          table_for collection do
            column("장소") { |place| link_to(place.name, admin_place_path(place)) }
            column("주소") { |place| place.road_address }
            column("설명") { |place| place.description.to_s.truncate(40) }
            column("방문자 리뷰") { |place| place.visitor_review_count }
            column("") { |place| link_to("수정", edit_admin_place_path(place)) }
          end
        end
      end
    end
  end
end
