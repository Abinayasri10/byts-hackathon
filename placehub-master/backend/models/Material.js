import mongoose from 'mongoose'

const MATERIAL_CATEGORIES = [
  'DSA',
  'System Design',
  'Core Subjects',
  'Behavioral',
  'Company Insights',
  'Aptitude',
  'Projects',
  'AI & ML',
  'General',
]

const MATERIAL_TYPES = ['link', 'document', 'code', 'note', 'resource']
const CONTENT_FORMATS = ['article', 'video', 'playlist', 'guide', 'cheatsheet', 'course', 'project']
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced']

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: MATERIAL_TYPES,
      default: 'link',
    },
    category: {
      type: String,
      enum: MATERIAL_CATEGORIES,
      default: 'General',
    },
    topics: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: 'beginner',
    },
    format: {
      type: String,
      enum: CONTENT_FORMATS,
      default: 'article',
    },
    estimatedTime: {
      type: String,
    },
    url: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    roleFocus: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    placementSeason: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sourceExperience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
    },
    sourceMaterialId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'approved',
    },
    heroTheme: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    engagement: {
      likes: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
)

materialSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  topics: 'text',
  tags: 'text',
  companyName: 'text',
  roleFocus: 'text',
})

export default mongoose.model('Material', materialSchema)
