import type { LoginInfo } from '@/api/types'
import { loginApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const loginInfo = ref<LoginInfo>({})

  async function getLoginInfo(uid: string) {
    const res = await loginApi({
      uid,
    })
    loginInfo.value = res
  }

  return {
    loginInfo,
    getLoginInfo,
  }
})
