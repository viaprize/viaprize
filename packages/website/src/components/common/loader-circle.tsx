import { Loader2 } from 'lucide-react'

export default function LoaderCircle() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Loader2 className="w-32 h-32 animate-spin text-green-500" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
