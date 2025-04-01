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

import { computed, ref } from 'vue'

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
const giftData: GiftData = {
  title: 'END IN:60:00:00',
  currentScore: 100,
  totalScore: 200,
  giftList: [
    {
      id: 1,
      price: '$88.88',
      bgImg: imgMap.purpleBgImg,
      score: 50,
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
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
    {
      id: 5,
      price: '$99.99',
      bgImg: imgMap.pinkBgImg,
      score: 50,
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
      goodsList: [{
        img: imgMap.box1Img,
      }],
    },
  ],
}
const processBar = computed(() => {
  return `${giftData.currentScore / giftData.totalScore * 100}%`
})
const animatedIcon = ref<InstanceType<typeof AnimatedIcon> | null>(null)
const iconImg = ref('')
iconImg.value = imgMap.processIconLeftImg
const glowImg = ref('')
glowImg.value = imgMap.glowImg
// 更新后的触发方法，现在调用组件的方法
function triggerAnimation() {
  animatedIcon.value?.triggerAnimation()
}

function getAnimationDelay(index: number) {
  if (index === 2) {
    return '0.45s'
  }
  if (index === 3) {
    return '0.3s'
  }
  return `${index * 0.15}s`
}
</script>

<template>
  <div class="relative mb-30 flex flex-col items-center text-32">
    <div class="mt-19 text-29 text-stroke-1 text-stroke-[#19093e]">
      END IN:60:00:00
    </div>
    <div class="relative mt-26 flex items-center justify-center">
      <div class="absolute z-10 h-66 w-66 f-c -left-40 -top-9">
        <div class="relative h-full w-full">
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
    <div class="grid grid-cols-2 mt-20 gap-22">
      <div
        v-for="(gift, index) in giftData.giftList"
        :key="gift.id"
        class="relative h-303.55 w-326"
      >
        <div
          class="grid-item fade-in relative h-full w-full bg-cover bg-center bg-no-repeat"
          :style="{ 'backgroundImage': `url(${gift.bgImg})`, 'animation-delay': `${getAnimationDelay(index)}` }"
        >
          <div class="flex flex-col">
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
            <div class="ml-10 mt-20">
              <template v-if="gift.isFree">
                <div
                  class="relative h-81 w-303 f-c click-animate cursor-pointer"
                  @click="triggerAnimation"
                >
                  <img
                    class="absolute inset-0 z-10 w-303"
                    :src="imgMap.btnBigImg "
                    alt=""
                  >
                  <div class="z-20 text-30 text-stroke-2 text-stroke-[#164b2e]">
                    FREE
                  </div>
                  <img
                    :src="imgMap.lockImg"
                    alt=""
                    class="z-20 ml-20 w-40"
                  >
                </div>
              </template>
              <template v-else>
                <div class="f-b">
                  <div
                    class="relative h-81 w-205 f-c click-animate"
                    @click="triggerAnimation"
                  >
                    <img
                      class="absolute left-0 top-0 z-10 w-205"
                      :src="imgMap.btnSmallImg "
                      alt=""
                    >
                    <div class="z-20 text-30 text-stroke-2 text-stroke-[#164b2e]">
                      {{ gift.price }}
                    </div>
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
              </template>
            </div>
          </div>
          <div
            v-if="index === 0 || index === 4"
            class="absolute bottom-1/2 right-0 z-30 translate-x-[80%]"
          >
            <img
              class="h-60"
              :src="imgMap.arrowRightImg"
              alt=""
            >
          </div>
          <div
            v-if="index === 1 "
            class="absolute bottom-0 right-1/2 z-30 translate-x-1/2 translate-y-[80%]"
          >
            <img
              class="w-60"
              :src="imgMap.arrowDownImg"
              alt=""
            >
          </div>
          <div
            v-if="index === 3 "
            class="absolute bottom-1/2 left-0 z-30 -translate-x-[80%]"
          >
            <img
              class="h-60"
              :src="imgMap.arrowLeftImg"
              alt=""
            >
          </div>
          <div
            v-if="index === 2 "
            class="absolute bottom-0 right-1/2 z-30 translate-x-1/2 translate-y-[80%]"
          >
            <img
              class="w-60"
              :src="imgMap.arrowDownImg"
              alt=""
            >
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
        transform: scale(0)
    }

    80% {
        opacity: 1;
        transform: scale(1.05)
    }

    to {
        opacity: 1;
        transform: scale(1)
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
</style>
