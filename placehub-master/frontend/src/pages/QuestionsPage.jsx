'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { HelpCircle, MessageSquare, ThumbsUp, CheckCircle, Plus, Eye } from 'lucide-react'
import { questionAPI } from '../services/api'

function QuestionsPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    domain: '',
    company: '',
    tags: '',
  })
  const [newAnswer, setNewAnswer] = useState('')
  const [notification, setNotification] = useState(null)
  const userId = localStorage.getItem('userId')

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await questionAPI.getAll({})
      setQuestions(response.data.questions || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostQuestion = async () => {
    if (!newQuestion.title || !newQuestion.content) {
      showNotification('Please fill in title and content', 'error')
      return
    }

    try {
      await questionAPI.create({
        ...newQuestion,
        tags: newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      setShowQuestionModal(false)
      setNewQuestion({ title: '', content: '', domain: '', company: '', tags: '' })
      fetchQuestions()
      showNotification('Question posted successfully!')
    } catch (error) {
      console.error('Error posting question:', error)
      showNotification('Failed to post question', 'error')
    }
  }

  const handlePostAnswer = async () => {
    if (!newAnswer || !selectedQuestion) return

    try {
      await questionAPI.addAnswer(selectedQuestion._id, newAnswer)
      setShowAnswerModal(false)
      setNewAnswer('')
      setSelectedQuestion(null)
      fetchQuestions()
      showNotification('Answer posted successfully!')
    } catch (error) {
      console.error('Error posting answer:', error)
      showNotification('Failed to post answer', 'error')
    }
  }

  const handleMarkHelpful = async (questionId, answerId) => {
    try {
      await questionAPI.markAnswerHelpful(questionId, answerId)
      fetchQuestions()
    } catch (error) {
      console.error('Error marking answer:', error)
    }
  }

  const handleMarkResolved = async (questionId) => {
    try {
      await questionAPI.markAsResolved(questionId)
      fetchQuestions()
    } catch (error) {
      console.error('Error marking resolved:', error)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-background relative">
        {/* Notification Banner */}
        {notification && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 ${notification.type === 'success'
            ? 'bg-green-50 border-2 border-green-200 text-green-800'
            : 'bg-red-50 border-2 border-red-200 text-red-800'
            }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? <CheckCircle size={20} /> : <HelpCircle size={20} />}
              <p className="font-bold">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Q&A Forum</h1>
            <p className="text-gray-600">Ask questions and help others with their placement preparation</p>
          </div>
          <button
            onClick={() => setShowQuestionModal(true)}
            className="px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Ask Question
          </button>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12 text-primary">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg mb-4">No questions yet</p>
            <button
              onClick={() => setShowQuestionModal(true)}
              className="px-6 py-3 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg"
            >
              Be the first to ask!
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-accent transition-all"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-primary">{question.title}</h2>
                      {question.isResolved && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 inline-flex items-center gap-1">
                          <CheckCircle size={14} />
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{question.content}</p>
                  </div>
                </div>

                {/* Question Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.domain && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      {question.domain}
                    </span>
                  )}
                  {question.company && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                      {question.company}
                    </span>
                  )}
                  {question.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Question Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{question.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>{question.answers?.length || 0} answers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold text-xs">
                      {question.userProfile?.fullName?.[0] || 'U'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-semibold text-primary">{question.userProfile?.fullName || 'Anonymous'}</span>
                      {question.userProfile?.placementStatus === 'placed' && (
                        <span className="px-1.5 py-0.5 bg-secondary text-white text-[9px] font-bold rounded uppercase">
                          Mentor
                        </span>
                      )}
                      <span>•</span>
                      <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Answers */}
                {question.answers && question.answers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <h3 className="font-semibold text-primary mb-3">Answers ({question.answers.length})</h3>
                    {question.answers.slice(0, 3).map((answer) => (
                      <div key={answer._id} className="bg-background p-4 rounded-lg border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold text-xs">
                              {answer.userProfile?.fullName?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">
                                  {answer.userProfile?.fullName || 'Anonymous'}
                                </span>
                                {answer.userProfile?.placementStatus === 'placed' && (
                                  <span className="px-1.5 py-0.5 bg-secondary text-white text-[9px] font-bold rounded uppercase">
                                    Mentor
                                  </span>
                                )}
                              </div>
                              {answer.userProfile?.company && (
                                <p className="text-xs text-gray-500">{answer.userProfile.company}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleMarkHelpful(question._id, answer._id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 hover:border-accent hover:bg-accent hover:bg-opacity-10 transition text-sm"
                          >
                            <ThumbsUp size={14} />
                            <span className="font-semibold">{answer.isHelpful || 0}</span>
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm">{answer.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question)
                      setShowAnswerModal(true)
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Answer
                  </button>
                  {question.userId?._id === userId && (
                    <button
                      onClick={() => handleMarkResolved(question._id)}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition inline-flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      {question.isResolved ? 'Reopen' : 'Mark Resolved'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-primary mb-6">Ask a Question</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Title *</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="e.g., How to prepare for system design interviews?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Description *</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    rows="6"
                    placeholder="Provide detailed information about your question..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Domain (Optional)</label>
                    <input
                      type="text"
                      value={newQuestion.domain}
                      onChange={(e) => setNewQuestion({ ...newQuestion, domain: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                      placeholder="e.g., Backend, Frontend"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={newQuestion.company}
                      onChange={(e) => setNewQuestion({ ...newQuestion, company: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                      placeholder="e.g., Google, Microsoft"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Tags (Optional)</label>
                  <input
                    type="text"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="DSA, System Design, Behavioral (comma-separated)"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePostQuestion}
                  disabled={!newQuestion.title || !newQuestion.content}
                  className="flex-1 px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Post Question
                </button>
                <button
                  onClick={() => {
                    setShowQuestionModal(false)
                    setNewQuestion({ title: '', content: '', domain: '', company: '', tags: '' })
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Answer Modal */}
        {showAnswerModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-primary mb-4">Answer Question</h2>
              <div className="mb-6 p-4 bg-background rounded-lg">
                <h3 className="font-bold text-primary mb-2">{selectedQuestion.title}</h3>
                <p className="text-gray-600 text-sm">{selectedQuestion.content}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary mb-2">Your Answer *</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  rows="6"
                  placeholder="Share your knowledge and experience..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePostAnswer}
                  disabled={!newAnswer}
                  className="flex-1 px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Post Answer
                </button>
                <button
                  onClick={() => {
                    setShowAnswerModal(false)
                    setNewAnswer('')
                    setSelectedQuestion(null)
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default QuestionsPage
