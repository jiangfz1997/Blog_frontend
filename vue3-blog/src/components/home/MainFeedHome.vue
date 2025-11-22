<template>
  <div class="space-y-4">
    <PostCard
      v-for="post in posts"
      :id="post.id"
      :title="post.title"
      :author="post.author"
      :tags="post.tags"
    />
  </div>
</template>

<script setup>
import PostCard from '@/components/PostCard.vue'

defineProps({
  posts: {
    type: Array,
    required: true
  }
});
const posts = [
  { id: 1, title: 'Why Vue3 Feels So Good', author: 'fangzhou', tags: ['vue', 'frontend'] },
  { id: 2, title: 'Understanding Pinia in 10 Minutes', author: 'gaurav', tags: ['vue', 'state'] },
]

</script>
