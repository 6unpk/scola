
# app/controllers/api/v1/sessions_controller.rb
class Api::V1::SessionsController < Devise::SessionsController
    skip_before_action :verify_authenticity_token
    respond_to :json
  
    def create
      user = User.find_by(email: params[:user][:email])
      
      if user && user.valid_password?(params[:user][:password])
        sign_in(user)
        render json: {
          status: { code: 200, message: '로그인 성공' },
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
          }
        }
      else
        render json: {
          status: { code: 401, message: '이메일 또는 비밀번호가 잘못되었습니다.' }
        }, status: :unauthorized
      end
    end
  
    def destroy
      sign_out(current_user)
      render json: {
        status: { code: 200, message: '로그아웃 성공' }
      }
    end
  
    private
  
    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: {
          status: { code: 200, message: '로그인 성공' },
          data: {
            user: {
              id: resource.id,
              email: resource.email,
              name: resource.name
            }
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
        }
      end
    end
  end

