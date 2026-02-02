'use client';

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { profileAPI, questionAPI } from '../services/api'
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    Linkedin,
    Github,
    Calendar,
    MessageSquare,
    Award,
    Globe,
    Star,
    FileText
} from 'lucide-react'

function ProfilePage() {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProfileData()
    }, [id])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            const res = await profileAPI.get()
            setProfile(res.data)

            // Fetch user's questions
            const qRes = await questionAPI.getAll({ userId: res.data.userId?._id })
            setQuestions(qRes.data.filter(q => q.userId?._id === res.data.userId?._id) || [])

            setLoading(false)
        } catch (err) {
            setError('Could not load profile. Please try again later.')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
            </MainLayout>
        )
    }

    if (error || !profile) {
        return (
            <MainLayout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-4">Profile Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || "The profile you're looking for doesn't exist or is unavailable."}</p>
                    <Link to="/home" className="px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-accent transition shadow-lg">
                        Return Home
                    </Link>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-12 bg-background font-sans">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Essential Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 sticky top-24">
                            <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                            <div className="px-6 pb-8 -mt-16 text-center">
                                <div className="w-32 h-32 bg-white rounded-3xl p-1.5 shadow-2xl mx-auto relative group">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-4xl font-bold text-primary overflow-hidden">
                                        {profile.profilePicture ? (
                                            <img src={profile.profilePicture} alt={profile.fullName} className="w-full h-full object-cover" />
                                        ) : profile.fullName[0]}
                                    </div>
                                    {profile.placementStatus === 'placed' && (
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                                            <Award size={18} />
                                        </div>
                                    )}
                                </div>

                                <h1 className="mt-6 text-2xl font-extrabold text-primary">{profile.fullName}</h1>
                                <p className="text-gray-500 font-medium">{profile.role || (profile.placementStatus === 'placed' ? 'Ready to Mentor' : 'Aspiring Software Engineer')}</p>

                                <div className="flex justify-center gap-3 mt-8">
                                    <Link to="/messages" className="flex-1 px-4 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-accent transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <MessageSquare size={18} /> Message
                                    </Link>
                                    {profile.linkedinUrl && (
                                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                    {profile.githubUrl && (
                                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition shadow-sm">
                                            <Github size={20} />
                                        </a>
                                    )}
                                </div>

                                <div className="mt-10 space-y-4 text-left px-2">
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-secondary">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                            <p className="text-sm font-semibold truncate">{profile.collegeEmail || profile.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-secondary">
                                            <GraduationCap size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Education</label>
                                            <p className="text-sm font-semibold truncate">{profile.branch}, {profile.year} Year</p>
                                        </div>
                                    </div>
                                    {profile.company && (
                                        <div className="flex items-center gap-4 text-gray-700">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                                <Briefcase size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company</label>
                                                <p className="text-sm font-semibold truncate">{profile.company}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns: Portfolio & Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                                <User size={22} className="text-accent" /> Professional Summary
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {profile.bio || `Passionate ${profile.branch} student at Kongu Engineering College. Actively participating in ${profile.placementStatus === 'placed' ? 'mentorship and knowledge sharing' : 'interview preparation and problem solving'}.`}
                            </p>

                            <div className="mt-8">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Core Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.length > 0 ? (
                                        profile.skills.map(skill => (
                                            <span key={skill} className="px-4 py-2 bg-background border border-gray-100 text-primary rounded-xl text-sm font-bold hover:border-accent hover:text-accent transition cursor-default">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No skills listed yet.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Questions/Contributions Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                                    <FileText size={22} className="text-accent" /> Contributions
                                </h3>
                                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold">
                                    {questions.length} Questions
                                </span>
                            </div>

                            {questions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions.map(q => (
                                        <div key={q._id} className="p-5 bg-background rounded-2xl border border-gray-100 hover:border-secondary transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                        q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {q.difficulty || 'Medium'}
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {q.views || 0}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-primary group-hover:text-secondary transition line-clamp-2 mb-2">{q.title}</h4>
                                            <p className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium">No questions shared yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Mentorship Settings if Placed */}
                        {profile.placementStatus === 'placed' && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                                    <Globe size={22} className="text-accent" /> Mentorship Availability
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${profile.mentorshipSettings?.availableForChat ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                                        <MessageSquare size={24} className={profile.mentorshipSettings?.availableForChat ? 'text-green-600' : 'text-gray-400'} />
                                        <span className="text-sm font-bold">Chat</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${profile.mentorshipSettings?.availableForMeeting ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                                        <Calendar size={24} className={profile.mentorshipSettings?.availableForMeeting ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className="text-sm font-bold">Mock Interviews</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${profile.mentorshipSettings?.availableForCall ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                                        <Phone size={24} className={profile.mentorshipSettings?.availableForCall ? 'text-purple-600' : 'text-gray-400'} />
                                        <span className="text-sm font-bold">Career Call</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default ProfilePage
