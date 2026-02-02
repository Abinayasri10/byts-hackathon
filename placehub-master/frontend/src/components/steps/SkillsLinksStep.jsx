'use client';

import { useState, useRef } from 'react'

const SUGGESTED_SKILLS = [
  'JavaScript',
  'Python',
  'React',
  'Java',
  'Node.js',
  'SQL',
  'CSS',
  'HTML',
  'Git',
  'Communication',
  'Problem Solving',
  'Leadership',
  'Data Analysis',
  'API Design',
  'Cloud',
  'AWS',
]

function SkillsLinksStep({ formData, onChange }) {
  const [skillInput, setSkillInput] = useState('')
  const fileInputRef = useRef(null)

  const handleAddSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      onChange({ skills: [...formData.skills, skill] })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    onChange({
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      handleAddSkill(skillInput.trim())
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange({ profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    } else if (file) {
      alert('File size must be less than 2MB')
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-primary mb-6">Skills & Links</h2>

      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Your Skills *</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          />
          <button
            type="button"
            onClick={() => handleAddSkill(skillInput.trim())}
            disabled={!skillInput.trim()}
            className="px-4 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {/* Selected Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.skills.map((skill) => (
            <div
              key={skill}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Suggested Skills */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2 font-medium">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter((skill) => !formData.skills.includes(skill))
              .slice(0, 8)
              .map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-3 py-1 text-xs border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="url"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/yourprofile"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          />
        </div>
      </div>

      {/* Profile Picture Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (JPG/PNG, Max 2MB)</label>
        <div className="flex gap-4 items-start">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-5 transition flex items-center justify-center overflow-hidden"
          >
            {formData.profilePicture ? (
              <img src={formData.profilePicture || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <svg className="w-6 h-6 text-primary mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs text-primary font-medium">Upload</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Click to upload your profile picture</p>
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsLinksStep
