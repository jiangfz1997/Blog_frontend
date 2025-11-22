<template>
  <teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      @keydown.escape.prevent="closeOnEsc"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="close"
      ></div>

      <div
        class="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Login</h3>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="email"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="email"
              autocomplete="email"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="password"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <p v-if="store.error" class="text-sm text-red-600">{{ store.error }}</p>

          <div class="flex items-center justify-end gap-3">
            <button type="button" @click="close" class="px-3 py-1 rounded border">Cancel</button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
              :disabled="store.loading"
            >
              <span v-if="store.loading">Logging...</span>
              <span v-else>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/store/userStore'

const emit = defineEmits(['close', 'success'])
const email = ref('')
const password = ref('')
const store = useUserStore()


async function onSubmit() {
  try {
    const user = await store.login({ email: email.value.trim(), password: password.value })
    emit('success', user)
    emit('close')
  } catch (err) {
    console.error('onSubmit error:', err)

  }
}

function close() {
  emit('close')
}

function closeOnEsc() {
  close()
}

onMounted(() => {
  // For testing convenience, pre-fill the login form
  email.value = "123@gmail.com"
  password.value = "123123"
  document.addEventListener('keydown', onDocumentKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKey)
})
function onDocumentKey(e) {
  if (e.key === 'Escape') close()
}
</script>
