ActiveAdmin.register_page "Traffic" do
  menu priority: 2, label: "유입과 SEO"

  content title: "유입과 SEO" do
    days = AdminMetrics.days(params[:days])
    text_node admin_period_links(days)
    para "Search Console 수치는 집계 지연으로 #{SearchConsole::DATA_LAG_DAYS}일 전까지의 데이터입니다."

    columns do
      column do
        panel "유입원별 세션" do
          sources = GoogleAnalytics.sources(days)
          if sources.ok?
            table_for sources.rows do
              column("유입원") { |row| row["source"] }
              column("세션") { |row| number_with_delimiter(row["sessions"]) }
              column("방문자") { |row| number_with_delimiter(row["users"]) }
            end
          else
            para sources.error
          end
        end
      end
      column do
        panel "페이지 종류별 구글 클릭 (noindex 이후 추적)" do
          series, result = SearchConsole.daily_by_group(days)
          if result.ok?
            text_node line_chart(series, height: "240px")
          else
            para result.error
          end
        end
      end
    end

    queries = SearchConsole.queries_with_change(days)
    pages = SearchConsole.pages(days)

    panel "구글 검색어 상위 50" do
      if queries.ok?
        table_for queries.rows.first(50) do
          column("검색어") { |row| row["query"] }
          column("클릭") { |row| row["clicks"].to_i }
          column("직전 대비") { |row| format("%+d", row["clicks_change"]) }
          column("노출") { |row| number_with_delimiter(row["impressions"].to_i) }
          column("CTR") { |row| admin_percent(row["ctr"]) }
          column("평균 순위") { |row| row["position"].round(1) }
        end
      else
        para queries.error
      end
    end

    columns do
      column do
        panel "노출은 많은데 CTR이 낮은 검색어" do
          rows = SearchConsole.low_ctr(queries.rows).first(20)
          if rows.any?
            table_for rows do
              column("검색어") { |row| row["query"] }
              column("노출") { |row| number_with_delimiter(row["impressions"].to_i) }
              column("CTR") { |row| admin_percent(row["ctr"]) }
              column("평균 순위") { |row| row["position"].round(1) }
            end
          else
            para queries.error || "해당하는 검색어가 없습니다."
          end
        end
      end
      column do
        panel "11-20위에 걸린 페이지" do
          rows = SearchConsole.striking_pages(pages.rows).first(20)
          if rows.any?
            table_for rows do
              column("페이지") { |row| link_to(SearchConsole.path(row["page"]), row["page"], target: "_blank", rel: "noopener") }
              column("노출") { |row| number_with_delimiter(row["impressions"].to_i) }
              column("클릭") { |row| row["clicks"].to_i }
              column("평균 순위") { |row| row["position"].round(1) }
            end
          else
            para pages.error || "해당하는 페이지가 없습니다."
          end
        end
      end
    end
  end
end
