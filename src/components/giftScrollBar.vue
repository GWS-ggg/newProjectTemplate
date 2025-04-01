<script setup lang="ts">
import { useGiftStore } from '@/store/modules/giftStore'
import { FreeMode } from 'swiper/modules'
// 导入Swiper组件和模块
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
// 导入Swiper样式
import 'swiper/css'
import 'swiper/css/free-mode'

interface GiftPackage {
  id: number
  image: string
  countdown: {
    hours: number
    minutes: number
    seconds: number
  }
  tag?: 'Hot' | 'Sale' | null
  tagColor?: string
}

// 动态导入图片的函数
function getImageUrl(name: string) {
  return new URL(`../assets/images/GiftScrollBar/${name}`, import.meta.url).href
}

// 使用 Pinia store
const giftStore = useGiftStore()
const { setCurrentPackage } = useGiftStore()

const currentPackageId = computed(() => {
  return giftStore.currentPackageId
})
function handleSetCurrentPackage(packageId: number) {
  setCurrentPackage(packageId)
  console.log(currentPackageId.value)
}

// Swiper模块定义
const modules = [FreeMode]

// 示例数据
const giftPackages = ref([
  {
    id: 1,
    image: getImageUrl('icon_阶梯.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: 'Hot',
    tagColor: 'bg-green-500',
  },
  {
    id: 2,
    image: getImageUrl('icon_battlePass.png'),
    countdown: { hours: 99, minutes: 99, seconds: 99 },
    tag: 'Sale',
    tagColor: 'bg-red-500',
  },
  {
    id: 3,
    image: getImageUrl('icon_轮盘.png'),
    countdown: { hours: 99, minutes: 99, seconds: 99 },
    tag: null,
  },
  {
    id: 4,
    image: getImageUrl('icon_1+2.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 5,
    image: getImageUrl('icon_3选1.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 6,
    image: getImageUrl('icon_折扣.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 7,
    image: getImageUrl('icon_折扣.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 8,
    image: getImageUrl('icon_3段.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 9,
    image: getImageUrl('icon_3段.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
])

// 格式化时间，确保两位数显示
function formatTime(time: number): string {
  return time < 10 ? `0${time}` : `${time}`
}

// 倒计时逻辑
let timer: number | null = null

function updateCountdown() {
  giftPackages.value.forEach((pkg) => {
    // 这里只是示例，实际应用中您可能需要基于结束时间计算剩余时间
    // 这个简化版本不会真正减少时间
  })
}

onMounted(() => {
  // 设置定时器，每秒更新一次倒计时
  timer = window.setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  // 组件卸载前清除定时器
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="gift-bg h-180 w-full">
    <div class="relative mt-50 h-130 flex items-center text-30 text-white">
      <img
        src="@/assets/images/GiftScrollBar/img_入口未选择遮盖.png"
        alt=""
        class="absolute left-0 top-0 z-0 h-full w-full"
      >

      <!-- 使用Swiper替换原来的overflow滚动容器 -->
      <Swiper
        slides-per-view="auto"
        :space-between="0"
        :free-mode="true"
        :modules="modules"
        class="gift-swiper w-full pl-18"
      >
        <SwiperSlide
          v-for="(pkg, index) in giftPackages"
          :key="pkg.id"
          class="gift-slide"
        >
          <div class="relative mb-20 flex items-center justify-center">
            <div class="absolute left-0 z-20 z-30 w-full f-c -bottom-19">
              <div class="relative h-30 w-106 f-c border-2 border-[#3e9ebc] rounded-full border-solid bg-[#daecef] text-center text-22 text-[#385673] font-medium">
                {{ formatTime(pkg.countdown.hours) }}.{{ formatTime(pkg.countdown.minutes) }}.{{
                  formatTime(pkg.countdown.seconds) }}
                <img
                  v-if="pkg.id !== currentPackageId"
                  src="@/assets/images/GiftScrollBar/img_入口未选择遮盖.png"
                  alt=""
                  class="absolute left-0 top-0 z-30 h-full w-full rounded-13"
                  style="clip-path: inset( 0,4px);"
                >
              </div>
            </div>
            <!-- Gift package items -->
            <div
              class="relative mx-23 h-82 w-106 flex cursor-pointer items-center"
              :class="{ 'scale-animation': pkg.id === currentPackageId }"
              @click="handleSetCurrentPackage(pkg.id)"
            >
              <!-- 礼包标签 (Hot/Sale) -->
              <div
                v-if="pkg.tag"
                class="absolute left-0 top-0 z-50 transform rounded-md text-16 text-white font-bold"
              >
                <div class="relative">
                  <img
                    v-if="pkg.tag === 'Hot'"
                    src="@/assets/images/GiftScrollBar/img_热卖_标签.png"
                    alt="标签"
                    class="w-50"
                  >
                  <img
                    v-if="pkg.tag === 'Sale'"
                    src="@/assets/images/GiftScrollBar/img_打折_标签.png"
                    alt="标签"
                    class="w-50"
                  >
                  <div
                    class="absolute top-8 z-10 w-full f-c text-18 color-[#f6f0e5] font-medium text-stroke-1 text-stroke-[#88140f] -left-5 -rotate-45"
                    :class="{ 'text-stroke-[#147f05]!': pkg.tag === 'Hot' }"
                  >
                    {{ pkg.tag }}
                  </div>
                </div>
              </div>

              <!-- 礼包图片容器 -->
              <div class="relative h-full w-full">
                <img
                  src="@/assets/images/GiftScrollBar/img_入口_bg_new.png"
                  alt=""
                  class="absolute left-0 top-0 z-10 h-full w-full"
                >
                <!-- 礼包图片 -->
                <img
                  :src="pkg.image"
                  alt="Gift package"
                  class="absolute left-0 top-0 z-20 w-full object-cover object-top"
                  style="clip-path: inset(2px);"
                >
                <img
                  v-if="pkg.id !== currentPackageId"
                  src="@/assets/images/GiftScrollBar/img_入口未选择遮盖.png"
                  alt=""
                  class="absolute left-0 top-0 z-20 h-full w-full rounded-13"
                >
              </div>
            </div>

            <!-- Divider line (add after each item except the last one) -->
            <div
              v-if="index < giftPackages.length - 1"
              class="divider-line absolute right-0 top-8"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gift-bg {
  background-image: url('@/assets/images/GiftScrollBar/img_台面.png');
  background-size: cover;
  background-position: center;
}

.gift-packages-container {
  background-color: rgba(139, 0, 0, 0.8);
}

/* Swiper样式 */
.gift-swiper {
  // height: 100%;
  overflow: visible;
}

.gift-slide {
  width: auto; /* 允许幻灯片宽度自适应内容 */
  // height: 100%;
}

/* 点击动画效果 */
.scale-animation {
  animation: scaleEffect 0.3s ease-in-out;
}

@keyframes scaleEffect {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}

.divider-line {
  width: 3px;
  height: 83px;
  background-color: #4f1719;
  box-shadow: 1px 0px 1px 0px rgba(255, 151, 161, 0.21);
}

/* 自定义Swiper样式 */
:deep(.swiper) {
  overflow: visible;
}

:deep(.swiper-wrapper) {
  display: flex;
  align-items: center;
}
</style>
