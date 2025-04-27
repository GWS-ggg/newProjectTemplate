import type { LoginInfo } from '@/api/types'
import { loginApi } from '@/api'
import { isPaintOrderSupported } from '@/utils/cssSupport'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const loginInfo = ref<LoginInfo>({
    username: '',
    viplevel: 0,
    vipscore: 0,
    viptargetscore: 0,
  })
  const userUid = ref<string>('')

  const noSupportsPaintOrder = ref(isPaintOrderSupported())

  function setUid(uid: string) {
    userUid.value = uid
  }
  async function getLoginInfo() {
    console.log('getLoginInfo', userUid.value, typeof userUid.value)
    const res = await loginApi({
      uid: userUid.value,
    })
    loginInfo.value = res
  }
  function setLoginInfo(info: LoginInfo) {
    loginInfo.value = info
  }

  return {

    userUid,
    loginInfo,
    getLoginInfo,
    setLoginInfo,
    setUid,
    noSupportsPaintOrder,
  }
})
