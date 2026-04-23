namespace :import do
  desc "enriched_results.json에서 place_profile + review_summary 업데이트"
  # 실행: bundle exec rails import:enriched[../navermap-scraper/enriched_results.json]
  task :enriched, [:file] => :environment do |_, args|
    file_path = args[:file] || Rails.root.join("../navermap-scraper/enriched_results.json")
    data = JSON.parse(File.read(file_path))

    ok = skip = 0

    data.each do |item|
      place = Place.find_by(naver_place_id: item["place_id"].to_s)
      unless place
        puts "  [없음] #{item['name']}"
        next
      end

      profile        = item["place_profile"]
      review_summary = item["review_summary"]

      next unless profile.present? || review_summary.present?

      updates = {}
      updates[:place_profile]    = profile        if profile.present?
      updates[:review_summary]   = review_summary if review_summary.present?
      updates[:description]      = profile["summary"] if place.description.blank? && profile&.dig("summary").present?

      place.update_columns(updates)
      ok += 1
      puts "  [ok] #{place.name}"
    end

    puts "\n완료: #{ok}개 업데이트 (스킵 #{data.size - ok}개)"
  end
end
