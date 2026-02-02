import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http';

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import setupWebSocket from './websocket/socket.js';
import questionRoutes from './routes/question.routes.js';
import answerRoutes from './routes/answer.routes.js';
import sessionRoutes from './routes/session.routes.js';


dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/experience', experienceRoutes)

// Anon-Chat Routes
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

const server = http.createServer(app);
setupWebSocket(server);// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
