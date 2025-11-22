<template>
  <div class="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
    <h3 class="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"  @click="getBlogDetail">{{ title }}</h3>
    <p v-if="author" class="text-sm text-gray-500 mb-2">by {{ author }}</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  id: Number,
  title: String,
  author: String,
  tags: Array
})
function getBlogDetail() {
  router.push(`/blog/${props.id}`)
}

</script>
