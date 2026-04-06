class ApplicationController < ActionController::Base
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :null_session, prepend: true

  # api_user 스코프로 생성된 current_api_user_user를 current_user로 통일
  def current_user
    current_api_user_user
  end
  helper_method :current_user

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  # API 인증 (JWT)
  def authenticate_user!
    unless current_user
      render json: { status: { code: 401, message: '로그인이 필요합니다.' } }, status: :unauthorized
    end
  end

  # 어드민 인증 (세션)
  def authenticate_admin!
    unless current_admin_user_user
      redirect_to new_admin_user_user_session_path
    end
  end
end
