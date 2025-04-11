<script setup lang="ts">
// const icon = ref<HTMLElement | null>(null)
// const iconImg = ref('')
// iconImg.value = imgMap.processIconLeftImg
// function triggerAnimation() {
//   if (!icon.value)
//     return
//   icon.value.classList.remove('animate')
//   // 强制浏览器重绘以重启动画
//   void icon.value.offsetWidth
//   icon.value.classList.add('animate')
// }
import AnimatedIcon from '@/components/AnimatedIcon.vue'

import GreenButton from '@/components/GreenButton.vue'
import { computed, nextTick, ref, watchEffect } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/sixSegment/${name}`, import.meta.url).href
}
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
const displayedGifts = ref<GiftPackage[]>([])
watchEffect(() => {
  displayedGifts.value = giftData.value.giftList.filter(gift => gift.BuyTimes !== 1)
  displayedGifts.value = displayedGifts.value.slice(0, 6)
  let sortId = 1
  displayedGifts.value.forEach((gift) => {
    gift.sortId = sortId++
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
  return `${giftData.value.currentScore / giftData.value.totalScore * 100}%`
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
// 创建一个映射来存储button refs
const greenButtonRefs = ref<Map<number, InstanceType<typeof GreenButton>>>(new Map())

// 设置ref的方法
function setButtonRef(el: any, id: number) {
  if (el) {
    greenButtonRefs.value.set(id, el as InstanceType<typeof GreenButton>)
  }
}

// 处理购买礼包后的动画效果
async function handleGiftPurchase(gift: GiftPackage) {
  if (isAnimating.value)
    return
  isAnimating.value = true

  // 查找礼包在显示列表中的索引
  const giftIndex = giftData.value.giftList.findIndex(item => item.id === gift.id)
  if (giftIndex === -1) {
    isAnimating.value = false
    return
  }
  // 等待状态更新后应用动画
  // await nextTick()
  // 隐藏所有箭头
  arrowsVisible.value = false
  // arrowsReappear.value = false

  // 应用消失动画
  const giftElement = document.querySelector(`#gift-${gift.sortId}`)
  if (giftElement) {
    giftElement.classList.add('fade-out')
  }

  // 等待消失动画完成
  setTimeout(() => {
    // 根据礼包位置应用不同的动画
    // 如果是第一个礼包被购买
    const gift2 = document.querySelector('#gift-2')
    const gift3 = document.querySelector('#gift-3')
    const gift4 = document.querySelector('#gift-4')
    const gift5 = document.querySelector('#gift-5')
    const gift6 = document.querySelector('#gift-6')

    if (gift2)
      gift2.classList.add('move-left')
    if (gift3)
      gift3.classList.add('move-up')
    if (gift4)
      gift4.classList.add('move-right')
    if (gift5)
      gift5.classList.add('move-up')
    if (gift6)
      gift6.classList.add('move-left')

    // 等待移动动画完成后更新数组
    setTimeout(() => {
      // 移除已购买的礼包
      // 标记礼包为已购买
      giftData.value.giftList[giftIndex].BuyTimes = 1
      newDelay.value = true
      // 新增未购买的礼包
      isAnimating.value = false

      // 2秒后重新显示所有箭头并添加重新出现动画
      setTimeout(() => {
        // 标记为重新出现状态
        // arrowsReappear.value = true
        // 显示箭头
        arrowsVisible.value = true
      }, 150)
    }, 600)
  }, 500)
}

function handleButtonClick(gift: GiftPackage) {
  if (isAnimating.value)
    return
  // 只有第一个礼包可以被购买
  if (gift.sortId !== 1)
    return

  // 使用映射获取按钮引用
  const buttonRef = greenButtonRefs.value.get(gift.id)
  // 触发积分动画
  console.log('greenButtonRef', buttonRef)
  buttonRef?.triggerAnimation()

  // 处理礼包购买
  setTimeout(() => {
    handleGiftPurchase(gift)
  }, 1500)

  // 2秒后更新分数（与动画同步）
  setTimeout(() => {
    totalScore.value += scoreToAdd.value
    // 其他逻辑...
  }, 1500)
}

