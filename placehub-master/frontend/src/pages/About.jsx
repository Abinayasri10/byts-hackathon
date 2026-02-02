import MainLayout from '../components/MainLayout'
import {
  AlertTriangle,
  ShieldCheck,
  Layers3,
  Users2,
  Target,
  Sparkles,
  Brain,
} from 'lucide-react'

const failureReasons = [
  'No centralized platform for interview experiences',
  'Company-wise or role-wise organization is missing',
  'Students hesitate to share openly due to identity concerns',
  'Valuable interview data disappears over time',
]

const differentiators = [
  {
    title: 'Anonymous-first discussions',
    description: 'Identity-safe spaces encourage honest sharing from seniors without fear of repercussions.',
    icon: ShieldCheck,
  },
  {
    title: 'Company & role repositories',
    description: 'Every submission is structured by company, role, season, and difficulty so juniors can target prep.',
    icon: Layers3,
  },
  {
    title: 'Structured experience flows',
    description: 'Guided forms capture rounds, materials, and outcomes so nothing is lost in translation.',
    icon: Target,
  },
  {
    title: 'AI-powered insights',
    description: 'Smart tagging, summaries, and surfacing of trends help students focus on what matters.',
    icon: Brain,
  },
  {
    title: 'Mentorship loops',
    description: 'Connects placed seniors with juniors through opt-in, anonymous mentoring touchpoints.',
    icon: Users2,
  },
  {
    title: 'Living knowledge base',
    description: 'Every season adds to a permanent, searchable archive for placement cells and cohorts.',
    icon: Sparkles,
  },
]

const audience = [
  {
    title: 'Final-year students',
    detail: 'Preparing for placements and hungry for real interview breakdowns.',
  },
  {
    title: 'Underclassmen',
    detail: 'Need reliable insights long before their own placement drive begins.',
  },
  {
    title: 'Placed students',
    detail: 'Want to give back anonymously without mixing personal identity online.',
  },
  {
    title: 'Placement cells & admins',
    detail: 'Track hiring patterns, curate best practices, and support every cohort at scale.',
  },
]

function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-[#ebf4f6] via-white to-[#f6fbfc] min-h-screen text-primary">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-28 pb-16">
          <p className="uppercase tracking-[0.4em] text-xs text-secondary font-semibold">About PlaceHub</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mt-6 mb-6">
            Real interview experiences. Anonymous sharing. Smarter preparation.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            A centralized, anonymous platform for real interview experiences and placement insights. We capture the
            collective knowledge of every placement season and make it actionable for the next cohort.
          </p>
        </section>

        {/* Problem Section */}
        <section className="bg-white/80 backdrop-blur-sm border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 text-secondary font-semibold text-lg mb-4">
                <AlertTriangle className="text-secondary" />
                The Problem
              </div>
              <p className="text-slate-600 leading-relaxed">
                Interview experiences and questions shared by students are scattered, unstructured, and quickly lost
                after placements. Preparation today relies on WhatsApp groups, word-of-mouth, and random posts—making the
                process inefficient, unreliable, and unfair for juniors who start late.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg border border-secondary/10 p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Why existing methods fail</h3>
              <ul className="space-y-3 text-slate-600">
                {failureReasons.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-secondary font-semibold">Our Solution</p>
            <h2 className="text-3xl font-bold mt-3 mb-4">Simple. Clean. Powerful.</h2>
            <p className="text-slate-600 leading-relaxed">
              PlaceHub provides a secure, centralized space where students can anonymously share interview questions,
              placement experiences, and preparation strategies. Every insight is structured, searchable, and organized
              company-wise, role-wise, and topic-wise so juniors prepare using real proof, not rumors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Audience */}
        <section className="bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary font-semibold">Who is this for?</p>
            <h2 className="text-3xl font-bold mt-3 mb-6">Built for every player in the placement journey.</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {audience.map(({ title, detail }) => (
                <article key={title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
          <div className="bg-white rounded-3xl shadow-lg border border-primary/10 p-8">
            <h2 className="text-3xl font-bold mb-4">Long-term vision</h2>
            <p className="text-slate-600 leading-relaxed">
              We are building a long-term knowledge base of real interview experiences that grows with every placement
              season. The more students contribute, the smarter the insights: trend reports for placement cells, targeted
              prep plans for cohorts, and always-on mentorship loops for juniors. The goal is simple—help students prepare
              smarter, not harder.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md border border-secondary/10 p-8">
            <h3 className="text-2xl font-semibold mb-3">Tech + Ethics</h3>
            <p className="text-slate-600 leading-relaxed">
              User privacy and data integrity are non-negotiable. Personally identifiable details are stripped from
              anonymous threads, moderation tooling keeps submissions high-signal, and audit logs ensure placement cells
              can trust the repository. No personal identity is revealed unless a student explicitly opts in.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl text-white p-10 shadow-2xl">
            <h3 className="text-3xl font-bold mb-3">Ready to power your next placement season?</h3>
            <p className="text-white/80 text-lg mb-6">
              Invite seniors to share anonymously, help juniors prepare with confidence, and give placement cells the
              visibility they deserve.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/materials"
                className="px-6 py-3 rounded-2xl bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 transition"
              >
                Explore Materials
              </a>
              <a
                href="/share-experience"
                className="px-6 py-3 rounded-2xl border-2 border-white/70 text-white font-semibold hover:bg-white/10 transition"
              >
                Share an Experience
              </a>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default AboutPage