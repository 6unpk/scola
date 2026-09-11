# frozen_string_literal: true
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    pending = PlaceSuggestion.where(status: 'pending').includes(:place, :user).order(created_at: :desc)

    panel "검토 대기 제보 (#{pending.count}건)" do
      if pending.any?
        table_for pending.limit(10) do
          column('장소') { |s| link_to(s.place.name, admin_place_path(s.place)) }
          column('제보자') { |s| s.display_name }
          column('내용') do |s|
            s.payload.map { |k, v| "#{k}: #{Array(v).join(', ')}" }.join(' / ').truncate(60)
          end
          column('') { |s| link_to('검토', admin_place_suggestion_path(s)) }
        end
        para link_to('전체 제보 보기 →', admin_place_suggestions_path)
      else
        para '검토할 제보가 없습니다.'
      end
    end
  end
end
