namespace :places do
  desc "stats_map.json의 네이버 리뷰수(방문자/블로그)를 각 장소에 반영"
  # 실행: bundle exec rails 'places:update_stats[../navermap-scraper/stats_map.json]'
  task :update_stats, [:file] => :environment do |_, args|
    file = args[:file] || Rails.root.join("../navermap-scraper/stats_map.json").to_s

    unless File.exist?(file)
      puts "파일 없음: #{file}"
      exit 1
    end

    data = JSON.parse(File.read(file))
    puts "매핑 #{data.size}건 로드"

    ok = miss = 0
    data.each do |item|
      place = Place.find_by(naver_place_id: item["place_id"].to_s)
      unless place
        miss += 1
        next
      end
      updates = {}
      updates[:visitor_review_count] = item["visitor_review_count"] unless item["visitor_review_count"].nil?
      updates[:blog_review_count]    = item["blog_review_count"]    unless item["blog_review_count"].nil?
      place.update_columns(updates) if updates.any?
      ok += 1
    end

    puts "리뷰수 갱신: #{ok}곳, 미매칭: #{miss}"
  end
end
