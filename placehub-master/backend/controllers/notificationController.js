import Notification from '../models/Notification.js'
import Report from '../models/Report.js'
import BlockedUser from '../models/BlockedUser.js'

// Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const { unreadOnly, page = 1, limit = 20 } = req.query

    const query = { userId }
    if (unreadOnly === 'true') {
      query.isRead = false
    }

    const notifications = await Notification.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ userId, isRead: false })

    res.json({
      notifications,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
      unreadCount,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    const notification = await Notification.findById(notificationId)

    if (!notification || notification.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    notification.isRead = true
    notification.readAt = new Date()
    await notification.save()

    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    const notification = await Notification.findById(notificationId)

    if (!notification || notification.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    await Notification.findByIdAndDelete(notificationId)
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Report user or content
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reportedContentId, contentType, reason, description } = req.body
    const reporterId = req.user.id

    const report = new Report({
      reporterId,
      reportedUserId,
      reportedContentId,
      contentType,
      reason,
      description,
    })

    await report.save()
    res.status(201).json({ message: 'Report submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Block user
export const blockUser = async (req, res) => {
  try {
    const { blockedUserId, reason } = req.body
    const userId = req.user.id

    if (userId === blockedUserId) {
      return res.status(400).json({ message: 'Cannot block yourself' })
    }

    // Check if already blocked
    const existing = await BlockedUser.findOne({ userId, blockedUserId })
    if (existing) {
      return res.status(400).json({ message: 'User already blocked' })
    }

    const blocked = new BlockedUser({
      userId,
      blockedUserId,
      reason,
    })

    await blocked.save()
    res.json({ message: 'User blocked successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Unblock user
export const unblockUser = async (req, res) => {
  try {
    const { blockedUserId } = req.params
    const userId = req.user.id

    await BlockedUser.findOneAndDelete({ userId, blockedUserId })
    res.json({ message: 'User unblocked successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get blocked users
export const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id

    const blocked = await BlockedUser.find({ userId })
      .populate('blockedUserId', 'email')

    // Get profiles
    const Profile = (await import('../models/Profile.js')).default
    const blockedWithProfiles = await Promise.all(
      blocked.map(async (b) => {
        const profile = await Profile.findOne({ userId: b.blockedUserId._id })
        return {
          ...b.toObject(),
          blockedUserProfile: profile,
        }
      })
    )

    res.json(blockedWithProfiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
