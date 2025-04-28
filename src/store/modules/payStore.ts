import type { PayType } from '@/types'
import { getPayTypeApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLoginStore } from './loginStore'

export const usePayStore = defineStore('pay', () => {
  const payTypeList = ref<PayType[]>([])

  async function getPayType() {
    const loginStore = useLoginStore()
    const res = await getPayTypeApi({
      path: 'pg',
      fnUid: loginStore.userUid,
    })
    payTypeList.value = res.payChannels
  }

  return {
    payTypeList,
    getPayType,
  }
})
