module Api
  module V1
    class ReviewsController < BaseController
      before_action :authenticate_user!, only: [:create, :update, :destroy, :mine]

      # GET /reviews  (전체 후기)
      def all
        order = params[:sort] == 'rating' ? { rating: :desc, created_at: :desc } : { created_at: :desc }
        reviews = Review.includes(:user, :place)
                        .order(order)
                        .page(params[:page]).per(params[:per] || 12)
        render json: {
          data: reviews.map { |r| serialize(r, with_place: true) },
          meta: { total: reviews.total_count, total_pages: reviews.total_pages, page: reviews.current_page }
        }
      end

      # GET /api/v1/me/reviews
      def mine
        reviews = current_user.reviews.includes(:place).order(created_at: :desc)
                              .page(params[:page]).per(params[:per] || 12)
        render json: {
          data: reviews.map { |r| serialize(r, with_place: true) },
          meta: { total: reviews.total_count, total_pages: reviews.total_pages, page: reviews.current_page }
        }
      end

      # GET /places/:place_id/reviews
      def index
        place = Place.find(params[:place_id])
        reviews = place.reviews.includes(:user).order(created_at: :desc)
        render json: {
          data: reviews.map { |r| serialize(r) },
          meta: { total: reviews.size }
        }
      end

      # POST /places/:place_id/reviews
      def create
        place = Place.find(params[:place_id])
        review = place.reviews.build(review_params.merge(user: current_user))
        if review.save
          render json: { data: serialize(review) }, status: :created
        else
          render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /places/:place_id/reviews/:id
      def update
        review = current_user.reviews.find(params[:id])
        if review.update(review_params)
          render json: { data: serialize(review) }
        else
          render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: '후기를 찾을 수 없습니다.' }, status: :not_found
      end

      # DELETE /places/:place_id/reviews/:id
      def destroy
        review = current_user.reviews.find(params[:id])
        review.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: '후기를 찾을 수 없습니다.' }, status: :not_found
      end

      private

      def review_params
        params.require(:review).permit(:body, :rating, :visited_at)
      end

      def serialize(r, with_place: false)
        data = {
          id: r.id,
          body: r.body,
          rating: r.rating,
          visited_at: r.visited_at,
          created_at: r.created_at,
          user: { id: r.user.id, nickname: r.user.name }
        }
        if with_place
          data[:place] = {
            id: r.place.id,
            name: r.place.name,
            thumbnail: r.place.thumbnail,
            road_address: r.place.road_address,
            address: r.place.address,
            naver_place_id: r.place.naver_place_id,
          }
        end
        data
      end
    end
  end
end
