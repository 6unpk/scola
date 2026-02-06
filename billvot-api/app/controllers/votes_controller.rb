class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes.map { |vote| vote_with_counts(vote) }
  end

  def search
    query = params[:q].to_s.strip
    if query.blank?
      @votes = Vote.none
    else
      @votes = Vote.where("title ILIKE ? OR author ILIKE ? OR bill_number ILIKE ?",
        "%#{query}%", "%#{query}%", "%#{query}%")
    end
    render json: @votes.map { |vote| vote_with_counts(vote) }
  end

  def show
    @vote = Vote.find(params[:id])
    render json: vote_with_counts(@vote)
  end

  def create
    @vote = Vote.new(vote_params)
    if @vote.save
      render json: vote_with_counts(@vote)
    else
      render json: @vote.errors, status: :unprocessable_entity
    end
  end

  def update
    @vote = Vote.find(params[:id])
    if @vote.update(vote_params)
      render json: vote_with_counts(@vote)
    else
      render json: @vote.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @vote = Vote.find(params[:id])
    @vote.destroy
    render json: { message: "Vote deleted successfully" }
  end

  private

  def vote_params
    params.permit(:title, :content, :author, :bill_number, :proposed_date, :session, :process_step, :committee, :external_url)
  end

  def vote_with_counts(vote)
    {
      id: vote.id,
      title: vote.title,
      content: vote.content,
      author: vote.author,
      bill_number: vote.bill_number,
      proposed_date: vote.proposed_date,
      session: vote.session,
      process_step: vote.process_step,
      committee: vote.committee,
      external_url: vote.external_url,
      agree_count: vote.agree_count,
      disagree_count: vote.disagree_count,
      agree_percent: vote.agree_percent,
      disagree_percent: vote.disagree_percent,
      total_votes: vote.total_votes,
      created_at: vote.created_at,
      updated_at: vote.updated_at
    }
  end
end
