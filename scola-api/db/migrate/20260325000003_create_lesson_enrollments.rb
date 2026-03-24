class CreateLessonEnrollments < ActiveRecord::Migration[7.2]
  def change
    create_table :lesson_enrollments do |t|
      t.references :lesson, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: true

      t.timestamps
    end

    add_index :lesson_enrollments, [:lesson_id, :student_id], unique: true
  end
end
