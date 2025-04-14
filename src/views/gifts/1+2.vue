<script setup lang="ts">
import type { onePlusTwoGiftItemInfo, ProductInfo } from '@/types'
import { getProductListApi } from '@/api'

import GreenButton from '@/components/GreenButton.vue'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'

import { animateWithClass, getPGImg } from '@/utils'

import { computed, nextTick, ref, watchEffect } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/1+2/${name}`, import.meta.url).href
}
const okImg = new URL(`../../assets/images/common/icon_ok.png`, import.meta.url).href

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
  lock: getImageUrl('锁.png'),
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
  id: number
  price: number
  bgImg: string
  score: number
  priceSymbol?: string
  priceImg?: string
  goodsList: Goods[]
  BuyTimes: number
  sortId?: number
}

interface Goods {
  price?: string
  img: string
}
const productInfo = ref<ProductInfo>()
const itemInfoList = ref<onePlusTwoGiftItemInfo[]>([])
async function getProductList() {
  const res = await getProductListApi({
    appid: '616876868660610',
    uid: '102191',
    producttype: 4,
  })
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as onePlusTwoGiftItemInfo[]
  let idNum = 0
  itemInfoList.value.forEach((item) => {
    item.id = idNum++
    if (item.BuyTimes === undefined) {
      item.BuyTimes = 0
    }
    if (item.Price === undefined) {
      item.Price = 0
    }
  })
}
getProductList()

function getPorpsInfo(props: Array<{
  PropID: number
  PropType: number
  DeltaCount: number
  Icon: string
  Text?: string
}>) {
  return props.filter(prop => prop.PropID !== 270001)
}

function getScoreInfo(props: Array<{
  PropID: number
  PropType: number
  DeltaCount: number
  Icon: string
  Text?: string
}>) {
  return props.find(prop => prop.PropID === 270001)
}

const giftData = ref<GiftOnePlusTwo>({
  title: 'BUY 1 PACK & GET 2 FREE !',
  currentScore: 100,
  totalScore: 200,
  plusImg: getImageUrl('img_+.png'),
  tagImg: getImageUrl('img_标签.png'),
  scoreImg: getImageUrl('icon_积分.png'),
  giftList: [
    {
      id: 1,
      price: 20,
      bgImg: getImageUrl('img_条1_bg.png'),
      score: 50,
      priceSymbol: '$',
      BuyTimes: 0,
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
      id: 2,
      price: 0,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('锁.png'),
      BuyTimes: 0,
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
      id: 3,
      price: 0,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('锁.png'),
      BuyTimes: 0,
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
    {
      id: 4,
      price: 20,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('锁.png'),
      BuyTimes: 0,
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
      id: 5,
      price: 0,
      bgImg: getImageUrl('img_条2_bg.png'),
      score: 50,
      priceImg: getImageUrl('锁.png'),
      BuyTimes: 0,
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
})

// 标记是否正在进行动画
const isAnimating = ref(false)

// 标记是否显示第三个礼包的新礼包动画
const showNewGiftAnimation = ref(false)

const displayedGifts = ref<onePlusTwoGiftItemInfo[]>([])

const showPlus = ref(true)
const noBuyGiftNum = computed(() => {
  return itemInfoList.value.filter(item => item.BuyTimes === 0).length
})
watchEffect(() => {
  // 如果正在进行动画，不更新礼包列表以避免干扰动画
  // if (isAnimating.value)
  //   return

  // 获取未购买的礼包
  displayedGifts.value = itemInfoList.value.filter(gift => gift.BuyTimes === 0).slice(0, 3)
  if (noBuyGiftNum.value <= 3) {
    displayedGifts.value = itemInfoList.value.slice(-3)
  }
  let sortId = 1
  displayedGifts.value.forEach((item) => {
    if (item.BuyTimes === 0) {
      item.sortId = sortId++
    }
  })
})

const processBar = computed(() => {
  return `${giftData.value.currentScore / giftData.value.totalScore * 100}%`
})

function getPrice(giftPackage: onePlusTwoGiftItemInfo) {
  if (giftPackage.Price === 0) {
    return 'FREE'
  }
  return `$${giftPackage.Price?.toFixed(2)}`
}
const { setRef, triggerAnimation } = useAnimatableRefs()

async function handleButtonClick(giftPackage: onePlusTwoGiftItemInfo) {
  console.log(giftPackage.sortId)
  if (giftPackage.sortId !== 1) {
    return
  }

  if (isAnimating.value) {
    return
  }

  isAnimating.value = true

  try {
    // 设置第三个礼包不应该显示new-gift动画
    showNewGiftAnimation.value = false

    // 支付成功
    // 加号动画
    handlePlusAnimation()

    // 触发按钮动画
    triggerAnimation(giftPackage.id)

    // 礼包动画
    setTimeout(() => {
      if (noBuyGiftNum.value > 3) {
        handleGiftAnimation(giftPackage)
      }
      else {
        const selectedGift = itemInfoList.value.find(item => item.id === giftPackage.id)
        if (selectedGift) {
          selectedGift.BuyTimes = 1
        }
      }
    }, 200)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isAnimating.value = false
  }
}

function handlePlusAnimation() {
  showPlus.value = false
  setTimeout(() => {
    showPlus.value = true
  }, 1500) // 2秒后重新显示
}
async function handleGiftAnimation(giftPackage: onePlusTwoGiftItemInfo) {
  const giftElement = document.querySelector(`#gift-${giftPackage.sortId}`)
  // 第一块礼包消失动画
  await animateWithClass(giftElement, 'fade-out', 500)

  const gift2Element = document.querySelector(`#gift-2`)
  const gift3Element = document.querySelector(`#gift-3`)
  const animationPromises = []

  // 只为存在的元素添加动画任务
  if (gift2Element) {
    animationPromises.push(animateWithClass(gift2Element, 'move-to-first', 500))
  }

  if (gift3Element) {
    animationPromises.push(animateWithClass(gift3Element, 'move-to-second', 500))
  }

  // 等待所有动画完成
  if (animationPromises.length > 0) {
    await Promise.all(animationPromises)
  }

  // 移除所有动画类，为下次动画做准备
  document.querySelectorAll('.gift-container').forEach((element) => {
    element.classList.remove('fade-out', 'move-to-first', 'move-to-second')
  })
  // 更新购买次数，但不立即更新视图（延迟到动画结束后）
  // setTimeout(() => {

  // 移除所有动画类，为下次动画做准备

  const giftPackageIndex = itemInfoList.value.findIndex(gift => gift.id === giftPackage.id)
  // 更新购买次数
  itemInfoList.value[giftPackageIndex].BuyTimes = 1

  await nextTick()
  const newGift = document.querySelector('#gift-3')
  if (newGift) {
    await animateWithClass(newGift, 'fade-in', 500)
    // 使用setTimeout避免过早清除动画类
    setTimeout(() => {
      newGift.classList.remove('fade-in')
    }, 600)
  }
}
</script>

