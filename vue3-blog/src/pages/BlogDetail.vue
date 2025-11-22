<template>
  <DefaultLayout>
    <!-- 左侧栏 -->


    <!-- 主内容 -->
    <template #main>
      <div class="bg-white rounded-lg p-10 shadow-sm border border-gray-200">
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        <p class="text-gray-600 mb-6 ">by {{ post.author }}</p>
        <div v-html="post.content" class="prose max-w-none p-2 border-t border-gray-200 my-2"></div>
         <CommentSection v-if="post.id" :blogId="post.id" />
      </div>
    </template>

    <!-- 右侧栏 -->
    <template #right>
        <AuthorProfile
        :name="author.name"
        :bio="author.bio"
        :avatar="author.avatar"
      />
       <AuthorMorePosts :author="author.name" :posts="morePosts" />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlog } from '@/api/blog.js'
import { getUserProfile } from '@/api/user.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthorProfile from '@/components/blogDetail/AuthorProfile.vue'
import AuthorMorePosts from '@/components/blogDetail/AuthorMorePosts.vue'
import CommentSection from '@/components/blogDetail/CommentSection.vue'


const route = useRoute()
const post = ref({})
const author = ref({})
const morePosts = ref([])

onMounted(async () => {
  const id = route.params.id
  const blogData = await getBlog(id)
  console.log('Loaded blog data:', blogData)
  
  post.value = {
    id: blogData.id,
    title: blogData.title,
    author: blogData.author_id,
    content: blogData.content,
  }
  const authorData = await getUserProfile(blogData.author_id)
  console.log('Loaded author data:', authorData)
  author.value = {
    name: authorData.username,
    bio: authorData.bio,
    avatar: authorData.avatar
  }

  morePosts.value = [
    { id: 2, title: 'Understanding Pinia in 10 Minutes', date: 'Nov 10, 2025' },
    { id: 3, title: 'Deploying Vue Apps with Docker', date: 'Nov 8, 2025' },
    { id: 4, title: 'Building REST APIs with FastAPI', date: 'Nov 6, 2025' },
  ]
})
</script>
