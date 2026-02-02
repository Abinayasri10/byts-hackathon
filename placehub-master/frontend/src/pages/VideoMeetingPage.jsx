'use client';

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Video, Mic, MicOff, VideoOff, Phone, Users, Clock, Calendar } from 'lucide-react'
import { meetingAPI } from '../services/api'

function VideoMeetingPage() {
    const { meetingId } = useParams()
    const navigate = useNavigate()
    const jitsiContainerRef = useRef(null)
    const jitsiApiRef = useRef(null)
    const [meeting, setMeeting] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [jitsiLoaded, setJitsiLoaded] = useState(false)
    const [inCall, setInCall] = useState(false)
    const [pendingStart, setPendingStart] = useState(false)
    const currentUserId = localStorage.getItem('userId')

    useEffect(() => {
        fetchMeeting()
    }, [meetingId])

    useEffect(() => {
        // Load Jitsi Meet External API
        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement('script')
            script.src = 'https://meet.jit.si/external_api.js'
            script.async = true
            script.onload = () => setJitsiLoaded(true)
            script.onerror = () => console.error('Failed to load Jitsi API')
            document.body.appendChild(script)
        } else {
            setJitsiLoaded(true)
        }
    }, [])

    // Initialize Jitsi when inCall is true and container is ready
    useEffect(() => {
        if (inCall && pendingStart && jitsiLoaded && meeting && jitsiContainerRef.current) {
            initializeJitsi()
            setPendingStart(false)
        }
    }, [inCall, pendingStart, jitsiLoaded, meeting])

    const fetchMeeting = async () => {
        try {
            setLoading(true)
            const response = await meetingAPI.getMeetingById(meetingId)
            setMeeting(response.data)
        } catch (err) {
            console.error('Error fetching meeting:', err)
            setError('Failed to load meeting details')
        } finally {
            setLoading(false)
        }
    }

    const startMeeting = () => {
        if (!jitsiLoaded || !meeting) {
            console.error('Cannot start meeting: Jitsi not loaded or no meeting data')
            return
        }
        // Set inCall to true first, which will render the container
        setInCall(true)
        setPendingStart(true)
    }

    const initializeJitsi = () => {
        if (!jitsiContainerRef.current || jitsiApiRef.current) return

        // Extract room name from meeting link or use meeting ID
        let roomName = `placehub-meeting-${meetingId}`
        if (meeting.meetingLink && meeting.meetingLink.includes('meet.jit.si')) {
            const urlParts = meeting.meetingLink.split('/')
            roomName = urlParts[urlParts.length - 1]
        }

        // Determine user display name
        const isMentor = meeting.mentorId?._id === currentUserId || meeting.mentorId === currentUserId
        const userProfile = isMentor ? meeting.mentorProfile : meeting.menteeProfile
        const displayName = userProfile?.fullName || 'PlaceHub User'

        // Initialize Jitsi Meet
        const domain = 'meet.jit.si'
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: displayName,
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: meeting.meetingType === 'voice',
                disableDeepLinking: true,
                prejoinPageEnabled: false,
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'download', 'help', 'mute-everyone', 'security'
                ],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_BACKGROUND: '#1a1a2e',
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
                MOBILE_APP_PROMO: false,
            },
        }

        try {
            const api = new window.JitsiMeetExternalAPI(domain, options)
            jitsiApiRef.current = api

            api.addEventListener('readyToClose', () => {
                jitsiApiRef.current = null
                setInCall(false)
                navigate('/meetings')
            })

            api.addEventListener('participantLeft', () => {
                // Handle participant leaving
            })
        } catch (err) {
            console.error('Failed to initialize Jitsi:', err)
            setInCall(false)
        }
    }

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading meeting...</div>
            </div>
        )
    }

    if (error || !meeting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error || 'Meeting not found'}</p>
                    <Link to="/meetings" className="text-purple-400 hover:text-purple-300 underline">
                        Back to Meetings
                    </Link>
                </div>
            </div>
        )
    }

    const isMentor = meeting.mentorId?._id === currentUserId || meeting.mentorId === currentUserId
    const otherProfile = isMentor ? meeting.menteeProfile : meeting.mentorProfile

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {!inCall ? (
                // Pre-meeting lobby
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            to="/meetings"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Meeting Room</h1>
                    </div>

                    {/* Meeting Info Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                                {otherProfile?.fullName?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{meeting.title}</h2>
                                <p className="text-gray-300 mb-4">
                                    Meeting with <span className="text-purple-400 font-semibold">{otherProfile?.fullName || 'User'}</span>
                                    {otherProfile?.company && (
                                        <span className="text-gray-400"> • {otherProfile.company}</span>
                                    )}
                                </p>
                                {meeting.description && (
                                    <p className="text-gray-400">{meeting.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                                <Calendar className="text-purple-400" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">Date & Time</p>
                                    <p className="text-white font-semibold">{formatDateTime(meeting.scheduledAt)}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                                <Clock className="text-purple-400" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">Duration</p>
                                    <p className="text-white font-semibold">{meeting.duration} minutes</p>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                                {meeting.meetingType === 'video' ? (
                                    <Video className="text-purple-400" size={24} />
                                ) : (
                                    <Phone className="text-purple-400" size={24} />
                                )}
                                <div>
                                    <p className="text-gray-400 text-sm">Type</p>
                                    <p className="text-white font-semibold capitalize">{meeting.meetingType} Call</p>
                                </div>
                            </div>
                        </div>

                        {/* Join Button - Only ONE option */}
                        <div className="flex flex-col items-center gap-4">
                            {meeting.meetingLink && !meeting.meetingLink.includes('meet.jit.si') ? (
                                <>
                                    {/* External Meeting Link (Google Meet, Zoom, Teams) */}
                                    <a
                                        href={meeting.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-lg hover:from-blue-500 hover:to-green-500 transition shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3"
                                    >
                                        {meeting.meetingLink.includes('meet.google.com') ? (
                                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                                            </svg>
                                        ) : meeting.meetingType === 'video' ? (
                                            <Video size={24} />
                                        ) : (
                                            <Phone size={24} />
                                        )}
                                        {meeting.meetingLink.includes('meet.google.com')
                                            ? 'Join on Google Meet'
                                            : meeting.meetingLink.includes('zoom.us')
                                                ? 'Join on Zoom'
                                                : meeting.meetingLink.includes('teams.microsoft')
                                                    ? 'Join on Teams'
                                                    : 'Join Meeting'
                                        }
                                    </a>
                                    <p className="text-gray-400 text-sm">Opens in a new tab</p>
                                </>
                            ) : (
                                <>
                                    {/* Built-in Jitsi Meeting */}
                                    <button
                                        onClick={startMeeting}
                                        disabled={!jitsiLoaded}
                                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                    >
                                        {meeting.meetingType === 'video' ? <Video size={24} /> : <Phone size={24} />}
                                        {jitsiLoaded ? 'Join Meeting' : 'Loading...'}
                                    </button>
                                    <p className="text-gray-500 text-xs">Powered by Jitsi Meet</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Before You Join</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                Make sure your camera and microphone are working
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                Find a quiet, well-lit space for the meeting
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                Have your questions or topics ready to discuss
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                Be respectful and professional during the session
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                // In-call view with embedded Jitsi
                <div className="h-screen flex flex-col">
                    <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                {otherProfile?.fullName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{meeting.title}</p>
                                <p className="text-gray-400 text-xs">with {otherProfile?.fullName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Users size={16} />
                            <span>2 participants</span>
                        </div>
                    </div>
                    <div ref={jitsiContainerRef} className="flex-1 bg-black" />
                </div>
            )}
        </div>
    )
}

export default VideoMeetingPage
