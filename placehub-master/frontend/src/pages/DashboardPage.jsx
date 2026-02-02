'use client';

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { TrendingUp, BookOpen, Users, Briefcase, ArrowRight, Star } from 'lucide-react'

function DashboardPage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setExperiences([
        {
          id: 1,
          company: 'Google',
          role: 'SDE Intern',
          batch: '2024',
          rating: 4.5,
          difficulty: 'Hard',
          image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=250&fit=crop'
        },
        {
          id: 2,
          company: 'Microsoft',
          role: 'Software Engineer',
          batch: '2024',
          rating: 4.3,
          difficulty: 'Medium',
          image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=250&fit=crop'
        },
        {
          id: 3,
          company: 'Amazon',
          role: 'SDE-2',
          batch: '2023',
          rating: 4.7,
          difficulty: 'Hard',
          image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop'
        },
        {
          id: 4,
          company: 'Meta',
          role: 'Software Engineer',
          batch: '2023',
          rating: 4.6,
          difficulty: 'Hard',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop'
        },
        {
          id: 5,
          company: 'Apple',
          role: 'SDE Intern',
          batch: '2024',
          rating: 4.8,
          difficulty: 'Medium',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'
        },
        {
          id: 6,
          company: 'Tesla',
          role: 'Software Engineer',
          batch: '2023',
          rating: 4.4,
          difficulty: 'Hard',
          image: 'https://images.unsplash.com/photo-1553877522-43269d1aaeb1?w=400&h=250&fit=crop'
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const materials = [
    { id: 1, title: 'DSA Complete Guide', downloads: 2340, category: 'Data Structures' },
    { id: 2, title: 'System Design Patterns', downloads: 1850, category: 'System Design' },
    { id: 3, title: 'DBMS Interview Questions', downloads: 3120, category: 'Databases' },
    { id: 4, title: 'OOP Concepts Explained', downloads: 2560, category: 'Core CS' },
    { id: 5, title: 'CN Quick Reference', downloads: 1940, category: 'Networks' },
    { id: 6, title: 'Behavioral Interview Tips', downloads: 3450, category: 'HR' },
    { id: 7, title: 'Coding Patterns 2024', downloads: 2780, category: 'Coding' },
    { id: 8, title: 'Resume Building Guide', downloads: 2210, category: 'Placement Prep' },
  ]

  const opportunities = [
    {
      id: 1,
      company: 'Goldman Sachs',
      role: 'Analyst',
      location: 'Mumbai',
      deadline: 'Feb 15, 2024'
    },
    {
      id: 2,
      company: 'Morgan Stanley',
      role: 'Software Engineer',
      location: 'Bangalore',
      deadline: 'Feb 20, 2024'
    },
    {
      id: 3,
      company: 'JP Morgan',
      role: 'Quant Developer',
      location: 'Mumbai',
      deadline: 'Feb 25, 2024'
    },
  ]

  const trendingTopics = [
    'System Design',
    'DSA',
    'Behavioral',
    'DBMS',
    'Networking',
    'ML/AI',
    'Cloud',
    'API Design'
  ]

  const quickStats = [
    { label: 'Experiences Shared', value: 1240, icon: FileText },
    { label: 'Companies Covered', value: 450, icon: Briefcase },
    { label: 'Materials Available', value: 3820, icon: BookOpen },
    { label: 'Active Mentors', value: 280, icon: Users },
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-background">
        {/* Hero Banner */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-16 text-white shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Complete Placement Preparation Hub</h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Learn from real placement experiences, access curated materials, and connect with mentors to ace your interviews.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/share-experience"
                className="px-8 py-3.5 rounded-lg bg-white text-primary font-bold hover:bg-background hover:shadow-lg transition inline-flex items-center gap-2"
              >
                Share Your Experience <ArrowRight size={20} />
              </Link>
              <Link
                to="/materials"
                className="px-8 py-3.5 rounded-lg bg-accent text-white font-bold hover:bg-opacity-90 hover:shadow-lg transition inline-flex items-center gap-2"
              >
                Explore Materials <ArrowRight size={20} />
              </Link>
              <Link
                to="/analytics"
                className="px-8 py-3.5 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition inline-flex items-center gap-2"
              >
                View Analytics <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-accent"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-primary">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent bg-opacity-10 flex items-center justify-center text-secondary">
                    {<stat.icon size={24} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Experiences */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Recent Placement Experiences</h2>
            <Link to="/experiences" className="text-secondary font-semibold hover:text-accent hover:underline transition">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-primary">Loading experiences...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-accent relative overflow-hidden group"
                >
                  {/* Decorative Circular Bubbles */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-secondary opacity-15 group-hover:opacity-25 transition-opacity"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-primary mb-2">{exp.company}</h3>
                      <p className="text-gray-600 text-lg font-medium">{exp.role}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500 font-medium bg-background px-3 py-1 rounded-full">
                        Batch {exp.batch}
                      </span>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-700">{exp.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                        exp.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border border-red-200' :
                        exp.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {exp.difficulty} Difficulty
                      </span>
                    </div>
                    
                    <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg">
                      Read Experience
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Materials */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Featured Materials</h2>
            <Link to="/materials" className="text-secondary font-semibold hover:text-accent hover:underline transition">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-accent">
                <div className="mb-4 p-4 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center h-20">
                  <BookOpen className="text-secondary" size={32} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-primary">{material.title}</h3>
                <p className="text-sm text-secondary font-medium mb-4">{material.category}</p>
                <p className="text-xs text-gray-500">{material.downloads.toLocaleString()} downloads</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Topics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8">Trending Topics</h2>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                className="px-6 py-3 rounded-full bg-white border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition shadow-md hover:shadow-lg"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Latest Opportunities */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Latest Opportunities</h2>
            <Link to="/opportunities" className="text-secondary font-semibold hover:text-accent hover:underline transition">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-accent">
                <h3 className="text-xl font-bold text-primary mb-2">{opp.company}</h3>
                <p className="text-gray-700 mb-4 font-semibold">{opp.role}</p>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <p className="font-medium">Location: <span className="text-gray-700">{opp.location}</span></p>
                  <p className="font-medium">Deadline: <span className="text-gray-700">{opp.deadline}</span></p>
                </div>
                <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition shadow-md hover:shadow-lg">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

// Placeholder icon since we're using lucide-react icons
function FileText(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export default DashboardPage