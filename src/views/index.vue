<script setup lang="ts">
import BackBtn from '@/components/BackBtn.vue'
import GiftList from '@/components/GiftList.vue'
import GiftScrollBar from '@/components/GiftScrollBar.vue'
import WelfareHeader from '@/components/WelfareHeader.vue'
import { useGiftStore } from '@/store/modules/giftStore'
import { useLoginStore } from '@/store/modules/loginStore'
import { onMounted, ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../assets/images/gifts/${name}`, import.meta.url).href
}
const fontFamily = ref('font-en')
const bgImg = ref(getImageUrl('img_背景_下.png'))

const { getLoginInfo, setUid } = useLoginStore()
const { getShopListInfo } = useGiftStore()

// - 测试环境
//   - 142830
// - 开发环境
//   - 102191
onMounted(() => {
  const uid = '142830'
  setUid(uid)
  getLoginInfo()
  getShopListInfo(uid)
})
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
      <GiftList />
    </div>

    <BackBtn />
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
