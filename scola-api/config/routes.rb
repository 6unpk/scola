Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  # 어드민 세션용 (브라우저 기반)
  devise_for :users,
    path: 'admin_auth',
    as: 'admin_user',
    controllers: { sessions: 'admin/sessions' },
    skip: [:registrations, :passwords, :confirmations, :unlocks]

  # API용 (JWT 기반)
  devise_for :users,
    path: 'api/v1/users',
    as: 'api_user',
    skip: [:passwords, :confirmations, :unlocks],
    controllers: {
      sessions: 'api/v1/sessions',
      registrations: 'api/v1/registrations'
    }

  get 'reviews', to: 'api/v1/reviews#all'
  get 'api/v1/me/reviews', to: 'api/v1/reviews#mine'

  resources :places, only: [:index, :show, :update] do
    resources :reviews, only: [:index, :create, :update, :destroy], module: 'api/v1'
  end

  resources :students

  resources :lessons do
    member do
      post :enroll
      delete :unenroll
      get :students
    end
    resources :attendances, only: [:index] do
      collection do
        post :upsert
        post :bulk_upsert
      end
    end
  end

  post 'api/v1/public/students', to: 'api/v1/public_students#create'

  get "up" => "rails/health#show", as: :rails_health_check
end
