<template>
  <div class="space-y-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <h2 class="text-lg font-semibold mb-3">
      More from {{ author }}
    </h2>

    <ul class="space-y-3">
      <li
        v-for="post in posts"
        :key="post.id"
        class="cursor-pointer group"
        @click="goToDetail(post.id)"
      >
        <h3 class="font-medium text-gray-800 group-hover:text-blue-600 transition">
          {{ post.title }}
        </h3>
        <p class="text-sm text-gray-500">{{ post.date }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  author: { type: String, required: true },
  posts: { type: Array, required: true }
})

const router = useRouter()
const goToDetail = id => router.push(`/blog/${id}`)
</script>
