<template>
  <div class="space-y-4">
    <PostCard
      v-for="post in posts"
      :key="post.id" 
      :id="post.id"
      :title="post.title"
      :author="post.author"
      :tags="post.tags"
      :date="post.date"
      :viewCount="post.viewCount"
      :likeCount="post.likeCount"
      :isLiked="post.isLiked"
    />
    
    <div class="text-center py-4">
      <div v-if="loading" class="text-gray-400 text-sm">Loading...</div>
      
      <button 
        v-else-if="hasMore" 
        @click="loadMore"
        class="text-blue-500 hover:text-blue-700 text-sm font-medium px-4 py-2"
      >
        Load More Posts
      </button>
      
      <div v-else class="text-gray-400 text-sm">No more posts</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDiscoverFeed } from '@/api/blog.js' 
import PostCard from '@/components/PostCard.vue'

const posts = ref([])
const page = ref(1)
const pageSize = 5
const loading = ref(false)
const hasMore = ref(true)

const fetchPosts = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await getDiscoverFeed(page.value, pageSize)
    

    const newItems = res.blogs?.items || [] 

    const mappedItems = newItems.map(item => ({
      id: item.blog_id,             
      title: item.title,
      author: item.author_username, 
      tags: item.tags || [],
      date: item.created_at,        
      viewCount: item.view_count || 0,
      likeCount: item.like_count || 0, 
      isLiked: item.is_liked || false 
    }))

    posts.value.push(...mappedItems)
    console.log('Loaded posts:', posts.value)
    if (newItems.length < pageSize) {
      hasMore.value = false
    }
    
  } catch (error) {
    console.error('Failed to load discover feed:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  page.value++
  fetchPosts()
}

onMounted(() => {
  fetchPosts()
})
</script>