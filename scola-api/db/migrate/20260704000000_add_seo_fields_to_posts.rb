class AddSeoFieldsToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :meta_title, :string
    add_column :posts, :meta_description, :text
    add_column :posts, :keywords, :string
  end
end
