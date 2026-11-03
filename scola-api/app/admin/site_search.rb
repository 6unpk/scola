ActiveAdmin.register_page "Site Search" do
  menu priority: 3, label: "사이트 내 검색"

  content title: "사이트 내 검색" do
    days = AdminMetrics.days(params[:days])
    current = SearchDaily.within(days).group(:term)
    now = current.sum(:count)
    before = SearchDaily.within(days, shift: 1).group(:term).sum(:count)
    zero = current.sum(:zero_count).select { |_, count| count.positive? }
    finish = Time.zone.today

    text_node admin_period_links(days)
    text_node admin_kpis([
      ["검색 수", number_with_delimiter(now.values.sum), AdminMetrics.delta(now.values.sum, before.values.sum)],
      ["검색어 종류", number_with_delimiter(now.size), AdminMetrics.delta(now.size, before.size)],
      ["결과 0건 검색", number_with_delimiter(zero.values.sum), nil],
    ])

    panel "일별 검색량" do
      counts = SearchDaily.where(date: (finish - days + 1)..finish).group(:date).sum(:count)
      text_node line_chart(AdminMetrics.fill(counts, days), height: "220px")
    end

    columns do
      column do
        panel "인기 검색어" do
          table_for now.sort_by { |_, count| -count }.first(30) do
            column("검색어") { |term, _| term }
            column("횟수") { |_, count| count }
          end
        end
      end
      column do
        panel "급상승 검색어" do
          rising = now.map { |term, count| [term, count, count - before.fetch(term, 0)] }
                      .select { |_, _, change| change.positive? }
                      .sort_by { |_, _, change| -change }.first(30)
          table_for rising do
            column("검색어") { |term, _, _| term }
            column("횟수") { |_, count, _| count }
            column("직전 대비") { |_, _, change| format("%+d", change) }
          end
        end
      end
      column do
        panel "결과 0건 검색어" do
          table_for zero.sort_by { |_, count| -count }.first(30) do
            column("검색어") { |term, _| term }
            column("횟수") { |_, count| count }
          end
        end
      end
    end

    panel "누적 인기 검색어 (일별 수집 이전 포함)" do
      table_for SearchQuery.order(count: :desc).limit(30) do
        column("검색어") { |query| query.term }
        column("횟수") { |query| number_with_delimiter(query.count) }
      end
    end
  end
end
