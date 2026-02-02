import User from '../models/User.js'
import Profile from '../models/Profile.js'
import Question from '../models/Question.js'
import Meeting from '../models/Meeting.js'
import Log from '../models/Log.js'

// Helper to get admin IDs
const getAdminIds = async () => {
    const admins = await User.find({ role: 'admin' }).select('_id')
    return admins.map(a => a._id)
}

// Get high-level stats for the dashboard
export const getStats = async (req, res) => {
    try {
        const adminIds = await getAdminIds()

        const [totalStudents, totalPlacedStudents, totalProblems] = await Promise.all([
            Profile.countDocuments({ userId: { $nin: adminIds }, placementStatus: 'not-placed' }),
            Profile.countDocuments({ userId: { $nin: adminIds }, placementStatus: 'placed' }),
            Question.countDocuments()
        ])

        const totalUsers = totalStudents + totalPlacedStudents

        // Aggregations
        const [studentsByYear, problemsByDifficulty, problemsOverTime, placedByCompany, placedByRole, placedByYear] = await Promise.all([
            // Students by Passing Year (Batch)
            Profile.aggregate([
                { $match: { userId: { $nin: adminIds } } },
                { $group: { _id: '$batch', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            // Problems by Difficulty
            Question.aggregate([
                { $group: { _id: '$difficulty', count: { $sum: 1 } } }
            ]),
            // Problems Uploaded Over Time (per month)
            Question.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 6 }
            ]),
            // Placed Students by Company
            Profile.aggregate([
                { $match: { placementStatus: 'placed', userId: { $nin: adminIds } } },
                { $group: { _id: '$company', value: { $sum: 1 } } },
                { $sort: { value: -1 } },
                { $limit: 5 }
            ]),
            // Placed Students by Role
            Profile.aggregate([
                { $match: { placementStatus: 'placed', userId: { $nin: adminIds } } },
                { $group: { _id: '$role', value: { $sum: 1 } } },
                { $sort: { value: -1 } },
                { $limit: 5 }
            ]),
            // Students Placed by Passing Year
            Profile.aggregate([
                { $match: { placementStatus: 'placed', userId: { $nin: adminIds } } },
                { $group: { _id: '$batch', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ])

        const placementDistribution = [
            { name: 'Students', value: totalStudents },
            { name: 'Placed', value: totalPlacedStudents }
        ]

        res.json({
            summary: { totalUsers, totalStudents, totalPlacedStudents, totalProblems },
            charts: {
                studentsByYear,
                problemsByDifficulty,
                placementDistribution,
                problemsOverTime,
                placedByCompany,
                placedByRole,
                placedByYear
            }
        })
    } catch (error) {
        console.error('Stats Error:', error)
        res.status(500).json({ status: 'error', message: error.message })
    }
}

// Unified User List
export const getManageableUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const adminIds = await getAdminIds()

        const query = { userId: { $nin: adminIds } }
        if (search) {
            query.$or = [
                { fullName: { $regex: search.trim(), $options: 'i' } },
                { collegeEmail: { $regex: search.trim(), $options: 'i' } }
            ]
        }

        const [students, total] = await Promise.all([
            Profile.find(query)
                .populate('userId', 'email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Profile.countDocuments(query)
        ])

        res.json({
            students,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
        })
    } catch (error) {
        console.error('Users Error:', error)
        res.status(500).json({ status: 'error', message: error.message })
    }
}

// Get Problems List
export const getProblems = async (req, res) => {
    try {
        const { difficulty, search, page = 1, limit = 10 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const query = {}
        if (difficulty && difficulty !== 'All') query.difficulty = difficulty
        if (search) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { tags: { $in: [new RegExp(search.trim(), 'i')] } }
            ]
        }

        const [problems, total] = await Promise.all([
            Question.find(query)
                .populate('userId', 'email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Question.countDocuments(query)
        ])

        // Safe profile enrichment
        const problemsWithProfile = await Promise.all(problems.map(async (p) => {
            const profile = p.userId ? await Profile.findOne({ userId: p.userId._id }) : null
            return { ...p.toObject(), profile }
        }))

        res.json({
            problems: problemsWithProfile,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
        })
    } catch (error) {
        console.error('Problems Error:', error)
        res.status(500).json({ status: 'error', message: error.message })
    }
}

// Details
export const getStudentDetail = async (req, res) => {
    try {
        const { id } = req.params
        const profile = await Profile.findById(id).populate('userId', 'email')
        if (!profile) return res.status(404).json({ message: 'Student not found' })

        const [problems, meetings] = await Promise.all([
            Question.find({ userId: profile.userId?._id }),
            Meeting.find({ $or: [{ mentorId: profile.userId?._id }, { menteeId: profile.userId?._id }] })
        ])

        res.json({ profile, problems, meetings })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getProblemDetail = async (req, res) => {
    try {
        const { id } = req.params
        const problem = await Question.findById(id).populate('userId', 'email')
        if (!problem) return res.status(404).json({ message: 'Problem not found' })

        const profile = problem.userId ? await Profile.findOne({ userId: problem.userId._id }) : null
        res.json({ problem, profile })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Specialized lists for students/placed
export const getStudents = async (req, res) => {
    req.query.status = 'not-placed'
    return getFilteredUserList(req, res)
}

export const getPlacedStudents = async (req, res) => {
    req.query.status = 'placed'
    return getFilteredUserList(req, res)
}

const getFilteredUserList = async (req, res) => {
    try {
        const { status, search, year, page = 1, limit = 10 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const adminIds = await getAdminIds()

        const query = { userId: { $nin: adminIds }, placementStatus: status }
        if (year) query.batch = parseInt(year)
        if (search) {
            query.$or = [
                { fullName: { $regex: search.trim(), $options: 'i' } },
                { collegeEmail: { $regex: search.trim(), $options: 'i' } }
            ]
        }

        const [students, total] = await Promise.all([
            Profile.find(query)
                .populate('userId', 'email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Profile.countDocuments(query)
        ])

        res.json({
            students,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Specialised Deletions with notifications
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params
        const { reason } = req.body

        const problem = await Question.findById(id).populate('userId', 'email')
        if (!problem) return res.status(404).json({ message: 'Problem not found' })

        const uploaderEmail = problem.userId?.email
        const problemTitle = problem.title

        // Delete problem
        await Question.findByIdAndDelete(id)

        // Mock Email
        if (uploaderEmail) {
            console.log(`
                📧 EMAIL SENT TO: ${uploaderEmail}
                SUBJECT: Notification - Content Removal
                MESSAGE: Hello, your problem titled "${problemTitle}" has been removed from the platform.
                REASON: ${reason || 'Violation of community guidelines.'}
                DETAILS: Please ensure your future contributions align with our quality standards.
            `)
        }

        res.json({ message: 'Problem removed and notification sent to uploader.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Meetings management for admin
export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate('mentorId', 'email')
            .populate('menteeId', 'email')
            .sort({ scheduledAt: -1 })
        res.json(meetings)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body
        const meeting = await Meeting.findByIdAndUpdate(id, updateData, { new: true })
        res.json(meeting)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params
        const profile = await Profile.findById(id)
        if (!profile) return res.status(404).json({ message: 'Student not found' })

        const userId = profile.userId
        await Profile.findByIdAndDelete(id)
        if (userId) {
            await User.findByIdAndDelete(userId)
            await Question.deleteMany({ userId })
        }

        res.json({ message: 'Record removed successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get System Logs
export const getLogs = async (req, res) => {
    try {
        const { level, limit = 50, page = 1 } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const query = {}
        if (level && level !== 'All') query.level = level

        const [logs, total] = await Promise.all([
            Log.find(query)
                .populate('userId', 'email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Log.countDocuments(query)
        ])

        res.json({
            logs,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
