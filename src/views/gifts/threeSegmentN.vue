<script setup lang="ts">
import type { ProductInfo, ThreeSegmentNItemInfo } from '@/types'
import { getProductListApi } from '@/api'
import GreenButton from '@/components/GreenButton.vue'
import IconWithText from '@/components/IconWithText.vue'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { animateWithClass, getPGImg } from '@/utils'

import { computed, nextTick, ref, watchEffect } from 'vue'

const itemInfoList = ref<ThreeSegmentNItemInfo[]>([])
const productInfo = ref<ProductInfo>()
async function getThreeSegmentNData() {
  const res = await getProductListApi({
    appid: '616876868660610',
    uid: '102191',
    producttype: 8,
  })
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as ThreeSegmentNItemInfo[]
  itemInfoList.value = itemInfoList.value.slice(0, 5)
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
getThreeSegmentNData()

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
  okImg: getImageUrl('icon_勾.png'),
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
  BuyTimes: number
  sortId?: number
}
const _giftList = ref<Gift[]>([
  {
    id: 1,
    btnDesc: 'FREE',
    available: true,
    isFree: true,
    isPurchased: false,
    bgImg: imgMap.bg1Img,
    bgOkImg: imgMap.bg1OkImg,
    BuyTimes: 1,
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
    BuyTimes: 0,
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
    BuyTimes: 0,
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '200' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '300' },
      { id: 3, iconImg: imgMap.box2Img, desc: '200' },
    ],
    score: 60,
  },
  {
    id: 4,
    btnDesc: 'FREE',
    available: true,
    isFree: true,
    isPurchased: false,
    bgImg: imgMap.bg1Img,
    bgOkImg: imgMap.bg1OkImg,
    BuyTimes: 0,
    iconList: [
      { id: 1, iconImg: imgMap.diceImg, desc: '200' },
      { id: 2, iconImg: imgMap.goldImg, desc: '30K' },
      { id: 3, iconImg: imgMap.diamondImg, desc: '200' },
    ],
    score: 40,
  },
  {
    id: 5,
    btnDesc: '20.00',
    available: true,
    isFree: false,
    isPurchased: false,
    bgImg: imgMap.bg2Img,
    bgOkImg: imgMap.bg2OkImg,
    BuyTimes: 0,
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '100' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '200' },
      { id: 3, iconImg: imgMap.box2Img, desc: '100' },
    ],
    score: 20,
  },
  {
    id: 6,
    btnDesc: '60.00',
    available: true,
    isFree: false,
    isPurchased: false,
    bgImg: imgMap.bg3Img,
    bgOkImg: imgMap.bg3OkImg,
    BuyTimes: 0,
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '200' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '300' },
      { id: 3, iconImg: imgMap.box2Img, desc: '200' },
    ],
    score: 60,
  },
])

const displayGiftList = ref<ThreeSegmentNItemInfo[]>([])
const noBuyGiftNum = computed(() => {
  return itemInfoList.value.filter(item => item.BuyTimes === 0).length
})
watchEffect(() => {
  displayGiftList.value = itemInfoList.value.filter(item => item.BuyTimes === 0).slice(0, 3)
  if (noBuyGiftNum.value <= 3) {
    displayGiftList.value = itemInfoList.value.slice(-3)
  }
  let sortId = 1
  displayGiftList.value.forEach((item) => {
    if (item.BuyTimes === 0) {
      item.sortId = sortId++
    }
  })
})

// 使用组合式函数管理按钮引用
const { setRef, triggerAnimation } = useAnimatableRefs()

const isAnimating = ref(false)

// 使用async/await实现流畅的动画序列
async function handlePurchaseButton(currentGift: ThreeSegmentNItemInfo) {
  if (currentGift.sortId !== 1) {
    return
  }

  // 防止重复点击
  if (isAnimating.value)
    return

  try {
    isAnimating.value = true
    // 三个礼物以上执行动画
    if (noBuyGiftNum.value > 3) {
      await handleAnimation(currentGift)
    }
    else {
      triggerAnimation(currentGift.id)
      const selectedGift = itemInfoList.value.find(item => item.id === currentGift.id)
      if (selectedGift) {
        selectedGift.BuyTimes = 1
      }
    }
  }
  finally {
    // 无论何种情况都重置状态
    isAnimating.value = false
  }
}

