<template>
  <header class="sticky top-0 z-10 bg-white border-b shadow-sm">
  <div class="max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-8 p-4">
      <div class="flex items-center">
        <h1
          class="text-xl font-bold cursor-pointer whitespace-nowrap"
          @click="gotoHome"
        >
          Blog_Title
        </h1>
      </div>

      <div class="flex justify-center">
        <div class="relative w-full max-w-xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles, tags..."
            class="w-full border border-gray-300 rounded-full py-2.5 pl-5 pr-20 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
            @keyup.enter="handleSearch"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm transition"
          >
            Go
          </button>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2">
        

        <template v-if="!userStore.isLoggedIn">
          <button
            @click="openLogin"
            class="text-sm px-3 py-1 rounded border hover:bg-gray-100"
          >
            Login
          </button>
          <button
            @click="openSignup"
            class="text-sm px-3 py-1 rounded border hover:bg-gray-100"
          >
            Sign up
          </button>
        </template>

        <template v-else>
           <button
              @click="goWrite"
              class="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-blue-700"
            >
              Write a Post
            </button>
          <div class="relative">
           
            <button
              @click="toggleMenu"
              class="flex items-center gap-2 border rounded px-3 py-1 hover:bg-gray-100"
            >
              <div
                v-if="userStore.user?.avatarUrl"
                class="w-6 h-6"
              >
                <img
                  :src="userStore.user.avatarUrl"
                  class="w-6 h-6 rounded-full"
                />
              </div>
              <div
                v-else
                class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium"
              >
                {{ userInitial }}
              </div>
              <span class="text-sm">{{ userStore.displayName }}</span>
            </button>

            <div
              v-if="menuOpen"
              class="absolute right-0 mt-2 w-40 bg-white border rounded shadow"
            >
              <button
                @click="goProfile"
                class="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                @click="handleLogout"
                class="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
     <LoginModal v-if="showLogin" @close="showLogin = false" @success="onAuthSuccess" @switchToSignup="openSignup" /> 
     <RegisterModal v-if="showSignup" @close="showSignup = false" @success="onAuthSuccess" @switchToLogin="openLogin" />
  </header>
</template>


<script setup>
import { ref, computed } from 'vue'
import { NInput, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'
import LoginModal from './LoginModal.vue'
import RegisterModal from './RegisterModal.vue'
const router = useRouter()
const userStore = useUserStore()

const showLogin = ref(false)
const showSignup = ref(false)
const menuOpen = ref(false)

function openLogin() {
  showLogin.value = true
}
function openSignup() {
  showSignup.value = true
}
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function goProfile() {
  menuOpen.value = false
  router.push({ path: `/user/${userStore.user?.id || ''}` })
}
function goWrite() {
  router.push({ name: 'CreateBlog' }).catch(()=>{})
}
function handleLogout() {
  userStore.logout()
  menuOpen.value = false
  router.push({ name: 'Home' }).catch(()=>{})
}

function gotoHome() {
  router.push({ name: 'Home' }).catch(()=>{})
}


function onLoginSuccess(user) {
  // 登录成功回调（可选）
  // 例如：跳转到个人主页或显示欢迎信息
  // router.push({ path: `/user/${user.name}` })
}

const userInitial = computed(() => {
  const n = userStore.user?.name || ''
  return n ? n.charAt(0).toUpperCase() : ''
})


const searchQuery = ref('')
function handleSearch() {
  const query = searchQuery.value.trim()
  if (query) {
    router.push({ path: '/search', query: { q: query } }).catch(()=>{})
    searchQuery.value = ''
  }
} 
</script>
