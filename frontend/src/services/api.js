import axios from 'axios'

// All requests go through the Vite dev proxy to the FastAPI backend — never to Ollama directly.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for slow local CPU inference
  headers: {
    'Content-Type': 'application/json',
  },
})

const formatErrorDetail = (detail) => {
  if (!detail) return 'Server error'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
  }
  return JSON.stringify(detail)
}

export const checkBackendHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const checkOllamaHealth = async () => {
  const response = await api.get('/health/ollama')
  return response.data
}

export const summarizeNote = async (model, note) => {
  try {
    const response = await api.post('/summarize', {
      model,
      note,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(formatErrorDetail(error.response.data?.detail))
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Request timed out. Try Phi-3 Mini for faster results, or wait for the model to finish loading.'
      )
    }
    if (error.request) {
      throw new Error(
        'Unable to connect to the backend. Start it with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000'
      )
    }
    throw new Error('An unexpected error occurred')
  }
}

export default api
