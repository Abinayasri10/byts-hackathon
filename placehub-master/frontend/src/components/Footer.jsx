import { Link } from 'react-router-dom'
import { Linkedin, Github, Mail, Twitter, MapPin, Phone } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()
  const userRole = localStorage.getItem('userRole')

  return (
    <footer className="bg-white border-t border-gray-100 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-primary tracking-tight">Place<span className="text-secondary">Hub</span></h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              PlaceHub is a comprehensive placement portal designed to help students prepare for their campus placements and share valuable experiences with peers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/questions" className="text-gray-500 hover:text-secondary text-sm font-bold transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform" />
                  Materials
                </Link>
              </li>
              <li>
                <Link to="/home" className="text-gray-500 hover:text-secondary text-sm font-bold transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform" />
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-gray-500 hover:text-secondary text-sm font-bold transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform" />
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to={userRole === 'admin' ? '/admin' : '/home'} className="text-gray-500 hover:text-secondary text-sm font-bold transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary scale-0 group-hover:scale-100 transition-transform" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Contact</h3>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary/60 border border-gray-100">
                  <Mail size={16} />
                </div>
                hello@placehub.com
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary/60 border border-gray-100">
                  <Phone size={16} />
                </div>
                +91 (555) 123-4567
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary/60 border border-gray-100">
                  <MapPin size={16} />
                </div>
                India
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Follow Us</h3>
            <div className="flex gap-3">
              {[Linkedin, Github, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-50 text-primary/60 flex items-center justify-center hover:bg-primary hover:text-white border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400">
            &copy; {currentYear} PlaceHub Portal. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
