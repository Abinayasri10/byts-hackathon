import { Link } from 'react-router-dom'
import { Linkedin, Github, Mail, Twitter } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg text-[#472183] mb-4">About PlaceHub</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              PlaceHub is a comprehensive placement portal designed to help students prepare for their campus placements and share valuable experiences with peers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-[#472183] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/materials" className="text-gray-600 hover:text-[#472183] transition">
                  Materials
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-gray-600 hover:text-[#472183] transition">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-gray-600 hover:text-[#472183] transition">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-[#472183] transition">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg text-[#472183] mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Email: hello@placehub.com</li>
              <li>Phone: +91 (555) 123-4567</li>
              <li>Location: India</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-lg text-[#472183] mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center hover:bg-[#4B56D2] transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center hover:bg-[#4B56D2] transition"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center hover:bg-[#4B56D2] transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#472183] text-white flex items-center justify-center hover:bg-[#4B56D2] transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        
       
      </div>
    </footer>
  )
}

export default Footer
