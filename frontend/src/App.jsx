import { useEffect, useState } from 'react'
import Header from './components/Header'
import InputArea from './components/InputArea'
import ModelSelector from './components/ModelSelector'
import GenerateButton from './components/GenerateButton'
import OutputArea from './components/OutputArea'
import { checkOllamaHealth, summarizeNote } from './services/api'

function App() {
  const [note, setNote] = useState('')
  const [model, setModel] = useState('phi3:mini')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const verifyServices = async () => {
      try {
        const ollama = await checkOllamaHealth()
        if (!ollama.reachable) {
          setStatusMessage(ollama.error || 'Ollama is not running. Start it with: ollama serve')
          return
        }
        setStatusMessage('')
      } catch {
        setStatusMessage(
          'Backend is not running. Start it from the backend folder with uvicorn app.main:app --reload --host 0.0.0.0 --port 8000'
        )
      }
    }

    verifyServices()
  }, [])

  const handleGenerate = async () => {
    if (!note.trim()) {
      setError('Please enter a clinical note')
      return
    }

    setLoading(true)
    setError('')
    setSummary('')

    try {
      const result = await summarizeNote(model, note)
      setSummary(result.summary)
    } catch (err) {
      setError(err.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setNote('')
    setSummary('')
    setError('')
  }

  const handleSampleNote = () => {
    const sample = `Patient presents with chest pain and shortness of breath. 
History of hypertension and diabetes. 
Vital signs: BP 160/95, HR 88, RR 20, Temp 98.6F.
Physical exam: Clear lungs, regular heart rhythm, mild edema in lower extremities.
Labs: Glucose 145, HbA1c 7.2, Creatinine 1.1.
Assessment: Uncontrolled hypertension, poorly controlled diabetes.
Plan: Increase ACE inhibitor, adjust insulin regimen, follow up in 2 weeks.`
    setNote(sample)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <ModelSelector model={model} onModelChange={setModel} />
            <InputArea 
              note={note} 
              onNoteChange={setNote} 
              onClear={handleClear}
              onSample={handleSampleNote}
            />
            <GenerateButton 
              onGenerate={handleGenerate} 
              loading={loading} 
              disabled={!note.trim() || loading || !!statusMessage}
            />
            {statusMessage && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                {statusMessage}
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
          
          {/* Output Section */}
          <div>
            <OutputArea summary={summary} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App