# Clinical Note Summarizer

AI-powered SOAP note generation using local Ollama models. A full-stack application that converts raw clinical notes into structured medical summaries.

## Features

- **Local AI Processing**: Uses Ollama with Mistral and Phi-3 models
- **SOAP Format Output**: Structured Subjective, Objective, Assessment, Plan summaries
- **Clean Medical UI**: Professional healthcare interface with TailwindCSS
- **FastAPI Backend**: Async Python backend with proper error handling
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Axios for API calls
- Lucide React icons

### Backend
- Python FastAPI
- Uvicorn server
- Pydantic validation
- aiohttp for Ollama integration

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** installed
3. **Ollama** installed and running locally
4. **Git** for cloning (optional)

## Installation

### 1. Install Ollama

Download and install Ollama from [ollama.ai](https://ollama.ai)

### 2. Pull Required Models

```bash
# Pull Mistral model
ollama pull mistral

# Pull Phi-3 Mini model
ollama pull phi3:mini
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env if needed (default values should work)
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Ollama (in separate terminal)

```bash
ollama serve
```

### Start Backend (in separate terminal)

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend (in separate terminal)

```bash
cd frontend

# Start development server
npm run dev
```

## Usage

1. Open your browser to `http://localhost:3000`
2. Select your preferred AI model (Mistral or Phi-3)
3. Paste or type a clinical note in the input area
4. Click "Generate SOAP Summary"
5. View the structured SOAP output
6. Copy or download the summary as needed

## API Documentation

### POST /summarize

Generate a SOAP summary from clinical notes.

**Request Body:**
```json
{
  "model": "mistral",
  "note": "Patient presents with..."
}
```

**Response:**
```json
{
  "success": true,
  "model": "mistral",
  "summary": "SUBJECTIVE:\n- ..."
}
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── routes/
│   │   │   └── summarize.py     # Summarize endpoint
│   │   ├── services/
│   │   │   └── ollama_service.py # Ollama integration
│   │   └── models/              # Pydantic models
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API services
│   │   └── App.jsx              # Main app component
│   ├── package.json             # Node dependencies
│   └── vite.config.js          # Vite configuration
└── README.md                    # This file
```

## Troubleshooting

### Backend Issues

- **"Failed to connect to Ollama"**: Ensure Ollama is running with `ollama serve`
- **"Model not found"**: Pull the model with `ollama pull <model_name>`
- **Port already in use**: Change the port in the uvicorn command

### Frontend Issues

- **"Network Error"**: Check that the backend is running on port 8000
- **CORS errors**: Ensure CORS_ORIGINS in .env includes the frontend URL

### Ollama Issues

- **Slow responses**: Phi-3 is faster than Mistral for shorter notes
- **Out of memory**: Use Phi-3 for lower resource usage
- **Model loading**: First request may take longer as model loads

## Development

### Adding New Models

1. Pull the model in Ollama: `ollama pull <model_name>`
2. Add to the model list in `ModelSelector.jsx`
3. Update validation in `backend/app/routes/summarize.py`

### Customizing Prompts

Edit the `SYSTEM_PROMPT` in `backend/app/services/ollama_service.py`

## License

This project is for educational and research purposes. Ensure compliance with healthcare regulations when using in clinical settings.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request