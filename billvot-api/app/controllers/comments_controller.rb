class CommentsController < ApplicationController
  before_action :set_vote
  before_action :set_comment, only: [:update, :destroy, :like]

  # GET /votes/:vote_id/comments
  def index
    @comments = @vote.comments.root_comments.order(created_at: :desc)
    render json: @comments.map(&:as_json_with_replies)
  end

  # POST /votes/:vote_id/comments
  def create
    @comment = @vote.comments.build(comment_params)

    if @comment.save
      # 답글인 경우 원댓글 작성자에게 알림 생성
      create_reply_notification if @comment.parent_id.present?
      render json: @comment.as_json_simple, status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /votes/:vote_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: @comment.as_json_simple
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /votes/:vote_id/comments/:id
  def destroy
    @comment.destroy
    head :no_content
  end

  # POST /votes/:vote_id/comments/:id/like
  def like
    @comment.increment!(:likes_count)
    render json: { likes_count: @comment.likes_count }
  end

  private

  def set_vote
    @vote = Vote.find(params[:vote_id])
  end

  def set_comment
    @comment = @vote.comments.find(params[:id])
  end

  def comment_params
    params.permit(:content, :nickname, :user_id, :parent_id)
  end

  def create_reply_notification
    parent_comment = @comment.parent
    return unless parent_comment&.user_id.present?
    return if parent_comment.user_id == @comment.user_id # 자기 댓글에 답글 달면 알림 X

    Notification.create(
      user_id: parent_comment.user_id,
      notification_type: Notification::TYPES[:reply],
      message: "#{@comment.nickname}님이 회원님의 댓글에 답글을 남겼습니다.",
      related_id: @comment.id
    )
  end
end
