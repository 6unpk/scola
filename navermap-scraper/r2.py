"""
Cloudflare R2 이미지 업로더 (S3 호환).

네이버 호스팅 이미지를 다운로드 → 리사이즈/최적화 → R2 업로드하고 공개 URL을 반환한다.
R2_* 환경변수(.env)로 설정. 미설정이면 configured()가 False.
"""

import io
import os

import boto3
import httpx
from botocore.config import Config
from PIL import Image

ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
BUCKET = os.getenv("R2_BUCKET")
PUBLIC_BASE = (os.getenv("R2_PUBLIC_BASE") or "").rstrip("/")

MAX_WIDTH = 1200
JPEG_QUALITY = 82

_client = None


def configured() -> bool:
    return all([ACCOUNT_ID, ACCESS_KEY, SECRET_KEY, BUCKET, PUBLIC_BASE])


def _s3():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY,
            config=Config(signature_version="s3v4", region_name="auto"),
        )
    return _client


def is_r2_url(url: str | None) -> bool:
    return bool(url and PUBLIC_BASE and url.startswith(PUBLIC_BASE))


def public_url(naver_place_id: str) -> str:
    return f"{PUBLIC_BASE}/places/{naver_place_id}.jpg"


def optimize(data: bytes) -> bytes:
    """최대 폭 1200으로 리사이즈, JPEG q82, EXIF 제거."""
    img = Image.open(io.BytesIO(data)).convert("RGB")
    if img.width > MAX_WIDTH:
        h = round(img.height * MAX_WIDTH / img.width)
        img = img.resize((MAX_WIDTH, h), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return out.getvalue()


def upload_place_image(naver_place_id: str, src_url: str, timeout: float = 20.0) -> str | None:
    """src_url 다운로드 → 최적화 → R2 업로드. 성공 시 공개 URL, 실패 시 None."""
    if not (configured() and src_url):
        return None
    try:
        with httpx.Client(timeout=timeout, follow_redirects=True) as c:
            r = c.get(src_url, headers={"User-Agent": "Mozilla/5.0"})
            r.raise_for_status()
            body = optimize(r.content)
        _s3().put_object(
            Bucket=BUCKET,
            Key=f"places/{naver_place_id}.jpg",
            Body=body,
            ContentType="image/jpeg",
            CacheControl="public, max-age=31536000, immutable",
        )
        return public_url(naver_place_id)
    except Exception as e:
        print(f"    R2 업로드 실패({naver_place_id}): {e}")
        return None


def check_connection() -> bool:
    """설정 검증용 — 버킷 접근 가능 여부."""
    if not configured():
        return False
    try:
        _s3().head_bucket(Bucket=BUCKET)
        return True
    except Exception as e:
        print(f"R2 연결 실패: {e}")
        return False
