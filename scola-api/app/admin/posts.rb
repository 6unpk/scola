ActiveAdmin.register Post do
  permit_params :title, :slug, :body, :excerpt, :thumbnail,
                :category, :author_name, :published, :published_at,
                :meta_title, :meta_description, :keywords

  menu label: '게시글', priority: 2

  index do
    selectable_column
    id_column
    column :title
    column(:카테고리) { |p| p.category }
    column :author_name
    column :published
    column :published_at
    actions
  end

  filter :title
  filter :category
  filter :published
  filter :published_at

  show do
    attributes_table do
      row :id
      row :title
      row :slug
      row :category
      row :author_name
      row :published
      row :published_at
      row(:썸네일) { |p| image_tag(p.thumbnail, height: 120) if p.thumbnail.present? }
      row(:excerpt) { |p| p.excerpt }
      row('SEO 제목')  { |p| p.effective_meta_title }
      row('SEO 설명')  { |p| p.effective_meta_description }
      row(:keywords)   { |p| p.keywords }
      row(:본문) { |p| simple_format(p.body) }
    end
  end

  form do |f|
    f.inputs '기본 정보' do
      f.input :title, label: '제목'
      f.input :slug,  label: 'Slug (비워두면 자동생성)'
      f.input :category, label: '카테고리',
              as: :select,
              collection: [['사우나 이야기', 'sauna'], ['건강 & 웰빙', 'wellness'],
                           ['여행 & 지역', 'travel'], ['가이드', 'guide'], ['기타', 'etc']],
              include_blank: '선택...'
      f.input :author_name, label: '작성자'
      f.input :thumbnail,   label: '썸네일 URL'
      f.input :published,   label: '공개'
      f.input :published_at, label: '발행일시', as: :datetime_picker
    end
    f.inputs '내용' do
      f.input :excerpt, label: '요약 (목록에 표시)', as: :text, input_html: { rows: 3 }
      f.input :body,    label: '본문', as: :text, input_html: { rows: 30, style: 'font-family:monospace' }
    end
    f.inputs 'SEO (비우면 자동 생성)' do
      f.input :meta_title,       label: 'SEO 제목', hint: '비우면 제목 사용'
      f.input :meta_description, label: 'SEO 설명', as: :text, input_html: { rows: 2 }, hint: '비우면 요약/본문에서 자동 추출 (155자)'
      f.input :keywords,         label: '키워드', hint: '콤마로 구분 (예: 사우나, 찜질방, 반신욕)'
    end
    f.actions
  end
end
