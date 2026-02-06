Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      devise_for :users, controllers: {
        sessions: 'api/v1/sessions',
        registrations: 'api/v1/registrations'
      }
    end
  end
  
  resources :votes do
    collection do
      get :search
    end
    resources :bill_votes, only: [:create] do
      collection do
        get :status
      end
    end
    resources :comments, only: [:index, :create, :update, :destroy] do
      member do
        post :like
      end
    end
  end

  resources :news, only: [:index, :create] do
    collection do
      delete :clear
    end
  end

  resources :notifications, only: [:index] do
    member do
      post :mark_read
    end
    collection do
      post :mark_all_read
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
