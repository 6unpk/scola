class CreateSearchDailies < ActiveRecord::Migration[7.2]
  def change
    create_table :search_dailies do |t|
      t.string :term, null: false
      t.date :date, null: false
      t.integer :count, default: 0, null: false
      t.integer :zero_count, default: 0, null: false
    end
    add_index :search_dailies, [:term, :date], unique: true
    add_index :search_dailies, :date
  end
end
