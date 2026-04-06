namespace :places do
  desc "네이버 지도 스크래핑 결과 JSON을 places 테이블에 import"
  task :import, [:file] => :environment do |_, args|
    file = args[:file] || ENV["FILE"] || Rails.root.join("../navermap-scraper/사우나_results.json").to_s

    unless File.exist?(file)
      puts "파일 없음: #{file}"
      exit 1
    end

    data = JSON.parse(File.read(file))
    puts "총 #{data.size}개 로드"

    inserted = 0
    skipped  = 0
    failed   = 0

    data.each do |item|
      next if item["place_id"].blank?

      attrs = {
        naver_place_id:        item["place_id"],
        name:                  item["name"],
        naver_category:        item["category"],
        search_keyword:        item["search_keyword"],
        address:               item["address"],
        road_address:          item["road_address"],
        phone:                 item["phone"],
        homepage:              item["homepage"],
        description:           item["description"],
        thumbnail:             item["thumbnail"],
        longitude:             item["x"],
        latitude:              item["y"],
        business_hours:        item["business_hours"],
        business_hours_detail: item["business_hours_detail"] || [],
        visitor_review_count:  item["visitor_review_count"],
        blog_review_count:     item["blog_review_count"],
        admission_fee:         item["admission_fee"],
        price_info:            item["price_info"] || [],
        price_tiers:           item["price_tiers"] || {},
        parking:               item["parking"],
        parking_count:         item["parking_count"],
        gender_type:           item["gender_type"],
        age_restriction:       item["age_restriction"],
        sauna_type:            item["sauna_type"],
        room_count:            item["room_count"],
        sauna_temp:            item["sauna_temp"],
        hot_bath_temp:         item["hot_bath_temp"],
        cold_bath_temp:        item["cold_bath_temp"],
        bath_types:            item["bath_types"] || [],
        special_rooms:         item["special_rooms"] || [],
        amenities:             item["amenities"] || [],
        pool_info:             item["pool_info"],
        is_24hours:            item["is_24hours"],
        membership_available:  item["membership_available"],
        has_restaurant:        item["has_restaurant"],
        has_sleep_room:        item["has_sleep_room"],
        has_massage:           item["has_massage"],
        has_gym:               item["has_gym"],
        kids_facility:         item["kids_facility"],
      }

      result = Place.upsert(attrs, unique_by: :naver_place_id)
      if result.rows.any?
        inserted += 1
      else
        skipped += 1
      end
    rescue => e
      failed += 1
      puts "  오류 (#{item['place_id']}): #{e.message}"
    end

    puts "완료 — 삽입: #{inserted}, 스킵: #{skipped}, 오류: #{failed}"
  end
end
