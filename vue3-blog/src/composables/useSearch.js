import { ref } from 'vue'
import { searchBlogs } from '@/api/blog'


export function useSearch() {
  const results = ref([])
  const total = ref(0)
  const loading = ref(false)
  const pageSize = 10 

  const executeSearch = async (params) => {
    loading.value = true
    console.log('Executing search with params:',
        params
    )
    console.log("params are:  ", params)
    try {
      // 1. 调用 API
      const apiParams = {
        keyword: params.q || '', 
        tags: params.tags || [],
        page: params.page || 1,
        size: pageSize,
        sort_by: params.sortBy || 'created',
        sort_order: params.sortOrder || 'desc'
      }
      console.log('API search params:', apiParams)
      // 注意：这里得到的是后端原始返回 { blogs: { total: 3, items: [...] } }
      const rawData = await searchBlogs(apiParams)
      
      // 2. ★★★ 核心数据映射 (Data Mapping) ★★★
      // 我们要从 rawData.blogs.items 里取数据，并把字段名改成 ArticleCard 认识的名字
      if (rawData.blogs && Array.isArray(rawData.blogs.items)) {
        
        results.value = rawData.blogs.items.map(item => ({
          // 必须映射的字段
          id: item.blog_id,             // ArticleCard 用的是 post.id，后端是 blog_id
          title: item.title,
          author_username: item.author_username,
          created_at: item.created_at,

          // 缺失字段的“默认兜底值” (避免 ArticleCard 报错)
          tags: item.tags || [],                     // 后端没返回 tags，先给个空数组
          content: '',                  // 后端没返回 content，摘要会显示空
          views: item.view_count || 0,                     // 假装 0 阅读
          likes: 0,                     // 假装 0 点赞
          comments_count: 0             // 假装 0 评论
        }))

        total.value = rawData.blogs.total
      } else {
        results.value = []
        total.value = 0
      }

    } catch (e) {
      console.error('Search error:', e)
      results.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  return { results, total, loading, pageSize, executeSearch }
}