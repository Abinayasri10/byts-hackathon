import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import mentorshipRoutes from './routes/mentorshipRoutes.js'
import meetingRoutes from './routes/meetingRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

import { requestLogger } from './middlewares/loggerMiddleware.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Apply logger after basic parsing but before routes
app.use(requestLogger)

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/mentorship', mentorshipRoutes)
app.use('/api/meetings', meetingRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
