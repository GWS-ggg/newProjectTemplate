<script setup lang="ts">
import { useImageScale } from '@/hooks'
import { computed } from 'vue'

interface Props {
  /** 图片URL */
  src: string
  /** 图片键名，用于标识不同图片 */
  imageKey?: string
  /** 设计稿基准宽度 */
  baseWidth?: number
  /** 最大宽度限制 */
  maxWidth?: number
  /** 是否显示调试信息 */
  debug?: boolean
  /** 附加样式类 */
  className?: string
  /** alt文本 */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageKey: '',
  baseWidth: 750,
  maxWidth: 750,
  debug: false,
  className: '',
  alt: '',
})

// 如果没有提供imageKey，使用src作为键名
const imgKey = computed(() => props.imageKey || props.src)

// 使用图片缩放hook
const {
  scale,
  onImageLoad,
  getScaledImageStyle,
  getOriginalSize,
} = useImageScale(props.baseWidth, props.maxWidth)

// 合并自定义类名和默认类名
const imageClass = computed(() => {
  return `scaled-image ${props.className}`.trim()
})
</script>

<template>
  <div class="scaled-image-container">
    <img
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="getScaledImageStyle(imgKey)"
      @load="onImageLoad($event, imgKey)"
    >
    <!-- 调试信息 -->
    <div
      v-if="debug && getOriginalSize(imgKey).width > 0"
      class="debug-info"
    >
      <p class="text-xs">
        原始: {{ getOriginalSize(imgKey).width }}x{{ getOriginalSize(imgKey).height }}px<br>
        缩放: {{ scale.toFixed(2) }}x
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scaled-image-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.scaled-image {
  // 可以添加默认样式，如边框等
}

.debug-info {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #666;
  text-align: center;
}
</style>
