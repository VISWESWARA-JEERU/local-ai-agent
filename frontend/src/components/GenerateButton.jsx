import { Loader2, Sparkles } from 'lucide-react'

function GenerateButton({ onGenerate, loading, disabled }) {
  return (
    <button
      onClick={onGenerate}
      disabled={disabled}
      className="w-full btn btn-primary text-lg py-3 flex items-center justify-center"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Generating SOAP Summary...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 mr-2" />
          Generate SOAP Summary
        </>
      )}
    </button>
  )
}

export default GenerateButton