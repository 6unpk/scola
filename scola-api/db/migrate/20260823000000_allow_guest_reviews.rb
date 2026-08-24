class AllowGuestReviews < ActiveRecord::Migration[7.2]
  def change
    change_column_null :reviews, :user_id, true
    add_column :reviews, :author_name, :string
  end
end
