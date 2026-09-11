class CreatePlaceSuggestions < ActiveRecord::Migration[7.2]
  def change
    create_table :place_suggestions do |t|
      t.references :place, null: false, foreign_key: true
      t.bigint :user_id
      t.string :author_name
      t.jsonb :payload, null: false, default: {}
      t.text :note
      t.string :status, null: false, default: 'pending'
      t.timestamps
    end

    add_index :place_suggestions, :user_id
    add_index :place_suggestions, :status
  end
end
