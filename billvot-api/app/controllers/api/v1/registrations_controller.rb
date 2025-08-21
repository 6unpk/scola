# app/controllers/api/v1/registrations_controller.rb
class Api::V1::RegistrationsController < Devise::RegistrationsController
    skip_before_action :verify_authenticity_token
    respond_to :json
  
    def create
      user = User.new(user_params)
      
      if user.save
        render json: {
          status: { code: 200, message: '회원가입 성공' },
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
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
              name: current_user.name
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
  
    private
  
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name)
    end
  end