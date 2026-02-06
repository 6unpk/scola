class CreateNews < ActiveRecord::Migration[7.2]
  def change
    create_table :news do |t|
      t.string :title
      t.string :url
      t.string :source
      t.string :image_url

      t.timestamps
    end
  end
end
