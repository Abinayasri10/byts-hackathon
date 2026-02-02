'use client';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileAPI } from '../services/api'
import MultiStepForm from '../components/MultiStepForm'

function ProfileSetupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')

    try {
      const response = await profileAPI.create(formData)
      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/home')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Profile Created!</h2>
          <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us get to know you better</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <MultiStepForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  )
}

export default ProfileSetupPage
