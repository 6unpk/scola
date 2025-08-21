class CreateVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :votes do |t|
      t.string :title
      t.text :content
      t.string :author

      t.timestamps
    end
  end
end
