<script setup lang="ts">
import type { DailyLoginItemInfo, OrderPopupInfo, ProductInfo } from '@/types'
import { getProductListApi } from '@/api'
import GreenButton from '@/components/GreenButton.vue'
import IconWithText from '@/components/IconWithText.vue'
import { useEmitBoxClick } from '@/hooks'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { computed, inject, ref } from 'vue'

const emits = defineEmits(['openPopup', 'boxClick'])
const { handleBoxClick } = useEmitBoxClick(emits)

const dailyLoginItemInfo = ref<DailyLoginItemInfo[]>([])
const productInfo = ref<ProductInfo>()
async function getDailyLoginData() {
  const res = await getProductListApi({
    appid: '616876868660610',
    uid: '102191',
    producttype: 6,
  })
  dailyLoginItemInfo.value = res.ItemInfo as DailyLoginItemInfo[]
  productInfo.value = res.ProductInfo as ProductInfo

  if (dailyLoginItemInfo.value[0]?.BuyTimes === undefined) {
    dailyLoginItemInfo.value[0].BuyTimes = 0
  }
  // dailyLoginItemInfo.value[0].Props[2].Icon = 'box/30.png'
  console.log(res, 'res')
}
getDailyLoginData()
const bgImg = computed(() => {
  return findImagePath('Package_bg.png', productInfo.value?.Pic)
})

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/dailyLogin/${name}`, import.meta.url).href
}

const imgMap = {
  bgImg: getImageUrl('底板.png'),
  goldImg: getImageUrl('金币3.png'),
  boxImg: getImageUrl('卡牌宝箱3.png'),
  diamondImg: getImageUrl('钻石2.png'),
  diceImg: getImageUrl('202_2.png'),
  textImg: getImageUrl('头部文字_英语.png'),
  discountImg: getImageUrl('img_礼包标签.png'),
}

interface Gift {
  id: number
  img: string
  price?: string
}

const _giftList = ref<Gift[]>([
  {
    id: 1,
    img: imgMap.goldImg,
    price: '1M',
  },
  {
    id: 2,
    img: imgMap.diceImg,
    price: '15',
  },
  {
    id: 3,
    img: imgMap.diamondImg,
    price: '10',
  },
  {
    id: 4,
    img: imgMap.boxImg,

  },
])
const greenButtonRef = ref<InstanceType<typeof GreenButton> | null>(null)
function handleBtnClick() {
  if (dailyLoginItemInfo.value[0]?.BuyTimes === 1) {
    return
  }
  const orderPopupInfo: OrderPopupInfo = {
    price: dailyLoginItemInfo.value[0]?.Price || 0,
    key: dailyLoginItemInfo.value[0]?.Key || 0,
    tradeProductId: dailyLoginItemInfo.value[0]?.TradeProductID || 0,
    skuId: dailyLoginItemInfo.value[0]?.SkuID,
    exchangeId: dailyLoginItemInfo.value[0]?.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
  console.log(greenButtonRef.value, 'greenButtonRef')
}

function triggerSuccessAnimation() {
  greenButtonRef.value?.triggerAnimation()
  dailyLoginItemInfo.value[0].BuyTimes = 1
}
defineExpose({
  triggerSuccessAnimation,
})

const bubblePosition = {
  top: '-0.2rem',
  right: '-0.22rem',
  translateX: '50%',
  translateY: '0',
}
</script>

<template>
  <div class="relative mb-70 min-h-800 w-full f-c flex-col -mt-100">
    <!-- https://piggygo-static-jy.forevernine.com/cdn/officialpay/discount/10/Package_bg.png -->

    <img
      :src="bgImg"
      alt=""
      class="h-1140"
    >

    <div class="absolute bottom-50 left-1/2 f-c rounded-20 text-24 -translate-x-1/2">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 py-10 text-26 text-white text-stroke-3 paint-order text-stroke-[#581616]"
      >
        <template #default="{ hours, minutes, seconds }">
          Ends in {{ hours }}:{{ minutes }}:{{ seconds }}
        </template>
      </CountDown>
    </div>
    <div class="absolute right-70 top-1/2 h-138 w-137 translate-y-10">
      <div class="relative h-full w-full f-c flex-col">
        <img
          :src="imgMap.discountImg"
          alt=""
          class="absolute left-0 top-0 h-full w-full"
        >
        <div class="ml-15 mt-10 flex flex-col rotate-[15deg] items-center justify-center text-43 text-white text-stroke-4 text-stroke-[#ad145b] paint-order">
          <div>
            {{ dailyLoginItemInfo[0]?.Addition }}%
          </div>
          <div class="-mt-10">
            OFF
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="absolute left-1/2 top-60 f-c -translate-x-1/2">
      <img
        :src="imgMap.textImg"
        alt=""
      >
    </div> -->
    <div class="absolute left-1/2 top-240 h-46 w-356 f-c rounded-20 bg-[#000000] bg-opacity-24 text-30 text-stroke-3 text-stroke-[#0a273d] paint-order -translate-x-1/2">
      Only one chance
    </div>
    <div class="absolute bottom-300 left-1/2 h-126 w-590 flex items-center justify-center -translate-x-1/2">
      <div class="h-97 w-520 flex items-center justify-evenly gap-10">
        <div
          v-for="(gift, index) in dailyLoginItemInfo[0]?.Props"
          :key="index"
          class="relative h-full flex items-center"
        >
          <IconWithText
            :icon-url="getPGImg(gift.Icon)"
            :text="gift.Text"
            :text-size="42"
            :icon-height="90"
            :bottom="-10"
            text-class="text-stroke-3 text-stroke-[#4d1202] paint-order"
            @click="(event) => handleBoxClick(gift, event)"
          />
          <!-- <img
            :src="getPGImg(gift.Icon)"
            alt=""
            class="h-full"
          >
          <div
            v-if="gift.Text"
            class="text-42 text-white text-stroke-3 text-stroke-[#4d1202] paint-order -mt-40"
          >
            {{ gift.Text }}
          </div> -->
        </div>
      </div>
    </div>
    <div class="absolute bottom-200 left-1/2 h-126 w-590 f-c -translate-x-1/2">
      <div class="relative h-97 flex items-center justify-center gap-15 text-48 color-[#fff0de] text-stroke-3 text-stroke-[#4d1202] paint-order">
        {{ formatPrice(dailyLoginItemInfo[0]?.Price || 0) }}
        <!-- <div class="absolute bottom-1/2 translate-y-1/2 text-30 text-white color-[#fbcaa7] text-stroke-3 text-stroke-[#4d1202] paint-order -right-120">
          <span class="relative">
            $15.00
            <span class="absolute left-0 top-1/2 h-3 w-full rotate-[-5deg] bg-[#f30404] -translate-y-1/2" />
          </span>
        </div> -->
      </div>
    </div>
    <div class="absolute bottom-135 left-1/2 h-96 w-317 f-c -translate-x-1/2">
      <div
        v-show="dailyLoginItemInfo[0]?.BuyTimes === 0"
        class="h-96 w-317"
        @click="handleBtnClick"
      >
        <GreenButton
          ref="greenButtonRef"
          radius="0.24rem"
          :score="productInfo?.Props[0].VipScore"
          score-show
          :single-bubble-position="bubblePosition"
        >
          <div class="relative text-50">
            <!-- 底层：只有阴影的文字 -->
            <div
              class="absolute inset-0"
              style="text-shadow: 0px 0.03rem 0px #bcfb6b; color: transparent;"
            >
              Buy now
            </div>

            <!-- 顶层：只有渐变的文字 -->
            <div class="gradient-text-with-shadow relative">
              Buy now
            </div>
          </div>
        </GreenButton>
      </div>
      <div
        v-show="dailyLoginItemInfo[0]?.BuyTimes && dailyLoginItemInfo[0]?.BuyTimes > 0"
        class="fade-in f-c"
      >
        <img
          class="h-96"
          src="@/assets/images/common/icon_ok.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text-with-shadow {
  /* 渐变背景 */
  background: #2a561a;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

}

.test {
  background-image: linear-gradient(0deg,
      #e4ec5b 0%,
      #ace81d 99%),
    linear-gradient(#66af0f,
      #66af0f);
  background-blend-mode: normal,
    normal;
  box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(0deg,
      #1d6301 0%,
      #5f9f26 100%);
  border-image-slice: 1;
}

.btn-bg-small {
  position: relative;
  background-image: linear-gradient(0deg, #52c011 0%, #ace81d 99%), linear-gradient(#66af0f, #66af0f);
  background-blend-mode: normal, normal;
  border-radius: 32px;
  box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
}

.btn-bg-small::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(0deg, #1d6301 0%, #5f9f26 100%);
  border-radius: 34px; /* 略大于按钮的圆角 */
  z-index: -1;
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
