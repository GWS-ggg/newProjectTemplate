import type { LoginInfo } from '@/api/types'
import { loginApi } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const loginInfo = ref<LoginInfo>({
    username: '',
    viplevel: 0,
    vipscore: 0,
    viptargetscore: 0,
  })

  async function getLoginInfo(uid: string) {
    const res = await loginApi({
      uid,
    })
    loginInfo.value = res
  }
  function setLoginInfo(info: LoginInfo) {
    loginInfo.value = info
  }

  return {
    loginInfo,
    getLoginInfo,
    setLoginInfo,
  }
})
