import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body

    // Validate email domain (college email)
    if (!email.includes('@') || !email.match(/\.(edu|ac\.in|college\.com)$/i)) {
      return res.status(400).json({
        success: false,
        message: 'Please use a valid college email address',
      })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // Create new user
    const user = new User({ email, password })
    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      userId: user._id,
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate token
    const token = generateToken(user._id, user.role)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role,
      profileCompleted: user.profileCompleted,
      preferences: user.preferences
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { preferences: req.body } },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      preferences: user.preferences
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
