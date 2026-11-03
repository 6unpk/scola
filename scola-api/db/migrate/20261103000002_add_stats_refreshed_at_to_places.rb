class AddStatsRefreshedAtToPlaces < ActiveRecord::Migration[7.2]
  def change
    add_column :places, :stats_refreshed_at, :datetime
  end
end
