<script setup lang="ts">
import BackBtn from '@/components/BackBtn.vue'
import GiftList from '@/components/GiftList.vue'
import GiftScrollBar from '@/components/GiftScrollBar.vue'
import WelfareHeader from '@/components/WelfareHeader.vue'
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../assets/images/gifts/${name}`, import.meta.url).href
}
const fontFamily = ref('font-en')
const bgImg = ref(getImageUrl('img_bgg.png'))
</script>

<template>
  <div
    class="mx-auto min-h-screen w-750 flex flex-col overflow-x-hidden bg-[#fff] text-24"
    :style="{ fontFamily, backgroundImage: `url(${bgImg})` }"
  >
    <!-- 固定区域 -->
    <div class="fixed left-1/2 top-0 z-50 w-750 flex flex-col overflow-x-hidden -translate-x-1/2">
      <WelfareHeader />
      <GiftScrollBar />
    </div>

    <!-- 占位区域，与固定区域高度相同 -->
    <div class="h-420 w-full">
      <!-- WelfareHeader(240px) + GiftScrollBar(180px) = 420px -->
    </div>

    <!-- 可滚动内容区域 -->
    <div class="relative">
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
</style>
