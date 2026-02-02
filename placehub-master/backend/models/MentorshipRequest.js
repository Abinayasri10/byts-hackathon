import mongoose from 'mongoose'

const mentorshipRequestSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  domain: String,
  targetCompanies: [String],
  // New fields for real-world scenarios
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  sessionCount: {
    type: Number,
    default: 0,
  },
  mentorNotes: String,
  menteeGoals: String,
  // Feedback after completion
  feedback: {
    mentorRating: { type: Number, min: 1, max: 5 },
    mentorFeedback: String,
    menteeRating: { type: Number, min: 1, max: 5 },
    menteeFeedback: String,
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String,
})

mentorshipRequestSchema.index({ mentorId: 1, status: 1 })
mentorshipRequestSchema.index({ menteeId: 1, status: 1 })
mentorshipRequestSchema.index({ createdAt: -1 })
mentorshipRequestSchema.index({ status: 1, priority: 1 })

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema)
