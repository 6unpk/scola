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

ActiveRecord::Schema[7.2].define(version: 2026_04_05_063125) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "attendances", force: :cascade do |t|
    t.bigint "lesson_id", null: false
    t.bigint "student_id", null: false
    t.date "date", null: false
    t.string "status", default: "present", null: false
    t.text "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id", "student_id", "date"], name: "index_attendances_on_lesson_id_and_student_id_and_date", unique: true
    t.index ["lesson_id"], name: "index_attendances_on_lesson_id"
    t.index ["student_id"], name: "index_attendances_on_student_id"
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "lesson_enrollments", force: :cascade do |t|
    t.bigint "lesson_id", null: false
    t.bigint "student_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id", "student_id"], name: "index_lesson_enrollments_on_lesson_id_and_student_id", unique: true
    t.index ["lesson_id"], name: "index_lesson_enrollments_on_lesson_id"
    t.index ["student_id"], name: "index_lesson_enrollments_on_student_id"
  end

  create_table "lessons", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "subject"
    t.string "days_of_week", default: [], null: false, array: true
    t.time "start_time", null: false
    t.time "end_time", null: false
    t.string "status", default: "active", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_lessons_on_user_id"
  end

  create_table "places", force: :cascade do |t|
    t.string "naver_place_id", null: false
    t.string "name", null: false
    t.string "naver_category"
    t.string "search_keyword"
    t.string "address"
    t.string "road_address"
    t.string "phone"
    t.string "homepage"
    t.text "description"
    t.string "thumbnail"
    t.decimal "longitude", precision: 10, scale: 7
    t.decimal "latitude", precision: 10, scale: 7
    t.string "business_hours"
    t.string "business_hours_detail", default: [], array: true
    t.integer "visitor_review_count"
    t.integer "blog_review_count"
    t.string "admission_fee"
    t.jsonb "price_info", default: []
    t.string "parking"
    t.integer "parking_count"
    t.string "gender_type"
    t.string "sauna_type"
    t.integer "room_count"
    t.string "sauna_temp"
    t.string "hot_bath_temp"
    t.string "cold_bath_temp"
    t.string "bath_types", default: [], array: true
    t.string "special_rooms", default: [], array: true
    t.string "amenities", default: [], array: true
    t.string "pool_info"
    t.string "age_restriction"
    t.boolean "is_24hours"
    t.boolean "membership_available"
    t.boolean "has_restaurant"
    t.boolean "has_sleep_room"
    t.boolean "has_massage"
    t.boolean "has_gym"
    t.boolean "kids_facility"
    t.jsonb "price_tiers", default: {}
    t.string "app_category", default: [], array: true
    t.decimal "rating", precision: 3, scale: 1
    t.integer "review_count"
    t.string "tags", default: [], array: true
    t.string "open_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_category"], name: "index_places_on_app_category"
    t.index ["latitude", "longitude"], name: "index_places_on_latitude_and_longitude"
    t.index ["naver_place_id"], name: "index_places_on_naver_place_id", unique: true
    t.index ["road_address"], name: "index_places_on_road_address"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "place_id", null: false
    t.text "body"
    t.integer "rating"
    t.date "visited_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_reviews_on_place_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "students", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.date "birth_date"
    t.string "gender"
    t.string "school"
    t.string "grade"
    t.string "phone"
    t.string "parent_name"
    t.string "parent_phone"
    t.string "parent_relationship"
    t.date "enrollment_date"
    t.string "status", default: "active", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_students_on_user_id"
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

  add_foreign_key "attendances", "lessons"
  add_foreign_key "attendances", "students"
  add_foreign_key "lesson_enrollments", "lessons"
  add_foreign_key "lesson_enrollments", "students"
  add_foreign_key "lessons", "users"
  add_foreign_key "reviews", "places"
  add_foreign_key "reviews", "users"
  add_foreign_key "students", "users"
end
