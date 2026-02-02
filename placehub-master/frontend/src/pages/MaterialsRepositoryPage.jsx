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

const ITEMS_PER_PAGE = 9
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
      <div className="bg-gradient-to-b from-[#eaf2f4] via-[#f5f8f9] to-[#fbfcfd] min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#041532] via-[#083059] to-[#0c4a6e] text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className="uppercase tracking-[0.3em] text-sm font-semibold text-white text-opacity-80 mb-4">
              Centralized Materials Repository
            </p>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  Discover company-specific interview prep resources curated by students.
                </h1>
                <p className="text-lg text-white text-opacity-90 max-w-3xl">
                  Explore structured materials aligned to companies, roles, and difficulty levels. Search, filter, and bookmark the resources that fuel your next success.
                </p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-2xl p-5 backdrop-blur-md border border-white border-opacity-20 shadow-2xl">
                <div className="flex items-center gap-3 text-lg font-semibold text-black">
                  <Bookmark size={24} className="text-accent" />
                  <span>{pagination.total} resources curated</span>
                </div>
                <p className="text-sm text-opacity-80 mt-1 text-black">Updated in real-time from approved experiences</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={22} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search company, role, topic, or tag..."
                  className="w-full pl-14 pr-4 py-4 rounded-2xl text-lg text-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-40 text-ellipsis"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 pb-16 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              {/* Sidebar */}
              <aside className="space-y-5 w-full lg:w-[320px] self-start lg:sticky lg:top-24">
                <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers size={20} className="text-secondary" />
                    <h3 className="text-lg font-bold text-primary">Categories</h3>
                  </div>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    {categoryOptions.map((category) => {
                      const isActive = category === selectedCategory
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-lg'
                              : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          <span>{category}</span>
                          {isActive && <span className="text-xs uppercase">Active</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter size={20} className="text-secondary" />
                    <h3 className="text-lg font-bold text-primary">Refine Results</h3>
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

                    <div>
                      <label className="text-xs uppercase font-semibold text-slate-600">Sort</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      >
                        <option value="recent">Recently added</option>
                        <option value="popular">Most viewed</option>
                        <option value="liked">Most liked</option>
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
                      className="rounded-2xl border border-gray-100 p-4 bg-gradient-to-br from-background to-white shadow-sm"
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

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {loading && (
                    <div className="col-span-full flex justify-center py-16">
                      <div className="flex items-center gap-3 text-secondary font-semibold">
                        <Loader2 className="animate-spin" />
                        Loading materials...
                      </div>
                    </div>
                  )}

                  {!loading && error && (
                    <div className="col-span-full bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                      {error}
                    </div>
                  )}

                  {!loading && !error && materials.length === 0 && renderEmptyState()}

                  {!loading && !error &&
                    materials.map((material) => (
                      <article
                        key={material._id}
                        className="relative bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {material.difficulty}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-primary mb-2">{material.title}</h3>
                        {material.companyName && (
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Building2 size={16} className="text-secondary" />
                            {material.companyName}
                          </p>
                        )}

                        {material.description && (
                          <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-3">
                            {material.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
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

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
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
