<script setup lang="ts">
import type { ProductInfo, SixSegmentItemInfo } from '@/types'

import { getProductListApi } from '@/api'
import AnimatedIcon from '@/components/AnimatedIcon.vue'

import GreenButton from '@/components/GreenButton.vue'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { animateWithClass, getPGImg } from '@/utils'
import { computed, nextTick, ref, watchEffect } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/sixSegment/${name}`, import.meta.url).href
}
const itemInfoList = ref<SixSegmentItemInfo[]>([])
const productInfo = ref<ProductInfo>()
const currentScore = ref(0)
const targetScore = ref(0)
async function getSixSegmentData() {
  const res = await getProductListApi({
    appid: '616876868660610',
    uid: '102191',
    producttype: 7,
  })
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as SixSegmentItemInfo[]
  itemInfoList.value = itemInfoList.value.slice(0, 7)
  currentScore.value = res.ProductInfo?.TaskScore ?? 0
  targetScore.value = res.ProductInfo?.TaskTargetScore ?? 0
  // 处理item数据 添加id BuyTimes Price
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
  console.log('res', res)
}
getSixSegmentData()
interface Goods {
  img: string
  desc?: string
}

interface GiftPackage {
  id: number
  price: string
  bgImg: string
  goodsList: Goods[]
  score?: number
  isFree?: boolean
  BuyTimes?: number // 添加购买状态标记
  sortId?: number
}
interface GiftData {
  title: string
  currentScore: number
  totalScore: number
  giftList: GiftPackage[]
}

const okImg = new URL(`../../assets/images/common/icon_ok.png`, import.meta.url).href

const imgMap = {
  pinkBgImg: getImageUrl('背景粉.png'),
  purpleBgImg: getImageUrl('背景紫.png'),
  scoreImg: getImageUrl('积分.png'),
  scoreBgImg: getImageUrl('收集物底.png'),
  processImg: getImageUrl('img_通用进度条.png'),
  processBgImg: getImageUrl('img_通用进度条_bg.png'),
  processIconLeftImg: getImageUrl('进度条左侧图标.png'),
  lockImg: getImageUrl('锁.png'),
  processIconBgImg: getImageUrl('物品圆底.png'),
  arrowLeftImg: getImageUrl('新N段式礼包-超级碗_0007_圆角矩形-1-拷贝-3.png'),
  arrowRightImg: getImageUrl('新N段式礼包-超级碗_0009_圆角矩形-1-拷贝-5.png'),
  arrowDownImg: getImageUrl('新N段式礼包-超级碗_0008_圆角矩形-1-拷贝-4.png'),
  box3Img: getImageUrl('卡牌宝箱3.png'),
  box1Img: getImageUrl('卡牌宝箱33.png'),
  diceImg: getImageUrl('体力1.png'),
  goldImg: getImageUrl('金币1.png'),
  castleImg: getImageUrl('城堡-buff礼包icon.png'),
  spinImg: getImageUrl('金色spin礼包icon-高级.png'),
  btnSmallImg: getImageUrl('btn_6阶N段式按钮_小.png'),
  btnBigImg: getImageUrl('btn_6阶N段式按钮_大.png'),
  glowImg: getImageUrl('img_光.png'),
}
const giftData = ref<GiftData>({
  title: 'END IN:60:00:00',
  currentScore: 100,
  totalScore: 200,
  giftList: [
    {
      id: 1,
      price: '$88.88',
      bgImg: imgMap.purpleBgImg,
      score: 50,
      BuyTimes: 1,
      goodsList: [
        {
          img: imgMap.diceImg,
          desc: '10',
        },
        {
          img: imgMap.goldImg,
          desc: '1.0w',
        },
      ],
    },
    {
      id: 2,
      price: 'FREE',
      bgImg: imgMap.pinkBgImg,
      score: 100,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.castleImg,
      }],
      isFree: true,
    },
    {
      id: 3,
      price: '$188.88',
      bgImg: imgMap.pinkBgImg,
      score: 100,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.spinImg,
        desc: '10min',
      }],
      isFree: true,
    },
    {
      id: 4,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
    {
      id: 5,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.box3Img,
      }],
      isFree: true,
    },
    {
      id: 6,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
    {
      id: 7,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
    {
      id: 8,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
      BuyTimes: 0,
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
  ],
})

// TODO 对礼包进行重新排序 购买的不显示  待购买的6个  其余的隐藏
// 只显示前六个礼包
const displayedGifts = ref<SixSegmentItemInfo[]>([])
const noBuyGiftNum = computed(() => {
  return itemInfoList.value.filter(item => item.BuyTimes === 0).length
})
watchEffect(() => {
  displayedGifts.value = itemInfoList.value.filter(item => item.BuyTimes === 0).slice(0, 6)
  if (noBuyGiftNum.value <= 6) {
    displayedGifts.value = itemInfoList.value.slice(-6)
  }
  let sortId = 1
  displayedGifts.value.forEach((gift) => {
    if (gift.BuyTimes === 0) {
      gift.sortId = sortId++
    }
  })
})

// 标记是否正在进行动画
const isAnimating = ref(false)
const arrowsVisible = ref(true)
// 标记箭头是否处于重新出现状态
const arrowsReappear = ref(false)
// 用于控制新添加礼包的动画延迟
const newDelay = ref(false)

const processBar = computed(() => {
  return `${currentScore.value / targetScore.value * 100}%`
})

const animatedIcon = ref<InstanceType<typeof AnimatedIcon> | null>(null)
const iconImg = ref('')
iconImg.value = imgMap.processIconLeftImg
const glowImg = ref('')
glowImg.value = imgMap.glowImg

const totalScore = ref(100)
const _currentScore = ref(50)
const scoreToAdd = ref(10)
const scoreDisplayRef = ref<HTMLElement | null>(null)
// 使用组合式函数管理按钮引用
const { setRef, triggerAnimation } = useAnimatableRefs()

// 处理购买礼包后的动画效果
async function handleGiftPurchase(gift: SixSegmentItemInfo) {
  // 查找礼包在显示列表中的索引
  const giftIndex = itemInfoList.value.findIndex(item => item.id === gift.id)
  if (giftIndex === -1) {
    return
  }

  // 隐藏所有箭头
  arrowsVisible.value = false

  // 1. 应用消失动画
  const giftElement = document.querySelector(`#gift-${gift.sortId}`)
  if (giftElement) {
    await animateWithClass(giftElement, 'fade-out', 500)
  }

  // 2. 根据礼包位置应用不同的动画
  const gift2 = document.querySelector('#gift-2')
  const gift3 = document.querySelector('#gift-3')
  const gift4 = document.querySelector('#gift-4')
  const gift5 = document.querySelector('#gift-5')
  const gift6 = document.querySelector('#gift-6')

  // 创建一个动画Promise数组
  const animationPromises = []

  if (gift2)
    animationPromises.push(animateWithClass(gift2, 'move-left', 600))
  if (gift3)
    animationPromises.push(animateWithClass(gift3, 'move-up', 600))
  if (gift4)
    animationPromises.push(animateWithClass(gift4, 'move-right', 600))
  if (gift5)
    animationPromises.push(animateWithClass(gift5, 'move-up', 600))
  if (gift6)
    animationPromises.push(animateWithClass(gift6, 'move-left', 600))

  // 等待所有动画完成
  if (animationPromises.length > 0)
    await Promise.all(animationPromises)

  // 3. 标记礼包为已购买
  const currentGift = itemInfoList.value[giftIndex]
  currentGift.BuyTimes = 1
  newDelay.value = true

  // 4. 清理动画类
  document.querySelectorAll('.grid-item').forEach((el) => {
    el.classList.remove('fade-out', 'move-left', 'move-right', 'move-up')
  })

  // 6. 等待DOM更新
  await nextTick()

  // 短暂延迟后再显示箭头，让新布局稳定
  await new Promise(resolve => setTimeout(resolve, 150))
  arrowsVisible.value = true
}

