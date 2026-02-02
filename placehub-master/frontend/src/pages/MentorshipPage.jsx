'use client';

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { Users, MessageCircle, Calendar, BookOpen, ArrowRight, Send, CheckCircle, XCircle, Clock, Video, Star, TrendingUp, Award } from 'lucide-react'
import { mentorshipAPI, profileAPI, meetingAPI, messageAPI } from '../services/api'

function MentorshipPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('mentors')
  const [mentors, setMentors] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestDomain, setRequestDomain] = useState('')
  const [targetCompanies, setTargetCompanies] = useState('')
  const [notification, setNotification] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 30,
    meetingType: 'video',
    customMeetingLink: '',
  })
  const [existingMeeting, setExistingMeeting] = useState(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  // New state for enhanced features
  const [stats, setStats] = useState(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackRequest, setFeedbackRequest] = useState(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelRequest, setCancelRequest] = useState(null)
  const [cancelReason, setCancelReason] = useState('')

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const statsRes = await mentorshipAPI.getStats()
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const profileRes = await profileAPI.get()
      setUserProfile(profileRes.data)

      // Auto-set tab based on user role
      if (profileRes.data?.profile?.placementStatus === 'placed' && activeTab === 'mentors') {
        setActiveTab('received')
      }

      if (activeTab === 'mentors') {
        const mentorsRes = await mentorshipAPI.getMentors({})
        setMentors(mentorsRes.data.mentors || [])
      } else if (activeTab === 'received') {
        const requestsRes = await mentorshipAPI.getReceivedRequests({})
        setReceivedRequests(requestsRes.data || [])
      } else if (activeTab === 'sent') {
        const requestsRes = await mentorshipAPI.getSentRequests({})
        setSentRequests(requestsRes.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async () => {
    if (!selectedMentor || !requestMessage) return

    try {
      await mentorshipAPI.sendRequest({
        mentorId: selectedMentor.userId._id,
        message: requestMessage,
        domain: requestDomain,
        targetCompanies: targetCompanies.split(',').map(c => c.trim()).filter(Boolean),
      })
      setShowRequestModal(false)
      setRequestMessage('')
      setRequestDomain('')
      setTargetCompanies('')
      setSelectedMentor(null)
      showNotification('Mentorship request sent successfully!')
    } catch (error) {
      console.error('Error sending request:', error)
      showNotification('Failed to send request', 'error')
    }
  }

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await mentorshipAPI.respondToRequest(requestId, status)
      fetchData()
      showNotification(`Request ${status}`)
    } catch (error) {
      console.error('Error responding to request:', error)
      showNotification('Failed to respond to request', 'error')
    }
  }

  const handleScheduleMeeting = async () => {
    if (!selectedRequest || !meetingData.title || !meetingData.scheduledAt) {
      showNotification('Please fill in meeting title and date/time', 'error')
      return
    }

    try {
      if (isRescheduling && existingMeeting) {
        // Reschedule existing meeting
        await meetingAPI.update(existingMeeting._id, {
          title: meetingData.title,
          description: meetingData.description,
          scheduledAt: meetingData.scheduledAt,
          duration: meetingData.duration,
          meetingType: meetingData.meetingType,
        })
        showNotification('Meeting rescheduled successfully!')
      } else {
        // Create new meeting
        await meetingAPI.create({
          ...meetingData,
          menteeId: selectedRequest.menteeId._id,
          mentorshipRequestId: selectedRequest._id,
          meetingLink: meetingData.customMeetingLink || null,
        })
        showNotification('Meeting scheduled successfully!')
      }
      setShowScheduleModal(false)
      setMeetingData({ title: '', description: '', scheduledAt: '', duration: 30, meetingType: 'video', customMeetingLink: '' })
      setSelectedRequest(null)
      setExistingMeeting(null)
      setIsRescheduling(false)
    } catch (error) {
      console.error('Error scheduling meeting:', error)
      showNotification(error.response?.data?.message || 'Failed to schedule meeting', 'error')
    }
  }

  const handleCancelExistingMeeting = async () => {
    if (!existingMeeting) return
    try {
      await meetingAPI.cancel(existingMeeting._id, 'Meeting cancelled by mentor')
      setExistingMeeting(null)
      showNotification('Meeting cancelled. You can now schedule a new one.')
    } catch (error) {
      console.error('Error cancelling meeting:', error)
      showNotification('Failed to cancel meeting', 'error')
    }
  }

  const checkExistingMeeting = async (request) => {
    try {
      const response = await meetingAPI.getMeetings({ status: 'scheduled' })
      const meetings = response.data || []
      const existing = meetings.find(m =>
        m.menteeId?._id === request.menteeId?._id ||
        m.menteeId === request.menteeId?._id
      )
      if (existing) {
        setExistingMeeting(existing)
      } else {
        setExistingMeeting(null)
      }
    } catch (error) {
      console.error('Error checking existing meetings:', error)
    }
  }

  const openScheduleModal = async (request) => {
    setSelectedRequest(request)
    await checkExistingMeeting(request)
    setShowScheduleModal(true)
    setIsRescheduling(false)
  }

  const handleCompleteMentorship = async (requestId) => {
    try {
      await mentorshipAPI.completeRequest(requestId)
      fetchData()
      showNotification('Mentorship marked as completed')
    } catch (error) {
      console.error('Error completing mentorship:', error)
      showNotification('Failed to complete mentorship', 'error')
    }
  }

  const handleStartChat = async (userId) => {
    try {
      await messageAPI.startConversation(userId)
      navigate('/messages')
    } catch (error) {
      console.error('Error starting chat:', error)
      navigate('/messages')
    }
  }

  const openFeedbackModal = (request) => {
    setFeedbackRequest(request)
    setFeedbackRating(0)
    setFeedbackText('')
    setShowFeedbackModal(true)
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackRequest || feedbackRating === 0) {
      showNotification('Please provide a rating', 'error')
      return
    }
    try {
      await mentorshipAPI.submitFeedback(feedbackRequest._id, {
        rating: feedbackRating,
        feedback: feedbackText,
      })
      setShowFeedbackModal(false)
      setFeedbackRequest(null)
      fetchData()
      showNotification('Feedback submitted successfully!')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      showNotification('Failed to submit feedback', 'error')
    }
  }

  const openCancelModal = (request) => {
    setCancelRequest(request)
    setCancelReason('')
    setShowCancelModal(true)
  }

  const handleCancelMentorship = async () => {
    if (!cancelRequest) return
    try {
      await mentorshipAPI.cancelRequest(cancelRequest._id, cancelReason)
      setShowCancelModal(false)
      setCancelRequest(null)
      fetchData()
      showNotification('Mentorship cancelled')
    } catch (error) {
      console.error('Error cancelling mentorship:', error)
      showNotification(error.response?.data?.message || 'Failed to cancel', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Pending' },
      accepted: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Active' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Rejected' },
      completed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Completed' },
      cancelled: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Cancelled' },
    }
    const config = configs[status] || configs.pending
    return (
      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    )
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
              {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <p className="font-bold">{notification.message}</p>
            </div>
          </div>
        )}
        {/* Hero Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-16 text-white shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect with Mentors & Peers</h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Get guidance from placed seniors, share your experiences, and help juniors succeed
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/messages"
                className="px-8 py-3.5 rounded-lg bg-white text-primary font-bold hover:bg-background hover:shadow-lg transition inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Messages
              </Link>
              <Link
                to="/meetings"
                className="px-8 py-3.5 rounded-lg bg-accent text-white font-bold hover:bg-opacity-90 hover:shadow-lg transition inline-flex items-center gap-2"
              >
                <Calendar size={20} />
                My Meetings
              </Link>
              <Link
                to="/questions"
                className="px-8 py-3.5 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition inline-flex items-center gap-2"
              >
                <BookOpen size={20} />
                Q&A Forum
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {stats && (
          <section className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalRequests || 0}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingRequests || 0}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.activeRequests || 0}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.completedRequests || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            {stats.averageRating && stats.role === 'mentor' && (
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                <div className="text-3xl font-bold text-accent flex items-center justify-center gap-1">
                  {stats.averageRating} <Star size={20} className="text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            )}
          </section>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b-2 border-accent">
          <div className="flex gap-2">
            {/* Only show Find Mentors tab for non-placed students (mentees) */}
            {userProfile?.profile?.placementStatus !== 'placed' && (
              <button
                onClick={() => setActiveTab('mentors')}
                className={`px-6 py-3 font-semibold transition-all ${activeTab === 'mentors'
                  ? 'bg-primary text-white rounded-t-lg'
                  : 'text-gray-700 hover:bg-background hover:text-secondary'
                  }`}
              >
                Find Mentors
              </button>
            )}
            {/* Only show Received Requests tab for placed students (mentors) */}
            {userProfile?.profile?.placementStatus === 'placed' && (
              <button
                onClick={() => setActiveTab('received')}
                className={`px-6 py-3 font-semibold transition-all ${activeTab === 'received'
                  ? 'bg-primary text-white rounded-t-lg'
                  : 'text-gray-700 hover:bg-background hover:text-secondary'
                  }`}
              >
                Received Requests
              </button>
            )}
            {/* Only show My Requests tab for non-placed students (mentees) */}
            {userProfile?.profile?.placementStatus !== 'placed' && (
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-6 py-3 font-semibold transition-all ${activeTab === 'sent'
                  ? 'bg-primary text-white rounded-t-lg'
                  : 'text-gray-700 hover:bg-background hover:text-secondary'
                  }`}
              >
                My Requests
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-primary">Loading...</div>
        ) : (
          <>
            {/* Mentors List */}
            {activeTab === 'mentors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-accent relative overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold text-2xl">
                          {mentor.fullName?.[0] || 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-primary">{mentor.fullName || 'Mentor'}</h3>
                            {mentor.placementStatus === 'placed' && (
                              <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                Mentor
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{mentor.year} Year</p>
                        </div>
                      </div>

                      <div className="mb-4 space-y-2">
                        <p className="text-gray-700"><span className="font-semibold text-primary">Company:</span> {mentor.company || 'N/A'}</p>
                        <p className="text-gray-700"><span className="font-semibold text-primary">Role:</span> {mentor.role || 'N/A'}</p>
                        {mentor.mentorshipSettings?.yearOfPlacement && (
                          <p className="text-gray-600 text-sm">Placed in {mentor.mentorshipSettings.yearOfPlacement}</p>
                        )}
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {mentor.mentorshipSettings?.availableForChat && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            Chat
                          </span>
                        )}
                        {mentor.mentorshipSettings?.availableForCall && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                            Call
                          </span>
                        )}
                        {mentor.mentorshipSettings?.availableForMeeting && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                            Meeting
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedMentor(mentor)
                            setShowRequestModal(true)
                          }}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                        >
                          <Send size={16} />
                          Request
                        </button>
                        <button
                          onClick={() => navigate('/messages')}
                          className="flex-1 px-4 py-2.5 rounded-lg border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition inline-flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Received Requests */}
            {activeTab === 'received' && (
              <div className="space-y-4">
                {receivedRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-accent transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                          {request.menteeProfile?.fullName?.[0] || 'J'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-primary">{request.menteeProfile?.fullName || 'Junior'}</h3>
                          <p className="text-gray-600 text-sm">{request.menteeProfile?.year} Year</p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 mb-2"><span className="font-semibold text-primary">Message:</span></p>
                      <p className="text-gray-600 bg-background p-3 rounded-lg">{request.message}</p>
                    </div>

                    {request.domain && (
                      <p className="text-gray-700 mb-2"><span className="font-semibold text-primary">Domain:</span> {request.domain}</p>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleRespondToRequest(request._id, 'accepted')}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(request._id, 'rejected')}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <>
                        {/* Session count */}
                        {request.sessionCount > 0 && (
                          <div className="mb-4 text-sm text-gray-600">
                            <span className="font-semibold text-primary">Sessions completed:</span> {request.sessionCount}
                          </div>
                        )}
                        <div className="flex gap-2 mt-4 flex-wrap">
                          <button
                            onClick={() => openScheduleModal(request)}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                          >
                            <Calendar size={16} />
                            Schedule
                          </button>
                          <button
                            onClick={() => handleStartChat(request.menteeId._id)}
                            className="flex-1 px-4 py-2.5 rounded-lg border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition inline-flex items-center justify-center gap-2"
                          >
                            <MessageCircle size={16} />
                            Message
                          </button>
                          <button
                            onClick={() => handleCompleteMentorship(request._id)}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Complete
                          </button>
                          <button
                            onClick={() => openCancelModal(request)}
                            className="px-4 py-2.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition inline-flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                    {request.status === 'completed' && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                          onClick={() => openFeedbackModal(request)}
                          disabled={request.feedback?.menteeRating}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Star size={16} />
                          {request.feedback?.menteeRating ? 'Feedback Submitted' : 'Give Feedback'}
                        </button>
                        {request.feedback?.mentorRating && (
                          <div className="flex items-center gap-1 px-4 py-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                            <span className="text-sm font-semibold text-yellow-700">Rating:</span>
                            {[...Array(request.feedback.mentorRating)].map((_, i) => (
                              <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {receivedRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No requests received yet
                  </div>
                )}
              </div>
            )}

            {/* Sent Requests */}
            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-accent transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                          {request.mentorProfile?.fullName?.[0] || 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-primary">{request.mentorProfile?.fullName || 'Mentor'}</h3>
                            {request.mentorProfile?.placementStatus === 'placed' && (
                              <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                Mentor
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{request.mentorProfile?.company || 'N/A'}</p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 mb-2"><span className="font-semibold text-primary">Your Message:</span></p>
                      <p className="text-gray-600 bg-background p-3 rounded-lg">{request.message}</p>
                    </div>

                    {/* Action buttons based on status */}
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => openCancelModal(request)}
                          className="px-4 py-2.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition inline-flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancel Request
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                          onClick={() => handleStartChat(request.mentorId._id)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Message Mentor
                        </button>
                        <button
                          onClick={() => navigate('/meetings')}
                          className="flex-1 px-4 py-2.5 rounded-lg border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition inline-flex items-center justify-center gap-2"
                        >
                          <Calendar size={16} />
                          View Meetings
                        </button>
                      </div>
                    )}

                    {request.status === 'completed' && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <button
                          onClick={() => openFeedbackModal(request)}
                          disabled={request.feedback?.mentorRating}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Star size={16} />
                          {request.feedback?.mentorRating ? 'Feedback Submitted' : 'Rate Your Mentor'}
                        </button>
                        {request.feedback?.menteeRating && (
                          <div className="flex items-center gap-1 px-4 py-2.5 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-sm font-semibold text-green-700">Mentor's Rating:</span>
                            {[...Array(request.feedback.menteeRating)].map((_, i) => (
                              <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      Sent on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {sentRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No requests sent yet
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-primary mb-4">Send Mentorship Request</h2>
              <p className="text-gray-600 mb-6">
                To: <span className="font-semibold text-primary">{selectedMentor?.fullName}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Message *</label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    rows="4"
                    placeholder="Introduce yourself and explain why you'd like mentorship..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Domain (Optional)</label>
                  <input
                    type="text"
                    value={requestDomain}
                    onChange={(e) => setRequestDomain(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="e.g., Backend, Frontend, Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Target Companies (Optional)</label>
                  <input
                    type="text"
                    value={targetCompanies}
                    onChange={(e) => setTargetCompanies(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="Google, Microsoft, Amazon (comma-separated)"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSendRequest}
                  disabled={!requestMessage}
                  className="flex-1 px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowRequestModal(false)
                    setRequestMessage('')
                    setRequestDomain('')
                    setTargetCompanies('')
                    setSelectedMentor(null)
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Meeting Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {isRescheduling ? 'Reschedule Meeting' : 'Schedule Meeting'}
              </h2>
              <p className="text-gray-600 mb-4">
                With: <span className="font-semibold text-primary">{selectedRequest?.menteeProfile?.fullName || 'Mentee'}</span>
              </p>

              {/* Existing Meeting Warning */}
              {existingMeeting && !isRescheduling && (
                <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-amber-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-800 mb-1">Meeting Already Scheduled</p>
                      <p className="text-amber-700 text-sm mb-2">
                        <strong>{existingMeeting.title}</strong> on {new Date(existingMeeting.scheduledAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            setIsRescheduling(true)
                            setMeetingData({
                              title: existingMeeting.title,
                              description: existingMeeting.description || '',
                              scheduledAt: new Date(existingMeeting.scheduledAt).toISOString().slice(0, 16),
                              duration: existingMeeting.duration,
                              meetingType: existingMeeting.meetingType,
                              customMeetingLink: existingMeeting.meetingLink || '',
                            })
                          }}
                          className="px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={handleCancelExistingMeeting}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm"
                        >
                          Cancel Meeting
                        </button>
                        <button
                          onClick={() => navigate(`/meeting/${existingMeeting._id}`)}
                          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition text-sm"
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form - Show when no existing meeting or when rescheduling */}
              {(!existingMeeting || isRescheduling) && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Meeting Title *</label>
                      <input
                        type="text"
                        value={meetingData.title}
                        onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                        placeholder="e.g., Interview Prep Session"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Description (Optional)</label>
                      <textarea
                        value={meetingData.description}
                        onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                        rows="2"
                        placeholder="What will you discuss?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Date & Time *</label>
                      <input
                        type="datetime-local"
                        value={meetingData.scheduledAt}
                        onChange={(e) => setMeetingData({ ...meetingData, scheduledAt: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Duration</label>
                        <select
                          value={meetingData.duration}
                          onChange={(e) => setMeetingData({ ...meetingData, duration: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                        >
                          <option value={15}>15 mins</option>
                          <option value={30}>30 mins</option>
                          <option value={45}>45 mins</option>
                          <option value={60}>1 hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Type</label>
                        <select
                          value={meetingData.meetingType}
                          onChange={(e) => setMeetingData({ ...meetingData, meetingType: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                        >
                          <option value="video">Video Call</option>
                          <option value="voice">Voice Call</option>
                          <option value="chat">Chat</option>
                        </select>
                      </div>
                    </div>

                    {/* Google Meet Link Section */}
                    {(meetingData.meetingType === 'video' || meetingData.meetingType === 'voice') && (
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <label className="block text-sm font-semibold text-blue-800 mb-2">
                          📹 Google Meet / Meeting Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={meetingData.customMeetingLink}
                          onChange={(e) => setMeetingData({ ...meetingData, customMeetingLink: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        />
                        <div className="flex items-center gap-2 mt-3">
                          <a
                            href="https://meet.google.com/new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm inline-flex items-center gap-2"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                            </svg>
                            Create Google Meet
                          </a>
                          <span className="text-blue-600 text-xs">Opens in new tab - paste link here</span>
                        </div>
                        <p className="text-blue-600 text-xs mt-2">
                          💡 Leave empty to use our built-in video call (Jitsi Meet)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleScheduleMeeting}
                      disabled={!meetingData.title || !meetingData.scheduledAt}
                      className="flex-1 px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      {isRescheduling ? 'Reschedule' : 'Schedule'}
                    </button>
                    <button
                      onClick={() => {
                        setShowScheduleModal(false)
                        setMeetingData({ title: '', description: '', scheduledAt: '', duration: 30, meetingType: 'video', customMeetingLink: '' })
                        setSelectedRequest(null)
                        setExistingMeeting(null)
                        setIsRescheduling(false)
                      }}
                      className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Close button when existing meeting shown */}
              {existingMeeting && !isRescheduling && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowScheduleModal(false)
                      setExistingMeeting(null)
                      setSelectedRequest(null)
                    }}
                    className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && feedbackRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Rate Your Experience</h3>
              <p className="text-gray-600 mb-6">
                How was your mentorship session with{' '}
                <span className="font-semibold">
                  {feedbackRequest.mentorProfile?.fullName || feedbackRequest.menteeProfile?.fullName || 'your partner'}
                </span>?
              </p>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${feedbackRating >= star
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your feedback (optional)..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                rows={4}
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackRating === 0}
                  className="flex-1 px-6 py-3 rounded-lg bg-secondary text-white font-bold hover:bg-accent transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setFeedbackRequest(null)
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && cancelRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
              <h3 className="text-2xl font-bold text-red-600 mb-2">Cancel Mentorship</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this mentorship? This action cannot be undone.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none resize-none"
                rows={3}
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCancelMentorship}
                  className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-md hover:shadow-lg"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelRequest(null)
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                >
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default MentorshipPage
