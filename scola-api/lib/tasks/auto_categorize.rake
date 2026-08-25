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

    bath_name_re  = /목욕탕|대중탕|목욕관|해수탕|약수탕/
    other_name_re = /사우나|찜질|불가마|한증|스파|온천|아쿠아|워터|세신|호텔/

    Place.find_each do |place|
      name = place.name.to_s.downcase
      text = [place.name, place.naver_category, place.search_keyword].compact.join(' ').downcase
      existing = (place.app_category || []).compact.reject(&:blank?)

      if name.match?(bath_name_re) && !name.match?(other_name_re)
        target = ['bath']
      else
        computed = RULES.each_with_object([]) do |rule, arr|
          arr << rule[:category] if rule[:keywords].any? { |kw| text.include?(kw) }
        end
        computed << 'bath' if name.match?(bath_name_re)
        next if computed.empty?
        target = (existing + computed).uniq
      end

      if target.sort == existing.sort
        skipped += 1
        next
      end

      place.update_columns(app_category: target) unless dry_run
      updated += 1
      puts "  #{place.name}: #{existing.inspect} → #{target.inspect}" if dry_run
    end

    puts "\n완료: #{updated}개 업데이트 (스킵 #{skipped}개)"
  end
end
