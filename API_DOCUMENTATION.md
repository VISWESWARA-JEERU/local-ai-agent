# Clinical Note Summarizer API Documentation

## Overview

The Clinical Note Summarizer API provides endpoints for generating structured SOAP medical summaries from raw clinical notes using local Ollama models.

Base URL: `http://localhost:8000`

## Endpoints

### GET /

Health check endpoint.

**Response:**
```json
{
  "message": "Clinical Note Summarizer API"
}
```

### GET /health

Detailed health check.

**Response:**
```json
{
  "status": "healthy"
}
```

### POST /summarize

Generate a SOAP summary from clinical notes.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "model": "mistral" | "phi3",
  "note": "string (required, non-empty)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "model": "mistral",
  "summary": "SUBJECTIVE:\n- Chief complaint\n- Symptoms...\n\nOBJECTIVE:\n- Vital signs..."
}
```

**Response (Error):**
```json
{
  "detail": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (empty note, invalid model)
- `500`: Internal Server Error (Ollama issues, etc.)

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Empty notes or invalid models return 400
- **Ollama Errors**: Connection issues, model not found, timeouts return 500
- **Network Errors**: Retries with exponential backoff
- **Timeout**: 120 second timeout for Ollama requests

## Models

### Mistral
- **Name**: `mistral`
- **Description**: Powerful general-purpose model
- **Use Case**: Complex clinical notes requiring detailed analysis

### Phi-3 Mini
- **Name**: `phi3`
- **Description**: Lightweight and fast model
- **Use Case**: Quick summaries, lower resource usage

## Rate Limiting

Currently no rate limiting implemented. For production use, consider adding rate limiting middleware.

## CORS

CORS is enabled for `http://localhost:3000` by default. Configure `CORS_ORIGINS` in environment variables for different origins.

## Environment Variables

```
OLLAMA_URL=http://localhost:11434/api/generate
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

## Testing

### Using curl

```bash
curl -X POST "http://localhost:8000/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "note": "Patient presents with chest pain..."
  }'
```

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/summarize",
    json={
        "model": "mistral",
        "note": "Patient presents with chest pain..."
    }
)

print(response.json())
```