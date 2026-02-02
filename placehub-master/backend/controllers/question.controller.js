import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

export const createQuestion = async (req, res) => {
    try {
        const { text, sessionId } = req.body;
        const question = new Question({ text, sessionId });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.aggregate([
            {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
                    foreignField: 'questionId',
                    as: 'answers'
                }
            },
            {
                $project: {
                    text: 1,
                    status: 1,
                    aiSummary: 1,
                    createdAt: 1,
                    answerCount: { $size: '$answers' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateQuestionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
