namespace :places do
  desc "이름/네이버 카테고리 기반으로 app_category 자동 매핑"
  # 실행: bundle exec rails places:auto_categorize
  # 옵션: DRY_RUN=1 bundle exec rails places:auto_categorize
  task auto_categorize: :environment do
    dry_run = ENV['DRY_RUN'] == '1'
    puts dry_run ? "[DRY RUN] 변경 없이 결과만 출력" : "app_category 자동 매핑 시작"

    RULES = [
      { category: 'sauna',      keywords: ['사우나', '온천', '목욕탕', '대중탕', '목욕', '해수탕', '황토탕', '탕'] },
      { category: 'jjimjilbang', keywords: ['찜질방', '찜질', '한증막', '불가마', '한증', '황토방', '불한증'] },
      { category: 'spa',        keywords: ['스파', 'spa', '테르메', '워터스파'] },
      { category: 'seshin',     keywords: ['세신', '때밀이'] },
      { category: 'hotel',      keywords: ['호텔', 'hotel'] },
      { category: 'waterpark',  keywords: ['워터파크', '물놀이', '워터월드', '아쿠아'] },
    ]

    updated = 0
    skipped = 0

    Place.find_each do |place|
      text = [place.name, place.naver_category, place.search_keyword].compact.join(' ').downcase

      new_cats = RULES.each_with_object([]) do |rule, arr|
        arr << rule[:category] if rule[:keywords].any? { |kw| text.include?(kw) }
      end

      next if new_cats.empty?

      existing = (place.app_category || []).compact.reject(&:blank?)
      merged = (existing + new_cats).uniq
      if merged.sort == existing.sort
        skipped += 1
        next
      end

      unless dry_run
        place.update_columns(app_category: merged)
      end

      updated += 1
      puts "  #{place.name}: #{place.app_category&.inspect} → #{merged.inspect}" if dry_run
    end

    puts "\n완료: #{updated}개 업데이트 (스킵 #{skipped}개)"
  end
end
