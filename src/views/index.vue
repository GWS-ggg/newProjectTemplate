<script setup lang="ts">
import BackBtn from '@/components/BackBtn.vue'
import Dialog from '@/components/Dialog.vue'
import GiftList from '@/components/GiftList.vue'
import GiftScrollBar from '@/components/GiftScrollBar.vue'
import WelfareHeader from '@/components/WelfareHeader.vue'
import { useGiftStore } from '@/store/modules/giftStore'
import { useLoginStore } from '@/store/modules/loginStore'
import { usePayStore } from '@/store/modules/payStore'
import { MessageBox } from '@/utils/messageBox'
import { initToast, Toast } from '@/utils/toast'
import { onMounted, ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../assets/images/gifts/${name}`, import.meta.url).href
}
const fontFamily = ref('font-en')
const bgImg = ref(getImageUrl('img_背景_下.jpg'))
const { getLoginInfo, setUid } = useLoginStore()
const { getShopListInfo } = useGiftStore()
const { getPayType } = usePayStore()

const isVisibleLogin = ref(false)
const gameLoginRef = ref()
const giftListRef = ref()
isVisibleLogin.value = true
async function handleLogin(uid: string) {
  Toast.loading()
  try {
    setUid(uid)
    const res = await getLoginInfo()
    gameLoginRef.value.saveUIDRecord({
      uid,
      userName: res.username,
    })
    await getShopListInfo(uid)
    await giftListRef.value.handleLoginGetInfo()
    isVisibleLogin.value = false
    Toast.close()
    getPayType()
  }
  catch (error: any) {
    // 登录超时提示
    Toast.close()
    console.log(error.message)
    if (error.message === 'type_1') {
      MessageBox.paymentFailed('获取礼包数据失败', '确认', () => {
        console.log('取消登录')
      })
    }
    else {
      MessageBox.paymentFailed('登录失败', '确认', () => {
        console.log('取消登录')
      })
    }
  }
}

onMounted(() => {
  initToast()

  // 使用端内携带的uid登录
})

// onMounted(() => {
//   // - 测试环境
// //   - 142830
// // - 开发环境
// //   - 102191
//   const uid = '142830'
//   setUid(uid)
//   getLoginInfo()
//   getPayType()
//   getShopListInfo(uid)
// })
</script>

<template>
  <div
    class="mx-auto min-h-screen w-750 flex flex-col overflow-x-hidden bg-[#fff] text-24 line-height-tight"
    :style="{ fontFamily }"
  >
    <!-- 固定区域 -->
    <div class="fixed left-1/2 top-0 z-50 w-750 flex flex-col overflow-x-hidden -translate-x-1/2">
      <div class="welfare-header h-484 w-750 flex flex-col">
        <WelfareHeader />
        <GiftScrollBar />
      </div>
    </div>

    <!-- 占位区域，与固定区域高度相同 -->
    <div class="h-415 w-full">
      <!-- WelfareHeader(240px) + GiftScrollBar(180px) = 420px -->
    </div>

    <!-- 可滚动内容区域 -->
    <div
      class="relative min-h-[calc(100vh-420px)]"
      :style="{ backgroundImage: `url(${bgImg})` }"
    >
      <GiftList ref="giftListRef" />
    </div>

    <BackBtn />

    <Dialog
      v-model="isVisibleLogin"
      :z-index="1800"
      :close-button-show="false"
    >
      <GameLogin
        ref="gameLoginRef"
        @on-click-login="handleLogin"
      />
    </Dialog>
  </div>
</template>

<style scoped>
.test {
  font-family: 'font-en', sans-serif;
  font-size: 24px;
  color: #fff;
}
.welfare-header {
  background-image: url('@/assets/images/WelfareHeader/img_背景_上.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
