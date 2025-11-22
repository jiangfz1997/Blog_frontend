import api from '@/services/api.js'

export async function getBlog(id) {
  return await api.get(`/blogs/${id}`)
}

export async function getBlogListByUserId(id, page=1, limit=10) {
  return await api.get(`/blogs/author/${id}`, {
    params: {
      page,
      limit
    }
  })
}

export async function publishBlog(blogData) {
  return await api.post('/blogs', blogData)
}

export async function updateBlog(blogId, blogData) {
  return await api.patch(`/blogs/${blogId}`, blogData)
}

export function searchBlogs(params) {
  console.log('API call to searchBlogs with params:', params)
  return api.get('/search/blogs', { params })
}