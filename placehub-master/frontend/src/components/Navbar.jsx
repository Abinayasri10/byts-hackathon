'use client';

import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Settings, FileText, Bell } from 'lucide-react'
import { notificationAPI } from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'))
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  let navLinks = []

  if (userRole === 'admin') {
    navLinks = [{ label: 'Admin Control', path: '/admin' }]
  } else {
    navLinks = [
      { label: 'Home', path: '/home' },
      { label: 'Materials', path: '/materials' },
      { label: 'Analytics', path: '/analytics' },
      { label: 'Opportunities', path: '/opportunities' },
      { label: 'Mentorship', path: '/mentorship' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ]
  }

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll({ unreadOnly: false, limit: 10 })
      setNotifications(response.data.notifications || [])
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      // Silent fail - user might not be logged in
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleNotificationClick = async (notif) => {
    // Mark as read first
    await handleMarkAsRead(notif._id)
    setNotificationDropdownOpen(false)

    // Navigate based on notification type
    const type = notif.type || ''
    const relatedId = notif.relatedId

    if (type.includes('meeting')) {
      // Meeting notification - go to meetings page or specific meeting
      if (relatedId) {
        navigate(`/meeting/${relatedId}`)
      } else {
        navigate('/meetings')
      }
    } else if (type.includes('mentorship')) {
      // Mentorship notification - go to mentorship page
      navigate('/mentorship')
    } else if (type.includes('message')) {
      // Message notification - go to messages page
      navigate('/messages')
    } else if (type.includes('question') || type.includes('answer')) {
      // Question/Answer notification - go to questions page
      navigate('/questions')
    } else if (type.includes('experience')) {
      // Experience notification - go to home/dashboard
      navigate('/home')
    } else {
      // Default - go to home
      navigate('/home')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    // Return appropriate icon based on notification type
    return '📬'
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => {
              navigate('/home')
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
              P
            </div>
            <span className="text-2xl font-bold text-primary">PlaceHub</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${isActive(link.path)
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-background hover:text-secondary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-2 hover:bg-background rounded-lg transition-all text-primary hover:text-secondary"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-accent max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-primary to-secondary">
                    <h3 className="font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-white hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-background transition-all ${!notif.isRead ? 'bg-blue-50' : ''
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-primary text-sm">{notif.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Share Experience Button - Student Only */}
            {userRole !== 'admin' && (
              <Link
                to="/share-experience"
                className="hidden md:flex px-6 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <FileText size={18} />
                Share Experience
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold hover:shadow-xl transition-all hover:scale-105"
              >
                U
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-accent py-2 animate-in fade-in-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-background hover:text-secondary transition-all font-medium"
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-background hover:text-secondary transition-all font-medium"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <Link
                    to="/my-experiences"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-background hover:text-secondary transition-all font-medium"
                  >
                    <FileText size={18} />
                    My Experiences
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all font-semibold"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-background rounded-lg transition-all text-primary hover:text-secondary"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-2 pb-4 border-t-2 border-accent pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-semibold transition-all ${isActive(link.path)
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-background hover:text-secondary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {userRole !== 'admin' && (
              <Link
                to="/share-experience"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition-all shadow-md"
              >
                <FileText size={18} />
                Share Experience
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar