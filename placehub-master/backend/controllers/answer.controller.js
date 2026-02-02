import Answer from '../models/Answer.js';
import Question from '../models/Question.js';

export const addAnswer = async (req, res) => {
    try {
        const { questionId, text, senderIcon } = req.body;
        const answer = new Answer({ questionId, text, senderIcon });
        await answer.save();

        // In a real app, you might trigger an event here to notify WebSocket clients
        // For now, we'll just return the answer
        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAnswersByQuestionId = async (req, res) => {
    try {
        const answers = await Answer.find({ questionId: req.params.questionId }).sort({ createdAt: 1 });
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const reactToAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { reaction } = req.body; // e.g., '👍', '❤️', '🔥'

        const answer = await Answer.findById(answerId);
        if (!answer) return res.status(404).json({ error: 'Answer not found' });

        const currentCount = answer.reactions.get(reaction) || 0;
        answer.reactions.set(reaction, currentCount + 1);
        await answer.save();

        res.status(200).json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
