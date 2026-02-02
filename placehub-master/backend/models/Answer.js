import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    text: {
        type: String,
        required: function () { return !this.imageUrl; },
    },
    imageUrl: {
        type: String, // Base64 or URL
    },
    sessionId: {
        type: String,
        required: true,
    },
    senderIcon: {
        type: String, // Animal icon name
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'reported'],
        default: 'open',
    },
    reactions: {
        type: Map,
        of: Number,
        default: {
            'helpful': 0,
            'clear': 0,
            'smart': 0,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Answer', answerSchema);
