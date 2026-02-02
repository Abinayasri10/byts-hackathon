import Experience from '../models/Experience.js'
import Material from '../models/Material.js'

const normalizeStringArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
  }
  return []
}

const deriveDifficultyLabel = (materialDifficulty, experienceDifficulty) => {
  if (materialDifficulty && ['beginner', 'intermediate', 'advanced'].includes(materialDifficulty)) {
    return materialDifficulty
  }

  if (!experienceDifficulty) return 'beginner'
  if (experienceDifficulty <= 2) return 'beginner'
  if (experienceDifficulty === 3) return 'intermediate'
  return 'advanced'
}

const mapMaterialPayload = (experience, materialItem, sourceMaterialId) => ({
  title:
    materialItem.title?.trim() ||
    `${experience.companyName || 'Interview'} Preparation Resource`,
  description: materialItem.description,
  type: materialItem.type || 'link',
  category: materialItem.category || 'General',
  topics: normalizeStringArray(materialItem.topics),
  tags: normalizeStringArray(materialItem.tags),
  difficulty: deriveDifficultyLabel(materialItem.difficulty, experience.difficultyRating),
  format:
    materialItem.format ||
    (materialItem.type === 'document'
      ? 'cheatsheet'
      : materialItem.type === 'code'
      ? 'project'
      : 'guide'),
  estimatedTime: materialItem.estimatedTime,
  url: materialItem.url,
  companyName: experience.companyName,
  roleFocus: experience.roleAppliedFor,
  batch: experience.batch,
  placementSeason: experience.placementSeason,
  addedBy: experience.userId,
  sourceExperience: experience._id,
  sourceMaterialId,
  status: experience.status === 'approved' ? 'approved' : 'pending',
})

const syncMaterialsFromExperience = async (experience) => {
  if (!experience?.materials?.length) return

  const operations = experience.materials.map((materialItem, index) => {
    const sourceMaterialId =
      materialItem.id?.toString() ||
      materialItem._id?.toString() ||
      `${experience._id.toString()}-${index}`

    const payload = mapMaterialPayload(experience, materialItem, sourceMaterialId)

    return Material.findOneAndUpdate(
      { sourceExperience: experience._id, sourceMaterialId },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  })

  await Promise.all(operations)
}

// Create experience
export const createExperience = async (req, res) => {
  try {
    // 1. Destructure _id out so it's NOT included in ...otherData
    const { _id, companyName, roleAppliedFor, batch, ...otherData } = req.body;
    const userId = req.user?.id || req.user?.userId;

    // Validation
    if (!companyName || !roleAppliedFor || !batch) {
      return res.status(400).json({
        success: false,
        message: 'Company name, role, and batch are required',
      });
    }

    // 2. Create new experience (Mongoose will now generate a FRESH _id)
    const experience = new Experience({
      userId,
      companyName,
      roleAppliedFor,
      batch,
      ...otherData,
      status: 'pending', 
    });

    await experience.save();
    await syncMaterialsFromExperience(experience);

    // 3. OPTIONAL BUT RECOMMENDED: Delete the draft now that it's submitted
    await Experience.deleteOne({ userId, status: 'draft' });

    res.status(201).json({
      success: true,
      message: 'Experience submitted for approval',
      experience,
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create experience',
      error: error.message,
    });
  }
}

// Get user's own experiences
export const getUserExperiences = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId

    const experiences = await Experience.find({ userId })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      experiences,
    })
  } catch (error) {
    console.error('Error fetching user experiences:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message,
    })
  }
}

// Get recent approved experiences (for public viewing)
export const getRecentExperiences = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const experiences = await Experience.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-materials') // Don't include materials in list view

    const total = await Experience.countDocuments({ status: 'approved' })

    res.json({
      success: true,
      experiences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching recent experiences:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message,
    })
  }
}

// Get single experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params

    const experience = await Experience.findById(id)
      .populate('userId', 'fullName batch')

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      })
    }

    // Increment views if it's an approved experience
    if (experience.status === 'approved') {
      experience.views += 1
      await experience.save()
    }

    res.json({
      success: true,
      experience,
    })
  } catch (error) {
    console.error('Error fetching experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience',
      error: error.message,
    })
  }
}

// Update experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || req.user?.userId

    // Find experience
    const experience = await Experience.findById(id)

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      })
    }

    // Check if user owns this experience
    if (experience.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own experiences',
      })
    }

    // Only allow editing if status is pending or rejected
    if (!['pending', 'rejected'].includes(experience.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only edit pending or rejected experiences',
      })
    }

    // Update fields
    Object.assign(experience, req.body)
    await experience.save()

    res.json({
      success: true,
      message: 'Experience updated',
      experience,
    })
  } catch (error) {
    console.error('Error updating experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message,
    })
  }
}

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || req.user?.userId

    const experience = await Experience.findById(id)

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      })
    }

    // Check if user owns this experience
    if (experience.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own experiences',
      })
    }

    await Experience.findByIdAndDelete(id)
    await Material.deleteMany({ sourceExperience: id })

    res.json({
      success: true,
      message: 'Experience deleted',
    })
  } catch (error) {
    console.error('Error deleting experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience',
      error: error.message,
    })
  }
}

// Save draft
// controllers/experienceController.js

// ... (keep your other imports and functions)

// Save draft - FULLY RECTIFIED
export const saveDraft = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    
    // Extract everything from body, but separate _id if it exists
    const { _id, rounds, ...otherData } = req.body;

    const draft = await Experience.findOneAndUpdate(
      { userId, status: 'draft' }, // Look for the existing draft for this user
      { 
        $set: { 
          ...otherData,
          rounds: Array.isArray(rounds) ? rounds : [],
          userId,
          status: 'draft'
        } 
      },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist, update if it does
        runValidators: false 
      }
    );

    res.status(200).json({ success: true, draft });
  } catch (error) {
    console.error("Duplicate Key Error Logic:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// Get draft - RECTIFIED
export const getDraft = async (req, res) => {
  try {
    const userId = req.user.userId; // Match JWT field

    const draft = await Experience.findOne({
      userId,
      status: 'draft',
    });

    res.json({
      success: true,
      draft: draft || null,
    });
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch draft',
      error: error.message,
    });
  }
}

// Get experiences by company
export const getExperiencesByCompany = async (req, res) => {
  try {
    const { company } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const experiences = await Experience.find({
      companyName: company,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Experience.countDocuments({
      companyName: company,
      status: 'approved',
    })

    res.json({
      success: true,
      experiences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching company experiences:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message,
    })
  }
}

// Get experiences by batch
export const getExperiencesByBatch = async (req, res) => {
  try {
    const { batch } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const experiences = await Experience.find({
      batch,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Experience.countDocuments({
      batch,
      status: 'approved',
    })

    res.json({
      success: true,
      experiences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching batch experiences:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message,
    })
  }
}
