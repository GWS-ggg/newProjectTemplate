<script setup lang="ts">
import GreenButton from '@/components/GreenButton.vue'
import { computed, ref, watchEffect } from 'vue'

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
  BuyTimes: number
  sortId?: number
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

const displayGiftList = ref<Gift[]>([])

watchEffect(() => {
  displayGiftList.value = giftList.value.filter(item => item.BuyTimes === 0).slice(0, 3)
  let sortId = 1
  displayGiftList.value.forEach((item) => {
    item.sortId = sortId++
  })
})
// 创建一个映射来存储button refs
const greenButtonRefs = ref<Map<number, InstanceType<typeof GreenButton>>>(new Map())

// 设置ref的方法
function setButtonRef(el: any, id: number) {
  if (el) {
    greenButtonRefs.value.set(id, el as InstanceType<typeof GreenButton>)
  }
}
const isAnimating = ref(false)
const showNewGiftAnimation = ref(false)

// 创建CSS动画Promise函数 - 使用事件监听器和超时保护
function animateWithClass(element: Element | null, className: string, duration: number): Promise<void> {
  return new Promise((resolve) => {
    if (!element) {
      resolve()
      return
    }

    const onAnimationEnd = () => {
      element.removeEventListener('animationend', onAnimationEnd)
      resolve()
    }

    element.addEventListener('animationend', onAnimationEnd)
    element.classList.add(className)

    // 安全超时处理
    setTimeout(() => {
      if (element.classList.contains(className)) {
        element.removeEventListener('animationend', onAnimationEnd)
        resolve()
      }
    }, duration + 50)
  })
}

// 使用async/await实现流畅的动画序列
async function handlePurchaseButton(currentGift: Gift) {
  // 防止重复点击
  if (isAnimating.value)
    return

  isAnimating.value = true
  const buttonRef = greenButtonRefs.value.get(currentGift.id)

  try {
    // 1. 创建积分动画Promise
    const scoreAnimationPromise = new Promise<void>((resolve) => {
      if (buttonRef) {
        buttonRef.triggerAnimationWithCallback(() => resolve())
      }
      else {
        resolve()
      }
    })

    // 2. 执行消失动画
    const giftElement = document.querySelector(`#gift-${currentGift.sortId}`)
    await animateWithClass(giftElement, 'fade-out', 500)

    // 3. 执行上滑动画
    const gift2 = document.querySelector('#gift-2')
    const gift3 = document.querySelector('#gift-3')

    await Promise.all([
      animateWithClass(gift2, 'move-up', 500),
      animateWithClass(gift3, 'move-up', 500),
    ])

    // 4. 重置所有动画类
    document.querySelectorAll('.gift-container').forEach((element) => {
      element.classList.remove('fade-out', 'move-up')
    })

    // 5. 更新数据并执行新礼物出现动画
    const selectedGift = giftList.value.find(item => item.id === currentGift.id)
    if (selectedGift) {
      selectedGift.BuyTimes = 1
    }

    showNewGiftAnimation.value = true

    // 等待新礼物动画完成
    const newGift = document.querySelector('.fade-in')
    if (newGift) {
      await new Promise<void>((resolve) => {
        const onFadeInEnd = () => {
          newGift.removeEventListener('animationend', onFadeInEnd)
          resolve()
        }
        newGift.addEventListener('animationend', onFadeInEnd, { once: true })

        // 安全超时
        setTimeout(resolve, 500)
      })
    }
    else {
      await new Promise<void>(resolve => setTimeout(resolve, 500))
    }

    showNewGiftAnimation.value = false

    // 6. 等待积分动画完成
    await scoreAnimationPromise
  }
  finally {
    // 无论何种情况都重置状态
    isAnimating.value = false
    if (!buttonRef) {
      currentGift.isPurchased = true
    }
  }
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
      v-for="item in displayGiftList"
      :id="`gift-${item.sortId}`"
      :key="item.id"
      class="gift-container relative mt-20 w-710 flex items-center justify-center"
      :class="{ 'fade-in': item.sortId === 3 && showNewGiftAnimation }"
    >
      <div class="w-710">
        <img
          :src="item.bgImg"
          alt=""
          class="w-full"
        >
      </div>

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
          :ref="el => setButtonRef(el, item.id)"
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
