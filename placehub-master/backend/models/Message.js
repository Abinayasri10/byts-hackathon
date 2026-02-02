import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'link'],
    default: 'text',
  },
  fileUrl: String,
  fileName: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ senderId: 1 })
messageSchema.index({ receiverId: 1 })

export default mongoose.model('Message', messageSchema)
