<!-- ToastComponent.vue -->
<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'error', 'loading'].includes(value),
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed left-1/2 top-1/2 z-9999 transform -translate-x-1/2 -translate-y-1/2">
    <div class="min-w-120px flex items-center rounded-8px bg-black/60 p-16px text-white">
      <!-- 根据类型显示不同图标 -->
      <div
        v-if="type === 'loading'"
        class="mr-10px h-20px w-20px animate-spin border-2 border-white/10 border-l-white rounded-full"
      />
      <div
        v-else-if="type === 'success'"
        class="i-carbon-checkmark-filled mr-10px text-green-400"
      />
      <div
        v-else-if="type === 'error'"
        class="i-carbon-error-filled mr-10px text-red-400"
      />
      <div
        v-else
        class="i-carbon-information-filled mr-10px text-blue-400"
      />

      <div class="text-14px">
        {{ message }}
      </div>
    </div>
  </div>
</template>
