class ApplicationController < ActionController::API
    protected

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        devise_parameter_sanitizer.permit(:account_update, keys: [:name])
    end

    def authenticate_user!
        if user_signed_in?
            super
        else
            render json: {
                status: { code: 401, message: '로그인이 필요합니다.' }
            }, status: :unauthorized
        end
    end
end
