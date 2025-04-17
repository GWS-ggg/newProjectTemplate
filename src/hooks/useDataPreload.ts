import type { GiftResponseData } from '@/types'
import { getProductListApi } from '@/api'
import { useGiftStore } from '@/store/modules/giftStore'
import { reactive, ref } from 'vue'

/**
 * 数据预加载钩子
 * 用于预先加载下一个组件的数据，提高用户体验
 */
export function useDataPreload() {
  const isLoading = ref(false)
  const giftStore = useGiftStore()

  // 缓存已加载的数据
  const cachedData = reactive<Record<number, GiftResponseData>>({})

  /**
   * 获取ProductType对应的组件类型
   * @param id 组件ID
   * @returns ProductType
   */
  function getProductTypeById(id: number): number {
    const giftInfo = giftStore.shopListInfo.find(info => info.id === id)
    return giftInfo?.ProductType || 1
  }

  /**
   * 预加载指定ProductType的数据
   * @param productType 产品类型
   */
  async function preloadDataByProductType(productType: number): Promise<GiftResponseData | null> {
    if (cachedData[productType]) {
      console.log(`使用缓存数据 productType: ${productType}`)
      return cachedData[productType]
    }

    isLoading.value = true

    try {
      console.log(`开始预加载数据 productType: ${productType}`)
      const res = await getProductListApi({
        appid: '616876868660610',
        uid: '102191',
        producttype: productType,
      })

      // 缓存数据
      cachedData[productType] = res
      console.log(`成功预加载数据 productType: ${productType}`, res)

      return res
    }
    catch (error) {
      console.error(`预加载数据失败 productType: ${productType}`, error)
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * 预加载下一个组件的数据
   */
  async function preloadNextComponentData(): Promise<void> {
    const currentId = giftStore.currentGiftId
    const allIds = giftStore.shopListInfo.map(item => item.id)

    if (allIds.length <= 1) {
      return
    }

    const currentIndex = allIds.indexOf(currentId)
    if (currentIndex === -1) {
      return
    }

    // 计算下一个组件的ID
    const nextIndex = (currentIndex + 1) % allIds.length
    const nextId = allIds[nextIndex]

    // 获取下一个组件的ProductType
    const nextProductType = getProductTypeById(nextId)

    // 预加载数据
    await preloadDataByProductType(nextProductType)
  }

  /**
   * 预加载相邻组件的数据
   */
  async function preloadAdjacentComponentsData(): Promise<void> {
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

    const prevId = allIds[prevIndex]
    const nextId = allIds[nextIndex]

    // 获取相邻组件的ProductType
    const prevProductType = getProductTypeById(prevId)
    const nextProductType = getProductTypeById(nextId)

    // 先预加载下一个组件的数据，再预加载前一个组件的数据
    await preloadDataByProductType(nextProductType)
    await preloadDataByProductType(prevProductType)
  }

  /**
   * 获取缓存的数据
   * @param productType 产品类型
   */
  function getCachedData(productType: number): GiftResponseData | null {
    return cachedData[productType] || null
  }

  /**
   * 模拟点击并预加载下一个组件
   */
  async function simulateClickNext(): Promise<void> {
    console.log('模拟点击下一个组件，开始预加载数据...')
    await preloadNextComponentData()
  }

  return {
    isLoading,
    cachedData,
    preloadDataByProductType,
    preloadNextComponentData,
    preloadAdjacentComponentsData,
    getCachedData,
    simulateClickNext,
  }
}
