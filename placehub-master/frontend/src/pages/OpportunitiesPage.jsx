import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Briefcase, Building2, MapPin, Clock8 } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import { opportunitiesAPI } from '../services/api'

const ITEMS_PER_PAGE = 9
const DEFAULT_FILTERS = {
  categories: ['Software', 'Hardware', 'Design', 'Content', 'Business', 'Others'],
  companies: [],
  types: [],
  locationTypes: [],
  experienceLevels: [],
}

const formatLabel = (value = '') => {
  if (!value) return ''
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [stats, setStats] = useState({ categoryCounts: [], typeCounts: [], locations: [] })
  const [loading, setLoading] = useState(false)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocationType, setSelectedLocationType] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true)
      try {
        const { data } = await opportunitiesAPI.getFilters()
        if (data.success) {
          setFilters({
            ...DEFAULT_FILTERS,
            ...data.filters,
            categories:
              data.filters?.categories?.length > 0
                ? data.filters.categories
                : DEFAULT_FILTERS.categories,
          })
        }
      } catch (err) {
        console.error('Failed to load filters', err)
      } finally {
        setFiltersLoading(false)
      }
    }

    loadFilters()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchInput.trim()), 350)
    return () => clearTimeout(handler)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategory, selectedType, selectedLocationType, selectedExperience, selectedCompany, sortBy])

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {
          page,
          limit: ITEMS_PER_PAGE,
          sortBy,
          search: searchTerm || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
          locationType: selectedLocationType !== 'all' ? selectedLocationType : undefined,
          experience: selectedExperience !== 'all' ? selectedExperience : undefined,
          company: selectedCompany || undefined,
        }

        const response = await opportunitiesAPI.list(params)
        if (response.data.success) {
          setOpportunities(response.data.opportunities)
          setPagination(response.data.pagination)
          setStats(response.data.stats)
        }
      } catch (err) {
        console.error('Failed to load opportunities', err)
        setError(err.response?.data?.message || 'Unable to load opportunities right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [page, searchTerm, selectedCategory, selectedType, selectedLocationType, selectedExperience, selectedCompany, sortBy])

  const categoryOptions = useMemo(() => {
    const merged = Array.from(new Set([...DEFAULT_FILTERS.categories, ...(filters.categories || [])]))
    return ['All', ...merged]
  }, [filters.categories])
  const typeOptions = useMemo(() => ['all', ...filters.types], [filters.types])
  const locationOptions = useMemo(() => ['all', ...filters.locationTypes], [filters.locationTypes])
  const experienceOptions = useMemo(() => ['all', ...filters.experienceLevels], [filters.experienceLevels])

  const handleResetFilters = () => {
    setSelectedCategory('All')
    setSelectedType('all')
    setSelectedLocationType('all')
    setSelectedExperience('all')
    setSelectedCompany('')
    setSortBy('recent')
  }

  const renderEmptyState = () => (
    <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center shadow-sm">
      <div className="w-20 h-20 rounded-2xl bg-secondary/10 mx-auto flex items-center justify-center mb-6">
        <Briefcase className="text-secondary" size={42} />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4">No opportunities match your filters</h3>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Adjust filters or search keywords to explore more roles shared by the PlaceHub community.
      </p>
      <button
        onClick={handleResetFilters}
        className="px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Reset Filters
      </button>
    </div>
  )

  return (
    <MainLayout>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm font-semibold text-white/70 mb-4">
                Opportunities Board
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                Internships and full-time roles sourced directly from students.
              </h1>
              <p className="text-lg text-white/90 max-w-3xl">
                Crowd-sourced openings with deadlines, stipend insights, and must-have skills. Filter, search, and apply in minutes.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/opportunities/submit"
                  className="px-6 py-3 rounded-2xl bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 transition"
                >
                  Submit an opportunity
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-2xl border-2 border-white/60 text-white font-semibold hover:bg-white/10 transition"
                >
                  Browse latest roles
                </button>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Live stats</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{pagination.total}</p>
                  <p className="text-sm text-white/70">Open roles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.categoryCounts?.length || 0}</p>
                  <p className="text-sm text-white/70">Categories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.typeCounts?.length || 0}</p>
                  <p className="text-sm text-white/70">Opportunity types</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.locations?.length || 0}</p>
                  <p className="text-sm text-white/70">Locations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Results */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[290px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">Categories</h3>
                {filtersLoading && <span className="text-xs text-slate-400">Loading...</span>}
              </div>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-2xl font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                <Filter size={18} /> Refine results
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-500">Type</p>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All types' : formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-500">Location type</p>
                <select
                  value={selectedLocationType}
                  onChange={(e) => setSelectedLocationType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2"
                >
                  {locationOptions.map((value) => (
                    <option key={value} value={value}>
                      {value === 'all' ? 'All formats' : formatLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-500">Experience level</p>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2"
                >
                  {experienceOptions.map((value) => (
                    <option key={value} value={value}>
                      {value === 'all' ? 'All levels' : formatLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Company</p>
                <div className="flex flex-wrap gap-2">
                  {filters.companies.slice(0, 6).map((company) => (
                    <button
                      key={company}
                      onClick={() => setSelectedCompany((prev) => (prev === company ? '' : company))}
                      className={`px-3 py-1 rounded-full border text-xs font-semibold transition ${
                        selectedCompany === company
                          ? 'bg-secondary text-white border-secondary'
                          : 'border-slate-200 text-slate-600 hover:border-secondary'
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 rounded-2xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>

            <div className="bg-primary text-white rounded-3xl p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Insights</p>
              <div className="mt-4 space-y-4">
                {stats?.categoryCounts?.slice(0, 3).map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between">
                    <span>{entry._id || 'General'}</span>
                    <span className="font-semibold">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search company, role, tags, or skills"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-primary"
                >
                  <option value="recent">Recently added</option>
                  <option value="closingSoon">Closing soon</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12 text-primary">Loading opportunities...</div>
              ) : opportunities.length === 0 ? (
                renderEmptyState()
              ) : (
                opportunities.map((opp) => (
                  <div
                    key={opp._id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {formatLabel(opp.opportunityType)}
                          </span>
                          {opp.locationType && (
                            <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                              {formatLabel(opp.locationType)}
                            </span>
                          )}
                          {opp.experienceLevel && (
                            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                              {formatLabel(opp.experienceLevel)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-primary">{opp.title}</h3>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Building2 size={16} />
                          <span>{opp.companyName}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary">
                        {opp.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} /> {opp.location || 'Location varies'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock8 size={16} /> Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                      </div>
                    </div>

                    {opp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {opp.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {skill}
                          </span>
                        ))}
                        {opp.skills.length > 4 && (
                          <span className="text-xs font-semibold text-slate-400">+{opp.skills.length - 4} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500">
                        Posted by <span className="font-semibold text-primary">{opp.postedByName || 'PlaceHub Member'}</span>
                      </p>
                      {opp.applicationUrl && (
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold px-5 py-3"
                        >
                          Apply now
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {opportunities.length > 0 && !loading && (
              <div className="flex items-center justify-between bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                <p className="text-sm text-slate-600">
                  Showing page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submission CTA */}
        <section className="bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="uppercase tracking-[0.35em] text-xs text-primary">Share openings</p>
              <h2 className="text-3xl font-bold text-slate-900">Seen an interesting role? Help juniors spot it faster.</h2>
              <p className="text-slate-600 leading-relaxed">
                Track off-campus drives, referral-ready opportunities, or fellowships you or your friends come across. Submissions go through a quick moderation pass before showing up on the board.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <li className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="block font-semibold text-primary">12h moderation</span>
                  <span>Listings are reviewed quickly so the board stays trustworthy.</span>
                </li>
                <li className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="block font-semibold text-primary">Smart routing</span>
                  <span>We highlight each role to the right batches and cohorts.</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold">Ready to submit?</h3>
              <p className="text-white/80 mt-2">Use the dedicated submission page to add details like deadlines, skills, and application links.</p>
              <Link
                to="/opportunities/submit"
                className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 transition"
              >
                Go to submission page
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default OpportunitiesPage
