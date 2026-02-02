import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'
import Notification from '../models/Notification.js'
import BlockedUser from '../models/BlockedUser.js'

// Profanity filter
const profanityWords = ['badword1', 'badword2'] // Basic list
const containsProfanity = (text) => {
  const lowerText = text.toLowerCase()
  return profanityWords.some(word => lowerText.includes(word))
}

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'email')
      .sort({ lastMessageAt: -1 })

    // Get profile info for participants
    const Profile = (await import('../models/Profile.js')).default
    const conversationsWithProfiles = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participants?.find(p => p?._id?.toString() !== userId)
        let profile = null
        if (otherUser?._id) {
          profile = await Profile.findOne({ userId: otherUser._id })
        }
        return {
          ...conv.toObject(),
          otherUserProfile: profile,
        }
      })
    )

    res.json(conversationsWithProfiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user.id

    // Check if user is part of conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'email')
      .populate('receiverId', 'email')

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType, fileUrl, fileName } = req.body
    const senderId = req.user.id

    // Check if sender is blocked
    const blocked = await BlockedUser.findOne({
      $or: [
        { userId: senderId, blockedUserId: receiverId },
        { userId: receiverId, blockedUserId: senderId },
      ],
    })

    if (blocked) {
      return res.status(403).json({ message: 'Cannot send message to this user' })
    }

    // Check for profanity
    if (messageType === 'text' && containsProfanity(content)) {
      return res.status(400).json({ message: 'Message contains inappropriate content' })
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      })
      await conversation.save()
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      messageType: messageType || 'text',
      fileUrl,
      fileName,
    })

    await message.save()

    // Update conversation
    conversation.lastMessage = messageType === 'file' ? `Sent a file: ${fileName}` : content.substring(0, 100)
    conversation.lastMessageAt = new Date()

    const unreadCount = conversation.unreadCount || new Map()
    unreadCount.set(receiverId.toString(), (unreadCount.get(receiverId.toString()) || 0) + 1)
    conversation.unreadCount = unreadCount

    await conversation.save()

    // Create notification
    const notification = new Notification({
      userId: receiverId,
      type: 'message',
      title: 'New Message',
      message: 'You have a new message',
      relatedId: message._id,
      relatedModel: 'Message',
    })
    await notification.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'email')
      .populate('receiverId', 'email')

    res.status(201).json(populatedMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Start a new conversation
export const startConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body
    const userId = req.user.id

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    })

    if (conversation) {
      return res.json(conversation)
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [userId, otherUserId],
    })

    await conversation.save()
    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.user.id

    await Message.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({ message: 'Messages marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
