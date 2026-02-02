import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
}

// Profile APIs
export const profileAPI = {
  create: (data) => api.post('/profile', data),
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
}

// Experience APIs
export const experienceAPI = {
  create: (data) => api.post('/experience', data),
  getAll: () => api.get('/experience/recent'),
  getMyExperiences: () => api.get('/experience/my'),
  getById: (id) => api.get(`/experience/${id}`),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
  saveDraft: (data) => api.post('/experience/draft', data),
  getDraft: () => api.get('/experience/draft'),
}

export default api
