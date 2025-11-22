// src/services/api.js
import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  },
})

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error?.response?.status
    const msg = error?.response?.data?.message || error.message
    console.error('[API ERROR]', status, msg)

    if (status === 401) {
      console.warn('Login required to perform this action')
    }

    if (status === 403) {
      console.warn('No permission to perform this action')
    }

    return Promise.reject(error)
  }
)

export default api
