import type { ShopListItem } from '@/api/types'
import { getShopListInfoApi } from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useGiftStore = defineStore('gift', () => {
  // 当前选中的礼包ID
  const currentGiftId = ref<number>(1)
  const shopListInfo = ref<ShopListItem[]>([])

  // 提供一个计算属性来访问 shopListInfo
  const currentShopListInfo = computed(() => {
    return shopListInfo.value
  })

  // 获取当前选中的礼包
  const currentGiftInfo = computed(() => {
    return shopListInfo.value.find(pkg => pkg.id === currentGiftId.value) || null
  })

  async function getShopListInfo(uid: string) {
    const res = await getShopListInfoApi({
      uid,
    })
    // 创建一个新数组，确保响应式触发
    const newTabInfo = [...res.TabInfo]
    let idNum = 0
    newTabInfo.forEach((item) => {
      item.id = idNum++
    })
    // 一次性替换整个数组，而不是修改现有数组
    shopListInfo.value = newTabInfo
    console.log(shopListInfo.value, 'shopListInfo after update')
  }
  // 设置当前选中的礼包
  function setCurrentGiftId(giftId: number) {
    currentGiftId.value = giftId
  }

  return {
    currentGiftId,
    shopListInfo,
    currentShopListInfo,
    currentGiftInfo,
    getShopListInfo,
    setCurrentGiftId,
  }
})
