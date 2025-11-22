<template>
  <DefaultLayout>
    <template #main>
      <div class="bg-white rounded-lg p-8 border border-gray-200 shadow-sm min-h-[600px]">
        
        <div class="flex justify-between items-end mb-6">
          <h1 class="text-2xl font-semibold text-gray-800">Search Results</h1>
          <span v-if="!loading" class="text-sm text-gray-500">
            Found {{ total }} result<span v-if="total !== 1">s</span>
          </span>
        </div>

        <div class="mb-8">
          <n-input-group>
            <n-input 
              v-model:value="searchInput" 
              placeholder="Search blog title or tag..." 
              size="large"
              @keyup.enter="triggerSearch"
            >
              <template #prefix>
                <span class="text-gray-400">🔍</span>
              </template>
            </n-input>
            <n-button type="primary" size="large" @click="triggerSearch">
              Search
            </n-button>
          </n-input-group>
        </div>

        <div v-if="loading" class="py-20 flex justify-center">
          <n-spin size="large" description="Searching..." />
        </div>

        <div v-else-if="results.length > 0" class="space-y-6">
          <ArticleCard 
            v-for="post in results" 
            :key="post.id" 
            :post="post" 
          />
          
          <div class="flex justify-center mt-10 pt-6 border-t border-gray-100">
            <n-pagination
              v-model:page="currentPage"
              :item-count="total"
              :page-size="pageSize"
              :on-update:page="handlePageChange"
            />
          </div>
        </div>

        <div v-else class="py-20">
          <n-empty description="No results found">
            <template #extra>
              <span class="text-gray-400 text-sm">Try adjusting your search terms.</span>
            </template>
          </n-empty>
        </div>

      </div>
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 引入布局
import DefaultLayout from '@/layouts/DefaultLayout.vue'
// 引入组件 (请确保这个文件是用 Naive UI 写的版本)
import ArticleCard from '@/components/ArticleCard.vue'
// 引入逻辑
import { useSearch } from '@/composables/useSearch'
// 引入 Naive UI 组件 (按需引入，如果没做自动引入配置的话)
import { NInput, NInputGroup, NButton, NSpin, NPagination, NEmpty } from 'naive-ui'

const route = useRoute()
const router = useRouter()

// 解构 Composable
const { results, total, loading, pageSize, executeSearch } = useSearch()

// 本地输入框状态
const searchInput = ref('')

// 当前页码 (从 URL 获取，如果 URL 没 page 参数则默认为 1)
const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (val) => handlePageChange(val) // 双向绑定兼容
})

// --- 核心逻辑 ---

// 1. 根据 URL 参数执行搜索
const performSearchFromRoute = () => {
  // 从浏览器地址栏获取参数
  const q = route.query.q || ''
  const page = Number(route.query.page) || 1
  const size = Number(route.query.size) || 10

  // 这里的 searchInput 只是为了回显给用户看
  searchInput.value = q 

  // 调用 Composable (useSearch.js)
  // 我们统一用 'q' 代表搜索词，把脏活留给 API 层去处理
  executeSearch({ q, page, size })
}

// 2. 触发搜索 (用户输入 -> 推送 URL)
const triggerSearch = () => {
  const val = searchInput.value.trim()
  
  if (!val) return

  // 简化逻辑：
  // 不管是不是 # 开头，都把它当做 q (Query) 放到 URL 里
  // 这样 URL 就是 /search?q=%23javascript (即 #javascript)
  // 或者 /search?q=vue
  router.push({ 
    path: '/search', 
    query: { 
      q: val, 
      page: 1,
      size: 10
    } 
  })
}
// 3. 用户点击分页 -> 修改 URL
const handlePageChange = (newPage) => {
  router.push({
    path: '/search',
    query: { ...route.query, page: newPage } // 保留现有查询条件，只改页码
  })
  // Naive UI 的 Pagination 会自动滚动到顶部吗？如果没有，可以手动加 window.scrollTo(0,0)
}

// --- 生命周期 ---

onMounted(() => {
  performSearchFromRoute()
})

// 监听路由变化 (点击 Tag、点击分页、浏览器的后退按钮都会触发)
watch(() => route.query, () => {
  performSearchFromRoute()
})
</script>