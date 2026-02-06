class AddFieldsToVotes < ActiveRecord::Migration[7.2]
  def change
    add_column :votes, :bill_number, :string
    add_column :votes, :proposed_date, :date
    add_column :votes, :session, :string
    add_column :votes, :process_step, :string
    add_column :votes, :committee, :string
    add_column :votes, :external_url, :string
  end
end
