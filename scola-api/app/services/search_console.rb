require "erb"

module SearchConsole
  SCOPE = "https://www.googleapis.com/auth/webmasters.readonly".freeze
  ENV_KEY = "GSC_SITE_URL".freeze
  SITE = "https://scola.kr".freeze
  DATA_LAG_DAYS = 3
  LOW_CTR_MIN_IMPRESSIONS = 100
  LOW_CTR_MAX = 0.03
  STRIKING_POSITIONS = (11.0..20.0)
  PAGE_GROUPS = { "콘텐츠" => %r{\A/(posts|guide|about)?(/|\z)}, "지역" => %r{\A/sauna}, "장소" => %r{\A/place/} }.freeze

  module_function

  def report(key, days:, shift: 0, dimensions: [], limit: 1000, filters: nil)
    finish = Time.zone.today - DATA_LAG_DAYS - (shift * days)
    start = finish - days + 1
    GoogleApi.fetch("gsc/#{key}/#{days}/#{shift}", ENV_KEY) do
      body = { startDate: start.iso8601, endDate: finish.iso8601, dimensions: dimensions, rowLimit: limit }
      body[:dimensionFilterGroups] = [{ filters: filters }] if filters
      site = ERB::Util.url_encode(ENV.fetch(ENV_KEY))
      url = "https://www.googleapis.com/webmasters/v3/sites/#{site}/searchAnalytics/query"
      parse(GoogleApi.post(url, SCOPE, body), dimensions)
    end
  end

  def parse(json, dimensions)
    Array(json["rows"]).map do |row|
      dimensions.zip(row.fetch("keys", [])).to_h.merge(row.slice("clicks", "impressions", "ctr", "position"))
    end
  end

  def totals(days, shift: 0)
    report("totals", days: days, shift: shift)
  end

  def queries(days, shift: 0)
    report("queries", days: days, shift: shift, dimensions: %w[query])
  end

  def queries_with_change(days)
    current = queries(days)
    previous = queries(days, shift: 1).rows.to_h { |row| [row["query"], row] }
    rows = current.rows.map do |row|
      row.merge("clicks_change" => row["clicks"] - previous.dig(row["query"], "clicks").to_i)
    end
    GoogleApi::Result.new(rows, current.error)
  end

  def low_ctr(rows)
    rows.select { |row| row["impressions"] >= LOW_CTR_MIN_IMPRESSIONS && row["ctr"] < LOW_CTR_MAX }
        .sort_by { |row| -row["impressions"] }
  end

  def pages(days)
    report("pages", days: days, dimensions: %w[page], limit: 5000)
  end

  def striking_pages(rows)
    rows.select { |row| STRIKING_POSITIONS.cover?(row["position"]) }.sort_by { |row| -row["impressions"] }
  end

  def path(url)
    URI(url).path.then { |value| value.empty? ? "/" : value }
  end

  def daily_by_group(days)
    result = report("daily_pages", days: days, dimensions: %w[date page], limit: 25_000)
    groups = PAGE_GROUPS.keys.to_h { |name| [name, Hash.new(0)] }
    result.rows.each do |row|
      name = PAGE_GROUPS.find { |_, pattern| pattern.match?(path(row["page"])) }&.first
      groups[name][Date.iso8601(row["date"])] += row["clicks"].to_i if name
    end
    [groups.map { |name, data| { name: name, data: data.sort.to_h } }, result]
  end

  def by_post(days)
    result = report("post_pages", days: days, dimensions: %w[page], limit: 5000,
                    filters: [{ dimension: "page", operator: "contains", expression: "/posts/" }])
    result.rows.to_h { |row| [path(row["page"]).delete_prefix("/posts/").chomp("/"), row] }
  end

  def low_ctr_post_slugs(days = AdminMetrics::DEFAULT_PERIOD)
    low_ctr(by_post(days).map { |slug, row| row.merge("slug" => slug) }).map { |row| row["slug"] }
  end

  def page_queries(path, days)
    report("page_queries/#{path}", days: days, dimensions: %w[query], limit: 20,
           filters: [{ dimension: "page", operator: "equals", expression: "#{SITE}#{path}" }])
  end
end
