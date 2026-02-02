'use client';

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { ChevronRight, Plus, Trash2, AlertCircle, Save, ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import { experienceAPI } from '../services/api'

function ExperienceMaterialsForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [materials, setMaterials] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [experienceId, setExperienceId] = useState(location.state?.experienceId)
  const [summaryData, setSummaryData] = useState(null)

  // Redirect if no ID
  useEffect(() => {
    if (!experienceId) {
      setError('Missing experience details. Redirecting to start...')
      setTimeout(() => navigate('/share-experience/metadata'), 2000)
    } else {
      fetchExistingData()
    }
  }, [experienceId])

  const fetchExistingData = async () => {
    try {
      const res = await experienceAPI.getById(experienceId)
      if (res.data.success) {
        setSummaryData(res.data.experience)
        if (res.data.experience.materials) {
          setMaterials(res.data.experience.materials)
        }
      }
    } catch (err) {
      console.error("Failed to load experience data", err)
    }
  }

  // Auto-save logic
  useEffect(() => {
    if (materials.length > 0 && experienceId) {
      const timer = setTimeout(() => {
        saveMaterials(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [materials, experienceId])

  const saveMaterials = async (silent = false) => {
    if (!experienceId) return
    try {
      await experienceAPI.saveMaterials(experienceId, materials)
      if (!silent) {
        setSuccess('Materials saved!')
        setTimeout(() => setSuccess(''), 2000)
      }
    } catch (err) {
      if (!silent) setError('Failed to save materials')
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
    if (e) e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      // Final save of materials
      await saveMaterials(true)

      // Submit for approval (Change status to pending)
      const response = await experienceAPI.submit(experienceId)

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-semibold text-gray-800">Metadata</span>
            </div>
            <div className="h-1 flex-1 bg-[#472183]"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-semibold text-gray-800">Rounds</span>
            </div>
            <div className="h-1 flex-1 bg-[#472183]"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center font-bold">
                3
              </div>
              <span className="font-semibold text-gray-800">Materials</span>
            </div>
          </div>
          <div className="w-full h-1 bg-[#472183] rounded-full"></div>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#472183] mb-3">Phase 3: Materials & Resources</h1>
          <p className="text-gray-600 text-lg">
            Add helpful resources, documents, and links that will assist future candidates.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 font-semibold">{success}</p>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <p className="text-blue-700 font-semibold mb-2">Optional Step</p>
            <p className="text-blue-600">
              Adding materials and resources is optional but highly valuable. You can add useful links, documents, code snippets, or notes that helped you prepare.
            </p>
          </div>

          {/* Materials List */}
          <div className="space-y-6">
            {materials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-600 mb-6">No materials added yet</p>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#82C3EC] text-white font-semibold hover:bg-[#6fb5de] transition"
                >
                  <Plus size={20} />
                  Add Material
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
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#82C3EC] text-white font-semibold hover:bg-[#6fb5de] transition"
                >
                  <Plus size={20} />
                  Add Another Material
                </button>
              </>
            )}
          </div>

          {/* Summary Section */}
          {summaryData && (
            <div className="bg-[#F1F6F5] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#472183] mb-6">Experience Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Company</p>
                  <p className="font-bold text-gray-800">{summaryData.companyName || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Role</p>
                  <p className="font-bold text-gray-800">{summaryData.roleAppliedFor || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Batch</p>
                  <p className="font-bold text-gray-800">{summaryData.batch || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Outcome</p>
                  <p className={`font-bold ${summaryData.outcome === 'selected'
                      ? 'text-green-600'
                      : summaryData.outcome === 'not-selected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                    {summaryData.outcome === 'selected' ? '✓ Selected' : summaryData.outcome === 'not-selected' ? '✗ Not Selected' : 'In Process'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/share-experience/rounds', { state: { experienceId } })}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              type="button"
              onClick={() => saveMaterials(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              <Save size={20} />
              Save Materials
            </button>
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#472183] text-white font-bold hover:bg-[#4B56D2] transition"
            >
              <CheckCircle size={20} />
              Review & Submit
            </button>
          </div>
        </form>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#472183] mb-6">Review Your Experience</h2>

              {summaryData && (
                <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">COMPANY</p>
                    <p className="text-lg font-bold text-gray-800">{summaryData.companyName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">ROLE</p>
                      <p className="text-lg font-bold text-gray-800">{summaryData.roleAppliedFor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">BATCH</p>
                      <p className="text-lg font-bold text-gray-800">{summaryData.batch}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">MATERIALS ADDED</p>
                    <p className="text-gray-700">{materials.length} materials</p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-yellow-700">
                      Once submitted, your experience will be reviewed by our team and published after approval.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                >
                  Edit More
                </button>
                <button
                  onClick={() => {
                    setShowReviewModal(false)
                    handleSubmit({ preventDefault: () => { } })
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#472183] text-white font-bold hover:bg-[#4B56D2] disabled:opacity-50 transition"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

function MaterialInput({ material, index, onUpdate, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-bold text-[#472183]">Material {index + 1}</h4>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Material Type</label>
        <select
          value={material.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        >
          <option value="link">Link/Reference</option>
          <option value="document">Document/PDF</option>
          <option value="code">Code Snippet</option>
          <option value="note">Note/Tip</option>
          <option value="resource">Resource</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Title</label>
        <input
          type="text"
          value={material.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Important DSA Concepts"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      {(material.type === 'link' || material.type === 'document') && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {material.type === 'link' ? 'URL' : 'File Upload'}
          </label>
          {material.type === 'link' ? (
            <input
              type="url"
              value={material.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
            />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#472183] cursor-pointer transition">
              <Upload className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-600 font-semibold mb-1">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-500">PDF, DOC, Image (Max 10MB)</p>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
        <textarea
          value={material.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Explain why this resource is helpful"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

export default ExperienceMaterialsForm
