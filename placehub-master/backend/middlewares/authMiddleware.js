import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    // Normalize user ID to both common fields
    if (decoded.userId && !decoded.id) req.user.id = decoded.userId
    if (decoded.id && !decoded.userId) req.user.userId = decoded.id

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    // We assume authenticate middleware has already run
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Checking if role is in token, or we might need to fetch user from DB to be safe
    // For now let's check req.user.role which we'll add to the JWT
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const authMiddleware = authenticate
export default authenticate
