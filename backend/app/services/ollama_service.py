import aiohttp
import asyncio
import logging

from ..config import (
    ALLOWED_MODELS,
    MODEL_ALIASES,
    OLLAMA_CHAT_URL,
    OLLAMA_TAGS_URL,
    OLLAMA_TIMEOUT_SECONDS,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert clinical documentation assistant.

Convert the clinical note into a SOAP-format medical summary.

RULES:
- Never hallucinate information
- Never invent diagnoses or medications
- Preserve important medical details
- Use concise professional medical language
- If information is missing, write "Not Mentioned"
- Use bullet points
- Do not include explanations outside the SOAP format

OUTPUT FORMAT:

SUBJECTIVE:
- Chief complaint
- Symptoms
- Patient-reported concerns

OBJECTIVE:
- Vital signs
- Lab results
- Physical examination findings
- Imaging results

ASSESSMENT:
- Diagnoses
- Clinical interpretation

PLAN:
- Medications
- Treatment plan
- Follow-up instructions
"""


def resolve_model(model: str) -> str:
    if model not in ALLOWED_MODELS:
        raise ValueError(f"Invalid model '{model}'. Choose one of: {', '.join(ALLOWED_MODELS)}")
    return MODEL_ALIASES[model]


async def check_ollama_health() -> dict:
    """Verify Ollama is reachable and list installed models."""
    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(OLLAMA_TAGS_URL) as response:
                if response.status != 200:
                    text = await response.text()
                    return {
                        "reachable": False,
                        "error": f"Ollama returned status {response.status}: {text}",
                    }

                data = await response.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                return {"reachable": True, "models": models}
    except aiohttp.ClientError as exc:
        return {
            "reachable": False,
            "error": f"Cannot reach Ollama at {OLLAMA_TAGS_URL}. Run 'ollama serve'. ({exc})",
        }


async def generate_summary(model: str, note: str) -> str:
    """Generate SOAP summary using the Ollama chat API."""
    ollama_model = resolve_model(model)
    payload = {
        "model": ollama_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Clinical Note:\n{note}"},
        ],
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9,
            "num_predict": 1024,
        },
    }

    max_retries = 2
    timeout = aiohttp.ClientTimeout(total=OLLAMA_TIMEOUT_SECONDS)

    for attempt in range(max_retries):
        try:
            logger.info("Generating summary with %s (attempt %s)", ollama_model, attempt + 1)

            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(OLLAMA_CHAT_URL, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        summary = (
                            data.get("message", {}).get("content", "").strip()
                        )
                        if not summary:
                            raise RuntimeError("Empty response from Ollama")
                        logger.info("Successfully generated summary with %s", ollama_model)
                        return summary

                    error_text = await response.text()
                    logger.error("Ollama API error: %s - %s", response.status, error_text)
                    raise RuntimeError(
                        f"Ollama API returned status {response.status}: {error_text}"
                    )

        except aiohttp.ClientError as exc:
            logger.error("Network error on attempt %s: %s", attempt + 1, exc)
            if attempt == max_retries - 1:
                raise RuntimeError(
                    f"Failed to connect to Ollama after {max_retries} attempts: {exc}"
                ) from exc
        except RuntimeError:
            raise
        except Exception as exc:
            logger.error("Unexpected error on attempt %s: %s", attempt + 1, exc)
            if attempt == max_retries - 1:
                raise

        await asyncio.sleep(2 ** attempt)

    raise RuntimeError("All retry attempts failed")
