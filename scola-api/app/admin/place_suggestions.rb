ActiveAdmin.register PlaceSuggestion do
  menu label: '정보 제보', priority: 3
  actions :index, :show, :destroy

  scope('검토 대기', :pending, default: true) { |s| s.where(status: 'pending') }
  scope('승인됨', :approved) { |s| s.where(status: 'approved') }
  scope('반려됨', :rejected) { |s| s.where(status: 'rejected') }
  scope('전체', :all)

  filter :status, as: :select, collection: PlaceSuggestion::STATUSES
  filter :author_name_cont, label: '제보자'
  filter :created_at

  index do
    selectable_column
    id_column
    column('장소') { |s| link_to(s.place.name, admin_place_path(s.place)) }
    column('제보자') { |s| s.display_name }
    column('제보 내용') do |s|
      s.payload.map { |k, v| "#{k}: #{Array(v).join(', ')}" }.join(' / ').truncate(80)
    end
    column :status
    column :created_at
    actions
  end

  show do
    attributes_table do
      row('장소') { |s| link_to(s.place.name, admin_place_path(s.place)) }
      row('제보자') { |s| s.display_name }
      row :status
      row :note
      row :created_at
    end

    panel '현재 값 vs 제보 값' do
      table do
        thead do
          tr do
            th '항목'
            th '현재 값'
            th '제보 값'
          end
        end
        tbody do
          resource.payload.each do |key, value|
            tr do
              td key
              td (Array(resource.place.public_send(key)).join(', ').presence || '(없음)')
              td Array(value).join(', ')
            end
          end
        end
      end
    end

    if resource.status == 'pending'
      div style: 'margin-top:16px; display:flex; gap:8px' do
        span link_to('승인 (장소에 반영)', approve_admin_place_suggestion_path(resource),
                     method: :put, class: 'button',
                     data: { confirm: '이 제보를 장소 정보에 반영할까요?' })
        span link_to('반려', reject_admin_place_suggestion_path(resource),
                     method: :put, class: 'button')
      end
    end
  end

  member_action :approve, method: :put do
    resource.apply!
    redirect_to admin_place_suggestions_path, notice: '제보를 장소에 반영했습니다.'
  end

  member_action :reject, method: :put do
    resource.update(status: 'rejected')
    redirect_to admin_place_suggestions_path, notice: '제보를 반려했습니다.'
  end

  batch_action :approve, confirm: '선택한 제보를 모두 반영할까요?' do |ids|
    PlaceSuggestion.where(id: ids, status: 'pending').find_each(&:apply!)
    redirect_to admin_place_suggestions_path, notice: "#{ids.size}건을 반영했습니다."
  end

  batch_action :reject do |ids|
    PlaceSuggestion.where(id: ids).update_all(status: 'rejected')
    redirect_to admin_place_suggestions_path, notice: "#{ids.size}건을 반려했습니다."
  end
end
