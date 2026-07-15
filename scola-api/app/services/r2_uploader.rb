require 'aws-sdk-s3'

# Cloudflare R2(S3 호환) 업로더. ENV의 R2_* 값으로 설정.
class R2Uploader
  REQUIRED = %w[R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET R2_PUBLIC_BASE].freeze

  def self.configured?
    REQUIRED.all? { |k| ENV[k].present? }
  end

  def self.client
    @client ||= Aws::S3::Client.new(
      access_key_id: ENV['R2_ACCESS_KEY_ID'],
      secret_access_key: ENV['R2_SECRET_ACCESS_KEY'],
      endpoint: "https://#{ENV['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
      region: 'auto',
    )
  end

  # io: File/Tempfile/IO. key: 'posts/xxx.jpg'. 반환: 공개 URL
  def self.upload(io, key:, content_type:)
    client.put_object(
      bucket: ENV['R2_BUCKET'],
      key: key,
      body: io,
      content_type: content_type,
      cache_control: 'public, max-age=31536000, immutable',
    )
    "#{ENV['R2_PUBLIC_BASE'].to_s.chomp('/')}/#{key}"
  end
end
