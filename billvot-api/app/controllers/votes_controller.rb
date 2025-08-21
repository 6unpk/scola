class VotesController < ApplicationController
  def index
    @votes = Vote.all
    render json: @votes
  end

  def show
    @vote = Vote.find(params[:id])
    render json: @vote
  end

  def create
    @vote = Vote.new(vote_params)
    if @vote.save
      render json: @vote
    else
      render json: @vote.errors, status: :unprocessable_entity
    end
  end

  def update
    @vote = Vote.find(params[:id])
    if @vote.update(vote_params)
      render json: @vote
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
    params.require(:vote).permit(:title, :description, :user_id)
  end
end
