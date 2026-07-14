namespace :places do
  desc "thumbnail_map.json의 R2 URL을 각 장소 thumbnail에 반영 (thumbnail만 갱신)"
  # 실행: bundle exec rails 'places:set_thumbnails[../navermap-scraper/thumbnail_map.json]'
  task :set_thumbnails, [:file] => :environment do |_, args|
    file = args[:file] || Rails.root.join("../navermap-scraper/thumbnail_map.json").to_s

    unless File.exist?(file)
      puts "파일 없음: #{file}"
      exit 1
    end

    data = JSON.parse(File.read(file))
    puts "매핑 #{data.size}건 로드"

    ok = miss = 0
    data.each do |item|
      pid = item["place_id"].to_s
      url = item["thumbnail"]
      place = Place.find_by(naver_place_id: pid)
      if place && url.present?
        place.update_columns(thumbnail: url)
        ok += 1
      else
        miss += 1
        puts "  [미매칭] naver_place_id=#{pid}"
      end
    end

    puts "완료 — thumbnail 갱신: #{ok}, 미매칭: #{miss}"
  end
end
