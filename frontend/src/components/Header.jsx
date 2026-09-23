import { Stethoscope } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <Stethoscope className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Clinical Note Summarizer
            </h1>
            <p className="text-gray-600">
              AI-powered SOAP note generation using local Ollama models
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header