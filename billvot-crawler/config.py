import os
from dotenv import load_dotenv

load_dotenv()

# Rails API 설정
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")

# 크롤링 설정
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
