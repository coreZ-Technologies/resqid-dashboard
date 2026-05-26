'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2 } from 'lucide-react'
import SchoolForm from '@/components/superadmin/SchoolForm'
import { createSchool } from '@/lib/api'

export default function AddSchoolPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      // await createSchool(data)   ← uncomment when API is ready
      await new Promise(r => setTimeout(r, 800)) // simulate
      router.push('/superadmin/schools')
    } catch (e) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={18} className="text-blue-600" /> Add New School
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Register a new school on the platform</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <SchoolForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}