class BillVotesController < ApplicationController
  before_action :set_vote

  # POST /votes/:vote_id/bill_votes
  def create
    user_id = params[:user_id].to_i

    if user_id <= 0
      return render json: {
        status: { code: 401, message: "로그인이 필요합니다." }
      }, status: :unauthorized
    end

    @bill_vote = @vote.bill_votes.find_or_initialize_by(user_id: user_id)
    @bill_vote.vote_type = params[:vote_type]

    if @bill_vote.save
      render json: {
        status: { code: 200, message: "투표 완료" },
        data: {
          vote_type: @bill_vote.vote_type,
          agree_count: @vote.agree_count,
          disagree_count: @vote.disagree_count,
          agree_percent: @vote.agree_percent,
          disagree_percent: @vote.disagree_percent
        }
      }
    else
      render json: {
        status: { code: 422, message: "투표 실패" },
        errors: @bill_vote.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # GET /votes/:vote_id/bill_votes/status
  def status
    user_id = params[:user_id].to_i if params[:user_id].present?
    user_vote = @vote.bill_votes.find_by(user_id: user_id) if user_id && user_id > 0

    render json: {
      agree_count: @vote.agree_count,
      disagree_count: @vote.disagree_count,
      agree_percent: @vote.agree_percent,
      disagree_percent: @vote.disagree_percent,
      total_votes: @vote.total_votes,
      user_vote: user_vote&.vote_type
    }
  end

  private

  def set_vote
    @vote = Vote.find(params[:vote_id])
  end
end
