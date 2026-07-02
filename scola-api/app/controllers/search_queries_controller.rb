class SearchQueriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  # POST /search_queries  — 검색 1건 기록 (인증 불필요)
  def create
    SearchQuery.record(params[:term])
    head :no_content
  end

  # GET /popular_searches  — 인기 검색어 목록
  def index
    limit = (params[:limit] || 8).to_i.clamp(1, 20)
    render json: { data: SearchQuery.popular(limit) }
  end
end
