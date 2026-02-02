import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If admin tries to access student routes, redirect to admin dashboard
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute
