# app/controllers/api/v1/sessions_controller.rb
class Api::V1::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
      render json: {
        status: { code: 200, message: '로그인 성공' },
        data: {
          user: {
            id: user.id,
            email: user.email,
            nickname: user.name
          },
          token: token
        }
      }
    else
      render json: {
        status: { code: 401, message: '이메일 또는 비밀번호가 잘못되었습니다.' }
      }, status: :unauthorized
    end
  end

  def destroy
    # JWT 토큰은 클라이언트에서 삭제하면 됨
    # 필요시 토큰을 denylist에 추가할 수 있음
    render json: {
      status: { code: 200, message: '로그아웃 성공' }
    }
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      token = request.env['warden-jwt_auth.token']
      render json: {
        status: { code: 200, message: '로그인 성공' },
        data: {
          user: {
            id: resource.id,
            email: resource.email,
            nickname: resource.name
          },
          token: token
        }
      }
    else
      render json: {
        status: { code: 401, message: '로그인 실패' }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: '로그아웃 성공' }
      }
    else
      render json: {
        status: { code: 401, message: '로그아웃 실패' }
      }, status: :unauthorized
    end
  end
end

