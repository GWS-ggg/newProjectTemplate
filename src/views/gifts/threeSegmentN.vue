<script setup lang="ts">
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/threeSegmentN/${name}`, import.meta.url).href
}
const imgMap = {
  bg1Img: getImageUrl('bg1.png'),
  bg2Img: getImageUrl('bg2.png'),
  bg3Img: getImageUrl('bg3.png'),
  diceImg: getImageUrl('体力3.png'),
  goldImg: getImageUrl('金币2.png'),
  diamondImg: getImageUrl('钻石2.png'),
  box1Img: getImageUrl('卡牌宝箱1.png'),
  box2Img: getImageUrl('卡牌宝箱2.png'),
  lockImg: getImageUrl('锁.png'),
  bg1OkImg: getImageUrl('11.png'),
  bg2OkImg: getImageUrl('22.png'),
  bg3OkImg: getImageUrl('33.png'),
}

interface GiftIcon {
  id: number
  iconImg: string
  desc?: string
}

interface Gift {
  id: number
  btnDesc: string
  available: boolean
  bgImg: string
  bgOkImg: string
  isFree: boolean
  iconList: GiftIcon[]
  score: number
  isPurchased: boolean
}
const giftList = ref<Gift[]>([
  {
    id: 1,
    btnDesc: 'FREE',
    available: true,
    isFree: true,
    isPurchased: false,
    bgImg: imgMap.bg1Img,
    bgOkImg: imgMap.bg1OkImg,
    iconList: [
      { id: 1, iconImg: imgMap.diceImg, desc: '200' },
      { id: 2, iconImg: imgMap.goldImg, desc: '30K' },
      { id: 3, iconImg: imgMap.diamondImg, desc: '200' },
    ],
    score: 40,
  },
  {
    id: 2,
    btnDesc: '20.00',
    available: true,
    isFree: false,
    isPurchased: false,
    bgImg: imgMap.bg2Img,
    bgOkImg: imgMap.bg2OkImg,
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '100' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '200' },
      { id: 3, iconImg: imgMap.box2Img, desc: '100' },
    ],
    score: 20,
  },
  {
    id: 3,
    btnDesc: '60.00',
    available: true,
    isFree: false,
    isPurchased: false,
    bgImg: imgMap.bg3Img,
    bgOkImg: imgMap.bg3OkImg,
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '200' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '300' },
      { id: 3, iconImg: imgMap.box2Img, desc: '200' },
    ],
    score: 60,
  },
])

function handlePurchaseButton(item: Gift) {
  if (item.isPurchased) {
    return
  }
  item.isPurchased = true
}
</script>

<template>
  <div class="mb-30 flex flex-col items-center justify-center text-29">
    <div class="mt-10 text-[#fff] text-stroke-1 text-stroke-[#19093e]">
      END IN: 60:00:00
    </div>
    <div class="mt-24 text-24 text-[#fef29f] text-stroke-1 text-stroke-[#682c2e]">
      Take each deal take each deal !"
    </div>
    <div
      v-for="item in giftList"
      :key="item.id"
      class="relative mt-20 w-710 flex items-center justify-center"
    >
      <div class="w-710">
        <img
          :src="item.isPurchased ? item.bgOkImg : item.bgImg"
          alt=""
          class="w-full"
          :class="{ 'flip-active': item.isPurchased }"
        >
      </div>

      <div v-if="!item.isPurchased">
        <div class="absolute left-0 top-30 h-120 w-full">
          <div class="h-full flex items-center justify-center gap-30">
            <div
              v-for="icon in item.iconList"
              :key="icon.id"
              class="h-full flex flex-col items-center justify-center"
            >
              <img
                :src="icon.iconImg"
                alt=""
                class="h-full"
              >
              <div class="text-42 text-[#fff] text-stroke-1 text-stroke-[#464646] -mt-32">
                {{ icon.desc }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute bottom-38 left-1/2 z-30 h-100 w-300 -translate-x-1/2"
          @click="handlePurchaseButton(item)"
        >
          <GreenButton
            radius="20px"
            border-width="2px"
            :score="item.score"
            score-show
          >
            <div class="relative text-40 text-[#fff] text-stroke-2 text-stroke-[#164b2e]">
              {{ item.btnDesc }}
              <img
                v-if="!item.isFree"
                :src="imgMap.lockImg"
                alt=""
                class="absolute top-0 h-42 -right-40"
              >
            </div>
          </GreenButton>
        </div>
        <div class="absolute bottom-35 left-50 f-c flex-col">
          <div class="text-20 text-[#fff] text-stroke-1 text-stroke-[#5d2f0a]">
            1/1
          </div>
          <div class="text-18 text-[#fddfb0] text-stroke-1 text-stroke-[#5d2f0a]">
            Available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-transition {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
  transform-origin: center center;
}

.flip-active {
  animation: flip-card 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes flip-card {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(180deg) scaleX(-1);
  }
}

/* 添加阴影效果增强立体感 */
.flip-transition {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.flip-active {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>
