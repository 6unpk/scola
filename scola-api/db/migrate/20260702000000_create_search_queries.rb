class CreateSearchQueries < ActiveRecord::Migration[7.2]
  def change
    create_table :search_queries do |t|
      t.string  :term, null: false
      t.integer :count, null: false, default: 0

      t.timestamps
    end

    add_index :search_queries, :term, unique: true
    add_index :search_queries, :count
  end
end
