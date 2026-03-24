Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      devise_for :users, controllers: {
        sessions: 'api/v1/sessions',
        registrations: 'api/v1/registrations'
      }
    end
  end

  resources :students

  resources :lessons do
    member do
      post :enroll
      delete :unenroll
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
