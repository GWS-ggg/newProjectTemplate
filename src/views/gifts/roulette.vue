<script setup lang="ts">
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/roulette/${name}`, import.meta.url).href
}
const imgMap = {
  bgImg: getImageUrl('背景.jpg'),
  circleImg: getImageUrl('圆形.png'),
  giftBgImg: getImageUrl('方块底.png'),
  giftBorderImg: getImageUrl('方块底外发光.png'),
  diceImg: getImageUrl('202_2.png'),
  coinImg: getImageUrl('付费转盘猪猪代币.png'),
  boxImg: getImageUrl('混合宝箱2.png'),
}
interface GiftItem {
  img: string
  id: number
  desc?: string
}
const giftList: GiftItem[] = [
  {
    img: imgMap.coinImg,
    id: 1,
    desc: '5',
  },
  {
    img: imgMap.coinImg,
    id: 2,
    desc: '5',
  },
  {
    img: imgMap.coinImg,
    id: 3,
    desc: '10',
  },
  {
    img: imgMap.coinImg,
    id: 4,
    desc: '10',
  },
  {
    img: imgMap.boxImg,
    id: 5,
  },
  {
    img: imgMap.diceImg,
    id: 6,
    desc: '200',
  },
  {
    img: imgMap.coinImg,
    id: 7,
    desc: '1',
  },
  {
    img: imgMap.diceImg,
    id: 8,
    desc: '3000',
  },
]
const angles = [
  90, // 6点钟方向
  45, // 7点钟方向
  0, // 9点钟方向
  315, // 10点钟方向
  270, // 12点钟方向
  225, // 2点钟方向
  180, // 3点钟方向
  135, // 4点钟方向
]
const isSpinning = ref(false)
</script>

<template>
  <div class="relative mb-30 w-750 f-c">
    <img
      src="../../assets/images/gifts/roulette/背景.jpg"
      alt=""
      class="w-750"
    >
    <div class="absolute bottom-150 left-1/2 z-10 h-536 w-536 -translate-x-1/2 -translate-y-1/2">
      <div class="relative w-full">
        <img
          :src="imgMap.circleImg"
          alt=""
          class="absolute left-0 top-0 w-full"
        >
      </div>
      <div
        class="absolute inset-0"
        :class="{
          spinning: isSpinning,
        }"
        @click="isSpinning = true"
      >
        <!-- 按逆时针排列8个奖励 -->
        <div
          v-for="(gift, index) in giftList"
          :key="gift.id"
          class="absolute h-120 w-120 -translate-x-1/2 -translate-y-1/2"
          :style="{
            left: `${268 + 240 * Math.cos(angles[index] * Math.PI / 180)}px`,
            top: `${268 + 240 * Math.sin(angles[index] * Math.PI / 180)}px`,
          }"
        >
          <div class="relative h-full w-full flex items-center justify-center">
            <img
              :src="imgMap.giftBgImg"
              alt=""
              class="absolute inset-0 h-full w-full"
            >
            <img
              :src="imgMap.giftBorderImg"
              alt=""
              class="absolute inset-0 h-full w-full"
            >
            <div class="relative f-c">
              <img
                :src="gift.img"
                alt=""
                class="w-75"
              >
              <div
                v-if="gift.desc"
                class="absolute text-30 text-white text-stroke-2 text-stroke-[#1d2f3e] -bottom-5"
              >
                {{ gift.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-200 left-1/2 z-10 h-96 w-317 -translate-x-1/2 -translate-y-1/2">
      <GreenButton>
        <div class="text-40 text-white text-stroke-2 text-stroke-[#164b2e]">
          Dance $4.99
        </div>
      </GreenButton>
    </div>
    <div class="absolute bottom-90 left-1/2 z-10 h-96 -translate-x-1/2 -translate-y-1/2">
      <div class="text-26 text-[#d9cdb9] text-stroke-1 text-stroke-[#164b2e]">
        End in 20:00:00
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.spinning {
  animation: spin 4s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(calc(360deg * 5 + 45deg * winningIndex));
  }
}
</style>
