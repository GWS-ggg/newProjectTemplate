<script setup lang="ts">
import type { OrderPopupInfo, ProductInfo, ThreeChoiceOneGiftItemInfo } from '@/types'

import { getProductListApi } from '@/api'
import { useEmitBoxClick } from '@/hooks'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'

import { useBuyOrder } from '@/hooks/useBuyOrder'

import { useGiftStore } from '@/store/modules/giftStore'

import { formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'

import { computed, onMounted, reactive, ref, watch } from 'vue'

// function getImageUrl(name: string) {
//   return new URL(`../../assets/images/gifts/newThreeChoiceOne/${name}`, import.meta.url).href
// }
// const lockImg = getImageUrl('三选一礼包_0005_suo-拷贝-3.png')
// const imgMap = {
//   bg1Img: getImageUrl('1 copy 2.png'),
//   bg2Img: getImageUrl('2 copy 2.png'),
//   bg3Img: getImageUrl('3 copy 2.png'),
//   gift1Icon1Img: getImageUrl('体力3.png'),
//   gift1Icon2Img: getImageUrl('药水魔力瓶.png'),
//   gift1Icon3Img: getImageUrl('钻石1.png'),
//   gift2Icon1Img: getImageUrl('体力3.png'),
//   gift2Icon2Img: getImageUrl('卡牌宝箱33.png'),
//   gift2Icon3Img: getImageUrl('Bet-Blast-低级-礼包活动icon.png'),
//   gift3Icon1Img: getImageUrl('体力3.png'),
//   gift3Icon2Img: getImageUrl('魔法宝箱.png'),
//   gift3Icon3Img: getImageUrl('天降buff-礼包活动icon.png'),
//   gift3Icon4Img: getImageUrl('卡牌收益buff-礼包活动icon.png'),
//   btnImg: getImageUrl('btn_三选一礼包按钮.png'),
//   btnSmallImg: getImageUrl('按钮.png'),
//   maskImg: getImageUrl('上锁半透明蒙版.png'),
//   lockImg: getImageUrl('三选一礼包_0005_suo-拷贝-3.png'),
//   mask1Img: getImageUrl('img_三选一1.png'),
//   mask2Img: getImageUrl('img_三选一2.png'),
//   mask3Img: getImageUrl('img_三选一3.png'),
// }
// const _imgList = [
//   imgMap.bg1Img,
//   imgMap.bg2Img,
//   imgMap.bg3Img,
// ]
const emits = defineEmits(['openPopup', 'boxClick'])

// 接口保留但因暂未使用而注释
interface _Gift {
  id: number
  iconImg: string
  title?: string
}
const productInfo = ref<ProductInfo>()
const itemInfoList = ref<ThreeChoiceOneGiftItemInfo[]>([])

const { setRef, triggerAnimation } = useAnimatableRefs()

const activeGiftId = ref(0)
const currentItemInfo = ref<ThreeChoiceOneGiftItemInfo>()
function handleClickGift(giftPackage: ThreeChoiceOneGiftItemInfo) {
  if (activeGiftId.value !== giftPackage.id) {
    activeGiftId.value = giftPackage.id
    return
  }
  activeGiftId.value = giftPackage.id
}
async function handleClickBuySingle(giftPackage: ThreeChoiceOneGiftItemInfo) {
  if (giftPackage.BuyTimes === 1) {
    return
  }
  if (activeGiftId.value !== giftPackage.id) {
    activeGiftId.value = giftPackage.id
    return
  }
  currentItemInfo.value = giftPackage
  handleBuyOrder(giftPackage)
}
async function handleClickBuyAll(giftPackage: ThreeChoiceOneGiftItemInfo) {
  if (giftPackage.BuyTimes === 1) {
    return
  }
  currentItemInfo.value = giftPackage
  handleBuyOrder(giftPackage)
}
function handleBuyOrder(giftPackage: ThreeChoiceOneGiftItemInfo) {
  const orderPopupInfo: OrderPopupInfo = {
    price: giftPackage.Price || 0,
    key: giftPackage.Key || 0,
    tradeProductId: giftPackage.TradeProductID || 0,
    skuId: giftPackage.SkuID,
    exchangeId: giftPackage.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
}

function triggerSuccessAnimation() {
  console.log(currentItemInfo.value, 'currentItemInfo.value')
  if (!currentItemInfo.value) {
    return
  }
  console.log(currentItemInfo.value, 'currentItemInfo.value')
  triggerAnimation(currentItemInfo.value.id)
  currentItemInfo.value.BuyTimes = 1
  if (currentItemInfo.value.id === 3) {
    itemInfoList.value.forEach((item) => {
      item.BuyTimes = 1
    })
  }
}
defineExpose({
  triggerSuccessAnimation,
})

const displayItemInfoList = computed(() => {
  return itemInfoList.value.slice(0, 3)
})
const bubblePosition = {
  top: '-0.4rem',
  right: '-0.1rem',
  translateX: '50%',
  translateY: '0',
}
// const _maskList = ref<string[]>([
//   imgMap.mask1Img,
//   imgMap.mask2Img,
//   imgMap.mask3Img,
// ])
// 存储图片原始尺寸
const imageSizes = reactive<Record<string, { width: number, height: number }>>({})

// 根据设计图基准宽度计算缩放比例
const baseWidth = 750 // 设计图基准宽度
const windowWidth = ref(window.innerWidth)
// 响应式更新窗口宽度
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 750) {
      windowWidth.value = 750
    }
    else {
      windowWidth.value = window.innerWidth
    }
  })
})

