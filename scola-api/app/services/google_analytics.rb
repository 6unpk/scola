module GoogleAnalytics
  SCOPE = "https://www.googleapis.com/auth/analytics.readonly".freeze
  ENV_KEY = "GA4_PROPERTY_ID".freeze

  module_function

  def report(key, days:, shift: 0, dimensions: [], metrics:, limit: 1000, filter: nil)
    finish = Time.zone.today - (shift * days)
    start = finish - days + 1
    GoogleApi.fetch("ga/#{key}/#{days}/#{shift}", ENV_KEY) do
      body = {
        dateRanges: [{ startDate: start.iso8601, endDate: finish.iso8601 }],
        dimensions: dimensions.map { |name| { name: name } },
        metrics: metrics.map { |name| { name: name } },
        limit: limit
      }
      body[:dimensionFilter] = filter if filter
      url = "https://analyticsdata.googleapis.com/v1beta/properties/#{ENV.fetch(ENV_KEY)}:runReport"
      parse(GoogleApi.post(url, SCOPE, body), dimensions, metrics)
    end
  end

  def parse(json, dimensions, metrics)
    Array(json["rows"]).map do |row|
      dims = dimensions.zip(row["dimensionValues"].map { |v| v["value"] }).to_h
      values = metrics.zip(row["metricValues"].map { |v| v["value"].to_f }).to_h
      dims.merge(values)
    end
  end

  def users(days, shift: 0)
    report("users", days: days, shift: shift, metrics: %w[activeUsers sessions])
  end

  def daily_users(days)
    result = report("daily_users", days: days, dimensions: %w[date], metrics: %w[activeUsers])
    counts = result.rows.to_h { |row| [Date.strptime(row["date"], "%Y%m%d"), row["activeUsers"].to_i] }
    [AdminMetrics.fill(counts, days), result]
  end

  def sources(days)
    result = report("sources", days: days, dimensions: %w[sessionSource], metrics: %w[sessions activeUsers])
    rows = result.rows.group_by { |row| source_label(row["sessionSource"]) }.map do |label, group|
      { "source" => label, "sessions" => group.sum { |r| r["sessions"] }.to_i, "users" => group.sum { |r| r["activeUsers"] }.to_i }
    end
    GoogleApi::Result.new(rows.sort_by { |row| -row["sessions"] }, result.error)
  end

  def source_label(source)
    case source.to_s
    when /naver/i then "네이버"
    when /google/i then "구글"
    when /instagram/i then "인스타그램"
    when /\(direct\)/ then "직접"
    else "기타"
    end
  end

  def views_by_post(days)
    result = report("post_views", days: days, dimensions: %w[pagePath], metrics: %w[screenPageViews], limit: 5000,
                    filter: path_filter("BEGINS_WITH", "/posts/"))
    result.rows.to_h { |row| [row["pagePath"].delete_prefix("/posts/").chomp("/"), row["screenPageViews"].to_i] }
  end

  def page_views(path, days)
    report("page_views/#{path}", days: days, dimensions: %w[pagePath], metrics: %w[screenPageViews activeUsers],
           filter: path_filter("EXACT", path))
  end

  def path_filter(match_type, value)
    { filter: { fieldName: "pagePath", stringFilter: { matchType: match_type, value: value } } }
  end
end
