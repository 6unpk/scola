ActiveAdmin.register User do
  menu label: "회원", priority: 8
  actions :index, :show

  includes :reviews

  index do
    id_column
    column :email
    column :name
    column("리뷰") { |user| user.reviews.size }
    column :admin
    column("가입일", sortable: :created_at) { |user| user.created_at.strftime("%Y-%m-%d") }
    actions
  end

  filter :email_cont, label: "이메일"
  filter :name_cont, label: "이름"
  filter :admin
  filter :created_at

  sidebar "최근 90일 일별 가입", only: :index do
    text_node column_chart(AdminMetrics.by_day(User.all, 90), height: "160px")
  end

  show do
    attributes_table do
      row :id
      row :email
      row :name
      row :admin
      row :created_at
      row("리뷰 수") { |user| user.reviews.count }
    end
  end
end
