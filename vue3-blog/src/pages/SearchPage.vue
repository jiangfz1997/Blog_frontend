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

        <div class="mb-4">
          <n-input-group>
            <n-input 
              v-model:value="searchInput" 
              placeholder="Type keyword (e.g. 'tutorial') or tag (e.g. '#python')..." 
              size="large"
              @keyup.enter="triggerSearch"
              clearable 
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

        <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-8">
          <span class="text-xs text-gray-500 mr-1 uppercase tracking-wide font-bold">Filters:</span>
          
          <n-tag 
            v-if="currentKeyword" 
            closable 
            type="info" 
            size="medium" 
            @close="removeKeyword"
          >
            Keyword: {{ currentKeyword }}
          </n-tag>

          <n-tag 
            v-for="tag in selectedTags" 
            :key="tag" 
            closable 
            type="success" 
            size="medium" 
            @close="removeTag(tag)"
          >
            Tag: {{ tag }}
          </n-tag>

          <n-button 
            text 
            type="error" 
            size="small" 
            class="ml-2 underline" 
            @click="clearAllFilters"
          >
            Clear All
          </n-button>
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
              <span class="text-gray-400 text-sm">Try removing some filters to see more results.</span>
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
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useSearch } from '@/composables/useSearch'
// 引入 NTag
import { NInput, NInputGroup, NButton, NSpin, NPagination, NEmpty, NTag } from 'naive-ui'

const route = useRoute()
const router = useRouter()

// 状态定义
const selectedTags = ref([])
// 方便 UI 展示用的 currentKeyword，直接取 URL
const currentKeyword = computed(() => route.query.q || '')
const searchInput = ref('')

// 计算属性：是否有任何激活的过滤器
const hasActiveFilters = computed(() => {
  return !!currentKeyword.value || selectedTags.value.length > 0
})

const { results, total, loading, pageSize, executeSearch } = useSearch()

const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (val) => handlePageChange(val)
})

// --- 核心逻辑 ---

// 1. 从 URL 同步状态并执行搜索
const performSearchFromRoute = () => {
  const q = route.query.q || ''
  const page = Number(route.query.page) || 1
  const size = Number(route.query.size) || 10
  
  // 处理 Tags (兼容 string 和 array)
  let tags = [];
  const rawTags = route.query.tags;
  if (Array.isArray(rawTags)) {
    tags = rawTags;
  } else if (rawTags) {
    tags = [rawTags]; 
  }
  
  // 回显状态
  searchInput.value = q 
  selectedTags.value = tags;
  
  executeSearch({ q, tags, page, size })
}

// 2. 触发搜索 (搜索框回车或点击按钮)
// 2. 触发搜索 (增量模式)
const triggerSearch = () => {
  const val = searchInput.value.trim()
  
  if (!val) return // 空值不处理

  // 获取当前状态的副本
  let newTags = [...selectedTags.value]
  let newKeyword = route.query.q || ''

  // --- 逻辑分支 ---

  // 场景 A: 用户输入了 Tag (以 # 开头)
  if (val.startsWith('#')) {
    // 去掉 # 号，拿到标签名
    const tagName = val.slice(1).trim()
    
    if (tagName) {
      // 避免重复添加
      if (!newTags.includes(tagName)) {
        newTags.push(tagName)
      }
    }
  } 
  // 场景 B: 用户输入了 Keyword
  else {
    // 增量逻辑：如果原来有词，就加空格拼在后面；如果没有，就直接赋值
    // 例如：原来是 "python"，输入 "tutorial"，变成 "python tutorial"
    if (newKeyword) {
      newKeyword = `${newKeyword} ${val}`
    } else {
      newKeyword = val
    }
  }

  // --- 推送 URL ---
  router.push({ 
    path: '/search', 
    query: { 
      ...route.query,
      q: newKeyword || undefined, // 如果拼完是空的，移除参数
      tags: newTags,              // 更新后的标签数组
      page: 1                     // 只要改变条件，必须重置回第一页
    } 
  })

  // 【体验优化】增量搜索通常在回车后清空输入框，方便输入下一个
  searchInput.value = ''
}

// 3. 【新增】移除关键词
const removeKeyword = () => {
  searchInput.value = '' // 立即清空输入框 UI
  router.push({
    query: {
      ...route.query,
      q: undefined, // 移除 q 参数
      page: 1
    }
  })
}

// 4. 【新增】移除单个 Tag
const removeTag = (tagToRemove) => {
  // 过滤掉点击的 tag
  const newTags = selectedTags.value.filter(t => t !== tagToRemove)
  
  router.push({
    query: {
      ...route.query,
      tags: newTags, // 更新 tags
      page: 1
    }
  })
}

// 5. 【新增】清空所有
const clearAllFilters = () => {
  searchInput.value = ''
  router.push({ 
    path: '/search',
    query: {
      size: 10 // 重置回最纯净的状态
    }
  })
}

const handlePageChange = (newPage) => {
  router.push({
    path: '/search',
    query: { ...route.query, page: newPage }
  })
  // 建议加上滚动回顶部，提升体验
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// --- 生命周期 ---

onMounted(() => {
  performSearchFromRoute()
})

watch(() => route.query, () => {
  performSearchFromRoute()
})
</script>