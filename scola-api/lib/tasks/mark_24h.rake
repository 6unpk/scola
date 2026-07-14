namespace :places do
  desc '이름에 24가 들어간 장소를 is_24hours=true로 설정 (DRY_RUN=1 로 미리보기)'
  task mark_24h_by_name: :environment do
    scope = Place.where("name ILIKE ?", "%24%")
    targets = scope.where("is_24hours IS DISTINCT FROM true")

    puts "이름 매칭: #{scope.count}곳 / 갱신 대상(아직 true 아님): #{targets.count}곳"

    if ENV["DRY_RUN"] == "1"
      targets.limit(50).each { |p| puts "  - #{p.name}" }
      puts "[DRY_RUN] 변경 없음"
    else
      updated = targets.update_all(is_24hours: true, updated_at: Time.current)
      puts "갱신 완료: #{updated}곳"
    end
  end
end
