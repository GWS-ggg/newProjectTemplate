<script setup lang="ts">
import { useGiftStore } from '@/store/modules/giftStore'
import { useLoginStore } from '@/store/modules/loginStore'
import { getPGImg } from '@/utils'
import { FreeMode } from 'swiper/modules'
// 导入Swiper组件和模块
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
// 导入Swiper样式
import 'swiper/css'
import 'swiper/css/free-mode'

// 动态导入图片的函数
function getImageUrl(name: string) {
  return new URL(`../assets/images/GiftScrollBar/${name}`, import.meta.url).href
}

// 使用 Pinia store
const giftStore = useGiftStore()
const { setCurrentGiftId } = useGiftStore()

const currentGiftId = computed(() => {
  return giftStore.currentGiftId
})
function handleSetCurrentGiftId(giftId: number) {
  setCurrentGiftId(giftId)
  console.log(currentGiftId.value)
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
  {
    id: 10,
    image: getImageUrl('icon_3选1.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
  {
    id: 11,
    image: getImageUrl('icon_3选1.png'),
    countdown: { hours: 19, minutes: 20, seconds: 10 },
    tag: null,
  },
])
</script>

<template>
  <div class="relative h-130 w-full flex items-center text-30 text-white -mt-10">
    <img
      src="@/assets/images/GiftScrollBar/img_入口未选择遮盖.png"
      alt=""
      class="absolute left-0 top-0 z-0 h-124 w-full"
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
        v-for="(pkg, index) in giftStore.currentShopListInfo"
        :key="pkg.id"
        class="gift-slide"
      >
        <div class="relative mb-20 flex items-center justify-center">
          <div class="absolute left-0 z-20 z-30 w-full f-c -bottom-19">
            <div class="relative h-30 w-106 f-c border-2 border-[#3e9ebc] rounded-full border-solid bg-[#daecef] text-center text-22 text-[#385673] font-medium">
              <CountDown
                :end-time="pkg.Expire"
                text-class="text-22 text-[#385673]"
              >
                <template #default="{ hours, minutes, seconds }">
                  {{ hours }}:{{ minutes }}:{{ seconds }}
                </template>
                <template #loading>
                  Loading...
                </template>
                <template #finished>
                  Over
                </template>
              </CountDown>
              <img
                v-if="pkg.id !== giftStore.currentGiftId"
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
            :class="{ 'scale-animation': pkg.id === giftStore.currentGiftId }"
            @click="handleSetCurrentGiftId(pkg.id)"
          >
            <!-- 礼包标签 (Hot/Sale) -->
            <!-- <div
              v-if="pkg.tag"
              class="absolute left-0 top-0 z-50 transform rounded-md text-16 text-white font-bold"
            >
              <div class="relative -ml-2 -mt-2">
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
                  class="absolute top-6 z-10 w-full f-c text-16 color-[#f6f0e5] font-medium text-stroke-3 text-stroke-[#88140f] paint-order -left-6 -rotate-45"
                  :class="{ 'text-stroke-[#147f05]!': pkg.tag === 'Hot' }"
                >
                  {{ pkg.tag }}
                </div>
              </div>
            </div> -->

            <!-- 礼包图片容器 -->
            <div class="relative h-full w-full">
              <img
                src="@/assets/images/GiftScrollBar/img_入口_bg_new.png"
                alt=""
                class="absolute left-0 top-0 z-10 h-full w-full"
              >
              <!-- 礼包图片 -->
              <img
                :src="getPGImg(pkg.BannerPic)"
                alt="Gift package"
                class="absolute left-0 top-0 z-20 w-full object-cover object-top"
                style="clip-path: inset(2px);"
              >
              <img
                v-if="pkg.id !== giftStore.currentGiftId"
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
  background-color: #000000;
  opacity: 0.2;
  box-shadow: 1px 0px 1px 0px rgba(170,155,224,0.21);
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
