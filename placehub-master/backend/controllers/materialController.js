import Material from '../models/Material.js'

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildFilters = (queryParams = {}) => {
  const {
    search,
    category,
    company,
    type,
    difficulty,
    format,
    role,
    tag,
    topic,
    status,
  } = queryParams

  const filters = {
    status: status || 'approved',
  }

  if (category && category !== 'All') {
    filters.category = category
  }

  if (company) {
    filters.companyName = { $regex: escapeRegex(company.trim()), $options: 'i' }
  }

  if (type) {
    filters.type = type
  }

  if (difficulty) {
    filters.difficulty = difficulty
  }

  if (format) {
    filters.format = format
  }

  if (role) {
    filters.roleFocus = { $regex: escapeRegex(role.trim()), $options: 'i' }
  }

  if (tag) {
    filters.tags = { $regex: escapeRegex(tag.trim()), $options: 'i' }
  }

  if (topic) {
    filters.topics = { $regex: escapeRegex(topic.trim()), $options: 'i' }
  }

  if (search && search.trim().length) {
    const regex = escapeRegex(search.trim())
    filters.$or = [
      { title: { $regex: regex, $options: 'i' } },
      { description: { $regex: regex, $options: 'i' } },
      { companyName: { $regex: regex, $options: 'i' } },
      { roleFocus: { $regex: regex, $options: 'i' } },
      { tags: { $regex: regex, $options: 'i' } },
      { topics: { $regex: regex, $options: 'i' } },
    ]
  }

  return filters
}

export const createMaterial = async (req, res) => {
  try {
    const payload = { ...req.body }
    payload.addedBy = req.user?.id || req.user?.userId

    if (payload.tags && typeof payload.tags === 'string') {
      payload.tags = payload.tags
        .split(',')
        .map((tagValue) => tagValue.trim())
        .filter(Boolean)
    }

    if (payload.topics && typeof payload.topics === 'string') {
      payload.topics = payload.topics
        .split(',')
        .map((topicValue) => topicValue.trim())
        .filter(Boolean)
    }

    const material = await Material.create(payload)

    res.status(201).json({
      success: true,
      message: 'Material added to repository',
      material,
    })
  } catch (error) {
    console.error('Error creating material:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add material',
      error: error.message,
    })
  }
}

export const getMaterials = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 9
    const skip = (page - 1) * limit
    const sortBy = req.query.sortBy || 'recent'

    const filters = buildFilters(req.query)

    let sortQuery = { createdAt: -1 }
    if (sortBy === 'popular') {
      sortQuery = { 'engagement.views': -1, 'engagement.likes': -1 }
    } else if (sortBy === 'liked') {
      sortQuery = { 'engagement.likes': -1 }
    }

    const [materials, total] = await Promise.all([
      Material.find(filters)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Material.countDocuments(filters),
    ])

    const matchStage = JSON.parse(JSON.stringify(filters))

    const [categoryCounts, topCompanies, tagCloud] = await Promise.all([
      Material.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Material.aggregate([
        { $match: matchStage },
        { $group: { _id: '$companyName', count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Material.aggregate([
        { $match: matchStage },
        { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ])

    res.json({
      success: true,
      materials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        categoryCounts,
        topCompanies,
        tagCloud,
      },
    })
  } catch (error) {
    console.error('Error fetching materials:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load materials',
      error: error.message,
    })
  }
}

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('addedBy', 'fullName email')

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      })
    }

    if (material.status === 'approved') {
      material.engagement.views = (material.engagement?.views || 0) + 1
      await material.save()
    }

    res.json({ success: true, material })
  } catch (error) {
    console.error('Error fetching material:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material',
      error: error.message,
    })
  }
}

export const getMaterialFilters = async (_req, res) => {
  try {
    const categories = Material.schema.path('category').enumValues || []
    const types = Material.schema.path('type').enumValues || []
    const difficulties = Material.schema.path('difficulty').enumValues || []
    const formats = Material.schema.path('format').enumValues || []

    const [companies, tags, topics] = await Promise.all([
      Material.aggregate([
        { $match: { companyName: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$companyName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 25 },
      ]),
      Material.aggregate([
        { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 30 },
      ]),
      Material.aggregate([
        { $unwind: { path: '$topics', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$topics', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 30 },
      ]),
    ])

    res.json({
      success: true,
      filters: {
        categories,
        types,
        difficulties,
        formats,
        companies: companies.map((company) => ({
          name: company._id,
          total: company.count,
        })),
        tags: tags.map((tag) => ({ label: tag._id, total: tag.count })),
        topics: topics.map((topic) => ({ label: topic._id, total: topic.count })),
      },
    })
  } catch (error) {
    console.error('Error fetching material filters:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load filters',
      error: error.message,
    })
  }
}
