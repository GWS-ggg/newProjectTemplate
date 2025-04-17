<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/testImage/${name}`, import.meta.url).href
}
const imgList = ref([
  getImageUrl('1.png'),
  getImageUrl('2.png'),
  getImageUrl('3.png'),
  getImageUrl('4.png'),
  getImageUrl('5.png'),
  getImageUrl('6.png'),
  getImageUrl('7.png'),
  getImageUrl('8.png'),
  getImageUrl('9.png'),
  getImageUrl('10.png'),
])

// 存储图片原始尺寸
const imageSizes = reactive<Record<string, { width: number, height: number }>>({})

function pxToRem(px: number): string {
  return `${px / getRootFontSize()}rem`
}

function getRootFontSize(): number {
  return Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
}
console.log(getRootFontSize())

console.log(imgList)
// 根据设计图基准宽度计算缩放比例
const baseWidth = 750 // 设计图基准宽度
const windowWidth = ref(window.innerWidth)
// 响应式更新窗口宽度
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 750) {
      windowWidth.value = 750
    }
    else {
      windowWidth.value = window.innerWidth
    }
  })
})

// 计算当前缩放比例
const scale = computed(() => {
  return windowWidth.value / baseWidth
})

// 图片加载完成后的处理函数
function onImageLoad(event: Event, img: string): void {
  const imgElement = event.target as HTMLImageElement
  // 获取并存储图片原始尺寸
  imageSizes[img] = {
    width: imgElement.naturalWidth,
    height: imgElement.naturalHeight,
  }
  console.log(`图片 ${img} 加载完成，原始尺寸: ${imageSizes[img].width}x${imageSizes[img].height}`)
}

// 计算图片缩放后的样式
function getScaledImageStyle(img: string): any {
  if (!imageSizes[img]) {
    return {}
  }

  const originalWidth = imageSizes[img].width
  const originalHeight = imageSizes[img].height

  // 使用计算出的缩放比例
  const scaledWidth = originalWidth * scale.value
  const scaledHeight = originalHeight * scale.value

  // 转换为rem单位
  return {
    width: pxToRem(scaledWidth),
    height: pxToRem(scaledHeight),
  }
}

// 强制触发图片尺寸更新的计数器
const updateCounter = ref(0)

// 当窗口大小变化时，强制更新图片尺寸
watch(scale, () => {
  updateCounter.value++
})
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-4xl">
      图片按比例缩放演示
    </h2>

    <div class="mb-8 flex items-end justify-start gap-4 overflow-x-auto">
      <template
        v-for="img in imgList"
        :key="img"
      >
        <div class="flex flex-col items-center">
          <!-- 图片加载后获取尺寸，并应用计算出的缩放样式 -->
          <img
            :src="img"
            alt=""
            :style="getScaledImageStyle(img)"
            class="border border-gray-300"
            @load="onImageLoad($event, img)"
          >
        </div>
      </template>
    </div>

    <div class="mb-8 flex items-end justify-start gap-4 overflow-x-auto">
      <template
        v-for="img in imgList"
        :key="img"
      >
        <!-- 图片加载后获取尺寸，并应用计算出的缩放样式 -->
        <img
          :src="img"
          alt=""
          class="w-200"
        >
      </template>
    </div>

    <div class="mb-8 flex items-end justify-start gap-4 overflow-x-auto">
      <template
        v-for="img in imgList"
        :key="img"
      >
        <!-- 图片加载后获取尺寸，并应用计算出的缩放样式 -->
        <img
          :src="img"
          alt=""
          class="h-700"
        >
      </template>
    </div>

    <!-- 手动缩放控制 -->
    <div class="mb-8">
      <h3 class="mb-2 text-2xl">
        缩放控制
      </h3>
      <div class="flex items-center gap-4">
        <span>当前缩放比例: {{ scale.toFixed(2) }}</span>
        <span>窗口宽度: {{ windowWidth }}px</span>
        <span>设计稿宽度: {{ baseWidth }}px</span>
        <span>根字体大小: {{ getRootFontSize() }}px</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 添加任何需要的样式 */
</style>
