module AdminMetricsHelper
  def admin_period_links(days)
    links = AdminMetrics::PERIODS.map do |period|
      link_to("#{period}일", url_for(days: period), class: period == days ? "admin-period-active" : nil)
    end
    content_tag(:p, safe_join(links), class: "admin-period")
  end

  def admin_kpis(items)
    cards = items.map do |label, value, change|
      parts = [content_tag(:span, label, class: "admin-kpi-label"), content_tag(:strong, value)]
      unless change.nil?
        tone = change.negative? ? "admin-kpi-down" : "admin-kpi-up"
        parts << content_tag(:span, format("%+d%%", change), class: tone)
      end
      content_tag(:div, safe_join(parts), class: "admin-kpi")
    end
    content_tag(:div, safe_join(cards), class: "admin-kpis")
  end

  def admin_percent(ratio)
    number_to_percentage(ratio.to_f * 100, precision: 1)
  end
end
