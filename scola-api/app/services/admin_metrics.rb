module AdminMetrics
  PERIODS = [7, 28, 90].freeze
  DEFAULT_PERIOD = 28
  LEAD_TYPES = %w[call naver_map homepage].freeze
  LOCAL_DATE_SQL = "DATE(%s AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')".freeze

  module_function

  def days(value)
    PERIODS.include?(value.to_i) ? value.to_i : DEFAULT_PERIOD
  end

  def current(days)
    (days - 1).days.ago.beginning_of_day..Time.current
  end

  def previous(days)
    start = current(days).begin
    (start - days.days)...start
  end

  def delta(cur, prev)
    return nil if prev.to_f.zero?

    ((cur - prev) * 100.0 / prev).round
  end

  def leads
    PlaceEvent.where(event_type: LEAD_TYPES)
  end

  def by_day(relation, days, column: "created_at")
    fill(relation.where(column => current(days)).group(Arel.sql(format(LOCAL_DATE_SQL, column))).count, days)
  end

  def fill(counts, days)
    today = Time.zone.today
    ((today - days + 1)..today).to_h { |date| [date, counts[date] || 0] }
  end
end
