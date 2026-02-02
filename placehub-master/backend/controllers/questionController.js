import Question from '../models/Question.js'
import Notification from '../models/Notification.js'
import Profile from '../models/Profile.js'

// Create a question
export const createQuestion = async (req, res) => {
  try {
    const { title, content, tags, domain, company } = req.body
    const userId = req.user.id

    const question = new Question({
      userId,
      title,
      content,
      tags: tags || [],
      domain,
      company,
    })

    await question.save()
    res.status(201).json(question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const { domain, company, tags, page = 1, limit = 10 } = req.query

    const query = {}
    if (domain) query.domain = domain
    if (company) query.company = company
    if (tags) query.tags = { $in: tags.split(',') }

    const questions = await Question.find(query)
      .populate('userId', 'email')
      .populate('answers.userId', 'email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    // Get profiles for question authors
    const questionsWithProfiles = await Promise.all(
      questions.map(async (q) => {
        const userId = q.userId?._id
        const profile = userId ? await Profile.findOne({ userId }) : null

        const answersWithProfiles = await Promise.all(
          (q.answers || []).map(async (ans) => {
            const ansUserId = ans.userId?._id
            const ansProfile = ansUserId ? await Profile.findOne({ userId: ansUserId }) : null
            return {
              ...ans.toObject(),
              userProfile: ansProfile,
            }
          })
        )
        return {
          ...q.toObject(),
          userProfile: profile,
          answers: answersWithProfiles,
        }
      })
    )

    const total = await Question.countDocuments(query)

    res.json({
      questions: questionsWithProfiles,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params

    const question = await Question.findById(questionId)
      .populate('userId', 'email')
      .populate('answers.userId', 'email')

    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Increment views
    question.views += 1
    await question.save()

    const userId = question.userId?._id
    const profile = userId ? await Profile.findOne({ userId }) : null

    const answersWithProfiles = await Promise.all(
      (question.answers || []).map(async (ans) => {
        const ansUserId = ans.userId?._id
        const ansProfile = ansUserId ? await Profile.findOne({ userId: ansUserId }) : null
        return {
          ...ans.toObject(),
          userProfile: ansProfile,
        }
      })
    )

    res.json({
      ...question.toObject(),
      userProfile: profile,
      answers: answersWithProfiles,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user's questions
export const getMyQuestions = async (req, res) => {
  try {
    const userId = req.user.id

    const questions = await Question.find({ userId })
      .sort({ createdAt: -1 })

    res.json(questions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add an answer
export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params
    const { content } = req.body
    const userId = req.user.id

    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    question.answers.push({
      userId,
      content,
    })

    question.updatedAt = new Date()
    await question.save()

    // Notify question author
    if (question.userId.toString() !== userId) {
      const notification = new Notification({
        userId: question.userId,
        type: 'question_answered',
        title: 'Your Question Was Answered',
        message: 'Someone answered your question',
        relatedId: question._id,
        relatedModel: 'Question',
      })
      await notification.save()
    }

    const updatedQuestion = await Question.findById(questionId)
      .populate('userId', 'email')
      .populate('answers.userId', 'email')

    res.json(updatedQuestion)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark answer as helpful
export const markAnswerHelpful = async (req, res) => {
  try {
    const { questionId, answerId } = req.params

    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    const answer = question.answers.id(answerId)

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' })
    }

    answer.isHelpful += 1
    await question.save()

    // Notify answer author
    const notification = new Notification({
      userId: answer.userId,
      type: 'answer_helpful',
      title: 'Your Answer Was Marked Helpful',
      message: 'Someone found your answer helpful',
      relatedId: question._id,
      relatedModel: 'Question',
    })
    await notification.save()

    res.json(question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark question as resolved
export const markAsResolved = async (req, res) => {
  try {
    const { questionId } = req.params
    const userId = req.user.id

    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    if (question.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Only question author can mark as resolved' })
    }

    question.isResolved = !question.isResolved
    question.updatedAt = new Date()
    await question.save()

    res.json(question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    const userId = req.user.id

    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    if (question.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Only question author can delete' })
    }

    await Question.findByIdAndDelete(questionId)
    res.json({ message: 'Question deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
