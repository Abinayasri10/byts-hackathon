import mongoose from 'mongoose'

const blockedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

blockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true })

export default mongoose.model('BlockedUser', blockedUserSchema)
