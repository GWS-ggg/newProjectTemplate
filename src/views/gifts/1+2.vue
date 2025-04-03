<script setup lang="ts">
import GreenButton from '@/components/GreenButton.vue'
import { computed, ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/1+2/${name}`, import.meta.url).href
}

const imgMap: Record<string, string> = {
  score: getImageUrl('icon_积分.png'),
  circle: getImageUrl('img_圆.png'),
  progress: getImageUrl('img_通用进度条.png'),
  progressBg: getImageUrl('img_通用进度条_bg.png'),
  strip_1: getImageUrl('img_条1_bg.png'),
  strip_2: getImageUrl('img_条2_bg.png'),
  plus: getImageUrl('img_+.png'),
  goods_1: getImageUrl('钻石1.png'),
  goods_2: getImageUrl('钻石1.png'),
  tag: getImageUrl('img_标签.png'),
  back: new URL('../../assets/images/gifts/icon_back.png', import.meta.url).href,
  boxImg: getImageUrl('魔法宝箱.png'),
  diceImg: getImageUrl('骰子.png'),
  btn_bg: getImageUrl('btn_1+2礼包按钮.png'),
}
interface GiftOnePlusTwo {
  title: string
  currentScore: number
  totalScore: number
  plusImg: string
  giftList: GiftPackage[]
  tagImg: string
  scoreImg: string

}

interface GiftPackage {
  price: number
  bgImg: string
  score: number
  priceSymbol?: string
  priceImg?: string
  goodsList: Goods[]
}

interface Goods {
  price?: string
  img: string
}

const giftData: GiftOnePlusTwo = {
  title: 'BUY 1 PACK & GET 2 FREE !',
  currentScore: 100,
  totalScore: 200,
  plusImg: getImageUrl('img_+.png'),
  tagImg: getImageUrl('img_标签.png'),
  scoreImg: getImageUrl('icon_积分.png'),
  giftList: [
    {
      price: 20,
      bgImg: getImageUrl('img_条1_bg.png'),
      score: 50,
      priceSymbol: '$',
      goodsList: [
        {
          price: '200',
          img: getImageUrl('钻石1.png'),
        },
        {
          price: '750',
          img: getImageUrl('体力3.png'),
        },
        {
          img: getImageUrl('药水魔力瓶.png'),
          price: '20 K',
        },
        {
          price: '200',
          img: getImageUrl('钻石1.png'),
        },
      ],
    },
    {
      price: 0,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('icon_积分.png'),
      goodsList: [
        {
          price: '200',
          img: getImageUrl('钻石1.png'),
        },
        {
          price: '750',
          img: getImageUrl('体力3.png'),
        },
        {
          price: '20 K',
          img: getImageUrl('药水魔力瓶.png'),
        },
        {
          price: '200',
          img: getImageUrl('钻石1.png'),
        },
      ],
    },
    {
      price: 0,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('icon_积分.png'),
      goodsList: [
        {
          price: '2100',
          img: getImageUrl('体力3.png'),
        },
        {

          img: getImageUrl('魔法宝箱.png'),
        },
        {
          price: '10min',
          img: getImageUrl('天降buff-礼包活动icon.png'),
        },
        {
          price: '10min',
          img: getImageUrl('卡牌收益buff-礼包活动icon.png'),
        },
      ],
    },
  ],
}
const processBar = computed(() => {
  return `${giftData.currentScore / giftData.totalScore * 100}%`
})

function getPrice(giftPackage: GiftPackage) {
  if (giftPackage.price === 0) {
    return 'FREE'
  }
  return `${giftPackage.priceSymbol}${giftPackage.price.toFixed(2)}`
}
</script>

<template>
  <div class="justify-cente flex flex-col items-center pt-16 text-32">
    <div class="text-center text-29 text-stroke-3 text-stroke-[#19093e]">
      {{ giftData.title }}
    </div>
    <div class="relative mt-35 flex items-center justify-center">
      <div
        class="absolute z-10 aspect-square h-64 f-c bg-cover bg-center -left-40 -top-9"
        :style="{ backgroundImage: `url(${imgMap.circle})` }"
      >
        <img
          class="h-full"
          :src="imgMap.score"
          alt=""
        >
      </div>

      <div class="relative h-48 f-s bg-cover bg-center text-center text-24">
        <img
          class="h-full"
          :src="imgMap.progressBg"
          alt=""
        >
        <div
          class="absolute left-0 top-0 h-full rounded-full"
          :style="{
            width: processBar,
            backgroundImage: `url(${imgMap.progress})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
          }"
        />
        <div class="absolute left-1/2 top-1/2 text-31 -translate-x-1/2 -translate-y-1/2">
          {{ giftData.currentScore }} / {{ giftData.totalScore }}
        </div>
      </div>
      <div class="absolute z-10 aspect-square h-64 f-c -right-35 -top-9">
        <img
          class="h-full"
          :src="imgMap.boxImg"
          alt=""
        >
      </div>
    </div>
    <div class="relative mb-20 mt-30 flex gap-15">
      <template
        v-for="(giftPackage, index) in giftData.giftList"
        :key="index"
      >
        <div class="w-208 flex flex-col">
          <div
            class="relative h-654 w-full flex flex-col bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${giftPackage.bgImg})` }"
          >
            <img
              v-if="index !== giftData.giftList.length - 1"
              class="absolute top-1/2 z-20 h-96 w-96 translate-x-1/2 -right-5 -translate-y-1/2"
              :src="giftData.plusImg"
              alt=""
            >
            <div
              class="absolute bottom-30 right-0 z-30 h-50 w-92 f-c flex-col bg-cover bg-center"
              :style="{ backgroundImage: `url(${giftData.tagImg})` }"
            >
              <div class="f-c flex-col -mt-10">
                <img
                  class="h-60"
                  :src="giftData.scoreImg"
                  alt=""
                >
                <div class="text-stroke-black -mt-15">
                  {{ giftPackage.score }}
                </div>
              </div>
            </div>
            <div class="mt-50 h-full w-full flex flex-col gap-20">
              <template
                v-for="goods in giftPackage.goodsList"
                :key="goods.price"
              >
                <div class="flex flex-col items-center">
                  <img
                    class="h-100"
                    :src="goods.img"
                    alt=""
                  >
                  <span
                    v-if="goods.price"
                    class="text-stroke-black -mt-25"
                  >
                    {{ goods.price }}
                  </span>
                </div>
              </template>
            </div>
          </div>

          <!-- 图片实现 -->
          <div class="relative mt-10 h-90 w-200 f-c">
            <img
              class="absolute left-0 top-0 h-full w-full"
              :src="imgMap.btn_bg"
              alt=""
            >
            <div class="relative z-10 h-full w-full f-c gap-5">
              <span class="text-42 text-stroke-2 text-stroke-[#164b2e]">{{ getPrice(giftPackage) }}</span>
              <img
                v-if="giftPackage.priceImg"
                class="h-50"
                :src="giftPackage.priceImg"
                alt=""
              >
            </div>
          </div>
          <!-- CSS实现 -->
          <!-- <div class="gradient-border h-90 w-200 f-c gap-5">
              <span class="text-42 text-stroke-2 text-stroke-[#164b2e]">{{ getPrice(giftPackage) }}</span>
              <img
                v-if="giftPackage.priceImg"
                class="h-50"
                :src="giftPackage.priceImg"
                alt=""
              >
            </div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nine-slice-bg {
  width: 400px;
  height: 40px;
  border: 23px solid transparent;
  /* 用来占位 */
  /* 定义 border-image */
  /* 这里 30 30 30 30 是切片大小，视你的图片而定 */
  border-image-slice: 23;
  border-image-repeat: stretch;
  border-image-width: 23;
}

