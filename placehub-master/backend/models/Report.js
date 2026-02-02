import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reportedContentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  contentType: {
    type: String,
    enum: ['user', 'message', 'question', 'answer'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
})

reportSchema.index({ reporterId: 1 })
reportSchema.index({ reportedUserId: 1 })
reportSchema.index({ status: 1 })
reportSchema.index({ createdAt: -1 })

export default mongoose.model('Report', reportSchema)
