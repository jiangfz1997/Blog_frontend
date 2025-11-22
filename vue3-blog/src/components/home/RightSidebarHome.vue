<template>
  <div class="space-y-4">
    <h2 class="font-semibold text-lg">Trending</h2>
    <ul class="space-y-2">
      <li v-for="trend in trends" :key="trend.title" class="hover:text-blue-600 cursor-pointer">
        {{ trend.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const trends = [
  { title: 'Top 10 Vue 3 Tips' },
  { title: 'State Management Simplified' },
  { title: 'Dark Mode in Tailwind' },
]
</script>
