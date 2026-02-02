'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { ChevronRight, Plus, Trash2, AlertCircle, Save, ArrowLeft } from 'lucide-react'
import { experienceAPI } from '../services/api'

function ExperienceRoundsForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [rounds, setRounds] = useState([])
  const [showAddRoundModal, setShowAddRoundModal] = useState(false)
  const [activeRoundTab, setActiveRoundTab] = useState(0)
  const [draft, setDraft] = useState(null)

  const roundTypes = [
    { value: 'online-assessment', label: 'Online Assessment' },
    { value: 'technical-interview', label: 'Technical Interview' },
    { value: 'hr-interview', label: 'HR Interview' },
    { value: 'group-discussion', label: 'Group Discussion' },
    { value: 'case-study', label: 'Case Study' },
    { value: 'other', label: 'Other' },
  ]

  // Load draft on mount
  useEffect(() => {
    loadDraft()
  }, [])

  // Inside ExperienceRoundsForm.jsx

  const loadDraft = async () => {
    try {
      setLoading(true); // Good practice to show loading state
      const response = await experienceAPI.getDraft()
      
      if (response.data.success && response.data.draft) {
        console.log("Draft loaded:", response.data.draft); // Debugging
        setDraft(response.data.draft)
        setRounds(response.data.draft.rounds || [])
      } else {
        // If no draft exists, we cannot add rounds. Redirect to Phase 1.
        setError("No active draft found. Redirecting to start...");
        setTimeout(() => navigate('/share-experience/metadata'), 2000);
      }
    } catch (err) {
      console.error('Failed to load draft:', err)
      setError('Failed to load experience details.')
    } finally {
      setLoading(false);
    }
  }

  // Inside ExperienceRoundsForm.jsx

  const saveDraft = async () => {
    // 1. Safety Check: Don't save if we don't have the parent draft
    if (!draft) {
      setError('Cannot save: Missing company details. Please go back to the previous step.');
      return;
    }

    try {
      await experienceAPI.saveDraft({
        ...draft, // Now we ensure this is not null
        rounds,
      })
      setSuccess('Rounds saved!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      console.error("Save Error:", err);
      // 2. Display the actual error message from backend
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save rounds')
    }
  }

  const addRound = (type) => {
    const newRound = {
      id: Date.now(),
      type,
      title: `${roundTypes.find((r) => r.value === type)?.label || type} ${rounds.filter((r) => r.type === type).length + 1}`,
      details: {},
      saved: false,
    }
    setRounds([...rounds, newRound])
    setActiveRoundTab(rounds.length)
    setShowAddRoundModal(false)
  }

  const deleteRound = (id) => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      setRounds(rounds.filter((r) => r.id !== id))
      setActiveRoundTab(Math.max(0, activeRoundTab - 1))
    }
  }

  const updateRound = (id, updates) => {
    setRounds(rounds.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (rounds.length === 0) {
      setError('Please add at least one round')
      return
    }

    setLoading(true)
    try {
      await saveDraft()
      setSuccess('Rounds saved! Proceeding to materials...')
      setTimeout(() => {
        navigate('/share-experience/materials')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rounds')
    } finally {
      setLoading(false)
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
            <div className="h-1 flex-1 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-gray-600">Materials</span>
            </div>
          </div>
          <div className="w-2/3 h-1 bg-[#472183] rounded-full"></div>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#472183] mb-3">Phase 2: Round-by-Round Details</h1>
          <p className="text-gray-600 text-lg">
            Document each round of the placement process with specific details and insights.
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

        {rounds.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-600 mb-6 text-lg">No rounds added yet. Start by adding your first round!</p>
            <button
              onClick={() => setShowAddRoundModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#472183] text-white font-bold hover:bg-[#4B56D2] transition"
            >
              <Plus size={20} />
              Add First Round
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Round Tabs */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="flex overflow-x-auto border-b border-gray-200">
                {rounds.map((round, index) => (
                  <button
                    key={round.id}
                    type="button"
                    onClick={() => setActiveRoundTab(index)}
                    className={`px-4 py-4 font-semibold whitespace-nowrap transition ${
                      activeRoundTab === index
                        ? 'border-b-2 border-[#472183] text-[#472183] bg-blue-50'
                        : 'border-b-2 border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Round {index + 1}</span>
                      {round.saved && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Saved</span>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Round Content */}
              {rounds[activeRoundTab] && (
                <RoundForm
                  round={rounds[activeRoundTab]}
                  onUpdate={(updates) => updateRound(rounds[activeRoundTab].id, updates)}
                  onDelete={() => deleteRound(rounds[activeRoundTab].id)}
                  roundTypes={roundTypes}
                />
              )}
            </div>

            {/* Add Round Button */}
            <button
              type="button"
              onClick={() => setShowAddRoundModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#82C3EC] text-white font-semibold hover:bg-[#6fb5de] transition"
            >
              <Plus size={20} />
              Add Another Round
            </button>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/share-experience/metadata')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                <Save size={20} />
                Save Rounds
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#472183] text-white font-bold hover:bg-[#4B56D2] disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : (
                  <>
                    Next: Add Materials <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Add Round Modal */}
        {showAddRoundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#472183] mb-6">Select Round Type</h2>
              <div className="space-y-3 mb-6">
                {roundTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addRound(type.value)}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-[#472183] hover:bg-blue-50 transition font-semibold text-gray-700"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddRoundModal(false)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

function RoundForm({ round, onUpdate, onDelete, roundTypes }) {
  const roundType = roundTypes.find((r) => r.value === round.type)?.label || round.type

  return (
    <div className="p-8 space-y-8">
      {/* Round Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-[#472183] mb-2">{roundType}</h3>
          <input
            type="text"
            value={round.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
            placeholder="Round title"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="p-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Conditional Fields Based on Round Type */}
      {round.type === 'online-assessment' && <OnlineAssessmentFields round={round} onUpdate={onUpdate} />}
      {round.type === 'technical-interview' && <TechnicalInterviewFields round={round} onUpdate={onUpdate} />}
      {round.type === 'hr-interview' && <HRInterviewFields round={round} onUpdate={onUpdate} />}
      {round.type === 'group-discussion' && <GDFields round={round} onUpdate={onUpdate} />}
      {round.type === 'case-study' && <CaseStudyFields round={round} onUpdate={onUpdate} />}
      {round.type === 'other' && <OtherRoundFields round={round} onUpdate={onUpdate} />}

      {/* General Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">General Notes</label>
        <textarea
          value={round.details.notes || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, notes: e.target.value } })}
          placeholder="Add any important notes or tips about this round..."
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183] focus:ring-2 focus:ring-[#472183] focus:ring-opacity-20"
        />
      </div>
    </div>
  )
}

// Round Type Components
function OnlineAssessmentFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Platform</label>
          <input
            type="text"
            value={round.details.platform || ''}
            onChange={(e) => onUpdate({ details: { ...round.details, platform: e.target.value } })}
            placeholder="e.g., HackerRank, LeetCode"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Duration (minutes)</label>
          <input
            type="number"
            value={round.details.duration || ''}
            onChange={(e) => onUpdate({ details: { ...round.details, duration: e.target.value } })}
            placeholder="e.g., 90"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Question Breakdown</label>
        <textarea
          value={round.details.questionBreakdown || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, questionBreakdown: e.target.value } })}
          placeholder="e.g., 2 Easy, 3 Medium, 1 Hard problem"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
        <select
          value={round.details.difficulty || 'medium'}
          onChange={(e) => onUpdate({ details: { ...round.details, difficulty: e.target.value } })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  )
}

function TechnicalInterviewFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Mode</label>
          <select
            value={round.details.mode || 'virtual'}
            onChange={(e) => onUpdate({ details: { ...round.details, mode: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          >
            <option value="virtual">Virtual</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Panel Type</label>
          <input
            type="text"
            value={round.details.panelType || ''}
            onChange={(e) => onUpdate({ details: { ...round.details, panelType: e.target.value } })}
            placeholder="e.g., 1:1, 2:1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Topics Covered</label>
        <textarea
          value={round.details.topics || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, topics: e.target.value } })}
          placeholder="e.g., DSA, DBMS, System Design"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Questions</label>
        <textarea
          value={round.details.questions || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, questions: e.target.value } })}
          placeholder="List the questions asked, one per line"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

function HRInterviewFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Duration (minutes)</label>
        <input
          type="number"
          value={round.details.duration || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, duration: e.target.value } })}
          placeholder="e.g., 30"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">HR Questions Asked</label>
        <textarea
          value={round.details.questions || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, questions: e.target.value } })}
          placeholder="e.g., Tell me about yourself, Why this company?, Career goals?"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Answers that Worked</label>
        <textarea
          value={round.details.answers || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, answers: e.target.value } })}
          placeholder="Share what answers/approaches worked well"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Red Flags to Avoid</label>
        <textarea
          value={round.details.redFlags || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, redFlags: e.target.value } })}
          placeholder="Things to avoid saying or doing"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

function GDFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Format</label>
          <input
            type="text"
            value={round.details.format || ''}
            onChange={(e) => onUpdate({ details: { ...round.details, format: e.target.value } })}
            placeholder="e.g., 8 people, 10 minutes"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Topic</label>
          <input
            type="text"
            value={round.details.topic || ''}
            onChange={(e) => onUpdate({ details: { ...round.details, topic: e.target.value } })}
            placeholder="What was discussed?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Evaluation Criteria</label>
        <textarea
          value={round.details.criteria || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, criteria: e.target.value } })}
          placeholder="How were candidates evaluated?"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Your Reflection</label>
        <textarea
          value={round.details.reflection || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, reflection: e.target.value } })}
          placeholder="How did you perform? What worked?"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

function CaseStudyFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Duration (minutes)</label>
        <input
          type="number"
          value={round.details.duration || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, duration: e.target.value } })}
          placeholder="e.g., 120"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Problem Statement</label>
        <textarea
          value={round.details.problem || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, problem: e.target.value } })}
          placeholder="Describe the case study problem"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Your Approach</label>
        <textarea
          value={round.details.approach || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, approach: e.target.value } })}
          placeholder="How did you solve it?"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

function OtherRoundFields({ round, onUpdate }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Round Description</label>
        <textarea
          value={round.details.description || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, description: e.target.value } })}
          placeholder="Describe what happened in this round"
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Key Takeaways</label>
        <textarea
          value={round.details.takeaways || ''}
          onChange={(e) => onUpdate({ details: { ...round.details, takeaways: e.target.value } })}
          placeholder="What did you learn?"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#472183]"
        />
      </div>
    </div>
  )
}

export default ExperienceRoundsForm
