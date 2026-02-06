class NewsController < ApplicationController
  def index
    per_page = (params[:per_page] || 10).to_i
    page = (params[:page] || 1).to_i
    offset = (page - 1) * per_page

    @news = News.order(created_at: :desc).offset(offset).limit(per_page)
    total = News.count
    has_more = offset + @news.length < total

    render json: {
      data: @news,
      meta: {
        page: page,
        per_page: per_page,
        total: total,
        has_more: has_more
      }
    }
  end

  def create
    @news = News.new(news_params)
    if @news.save
      render json: @news, status: :created
    else
      render json: @news.errors, status: :unprocessable_entity
    end
  end

  def clear
    News.delete_all
    render json: { message: "All news cleared" }
  end

  private

  def news_params
    params.permit(:title, :url, :source, :image_url)
  end
end
