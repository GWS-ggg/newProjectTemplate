<script setup lang="ts">
import { ref } from 'vue'

function testFunction() {
  console.log('test')
}
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
    <WelfareHeader />
    <GiftScrollBar />
    <GiftList />
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
