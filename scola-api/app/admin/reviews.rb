ActiveAdmin.register Review do
  menu label: "리뷰", priority: 7
  actions :index, :show, :destroy

  includes :place, :user

  index do
    selectable_column
    id_column
    column("장소") { |review| link_to(review.place.name, admin_place_path(review.place)) }
    column("작성자") { |review| review.display_name }
    column("별점") { |review| review.rating }
    column("내용") { |review| review.body.to_s.truncate(80) }
    column("방문일") { |review| review.visited_at }
    column("작성일", sortable: :created_at) { |review| review.created_at.strftime("%Y-%m-%d") }
    actions
  end

  filter :body_cont, label: "내용"
  filter :author_name_cont, label: "작성자"
  filter :rating
  filter :created_at
end
