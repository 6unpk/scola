Rails.application.routes.draw do
  devise_for :users,
    path: 'api/v1/users',
    controllers: {
      sessions: 'api/v1/sessions',
      registrations: 'api/v1/registrations'
    }

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

  get "up" => "rails/health#show", as: :rails_health_check
end
