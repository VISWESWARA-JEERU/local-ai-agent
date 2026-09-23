import { ChevronDown } from 'lucide-react'

function ModelSelector({ model, onModelChange }) {
  const models = [
    { value: 'mistral', label: 'Mistral', description: 'Powerful general-purpose model' },
    { value: 'phi3:mini', label: 'Phi-3 Mini', description: 'Lightweight and fast model' }
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Model</h2>
      
      <div className="space-y-3">
        {models.map((m) => (
          <label key={m.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="model"
              value={m.value}
              checked={model === m.value}
              onChange={(e) => onModelChange(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <div>
              <div className="font-medium text-gray-900">{m.label}</div>
              <div className="text-sm text-gray-500">{m.description}</div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Ensure Ollama is running locally with the selected model installed.
        </p>
      </div>
    </div>
  )
}

export default ModelSelector