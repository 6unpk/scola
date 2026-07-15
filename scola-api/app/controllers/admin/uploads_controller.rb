module Admin
  # 어드민 에디터(Toast UI)용 이미지 업로드 → R2. 세션(관리자) 인증 필요.
  class UploadsController < ApplicationController
    before_action :authenticate_admin!

    def create
      file = params[:file]
      return render json: { error: '파일이 없습니다.' }, status: :bad_request unless file.respond_to?(:tempfile)
      return render json: { error: 'R2 미설정' }, status: :service_unavailable unless R2Uploader.configured?

      content_type = file.content_type.presence || 'application/octet-stream'
      ext = File.extname(file.original_filename.to_s).downcase.presence || ext_for(content_type)
      key = "posts/#{SecureRandom.hex(12)}#{ext}"

      url = R2Uploader.upload(file.tempfile, key: key, content_type: content_type)
      render json: { url: url }
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end

    private

    def ext_for(content_type)
      { 'image/jpeg' => '.jpg', 'image/png' => '.png', 'image/webp' => '.webp',
        'image/gif' => '.gif', 'image/svg+xml' => '.svg' }[content_type] || '.jpg'
    end
  end
end
