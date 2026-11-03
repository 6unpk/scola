# frozen_string_literal: true
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    days = AdminMetrics.days(params[:days])
    current = AdminMetrics.current(days)
    previous = AdminMetrics.previous(days)
    metric = ->(row, key) { row&.fetch(key, 0).to_f }

    users_now = GoogleAnalytics.users(days)
    users_before = GoogleAnalytics.users(days, shift: 1).rows.first
    gsc_now = SearchConsole.totals(days)
    gsc_before = SearchConsole.totals(days, shift: 1).rows.first
    visitors = metric.call(users_now.rows.first, "activeUsers")
    clicks = metric.call(gsc_now.rows.first, "clicks")
    ctr = metric.call(gsc_now.rows.first, "ctr")
    leads_now = AdminMetrics.leads.where(created_at: current).count
    leads_before = AdminMetrics.leads.where(created_at: previous).count
    searches_now = SearchDaily.within(days).sum(:count)
    searches_before = SearchDaily.within(days, shift: 1).sum(:count)
    reviews_now = Review.where(created_at: current).count
    signups_now = User.where(created_at: current).count

    text_node admin_period_links(days)
    text_node admin_kpis([
      ["방문자", users_now.ok? ? number_with_delimiter(visitors.to_i) : "-", users_now.ok? ? AdminMetrics.delta(visitors, metric.call(users_before, "activeUsers")) : nil],
      ["구글 검색 클릭", gsc_now.ok? ? number_with_delimiter(clicks.to_i) : "-", gsc_now.ok? ? AdminMetrics.delta(clicks, metric.call(gsc_before, "clicks")) : nil],
      ["구글 평균 CTR", gsc_now.ok? ? admin_percent(ctr) : "-", gsc_now.ok? ? AdminMetrics.delta(ctr, metric.call(gsc_before, "ctr")) : nil],
      ["리드 클릭", number_with_delimiter(leads_now), AdminMetrics.delta(leads_now, leads_before)],
      ["사이트 내 검색", number_with_delimiter(searches_now), AdminMetrics.delta(searches_now, searches_before)],
      ["신규 리뷰", reviews_now, AdminMetrics.delta(reviews_now, Review.where(created_at: previous).count)],
      ["신규 가입", signups_now, AdminMetrics.delta(signups_now, User.where(created_at: previous).count)],
    ])
    para users_now.error unless users_now.ok?

    columns do
      column do
        panel "일별 리드 클릭" do
          text_node line_chart(AdminMetrics.by_day(AdminMetrics.leads, days), height: "220px")
        end
      end
      column do
        panel "일별 방문자" do
          daily_users, result = GoogleAnalytics.daily_users(days)
          if result.ok?
            text_node line_chart(daily_users, height: "220px")
          else
            para result.error
          end
        end
      end
    end

    columns do
      column do
        pending = PlaceSuggestion.where(status: "pending").includes(:place, :user).order(created_at: :desc)
        panel "검토 대기 제보 (#{pending.count}건)" do
          if pending.any?
            table_for pending.limit(10) do
              column("장소") { |s| link_to(s.place.name, admin_place_path(s.place)) }
              column("제보자") { |s| s.display_name }
              column("내용") do |s|
                s.payload.map { |k, v| "#{k}: #{Array(v).join(', ')}" }.join(" / ").truncate(60)
              end
              column("") { |s| link_to("검토", admin_place_suggestion_path(s)) }
            end
            para link_to("전체 제보 보기", admin_place_suggestions_path)
          else
            para "검토할 제보가 없습니다."
          end
        end

        panel "신규 리뷰" do
          recent = Review.includes(:place, :user).order(created_at: :desc).limit(5)
          if recent.any?
            table_for recent do
              column("장소") { |r| link_to(r.place.name, admin_place_path(r.place)) }
              column("작성자") { |r| r.display_name }
              column("별점") { |r| r.rating }
              column("작성일") { |r| r.created_at.strftime("%Y-%m-%d") }
            end
            para link_to("전체 리뷰 보기", admin_reviews_path)
          else
            para "리뷰가 없습니다."
          end
        end
      end

      column do
        panel "결과 0건 검색어" do
          zero_terms = SearchDaily.within(days).where("zero_count > 0").group(:term).order(Arel.sql("SUM(zero_count) DESC")).limit(10).sum(:zero_count)
          if zero_terms.any?
            table_for zero_terms.to_a do
              column("검색어") { |term, _| term }
              column("횟수") { |_, count| count }
            end
            para link_to("검색 분석 보기", admin_site_search_path)
          else
            para "기록된 0건 검색이 없습니다."
          end
        end

        panel "데이터 상태" do
          quality = PlaceQuality.counts
          synced_at = Place.maximum(:stats_refreshed_at)
          table_for [
            ["네이버 통계 동기화", synced_at ? "#{(Time.zone.today - synced_at.to_date).to_i}일 전" : "기록 없음"],
            ["설명이 없거나 지나치게 짧음", quality["description"] + quality["short_description"]],
            ["썸네일 없음", quality["thumbnail"]],
            ["AI 분석 없음", quality["no_profile"]],
          ] do
            column("항목") { |row| row[0] }
            column("값") { |row| row[1] }
          end
          para link_to("데이터 품질 보기", admin_data_quality_path)
        end
      end
    end
  end
end
