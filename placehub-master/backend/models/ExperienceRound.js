import mongoose from 'mongoose'

const experienceRoundSchema = new mongoose.Schema(
    {
        experienceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExperienceMetadata',
            required: true,
            unique: true, // One entry per experience
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rounds: {
            type: [mongoose.Schema.Types.Mixed], // storing the flexible round data
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

const ExperienceRound = mongoose.model('ExperienceRound', experienceRoundSchema)

export default ExperienceRound
