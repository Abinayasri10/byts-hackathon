import mongoose from 'mongoose'

const OPPORTUNITY_TYPES = ['internship', 'full-time', 'contract', 'fellowship']
const OPPORTUNITY_CATEGORIES = ['Software', 'Hardware', 'Design', 'Content', 'Business', 'Others']
const LOCATION_TYPES = ['on-site', 'hybrid', 'remote']
const EXPERIENCE_LEVELS = ['fresher', '0-1 years', '1-3 years', '3+ years']

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: OPPORTUNITY_CATEGORIES,
      default: 'General',
    },
    opportunityType: {
      type: String,
      enum: OPPORTUNITY_TYPES,
      default: 'internship',
    },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      default: 'fresher',
    },
    location: {
      type: String,
      trim: true,
    },
    locationType: {
      type: String,
      enum: LOCATION_TYPES,
      default: 'hybrid',
    },
    stipendMin: Number,
    stipendMax: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    salaryNotes: String,
    applicationUrl: String,
    applicationEmail: String,
    deadline: Date,
    tags: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    description: String,
    responsibilities: String,
    perks: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed'],
      default: 'active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    source: String,
  },
  {
    timestamps: true,
  }
)

opportunitySchema.index({
  title: 'text',
  companyName: 'text',
  category: 'text',
  tags: 'text',
  skills: 'text',
})

export default mongoose.model('Opportunity', opportunitySchema)