// 计算当前缩放比例
const scale = computed(() => {
  if (windowWidth.value > 750) {
    return 1
  }
  return windowWidth.value / baseWidth
})

// 图片加载完成后的处理函数
function onImageLoad(event: Event, img: string): void {
  const imgElement = event.target as HTMLImageElement
  // 获取并存储图片原始尺寸
  imageSizes[img] = {
    width: imgElement.naturalWidth,
    height: imgElement.naturalHeight,
  }
  console.log(`图片 ${img} 加载完成，原始尺寸: ${imageSizes[img].width}x${imageSizes[img].height}`)
}

// 计算图片缩放后的样式
function getScaledImageStyle(img: string): any {
  if (!imageSizes[img]) {
    return {}
  }

  const originalWidth = imageSizes[img].width
  const originalHeight = imageSizes[img].height

  // 使用计算出的缩放比例
  const scaledWidth = originalWidth * scale.value
  const scaledHeight = originalHeight * scale.value

  // 转换为rem单位
  return {
    width: pxToRem(scaledWidth),
    height: pxToRem(scaledHeight),
  }
}

// 强制触发图片尺寸更新的计数器
const updateCounter = ref(0)
// 当窗口大小变化时，强制更新图片尺寸
watch(scale, () => {
  updateCounter.value++
})

function pxToRem(px: number): string {
  return `${px / getRootFontSize()}rem`
}
function getRootFontSize(): number {
  return Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
}
const bgImg1 = computed(() => {
  console.log(productInfo.value?.Pic, 'productInfo.value?.Pic')
  return findImagePath('gift_cell_bg_1.png', productInfo.value?.Pic)
})
const bgImg2 = computed(() => {
  return findImagePath('gift_cell_bg_2.png', productInfo.value?.Pic)
})
const bgImg3 = computed(() => {
  return findImagePath('gift_cell_bg_3.png', productInfo.value?.Pic)
})
// 将 bgImgList 从 ref 改为 computed
const bgImgList = computed(() => {
  const list = [
    bgImg1.value,
    bgImg2.value,
    bgImg3.value,
  ]

  return list
})
const { getProductListRequest } = useGiftStore()

// 数据加载函数
async function getProductList() {
  const res = await getProductListRequest(5)
  productInfo.value = res.ProductInfo
  console.log(productInfo.value?.Pic, 'productInfo.value?.Pic')
  itemInfoList.value = res.ItemInfo as ThreeChoiceOneGiftItemInfo[]

  // test
  // itemInfoList.value[0].Props[0].Text = '20000'
  // itemInfoList.value[1].Props[0].Text = '20000'
  // itemInfoList.value[0].Props[1] = itemInfoList.value[0].Props[0]
  // itemInfoList.value[0].Props[2] = itemInfoList.value[0].Props[0]
  // itemInfoList.value[0].Props[3] = itemInfoList.value[0].Props[0]

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

  // 当数据加载完成后，输出bgImgList的值，用于调试
  console.log('数据加载完成后的bgImgList:', bgImgList.value)
}
const { handleBoxClick } = useEmitBoxClick(emits)
// 调用获取数据的函数
getProductList()
</script>

