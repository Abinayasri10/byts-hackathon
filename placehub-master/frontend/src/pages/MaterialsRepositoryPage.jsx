import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Filter,
  Layers,
  Loader2,
  Bookmark,
  Building2,
  BookOpen,
  ChevronRight,
  Compass,
  Tag,
} from 'lucide-react'
import MainLayout from '../components/MainLayout'
import { materialsAPI } from '../services/api'

const ITEMS_PER_PAGE = 6
const DEFAULT_STATS = { categoryCounts: [], topCompanies: [], tagCloud: [] }
const DEFAULT_FILTERS = {
  categories: [],
  types: [],
  difficulties: [],
  formats: [],
  companies: [],
  tags: [],
  topics: [],
}

function MaterialsRepositoryPage() {
  const [materials, setMaterials] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const [loading, setLoading] = useState(false)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)

  // Load filter metadata once
  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true)
      try {
        const response = await materialsAPI.getFilters()
        if (response.data.success) {
          setFilters({ ...DEFAULT_FILTERS, ...response.data.filters })
        }
      } catch (err) {
        console.error('Failed to load filters', err)
      } finally {
        setFiltersLoading(false)
      }
    }

    loadFilters()
  }, [])

  // Debounce search input to avoid spamming the API
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchInput.trim()), 350)
    return () => clearTimeout(handler)
  }, [searchInput])

  // Reset pagination whenever filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategory, selectedType, selectedDifficulty, selectedFormat, selectedCompany, sortBy])

  // Fetch materials whenever pagination/filtering changes
  useEffect(() => {
    const fetchMaterials = async () => {
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
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          format: selectedFormat !== 'all' ? selectedFormat : undefined,
          company: selectedCompany || undefined,
        }

        const response = await materialsAPI.list(params)
        if (response.data.success) {
          setMaterials(response.data.materials)
          setPagination(response.data.pagination)
          setStats(response.data.stats || DEFAULT_STATS)
        }
      } catch (err) {
        console.error('Failed to load materials', err)
        setError(err.response?.data?.message || 'Unable to load repository right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [page, searchTerm, selectedCategory, selectedType, selectedDifficulty, selectedFormat, selectedCompany, sortBy])

  const categoryOptions = useMemo(() => ['All', ...filters.categories], [filters.categories])

  const handleResetFilters = () => {
    setSelectedCategory('All')
    setSelectedType('all')
    setSelectedDifficulty('all')
    setSelectedFormat('all')
    setSelectedCompany('')
    setSortBy('recent')
  }

  const handleCompanyClick = (companyName) => {
    setSelectedCompany((prev) => (prev === companyName ? '' : companyName))
  }

  const handleTagSearch = (tagValue) => {
    const value = tagValue.trim()
    if (!value) return
    if (searchInput.includes(value)) return
    setSearchInput((prev) => (prev ? `${prev} ${value}` : value))
  }

  const renderEmptyState = () => (
    <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center shadow-sm">
      <div className="w-20 h-20 rounded-2xl bg-accent bg-opacity-10 mx-auto flex items-center justify-center mb-6">
        <Layers className="text-secondary" size={42} />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4">No materials match your filters</h3>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Try adjusting your filters or search keywords. You can also switch categories to explore other curated resources from fellow students.
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
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm font-semibold text-white/70 mb-4">
                Materials Repository
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                Company-ready prep decks curated by your peers.
              </h1>
              <p className="text-lg text-white/90 max-w-3xl">
                Filter by company, difficulty, format, or tags to jump straight into the notes, decks, and cheat sheets that matter for your next interview sprint.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-2xl bg-white text-primary font-semibold shadow-lg hover:-translate-y-0.5 transition"
                >
                  Browse repository
                </button>
                <a
                  href="#materials-insights"
                  className="px-6 py-3 rounded-2xl border-2 border-white/60 text-white font-semibold hover:bg-white/10 transition"
                >
                  View insights
                </a>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Live stats</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{pagination.total}</p>
                  <p className="text-sm text-white/70">Resources</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.categoryCounts?.length || 0}</p>
                  <p className="text-sm text-white/70">Categories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.topCompanies?.length || 0}</p>
                  <p className="text-sm text-white/70">Companies</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.tagCloud?.length || 0}</p>
                  <p className="text-sm text-white/70">Tags</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 pb-16 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-10 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search company, topic, tag, or role"
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
                  <option value="popular">Most viewed</option>
                  <option value="liked">Most liked</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              {/* Sidebar */}
              <aside className="space-y-5 w-full lg:w-[320px] self-start lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Layers size={20} className="text-secondary" />
                    <h3 className="text-lg font-semibold text-primary">Categories</h3>
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
                    <Filter size={20} className="text-secondary" />
                    Refine results
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase font-semibold text-slate-600">Material Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      >
                        <option value="all">All types</option>
                        {filters.types.map((typeOption) => (
                          <option key={typeOption} value={typeOption}>
                            {typeOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase font-semibold text-slate-600">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      >
                        <option value="all">All levels</option>
                        {filters.difficulties.map((difficultyOption) => (
                          <option key={difficultyOption} value={difficultyOption}>
                            {difficultyOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase font-semibold text-slate-600">Format</label>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      >
                        <option value="all">All formats</option>
                        {filters.formats.map((formatOption) => (
                          <option key={formatOption} value={formatOption}>
                            {formatOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleResetFilters}
                      className="w-full mt-2 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 size={20} className="text-secondary" />
                    <h3 className="text-lg font-bold text-primary">Top Companies</h3>
                  </div>
                  {filtersLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="animate-spin text-secondary" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.topCompanies.length === 0 && (
                        <p className="text-sm text-gray-500">No company stats yet</p>
                      )}
                      {stats.topCompanies.map((company) => {
                        const isActive = company._id === selectedCompany
                        return (
                          <button
                            key={company._id}
                            onClick={() => handleCompanyClick(company._id)}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left border transition-all ${
                              isActive
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
                            }`}
                          >
                            <span className="font-semibold text-sm">{company._id}</span>
                            <span className="text-xs text-slate-500">{company.count} resources</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={20} className="text-secondary" />
                    <h3 className="text-lg font-bold text-primary">Trending Tags</h3>
                  </div>
                  {filtersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-secondary" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {stats.tagCloud.length === 0 && (
                        <p className="text-sm text-gray-500">Tags will appear as materials get added.</p>
                      )}
                      {stats.tagCloud.map((tag) => (
                        <button
                          key={tag._id}
                          onClick={() => handleTagSearch(tag._id)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 text-secondary border border-secondary/40 text-xs font-semibold hover:bg-secondary hover:text-white transition"
                        >
                          #{tag._id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              {/* Materials Grid */}
              <section className="space-y-8 flex-1 w-full">
                <div className="grid gap-4 md:grid-cols-3">
                  {stats.categoryCounts.map((category) => (
                    <div
                      key={category._id}
                      className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm"
                    >
                      <p className="text-sm text-gray-500">{category._id}</p>
                      <p className="text-3xl font-black text-primary">{category.count}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Resources</p>
                    </div>
                  ))}
                  {stats.categoryCounts.length === 0 && (
                    <div className="md:col-span-3 text-center text-sm text-gray-500">
                      Category insights will appear once materials get approved.
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Curated Materials</h2>
                    <p className="text-sm text-slate-600">Showing {materials.length} of {pagination.total} resources</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Compass size={16} />
                    Company filter: {selectedCompany || 'All'}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {loading && (
                    <div className="flex justify-center py-16">
                      <div className="flex items-center gap-3 text-secondary font-semibold">
                        <Loader2 className="animate-spin" />
                        Loading materials...
                      </div>
                    </div>
                  )}

                  {!loading && error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                      {error}
                    </div>
                  )}

                  {!loading && !error && materials.length === 0 && renderEmptyState()}

                  {!loading && !error &&
                    materials.map((material) => (
                      <article
                        key={material._id}
                        className="relative bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col gap-5"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {material.difficulty || 'General'}
                            </span>
                            {material.format && (
                              <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                                {material.format}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold text-primary leading-snug">{material.title}</h3>
                            {material.companyName && (
                              <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                <Building2 size={16} className="text-secondary" />
                                {material.companyName}
                              </p>
                            )}
                          </div>

                          {material.description && (
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {material.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {material.category && (
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                              {material.category}
                            </span>
                          )}
                          {material.roleFocus && (
                            <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary font-semibold">
                              {material.roleFocus}
                            </span>
                          )}
                          {material.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-secondary text-white text-sm font-semibold px-5 py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                            >
                              Open <ChevronRight size={16} />
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                </div>

                {materials.length > 0 && !loading && !error && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.pages} · {pagination.total} resources total
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                        disabled={pagination.page >= pagination.pages}
                        className="px-4 py-2 rounded-xl border-2 border-primary bg-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default MaterialsRepositoryPage
