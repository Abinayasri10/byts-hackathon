import mongoose from 'mongoose'

const meetingSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  meetingType: {
    type: String,
    enum: ['chat', 'voice', 'video'],
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    default: 30,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  meetingLink: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cancelledAt: Date,
  cancelReason: String,
})

meetingSchema.index({ mentorId: 1, scheduledAt: 1 })
meetingSchema.index({ menteeId: 1, scheduledAt: 1 })
meetingSchema.index({ scheduledAt: 1, status: 1 })

export default mongoose.model('Meeting', meetingSchema)
