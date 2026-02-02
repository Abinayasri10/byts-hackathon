'use client';

import { useState, useEffect } from 'react'
import TermsModal from './TermsModal'

const PASSWORD_STRENGTH_LEVELS = {
  weak: { color: 'bg-red-500', label: 'Weak', score: 1 },
  fair: { color: 'bg-yellow-500', label: 'Fair', score: 2 },
  good: { color: 'bg-blue-500', label: 'Good', score: 3 },
  strong: { color: 'bg-green-500', label: 'Strong', score: 4 },
}

const calculatePasswordStrength = (password) => {
  let score = 0
  if (!password) return 'weak'
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 'weak'
  if (score === 2) return 'fair'
  if (score === 3) return 'good'
  return 'strong'
}

function SignupForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [passwordStrength, setPasswordStrength] = useState('weak')
  const [errors, setErrors] = useState({})
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\.(edu|ac\.in|college\.com)$/.test(formData.email)) {
      newErrors.email = 'Please use a valid college email'
    }

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    }
  }

  const strengthLevel = PASSWORD_STRENGTH_LEVELS[passwordStrength]
  const isFormValid =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.acceptTerms &&
    formData.password === formData.confirmPassword

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          College Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@college.edu"
          className={`w-full px-4 py-2.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
        />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          className={`w-full px-4 py-2.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
        />
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Strength:</span>
              <span className={`font-semibold ${strengthLevel.color.replace('bg-', 'text-')}`}>
                {strengthLevel.label}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthLevel.color} transition-all`}
                style={{ width: `${(strengthLevel.score / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className={`w-full px-4 py-2.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
            }`}
          />
          {formData.confirmPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {formData.password === formData.confirmPassword ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-gray-700 mb-2">
          By signing up, you must read and accept our Terms & Conditions
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowTermsModal(true);
          }}
          className="w-full py-2 px-4 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
        >
          {formData.acceptTerms ? (
            <>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Terms Accepted - Click to Review
            </>
          ) : (
            <>
              📜 Read Terms & Conditions
            </>
          )}
        </button>
      </div>
      {errors.acceptTerms && <p className="text-red-600 text-xs mt-1">{errors.acceptTerms}</p>}

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        accepted={formData.acceptTerms}
        onAcceptChange={(checked) => {
          setFormData(prev => ({ ...prev, acceptTerms: checked }));
          if (checked && errors.acceptTerms) {
            setErrors(prev => ({ ...prev, acceptTerms: '' }));
          }
        }}
      />
    </form>
  )
}

export default SignupForm
