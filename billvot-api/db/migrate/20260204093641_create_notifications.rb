class CreateNotifications < ActiveRecord::Migration[7.2]
  def change
    create_table :notifications do |t|
      t.integer :user_id, null: false
      t.string :notification_type, null: false
      t.text :message, null: false
      t.integer :related_id
      t.boolean :is_read, default: false

      t.timestamps
    end

    add_index :notifications, :user_id
    add_index :notifications, [:user_id, :is_read]
  end
end
