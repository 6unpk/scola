require "test_helper"
require "minitest/mock"

class AdminPagesTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  PAGES = %w[/admin /admin/traffic /admin/site_search /admin/statistics /admin/data_quality?check=short_description
             /admin/data_quality /admin/reviews /admin/users /admin/places /admin/posts /admin/place_suggestions].freeze

  setup do
    @admin = User.create!(email: "admin@example.com", password: "password123", name: "a", admin: true)
    @place = Place.create!(name: "테스트탕", naver_place_id: "p-1", description: "굿", app_category: ["sauna"],
                           road_address: "서울 중구 1", review_summary: { "overall" => "좋음", "sentiment_breakdown" => { "positive" => 90 } })
    Place.create!(name: "온전한탕", naver_place_id: "p-2", description: "충분히 길게 적은 장소 설명입니다", thumbnail: "https://img.scola.kr/a.jpg", phone: "02")
    PlaceEvent.create!(place: @place, event_type: "call")
    PlaceEvent.create!(place: @place, event_type: "share")
    Review.create!(place: @place, rating: 5, author_name: "손님", body: "좋아요")
    @post = Post.create!(title: "글", slug: "test-post", body: "본문", published: true, published_at: 3.days.ago)
    SearchDaily.record("서울 사우나", zero: false)
    SearchDaily.record("없는말", zero: true)
    post "/admin_auth/sign_in", params: { admin_user_user: { email: @admin.email, password: "password123" } }
  end

  def with_google_env
    env = { "GOOGLE_SERVICE_ACCOUNT_JSON" => "{}", "GA4_PROPERTY_ID" => "1", "GSC_SITE_URL" => "sc-domain:scola.kr" }
    env.each { |key, value| ENV[key] = value }
    yield
  ensure
    env.each_key { |key| ENV.delete(key) }
  end

  def fake_google(url, _scope, body)
    if url.include?("analyticsdata")
      dimensions = body[:dimensions].map { |d| d[:name] }
      keys = { "date" => Date.current.strftime("%Y%m%d"), "sessionSource" => "m.search.naver.com", "pagePath" => "/posts/test-post" }
      { "rows" => [{ "dimensionValues" => dimensions.map { |d| { "value" => keys[d] } },
                     "metricValues" => body[:metrics].map { { "value" => "42" } } }] }
    else
      keys = { "query" => "서울 사우나", "page" => "https://scola.kr/posts/test-post", "date" => Date.current.iso8601 }
      { "rows" => [{ "keys" => body[:dimensions].map { |d| keys[d] }, "clicks" => 3.0, "impressions" => 500.0, "ctr" => 0.006, "position" => 14.2 }] }
    end
  end

  test "every page renders without google configured" do
    PAGES.each do |path|
      get path
      assert_response :success, path
    end
    get "/admin/places/#{@place.id}"
    assert_response :success
    assert_includes response.body, "리뷰 분석"
  end

  test "every page renders with google data" do
    with_google_env do
      GoogleApi.stub(:post, method(:fake_google)) do
        (PAGES + ["/admin/places/#{@place.id}", "/admin/posts?scope=ctr"]).each do |path|
          get path
          assert_response :success, path
        end
        get "/admin/traffic"
        assert_includes response.body, "네이버"
        assert_includes response.body, "서울 사우나"
        assert_includes response.body, "/posts/test-post"
      end
    end
  end

  test "pages survive google failure" do
    with_google_env do
      GoogleApi.stub(:post, ->(*) { raise "HTTP 403" }) do
        PAGES.each do |path|
          get path
          assert_response :success, path
        end
        get "/admin/traffic"
        assert_includes response.body, "데이터를 불러오지 못했습니다"
      end
    end
  end

  test "quality counts match direct sql" do
    get "/admin/data_quality?check=short_description"
    assert_includes response.body, "테스트탕"
    assert_equal 1, PlaceQuality.counts["short_description"]
    assert_equal Place.where("thumbnail IS NULL OR thumbnail = ''").count, PlaceQuality.counts["thumbnail"]
  end

  test "leads exclude share" do
    assert_equal 1, AdminMetrics.leads.count
  end

  test "category filter works on the array column" do
    get "/admin/places", params: { q: { with_category: "sauna" } }
    assert_response :success
    assert_includes response.body, "테스트탕"
    assert_not_includes response.body, "온전한탕"
  end
end
