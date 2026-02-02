import { useState } from 'react'
import MainLayout from '../components/MainLayout'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ShieldCheck } from 'lucide-react'

const contactChannels = [
  {
    title: 'Core Team',
    description: 'Product, partnerships, and campus collaborations.',
    value: 'team@placehub.app',
    icon: Mail,
  },
  {
    title: 'Community Hotline',
    description: 'Urgent platform issues or moderation escalations.',
    value: '+91 98765 43210',
    icon: Phone,
  },
  {
    title: 'Campus HQ',
    description: 'IIIT Hyderabad Innovation Garage, Block B3.',
    value: 'Hyderabad, Telangana, India',
    icon: MapPin,
  },
  {
    title: 'Support Hours',
    description: 'Monday – Saturday, 9:00 AM – 10:00 PM IST',
    value: 'Avg. response time: < 12 hrs',
    icon: Clock,
  },
]

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', topic: 'General', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('submitting')
    setTimeout(() => {
      setStatus('submitted')
    }, 600)
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-[#ebf4f6] via-white to-[#f6fbfc] min-h-screen text-primary">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-28 pb-12 text-center">
          <p className="uppercase tracking-[0.35em] text-xs text-secondary font-semibold">Get in touch</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mt-5 mb-4">
            Let’s build transparent placements together.
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Whether you are a student, senior mentor, or campus admin, the PlaceHub team is one email away. Drop us a
            note and we’ll get back with the support, data, or collaboration you need.
          </p>
        </section>

        {/* Contact Channels */}
        <section className="max-w-6xl mx-auto px-6 pb-16 grid gap-6 md:grid-cols-2">
          {contactChannels.map(({ title, description, value, icon: Icon }) => (
            <article
              key={title}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary/80">{title}</p>
                <h3 className="text-xl font-semibold mt-1">{value}</h3>
                <p className="text-slate-600 text-sm mt-1">{description}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Contact Form + Notes */}
        <section className="max-w-6xl mx-auto px-6 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-secondary/10 p-8 space-y-6">
            <div className="flex items-center gap-3 text-secondary font-semibold text-lg">
              <MessageSquare />
              Send us a message
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Niharika Gupta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="topic">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="General">General question</option>
                <option value="Partnership">Campus partnership</option>
                <option value="Support">Platform support</option>
                <option value="Press">Press / media</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Share what you are looking for, timelines, or any context."
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 shadow-lg hover:-translate-y-0.5 transition"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send message'} <Send size={18} />
            </button>

            {status === 'submitted' && (
              <p className="text-center text-sm font-semibold text-secondary">
                Thanks for reaching out! Someone from PlaceHub will respond shortly.
              </p>
            )}
          </form>

          <div className="space-y-6">
            <article className="bg-gradient-to-br from-primary to-secondary text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4">Campus + Community</h3>
              <p className="text-white/85 text-sm leading-relaxed">
                Run a placement cell or student club? We host onboarding walkthroughs, data sharing agreements, and
                cross-campus mentorship cohorts. Drop a line and we’ll set up a working session.
              </p>
              <div className="mt-6 text-sm">
                <p className="font-semibold">Private Slack</p>
                <p className="text-white/80">placehub-community.slack.com</p>
              </div>
            </article>

            <article className="bg-white rounded-3xl border border-slate-100 shadow-md p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-secondary font-semibold">
                <ShieldCheck />
                Privacy & Trust
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Moderation happens within 6 hours for flagged posts. Anonymous submissions strip personal identifiers by
                default and audit trails are shared with campus admins upon request.
              </p>
              <div className="text-sm text-slate-500">
                Need a data processing agreement? Email <span className="font-semibold text-secondary">legal@placehub.app</span>.
              </div>
            </article>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default ContactPage
