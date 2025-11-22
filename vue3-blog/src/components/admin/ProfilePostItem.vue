<template>
  <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group">
    
    <div class="flex-1 min-w-0 mr-4"> <div class="flex items-center gap-2 mb-1">
        <h3 
          class="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-600"
          @click="goToDetail"
        >
          {{ post.title }}
        </h3>
        <span class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Published</span>
      </div>
      
      <div class="flex items-center gap-3 text-xs text-gray-500">
        <span>Created: {{ formatDate(post.created_at) }}</span>
        <span>•</span>
        <span class="flex gap-1">
          <span v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
        </span>
      </div>
    </div>

      <div v-if="showActions" class="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
      <button @click.stop="$emit('edit', post.id)" class="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
        Edit
      </button>
      <button @click.stop="$emit('delete', post.id)" class="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100">
        Delete
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  post: { type: Object, required: true },
  showActions: { type: Boolean, default: false }

})

// Define events for parent component to handle logic
const emit = defineEmits(['edit', 'delete'])
const router = useRouter()

const goToDetail = () => {
  router.push(`/blog/${props.post.id}`)
}

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>