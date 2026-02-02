import Session from '../models/Session.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

export const initSession = async (req, res) => {
    try {
        const { sessionId, animalIcon } = req.body;
        let session = await Session.findOne({ sessionId });

        if (!session) {
            session = new Session({ sessionId, animalIcon });
            await session.save();
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSessionStats = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Count answers by status for this session
        const stats = await Answer.aggregate([
            { $match: { sessionId } },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'questionId',
                    foreignField: '_id',
                    as: 'question'
                }
            },
            { $unwind: '$question' },
            {
                $group: {
                    _id: '$question.status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            open: 0,
            active: 0,
            archived: 0,
            reported: 0,
            total: 0
        };

        stats.forEach(s => {
            formattedStats[s._id] = s.count;
            formattedStats.total += s.count;
        });

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
