class AddViewsToPostsAndPlaces < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :views, :integer, default: 0, null: false
    add_column :places, :views, :integer, default: 0, null: false
  end
end
