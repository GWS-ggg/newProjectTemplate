<script setup lang="ts">
import type { DailyLoginItemInfo, OrderPopupInfo, ProductInfo } from '@/types'
import { getProductListApi } from '@/api'
import GreenButton from '@/components/GreenButton.vue'
import IconWithText from '@/components/IconWithText.vue'
import { useEmitBoxClick } from '@/hooks'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { useGiftStore } from '@/store/modules/giftStore'
import { formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { Toast } from '@/utils/toast'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['openPopup', 'boxClick'])
const { handleBoxClick } = useEmitBoxClick(emits)
const { getProductListRequest } = useGiftStore()
const { t } = useI18n()
const dailyLoginItemInfo = ref<DailyLoginItemInfo[]>([])
const productInfo = ref<ProductInfo>()
async function getProductList() {
  Toast.loading()
  try {
    const res = await getProductListRequest(6)
    if (!res) {
      return
    }
    dailyLoginItemInfo.value = res.ItemInfo as DailyLoginItemInfo[]
    productInfo.value = res.ProductInfo as ProductInfo

    if (dailyLoginItemInfo.value[0]?.BuyTimes === undefined) {
      dailyLoginItemInfo.value[0].BuyTimes = 0
    }
    // dailyLoginItemInfo.value[0].Props[2].Icon = 'box/30.png'
    console.log(res, 'res')
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
const bgImg = computed(() => {
  return findImagePath('Package_bg.png', productInfo.value?.Pic)
})

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/dailyLogin/${name}`, import.meta.url).href
}

const imgMap = {
  discountImg: getImageUrl('img_礼包标签.png'),
  maskImg: getImageUrl('img_每日登录标签叠加资源.png'),
}

const greenButtonRef = ref<InstanceType<typeof GreenButton> | null>(null)
function handleBtnClick() {
  if (dailyLoginItemInfo.value[0]?.BuyTimes > 0) {
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
  getProductList,
})

const bubblePosition = {
  top: '-0.2rem',
  right: '-0.22rem',
  translateX: '50%',
  translateY: '0',
}
</script>

<template>
  <div class="relative mb-70 min-h-800 w-full f-c flex-col -mt-130">
    <!-- https://piggygo-static-jy.forevernine.com/cdn/officialpay/discount/10/Package_bg.png -->

    <img
      :src="bgImg"
      alt=""
      class="h-1140"
    >

    <div class="absolute bottom-50 left-1/2 f-c rounded-20 text-24 -translate-x-1/2">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 py-10 text-26 text-white "
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
    <div class="absolute right-70 top-1/2 h-138 w-137 translate-y-10">
      <div class="relative h-full w-full f-c flex-col">
        <img
          :src="imgMap.discountImg"
          alt=""
          class="absolute left-0 top-0 h-full w-full"
        >
        <img
          :src="imgMap.maskImg"
          class="absolute left-0 top-0 h-full w-full"
          alt=""
        >
        <div class="ml-15 mt-10 flex flex-col rotate-[15deg] items-center justify-center text-43 text-white">
          <div>
            <TextStroke
              stroke-color="#ad145b"
              :stroke-width="4"
            >
              {{ dailyLoginItemInfo[0]?.Addition }}%
            </TextStroke>
          </div>
          <div class="-mt-10">
            <TextStroke
              stroke-color="#ad145b"
              :stroke-width="4"
            >
              OFF
            </TextStroke>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute left-1/2 top-240 h-46 w-356 f-c rounded-20 bg-[#000000] bg-opacity-24 text-30 -translate-x-1/2">
      <TextStroke
        stroke-color="#0a273d"
        :stroke-width="3"
      >
        {{ t('only_one_chance') }}
      </TextStroke>
    </div>
    <div class="absolute bottom-300 left-1/2 h-126 w-590 flex items-center justify-center -translate-x-1/2">
      <div class="h-97 w-520 flex items-center justify-center gap-40">
        <div
          v-for="(gift, index) in dailyLoginItemInfo[0]?.Props"
          :key="index"
          class="relative h-full flex items-center"
        >
          <IconWithText
            :icon-url="getPGImg(gift.Icon)"
            :text="gift.Text"
            :text-size="36"
            :icon-height="90"
            :bottom="-10"
            text-class="text-stroke-3 text-stroke-[#4d1202] paint-order"
            :gift-type="gift.PropType"
            @click="(event) => handleBoxClick(gift, event)"
          />
        </div>
      </div>
    </div>
    <div class="absolute bottom-200 left-1/2 h-126 w-590 f-c -translate-x-1/2">
      <div class="relative h-97 flex items-center justify-center gap-15 text-48 color-[#fff0de]">
        <TextStroke
          stroke-color="#4d1202"
          :stroke-width="3"
        >
          {{ formatPrice(dailyLoginItemInfo[0]?.Price || 0) }}
        </TextStroke>
      </div>
    </div>
    <div class="absolute bottom-135 left-1/2 h-96 w-317 f-c -translate-x-1/2">
      <div
        class="h-96 w-317"
        @click="handleBtnClick"
      >
        <GreenButton
          ref="greenButtonRef"
          radius="0.24rem"
          :score="productInfo?.Props[0].VipScore"
          score-show
          :single-bubble-position="bubblePosition"
          :purchased="dailyLoginItemInfo[0]?.BuyTimes > 0 "
        >
          <div
            v-if="dailyLoginItemInfo[0]?.BuyTimes === 0"
            class="relative text-50"
          >
            <!-- 底层：只有阴影的文字 -->
            <div

              class="absolute inset-0"
              style="text-shadow: 0px 0.03rem 0px #bcfb6b; color: transparent;"
            >
              {{ t('buy_now') }}
            </div>
            <!-- 顶层：只有渐变的文字 -->
            <div class="gradient-text-with-shadow relative">
              {{ t('buy_now') }}
            </div>
          </div>
          <div
            v-if="dailyLoginItemInfo[0]?.BuyTimes > 0"
            class="text-50"
          >
            {{ t('claim') }}
          </div>
        </GreenButton>
      </div>
      <!-- <div
        v-show="dailyLoginItemInfo[0]?.BuyTimes && dailyLoginItemInfo[0]?.BuyTimes > 0"
        class="fade-in f-c"
      >
        <img
          class="h-96"
          src="@/assets/images/common/icon_ok.png"
          alt=""
        >
      </div> -->
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
