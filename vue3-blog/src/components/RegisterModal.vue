<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <div
        class="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Create Account</h3>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input
              v-model="username"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="text"
              autocomplete="username"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="email"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="password"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="password"
              autocomplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              v-model="confirmPassword"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat password"
            />
          </div>

          <p v-if="store.error" class="text-sm text-red-600">{{ store.error }}</p>
          <p v-if="localError" class="text-sm text-red-600">{{ localError }}</p>

          <div class="flex items-center justify-end gap-3">
            <button type="button" @click="close" class="px-3 py-1 rounded border">Cancel</button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
              :disabled="store.loading"
            >
              <span v-if="store.loading">Creating...</span>
              <span v-else>Create account</span>
            </button>
          </div>

          <div class="text-sm text-center pt-2">
            <span>Already have an account?</span>
            <button type="button" @click="switchToLogin" class="text-blue-600 underline ml-1">Login</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/userStore'

const emit = defineEmits(['close', 'success', 'switchToLogin'])
const store = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref('')

function close() {
  emit('close')
}

function switchToLogin() {
  emit('switchToLogin')
  emit('close')
}

async function onSubmit() {
  localError.value = ''
  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match'
    return
  }
  try {
    
    const user = await store.register({
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value
    })
    console.log("22222222");
    emit('success', user)
    emit('close')
  } catch (err) {
    console.error('onSubmit error:', err)
    // 同时在页面显示（可选）
    localError.value = err?.message || String(err)
  }
}
</script>
