import type { BoxData } from '@/api/types'
import { getBoxDataApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLoginStore } from './loginStore'

export const useBoxStore = defineStore('box', () => {
  const loginStore = useLoginStore()
  const boxDataMap = ref<Record<number, BoxData>>({})

  async function getBoxData(boxId: number) {
    if (boxDataMap.value[boxId]) {
      return boxDataMap.value[boxId]
    }

    const res = await getBoxDataApi({
      boxid: boxId,
      uid: loginStore.userUid,
    })
    boxDataMap.value[boxId] = res
    return res
  }

  return {
    boxDataMap,
    getBoxData,
  }
})
