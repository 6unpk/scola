class RemovePriceRangeFromPlaces < ActiveRecord::Migration[7.2]
  def change
    remove_column :places, :price_range, :string
  end
end
