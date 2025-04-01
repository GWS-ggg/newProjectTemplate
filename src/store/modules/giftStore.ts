import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 定义礼包接口
export interface Gift {
  id: number
  content?: string
  price?: number
}

export const useGiftStore = defineStore('gift', () => {
  // 当前选中的礼包ID
  const currentPackageId = ref<number>(1)

  // 所有礼包数据
  const giftPackages = ref<Gift[]>([
    {
      id: 1,
      content: '1+2礼包',
      price: 100,
    },
    {
      id: 2,
      content: '阶梯礼包',
      price: 200,
    },

  ])

  // 获取当前选中的礼包
  const currentPackage = computed(() => {
    return giftPackages.value.find(pkg => pkg.id === currentPackageId.value) || null
  })

  // 设置当前选中的礼包
  function setCurrentPackage(packageId: number) {
    currentPackageId.value = packageId
  }

  // 初始化礼包数据
  function initGiftPackages(packages: Gift[]) {
    giftPackages.value = packages
  }

  return {
    currentPackageId,
    giftPackages,
    currentPackage,
    setCurrentPackage,
    initGiftPackages,
  }
})
