import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { ArrowRight, Heart, Users, Zap, Award } from 'lucide-react'

function ShareExperienceLanding() {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: Heart,
      title: 'Help Your Peers',
      description: 'Your experience can help hundreds of students prepare better for their placements.'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Connect with other students and create a network of placement preparation resources.'
    },
    {
      icon: Zap,
      title: 'Easy to Share',
      description: 'Simple, multi-step process to document your entire placement journey comprehensively.'
    },
    {
      icon: Award,
      title: 'Get Recognized',
      description: 'Earn badges and recognition as a trusted community contributor on PlaceHub.'
    },
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-background">
        {/* Hero Section */}
        <section className="text-center mb-16 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent opacity-5"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-secondary opacity-5"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-primary mb-4 leading-tight">
              Share Your Placement Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help thousands of students ace their interviews by sharing your placement experience. Document every round, company details, and valuable insights.
            </p>
            <Link
              to="/share-experience/metadata"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-secondary text-white font-bold text-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Sharing <ArrowRight size={24} />
            </Link>
          </div>
        </section>

        {/* Why Share Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            Why Share Your Experience?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 hover:border-accent relative overflow-hidden group"
                >
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-accent opacity-5 group-hover:opacity-10 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* What We Collect Section */}
        
        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            The Experience Sharing Process
          </h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  1
                </div>
                <div className="w-1 h-24 bg-gradient-to-b from-primary to-secondary my-2"></div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex-1 border border-gray-100 hover:border-accent hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-primary mb-3">Company & Basic Details</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Start by telling us about the company, role you applied for, your batch, and other basic metadata. This helps us organize experiences effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  2
                </div>
                <div className="w-1 h-24 bg-gradient-to-b from-secondary to-accent my-2"></div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex-1 border border-gray-100 hover:border-secondary hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-primary mb-3">Round-by-Round Details</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Document each round: technical interviews, online assessments, HR rounds, group discussions. Add difficulty levels, questions asked, and tips.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  3
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex-1 border border-gray-100 hover:border-accent hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-primary mb-3">Materials & Resources</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Upload helpful documents, links, code snippets, or any resources that helped you. This becomes invaluable for future candidates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white rounded-2xl p-12 text-center shadow-2xl border-2 border-accent relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-primary opacity-5"></div>
          <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-secondary opacity-5"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-primary mb-4">Ready to Help Others?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Share your placement experience and become a valued member of the PlaceHub community. Your insights could help the next generation of students.
            </p>
            <Link
              to="/share-experience/metadata"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-primary text-white font-bold text-lg hover:bg-secondary transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Begin Sharing Now <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default ShareExperienceLanding