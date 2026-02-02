'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { ChevronRight, Save, AlertCircle, Building2, Briefcase, GraduationCap, DollarSign, Calendar, Clock, Star, CheckCircle, TrendingUp } from 'lucide-react'
import { experienceAPI } from '../services/api'

function ExperienceMetadataForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [autoSave, setAutoSave] = useState(true)

  const [formData, setFormData] = useState({
    companyName: '',
    roleAppliedFor: '',
    batch: new Date().getFullYear().toString(),
    package: '',
    placementSeason: 'on-campus',
    interviewYear: new Date().getFullYear().toString(),
    interviewMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    difficultyRating: '3',
    preparationTime: '',
    overallExperienceRating: '3',
    outcome: 'in-process',
  })

  const [companies] = useState([
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Goldman Sachs',
    'Morgan Stanley',
    'JP Morgan',
    'Flipkart',
    'Amazon',
  ])

  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)

  // Auto-save draft
  useEffect(() => {
    if (!autoSave) return
    const timer = setTimeout(() => {
      saveDraft()
    }, 3000)
    return () => clearTimeout(timer)
  }, [formData, autoSave])

  // Load draft on mount
  useEffect(() => {
    loadDraft()
  }, [])

  const loadDraft = async () => {
    try {
      const response = await experienceAPI.getDraft()
      if (response.data.success && response.data.draft) {
        setFormData({
          ...formData,
          ...response.data.draft,
        })
      }
    } catch (err) {
      console.error('Failed to load draft:', err)
    }
  }

  const saveDraft = async () => {
    try {
      await experienceAPI.saveDraft(formData)
    } catch (err) {
      console.error('Failed to save draft:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!formData.companyName.trim()) {
      setError('Company name is required')
      setLoading(false)
      return
    }
    if (!formData.roleAppliedFor.trim()) {
      setError('Role is required')
      setLoading(false)
      return
    }
    if (!formData.batch) {
      setError('Batch year is required')
      setLoading(false)
      return
    }

    try {
      // Save metadata and move to next phase
      await saveDraft()
      setSuccess('Metadata saved! Proceeding to rounds...')
      setTimeout(() => {
        navigate('/share-experience/rounds')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save metadata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - Progress Bar */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-6">Progress</h3>
                  
                  {/* Step 1 - Active */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md ring-4 ring-accent ring-opacity-20 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-primary block">Metadata</span>
                        <span className="text-xs text-secondary">In Progress</span>
                      </div>
                    </div>
                    <div className="ml-5 pl-5 border-l-2 border-accent h-8"></div>
                  </div>

                  {/* Step 2 - Inactive */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 block">Rounds</span>
                        <span className="text-xs text-gray-400">Pending</span>
                      </div>
                    </div>
                    <div className="ml-5 pl-5 border-l-2 border-gray-200 h-8"></div>
                  </div>

                  {/* Step 3 - Inactive */}
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 block">Materials</span>
                        <span className="text-xs text-gray-400">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-600 uppercase">Overall</span>
                      <span className="text-xs font-bold text-primary">33%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-1/3 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form (75% width) */}
            <div className="lg:col-span-9">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-3">Phase 1: Experience Metadata</h1>
                <p className="text-gray-600 text-lg">
                  Tell us about the company, position, and basic details of your placement experience.
                </p>
              </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex gap-3 shadow-md animate-in fade-in-50">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md animate-in fade-in-50">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <p className="text-green-700 font-bold">{success}</p>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border-2 border-gray-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent opacity-5"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary opacity-5"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Building2 className="text-secondary" size={18} />
                    Company Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={(e) => {
                        handleChange(e)
                        setShowCompanyDropdown(true)
                      }}
                      onFocus={() => setShowCompanyDropdown(true)}
                      placeholder="Enter company name (e.g., Google, Microsoft)"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
                    />
                    {showCompanyDropdown && formData.companyName && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-accent rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
                        {companies
                          .filter((c) =>
                            c.toLowerCase().includes(formData.companyName.toLowerCase())
                          )
                          .map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, companyName: c }))
                                setShowCompanyDropdown(false)
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-background transition-all font-medium flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                            >
                              <Building2 size={16} className="text-secondary" />
                              {c}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Applied For */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Briefcase className="text-secondary" size={18} />
                    Role Applied For <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="roleAppliedFor"
                    value={formData.roleAppliedFor}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer, SDE Intern, Data Analyst"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
                  />
                </div>

                {/* Batch & Package Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Batch */}
                  <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      <GraduationCap className="text-secondary" size={18} />
                      Batch (Graduation Year) <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium bg-white shadow-sm"
                    >
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Package */}
                  <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      <DollarSign className="text-secondary" size={18} />
                      Package (LPA)
                    </label>
                    <input
                      type="text"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      placeholder="e.g., 12.5, 15, 20"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Placement Season */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <TrendingUp className="text-secondary" size={18} />
                    Placement Season
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-3 cursor-pointer p-4 border-2 border-gray-300 rounded-xl hover:border-secondary transition-all bg-white shadow-sm">
                      <input
                        type="radio"
                        name="placementSeason"
                        value="on-campus"
                        checked={formData.placementSeason === 'on-campus'}
                        onChange={handleChange}
                        className="w-5 h-5 text-secondary focus:ring-accent"
                      />
                      <span className="text-gray-700 font-semibold">On Campus</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-3 cursor-pointer p-4 border-2 border-gray-300 rounded-xl hover:border-secondary transition-all bg-white shadow-sm">
                      <input
                        type="radio"
                        name="placementSeason"
                        value="off-campus"
                        checked={formData.placementSeason === 'off-campus'}
                        onChange={handleChange}
                        className="w-5 h-5 text-secondary focus:ring-accent"
                      />
                      <span className="text-gray-700 font-semibold">Off Campus</span>
                    </label>
                  </div>
                </div>

                {/* Interview Date */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Calendar className="text-secondary" size={18} />
                    Interview Date
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Year</label>
                      <select
                        name="interviewYear"
                        value={formData.interviewYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium bg-white shadow-sm"
                      >
                        {[2023, 2024, 2025, 2026].map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Month</label>
                      <select
                        name="interviewMonth"
                        value={formData.interviewMonth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium bg-white shadow-sm"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Difficulty Rating */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <TrendingUp className="text-secondary" size={18} />
                    Difficulty Rating
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, difficultyRating: rating.toString() }))}
                        className={`flex-1 h-14 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg ${
                          formData.difficultyRating === rating.toString()
                            ? 'bg-gradient-to-br from-primary to-secondary text-white ring-4 ring-accent ring-opacity-30'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-secondary'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3 text-center">1 = Very Easy • 5 = Very Hard</p>
                </div>

                {/* Preparation Time */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Clock className="text-secondary" size={18} />
                    Preparation Time (in weeks)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    placeholder="e.g., 8, 12, 16"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
                  />
                </div>

                {/* Overall Experience Rating */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Star className="text-secondary" size={18} />
                    Overall Experience Rating
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, overallExperienceRating: rating.toString() }))}
                        className={`flex-1 h-14 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg ${
                          formData.overallExperienceRating === rating.toString()
                            ? 'bg-gradient-to-br from-secondary to-accent text-white ring-4 ring-accent ring-opacity-30'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-accent'
                        }`}
                      >
                        <Star className="inline-block" size={20} fill={formData.overallExperienceRating === rating.toString() ? 'white' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3 text-center">1 = Poor Experience • 5 = Excellent Experience</p>
                </div>

                {/* Outcome */}
                <div className="bg-gradient-to-br from-background to-white rounded-xl p-5 border border-gray-200 hover:border-accent transition-all">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <CheckCircle className="text-secondary" size={18} />
                    Outcome <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium bg-white shadow-sm"
                  >
                    <option value="in-process">⏳ In Process</option>
                    <option value="selected">✓ Selected / Placed</option>
                    <option value="not-selected">✗ Not Selected / Rejected</option>
                  </select>
                </div>

                {/* Auto-save Toggle */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-secondary">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="w-5 h-5 rounded text-secondary focus:ring-accent"
                  />
                  <div className="flex items-center gap-2">
                    <Save className="text-secondary" size={20} />
                    <span className="text-primary font-bold">Auto-save draft enabled</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-accent text-accent font-bold hover:bg-accent hover:text-white transition-all shadow-md hover:shadow-lg"
                  >
                    <Save size={20} />
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Next: Add Rounds <ChevronRight size={24} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ExperienceMetadataForm