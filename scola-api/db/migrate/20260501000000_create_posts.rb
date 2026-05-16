class CreatePosts < ActiveRecord::Migration[7.2]
  def change
    create_table :posts do |t|
      t.string   :title,       null: false
      t.string   :slug,        null: false
      t.text     :body
      t.text     :excerpt
      t.string   :thumbnail
      t.string   :category
      t.string   :author_name, default: '스콜라 팀'
      t.boolean  :published,   null: false, default: false
      t.datetime :published_at

      t.timestamps
    end

    add_index :posts, :slug,      unique: true
    add_index :posts, :published
    add_index :posts, :published_at
  end
end
