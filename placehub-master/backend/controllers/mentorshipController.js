import MentorshipRequest from '../models/MentorshipRequest.js'
import Notification from '../models/Notification.js'
import Profile from '../models/Profile.js'
import User from '../models/User.js'

// Get available mentors
export const getAvailableMentors = async (req, res) => {
  try {
    const { domain, page = 1, limit = 10 } = req.query

    const query = {
      placementStatus: 'placed',
    }

    if (domain) {
      query['mentorshipSettings.preferredDomains'] = domain
    }

    const mentors = await Profile.find(query)
      .populate('userId', 'email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ 'mentorshipSettings.yearOfPlacement': -1 })

    const total = await Profile.countDocuments(query)

    res.json({
      mentors,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get available mentees
export const getAvailableMentees = async (req, res) => {
  try {
    const { domain, page = 1, limit = 10 } = req.query

    const query = {
      placementStatus: 'not-placed',
    }

    if (domain) {
      query['juniorSettings.preferredDomain'] = domain
    }

    const mentees = await Profile.find(query)
      .populate('userId', 'email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Profile.countDocuments(query)

    res.json({
      mentees,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send mentorship request
export const sendMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, message, domain, targetCompanies } = req.body
    const menteeId = req.user.id

    // Check if request already exists (pending or accepted/active)
    const existing = await MentorshipRequest.findOne({
      mentorId,
      menteeId,
      status: { $in: ['pending', 'accepted'] },
    })

    if (existing) {
      const statusMsg = existing.status === 'pending'
        ? 'You already have a pending request with this mentor'
        : 'You already have an active mentorship with this mentor'
      return res.status(400).json({ message: statusMsg })
    }

    const request = new MentorshipRequest({
      mentorId,
      menteeId,
      message,
      domain,
      targetCompanies,
    })

    await request.save()

    // Create notification
    const notification = new Notification({
      userId: mentorId,
      type: 'mentorship_request',
      title: 'New Mentorship Request',
      message: 'You have received a new mentorship request',
      relatedId: request._id,
      relatedModel: 'MentorshipRequest',
    })
    await notification.save()

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get received mentorship requests (for mentors)
export const getReceivedRequests = async (req, res) => {
  try {
    const mentorId = req.user.id
    const { status } = req.query

    const query = { mentorId }
    if (status) {
      query.status = status
    }

    const requests = await MentorshipRequest.find(query)
      .populate('menteeId', 'email')
      .sort({ createdAt: -1 })

    // Get profiles for mentees
    const Profile = (await import('../models/Profile.js')).default
    const requestsWithProfiles = await Promise.all(
      requests.map(async (req) => {
        const profile = await Profile.findOne({ userId: req.menteeId._id })
        return {
          ...req.toObject(),
          menteeProfile: profile,
        }
      })
    )

    res.json(requestsWithProfiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get sent mentorship requests (for mentees)
export const getSentRequests = async (req, res) => {
  try {
    const menteeId = req.user.id
    const { status } = req.query

    const query = { menteeId }
    if (status) {
      query.status = status
    }

    const requests = await MentorshipRequest.find(query)
      .populate('mentorId', 'email')
      .sort({ createdAt: -1 })

    // Get profiles for mentors
    const Profile = (await import('../models/Profile.js')).default
    const requestsWithProfiles = await Promise.all(
      requests.map(async (req) => {
        const profile = await Profile.findOne({ userId: req.mentorId._id })
        return {
          ...req.toObject(),
          mentorProfile: profile,
        }
      })
    )

    res.json(requestsWithProfiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Respond to mentorship request
export const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status } = req.body // 'accepted' or 'rejected'
    const mentorId = req.user.id

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "accepted" or "rejected"' })
    }

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    // Compare IDs as strings for proper matching
    if (request.mentorId.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to respond to this request' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already responded to' })
    }

    request.status = status
    request.respondedAt = new Date()
    await request.save()

    // Create notification
    const notification = new Notification({
      userId: request.menteeId,
      type: status === 'accepted' ? 'mentorship_accepted' : 'mentorship_rejected',
      title: `Mentorship Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
      message: `Your mentorship request has been ${status}`,
      relatedId: request._id,
      relatedModel: 'MentorshipRequest',
    })
    await notification.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark mentorship as completed
export const completeMentorship = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user.id

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (request.mentorId.toString() !== userId && request.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted mentorships' })
    }

    request.status = 'completed'
    request.completedAt = new Date()
    await request.save()

    // Notify the other party
    const otherUserId = request.mentorId.toString() === userId ? request.menteeId : request.mentorId
    const notification = new Notification({
      userId: otherUserId,
      type: 'mentorship_completed',
      title: 'Mentorship Completed',
      message: 'Your mentorship session has been marked as completed. Please provide feedback!',
      relatedId: request._id,
      relatedModel: 'MentorshipRequest',
    })
    await notification.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Cancel mentorship request
export const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { reason } = req.body
    const userId = req.user.id

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (request.mentorId.toString() !== userId && request.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (['completed', 'cancelled'].includes(request.status)) {
      return res.status(400).json({ message: 'Cannot cancel this mentorship' })
    }

    request.status = 'cancelled'
    request.cancelledAt = new Date()
    request.cancelReason = reason || 'No reason provided'
    await request.save()

    // Notify the other party
    const otherUserId = request.mentorId.toString() === userId ? request.menteeId : request.mentorId
    const notification = new Notification({
      userId: otherUserId,
      type: 'mentorship_cancelled',
      title: 'Mentorship Cancelled',
      message: `A mentorship has been cancelled. Reason: ${request.cancelReason}`,
      relatedId: request._id,
      relatedModel: 'MentorshipRequest',
    })
    await notification.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Submit feedback after mentorship
export const submitFeedback = async (req, res) => {
  try {
    const { requestId } = req.params
    const { rating, feedback } = req.body
    const userId = req.user.id

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only submit feedback for completed mentorships' })
    }

    const isMentor = request.mentorId.toString() === userId
    const isMentee = request.menteeId.toString() === userId

    if (!isMentor && !isMentee) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (!request.feedback) {
      request.feedback = {}
    }

    if (isMentor) {
      // Mentor rating the mentee
      request.feedback.menteeRating = rating
      request.feedback.menteeFeedback = feedback
    } else {
      // Mentee rating the mentor
      request.feedback.mentorRating = rating
      request.feedback.mentorFeedback = feedback
    }

    await request.save()

    // Notify the other party
    const otherUserId = isMentor ? request.menteeId : request.mentorId
    const notification = new Notification({
      userId: otherUserId,
      type: 'feedback_received',
      title: 'Feedback Received',
      message: 'You have received feedback for your mentorship session!',
      relatedId: request._id,
      relatedModel: 'MentorshipRequest',
    })
    await notification.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get mentorship statistics
export const getMentorshipStats = async (req, res) => {
  try {
    const userId = req.user.id

    // Get profile to determine role
    const profile = await Profile.findOne({ userId })
    const isMentor = profile?.placementStatus === 'placed'

    const query = isMentor ? { mentorId: userId } : { menteeId: userId }

    const [
      totalRequests,
      pendingRequests,
      activeRequests,
      completedRequests,
      cancelledRequests,
    ] = await Promise.all([
      MentorshipRequest.countDocuments(query),
      MentorshipRequest.countDocuments({ ...query, status: 'pending' }),
      MentorshipRequest.countDocuments({ ...query, status: 'accepted' }),
      MentorshipRequest.countDocuments({ ...query, status: 'completed' }),
      MentorshipRequest.countDocuments({ ...query, status: 'cancelled' }),
    ])

    // Get average rating if mentor
    let averageRating = null
    if (isMentor) {
      const completedWithRating = await MentorshipRequest.find({
        mentorId: userId,
        status: 'completed',
        'feedback.mentorRating': { $exists: true },
      })
      if (completedWithRating.length > 0) {
        const totalRating = completedWithRating.reduce(
          (sum, r) => sum + (r.feedback?.mentorRating || 0),
          0
        )
        averageRating = (totalRating / completedWithRating.length).toFixed(1)
      }
    }

    res.json({
      totalRequests,
      pendingRequests,
      activeRequests,
      completedRequests,
      cancelledRequests,
      averageRating,
      role: isMentor ? 'mentor' : 'mentee',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update mentor notes on a request
export const updateMentorNotes = async (req, res) => {
  try {
    const { requestId } = req.params
    const { notes, goals } = req.body
    const userId = req.user.id

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    const isMentor = request.mentorId.toString() === userId
    const isMentee = request.menteeId.toString() === userId

    if (!isMentor && !isMentee) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (isMentor && notes !== undefined) {
      request.mentorNotes = notes
    }
    if (isMentee && goals !== undefined) {
      request.menteeGoals = goals
    }

    await request.save()
    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Increment session count when a meeting is completed
export const incrementSessionCount = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user.id

    const request = await MentorshipRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (request.mentorId.toString() !== userId && request.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    request.sessionCount = (request.sessionCount || 0) + 1
    await request.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
