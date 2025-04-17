import { useGiftStore } from '@/store/modules/giftStore'
import { getPGImg } from '@/utils'
import { onMounted, ref } from 'vue'

/**
 * 图片预加载钩子
 * 用于预加载图片，提高用户体验
 */
export function useImagePreload() {
  const isLoading = ref(false)
  const loadedImages = ref<Record<string, boolean>>({})
  const giftStore = useGiftStore()

  /**
   * 预加载单张图片
   * @param src 图片地址
   * @returns Promise
   */
  function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 如果图片地址为空或已加载，直接返回
      if (!src || loadedImages.value[src]) {
        resolve()
        return
      }

      // 处理 PG 图片链接
      const realSrc = src.startsWith('http') ? src : getPGImg(src)

      // 如果已加载过此图片，直接返回
      if (loadedImages.value[realSrc]) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        loadedImages.value[realSrc] = true
        console.log(`预加载图片成功: ${realSrc}`)
        resolve()
      }
      img.onerror = () => {
        console.warn(`图片加载失败: ${realSrc}`)
        reject(new Error(`加载图片失败: ${realSrc}`))
      }
      img.src = realSrc
    })
  }

  /**
   * 预加载多张图片
   * @param srcs 图片地址数组
   * @returns Promise
   */
  async function preloadImages(srcs: string[]) {
    if (!srcs || srcs.length === 0) {
      return
    }

    // 过滤掉空地址
    const validSrcs = srcs.filter(src => !!src)

    if (validSrcs.length === 0) {
      return
    }

    isLoading.value = true

    try {
      await Promise.all(validSrcs.map(src => preloadImage(src)))
      console.log(`批量预加载完成，共 ${validSrcs.length} 张图片`)
    }
    catch (error) {
      console.error('图片预加载失败:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * 预加载下一个组件的图片
   * @param nextId 下一个组件的ID
   * @param imageUrls 手动提供的图片URL数组
   */
  function preloadNextComponentImages(nextId: number, imageUrls?: string[]) {
    // 如果提供了图片URL数组，直接预加载这些图片
    if (imageUrls && imageUrls.length > 0) {
      preloadImages(imageUrls)
      return
    }

    // 否则，尝试从store获取数据并预加载
    const nextGiftInfo = giftStore.shopListInfo.find(info => info.id === nextId)
    if (nextGiftInfo && nextGiftInfo.BannerPic) {
      preloadImages([nextGiftInfo.BannerPic])
    }
  }

  /**
   * 预加载相邻组件的图片
   */
  function preloadAdjacentComponentImages() {
    const currentId = giftStore.currentGiftId
    const allIds = giftStore.shopListInfo.map(item => item.id)

    if (allIds.length <= 1) {
      return
    }

    const currentIndex = allIds.indexOf(currentId)
    if (currentIndex === -1) {
      return
    }

    // 计算前后相邻组件的ID
    const prevIndex = (currentIndex - 1 + allIds.length) % allIds.length
    const nextIndex = (currentIndex + 1) % allIds.length

    // 获取相邻组件的信息
    const prevGiftInfo = giftStore.shopListInfo[prevIndex]
    const nextGiftInfo = giftStore.shopListInfo[nextIndex]

    // 预加载图片
    if (prevGiftInfo && prevGiftInfo.BannerPic) {
      preloadImages([prevGiftInfo.BannerPic])
    }

    if (nextGiftInfo && nextGiftInfo.BannerPic) {
      preloadImages([nextGiftInfo.BannerPic])
    }
  }

  // 组件挂载时自动预加载相邻组件的图片
  onMounted(() => {
    preloadAdjacentComponentImages()
  })

  return {
    isLoading,
    loadedImages,
    preloadImage,
    preloadImages,
    preloadNextComponentImages,
    preloadAdjacentComponentImages,
  }
}
