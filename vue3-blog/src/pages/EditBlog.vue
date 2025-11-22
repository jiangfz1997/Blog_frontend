<template>
  <DefaultLayout>
    <template #main>
      <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h1 class="text-2xl font-semibold mb-6">
          {{ isEditing ? 'Edit Blog' : 'Write a New Blog' }}
        </h1>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Title</label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter your blog title"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-100 focus:border-blue-400 outline-none"
          />
        </div>

        <!-- <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Tags (comma separated)</label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="e.g. vue, frontend, javascript"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-100 focus:border-blue-400 outline-none"
          />
        </div> -->
        <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Tags</label>

          <!-- Tags 显示区 -->
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in tags"
              :key="index"
              class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1"
            >
              {{ tag }}
              <button
                @click="removeTag(index)"
                class="text-blue-500 hover:text-blue-700"
              >
                x
              </button>
            </span>
          </div>

          <!-- 限制提示 -->
          <p v-if="errorMessage" class="text-red-500 text-sm mb-1">
            {{ errorMessage }}
          </p>

          <!-- 输入框 -->
          <input
            v-model="tagInput"
            @keyup.enter="addTag"
            type="text"
            placeholder="Press Enter to add tag"
            class="w-full border rounded-md p-2 outline-none
              border-gray-300 focus:border-blue-400 focus:ring-blue-100
              transition-all"
            :class="{
              'border-red-500 focus:border-red-500': errorMessage
            }"
          />
        </div>


        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Content (Markdown)</label>
            <textarea
              v-model="content"
              rows="15"
              placeholder="Write your markdown content here..."
              class="w-full border border-gray-300 rounded-md p-2 font-mono focus:ring focus:ring-blue-100 focus:border-blue-400 outline-none resize-y"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Preview</label>
            <div
              class="prose max-w-none border border-gray-200 rounded-md p-4 bg-gray-50 overflow-auto"
              v-html="renderedMarkdown"
            ></div>
          </div>
        </div>

        <div class="flex justify-end mt-6 gap-3">
          <button
            @click="saveDraft"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Save Draft
          </button>
          <button
            @click="publish"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            {{ isEditing ? 'Update' : 'Publish' }}
          </button>
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/services/api.js'
import { updateBlog, publishBlog } from '../api/blog'

const route = useRoute()
const router = useRouter()

const isEditing = ref(!!route.params.id)

const title = ref('')
const content = ref('')
const tags = ref([]);
const tagInput = ref("");
const renderedMarkdown = computed(() => marked.parse(content.value))
const errorMessage = ref("");

onMounted(() => {
  if (isEditing.value) {
    const id = route.params.id
    console.log(`📝 Editing blog #${id}`)
    title.value = 'Understanding Vue Lifecycle'
    content.value = '## Lifecycle Hooks\n\nVue has several lifecycle hooks you can use...'
    tagsInput.value = 'vue, frontend'
  }
})

const MAX_TAGS = 6;
const MAX_TAG_LENGTH = 30;

const addTag = () => {
  const value = tagInput.value.trim();

  if (!value) {
    errorMessage.value = "";
    return;
  }

  if (value.length > MAX_TAG_LENGTH) {
    errorMessage.value = `Each tag must be ≤ ${MAX_TAG_LENGTH} characters`;
    return;
  }

  if (tags.value.length >= MAX_TAGS) {
    errorMessage.value = `Maximum ${MAX_TAGS} tags allowed`;
    return;
  }

  if (tags.value.includes(value)) {
    errorMessage.value = "Duplicate tag";
    return;
  }

  tags.value.push(value);
  tagInput.value = "";
  errorMessage.value = "";
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
  errorMessage.value = ""; // 删除时清理错误
};
function saveDraft() {
  localStorage.setItem(
    'blog-draft',
    JSON.stringify({
      title: title.value,
      content: content.value,
      tags: tagsInput.value,
    })
  )
  alert('Draft saved locally!')
}

const publish = async () => {
  const blogData = {
    title: title.value,
    content: content.value,
    tags: tags.value,
  }
  
  if (isEditing.value) {
    console.log('Updating blog:', blogData)
    const res = await updateBlog(blogData.id, blogData)
    if (!res) {
      alert('Failed to publish blog')
      return
    }
    var id = res.id
    // alert('Blog published (mock)')
    router.push(`/blog/${id}`)
  } else {
    console.log('Created new blog:', blogData)
    const res = await publishBlog(blogData)
    if (!res) {
      alert('Failed to publish blog')
      return
    }
    var id = res.id
    // alert('Blog published (mock)')
    router.push(`/blog/${id}`)
  }
  
}
</script>
