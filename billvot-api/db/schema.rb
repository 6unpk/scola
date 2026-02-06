# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_02_04_094656) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bill_votes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "vote_id", null: false
    t.string "vote_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "vote_id"], name: "index_bill_votes_on_user_id_and_vote_id", unique: true
    t.index ["vote_id"], name: "index_bill_votes_on_vote_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "vote_id", null: false
    t.integer "user_id"
    t.integer "parent_id"
    t.text "content"
    t.string "nickname"
    t.integer "likes_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
    t.index ["vote_id"], name: "index_comments_on_vote_id"
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "news", force: :cascade do |t|
    t.string "title"
    t.string "url"
    t.string "source"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "notification_type", null: false
    t.text "message", null: false
    t.integer "related_id"
    t.boolean "is_read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "is_read"], name: "index_notifications_on_user_id_and_is_read"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.string "author"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "bill_number"
    t.date "proposed_date"
    t.string "session"
    t.string "process_step"
    t.string "committee"
    t.string "external_url"
  end

  add_foreign_key "comments", "votes"
end
