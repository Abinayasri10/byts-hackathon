'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { ChevronRight, Plus, Trash2, AlertCircle, Save, ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import { experienceAPI } from '../services/api'

function ExperienceMaterialsForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [draft, setDraft] = useState(null)
  const [materials, setMaterials] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Load draft on mount
  useEffect(() => {
    loadDraft()
  }, [])

  const loadDraft = async () => {
    try {
      const response = await experienceAPI.getDraft()
      if (response.data.success && response.data.draft) {
        setDraft(response.data.draft)
        setMaterials(response.data.draft.materials || [])
      }
    } catch (err) {
      console.error('Failed to load draft:', err)
    }
  }

  const saveDraft = async () => {
    try {
      await experienceAPI.saveDraft({
        ...draft,
        materials,
      })
      setSuccess('Materials saved!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('Failed to save materials')
    }
  }

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        type: 'link',
        title: '',
        url: '',
        description: '',
      },
    ])
  }

  const deleteMaterial = (id) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const updateMaterial = (id, updates) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      // Save final experience with all data
      const response = await experienceAPI.create({
        ...draft,
        materials,
      })

      if (response.data.success) {
        setSuccess('Experience shared successfully!')
        setTimeout(() => {
          navigate('/my-experiences')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit experience')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
                  1
                </div>
                <span className="font-bold text-gray-800">Metadata</span>
              </div>
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
                  2
                </div>
                <span className="font-bold text-gray-800">Rounds</span>
              </div>
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-accent ring-opacity-20">
                  3
                </div>
                <span className="font-bold text-primary">Materials</span>
              </div>
            </div>
            <div className="w-full h-2 bg-primary rounded-full shadow-inner"></div>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Phase 3: Materials & Resources
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Add helpful resources, documents, and links that will assist future candidates in their preparation journey.
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-secondary p-6 rounded-xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-primary font-bold mb-2 text-lg">Optional Step</p>
                  <p className="text-gray-700 leading-relaxed">
                    Adding materials and resources is optional but highly valuable. You can add useful links, documents, code snippets, or notes that helped you prepare.
                  </p>
                </div>
              </div>
            </div>

            {/* Materials Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Study Materials & Resources</h2>
                {materials.length > 0 && (
                  <span className="px-4 py-2 rounded-full bg-accent bg-opacity-10 text-accent font-bold text-sm">
                    {materials.length} {materials.length === 1 ? 'Material' : 'Materials'}
                  </span>
                )}
              </div>

              {/* Materials List */}
              <div className="space-y-6">
                {materials.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-background to-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="w-20 h-20 rounded-full bg-accent bg-opacity-10 flex items-center justify-center mx-auto mb-6">
                      <Upload className="text-accent" size={40} />
                    </div>
                    <p className="text-gray-600 mb-6 text-lg font-medium">No materials added yet</p>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Share resources that helped you succeed - PDFs, links, code snippets, or helpful tips
                    </p>
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-secondary text-white font-bold text-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Plus size={24} />
                      Add Your First Material
                    </button>
                  </div>
                ) : (
                  <>
                    {materials.map((material, index) => (
                      <MaterialInput
                        key={material.id}
                        material={material}
                        index={index}
                        onUpdate={(updates) => updateMaterial(material.id, updates)}
                        onDelete={() => deleteMaterial(material.id)}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-background to-white border-2 border-dashed border-accent text-secondary font-bold hover:border-secondary hover:bg-accent hover:bg-opacity-5 transition-all"
                    >
                      <Plus size={20} />
                      Add Another Material
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {draft && (
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-5 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-5 translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <CheckCircle size={28} />
                    Experience Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                      <p className="text-xs text-white text-opacity-80 font-bold uppercase mb-2 tracking-wide">Company</p>
                      <p className="font-bold text-lg">{draft.companyName || 'N/A'}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                      <p className="text-xs text-white text-opacity-80 font-bold uppercase mb-2 tracking-wide">Role</p>
                      <p className="font-bold text-lg">{draft.roleAppliedFor || 'N/A'}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                      <p className="text-xs text-white text-opacity-80 font-bold uppercase mb-2 tracking-wide">Batch</p>
                      <p className="font-bold text-lg">{draft.batch || 'N/A'}</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
                      <p className="text-xs text-white text-opacity-80 font-bold uppercase mb-2 tracking-wide">Outcome</p>
                      <p className={`font-bold text-lg flex items-center gap-2 ${
                        draft.outcome === 'selected'
                          ? 'text-green-300'
                          : draft.outcome === 'not-selected'
                          ? 'text-red-300'
                          : 'text-yellow-300'
                      }`}>
                        {draft.outcome === 'selected' ? '✓ Selected' : draft.outcome === 'not-selected' ? '✗ Not Selected' : 'In Process'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/share-experience/rounds')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:border-primary hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft size={20} />
                Previous Step
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-accent text-accent font-bold hover:bg-accent hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                <Save size={20} />
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-2xl transition-all shadow-lg hover:scale-105"
              >
                <CheckCircle size={24} />
                Review & Submit Experience
              </button>
            </div>
          </form>

          {/* Review Modal */}
          {showReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-primary">Review Your Experience</h2>
                </div>

                {draft && (
                  <div className="space-y-6 mb-8">
                    <div className="bg-background rounded-xl p-6 border border-gray-200">
                      <p className="text-sm text-gray-600 font-bold uppercase mb-2 tracking-wide">Company</p>
                      <p className="text-2xl font-bold text-primary">{draft.companyName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-600 font-bold uppercase mb-2 tracking-wide">Role</p>
                        <p className="text-lg font-bold text-gray-800">{draft.roleAppliedFor}</p>
                      </div>
                      <div className="bg-background rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-600 font-bold uppercase mb-2 tracking-wide">Batch</p>
                        <p className="text-lg font-bold text-gray-800">{draft.batch}</p>
                      </div>
                    </div>

                    <div className="bg-accent bg-opacity-10 rounded-xl p-6 border-2 border-accent border-opacity-30">
                      <p className="text-sm text-secondary font-bold uppercase mb-2 tracking-wide">Materials Added</p>
                      <p className="text-xl font-bold text-gray-800">{materials.length} {materials.length === 1 ? 'material' : 'materials'}</p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-xl">
                      <div className="flex gap-3">
                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                        <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                          Once submitted, your experience will be reviewed by our team and published after approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-6 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all border-2 border-gray-300"
                  >
                    Edit More
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewModal(false)
                      handleSubmit({ preventDefault: () => {} })
                    }}
                    disabled={submitting}
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Confirm & Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function MaterialInput({ material, index, onUpdate, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-white to-background rounded-2xl shadow-lg p-8 space-y-6 border-2 border-gray-100 hover:border-accent transition-all relative overflow-hidden group">
      {/* Decorative Circle */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent opacity-5 group-hover:opacity-10 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center font-bold shadow-md">
              {index + 1}
            </div>
            <h4 className="text-xl font-bold text-primary">Material {index + 1}</h4>
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200 hover:border-red-300"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Material Type
          </label>
          <select
            value={material.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium bg-white shadow-sm"
          >
            <option value="link">🔗 Link/Reference</option>
            <option value="document">📄 Document/PDF</option>
            <option value="code">💻 Code Snippet</option>
            <option value="note">📝 Note/Tip</option>
            <option value="resource">📚 Resource</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Title *
          </label>
          <input
            type="text"
            value={material.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g., Important DSA Concepts"
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
          />
        </div>

        {(material.type === 'link' || material.type === 'document') && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              {material.type === 'link' ? '🔗 URL' : '📁 File Upload'}
            </label>
            {material.type === 'link' ? (
              <input
                type="url"
                value={material.url}
                onChange={(e) => onUpdate({ url: e.target.value })}
                placeholder="https://example.com/resource"
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-secondary hover:bg-accent hover:bg-opacity-5 cursor-pointer transition-all bg-white">
                <div className="w-16 h-16 rounded-full bg-accent bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-accent" size={32} />
                </div>
                <p className="text-gray-700 font-bold mb-2">Click to upload or drag & drop</p>
                <p className="text-sm text-gray-500">PDF, DOC, Image (Max 10MB)</p>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={material.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Explain why this resource is helpful and how it aided your preparation..."
            rows="4"
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-accent focus:ring-opacity-20 transition-all font-medium placeholder-gray-400 bg-white shadow-sm resize-none"
          />
        </div>
      </div>
    </div>
  )
}

export default ExperienceMaterialsForm