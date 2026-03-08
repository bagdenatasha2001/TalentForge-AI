import os
from dotenv import load_dotenv

load_dotenv(override=True)

GEMINI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or ""
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/talentforge")
