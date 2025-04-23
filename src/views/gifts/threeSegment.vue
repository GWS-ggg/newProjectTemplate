<script setup lang="ts">
import type { ProductInfo, Prop, ThreeSegmentItemInfo } from '@/types'
import { getProductListApi } from '@/api'
import GreenButton from '@/components/GreenButton.vue'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { animateWithClass, formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { computed, nextTick, ref } from 'vue'

const emits = defineEmits(['boxClick', 'openPopup'])
const itemInfoList = ref<ThreeSegmentItemInfo[]>([])
const productInfo = ref<ProductInfo>()
const bgImgList = ref<string[]>([])
const { handleBuyOrder } = useBuyOrder()
async function getThreeSegmentData() {
  const res = await getProductListApi({
    appid: '616876868660610',
    uid: '102191',
    producttype: 9,
  })
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as ThreeSegmentItemInfo[]
  itemInfoList.value[0].Props[0].PropID = 2030428
  itemInfoList.value[0].Props[0].PropType = 11
  bgImgList.value = [
    getPGImg(productInfo.value?.Pic[0] as string),
    getPGImg(productInfo.value?.Pic[1] as string),
    getPGImg(productInfo.value?.Pic[2] as string),
  ]
  console.log('bgImgList', bgImgList.value)
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
getThreeSegmentData()
const giftCellBg1Img = computed(() => {
  return findImagePath('complete_bg_1.png', productInfo.value?.Pic)
})
const giftCellBg2Img = computed(() => {
  return findImagePath('complete_bg_2.png', productInfo.value?.Pic)
})
const giftCellBg3Img = computed(() => {
  return findImagePath('complete_bg_3.png', productInfo.value?.Pic)
})
const giftCellBgList = computed(() => {
  return [giftCellBg1Img.value, giftCellBg2Img.value, giftCellBg3Img.value]
})

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/threeSegment/${name}`, import.meta.url).href
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
    iconList: [
      { id: 1, iconImg: imgMap.box1Img, desc: '200' },
      { id: 2, iconImg: imgMap.diamondImg, desc: '300' },
      { id: 3, iconImg: imgMap.box2Img, desc: '200' },
    ],
    score: 60,
  },
])
const { setRef, triggerAnimation } = useAnimatableRefs()
const currentGiftId = computed(() => {
  return itemInfoList.value.find(item => item.BuyTimes === 0)?.id
})
async function handlePurchaseButton(item: ThreeSegmentItemInfo) {
  triggerAnimation(item.id)
  const giftElement = document.querySelector(`#gift-${item.id}`)
  console.log(giftElement, 'giftElement')
  item.BuyTimes = 1
  await handleBuyOrder(item.Key || 0, item.TradeProductID || 0, item.SkuID, item.ExchangeID)
  await animateWithClass(giftElement, 'flip-active', 600)
}
function handleBoxClick(prop: Prop, event: MouseEvent) {
  emits('boxClick', prop, event)
}
</script>

<template>
  <div class="mb-30 flex flex-col items-center justify-center text-29">
    <div class="mt-30 text-[#fff] text-stroke-1 text-stroke-[#19093e]">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 text-29 text-stroke-3 text-stroke-[#19093e] paint-order"
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
      v-for="item in itemInfoList"
      :id="`gift-${item.id}`"
      :key="item.id"
      class="relative mt-20 min-h-339 w-710 flex items-center justify-center"
    >
      <div class="w-710">
        <img
          :src="item.BuyTimes === 0 ? imgMap.bg1Img : giftCellBgList[item.id]"
          alt=""
          class="w-full"
        >
      </div>

      <div v-show="item.BuyTimes === 0">
        <div class="absolute left-0 top-35 h-120 w-full">
          <div class="h-full flex items-center justify-center gap-30">
            <template
              v-for="(icon, index) in item.Props"
              :key="index"
            >
              <IconWithText
                :icon-url="getPGImg(icon.Icon)"
                :text="icon.Text"
                :icon-height="120"
                :bottom="-10"
                @click="handleBoxClick(icon, $event)"
              />
            </template>
          </div>
        </div>
        <div
          class="absolute bottom-38 left-1/2 z-30 h-100 w-300 -translate-x-1/2"
          @click="handlePurchaseButton(item)"
        >
          <GreenButton
            :ref="el => setRef(el, item.id)"
            radius="0.36rem"
            :score="productInfo?.Props[0].VipScore"
            score-show
          >
            <div class="relative text-40 text-[#fff] text-stroke-3 text-stroke-[#164b2e] paint-order">
              {{ item.Price ? formatPrice(item.Price) : 'FREE' }}
              <img
                v-if="item.Price === 0 && currentGiftId !== item.id"
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
</style>
