<script setup lang="ts">
import type { OrderPopupInfo, ProductInfo, ThreeChoiceOneGiftItemInfo } from '@/types'

import { getProductListApi } from '@/api'
import { useEmitBoxClick } from '@/hooks'
import { useAnimatableRefs } from '@/hooks/useButtonRefs'
import { useGiftStore } from '@/store/modules/giftStore'

import { formatPrice, getPGImg } from '@/utils'

import { findImagePath } from '@/utils/imageUtils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['openPopup', 'boxClick'])
const { handleBoxClick } = useEmitBoxClick(emits)
const { t } = useI18n()

const { setRef, triggerAnimation } = useAnimatableRefs()

const activeGiftId = ref(0)
function handleClickGift(giftPackage: ThreeChoiceOneGiftItemInfo) {
  if (activeGiftId.value !== giftPackage.id) {
    activeGiftId.value = giftPackage.id
  }
}
const currentItemInfo = ref<ThreeChoiceOneGiftItemInfo>()
function handlePayGift(giftPackage: ThreeChoiceOneGiftItemInfo) {
  if (activeGiftId.value !== giftPackage.id) {
    activeGiftId.value = giftPackage.id
    return
  }
  currentItemInfo.value = giftPackage

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
  if (!currentItemInfo.value) {
    return
  }
  triggerAnimation(currentItemInfo.value.id)
  currentItemInfo.value.BuyTimes = 1
  setTimeout(() => {
    getProductList()
  }, 1000)
}
defineExpose({
  triggerSuccessAnimation,
  getProductList,
})
const { getProductListRequest } = useGiftStore()

const productInfo = ref<ProductInfo>()
const itemInfoList = ref<ThreeChoiceOneGiftItemInfo[]>([])
async function getProductList() {
  const res = await getProductListRequest(10)
  if (!res) {
    return
  }
  productInfo.value = res.ProductInfo
  itemInfoList.value = res.ItemInfo as ThreeChoiceOneGiftItemInfo[]
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
}
const displayItemInfoList = computed(() => {
  return itemInfoList.value.slice(0, 3)
})
getProductList()
const giftCellBg1Img = computed(() => {
  return findImagePath('gift_cell_bg_1.png', productInfo.value?.Pic)
})
const giftCellBg2Img = computed(() => {
  return findImagePath('gift_cell_bg_2.png', productInfo.value?.Pic)
})
const giftCellBg3Img = computed(() => {
  return findImagePath('gift_cell_bg_3.png', productInfo.value?.Pic)
})
const giftCellBgList = computed(() => {
  return [giftCellBg1Img.value, giftCellBg2Img.value, giftCellBg3Img.value]
})

const bubblePosition = {
  top: '-0.4rem',
  right: '-0.1rem',
  translateX: '50%',
  translateY: '0',
}
const purchasedStatus = computed(() => {
  return itemInfoList.value[0]?.BuyTimes > 0 || itemInfoList.value[1]?.BuyTimes > 0 || itemInfoList.value[2]?.BuyTimes > 0
})
</script>

<template>
  <div class="relative mb-30 f-c flex-col text-29">
    <div class="mt-30 w-600 f-c text-29">
      <TextStroke
        stroke-color="#19093e"
        :stroke-width="3"
      >
        {{ t('only_one_purchase_can_be_made') }}
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
        <img
          :src="giftCellBgList[giftPackage.id]"
          alt=""
          class="w-204"
        >
        <transition name="mask-lock">
          <img
            v-show="giftPackage.id !== activeGiftId"
            class="absolute bottom-300 left-1/2 z-40 w-220 -translate-x-1/2"
            src="@/assets/images/gifts/threeChoiceOne/maskLock.png"
            alt=""
          >
        </transition>
        <transition name="mask-overlay">
          <div
            v-show="giftPackage.id !== activeGiftId"
            class="mask-overlay absolute bottom-20 left-1/2 z-30 w-179 f-c rounded-14 bg-[#000] opacity-23 -translate-x-1/2"
            :class="[
              giftPackage.id === 0 ? 'h-582' : giftPackage.id === 1 ? 'h-643' : 'h-706',
            ]"
          />
        </transition>
        <div
          class="absolute bottom-105 left-0 z-20 w-full flex flex-col items-center justify-start"
          :class="giftPackage.id === 0 ? 'h-505' : giftPackage.id === 1 ? 'h-566' : 'h-612'"
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
                :bottom="-15"
                stroke-color="#464646"
                :stroke-width="3"
                :gift-type="prop.PropType"
                @click="(event: any) => handleBoxClick(prop, event)"
              />
            </div>
          </div>
        </div>
        <div class="absolute bottom-30 left-0 z-30 w-full flex flex-col items-center justify-end">
          <div
            v-show="giftPackage.BuyTimes === 0"
            class="z-50 h-55 w-155"
            @click="handlePayGift(giftPackage)"
          >
            <GreenButton
              :ref="(el: any) => setRef(el, giftPackage.id)"
              radius="0.24rem"
              :score="productInfo?.Props?.[0]?.VipScore"
              score-show
              :single-bubble-position="bubblePosition"
              :mask-show="giftPackage.id !== activeGiftId"
              :purchased="purchasedStatus"
            >
              <div
                v-show="!purchasedStatus"
                class="text-29"
              >
                <TextStroke
                  stroke-color="#164b2e"
                  :stroke-width="2"
                >
                  {{ formatPrice(giftPackage.Price || 0) }}
                </TextStroke>
              </div>

              <div
                v-show="purchasedStatus"
                class="text-33"
              >
                <TextStroke
                  stroke-color="#434343"
                  :stroke-width="3"
                >
                  {{ t('claim') }}
                </TextStroke>
              </div>
            </GreenButton>
          </div>
          <div
            v-show="giftPackage.BuyTimes > 0"
            class="fade-in f-c"
          >
            <img
              class="h-55"
              src="@/assets/images/common/icon_ok.png"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>

    <div class="mt-20 f-c">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        class="text-26"
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