async function handleAnimation(currentGift: ThreeSegmentNItemInfo) {
  // 1. 触发按钮动画
  triggerAnimation(currentGift.id)

  // 2. 执行消失动画
  const giftElement = document.querySelector(`#gift-${currentGift.sortId}`)
  await animateWithClass(giftElement, 'fade-out', 500)

  // 3. 执行上滑动画
  const elements = [
    document.querySelector('#gift-2'),
    document.querySelector('#gift-3'),
  ].filter(Boolean) // 过滤掉不存在的元素

  if (elements.length > 0) {
    await Promise.all(
      elements.map(el => animateWithClass(el, 'move-up', 500)),
    )
  }

  // 4. 清理动画类并更新数据
  document.querySelectorAll('.gift-container').forEach((el) => {
    el.classList.remove('fade-out', 'move-up')
  })

  // 5. 更新礼物状态
  const selectedGift = itemInfoList.value.find(item => item.id === currentGift.id)
  if (selectedGift) {
    selectedGift.BuyTimes = 1
  }

  // 6. 等待DOM更新后再添加新礼物出现动画
  await nextTick()
  const newGift = document.querySelector('#gift-3')
  if (newGift) {
    animateWithClass(newGift, 'fade-in', 500)
    // 使用setTimeout避免过早清除动画类
    setTimeout(() => {
      newGift.classList.remove('fade-in')
    }, 600)
  }
}
</script>

<template>
  <div class="mb-30 flex flex-col items-center justify-center text-29">
    <div class="mt-30 text-[#fff] text-stroke-1 text-stroke-[#19093e]">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 py-10 text-29 text-stroke-3 text-stroke-[#19093e] paint-order"
      >
        <template #default="{ hours, minutes, seconds }">
          END IN  {{ hours }}:{{ minutes }}:{{ seconds }}
        </template>
      </CountDown>
    </div>
    <div class="mt-24 text-24 text-[#fef29f] text-stroke-3 text-stroke-[#682c2e] paint-order">
      Take each deal take each deal !"
    </div>
    <div
      v-for="item in displayGiftList"
      :id="`gift-${item.sortId}`"
      :key="item.id"
      class="gift-container relative mt-20 min-h-339 w-710 flex items-center justify-center"
    >
      <div class="w-710">
        <img
          :src="imgMap.bg1Img"
          alt=""
          class="w-full"
        >
      </div>

      <div class="absolute left-0 top-30 h-120 w-full">
        <div class="h-full flex items-center justify-center gap-30">
          <template
            v-for="(icon, index) in item.Props"
            :key="index"
          >
            <IconWithText
              :icon-url="icon.Icon"
              :text="icon.Text"
              :bottom="-10"
            />
          </template>
        </div>
      </div>
      <div class="absolute bottom-38 left-1/2 z-30 h-100 w-300 -translate-x-1/2">
        <GreenButton
          v-show="item.BuyTimes === 0"
          :ref="el => setRef(el, item.id)"
          radius="20px"
          :score="productInfo?.Props[0].VipScore"
          score-show
          @click="handlePurchaseButton(item)"
        >
          <div class="relative text-40 text-[#fff] text-stroke-2 text-stroke-[#164b2e]">
            {{ item?.Price ? item?.Price : 'FREE' }}
            <img
              v-if="item.Price === 0"
              :src="imgMap.lockImg"
              alt=""
              class="absolute top-0 h-50 -right-50"
            >
          </div>
        </GreenButton>
        <div
          v-show="item.BuyTimes && item.BuyTimes > 0"
          class="fade-in f-c"
        >
          <img
            class="h-100"
            :src="imgMap.okImg"
            alt=""
          >
        </div>
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

// 消失效果
.fade-out {
  animation: fade-out 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.move-up {
  animation: moveUp 0.6s forwards;
}
@keyframes moveUp {
  to {
    transform: translateY(-360px);
  }
}

.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
