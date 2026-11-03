require "test_helper"

class SearchRecordingTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup { Place.create!(name: "서울탕", naver_place_id: "s-1", road_address: "서울 중구 1") }

  test "repeat search increments count" do
    2.times { get "/places", params: { q: "서울탕", page: 1 } }
    assert_equal 2, SearchDaily.find_by(term: "서울탕").count
    assert_equal 0, SearchDaily.find_by(term: "서울탕").zero_count
  end

  test "zero result search increments zero_count" do
    get "/places", params: { q: "없는찜질방" }
    assert_equal 1, SearchDaily.find_by(term: "없는찜질방").zero_count
  end

  test "second page and filtered searches are not recorded" do
    get "/places", params: { q: "서울탕", page: 2 }
    get "/places", params: { q: "서울탕", category: ["sauna"] }
    assert_equal 0, SearchDaily.count
  end

  test "listing without query is not recorded" do
    get "/places"
    assert_equal 0, SearchDaily.count
  end
end