function getAnimationDelay(sortId: number) {
  // 新增的礼包快速出来
  if (sortId === 6 && newDelay.value) {
    return '0.15s'
  }
  return `${sortId * 0.15}s`
}
function getItemClass(gift: GiftPackage) {
  // 如果不需要显示箭头，则添加no-arrow类来覆盖after伪元素
  if (gift.sortId === displayedGifts.value.length) {
    return `item-${gift.sortId} no-arrow`
  }

  return `item-${gift.sortId}`
}
</script>

<template>
  <div class="relative mb-30 flex flex-col items-center text-32">
    <div class="mt-30 text-29 text-stroke-3 text-stroke-[#19093e] paint-order">
      END IN:60:00:00
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
          {{ giftData.currentScore }} / {{ giftData.totalScore }}
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
        v-for="gift in displayedGifts"
        :id="`gift-${gift.sortId}`"
        :key="gift.id"
        class="relative h-303.55 w-326 transition-all duration-500"
        :class="getItemClass(gift)"
      >
        <div
          class="grid-item fade-in relative h-full w-full bg-cover bg-center bg-no-repeat"
          :class="{ purchased: gift.BuyTimes === 1 }"
          :style="{ 'backgroundImage': `url(${gift.bgImg})`, 'animation-delay': `${getAnimationDelay(gift.sortId as number)}` }"
        >
          <div class="relative flex flex-col">
            <div class="mt-50 f-c">
              <template
                v-for="good in gift.goodsList"
                :key="good.img"
              >
                <div
                  class="h-90 w-100 f-e flex-col bg-cover bg-center bg-no-repeat"
                  :style="{ backgroundImage: `url(${good.img})` }"
                >
                  <div class="text-34 text-stroke-2 text-stroke-[#464646] -mb-10">
                    {{ good.desc }}
                  </div>
                </div>
              </template>
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
              v-if="gift.isFree && gift.BuyTimes !== 1"
              class="mt-20 f-c"
            >
              <div class="relative h-70 w-280">
                <GreenButton
                  :ref="el => setButtonRef(el, gift.id)"
                  radius="26px"
                  border-width="2px"
                  :score="40"
                  score-show
                  :score-target="scoreDisplayRef"
                  @click="handleButtonClick(gift)"
                >
                  <div class="z-20 text-30 text-stroke-3 text-stroke-[#164b2e] paint-order">
                    FREE
                  </div>
                  <img
                    :src="imgMap.lockImg"
                    alt=""
                    class="z-20 ml-20 w-40"
                  >
                </GreenButton>
              </div>
            </div>
            <div v-else-if="gift.BuyTimes !== 1">
              <div class="ml-20 mt-20 f-b">
                <div class="relative h-70 w-190">
                  <GreenButton
                    :ref="el => setButtonRef(el, gift.id)"
                    radius="24px"
                    border-width="2px"
                    :score="40"
                    score-show
                    @click="handleButtonClick(gift)"
                  >
                    <div class="z-20 text-30 text-stroke-3 text-stroke-[#164b2e] paint-order">
                      {{ gift.price }}
                    </div>
                  </GreenButton>
                </div>
                <div
                  class="relative h-59 w-94 f-e flex-col bg-cover bg-center bg-no-repeat"
                  :style="{ backgroundImage: `url(${imgMap.scoreBgImg})` }"
                >
                  <img
                    class="absolute left-0 z-10 w-87 -top-20"
                    :src="imgMap.scoreImg"
                    alt=""
                  >
                  <div class="z-20 text-31 text-stroke-1 text-stroke-[rgba(0,0,0,0.6)] -mb-10">
                    {{ gift.score }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div
            v-if="index === 0 || index === 4 "
            class="connection-line absolute bottom-1/2 right-0 z-30 translate-x-[90%]"
          >
            <img
              class="h-60"
              :src="imgMap.arrowRightImg"
              alt=""
            >
          </div>
          <div
            v-if="index === 1 || index === 3"
            class="connection-line absolute bottom-0 right-1/2 z-30 translate-x-1/2 translate-y-[80%]"
          >
            <img
              class="w-60"
              :src="imgMap.arrowDownImg"
              alt=""
            >
          </div>
          <div
            v-if="index === 2 "
            class="connection-line absolute bottom-1/2 left-0 z-30 -translate-x-[70%]"
          >
            <img
              class="h-60"
              :src="imgMap.arrowLeftImg"
              alt=""
            >
          </div> -->
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
