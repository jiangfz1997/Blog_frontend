import { ref } from 'vue'
import { searchBlogs } from '@/api/blog'

export function useSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  const executeSearch = async (params) => {
    loading.value = true
    error.value = null
    results.value = [] 

    try {
      const data = await searchBlogs(params)
      results.value = data.items || data // 根据后端结构调整
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    results,
    loading,
    error,
    executeSearch
  }
}