class Vote < ApplicationRecord
  has_many :bill_votes, dependent: :destroy
  has_many :comments, dependent: :destroy

  def agree_count
    bill_votes.where(vote_type: "agree").count
  end

  def disagree_count
    bill_votes.where(vote_type: "disagree").count
  end

  def total_votes
    bill_votes.count
  end

  def agree_percent
    return 0 if total_votes.zero?
    (agree_count.to_f / total_votes * 100).round
  end

  def disagree_percent
    return 0 if total_votes.zero?
    (disagree_count.to_f / total_votes * 100).round
  end
end
