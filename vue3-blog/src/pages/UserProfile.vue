<template>
  <DefaultLayout>
    <template #main>
      <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm max-w-3xl mx-auto">

        <!-- Profile Section -->
        <div class="flex items-center gap-6 mb-6">
          <div class="relative shrink-0">
            <img
              :src="avatar"
              alt="avatar"
              class="w-20 h-20 rounded-full object-cover border border-gray-300"
            />

            <!-- avatar edit button -->
            <!-- <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            /> -->

            <!-- <button
              @click="fileInput.click()"
              class="absolute bottom-0 right-0 bg-gray-100 hover:bg-gray-200 rounded-full p-1 border border-gray-300"
            >
              ✏️
            </button> -->
          </div>

          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ username }}
            </h1>
            <p class="text-gray-500 mt-1">{{ bio }}</p>
          </div>
        </div>

        <hr class="border-t border-gray-200 my-6" />

        <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold border-l-4 border-blue-500 pl-3">
          {{ isOwner ? 'My Posts' : 'Posts' }}
        </h2>
        <button v-if="isOwner" class="text-sm text-blue-600 font-medium">+ New Draft</button>
      </div>

      <div class="space-y-3">
        <ProfilePostItem 
          v-for="post in blogs" 
          :key="post.id" 
          :post="post"
          :show-actions="isOwner" 
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
    <div class="mt-6 flex justify-center">
      <NPagination
        v-model:page="page"
        :page-size="pageSize"
        :item-count="totalPosts"
        :page-count="totalPages"
        @update:page="loadBlogs"
      />
    </div>
    </div>
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { NPagination } from "naive-ui"
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PostCard from '@/components/PostCard.vue'

import { getUserProfile } from '@/api/user.js'
import { getBlogListByUserId } from '@/api/blog.js'
import { useUserStore } from '@/store/userStore'
import ProfilePostItem from '@/components/admin/ProfilePostItem.vue'
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const username = ref('')
const userid = ref('')
const avatar = ref('')
const bio = ref('Frontend Developer at Netease Games.')
const fileInput = ref(null)
const page = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)
const totalPages = ref(0)
const blogs = ref([])
const isOwner = computed(() => {

  if (!userStore.user) return false
  return userStore.user.id === route.params.id
})

onMounted(async() => {
  userid.value = route.params.userid || 'fangzhou'
  
  const userInfo = await getUserProfile(userid.value)
  await loadBlogs(userid.value, page.value, pageSize.value)
  console.log("blogList:", blogs.value)
  username.value = userInfo.username
  avatar.value = userInfo.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'


})


const loadBlogs = async () => {
  const data = await getBlogListByUserId(userid.value, page.value, pageSize.value)

  blogs.value = data.items
  totalPosts.value = data.total
  totalPages.value = Math.ceil(data.total / pageSize.value)

  console.log("当前页:", page.value)
  console.log("总页数:", totalPages.value)
}
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = e => {
    avatar.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = () => {
  console.log('Profile saved:', {
    username: username.value,
    avatar: avatar.value,
  })
  alert('Profile updated (mock)!')
}

const goToBlog = (id) => {
  router.push(`/blog/${id}`)
}
const handleEdit = (id) => console.log('Edit', id)
const handleDelete = (id) => console.log('Delete', id)
</script>
