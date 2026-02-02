import mongoose from 'mongoose'

const experienceMaterialSchema = new mongoose.Schema(
    {
        experienceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExperienceMetadata',
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        materials: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

const ExperienceMaterial = mongoose.model('ExperienceMaterial', experienceMaterialSchema)

export default ExperienceMaterial
