<script lang="ts" setup>
import { getPGImg } from '@/utils'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  closeable?: boolean
  status?: 'success' | 'fail' | 'loading' | 'orderFail'
  title?: string
  content?: string
  primaryButtonText?: string
  showButtons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closeable: true,
  status: 'success',
  title: '',
  content: '',
  primaryButtonText: '确定',
  showButtons: true,
})

const emit = defineEmits(['update:modelValue', 'primaryAction'])

// 动画状态
const isShown = ref(false)

// 监视modelValue变化，控制动画
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      isShown.value = true
    }, 50)
  }
  else {
    isShown.value = false
  }
})

function handleClose() {
  emit('update:modelValue', false)
}

function handlePrimaryAction() {
  emit('primaryAction')
  if (props.closeable) {
    handleClose()
  }
}

// 根据状态确定显示的图标和颜色
const statusConfig = computed(() => {
  switch (props.status) {
    case 'success':
      return {
        useImage: true,
        icon: 'common/icon_ok.png',
        color: 'text-[#22c55e]',
        title: props.title || '支付成功',
        bgColor: 'bg-[#f0fff4]',
        borderColor: 'border-[#22c55e]',
      }
    case 'fail':
      return {
        useImage: false,
        svgIcon: 'error',
        color: 'text-[#ef4444]',
        iconColor: '#ef4444',
        title: props.title || '支付失败',
        bgColor: 'bg-[#fff5f5]',
        borderColor: 'border-[#ef4444]',
      }
    case 'loading':
      return {
        useImage: false,
        svgIcon: 'loading',
        color: 'text-[#3b82f6]',
        iconColor: '#3b82f6',
        title: props.title || '正在支付',
        bgColor: 'bg-[#f0f9ff]',
        borderColor: 'border-[#3b82f6]',
      }
    case 'orderFail':
      return {
        useImage: false,
        svgIcon: 'warning',
        color: 'text-[#f59e0b]',
        iconColor: '#f59e0b',
        title: props.title || '下单失败',
        bgColor: 'bg-[#fffbeb]',
        borderColor: 'border-[#f59e0b]',
      }
    default:
      return {
        useImage: true,
        icon: 'common/icon_ok.png',
        color: 'text-[#22c55e]',
        title: props.title || '支付成功',
        bgColor: 'bg-[#f0fff4]',
        borderColor: 'border-[#22c55e]',
      }
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed left-0 top-0 z-9999 h-[100vh] w-[100vw] flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
    >
      <div
        class="dialog-container relative z-10000 max-h-[90vh] w-[626px] overflow-hidden rounded-[24px] border-solid bg-white p-0"
        :class="[
          isShown ? 'dialog-animation' : '',
          statusConfig.bgColor,
          `border-[3px] ${statusConfig.borderColor}`,
        ]"
      >
        <!-- 关闭按钮 -->
        <div
          v-if="closeable"
          class="absolute right-[20px] top-[20px] h-[30px] w-[30px] cursor-pointer text-[28px] text-gray-500"
          @click="handleClose"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </div>

        <!-- 状态图标 -->
        <div class="mt-[60px] w-full flex justify-center">
          <div class="h-[120px] w-[120px]">
            <template v-if="statusConfig.useImage">
              <img
                :src="getPGImg(statusConfig.icon)"
                alt=""
                class="h-full w-full"
              >
            </template>
            <template v-else>
              <!-- 失败图标 -->
              <svg
                v-if="statusConfig.svgIcon === 'error'"
                viewBox="0 0 24 24"
                class="h-full w-full"
                :fill="statusConfig.iconColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>

              <!-- 加载图标 -->
              <svg
                v-if="statusConfig.svgIcon === 'loading'"
                viewBox="0 0 24 24"
                class="h-full w-full animate-spin"
                :fill="statusConfig.iconColor"
              >
                <path d="M12 4V2C6.48 2 2 6.48 2 12H4C4 7.58 7.58 4 12 4Z" />
                <path
                  opacity="0.3"
                  d="M12 4V2C17.52 2 22 6.48 22 12H20C20 7.58 16.42 4 12 4Z"
                />
                <path
                  opacity="0.5"
                  d="M12 20V22C17.52 22 22 17.52 22 12H20C20 16.42 16.42 20 12 20Z"
                />
                <path
                  opacity="0.8"
                  d="M12 20V22C6.48 22 2 17.52 2 12H4C4 16.42 7.58 20 12 20Z"
                />
              </svg>

              <!-- 警告图标 -->
              <svg
                v-if="statusConfig.svgIcon === 'warning'"
                viewBox="0 0 24 24"
                class="h-full w-full"
                :fill="statusConfig.iconColor"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </template>
          </div>
        </div>

        <!-- 标题和内容 -->
        <div class="mt-[30px] px-[40px] text-center">
          <h2
            class="text-[32px] font-bold"
            :class="statusConfig.color"
          >
            {{ statusConfig.title }}
          </h2>
          <div
            v-if="content"
            class="mt-[20px] text-[24px] text-gray-600"
          >
            {{ content }}
          </div>
          <!-- 默认插槽 -->
          <slot />
        </div>

        <!-- 按钮区域 -->
        <div
          v-if="showButtons"
          class="mt-[50px] flex justify-center gap-[20px] px-[40px] pb-[40px]"
        >
          <button
            class="h-[80px] max-w-[400px] w-full rounded-[40px] px-[30px] text-[28px] text-white"
            :class="[props.status === 'fail' || props.status === 'orderFail' ? 'bg-[#f59e0b]' : 'bg-[#3b82f6]']"
            @click="handlePrimaryAction"
          >
            {{ primaryButtonText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.dialog-container {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialog-animation {
  opacity: 1;
  transform: scale(1);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1.5s linear infinite;
}
</style>
