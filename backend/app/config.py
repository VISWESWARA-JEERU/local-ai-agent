import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_CHAT_URL = f"{OLLAMA_BASE_URL}/api/chat"
OLLAMA_TAGS_URL = f"{OLLAMA_BASE_URL}/api/tags"

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
CORS_ORIGINS = [origin.strip() for origin in _cors_origins.split(",") if origin.strip()]

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Map frontend model ids to installed Ollama model names
MODEL_ALIASES = {
    "mistral": "mistral:latest",
    "phi3:mini": "phi3:mini",
}

ALLOWED_MODELS = list(MODEL_ALIASES.keys())

OLLAMA_TIMEOUT_SECONDS = int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "300"))
