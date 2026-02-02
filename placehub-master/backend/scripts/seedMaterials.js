import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Material from '../models/Material.js'

dotenv.config()

const SAMPLE_MATERIALS = [
  {
    title: 'Amazon SDE 1 DSA Playlist',
    description: 'Curated YouTube playlist that covers arrays, trees, DP and Amazon-favorite patterns with hands-on problems.',
    type: 'link',
    category: 'DSA',
    topics: ['Arrays', 'Trees', 'DP'],
    tags: ['amazon', 'sde1', 'coding-round'],
    difficulty: 'intermediate',
    format: 'playlist',
    estimatedTime: '4 weeks',
    url: 'https://www.youtube.com/playlist?list=PLamzSFpOmLopywH5G0lRL5mJ6w8j7U8z',
    companyName: 'Amazon',
    roleFocus: 'SDE 1',
    batch: '2025',
    placementSeason: 'on-campus',
    heroTheme: 'teal',
  },
  {
    title: 'Google System Design Starter Deck',
    description: 'Visual guide explaining core system design concepts (scalability, sharding, caching) tailored for Google L4 interviews.',
    type: 'document',
    category: 'System Design',
    topics: ['Scalability', 'Caching', 'Databases'],
    tags: ['google', 'l4', 'system-design'],
    difficulty: 'advanced',
    format: 'guide',
    estimatedTime: '2 weeks',
    url: 'https://drive.google.com/file/d/1sys-design',
    companyName: 'Google',
    roleFocus: 'Software Engineer',
    batch: '2024',
    placementSeason: 'off-campus',
    heroTheme: 'navy',
  },
  {
    title: 'Flipkart Product Analytics Sheet',
    description: 'Frequently asked product sense/analytics questions with structured frameworks and sample answers.',
    type: 'document',
    category: 'Behavioral',
    topics: ['Metrics', 'Product Sense'],
    tags: ['flipkart', 'product-analyst', 'behavioral'],
    difficulty: 'intermediate',
    format: 'cheatsheet',
    estimatedTime: '1 week',
    url: 'https://notion.so/flipkart-product-analytics',
    companyName: 'Flipkart',
    roleFocus: 'Product Analyst',
    batch: '2024',
    placementSeason: 'on-campus',
    heroTheme: 'purple',
  },
  {
    title: 'Microsoft Internship HR Scenarios',
    description: 'Collection of HR questions and STAR-formatted answers sourced from 2023 Microsoft interns.',
    type: 'note',
    category: 'Behavioral',
    topics: ['Leadership', 'Teamwork'],
    tags: ['microsoft', 'internship', 'hr-round'],
    difficulty: 'beginner',
    format: 'guide',
    estimatedTime: '3 days',
    url: 'https://docs.google.com/document/d/msft-hr-scenarios',
    companyName: 'Microsoft',
    roleFocus: 'Software Intern',
    batch: '2023',
    placementSeason: 'on-campus',
    heroTheme: 'indigo',
  },
  {
    title: 'ServiceNow Coding Challenge Pack',
    description: 'Handpicked HackerRank problems matching ServiceNow 2024 hiring format with editorial links.',
    type: 'resource',
    category: 'DSA',
    topics: ['Greedy', 'Graphs'],
    tags: ['servicenow', 'hackerrank', 'coding-round'],
    difficulty: 'intermediate',
    format: 'article',
    estimatedTime: '10 days',
    url: 'https://gist.github.com/servicenow-dsa-set',
    companyName: 'ServiceNow',
    roleFocus: 'Software Engineer',
    batch: '2024',
    placementSeason: 'off-campus',
    heroTheme: 'cyan',
  },
  {
    title: 'Bloomberg Rapid Math Drills',
    description: 'Timed aptitude PDFs to mirror Bloomberg quantitative screening rounds, with answer keys.',
    type: 'document',
    category: 'Aptitude',
    topics: ['Math', 'Probability'],
    tags: ['bloomberg', 'aptitude', 'speed-math'],
    difficulty: 'advanced',
    format: 'cheatsheet',
    estimatedTime: '2 weeks',
    url: 'https://drive.google.com/file/d/bbg-math-pack',
    companyName: 'Bloomberg',
    roleFocus: 'Financial Engineer',
    batch: '2023',
    placementSeason: 'off-campus',
    heroTheme: 'orange',
  },
  {
    title: 'Zomato Frontend Take-home Template',
    description: 'Ready-to-use React boilerplate with instructions that match Zomato frontend assignment prompt.',
    type: 'code',
    category: 'Projects',
    topics: ['React', 'TypeScript'],
    tags: ['zomato', 'frontend', 'assignment'],
    difficulty: 'intermediate',
    format: 'project',
    estimatedTime: '5 days',
    url: 'https://github.com/placehub/zomato-fe-template',
    companyName: 'Zomato',
    roleFocus: 'Frontend Engineer',
    batch: '2025',
    placementSeason: 'off-campus',
    heroTheme: 'crimson',
  },
  {
    title: 'Accenture AI Interview Mindmap',
    description: 'Mindmap covering GenAI basics, Responsible AI points, and recent Accenture AI case studies.',
    type: 'note',
    category: 'AI & ML',
    topics: ['GenAI', 'Responsible AI'],
    tags: ['accenture', 'ai-ml', 'case-study'],
    difficulty: 'beginner',
    format: 'guide',
    estimatedTime: '1 week',
    url: 'https://miro.com/app/board/accenture-ai-prep',
    companyName: 'Accenture',
    roleFocus: 'AI Analyst',
    batch: '2024',
    placementSeason: 'on-campus',
    heroTheme: 'magenta',
  },
]

async function seedMaterials() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured in .env')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    let inserted = 0
    for (const material of SAMPLE_MATERIALS) {
      const result = await Material.findOneAndUpdate(
        { title: material.title, companyName: material.companyName },
        { $set: { ...material, status: 'approved' } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      if (result) {
        inserted += 1
      }
    }

    console.log(`🎯 Seeded ${inserted} materials into the repository`)
  } catch (error) {
    console.error('❌ Failed to seed materials', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

seedMaterials()
