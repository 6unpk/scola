# app/controllers/api/v1/registrations_controller.rb
class Api::V1::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    user = User.new(user_params)

    if user.save
      token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
      render json: {
        status: { code: 200, message: '회원가입 성공' },
        data: {
          user: {
            id: user.id,
            email: user.email,
            nickname: user.name
          },
          token: token
        }
      }, status: :created
    else
      render json: {
        status: { code: 422, message: '회원가입 실패' },
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    if current_user.update(user_params)
      render json: {
        status: { code: 200, message: '회원정보 수정 성공' },
        data: {
          user: {
            id: current_user.id,
            email: current_user.email,
            nickname: current_user.name
          }
        }
      }
    else
      render json: {
        status: { code: 422, message: '회원정보 수정 실패' },
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    user = authenticate_user_from_token
    if user
      user.destroy
      render json: {
        status: { code: 200, message: '회원탈퇴 성공' }
      }
    else
      render json: {
        status: { code: 401, message: '인증 실패' }
      }, status: :unauthorized
    end
  end

  private

  def authenticate_user_from_token
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token

    begin
      decoded = Warden::JWTAuth::UserDecoder.new.call(token, :user, nil)
      decoded
    rescue JWT::DecodeError, Warden::JWTAuth::Errors::RevokedToken
      nil
    end
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name)
  end
end