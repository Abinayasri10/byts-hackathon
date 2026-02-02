import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
    const token = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole') // We'll set this on login

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (userRole !== 'admin') {
        return <Navigate to="/home" replace />
    }

    return children
}

export default AdminRoute