<template>
  <div class="justify-cente flex flex-col items-center text-32">
    <div class="mt-30 text-center text-29 text-stroke-3 text-stroke-[#19093e] paint-order">
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
        v-for="giftPackage in displayedGifts"
        :key="giftPackage.id"
      >
        <div
          :id="`gift-${giftPackage.sortId}`"
          class="gift-container w-208 flex flex-col"
          :class="giftPackage.sortId ? `z-${40 - 10 * giftPackage.sortId}` : 'z-10'"
        >
          <div
            class="relative h-654 w-full flex flex-col bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: giftPackage.Price && giftPackage.Price > 0 ? `url(${imgMap.strip_1})` : `url(${imgMap.strip_2})` }"
          >
            <div
              class="absolute bottom-30 right-0 z-30 h-50 w-92 f-c flex-col bg-cover bg-center"
              :style="{ backgroundImage: `url(${giftData.tagImg})` }"
            >
              <div class="f-c flex-col -mt-10">
                <img
                  class="h-60"
                  :src="getPGImg(getScoreInfo(giftPackage.Props)?.Icon)"
                  alt=""
                >
                <div class="text-stroke-black -mt-15">
                  {{ getScoreInfo(giftPackage.Props)?.DeltaCount }}
                </div>
              </div>
            </div>
            <div class="h-600 w-full flex flex-col justify-evenly gap-20">
              <template
                v-for="(goods, index) in getPorpsInfo(giftPackage.Props)"
                :key="index"
              >
                <div class="flex flex-col items-center">
                  <img
                    class="h-100"
                    :src="getPGImg(goods.Icon)"
                    alt=""
                  >
                  <span
                    v-if="goods.Text"
                    class="text-stroke-black -mt-25"
                  >
                    {{ goods.Text }}
                  </span>
                </div>
              </template>
            </div>
          </div>

          <div class="relative z-30 mt-10 h-90 w-200">
            <GreenButton
              v-show="giftPackage.BuyTimes === 0"
              :ref="el => setRef(el, giftPackage.id)"
              radius="21px"
              border-width="2px"
              :score="40"
              score-show
              @click="handleButtonClick(giftPackage)"
            >
              <div class="relative z-10 h-full w-full f-c gap-5">
                <span class="text-42 text-stroke-2 text-stroke-[#164b2e]">{{ getPrice(giftPackage) }}</span>
                <img
                  v-if="giftPackage.sortId && giftPackage.sortId !== 1"
                  class="h-50"
                  :src="imgMap.lock"
                  alt=""
                >
              </div>
            </GreenButton>
            <div
              v-show="giftPackage.BuyTimes !== 0"
              class="fade-in f-c"
            >
              <img
                class="h-100"
                :src="okImg"
                alt=""
              >
            </div>
          </div>
        </div>
      </template>
      <template
        v-for="(giftPackage, index) in displayedGifts"
        :key="giftPackage.id"
      >
        <img
          v-if="giftPackage.Price === 0 && index !== 0"
          class="absolute top-1/2 z-50 h-96 w-96 transition-opacity duration-500 -translate-x-1/2 -translate-y-100"
          :class="{ 'opacity-0': !showPlus, 'left-215': index === 1, 'left-435': index === 2 }"
          :src="giftData.plusImg"
          alt=""
        >
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

/* 动画相关样式 */
.fade-out {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
}

/* 第二块礼包移动到第一块位置 */
.move-to-first {
  animation: moveToFirst 0.6s forwards;
}

@keyframes moveToFirst {
  to {
    transform: translateX(calc(-100% - 15px));
  }
}

/* 第三块礼包移动到第二块位置 */
.move-to-second {
  animation: moveToSecond 0.6s forwards;
}

@keyframes moveToSecond {
  to {
    transform: translateX(calc(-100% - 15px));
  }
}

.fade-in {
  opacity: 0;
  transform: scale(0.3);
  animation: newGiftAppear 0.5s ease forwards;
  // animation-delay: 0.8s;
}

@keyframes newGiftAppear {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  80% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// .gift-container {
//   transition: transform 0.6s ease;
// }
</style>
