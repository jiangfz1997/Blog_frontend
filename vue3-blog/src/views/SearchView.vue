<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">
      Search Results: 
      <span class="text-blue-600">"{{ searchQuery }}"</span>
    </h1>

    <div v-if="loading" class="text-center py-10">
      Searching...
    </div>

    <div v-else-if="results.length > 0" class="grid gap-6">
      <ArticleCard 
        v-for="blog in results" 
        :key="blog.id" 
        :post="blog" 
      />
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearch } from '@/composables/useSearch'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const { results, loading, executeSearch } = useSearch()

// 用于在标题显示当前搜的啥
const searchQuery = computed(() => route.query.q || route.query.tag || '')

// 核心逻辑：根据 URL 参数发起请求
const handleSearch = () => {
  const query = route.query
  // 比如后端接受 { q: '...', tag: '...' }
  // 如果 URL 是 /search?q=vue，这里 query 就是 { q: 'vue' }
  if (Object.keys(query).length > 0) {
    executeSearch(query)
  }
}

// 1. 页面初次加载时执行
onMounted(handleSearch)

// 2. ★★★ 关键：监听路由变化 ★★★
// 当用户在搜索页再次输入新关键词，或者点击 Tag 时，
// 页面组件不会销毁重建，只是 URL 变了，所以必须 watch
watch(() => route.query, () => {
  handleSearch()
})
</script>