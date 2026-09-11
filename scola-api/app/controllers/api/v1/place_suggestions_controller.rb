module Api
  module V1
    class PlaceSuggestionsController < BaseController
      def create
        place = Place.find(params[:place_id])
        suggestion = place.place_suggestions.build(suggestion_params)
        if current_user
          suggestion.user = current_user
          suggestion.author_name = nil
        end

        if suggestion.save
          render json: {
            status: { code: 201 },
            message: '제보가 접수되었습니다. 검토 후 반영됩니다.'
          }, status: :created
        else
          render json: { errors: suggestion.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def suggestion_params
        scalars = PlaceSuggestion::ALLOWED_FIELDS.reject { |_, t| t == :array }.keys.map(&:to_sym)
        arrays  = PlaceSuggestion::ALLOWED_FIELDS.select { |_, t| t == :array }.keys.map(&:to_sym)
        params.require(:suggestion).permit(:author_name, :note, payload: scalars + [arrays.index_with { [] }])
      end
    end
  end
end
