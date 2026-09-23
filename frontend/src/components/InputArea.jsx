import { X, FileText } from 'lucide-react'

function InputArea({ note, onNoteChange, onClear, onSample }) {
  const characterCount = note.length
  const maxLength = 10000

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Clinical Note</h2>
        <div className="flex space-x-2">
          <button
            onClick={onSample}
            className="btn btn-secondary text-sm"
            title="Load sample note"
          >
            <FileText className="h-4 w-4 mr-1" />
            Sample
          </button>
          <button
            onClick={onClear}
            className="btn btn-secondary text-sm"
            title="Clear note"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Paste or type your clinical note here..."
        className="input h-64 resize-none"
        maxLength={maxLength}
      />
      
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>Enter clinical notes for SOAP summary generation</span>
        <span>{characterCount}/{maxLength}</span>
      </div>
    </div>
  )
}

export default InputArea