<script setup lang="ts">
import type { OrderPopupInfo, ProductInfo, Prop, ThreeSegmentItemInfo } from '@/types'
import { getProductListApi } from '@/api'
import GreenButton from '@/components/GreenButton.vue'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { useGiftStore } from '@/store/modules/giftStore'
import { animateWithClass, formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { Toast } from '@/utils/toast'
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['boxClick', 'openPopup'])
const { t } = useI18n()
const itemInfoList = ref<ThreeSegmentItemInfo[]>([])
const productInfo = ref<ProductInfo>()
const { getProductListRequest } = useGiftStore()

async function getProductList() {
  Toast.loading()
  try {
    const res = await getProductListRequest(9)
    if (!res) {
      return
    }
    productInfo.value = res.ProductInfo
    itemInfoList.value = res.ItemInfo as ThreeSegmentItemInfo[]
    // itemInfoList.value[0].BuyTimes = 0
    // itemInfoList.value[1].BuyTimes = 0
    // itemInfoList.value[0].Props[0].PropType = 11
    // itemInfoList.value[0].Props[0].PropID = 2030428
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
    Toast.close()
  }
  catch (error) {
    console.error(error)
  }
  finally {
    Toast.close()
  }
}
getProductList()
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
  bgFreeImg: getImageUrl('bg_yellow.png'),
  bgClaimImg: getImageUrl('bg_red.png'),
}

const { setRef, triggerAnimation } = useAnimatableRefs()
const currentGiftId = computed(() => {
  return itemInfoList.value.find(item => item.BuyTimes === 0)?.id
})
const currentItem = ref<ThreeSegmentItemInfo>()
async function triggerSuccessAnimation() {
  triggerAnimation(currentItem.value?.id || 0)
  const giftElement = document.querySelector(`#gift-${currentItem.value?.id}`)
  console.log(giftElement, 'giftElement')
  if (currentItem.value) {
    currentItem.value.BuyTimes = 1
    animateWithClass(giftElement, 'flip-active', 600)
  }
}
function handleBoxClick(prop: Prop, event: MouseEvent) {
  emits('boxClick', prop, event)
}

// 检查前面的礼包是不是已经购买了
function checkPreviousGift(giftInfo: ThreeSegmentItemInfo) {
  const index = itemInfoList.value.findIndex(item => item.id === giftInfo.id)
  console.log(itemInfoList.value.slice(0, index).every(item => item.BuyTimes !== 0), 'checkPreviousGift')
  return itemInfoList.value.slice(0, index).every(item => item.BuyTimes !== 0)
}

function handleBtnClick(item: ThreeSegmentItemInfo) {
  // 前面的礼包都购买了
  if (!checkPreviousGift(item)) {
    return
  }

  currentItem.value = item
  const orderPopupInfo: OrderPopupInfo = {
    price: item.Price || 0,
    key: item.Key || 0,
    tradeProductId: item.TradeProductID || 0,
    skuId: item.SkuID,
    exchangeId: item.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
}

defineExpose({
  triggerSuccessAnimation,
  getProductList,
})
</script>

<template>
  <div class="mb-30 flex flex-col items-center justify-center text-29">
    <div class="mt-30 text-[#fff]">
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
    <div class="mt-24 w-600 f-c text-24">
      <TextStroke
        stroke-color="#682c2e"
        :stroke-width="3"
        text-color="#fef29f"
      >
        {{ t('take_each_deal_take_each_deal') }}
      </TextStroke>
    </div>
    <div
      v-for="item in itemInfoList"
      :id="`gift-${item.id}`"
      :key="item.id"
      class="relative mt-20 min-h-339 w-710 flex items-center justify-center"
    >
      <div class="w-710">
        <img
          :src="item.BuyTimes === 0 ? item.Price === 0 ? imgMap.bgFreeImg : imgMap.bgClaimImg : giftCellBgList[item.id]"
          alt=""
          class="w-full"
        >
      </div>

      <div v-show="item.BuyTimes === 0">
        <div class="absolute left-1/2 top-35 h-120 w-[90%] -translate-x-1/2">
          <div class="h-full w-full flex items-center justify-center gap-40">
            <template
              v-for="(icon, index) in item.Props"
              :key="index"
            >
              <IconWithText
                :icon-url="getPGImg(icon.Icon)"
                :text="icon.Text"
                :icon-height="120"
                :bottom="-10"
                :text-size="36"
                :gift-type="icon.PropType"
                @click="handleBoxClick(icon, $event)"
              />
            </template>
          </div>
        </div>
        <div
          class="absolute bottom-38 left-1/2 z-30 h-100 w-300 -translate-x-1/2"
          @click="handleBtnClick(item)"
        >
          <GreenButton
            :ref="el => setRef(el, item.id)"
            radius="0.36rem"
            :score="productInfo?.Props[0].VipScore"
            score-show
          >
            <div class="relative text-40 text-[#fff]">
              <TextStroke
                stroke-color="#164b2e"
                :stroke-width="3"
                text-color="#fff"
              >
                {{ item.Price ? formatPrice(item.Price) : t('free') }}
              </TextStroke>
              <img
                v-if="item.Price === 0 && currentGiftId !== item.id"
                src="@/assets/images/common/lock.png"
                alt=""
                class="absolute top-0 h-42 -right-40"
              >
            </div>
          </GreenButton>
        </div>
        <div class="absolute bottom-60 left-50 f-c flex-col">
          <div class="text-20 text-[#fff]">
            <TextStroke
              stroke-color="#5d2f0a"
              :stroke-width="1"
              text-color="#fff"
            >
              1/1
            </TextStroke>
          </div>
          <div class="text-18 text-[#fddfb0]">
            <TextStroke
              stroke-color="#5d2f0a"
              :stroke-width="1"
              text-color="#fddfb0"
            >
              {{ t('available') }}
            </TextStroke>
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
