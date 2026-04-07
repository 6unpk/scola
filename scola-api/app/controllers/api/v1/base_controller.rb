module Api
  module V1
    class BaseController < ApplicationController
      skip_before_action :verify_authenticity_token

      protected

      def current_user
        return @current_user if defined?(@current_user)
        @current_user = decode_jwt_user
      end

      def authenticate_user!
        unless current_user
          render json: { error: '로그인이 필요합니다.' }, status: :unauthorized
        end
      end

      private

      def decode_jwt_user
        header = request.headers['Authorization']
        return nil unless header&.start_with?('Bearer ')

        token = header.split(' ', 2).last
        secret = Rails.application.credentials.secret_key_base

        begin
          payload, = JWT.decode(token, secret, true, algorithms: ['HS256'])
          user_id = payload['sub']
          return nil unless user_id

          user = User.find_by(id: user_id)
          return nil unless user

          # JTI deny list check
          jti = payload['jti']
          return nil if jti && JwtDenylist.exists?(jti: jti)

          user
        rescue JWT::DecodeError
          nil
        end
      end
    end
  end
end
