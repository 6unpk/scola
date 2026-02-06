class CreateComments < ActiveRecord::Migration[7.2]
  def change
    create_table :comments do |t|
      t.references :vote, null: false, foreign_key: true
      t.integer :user_id
      t.integer :parent_id
      t.text :content
      t.string :nickname
      t.integer :likes_count, default: 0

      t.timestamps
    end

    add_index :comments, :parent_id
    add_index :comments, :user_id
  end
end
