class AddSharesToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :shares, :integer, default: 0, null: false
  end
end
