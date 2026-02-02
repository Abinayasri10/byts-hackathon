import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Opportunity from '../models/Opportunity.js'

dotenv.config({ path: '../.env' })

const SAMPLE_OPPORTUNITIES = [
  {
    title: 'SDE Intern - Emerging Tech',
    companyName: 'Microsoft',
    category: 'Engineering',
    opportunityType: 'internship',
    experienceLevel: 'fresher',
    location: 'Hyderabad, India',
    locationType: 'hybrid',
    stipendMin: 90000,
    stipendMax: 110000,
    currency: 'INR',
    applicationUrl: 'https://careers.microsoft.com/internships',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    tags: ['sde', 'microsoft', 'genAI'],
    skills: ['DSA', 'Azure', 'TypeScript'],
    description: 'Join the Emerging Tech charter and work on developer tooling for copilots.',
    responsibilities: 'Ship features with senior mentors, participate in code reviews, demo weekly.',
    perks: ['Pre-placement offer potential', 'Mentorship pod', 'Housing stipend'],
  },
  {
    title: 'Product Analyst - Monetization',
    companyName: 'Flipkart',
    category: 'Product',
    opportunityType: 'full-time',
    experienceLevel: '0-1 years',
    location: 'Bengaluru, India',
    locationType: 'on-site',
    stipendMin: 1400000,
    stipendMax: 1800000,
    currency: 'INR',
    applicationUrl: 'https://flipkart.careers/jobs',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    tags: ['product', 'analytics'],
    skills: ['SQL', 'A/B Testing', 'Storytelling'],
    description: 'Drive growth experiments across the monetization stack for tier-2 cities.',
    responsibilities: 'Own dashboards, partner with Eng + BizOps, publish insight notes.',
    perks: ['ESOPs', 'Learning wallet'],
  },
  {
    title: 'UX Research Internship',
    companyName: 'Razorpay',
    category: 'Design',
    opportunityType: 'internship',
    experienceLevel: 'fresher',
    location: 'Remote, India',
    locationType: 'remote',
    stipendMin: 60000,
    stipendMax: 70000,
    applicationEmail: 'ux-talent@razorpay.com',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    tags: ['ux', 'research'],
    skills: ['User interviews', 'Notion', 'Storyboarding'],
    description: 'Shadow lead researchers to synthesize insights for fintech merchants.',
    responsibilities: 'Plan studies, script interviews, deliver readouts.',
    perks: ['Remote first', 'Equipment stipend'],
  },
  {
    title: 'AI Residency - Applied Research',
    companyName: 'Google',
    category: 'Research',
    opportunityType: 'fellowship',
    experienceLevel: '0-1 years',
    location: 'Bangalore, India',
    locationType: 'on-site',
    stipendMin: 4500000,
    stipendMax: 5000000,
    description: 'Year-long AI residency to ship Responsible AI features in production.',
    applicationUrl: 'https://careers.google.com/jobs/results',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    tags: ['ai', 'ml', 'research'],
    skills: ['PyTorch', 'Research writing', 'Statistics'],
    perks: ['Relocation', 'Publication support'],
  },
]

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI in environment')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    for (const opportunity of SAMPLE_OPPORTUNITIES) {
      await Opportunity.findOneAndUpdate(
        { title: opportunity.title, companyName: opportunity.companyName },
        { $set: opportunity },
        { upsert: true }
      )
    }

    console.log('Seeded opportunities successfully')
  } catch (error) {
    console.error('Failed to seed opportunities', error)
  } finally {
    await mongoose.disconnect()
  }
}

seed()
