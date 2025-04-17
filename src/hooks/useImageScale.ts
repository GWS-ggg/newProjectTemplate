import { computed, onMounted, reactive, ref, watch } from 'vue'

/**
 * 图片缩放钩子
 * 用于处理图片按照设计稿比例缩放
 * @param baseWidth 设计稿基准宽度
 * @param maxWidth 最大宽度限制
 * @returns 图片缩放相关方法和计算属性
 */
export function useImageScale(baseWidth = 750, maxWidth = 750) {
  // 存储图片原始尺寸
  const imageSizes = reactive<Record<string, { width: number, height: number }>>({})

  // 窗口宽度
  const windowWidth = ref(Math.min(window.innerWidth, maxWidth))

  // 响应式更新窗口宽度
  onMounted(() => {
    window.addEventListener('resize', () => {
      windowWidth.value = Math.min(window.innerWidth, maxWidth)
    })
  })

  // 计算当前缩放比例
  const scale = computed(() => {
    return windowWidth.value / baseWidth
  })

  // 获取根字体大小
  function getRootFontSize(): number {
    return Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  }

  // px 转换为 rem
  function pxToRem(px: number): string {
    return `${px / getRootFontSize()}rem`
  }

  // 图片加载完成后的处理函数
  function onImageLoad(event: Event, imgKey: string): void {
    const imgElement = event.target as HTMLImageElement
    // 获取并存储图片原始尺寸
    imageSizes[imgKey] = {
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight,
    }
  }

  // 获取图片原始尺寸
  function getOriginalSize(imgKey: string) {
    return imageSizes[imgKey] || { width: 0, height: 0 }
  }

  // 计算图片缩放后的样式
  function getScaledImageStyle(imgKey: string): any {
    if (!imageSizes[imgKey]) {
      return {}
    }

    const originalWidth = imageSizes[imgKey].width
    const originalHeight = imageSizes[imgKey].height

    // 使用计算出的缩放比例
    const scaledWidth = originalWidth * scale.value
    const scaledHeight = originalHeight * scale.value

    // 转换为rem单位
    return {
      width: pxToRem(scaledWidth),
      height: pxToRem(scaledHeight),
    }
  }

  // 更新计数器，用于强制更新图片尺寸
  const updateCounter = ref(0)

  // 当缩放比例变化时，更新计数器
  watch(scale, () => {
    updateCounter.value++
  })

  return {
    imageSizes,
    windowWidth,
    scale,
    updateCounter,
    getRootFontSize,
    pxToRem,
    onImageLoad,
    getOriginalSize,
    getScaledImageStyle,
  }
}
