'use client';

function AcademicDetailsStep({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Electrical',
    'Civil',
    'Other',
  ]

  const years = ['First Year', 'Second Year', 'Third Year', 'Final Year']
  const currentYear = new Date().getFullYear()
  const batchYears = Array.from({ length: 10 }, (_, i) => currentYear + i)

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-primary mb-6">Academic Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          >
            <option value="">Select your year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          >
            <option value="">Select your branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Year *</label>
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
        >
          {batchYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Tip:</span> Your academic information helps us connect you with relevant
          opportunities and mentorship.
        </p>
      </div>
    </div>
  )
}

export default AcademicDetailsStep
