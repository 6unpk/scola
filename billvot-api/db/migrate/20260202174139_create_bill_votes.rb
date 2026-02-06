class CreateBillVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :bill_votes do |t|
      t.integer :user_id, null: false
      t.integer :vote_id, null: false
      t.string :vote_type, null: false

      t.timestamps
    end

    add_index :bill_votes, [:user_id, :vote_id], unique: true
    add_index :bill_votes, :vote_id
  end
end
