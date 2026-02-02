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
  // New Methods
  saveMetadata: (data) => api.post('/experience/metadata', data),
  saveRounds: (experienceId, rounds) => api.post(`/experience/rounds/${experienceId}`, { rounds }),
  saveMaterials: (experienceId, materials) => api.post(`/experience/materials/${experienceId}`, { materials }),
  submit: (experienceId) => api.post(`/experience/submit/${experienceId}`),

  // Existing/Updated Methods
  getAll: () => api.get('/experience/recent'),
  getMyExperiences: () => api.get('/experience/my'),
  getById: (id) => api.get(`/experience/${id}`),
  delete: (id) => api.delete(`/experience/${id}`),

  // Helper for loading draft state if needed (optional usage)
  getDraft: () => api.get('/experience/draft'),
  getOptions: () => api.get('/experience/options'),
}

// Chat APIs
export const questionService = {
  getQuestions: () => api.get('/questions'),
  createQuestion: (text, sessionId) => api.post('/questions', { text, sessionId }),
  updateStatus: (id, status) => api.patch(`/questions/${id}/status`, { status }),
}

export const answerService = {
  getAnswers: (questionId) => api.get(`/answers/${questionId}`),
}

export const sessionService = {
  init: (data) => api.post('/sessions/init', data),
}




export default api
