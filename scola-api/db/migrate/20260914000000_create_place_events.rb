class CreatePlaceEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :place_events do |t|
      t.references :place, null: false, foreign_key: true, index: false
      t.string :event_type, null: false
      t.datetime :created_at, null: false
    end

    add_index :place_events, [:place_id, :created_at]
    add_index :place_events, [:event_type, :created_at]
  end
end
