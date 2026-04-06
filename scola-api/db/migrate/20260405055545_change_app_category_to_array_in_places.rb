class ChangeAppCategoryToArrayInPlaces < ActiveRecord::Migration[7.2]
  def up
    change_column :places, :app_category, :string, array: true, default: [], using: "ARRAY[app_category]::varchar[]"
    # 기존 null 값은 빈 배열로
    execute "UPDATE places SET app_category = '{}' WHERE app_category IS NULL"
  end

  def down
    change_column :places, :app_category, :string, array: false, default: nil, using: "app_category[1]"
  end
end
