require "test_helper"

class AdminSecurityTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @member = User.create!(email: "member@example.com", password: "password123", name: "m")
    @admin = User.create!(email: "admin@example.com", password: "password123", name: "a", admin: true)
    @place = Place.create!(name: "테스트탕", naver_place_id: "sec-1", gender_type: "남녀공용")
  end

  def admin_login(user)
    post "/admin_auth/sign_in", params: { admin_user_user: { email: user.email, password: "password123" } }
  end

  def api_token(user)
    Warden::JWTAuth::UserEncoder.new.call(user, :api_user_user, nil).first
  end

  test "guest is redirected from admin" do
    get "/admin"
    assert_redirected_to "/admin_auth/sign_in"
  end

  test "member cannot open admin" do
    admin_login(@member)
    assert_response :redirect
    assert_not_equal "/admin_auth/sign_in", URI(response.location).path
    get "/admin"
    assert_redirected_to "/admin_auth/sign_in"
    get "/admin_auth/sign_in"
    assert_response :success
  end

  test "admin can open admin" do
    admin_login(@admin)
    assert_redirected_to "/admin"
    get "/admin"
    assert_response :success
  end

  test "guest patch is rejected and saves nothing" do
    patch "/places/#{@place.id}", params: { place: { gender_type: "여성전용" } }, as: :json
    assert_response :unauthorized
    assert_equal "남녀공용", @place.reload.gender_type
  end

  test "member patch is rejected and saves nothing" do
    patch "/places/#{@place.id}", params: { place: { gender_type: "여성전용" } }, as: :json,
          headers: { "Authorization" => "Bearer #{api_token(@member)}" }
    assert_response :unauthorized
    assert_equal "남녀공용", @place.reload.gender_type
  end

  test "admin patch saves" do
    patch "/places/#{@place.id}", params: { place: { gender_type: "여성전용" } }, as: :json,
          headers: { "Authorization" => "Bearer #{api_token(@admin)}" }
    assert_response :success
    assert_equal "여성전용", @place.reload.gender_type
  end
end
