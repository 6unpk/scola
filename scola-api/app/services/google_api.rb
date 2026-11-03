require "net/http"
require "stringio"
require "googleauth"

module GoogleApi
  Result = Struct.new(:rows, :error) do
    def ok?
      error.nil?
    end
  end

  CACHE_TTL = 1.hour
  NOT_CONFIGURED = "GA4, Search Console 연동 전입니다.".freeze

  module_function

  def configured?(*env_keys)
    ["GOOGLE_SERVICE_ACCOUNT_JSON", *env_keys].all? { |key| ENV[key].present? }
  end

  def fetch(key, *env_keys)
    return Result.new([], NOT_CONFIGURED) unless configured?(*env_keys)

    rows = Rails.cache.fetch("google_api/#{key}", expires_in: CACHE_TTL) { yield }
    Result.new(rows, nil)
  rescue StandardError => e
    Rails.logger.error("GoogleApi #{key}: #{e.class} #{e.message}")
    Result.new([], "데이터를 불러오지 못했습니다. (#{e.class})")
  end

  def post(url, scope, body)
    uri = URI(url)
    request = Net::HTTP::Post.new(uri, "Content-Type" => "application/json", "Authorization" => "Bearer #{token(scope)}")
    request.body = body.to_json
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 5, read_timeout: 15) { |http| http.request(request) }
    raise "HTTP #{response.code}: #{response.body.to_s[0, 300]}" unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body)
  end

  def token(scope)
    Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: StringIO.new(ENV.fetch("GOOGLE_SERVICE_ACCOUNT_JSON")),
      scope: scope
    ).fetch_access_token!.fetch("access_token")
  end
end
