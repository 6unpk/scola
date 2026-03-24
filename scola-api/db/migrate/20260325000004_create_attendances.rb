class CreateAttendances < ActiveRecord::Migration[7.2]
  def change
    create_table :attendances do |t|
      t.references :lesson, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: true
      t.date :date, null: false
      t.string :status, null: false, default: 'present'
      t.text :note

      t.timestamps
    end

    add_index :attendances, [:lesson_id, :student_id, :date], unique: true
  end
end
