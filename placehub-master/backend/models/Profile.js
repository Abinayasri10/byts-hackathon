import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: String,
  rollNumber: String,
  collegeEmail: String,
  whatsappNumber: String,
  year: String,
  branch: String,
  batch: Number,
  skills: [String],
  linkedinUrl: String,
  githubUrl: String,
  profilePicture: String,
  placementStatus: {
    type: String,
    enum: ['placed', 'not-placed'],
  },
  company: String,
  role: String,
  internshipType: {
    type: String,
    enum: ['internship', 'full-time'],
  },
  willingToMentor: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Profile', profileSchema)
