class CreateLessons < ActiveRecord::Migration[7.2]
  def change
    create_table :lessons do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :subject
      t.string :days_of_week, array: true, null: false, default: []
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.string :status, null: false, default: 'active'
      t.text :notes

      t.timestamps
    end
  end
end
