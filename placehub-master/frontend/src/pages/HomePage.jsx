'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileAPI } from '../services/api'

function HomePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.get()
        if (response.data.success) {
          setProfile(response.data.profile)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EBF4F6]">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-white border-t-secondary rounded-full animate-spin mb-4 shadow-sm" />
          <p className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Initializing PlaceHub...</p>
        </div>
      </div>
    )
  }

  return (
    // Body background uses a very subtle gray to make the white cards "pop"
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-primary selection:bg-accent selection:text-white">
      
      {/* --- Premium Navigation --- */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-primary leading-none">Place<span className="text-secondary">Hub</span></h1>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">Student Dashboard</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-gray-100 text-primary font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-primary tracking-tight">
              Welcome, <span className="text-secondary">{profile?.fullName?.split(' ')[0]}</span>!
            </h2>
            <p className="text-gray-400 font-medium mt-1">Ready for your next career milestone?</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm inline-flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Live Campus Drive</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Left Column: Identity Card --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-8">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-[2rem] object-cover border-4 border-[#EBF4F6]"
                  />
                ) : (
                  <div className="w-full h-full rounded-[2rem] bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-4xl font-black">
                    {profile?.fullName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-primary leading-tight">{profile?.fullName}</h3>
                <p className="text-accent font-extrabold text-xs uppercase tracking-widest mt-2">{profile?.branch}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-gray-50 rounded-full text-[10px] font-mono font-bold text-gray-400">
                  ID: {profile?.rollNumber}
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#EBF4F6]/30 border border-[#EBF4F6] flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                    profile?.placementStatus === 'placed' ? 'bg-green-500 text-white' : 'bg-secondary text-white'
                  }`}>
                    {profile?.placementStatus || 'Active'}
                  </span>
                </div>
                
                {profile?.placementStatus === 'placed' && (
                  <div className="p-5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Hired At</p>
                    <p className="text-lg font-black leading-tight">{profile?.company}</p>
                    <p className="text-accent text-xs font-bold mt-1 opacity-90">{profile?.role}</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-8 py-4 rounded-2xl bg-white border-2 border-primary text-primary font-black text-sm hover:bg-primary hover:text-white transition-all duration-300">
                Update Resume
              </button>
            </div>
          </div>

          {/* --- Right Column: Intelligence Grids --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Horizontal Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white border border-gray-100 p-8 rounded-[2rem] flex items-center justify-between group hover:border-secondary transition-colors">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Skills Found</p>
                    <p className="text-4xl font-black text-primary">{profile?.skills?.length || 0}</p>
                  </div>
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
               </div>
               <div className="bg-white border border-gray-100 p-8 rounded-[2rem] flex items-center justify-between group hover:border-accent transition-colors">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Profile View</p>
                    <p className="text-4xl font-black text-primary">High</p>
                  </div>
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
               </div>
            </div>

            {/* Professional Grid: Technical Skills */}
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
              <div className="px-10 py-6 border-b border-gray-50 bg-gray-50/30">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Technical Core</h3>
              </div>
              <div className="p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile?.skills?.map((skill) => (
                    <div key={skill} className="px-4 py-3 bg-white border border-gray-100 rounded-xl text-center text-xs font-bold text-gray-600 hover:border-secondary hover:bg-[#EBF4F6]/20 transition-all cursor-default shadow-sm">
                      {skill}
                    </div>
                  )) || <p className="text-gray-400 italic text-sm col-span-full">No skills indexed yet.</p>}
                </div>
              </div>
            </div>

            {/* High-Impact Social Grid */}
            <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-8 tracking-tight">Professional Networking</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-5 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black text-xl group-hover:bg-secondary group-hover:text-white transition-colors">in</div>
                      <div>
                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Connect</p>
                        <p className="text-sm font-bold">LinkedIn</p>
                      </div>
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-5 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black text-xl group-hover:bg-accent group-hover:text-white transition-colors">gh</div>
                      <div>
                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Repository</p>
                        <p className="text-sm font-bold">GitHub</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage