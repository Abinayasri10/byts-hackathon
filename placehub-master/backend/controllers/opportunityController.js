import Opportunity from '../models/Opportunity.js'

const SORT_MAP = {
  recent: { createdAt: -1 },
  closingSoon: { deadline: 1 },
  stipendHigh: { stipendMax: -1 },
}

const buildFilters = (query) => {
  const filter = { status: 'active' }

  if (query.category && query.category !== 'All') {
    filter.category = query.category
  }

  if (query.type && query.type !== 'all') {
    filter.opportunityType = query.type
  }

  if (query.locationType && query.locationType !== 'all') {
    filter.locationType = query.locationType
  }

  if (query.experience && query.experience !== 'all') {
    filter.experienceLevel = query.experience
  }

  if (query.company) {
    filter.companyName = query.company
  }

  if (query.tags) {
    const tags = Array.isArray(query.tags) ? query.tags : query.tags.split(',')
    filter.tags = { $all: tags.map((tag) => tag.trim()).filter(Boolean) }
  }

  if (query.status) {
    filter.status = query.status
  }

  if (query.search) {
    filter.$text = { $search: query.search.trim() }
  }

  return filter
}

export const listOpportunities = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1
    const limit = Number(req.query.limit) > 0 ? Math.min(Number(req.query.limit), 24) : 9
    const sortBy = SORT_MAP[req.query.sortBy] ? req.query.sortBy : 'recent'

    const filter = buildFilters(req.query)
    const sort = SORT_MAP[sortBy]

    const [items, total, stats] = await Promise.all([
      Opportunity.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Opportunity.countDocuments(filter),
      Opportunity.aggregate([
        { $match: { status: 'active' } },
        {
          $facet: {
            categoryCounts: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            typeCounts: [
              { $group: { _id: '$opportunityType', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            locations: [
              { $group: { _id: '$locationType', count: { $sum: 1 } } },
            ],
          },
        },
      ]),
    ])

    return res.json({
      success: true,
      opportunities: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
      stats: stats[0] || { categoryCounts: [], typeCounts: [], locations: [] },
    })
  } catch (error) {
    console.error('Failed to list opportunities', error)
    return res.status(500).json({ success: false, message: 'Unable to load opportunities right now.' })
  }
}

export const getOpportunityFilters = async (_req, res) => {
  try {
    const [categories, companies, tags, types, locationTypes, experienceLevels] = await Promise.all([
      Opportunity.distinct('category', { status: 'active' }),
      Opportunity.distinct('companyName', { status: 'active' }),
      Opportunity.distinct('tags', { status: 'active' }),
      Opportunity.distinct('opportunityType', { status: { $exists: true } }),
      Opportunity.distinct('locationType', { status: { $exists: true } }),
      Opportunity.distinct('experienceLevel', { status: { $exists: true } }),
    ])

    return res.json({
      success: true,
      filters: {
        categories,
        companies,
        tags: tags.filter(Boolean),
        types,
        locationTypes,
        experienceLevels,
      },
    })
  } catch (error) {
    console.error('Failed to load opportunity filters', error)
    return res.status(500).json({ success: false, message: 'Unable to load filters.' })
  }
}

export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' })
    }

    return res.json({ success: true, opportunity })
  } catch (error) {
    console.error('Failed to load opportunity', error)
    return res.status(500).json({ success: false, message: 'Unable to load opportunity.' })
  }
}

export const createOpportunity = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      postedBy: req.user?._id,
    }

    const opportunity = await Opportunity.create(payload)
    return res.status(201).json({ success: true, opportunity })
  } catch (error) {
    console.error('Failed to create opportunity', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to create opportunity.',
    })
  }
}
