<template>
  <div class="space-y-4">
    <h2 class="font-semibold text-lg">Tags</h2>
    <ul class="space-y-2 text-gray-600">
      <li v-for="tag in tags" :key="tag" class="hover:text-blue-600 cursor-pointer" @click="searchTag">
        #{{ tag }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const tags = ['vue', 'javascript', 'frontend', 'webdev', 'design']
const router = useRouter()
function searchTag(event) {
  const tagText = event.target.innerText.replace('#', '').trim()
  router.push({ path: '/search', query: { tag: tagText } })
}
</script>
