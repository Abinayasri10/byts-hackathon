import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfileSetupPage from './pages/ProfileSetupPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import ShareExperienceLanding from './pages/ShareExperienceLanding.jsx'
import ExperienceMetadataForm from './pages/ExperienceMetadataForm.jsx'
import ExperienceRoundsForm from './pages/ExperienceRoundsForm.jsx'
import ExperienceMaterialsForm from './pages/ExperienceMaterialsForm.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile-setup"
          element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>}
        />
        <Route
          path="/home"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/edit-profile"
          element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/share-experience"
          element={<ProtectedRoute><ShareExperienceLanding /></ProtectedRoute>}
        />
        <Route
          path="/share-experience/metadata"
          element={<ProtectedRoute><ExperienceMetadataForm /></ProtectedRoute>}
        />
        <Route
          path="/share-experience/rounds"
          element={<ProtectedRoute><ExperienceRoundsForm /></ProtectedRoute>}
        />
        <Route
          path="/share-experience/materials"
          element={<ProtectedRoute><ExperienceMaterialsForm /></ProtectedRoute>}
        />

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  )
}

export default App
