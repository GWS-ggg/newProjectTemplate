<script setup lang="ts">
import type { OrderPopupInfo, ProductInfo, Prop, WheelGiftItemInfo } from '@/types'
import { getProductListApi } from '@/api/index'

import CountDown from '@/components/CountDown.vue'

import GreenButton from '@/components/GreenButton.vue'
import IconWithText from '@/components/IconWithText.vue'

import { useEmitBoxClick } from '@/hooks'
import { useGiftStore } from '@/store/modules/giftStore'
import { formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { computed, ref } from 'vue'

const emits = defineEmits(['openPopup', 'boxClick'])
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/roulette/${name}`, import.meta.url).href
}
const imgMap = {
  bgImg: getImageUrl('背景.jpg'),
  circleImg: getImageUrl('圆形.png'),
  giftBgImg: getImageUrl('img_支付轮盘_奖励_bg.png'),
  giftBorderImg: getImageUrl('方块底外发光.png'),
  diceImg: getImageUrl('202_2.png'),
  coinImg: getImageUrl('付费转盘猪猪代币.png'),
  boxImg: getImageUrl('混合宝箱2.png'),
  giftBgMaskImg: getImageUrl('img_支付轮盘_奖励_蒙版.png'),
  okImg: getImageUrl('icon_勾.png'),
}
interface GiftItem {
  img: string
  id: number
  desc?: string
  isPurchased?: boolean
}
const _giftList: GiftItem[] = [
  {
    img: imgMap.coinImg,
    id: 1,
    desc: '5',

  },
  {
    img: imgMap.coinImg,
    id: 2,
    desc: '5',
    isPurchased: true,
  },
  {
    img: imgMap.coinImg,
    id: 3,
    desc: '10',
    isPurchased: true,
  },
  {
    img: imgMap.coinImg,
    id: 4,
    desc: '10',
  },
  {
    img: imgMap.boxImg,
    id: 5,
  },
  {
    img: imgMap.diceImg,
    id: 6,
    desc: '200',
  },
  {
    img: imgMap.coinImg,
    id: 7,
    desc: '1',
  },
  {
    img: imgMap.diceImg,
    id: 8,
    desc: '3000',

  },
]
const angles = [
  90, // 6点钟方向
  45, // 7点钟方向
  0, // 9点钟方向
  315, // 10点钟方向
  270, // 12点钟方向
  225, // 2点钟方向
  180, // 3点钟方向
  135, // 4点钟方向
]

const wheelGiftList = ref<WheelGiftItemInfo[]>([])
const vipScore = ref(0)
// 当前选中的礼包
const currentGift = computed(() => {
  return wheelGiftList.value.find(item => item.BuyTimes === 0)
})
const currentGiftId = computed(() => {
  return currentGift.value?.id || 0
})
const productInfo = ref<ProductInfo>()
const { getProductListRequest } = useGiftStore()

async function getProductList() {
  const res = await getProductListRequest(3)
  if (!res) {
    return
  }
  vipScore.value = res.ProductInfo?.Props?.[0]?.VipScore as number
  productInfo.value = res.ProductInfo
  wheelGiftList.value = res.ItemInfo as WheelGiftItemInfo[]
  // 添加默认值
  let id = 0
  wheelGiftList.value.forEach((item) => {
    if (!item.BuyTimes) {
      item.BuyTimes = 0
    }
    item.id = id
    id++
  })

  console.log(res)
}

getProductList()
const bgImg = computed(() => {
  return findImagePath('bg.png', productInfo.value?.Pic)
})

const itemBgImg = computed(() => {
  return findImagePath('item_bg.png', productInfo.value?.Pic)
})
const greenButtonRef = ref<InstanceType<typeof GreenButton> | null>(null)
function handleButtonClick() {
  console.log('handleButtonClick')
  const orderPopupInfo: OrderPopupInfo = {
    price: currentGift.value?.Price || 0,
    key: currentGift.value?.Key || 0,
    tradeProductId: currentGift.value?.TradeProductID || 0,
    skuId: currentGift.value?.SkuID,
    exchangeId: currentGift.value?.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
}

function triggerSuccessAnimation() {
  if (currentGift.value) {
    currentGift.value.BuyTimes = 1
  }
  greenButtonRef.value?.triggerAnimation()
}
defineExpose({
  triggerSuccessAnimation,
  getProductList,
})
const { handleBoxClick } = useEmitBoxClick(emits)
</script>

<template>
  <div class="relative mb-30 w-750 f-c -mt-400">
    <!-- <img
      :src="getPGImg(productImgs[0][0])"
      alt=""
      class="w-750"
    > -->
    <img
      :src="bgImg"
      alt=""
      class="w-750"
    >
    <div class="absolute bottom-150 left-1/2 z-10 h-536 w-536 -translate-x-1/2 -translate-y-1/2">
      <div class="relative w-full">
        <img
          :src="imgMap.circleImg"
          alt=""
          class="absolute left-0 top-0 w-full"
        >
      </div>
      <div class="absolute inset-0">
        <!-- 按逆时针排列8个奖励 -->
        <div
          v-for="(gift, index) in wheelGiftList"
          :key="gift.id"
          class="absolute h-156 w-160 -translate-x-1/2 -translate-y-1/2"
          :style="{
            left: `${(268 + 240 * Math.cos(angles[index] * Math.PI / 180)) / 100}rem`,
            top: `${(268 + 240 * Math.sin(angles[index] * Math.PI / 180)) / 100}rem`,
          }"
        >
          <div class="relative h-full w-full flex items-center justify-center">
            <img
              :src="itemBgImg"
              alt=""
              class="absolute inset-0 left-1/2 top-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2"
            >

            <img
              v-show="currentGift?.id === gift.id"
              :src="imgMap.giftBorderImg"
              alt=""
              class="absolute inset-0 h-full w-full"
            >

            <div class="relative z-10 h-full w-full f-c">
              <div class="relative f-c">
                <IconWithText
                  :icon-url="getPGImg(gift?.Props?.[0]?.Icon)"
                  :text="gift?.Props?.[0]?.Text"
                  :text-size="30"
                  :icon-height="75"
                  :bottom="-5"
                  stroke-color="#1d2f3e"
                  :stroke-width="2"
                  :gift-type="gift?.Props?.[0]?.PropType"
                  @click="(event) => handleBoxClick(gift?.Props?.[0] as Prop, event)"
                />
              </div>

              <img
                v-if="gift.BuyTimes"
                :src="imgMap.okImg"
                alt=""
                class="absolute left-1/2 top-1/2 z-30 h-70 -translate-x-1/2 -translate-y-1/2"
              >
              <!-- 蒙版 -->
              <div
                v-if="gift.BuyTimes"
                class="absolute left-1/2 top-1/2 h-120 w-120 rounded-19 bg-black opacity-50 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="currentGiftId <= 7"
      class="absolute bottom-200 left-1/2 z-10 h-96 w-317 cursor-pointer -translate-x-1/2 -translate-y-1/2"
      @click="handleButtonClick"
    >
      <GreenButton
        ref="greenButtonRef"
        :score="vipScore"
        score-show
      >
        <div class="text-40 text-white text-stroke-2 text-stroke-[#164b2e]">
          Dance {{ formatPrice(currentGift?.Price || 0) }}
        </div>
      </GreenButton>
    </div>
    <div
      v-if="currentGiftId <= 7"
      class="absolute bottom-90 left-1/2 z-10 h-96 -translate-x-1/2 -translate-y-1/2"
    >
      <CountDown
        :end-time="productInfo?.ExpireTime"
        class="text-26"
      >
        <template #default="{ hours, minutes, seconds }">
          <TextStroke
            stroke-color="#581616"
            :stroke-width="3"
          >
            END IN {{ hours }}:{{ minutes }}:{{ seconds }}
          </TextStroke>
        </template>
      </CountDown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.spinning {
  animation: spin 4s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(calc(360deg * 5 + 45deg * winningIndex));
  }
}
</style>
