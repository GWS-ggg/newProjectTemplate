<script setup lang="ts">
import type { OrderPopupInfo, ProductInfo, Prop, SixSegmentItemInfo } from '@/types'

import { getProductListApi } from '@/api'
import AnimatedIcon from '@/components/AnimatedIcon.vue'
import GreenButton from '@/components/GreenButton.vue'
import { useEmitBoxClick } from '@/hooks'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { useGiftStore } from '@/store/modules/giftStore'
import { animateWithClass, formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { computed, nextTick, ref, watchEffect } from 'vue'

const emits = defineEmits(['openPopup', 'boxClick'])
const { handleBoxClick } = useEmitBoxClick(emits)
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/sixSegment/${name}`, import.meta.url).href
}
const itemInfoList = ref<SixSegmentItemInfo[]>([])
const productInfo = ref<ProductInfo>()
const currentScore = ref(0)
const targetScore = ref(0)
const { getProductListRequest } = useGiftStore()

async function getProductList() {
  const res = await getProductListRequest(7)
  if (!res) {
    return
  }
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as SixSegmentItemInfo[]
  // TODO
  itemInfoList.value = itemInfoList.value.slice(0, 9)
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
getProductList()
const collectBgImg = computed(() => {
  return findImagePath('collectBg.png', productInfo.value?.Pic)
})
const collectPropImg = computed(() => {
  return findImagePath('collectProp.png', productInfo.value?.Pic)
})

const giftCellBg1Img = getImageUrl('gift_cell_bg_1.png')
const giftCellBgImgList = ref<string[]>([])
watchEffect(() => {
  giftCellBgImgList.value = [
    findImagePath('gift_cell_bg_2.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_3.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_4.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_5.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_6.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_7.png', productInfo.value?.Pic),
    findImagePath('gift_cell_bg_8.png', productInfo.value?.Pic),
  ]
  giftCellBgImgList.value = giftCellBgImgList.value.filter(item => item !== '')
})

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
  processIconBgImg: getImageUrl('img_通用积分_bg.png'),
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

const currentGift = ref<SixSegmentItemInfo>()
const animatedIconRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)
const scoreTargetRef = ref<HTMLElement | null>(null)
const scoreTargetRefMap = ref<Record<number, HTMLElement>>({})
function setScoreTargetRef(el: any, id: number) {
  scoreTargetRefMap.value[id] = el
}

const currentGiftScore = computed(() => {
  const item = itemInfoList.value.find(item => item.id === currentGift.value?.id)
  if (item?.Price === 0) {
    return 0
  }
  return item?.Props.find(prop => prop.PropID === 270001)?.DeltaCount || 0
})

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

const animatedBgImgShow = ref(false)
// 背景图切换
function getBgImgUrl(sortId: number, id: number) {
  if (animatedBgImgShow.value && sortId === 2) {
    return giftCellBg1Img
  }
  if (sortId === 1) {
    return giftCellBg1Img
  }
  return giftCellBgImgList.value[id % giftCellBgImgList.value.length]
}

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
  animatedBgImgShow.value = true
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
  animatedBgImgShow.value = false
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
  currentGift.value = gift

  const orderPopupInfo: OrderPopupInfo = {
    price: gift.Price || 0,
    key: gift.Key || 0,
    tradeProductId: gift.TradeProductID || 0,
    skuId: gift.SkuID,
    exchangeId: gift.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
}

async function triggerSuccessAnimation() {
  if (!currentGift.value) {
    return
  }
  isAnimating.value = true
  try {
    // 触发按钮积分动画
    triggerAnimation(currentGift.value?.id)
    // 触发积分动画
    animatedIconRef.value?.triggerAnimation()
    currentScore.value += currentGiftScore.value
    if (currentScore.value >= targetScore.value) {
      currentScore.value = targetScore.value
    }
    // 等待积分动画完成
    if (noBuyGiftNum.value > 6) {
      // 延迟执行礼包购买动画，与按钮动画保持同步
      await handleGiftPurchase(currentGift.value)
    }
    else {
      // 如果礼包数量不足，直接标记为已购买
      currentGift.value.BuyTimes = 1
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
defineExpose({
  triggerSuccessAnimation,
  getProductList,
})

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
        text-class="px-20 text-29"
      >
        <template #default="{ hours, minutes, seconds }">
          <TextStroke
            stroke-color="#581616"
            :stroke-width="3"
          >
            END IN  {{ hours }}:{{ minutes }}:{{ seconds }}
          </TextStroke>
        </template>
      </CountDown>
    </div>
    <div class="relative mt-26 flex items-center justify-center">
      <div class="absolute z-10 h-66 w-66 f-c -left-40 -top-9">
        <div
          ref="scoreDisplayRef"
          class="relative h-full w-full"
        >
          <div class="h-64 w-64 border-8 border-[#ffc529] rounded-full rounded-full border-solid bg-[#1b1142]" />
        </div>

        <img
          ref="scoreTargetRef"
          class="absolute bottom-1/2 left-1/2 h-90 translate-y-1/2 -translate-x-1/2"
          :src="collectPropImg"
          alt=""
        >
      </div>

      <div class="relative h-48 f-s bg-cover bg-center text-center text-24">
        <div class="progress-mask relative h-48 w-450 f-c overflow-hidden border-6 border-[#ffc529] rounded-full border-solid">
          <!-- 进度条填充部分 -->
          <div
            class="progress-bar absolute left-0 top-0 h-full f-c rounded-20"
            :style="{ width: `${(currentScore / targetScore) * 100}%` }"
          />

          <div class="z-10 text-22 text-white font-medium drop-shadow-md">
            {{ currentScore }}/{{ targetScore }}
          </div>
        </div>
      </div>
      <div class="absolute right-0 top-1/2 z-10 h-90 f-c translate-x-1/2 -translate-y-1/2">
        <img
          class="h-full"
          :src="getPGImg(productInfo?.Props[0]?.Icon as string)"
          alt=""
          :class="productInfo?.Props?.[0].PropType === 11 ? 'scale-120' : ''"
          @click="(event) => handleBoxClick(productInfo?.Props[0] as Prop, event)"
        >
      </div>
    </div>
    <div
      class="grid-container grid grid-cols-2 mt-30 gap-22"
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
          class="grid-item fade-in relative h-full bg-cover bg-center bg-no-repeat"
          :class="{ purchased: gift.BuyTimes === 1 }"
          :style="{ 'animation-delay': `${getAnimationDelay(gift.sortId as number)}` }"
        >
          <img
            class="absolute left-0 top-0 h-full"
            :class="{ 'img-changing': animatedBgImgShow && gift.sortId === 2 }"
            :src="getBgImgUrl(gift.sortId as number, gift.id as number)"
            alt=""
          >
          <div class="relative flex flex-col">
            <div class="mt-20 f-c">
              <div
                v-for="(good, goodIndex) in getPorpsInfo(gift.Props)"
                :key="goodIndex"
                class="relative h-120 f-e flex-col"
              >
                <IconWithText
                  :icon-url="getPGImg(good.Icon)"
                  :text="good.Text"
                  :text-size="36"
                  :icon-height="120"
                  :bottom="-5"
                  stroke-color="#464646"
                  :stroke-width="3"
                  :gift-type="good.PropType"
                  @click="(event: any) => handleBoxClick(good, event)"
                />
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
              class="mt-20"
              :class="{ 'f-b': gift.Price !== 0, 'f-c': gift.Price === 0 }"
            >
              <div
                class="relative h-70 w-280 -mt-5"
                :class="{ 'w-[190px]! ml-20': gift.Price !== 0 }"
              >
                <GreenButton
                  :ref="el => setRef(el, gift.id)"
                  radius="0.26rem"
                  border-width="0.02rem"
                  :score="40"
                  score-show
                  @click="handleButtonClick(gift)"
                >
                  <div
                    v-show="gift.Price === 0"
                    class="relative z-20 text-30"
                  >
                    <TextStroke
                      stroke-color="#164b2e"
                      :stroke-width="3"
                    >
                      FREE
                    </TextStroke>
                    <img
                      v-if="gift.sortId !== 1"
                      :src="imgMap.lockImg"
                      alt=""
                      class="absolute top-1/2 z-20 ml-20 w-40 translate-x-1/2 -right-30 -translate-y-1/2"
                    >
                  </div>
                  <div
                    v-show="gift.Price !== 0"
                    class="t relative z-20 text-30"
                  >
                    <TextStroke
                      stroke-color="#164b2e"
                      :stroke-width="3"
                    >
                      {{ formatPrice(gift.Price || 0) }}
                    </TextStroke>
                  </div>
                </GreenButton>
              </div>
              <div
                v-if="gift.Price !== 0 "
                :ref="el => setScoreTargetRef(el, gift.id)"
                class="relative h-59 w-94 f-e flex-col bg-cover bg-center bg-no-repeat"
                :style="{ backgroundImage: `url(${collectBgImg})` }"
              >
                <img
                  class="absolute left-0 z-10 w-87 -top-20"
                  :src="collectPropImg"
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
    <Teleport to="body">
      <!-- 第一个按钮的动画组件 -->
      <AnimatedIcon
        ref="animatedIconRef"
        :icon-url="collectPropImg"
        :score="currentGiftScore"
        :start-element="scoreTargetRefMap[currentGift?.id as number]"
        :target-element="scoreTargetRef"
      />
    </Teleport>
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

/* 设置基本过渡效果 */
// .img-transition {
//   transition: opacity cubic-bezier(0.895, 0.03, 0.685, 0.22) ease;
// }

/* 添加关键帧动画 */
@keyframes fadeIn {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

/* 使用animation-fill-mode: backwards确保动画开始前应用初始状态 */
// .img-transition {
//   animation: fadeIn 0.8s ease-in-out;
// }

/* 移除之前的所有动画规则，使用单一简洁的方案 */
.img-changing {
  /* 使用animation替代transition */
  animation: bgFade 1s ease-out forwards;
}

@keyframes bgFade {
  /* 从当前状态开始，避免初始值跳变 */
  from {
    filter: brightness(0.9);
    transform: scale(1.01);
  }
  to {
    filter: brightness(1);
    transform: scale(1);
  }
}

  .progress-mask {
  background-color: #1b1142;
  // background-image: linear-gradient(#781553,
  //     #781553),
  //   linear-gradient(#952158,
  //     #952158);
  // box-shadow: inset 0px -3px 7px 0px rgba(44, 13, 73, 0.64),
  //   inset 0px 2px 7px 0px rgba(1, 13, 20, 0.42);
  box-shadow: inset 0px 2px 2px 0px
  rgba(27, 17, 68, 0.69);
  border-radius: 11px;
  opacity: 1;
}

.progress-bar {
background-image: linear-gradient(0deg,
    #348001 0%,
    #51a506 34%,
    #9bdf18 96%,
    #7dd317 100%),
  linear-gradient(#751f56,
    #751f56);
background-blend-mode: normal,
  normal;
}
</style>
