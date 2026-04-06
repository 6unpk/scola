class CreateReviews < ActiveRecord::Migration[7.2]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :place, null: false, foreign_key: true
      t.text :body
      t.integer :rating
      t.date :visited_at

      t.timestamps
    end
  end
end
