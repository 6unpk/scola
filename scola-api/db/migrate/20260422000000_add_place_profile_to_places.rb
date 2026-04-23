class AddPlaceProfileToPlaces < ActiveRecord::Migration[7.2]
  def change
    add_column :places, :place_profile, :jsonb, default: {}
    add_column :places, :review_summary, :jsonb, default: {}
  end
end