async function handleButtonClick(gift: SixSegmentItemInfo) {
  console.log('gift', gift)
  if (isAnimating.value)
    return
  console.log('111')
  // 只有第一个礼包可以被购买
  if (gift.sortId !== 1)
    return

  isAnimating.value = true
  try {
    // 触发按钮积分动画
    triggerAnimation(gift.id)

    // 等待积分动画完成
    if (noBuyGiftNum.value > 6) {
      // 延迟执行礼包购买动画，与按钮动画保持同步
      await handleGiftPurchase(gift)
    }
    else {
      // 如果礼包数量不足，直接标记为已购买
      const currentGift = itemInfoList.value.find(item => item.id === gift.id)
      if (currentGift) {
        currentGift.BuyTimes = 1
      }
    }

    // 更新分数
    totalScore.value += scoreToAdd.value
  }
  catch (error) {
    console.error('Error handling button click:', error)
  }
  finally {
    isAnimating.value = false
  }
}

function getAnimationDelay(sortId: number) {
  // 新增的礼包快速出来
  if (sortId === 6 && newDelay.value) {
    return '0.15s'
  }
  return `${sortId * 0.15}s`
}

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
</script>

<template>
  <div class="relative mb-30 flex flex-col items-center text-32">
    <div class="mt-30">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 py-10 text-29 text-stroke-3 text-stroke-[#19093e] paint-order"
      >
        <template #default="{ hours, minutes, seconds }">
          END IN  {{ hours }}:{{ minutes }}:{{ seconds }}
        </template>
      </CountDown>
    </div>
    <div class="relative mt-26 flex items-center justify-center">
      <div class="absolute z-10 h-66 w-66 f-c -left-40 -top-9">
        <div
          ref="scoreDisplayRef"
          class="relative h-full w-full"
        >
          <img
            class="h-full"
            :src="imgMap.processIconBgImg"
            alt=""
          >
        </div>

        <img
          class="absolute w-115 -bottom-4 -left-9"
          :src="imgMap.processIconLeftImg"
          alt=""
        >
      </div>

      <div class="relative h-48 f-s bg-cover bg-center text-center text-24">
        <img
          class="h-full"
          :src="imgMap.processBgImg"
          alt=""
        >
        <div
          class="absolute left-0 top-0 h-full rounded-full"
          :style="{
            width: processBar,
            backgroundImage: `url(${imgMap.processImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
          }"
        />
        <div class="absolute left-1/2 top-1/2 text-31 -translate-x-1/2 -translate-y-1/2">
          {{ currentScore }} / {{ targetScore }}
        </div>
      </div>
      <div class="absolute z-10 aspect-square h-64 f-c -right-35 -top-9">
        <img
          class="h-full"
          :src="imgMap.box3Img"
          alt=""
        >
      </div>
    </div>
    <div
      class="grid-container grid grid-cols-2 mt-20 gap-22"
      :class="{
        'arrows-hidden': !arrowsVisible,
        'arrows-reappear': arrowsReappear,
      }"
    >
      <div
        v-for="(gift, index) in displayedGifts"
        :id="`${noBuyGiftNum > 6 ? `gift-${gift.sortId}` : `gift-${index + 1}`}`"
        :key="gift.id"
        class="relative h-303.55 w-326 transition-all duration-500"
        :class="`${noBuyGiftNum > 6 ? `item-${gift.sortId}` : `item-${index + 1}`}`"
      >
        <div
          class="grid-item fade-in relative h-full w-full bg-cover bg-center bg-no-repeat"
          :class="{ purchased: gift.BuyTimes === 1 }"
          :style="{ 'backgroundImage': `url(${imgMap.pinkBgImg})`, 'animation-delay': `${getAnimationDelay(gift.sortId as number)}` }"
        >
          <div class="relative flex flex-col">
            <div class="mt-50 f-c">
              <div
                v-for="(good, goodIndex) in getPorpsInfo(gift.Props)"
                :key="goodIndex"
                class="h-90 w-100 f-e flex-col bg-cover bg-center bg-no-repeat"
                :style="{ backgroundImage: `url(${getPGImg(good.Icon)})` }"
              >
                <div class="text-34 text-stroke-2 text-stroke-[#464646] -mb-10">
                  {{ good.Text }}
                </div>
              </div>
            </div>
            <div class="ml-24 mt-30 f-s">
              <div class="text-22 text-stroke-1 text-stroke-[#5d1a00]">
                1/1
              </div>
              <div class="relative ml-5 text-20 text-[#ffe0ab] text-stroke-1 text-stroke-[#5d1a00]">
                Available
              </div>
            </div>
            <div
              v-show="gift.BuyTimes === 0"
              class="mt-20 f-c"
              :class="{ 'f-b!': gift.Price !== 0 }"
            >
              <div
                class="relative h-70 w-280"
                :class="{ 'w-[190px]! ml-20': gift.Price !== 0 }"
              >
                <GreenButton
                  :ref="el => setRef(el, gift.id)"
                  radius="26px"
                  border-width="2px"
                  :score="40"
                  score-show
                  @click="handleButtonClick(gift)"
                >
                  <div
                    v-show="gift.Price === 0"
                    class="relative z-20 text-30 text-stroke-3 text-stroke-[#164b2e] paint-order"
                  >
                    FREE
                    <img
                      v-if="gift.sortId !== 1"
                      :src="imgMap.lockImg"
                      alt=""
                      class="absolute top-1/2 z-20 ml-20 w-40 translate-x-1/2 -right-30 -translate-y-1/2"
                    >
                  </div>
                  <div
                    v-show="gift.Price !== 0"
                    class="relative z-20 text-30 text-stroke-3 text-stroke-[#164b2e] paint-order"
                  >
                    {{ gift.Price }}
                  </div>
                </GreenButton>
              </div>
              <div
                v-if="gift.Price !== 0"
                class="relative h-59 w-94 f-e flex-col bg-cover bg-center bg-no-repeat"
                :style="{ backgroundImage: `url(${imgMap.scoreBgImg})` }"
              >
                <img
                  class="absolute left-0 z-10 w-87 -top-20"
                  :src="getPGImg(getScoreInfo(gift.Props)?.Icon)"
                  alt=""
                >
                <div class="z-20 text-31 text-stroke-1 text-stroke-[rgba(0,0,0,0.6)] -mb-10">
                  {{ getScoreInfo(gift.Props)?.DeltaCount }}
                </div>
              </div>
            </div>
            <div
              v-show="gift.BuyTimes && gift.BuyTimes > 0"
              class="fade-in mt-10 f-c"
            >
              <img
                class="h-80"
                :src="okImg"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <AnimatedIcon
      ref="animatedIcon"
      :icon-url="iconImg"
      :glow-url="glowImg"
    />
  </div>
</template>

<style lang="scss" scoped>
@keyframes button-pulse {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.9);  /* 缩小到90% */
  }
  70% {
    transform: scale(1.05); /* 稍微放大超过原始大小 */
  }
  100% {
    transform: scale(1);    /* 回到原始大小 */
  }
}

.button-animation:active {
  animation: button-pulse 0.4s ease;
}

.grid-container {
  position: relative;
  z-index: auto; /* 关键 */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "area1 area2"
    "area4 area3"
    "area5 area6";
}

.item-1 { grid-area: area1; }
.item-2 { grid-area: area2; }
.item-3 { grid-area: area3; }
.item-4 { grid-area: area4; }
.item-5 { grid-area: area5; }
.item-6 { grid-area: area6; }

.grid-item {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in {
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: 0s; /* 将被内联样式覆盖 */
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  80% {
    opacity: 1;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.arrow-animation {
  animation: arrow-animation 2s ease forwards;
}

@keyframes arrow-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.outer-stroke {
  -webkit-text-stroke: 2px black;
  text-stroke: 2px black; /* 标准语法，兼容性较差 */
  paint-order: stroke fill; /* 确保描边在填充外部 */
  text-shadow: 0 0 0 transparent; /* 防止文字阴影干扰 */
}

/* 礼包购买后消失动画 */
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
    transform: scale(0.8);
  }
}

/* 移动动画 */
.move-left {
  animation: moveLeft 0.6s forwards;
}

.move-right {
  animation: moveRight 0.6s forwards;
}

.move-up {
  animation: moveUp 0.6s forwards;
}

@keyframes moveLeft {
  to {
    transform: translateX(-348px);
  }
}

@keyframes moveRight {
  to {
    transform: translateX(348px);
  }
}

@keyframes moveUp {
  to {
    transform: translateY(-325px);
  }
}

/* 已购买状态 */
.purchased {
  opacity: 0.6;
}

/* 连接线动画 */
.connection-line {
  transition: opacity 0.3s;
}

.fade-out .connection-line {
  opacity: 0;
}

/* 箭头淡入相关样式 */
.grid-item {
  --arrow-delay: 0.3s; /* 默认箭头延迟 */
}

/* 仅当明确隐藏箭头时才隐藏 */
.arrows-hidden .item-1::after,
.arrows-hidden .item-2::after,
.arrows-hidden .item-3::after,
.arrows-hidden .item-4::after,
.arrows-hidden .item-5::after {
  display: none !important;
  animation: none !important;
  opacity: 0 !important;
}

/* 箭头重新出现的动画 - 仅应用于从隐藏状态恢复的情况 */
@keyframes fadeInArrow {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50%);
  }
  70% {
    opacity: 1;
    transform: scale(1.2) translateY(-50%);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(-50%);
  }
}

/* 仅当从隐藏状态恢复时应用的动画，使用类标记控制 */
.arrows-reappear .item-1::after,
.arrows-reappear .item-2::after,
.arrows-reappear .item-3::after,
.arrows-reappear .item-4::after,
.arrows-reappear .item-5::after {
  animation: fadeInArrow 0.5s ease forwards !important;
}

.item-1::after,
.item-2::after,
.item-3::after,
.item-4::after,
.item-5::after {
  content: '';
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0; /* 初始不可见 */
}

/* 箭头淡入动画 */
@keyframes fadeInRightArrow {
  0% {
    opacity: 0;
    transform: translateY(-50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

/* 右箭头连接 */
.item-1::after {
  content: '';
  position: absolute;
  top: 40%;
  right: -32px;
  width: 42px; /* 箭头图片宽度 */
  height: 60px; /* 箭头图片高度 */
  background-image: url('@/assets/images/gifts/sixSegment/新N段式礼包-超级碗_0009_圆角矩形-1-拷贝-5.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%);
  z-index: 30;
  animation: fadeInRightArrow 0.5s ease forwards;
  animation-delay: 0.15s; /* 礼包1的箭头延迟 */

}

.item-2::after {
  content: '';
  position: absolute;
  left: 40%;
  bottom: -55px;
  width: 60px; /* 箭头图片宽度 */
  height: 45px; /* 箭头图片高度 */
  background-image: url('@/assets/images/gifts/sixSegment/新N段式礼包-超级碗_0008_圆角矩形-1-拷贝-4.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%);
  z-index: 30;
  animation: fadeInRightArrow 0.5s ease forwards;
  animation-delay: 0.3s; /* 礼包1的箭头延迟 */
}

.item-3::after {
  content: '';
  position: absolute;
  top: 40%;
  left: -30px;
  width: 42px; /* 箭头图片宽度 */
  height: 60px; /* 箭头图片高度 */
  background-image: url('@/assets/images/gifts/sixSegment/新N段式礼包-超级碗_0007_圆角矩形-1-拷贝-3.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%);
  z-index: 30;
  animation: fadeInRightArrow 0.5s ease forwards;
  animation-delay: 0.45s; /* 礼包1的箭头延迟 */
}
.item-4::after {
  content: '';
  position: absolute;
  left: 40%;
  bottom: -55px;
  width: 60px; /* 箭头图片宽度 */
  height: 45px; /* 箭头图片高度 */
  background-image: url('@/assets/images/gifts/sixSegment/新N段式礼包-超级碗_0008_圆角矩形-1-拷贝-4.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%);
  z-index: 30;
  animation: fadeInRightArrow 0.5s ease forwards;
  animation-delay: 0.6s; /* 礼包1的箭头延迟 */
}

.item-5::after {
  content: '';
  position: absolute;
  top: 40%;
  right: -32px;
  width: 42px; /* 箭头图片宽度 */
  height: 60px; /* 箭头图片高度 */
  background-image: url('@/assets/images/gifts/sixSegment/新N段式礼包-超级碗_0009_圆角矩形-1-拷贝-5.png');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%);
  z-index: 30;
  animation: fadeInRightArrow 0.5s ease forwards;
  animation-delay: 0.75s; /* 礼包1的箭头延迟 */
}

.no-arrow::after {
  content: none !important;
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
</style>
