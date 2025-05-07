<script setup lang="ts">
import type { ItemInfo, OrderPopupInfo, ProductInfo, Prop } from '@/types'
import { buyOrderApi, getProductListApi } from '@/api/index'

import GreenButton from '@/components/GreenButton.vue'

import { useEmitBoxClick } from '@/hooks'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { useGiftStore } from '@/store/modules/giftStore'
import { useLoginStore } from '@/store/modules/loginStore'
import { formatPrice, getPGImg } from '@/utils'
import { findImagePath } from '@/utils/imageUtils'
import { Toast } from '@/utils/toast'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['openPopup', 'boxClick'])

const { t } = useI18n()

const { handleBoxClick } = useEmitBoxClick(emits)
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/stepGift/${name}`, import.meta.url).href
}
const productInfo = ref<ProductInfo>()
const itemInfoList = ref<ItemInfo[]>([])
const { getProductListRequest } = useGiftStore()
async function getProductList() {
  Toast.loading()
  try {
    const res = await getProductListRequest(1)
    if (!res) {
      return
    }
    productInfo.value = res.ProductInfo
    itemInfoList.value = res.ItemInfo as ItemInfo[]

    let idNum = 0
    itemInfoList.value.forEach((item) => {
      item.id = idNum++
    })
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
  return findImagePath('bg.png', productInfo.value?.Pic)
})
const redBarImg = computed(() => {
  return findImagePath('red_bar.png', productInfo.value?.Pic)
})

const imgMap: Record<string, string> = {
  textImg: getImageUrl('文字横条.png'),
  tagImg: getImageUrl('新标签.png'),
  bgImg2: getImageUrl('img_付费副阶梯标签叠加资源.png'),
  taskBarImg: getImageUrl('img_付费副阶梯_任务条.png'),
  processBgImg: getImageUrl('img_付费副阶梯_进度条_bg.png'),
  processImg: getImageUrl('img_付费副阶梯_进度条.png'),
  taskOkBgImg: getImageUrl('img_付费副阶梯_任务条_黄.png'),
}

const greenButtonRef = ref<InstanceType<typeof GreenButton> | null>(null)
const isBuy = ref(false)
const isAnimation = ref(false)
async function handleBtnClick() {
  if (isAnimation.value)
    return
  const orderPopupInfo: OrderPopupInfo = {
    price: productInfo.value?.Price || 0,
    key: productInfo.value?.Key || 0,
    tradeProductId: productInfo.value?.TradeProductID || 0,
    skuId: productInfo.value?.SkuID,
    exchangeId: productInfo.value?.ExchangeID,
  }
  emits('openPopup', orderPopupInfo)
}

function triggerSuccessAnimation() {
  isAnimation.value = true
  const goodsListTemp = [...itemInfoList.value]
  console.log(itemInfoList.value, 'itemInfoList')
  // 如果列表不为空，将第一个元素移动到最后
  if (goodsListTemp.length > 0) {
    // 先进行排序: target=false的排在前面
    // 将没有TaskTargetScore或TaskTargetScore小于currentSocre的项移到数组后面
    goodsListTemp.sort((a, b) => {
      // 如果a没有TaskTargetScore或TaskTargetScore小于currentSocre，则排在后面
      if (!a.TaskTargetScore || a.TaskTargetScore <= (a.TaskScore || 0)) {
        return 1
      }
      // 如果b没有TaskTargetScore或TaskTargetScore小于currentSocre，则排在后面
      if (!b.TaskTargetScore || b.TaskTargetScore <= (b.TaskScore || 0)) {
        return -1
      }
      // 如果两者都有TaskTargetScore且都大于currentSocre，则保持原有顺序
      return 0
    })

    // 更新商品列表
    itemInfoList.value = goodsListTemp
  }
  console.log('handleBtnClick')

  // 执行动画
  // TODO 购买成功
  try {
    greenButtonRef.value?.triggerAnimationWithCallback(() => {
      isBuy.value = true
      isAnimation.value = true
    })
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isAnimation.value = false
  }
}
defineExpose({
  triggerSuccessAnimation,
  getProductList,
})
const scoreTarget = ref<HTMLElement | null>(null)

const vipScore = computed(() => {
  // Find the prop with VipScore field in productInfo.Props
  if (!productInfo.value?.Props || productInfo.value.Props.length === 0)
    return 0
  console.log('productInfo.value.Props', productInfo.value.Props, productInfo.value.Props.find(item => item.VipScore !== undefined)?.VipScore)
  return productInfo.value.Props.find(item => item.VipScore !== undefined)?.VipScore
})

const vipScoreAdd = computed(() => {
  if (!productInfo.value?.AddProps || productInfo.value.AddProps.length === 0)
    return 0
  return productInfo.value.AddProps.find(item => item.VipScore !== undefined)?.VipScore
})

const iconProps = computed(() => {
  if (!productInfo.value?.Props || productInfo.value.Props.length === 0)
    return []
  return productInfo.value.Props.filter(item => item.Icon)
})

const bubblePosition = {
  top: '-0.4rem',
  right: '-1.2rem',
  translateX: '50%',
  translateY: '0',
}

function getTaskImg(item: ItemInfo) {
  if (!item.TaskTargetScore) {
    return imgMap.taskOkBgImg
  }
  if (item.TaskScore && item.TaskScore >= item.TaskTargetScore) {
    return imgMap.taskOkBgImg
  }
  return imgMap.taskBarImg
}
</script>

<template>
  <div class="relative max-h-[calc(100vh+80px)] min-h-[calc(100vh-420px)] flex flex-col items-center text-32">
    <div
      class="w-full flex flex-none shrink-0 flex-col items-center justify-center bg-cover bg-center pt-190"
      :style="{ backgroundImage: `url(${bgImg})`,
                backgroundSize: '120% auto',
                backgroundPosition: 'center top 10%',
                backgroundRepeat: 'no-repeat' }"
    >
      <div
        class="relative w-full bg-cover bg-center py-10 text-center"
        :style="{ backgroundImage: `url(${imgMap.textImg})` }"
      >
        <div
          class="absolute bottom-10 left-25 h-150 w-150 f-c bg-cover bg-center"
          :style="{ backgroundImage: `url(${imgMap.tagImg})` }"
        >
          <div class="absolute bottom-0 left-0 z-30 h-150 w-150 f-c bg-cover bg-center">
            <img
              :src="imgMap.bgImg2"
              class="h-full w-full"
            >
          </div>
          <!-- 左侧图标 -->
          <div
            ref="scoreTarget"
            class="gradient-text flex flex-col items-start justify-center whitespace-nowrap text-46 font-normal text-stroke-3 text-stroke-[#7e0a1a] paint-order -rotate-10"
          >
            <div class="gradient-text">
              {{ productInfo?.Discount }}%
            </div>
            <div class="gradient-text">
              MORE
            </div>
          </div>
        </div>
        <div class="f-c text-38">
          <div class="relative">
            <!-- <div class="relative">
              <span class="absolute inset-0 text-stroke-3 text-stroke-[#46344a]"> Get up to <span class="color-[#fff44b]">30,000</span></span>
              <span class="relative z-10"> Get up to <span class="color-[#fff44b]">30,000</span></span>
            </div> -->
            <TextStroke
              stroke-color="#46344a"
              :stroke-width="3"
            >
              {{ t('get_up_to_3000') }}<span class="color-[#fff44b]"> 30,000</span>
            </TextStroke>
            <!-- <div>
              Get up to <span class="color-[#fff44b]">30,000</span>
            </div> -->
            <div class="absolute bottom-1/2 f-c translate-x-[100%] translate-y-1/2 -right-10">
              <div
                v-for="prop in iconProps"
                :key="prop.PropID"
                class="f-c"
              >
                <div class="relative">
                  <img
                    :src="getPGImg(prop.Icon)"
                    class="h-45 w-45"
                  >
                  <TextStroke
                    stroke-color="#46344a"
                    :stroke-width="3"
                    class="absolute bottom-0 left-0 f-c text-20"
                  >
                    {{ prop.Text }}
                  </TextStroke>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-sacle-w-120 h-108 w-full flex flex-shrink-0 justify-center bg-cover bg-center"
      :style="{ backgroundImage: `url(${redBarImg})`,
      }"
    >
      <div
        v-if="!isBuy"
        class="flex items-center justify-center -mt-15"
      >
        <div class="mr-20 flex flex-col items-end text-29 font-normal">
          <div class="dual-color-text relative">
            <span class="absolute inset-0 text-[#ffffd3] text-stroke-2 text-stroke-[#581368]">{{ t('buy_now_to_claim') }}</span>
            <span class="gold-gradient-text relative z-10">{{ t('buy_now_to_claim') }}</span>
          </div>
          <div class="dual-color-text relative">
            <span class="absolute inset-0 text-[#ffffd3] text-stroke-2 text-stroke-[#581368]">{{ t('your_earned_rewards') }}</span>
            <span class="gold-gradient-text relative z-10">{{ t('your_earned_rewards') }}</span>
          </div>
        </div>
        <div
          class="z-20 h-75 w-220 f-c"
          @click="handleBtnClick"
        >
          <GreenButton
            ref="greenButtonRef"
            radius="0.24rem"
            border-width="0.02rem"
            :score="vipScore"
            :score-add="vipScoreAdd"
            score-show
            :score-target="scoreTarget"
            :bubble-position="bubblePosition"
          >
            <div
              class="z-10 text-47 text-[#1c6904]"
              style="text-shadow: 0px 0.02rem 0px rgba(190, 251, 91, 0.75);"
            >
              {{ formatPrice(productInfo?.Price || 0) }}
            </div>
          </GreenButton>
        </div>
      </div>
      <div
        v-if="isBuy"
        class="flex items-center justify-center -mt-15"
      >
        <div class="mr-20 flex flex-col items-end text-29 font-normal">
          <div class="dual-color-text relative">
            <span class="absolute inset-0 text-[#ffffd3] text-stroke-2 text-stroke-[#581368]">{{ t('achieve_the_bar_to_gain_the_rewards') }}</span>
            <span class="gold-gradient-text relative z-10">{{ t('achieve_the_bar_to_gain_the_rewards') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hide-scrollbar h-500 w-full flex-shrink flex-grow">
      <div class="hide-scrollbar custom-scrollbar h-full w-full flex flex-col items-center overflow-x-hidden overflow-y-auto bg-opacity-70 px-10 py-20">
        <TransitionGroup
          name="gift-list"
          tag="div"
          class="relative"
        >
          <div
            v-for="item in itemInfoList"
            :key="item.id"
            class="goods-item relative mt-7 h-110 w-705 f-b bg-cover text-white"
            :style="{ backgroundImage: `url(${getTaskImg(item)})` }"
          >
            <div class="ml-43 f-s">
              <img
                :src="getPGImg(item.Pic)"
                class="w-66"
              >
              <div class="ml-32 flex flex-col">
                <div class="text-31 text-[#426676]">
                  {{ item.Content }}
                </div>
                <div
                  v-if="item.TaskTargetScore"
                  class="relative mt-16 h-37 w-271"
                >
                  <img
                    :src="imgMap.processBgImg"
                    class="h-full w-full"
                  >

                  <div
                    class="absolute left-0 top-0 h-full overflow-hidden"
                    :style="{ width: `${(item.TaskScore || 0) / (item.TaskTargetScore || 0) * 100}%` }"
                  >
                    <img
                      :src="imgMap.processImg"
                      class="h-full w-auto"
                    >
                  </div>
                  <div class="absolute left-1/2 top-1/2 w-271 f-c text-22 text-white -translate-x-1/2 -translate-y-1/2">
                    <TextStroke
                      stroke-color="#426676"
                      :stroke-width="3"
                    >
                      {{ item.TaskScore || 0 }} / {{ item.TaskTargetScore }}
                    </TextStroke>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative mr-37 f-c">
              <IconWithText
                :icon-url="getPGImg(item.Props?.[0]?.Icon)"
                :text="item.Props?.[0]?.Text"
                stroke-color="#4d4d4d"
                :stroke-width="3"
                :text-size="28"
                :icon-height="58"
                :bottom="-10"
                :gift-type="item.Props?.[0]?.PropType"
                @click="(event: any) => handleBoxClick(item.Props?.[0] as Prop, event)"
              />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="mb-20 mt-20 w-full f-c flex-none">
      <CountDown
        :end-time="productInfo?.ExpireTime"
        text-class="px-20 py-10 text-31 text-white"
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
.bg-scale-120 {
  background-size: 120% 120%;
}

.gradient-text {
  /* 渐变背景，可以自定义多个颜色段 */
  background: linear-gradient(-4deg, #fc9b28 0%, #ecfb3c 100%);
  /* 让背景只作用于文字部分 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-sacle-w-120 {
  background-size: 110% 110%;
}

.gold-gradient-text {
  background: linear-gradient(0deg, #f0e8ac 0%, #f9f7dc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  /* 移除文字阴影，因为我们现在使用双层文本 */
}

.dual-color-text {
  /* 确保两层文本完全重叠 */
  display: inline-block;
  position: relative;
}

.btn-text {
  box-shadow: 0px 2px 0px 0px rgba(190, 251, 91, 0.75);
}

/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */

  /* Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}

/* TransitionGroup动画样式 */
.gift-list-move {
  transition: transform 0.5s ease; /* 仅对transform应用过渡效果 */
}

.gift-list-enter-active,
.gift-list-leave-active {
  transition: all 0.5s ease; /* 对所有属性应用过渡效果 */
}

.gift-list-enter-from,
.gift-list-leave-to {
  opacity: 0;
  transform: translateY(30px); /* 向下滑入，向上滑出 */
}

/* 确保离开的元素不会影响布局 */
.gift-list-leave-active {
  position: absolute;
  width: 705px; /* 与列表项宽度一致 */
}

.flex-adaptive-container {
  display: flex;
  justify-content: space-evenly; /* 均匀分布元素，包括首尾 */
  align-items: center;
  width: 100%;

  /* 设置最小间距，防止元素过于靠近 */
  gap: 20px;

  /* 可选：增加内边距，确保首尾元素不会靠近容器边缘 */
  padding: 0 15px;
}

.flex-dynamic-gap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  /* 基于元素数量动态设置间距 */
  &.items-3 {
    gap: 40px; /* 三个元素时的间距较大 */
  }

  &.items-4 {
    gap: 20px; /* 四个元素时的间距较小 */
  }
}

.grid-adaptive-container {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;

  /* 动态设置网格列 */
  &.items-3 {
    grid-template-columns: repeat(3, auto);
    gap: 40px;
  }

  &.items-4 {
    grid-template-columns: repeat(4, auto);
    gap: 20px;
  }
}

.move-up {
  animation: moveUp 0.5s ease forwards;
}

.move-to-first {
  animation: moveToFirst 1s ease forwards;
}

.move-to-second {
  animation: moveToSecond 1s ease forwards;
}

.fade-out {
  animation: fadeOut 0.8s ease forwards;
}

@keyframes moveUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

@keyframes moveToFirst {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(-20px) translateX(-100%);
  }
}

@keyframes moveToSecond {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(-20px) translateX(-100%);
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
// .testBg {
//   background: #fff;
//   -webkit-background-clip: text;
//   // -webkit-text-fill-color: transparent;
// }
</style>