.text-with-stroke {
  text-shadow:
    -1px -1px 0 #003411,
    1px -1px 0 #003411,
    -1px 1px 0 #003411,
    1px 1px 0 #003411;
}

.btn-Plus {
  background-image: linear-gradient(0deg,
      #52c011 0%,
      #ace81d 99%),
    linear-gradient(#93d616,
      #93d616);
  background-blend-mode: normal,
    normal;
  box-shadow: 0px 5px 1px 0px rgba(25, 25, 25, 0.36);
  border-style: solid;
  border-width: 2px;
  border-image: linear-gradient(0deg,
      #1d6301 0%,
      #5f9f26 100%);
  border-image-slice: 1;
  border-radius: 32px;
}
.gradient-border {
  position: relative;
  background-image: linear-gradient(0deg,
      #52c011 0%,
      #ace81d 99%),
    linear-gradient(#93d616,
      #93d616);
  background-blend-mode: normal,
    normal;
  box-shadow: 0px 5px 1px 0px rgba(25, 25, 25, 0.36);
  border-image-slice: 1;
  border-radius: 32px;
  /* 重要：设置内边距以留出边框空间 */
  padding: 2px;
}

.gradient-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 32px; /* 与外层元素相同的圆角 */
  border: 2px solid transparent;
  background:  linear-gradient(0deg,
      #1d6301 0%,
      #5f9f26 100%) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
