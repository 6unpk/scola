class Admin::SessionsController < Devise::SessionsController
  # 어드민 로그인용 세션 컨트롤러 (HTML 기반)

  def after_sign_in_path_for(_resource)
    admin_root_path
  end
end
