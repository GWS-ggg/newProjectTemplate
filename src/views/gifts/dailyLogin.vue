<script setup lang="ts">
import GreenButton from '@/components/GreenButton.vue'
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/dailyLogin/${name}`, import.meta.url).href
}

const imgMap = {
  bgImg: getImageUrl('底板.png'),
  goldImg: getImageUrl('金币3.png'),
  boxImg: getImageUrl('卡牌宝箱3.png'),
  diamondImg: getImageUrl('钻石2.png'),
  diceImg: getImageUrl('202_2.png'),
  textImg: getImageUrl('头部文字_英语.png'),
  discountImg: getImageUrl('img_礼包标签.png'),
}

interface Gift {
  id: number
  img: string
  price?: string
}

const giftList = ref<Gift[]>([
  {
    id: 1,
    img: imgMap.goldImg,
    price: '1M',
  },
  {
    id: 2,
    img: imgMap.diceImg,
    price: '15',
  },
  {
    id: 3,
    img: imgMap.diamondImg,
    price: '10',
  },
  {
    id: 4,
    img: imgMap.boxImg,

  },
])
const greenButtonRef = ref<InstanceType<typeof GreenButton> | null>(null)
function handleBtnClick() {
  greenButtonRef.value?.triggerAnimation()
  console.log(greenButtonRef.value, 'greenButtonRef')
}
const bubblePosition = {
  top: '-0.2rem',
  right: '-0.22rem',
  translateX: '50%',
  translateY: '0',
}
</script>

<template>
  <div class="relative mb-50 w-full f-c flex-col">
    <div class="relative">
      <img
        :src="imgMap.bgImg"
        alt=""
        class="w-590"
      >
      <div
        class="absolute top-1/2 h-138 w-137 f-c flex-col translate-y-35 -right-20"
        :style="{ backgroundImage: `url(${imgMap.discountImg})` }"
      >
        <div class="ml-20 mt-10 flex flex-col rotate-[15deg] items-center justify-center text-43 text-white text-stroke-4 text-stroke-[#ad145b] paint-order">
          <div>
            30%
          </div>
          <div class="-mt-10">
            OFF
          </div>
        </div>
      </div>
    </div>

    <div class="absolute left-1/2 top-60 f-c -translate-x-1/2">
      <img
        :src="imgMap.textImg"
        alt=""
      >
    </div>

    <div class="absolute left-1/2 f-c rounded-20 text-24 -bottom-20 -translate-x-1/2">
      Ends in 31:34:18
    </div>
    <div class="absolute left-1/2 top-240 h-46 w-356 f-c rounded-20 bg-[#000000] bg-opacity-24 text-30 text-stroke-2 text-stroke-[#0a273d] -translate-x-1/2">
      Only one chance
    </div>
    <div class="absolute bottom-200 left-1/2 h-126 w-590 f-c -translate-x-1/2">
      <div class="h-97 flex items-center justify-center gap-15">
        <div
          v-for="gift in giftList"
          :key="gift.id"
          class="relative h-full flex flex-col items-center"
        >
          <img
            :src="gift.img"
            alt=""
            class="h-full"
          >
          <div
            v-if="gift.price"
            class="absolute bottom-10 left-1/2 translate-y-1/2 text-42 text-white text-stroke-3 text-stroke-[#4d1202] paint-order -translate-x-1/2"
          >
            {{ gift.price }}
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-100 left-1/2 h-126 w-590 f-c -translate-x-1/2">
      <div class="relative h-97 flex items-center justify-center gap-15 text-48 color-[#fff0de] text-stroke-3 text-stroke-[#4d1202] paint-order">
        $5.00
        <div class="absolute bottom-1/2 translate-y-1/2 text-30 text-white color-[#fbcaa7] text-stroke-3 text-stroke-[#4d1202] paint-order -right-120">
          <span class="relative">
            $15.00
            <span class="absolute left-0 top-1/2 h-3 w-full rotate-[-5deg] bg-[#f30404] -translate-y-1/2" />
          </span>
        </div>
      </div>
    </div>
    <div class="absolute bottom-35 left-1/2 h-96 w-317 f-c -translate-x-1/2">
      <div
        class="h-96 w-317"
        @click="handleBtnClick"
      >
        <GreenButton
          ref="greenButtonRef"
          radius="24px"
          :score="40"
          :score-add="40"
          score-show
          :bubble-position="bubblePosition"
        >
          <div class="relative text-50">
            <!-- 底层：只有阴影的文字 -->
            <div
              class="absolute inset-0"
              style="text-shadow: 0px 3px 0px #bcfb6b; color: transparent;"
            >
              Buy now
            </div>

            <!-- 顶层：只有渐变的文字 -->
            <div class="gradient-text-with-shadow relative">
              Buy now
            </div>
          </div>
        </GreenButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text-with-shadow {
  /* 渐变背景 */
  background: #2a561a;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

}

.test {
  background-image: linear-gradient(0deg,
      #e4ec5b 0%,
      #ace81d 99%),
    linear-gradient(#66af0f,
      #66af0f);
  background-blend-mode: normal,
    normal;
  box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(0deg,
      #1d6301 0%,
      #5f9f26 100%);
  border-image-slice: 1;
}

.btn-bg-small {
  position: relative;
  background-image: linear-gradient(0deg, #52c011 0%, #ace81d 99%), linear-gradient(#66af0f, #66af0f);
  background-blend-mode: normal, normal;
  border-radius: 32px;
  box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
}

.btn-bg-small::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(0deg, #1d6301 0%, #5f9f26 100%);
  border-radius: 34px; /* 略大于按钮的圆角 */
  z-index: -1;
}
</style>
