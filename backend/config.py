import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
IMAGEKIT_PRIVATE_KEY = os.getenv("IMAGEKIT_PRIVATE_KEY", "")
IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY", "")
IMAGEKIT_URL_ENDPOINT = os.getenv("IMAGEKIT_URL_ENDPOINT", "")

CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", "")
CF_WORKER_AI_API_TOKEN = os.getenv("CF_WORKER_AI_API_TOKEN", "")
CF_MODEL = "@cf/black-forest-labs/flux-2-klein-9b"

DATABASE_URL = "sqlite:///./super-banana.db"