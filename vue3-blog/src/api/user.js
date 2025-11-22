import api from '@/services/api.js'

export async function getUserProfile(id) {
  return await api.get(`/users/${id}/public`)
}