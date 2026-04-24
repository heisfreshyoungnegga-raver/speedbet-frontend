// === API CLIENT (from Betfox reference patterns) ===
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (from Shannon's auth patterns)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('speedbet-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor (from penetration tester web_ui.py patterns)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after']
      return Promise.reject({
        status: 'error',
        message: 'Rate limit exceeded. Try again later.',
        retryAfter: retryAfter ? parseInt(retryAfter) : 60,
      })
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('speedbet-token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
