import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // This should stay required
    },
    companyName: {
      type: String,
      // Change: Required only if NOT a draft
      required: function() { return this.status !== 'draft'; }
    },
    roleAppliedFor: {
      type: String,
      required: function() { return this.status !== 'draft'; }
    },
    batch: {
      type: String,
      required: function() { return this.status !== 'draft'; }
    },
    outcome: {
      type: String,
      enum: ['selected', 'not-selected', 'in-process'],
      required: function() { return this.status !== 'draft'; }
    },
    package: {
      type: String,
    },
    placementSeason: {
      type: String,
      enum: ['on-campus', 'off-campus'],
      default: 'on-campus',
    },
    interviewDate: {
      year: String,
      month: String,
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    preparationTime: {
      type: String, // in weeks
    },
    overallExperienceRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    rounds: {
  type: [mongoose.Schema.Types.Mixed],
  default: []
},
    materials: [
      {
        id: String,
        type: String,
        title: String,
        url: String,
        description: String,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
experienceSchema.index({ userId: 1 })
experienceSchema.index({ companyName: 1 })
experienceSchema.index({ batch: 1 })
experienceSchema.index({ status: 1 })
experienceSchema.index({ createdAt: -1 })

const Experience = mongoose.model('Experience', experienceSchema)

export default Experience
