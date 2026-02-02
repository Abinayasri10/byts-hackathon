import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warn', 'error'],
        default: 'info'
    },
    message: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    method: String,
    path: String,
    status: Number,
    ip: String,
    details: mongoose.Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Automatically delete after 7 days (7 * 24 * 60 * 60)
    }
})

logSchema.index({ createdAt: -1 })
logSchema.index({ level: 1 })

export default mongoose.model('Log', logSchema)
