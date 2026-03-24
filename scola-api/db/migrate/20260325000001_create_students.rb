class CreateStudents < ActiveRecord::Migration[7.2]
  def change
    create_table :students do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.date :birth_date
      t.string :gender
      t.string :school
      t.string :grade
      t.string :phone
      t.string :parent_name
      t.string :parent_phone
      t.string :parent_relationship
      t.date :enrollment_date
      t.string :status, null: false, default: 'active'
      t.text :notes

      t.timestamps
    end
  end
end
