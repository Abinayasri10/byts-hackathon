import Meeting from '../models/Meeting.js'
import Notification from '../models/Notification.js'
import Profile from '../models/Profile.js'

// Create a meeting
export const createMeeting = async (req, res) => {
  try {
    const { mentorId, menteeId, title, description, meetingType, scheduledAt, duration } = req.body
    const userId = req.user.id

    // Determine mentor and mentee based on who is creating the meeting
    let actualMentorId, actualMenteeId

    if (mentorId) {
      // Mentee is scheduling with a mentor
      actualMentorId = mentorId
      actualMenteeId = userId
    } else if (menteeId) {
      // Mentor is scheduling with a mentee
      actualMentorId = userId
      actualMenteeId = menteeId
    } else {
      return res.status(400).json({ message: 'Either mentorId or menteeId is required' })
    }

    // Check if mentor profile exists and is valid
    const mentorProfile = await Profile.findOne({ userId: actualMentorId })
    if (!mentorProfile || mentorProfile.placementStatus !== 'placed') {
      return res.status(400).json({ message: 'Invalid mentor' })
    }

    // Generate unique meeting room ID for fallback
    const roomId = `placehub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Use custom meeting link if provided (Google Meet, Zoom, etc.), otherwise generate Jitsi link
    let meetingLink = null
    if (meetingType === 'video' || meetingType === 'voice') {
      if (req.body.meetingLink && req.body.meetingLink.trim()) {
        // Use custom link (Google Meet, Zoom, Teams, etc.)
        meetingLink = req.body.meetingLink.trim()
      } else {
        // Fallback to Jitsi Meet - free, open-source video conferencing
        meetingLink = `https://meet.jit.si/${roomId}`
      }
    }

    const meeting = new Meeting({
      mentorId: actualMentorId,
      menteeId: actualMenteeId,
      title,
      description,
      meetingType,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 30,
      meetingLink,
    })

    await meeting.save()

    // Create notifications for both users
    const notifications = [
      {
        userId: actualMentorId,
        type: 'meeting_scheduled',
        title: 'New Meeting Scheduled',
        message: `A meeting has been scheduled for ${new Date(scheduledAt).toLocaleString()}`,
        relatedId: meeting._id,
        relatedModel: 'Meeting',
      },
      {
        userId: actualMenteeId,
        type: 'meeting_scheduled',
        title: 'Meeting Confirmed',
        message: `Your meeting has been scheduled for ${new Date(scheduledAt).toLocaleString()}`,
        relatedId: meeting._id,
        relatedModel: 'Meeting',
      },
    ]

    await Notification.insertMany(notifications)

    res.status(201).json(meeting)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user's meetings
export const getMeetings = async (req, res) => {
  try {
    const userId = req.user.id
    const { type, status } = req.query

    const query = {
      $or: [{ mentorId: userId }, { menteeId: userId }],
    }

    if (type === 'upcoming') {
      query.scheduledAt = { $gte: new Date() }
      query.status = 'scheduled'
    } else if (type === 'past') {
      query.$or = [
        { scheduledAt: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled'] } },
      ]
    }

    if (status) {
      query.status = status
    }

    const meetings = await Meeting.find(query)
      .populate('mentorId', 'email')
      .populate('menteeId', 'email')
      .sort({ scheduledAt: type === 'past' ? -1 : 1 })

    // Get profiles
    const meetingsWithProfiles = await Promise.all(
      meetings.map(async (meeting) => {
        const mentorProfile = await Profile.findOne({ userId: meeting.mentorId._id })
        const menteeProfile = await Profile.findOne({ userId: meeting.menteeId._id })
        return {
          ...meeting.toObject(),
          mentorProfile,
          menteeProfile,
        }
      })
    )

    res.json(meetingsWithProfiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const { meetingId } = req.params
    const userId = req.user.id

    const meeting = await Meeting.findById(meetingId)
      .populate('mentorId', 'email')
      .populate('menteeId', 'email')

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    if (meeting.mentorId._id.toString() !== userId && meeting.menteeId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const mentorProfile = await Profile.findOne({ userId: meeting.mentorId._id })
    const menteeProfile = await Profile.findOne({ userId: meeting.menteeId._id })

    res.json({
      ...meeting.toObject(),
      mentorProfile,
      menteeProfile,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update meeting (reschedule)
export const updateMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params
    const { scheduledAt, title, description } = req.body
    const userId = req.user.id

    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    if (meeting.mentorId.toString() !== userId && meeting.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (scheduledAt) {
      meeting.scheduledAt = new Date(scheduledAt)
      meeting.status = 'rescheduled'

      // Notify other user
      const otherUserId = meeting.mentorId.toString() === userId ? meeting.menteeId : meeting.mentorId
      const notification = new Notification({
        userId: otherUserId,
        type: 'meeting_scheduled',
        title: 'Meeting Rescheduled',
        message: `A meeting has been rescheduled to ${new Date(scheduledAt).toLocaleString()}`,
        relatedId: meeting._id,
        relatedModel: 'Meeting',
      })
      await notification.save()
    }

    if (title) meeting.title = title
    if (description) meeting.description = description

    await meeting.save()
    res.json(meeting)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Cancel meeting
export const cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params
    const { reason } = req.body
    const userId = req.user.id

    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    if (meeting.mentorId.toString() !== userId && meeting.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    meeting.status = 'cancelled'
    meeting.cancelledAt = new Date()
    meeting.cancelReason = reason
    await meeting.save()

    // Notify other user
    const otherUserId = meeting.mentorId.toString() === userId ? meeting.menteeId : meeting.mentorId
    const notification = new Notification({
      userId: otherUserId,
      type: 'meeting_cancelled',
      title: 'Meeting Cancelled',
      message: `A meeting scheduled for ${meeting.scheduledAt.toLocaleString()} has been cancelled`,
      relatedId: meeting._id,
      relatedModel: 'Meeting',
    })
    await notification.save()

    res.json(meeting)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Complete meeting
export const completeMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params
    const { notes } = req.body
    const userId = req.user.id

    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' })
    }

    if (meeting.mentorId.toString() !== userId && meeting.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    meeting.status = 'completed'
    if (notes) meeting.notes = notes
    await meeting.save()

    res.json(meeting)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
