import Profile from '../models/Profile.js'
import User from '../models/User.js'

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const profileData = req.body

    // Check if profile already exists
    let profile = await Profile.findOne({ userId })
    if (profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists',
      })
    }

    // Create new profile
    profile = new Profile({
      userId,
      ...profileData,
    })

    await profile.save()

    // Update user profileCompleted flag
    await User.findByIdAndUpdate(userId, { profileCompleted: true })

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const profile = await Profile.findOne({ userId })
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      })
    }

    res.status(200).json({
      success: true,
      profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Validation rules
const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  },
  url: (url) => {
    if (!url) return true // URLs are optional
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  fullName: (name) => {
    const trimmed = name.trim()
    return trimmed.length >= 2 && trimmed.length <= 100
  },
  rollNumber: (rollNum) => {
    return rollNum.length >= 3
  },
  batch: (batch) => {
    const year = parseInt(batch)
    const currentYear = new Date().getFullYear()
    return year >= 2000 && year <= currentYear + 10
  },
  skills: (skills) => {
    return Array.isArray(skills) && skills.length >= 1 && skills.length <= 20
  },
}

const validateProfileData = (data, requiredFields = []) => {
  const errors = {}

  // Check required fields
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`
    }
  }

  // Validate specific fields if provided
  if (data.fullName && !validators.fullName(data.fullName)) {
    errors.fullName = 'Full name must be between 2 and 100 characters'
  }

  if (data.collegeEmail && !validators.email(data.collegeEmail)) {
    errors.collegeEmail = 'Invalid email format'
  }

  if (data.whatsappNumber && !validators.phone(data.whatsappNumber)) {
    errors.whatsappNumber = 'Phone number must be 10 digits'
  }

  if (data.linkedinUrl && !validators.url(data.linkedinUrl)) {
    errors.linkedinUrl = 'Invalid LinkedIn URL'
  }

  if (data.githubUrl && !validators.url(data.githubUrl)) {
    errors.githubUrl = 'Invalid GitHub URL'
  }

  if (data.batch && !validators.batch(data.batch)) {
    errors.batch = 'Batch year must be between 2000 and ' + (new Date().getFullYear() + 10)
  }

  if (data.skills && !validators.skills(data.skills)) {
    errors.skills = 'Skills must contain between 1 and 20 items'
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const profileData = req.body

    // Validate provided data
    const validationErrors = validateProfileData(profileData)
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      })
    }

    let profile = await Profile.findOne({ userId })
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      })
    }

    // Allowed fields to update
    const allowedFields = [
      'fullName',
      'rollNumber',
      'collegeEmail',
      'whatsappNumber',
      'year',
      'branch',
      'batch',
      'skills',
      'linkedinUrl',
      'githubUrl',
      'profilePicture',
      'placementStatus',
      'company',
      'role',
      'internshipType',
      'willingToMentor',
    ]

    // Update only allowed fields
    for (const field of allowedFields) {
      if (field in profileData) {
        profile[field] = profileData[field]
      }
    }

    profile.updatedAt = new Date()
    await profile.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
