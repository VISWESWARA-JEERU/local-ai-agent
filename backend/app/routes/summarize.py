from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..config import ALLOWED_MODELS
from ..services.ollama_service import check_ollama_health, generate_summary, resolve_model

router = APIRouter()


class SummarizeRequest(BaseModel):
    model: str = Field(..., description="Model id: mistral or phi3:mini")
    note: str = Field(..., min_length=1)


@router.get("/health/ollama")
async def ollama_health():
    return await check_ollama_health()


@router.post("/summarize")
async def summarize(request: SummarizeRequest):
    note = request.note.strip()
    if not note:
        raise HTTPException(status_code=400, detail="Clinical note cannot be empty")

    if request.model not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model. Choose one of: {', '.join(ALLOWED_MODELS)}",
        )

    health = await check_ollama_health()
    if not health.get("reachable"):
        raise HTTPException(
            status_code=503,
            detail=health.get("error", "Ollama is not reachable"),
        )

    ollama_model = resolve_model(request.model)
    installed = health.get("models", [])
    if installed and ollama_model not in installed:
        # Ollama may report names with or without tags; allow partial match
        if not any(m.split(":")[0] == ollama_model.split(":")[0] for m in installed):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Model '{ollama_model}' is not installed. "
                    f"Run: ollama pull {ollama_model}"
                ),
            )

    try:
        summary = await generate_summary(request.model, note)
        return {
            "success": True,
            "model": request.model,
            "summary": summary,
        }
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {exc}",
        ) from exc
