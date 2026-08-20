class PostsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    scope = Post.published
    scope = scope.where(category: params[:category]) if params[:category].present?

    total = scope.count
    per   = (params[:per] || 12).to_i.clamp(1, 50)
    page  = (params[:page] || 1).to_i.clamp(1, Float::INFINITY)
    posts = scope.limit(per).offset((page - 1) * per)

    render json: {
      meta: { total: total, page: page, per: per, total_pages: (total.to_f / per).ceil },
      data: posts.map { |p| serialize(p) }
    }
  end

  def show
    post = Post.published.find_by!(slug: params[:slug])
    render json: { data: serialize(post) }
  rescue ActiveRecord::RecordNotFound
    render json: { error: '찾을 수 없습니다.' }, status: :not_found
  end

  # ponytail: 방문자 dedup 없음(새로고침마다 +1). 필요해지면 IP/세션 캐시 추가.
  def view
    Post.where(slug: params[:slug]).update_all("views = views + 1")
    head :no_content
  end

  private

  def serialize(post)
    post.as_json(only: %i[id title slug body excerpt thumbnail category author_name published_at created_at updated_at views])
        .merge(
          'meta_title'       => post.effective_meta_title,
          'meta_description' => post.effective_meta_description,
          'keywords'         => post.keywords,
        )
  end
end