<template>
  <div class="relative mb-30 f-c flex-col text-29">
    <div class="mt-30 text-29">
      <TextStroke
        stroke-color="#19093e"
        :stroke-width="3"
      >
        Only one purchase can be made !
      </TextStroke>
    </div>
    <div class="min-h-789 w-700 flex items-end justify-center">
      <div
        v-for="giftPackage in displayItemInfoList"
        :key="giftPackage.id"
        class="relative w-233 flex items-center justify-center"
        :class="giftPackage.id ? `z-${giftPackage.id}` : 'z-20'"
        @click="handleClickGift(giftPackage)"
      >
        <div class="flex">
          <img
            :src="bgImgList[giftPackage.id]"
            alt=""
            :style="getScaledImageStyle(bgImgList[giftPackage.id])"
            @load="onImageLoad($event, bgImgList[giftPackage.id])"
          >
        </div>

        <transition name="mask-lock">
          <img
            v-show="giftPackage.id !== activeGiftId"
            class="absolute bottom-300 left-1/2 z-40 w-185 -translate-x-1/2"
            src="@/assets/images/gifts/newThreeChoiceOne/lock.png"
            alt=""
          >
        </transition>
        <transition name="mask-overlay">
          <!-- <div
            v-show="giftPackage.id !== activeGiftId"
            class="mask-overlay absolute bottom-0 left-1/2 z-30 w-174 rounded-14 -translate-x-1/2"
          >
            <img
              :src="maskList[giftPackage.id]"
              alt=""
              class="ml-4 w-174 -mb-8"
            >
          </div> -->

          <div
            v-show="giftPackage.id !== activeGiftId"
            class="mask-overlay absolute bottom-16 left-1/2 z-30 w-160 f-c rounded-14 bg-[#000] opacity-23 -translate-x-1/2"
            :class="[
              giftPackage.id === 0 ? 'h-492' : giftPackage.id === 1 ? 'h-538' : 'h-589',
            ]"
          />
        </transition>
        <div
          class="absolute bottom-105 left-1/2 z-20 w-170 flex flex-col items-center justify-end -translate-x-1/2"
          :class="giftPackage.id === 0 ? 'h-400' : giftPackage.id === 1 ? 'h-450' : 'h-500'"
        >
          <div class="flex flex-1 flex-col items-center justify-evenly gap-20">
            <div
              v-for="(prop, index) in giftPackage.Props"
              :key="index"
              class="flex flex-col items-center justify-center"
            >
              <IconWithText
                :icon-url="getPGImg(prop.Icon)"
                :text="prop.Text"
                :text-size="31"
                :icon-height="90"
                :bottom="-10"
                stroke-color="#464646"
                :stroke-width="2"
                :gift-type="prop.PropType"
                @click="(event: any) => handleBoxClick(prop, event)"
              />

              <!-- <img
                class="h-90"
                :src="getPGImg(prop.Icon)"
                alt=""
                @click="(event) => handleBoxClick(prop, event)"
              >
              <div class="text-31 text-stroke-2 text-stroke-[#464646] paint-order -mt-15">
                {{ prop.Text }}
              </div> -->
            </div>
          </div>
        </div>
        <div class="absolute bottom-30 left-0 z-30 w-full flex flex-col items-center justify-end">
          <div
            v-show="giftPackage.BuyTimes === 0"
            class="z-50 h-55 w-135"
          >
            <GreenButton
              :ref="(el: any) => setRef(el, giftPackage.id)"
              radius="0.24rem"
              :score="productInfo?.Props?.[0]?.VipScore"
              score-show
              :single-bubble-position="bubblePosition"
              :mask-show="giftPackage.id !== activeGiftId"
              @click="handleClickBuySingle(giftPackage)"
            >
              <div class="text-29">
                <TextStroke
                  stroke-color="#164b2e"
                  :stroke-width="2"
                >
                  {{ formatPrice(giftPackage.Price || 0) }}
                </TextStroke>
              </div>
            </GreenButton>
          </div>
          <div
            v-show="giftPackage.BuyTimes && giftPackage.BuyTimes > 0"
            class="fade-in f-c"
          >
            <img
              class="h-59"
              src="@/assets/images/common/icon_ok.png"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="z-10 mt-20 h-90 w-400"
      @click="handleClickBuyAll(itemInfoList[3])"
    >
      <div
        v-show="itemInfoList[3]?.BuyTimes === 0"
        class="h-full w-full"
      >
        <GreenButton
          :ref="(el: any) => setRef(el, 3)"
          radius="0.32rem"
          :score="productInfo?.Props?.[0]?.VipScore"
          score-show
        >
          <div class="text-33">
            <TextStroke
              stroke-color="#164b2e"
              :stroke-width="3"
            >
              BUY ALL{{ formatPrice(itemInfoList[3]?.Price || 0) }}
            </TextStroke>
          </div>
        </GreenButton>
      </div>
      <div
        v-show="itemInfoList[3]?.BuyTimes && itemInfoList[3]?.BuyTimes > 0"
        class="fade-in h-full f-c"
      >
        <img
          class="h-full"
          src="@/assets/images/common/icon_ok.png"
          alt=""
        >
      </div>
    </div>

    <div class="mt-20 f-c">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        class="text-26 text-[#f1e49e]"
      >
        <template #default="{ hours, minutes, seconds }">
          End in {{ hours }}:{{ minutes }}:{{ seconds }}
        </template>
      </CountDown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-bg {

    background-image: linear-gradient(0deg,
        #5acd16 0%,
        #ace81d 99%),
      linear-gradient(#66af0f,
        #66af0f);
    background-blend-mode: normal,
      normal;
    box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(0deg,
        #1d6301 0%,
        #5f9f26 100%);
    border-radius: 18px;

}

.btn-bg-small {
  background-image: -moz-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  background-image: -webkit-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  background-image: -ms-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  box-shadow: 0px 2px 0.73px 0.27px rgba(25, 25, 25, 0.36);
  border-radius: 20px;
  border: 1px solid #3E8114;
}

/* 蒙版遮罩动画 */
.mask-overlay {

  transition: all 0.3s ease;
}

.mask-overlay-enter-active,
.mask-overlay-leave-active {
  transition: all 0.3s ease;
}

.mask-overlay-enter-from,
.mask-overlay-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* 锁图标动画 */
.mask-lock-enter-active,
.mask-lock-leave-active {
  transition: all 0.35s ease;
}

.mask-lock-enter-from,
.mask-lock-leave-to {
  opacity: 0;
  transform: translate(-50%, 0) scale(0.8);
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
</style>
