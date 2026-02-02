import mongoose from 'mongoose'

const experienceMetadataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        roleAppliedFor: {
            type: String,
            required: true,
        },
        batch: {
            type: String,
            required: true,
        },
        package: {
            type: String,
        },
        placementSeason: {
            type: String,
            enum: ['on-campus', 'off-campus'],
            default: 'on-campus',
        },
        interviewYear: {
            type: String,
        },
        interviewMonth: {
            type: String,
        },
        difficultyRating: {
            type: String,
        },
        preparationTime: {
            type: String,
        },
        overallExperienceRating: {
            type: String,
        },
        outcome: {
            type: String,
            enum: ['selected', 'not-selected', 'in-process'],
            default: 'in-process',
        },
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

const ExperienceMetadata = mongoose.model('ExperienceMetadata', experienceMetadataSchema)

export default ExperienceMetadata
