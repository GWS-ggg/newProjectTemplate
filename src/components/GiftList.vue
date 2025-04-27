<script setup lang="ts">
import type { BoxData, FreeGiftAwardRequest } from '@/api/types'
import type { OrderPopupInfo, Prop } from '@/types'
import type { AsyncComponentLoader, Component } from 'vue'
import { freeGiftAwardApi } from '@/api'
import { useBuyOrder } from '@/hooks/useBuyOrder'
import { useBoxStore } from '@/store/modules/boxStore'
import { useGiftStore } from '@/store/modules/giftStore'
import { useLoginStore } from '@/store/modules/loginStore'
import { formatPrice } from '@/utils'
import onePlusTwo from '@/views/gifts/1+2.vue'
import battlePass from '@/views/gifts/battlePass.vue'
import dailyLogin from '@/views/gifts/dailyLogin.vue'
import newBattlePass from '@/views/gifts/newBattlePass.vue'

import newThreeChoiceOne from '@/views/gifts/newThreeChoiceOne.vue'
import roulette from '@/views/gifts/roulette.vue'
import sixSegment from '@/views/gifts/sixSegment.vue'
import stepGift from '@/views/gifts/stepGift.vue'
import threeChoiceOne from '@/views/gifts/threeChoiceOne.vue'
import threeSegment from '@/views/gifts/threeSegment.vue'
import threeSegmentN from '@/views/gifts/threeSegmentN.vue'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

// 定义一个接口，描述子组件应该具有的方法
interface GiftComponent {
  triggerSuccessAnimation?: () => void
}

const giftStore = useGiftStore()

// 使用异步组件动态导入
const componentLoaders: Record<number, AsyncComponentLoader> = {
  1: () => import('@/views/gifts/stepGift.vue'),
  2: () => import('@/views/gifts/newBattlePass.vue'),
  3: () => import('@/views/gifts/roulette.vue'),
  4: () => import('@/views/gifts/1+2.vue'),
  5: () => import('@/views/gifts/newThreeChoiceOne.vue'),
  6: () => import('@/views/gifts/dailyLogin.vue'),
  7: () => import('@/views/gifts/sixSegment.vue'),
  8: () => import('@/views/gifts/threeSegmentN.vue'),
  9: () => import('@/views/gifts/threeSegment.vue'),
  10: () => import('@/views/gifts/threeChoiceOne.vue'),
}

// 组件映射对象，预加载当前组件
const componentMap: Record<number, Component> = {}

// 组件名称映射，用于 KeepAlive include
const componentNames: Record<number, string> = {
  1: 'StepGift',
  2: 'NewBattlePass',
  3: 'Roulette',
  4: 'OnePlusTwo',
  5: 'NewThreeChoiceOne',
  6: 'DailyLogin',
  7: 'SixSegment',
  8: 'ThreeSegmentN',
  9: 'ThreeSegment',
  10: 'ThreeChoiceOne',
}

// 预加载当前需要的组件
function preloadComponent(id: number) {
  if (!componentMap[id] && componentLoaders[id]) {
    componentMap[id] = defineAsyncComponent({
      loader: componentLoaders[id],
      // 可选：添加加载状态组件
      loadingComponent: {
        template: '<div class="loading-placeholder">加载中...</div>',
      },
      delay: 200, // 延迟显示加载组件的时间
    })
  }
  return componentMap[id]
}

const currentGiftComponent = computed(() => {
  const currentType = giftStore.currentGiftInfo?.ProductType || 1
  return preloadComponent(currentType) || null
})

// 记录最近访问的组件ID，限制为最近5个
const recentlyVisitedIds = ref<number[]>([])
const maxCachedComponents = 5

// 获取要缓存的组件名称列表
const cachedComponentNames = computed(() => {
  return recentlyVisitedIds.value.map(id => componentNames[id]).filter(Boolean)
})

// 更新最近访问的组件列表
function updateRecentlyVisited(id: number) {
  if (!id)
    return

  // 如果已经在列表中，先移除
  const index = recentlyVisitedIds.value.indexOf(id)
  if (index > -1) {
    recentlyVisitedIds.value.splice(index, 1)
  }

  // 添加到列表开头
  recentlyVisitedIds.value.unshift(id)

  // 保持列表长度不超过最大缓存数
  if (recentlyVisitedIds.value.length > maxCachedComponents) {
    recentlyVisitedIds.value.pop()
  }
}

// 监听组件变化，自动滚动到顶部和更新访问记录
watch(() => giftStore.currentGiftId, (newId) => {
  // 更新最近访问记录
  updateRecentlyVisited(newId)

  // 使用 setTimeout 确保在DOM更新后滚动
  setTimeout(() => {
    // 滚动整个页面到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, 0)
}, { immediate: true })

// 在组件挂载时初始化最近访问列表
onMounted(() => {
  if (giftStore.currentGiftId) {
    updateRecentlyVisited(giftStore.currentGiftId)
  }
})

const boxStore = useBoxStore()
const showPopupBubble = ref(false)
const popupTargetElement = ref<HTMLElement | null>(null)
const boxData = ref<BoxData | null>(null)
const currentProp = ref<Prop | null>(null)
const realShowPopupBubble = ref(false)
async function handleBoxClick(prop: Prop, event: MouseEvent) {
  if (prop.PropType !== 11) {
    return
  }
  // 如果弹窗已经显示，不执行
  if (showPopupBubble.value)
    return
  console.log(prop)

  // 重置显示状态
  realShowPopupBubble.value = false

  // 存储当前prop和目标元素
  currentProp.value = prop
  popupTargetElement.value = event.currentTarget as HTMLElement

  // 先获取宝箱数据
  boxData.value = await boxStore.getBoxData(prop.PropID)
  console.log(boxData.value)

  // 设置modelValue为true，但不显示弹窗（通过realShow控制可见性）
  // 这会触发组件挂载并开始计算位置
  showPopupBubble.value = true

  // 使用稍长的延时，确保DOM已渲染并且位置已经充分计算
  // 前100ms用于DOM渲染和初始位置计算
  // 后100ms用于确保内容加载后的位置校正
  setTimeout(() => {
    // 显示弹窗
    realShowPopupBubble.value = true
  }, 300)
}
function closePopupBubble() {
  realShowPopupBubble.value = false
  showPopupBubble.value = false
}

// 支付相关
// 弹窗状态
const popupOpen = ref(false)
const giftComponentRef = ref<GiftComponent | null>(null)
const orderPopupInfo = ref<OrderPopupInfo>({
  price: 0,
  key: 0,
  tradeProductId: 0,
  skuId: '',
  exchangeId: 0,
})
const loginStore = useLoginStore()
async function openPopup(orderInfo: OrderPopupInfo) {
  orderPopupInfo.value = orderInfo
  // 价格为0  走免费礼包发奖接口
  if (orderInfo.price === 0) {
    const freeGiftAwardRequestInfo: FreeGiftAwardRequest = {
      appid: '616876868660610',
      uid: loginStore.userUid,
      packagekey: orderInfo.key,
      tradeproductid: orderInfo.tradeProductId,
    }
    if (orderInfo.exchangeId) {
      freeGiftAwardRequestInfo.exchangeid = orderInfo.exchangeId
    }

    await freeGiftAwardApi(freeGiftAwardRequestInfo)
    setTimeout(() => {
      if (giftComponentRef.value && typeof giftComponentRef.value.triggerSuccessAnimation === 'function') {
        console.log('onPaymentSuccess')
        giftComponentRef.value.triggerSuccessAnimation()
      }
    }, 50)
    return
  }

  // 不为0 走下单接口
  popupOpen.value = true
}
function closePopup() {
  popupOpen.value = false
}

// 添加引用，用于触发事件
function onPaymentSuccess() {
  console.log('onPaymentSuccess 11')
  // 延迟400ms 确保弹窗关闭完再显示动画
  setTimeout(() => {
    if (giftComponentRef.value && typeof giftComponentRef.value.triggerSuccessAnimation === 'function') {
      console.log('onPaymentSuccess')
      giftComponentRef.value.triggerSuccessAnimation()
    }
  }, 400)
}
</script>

<template>
  <div class="h-full text-white">
    <Transition
      name="slide"
      mode="out-in"
    >
      <!-- 使用 KeepAlive 并限制只缓存最近访问的几个组件 -->
      <KeepAlive :include="cachedComponentNames">
        <component
          :is="currentGiftComponent"
          ref="giftComponentRef"
          @open-popup="openPopup"
          @box-click="handleBoxClick"
        />
      </KeepAlive>
    </Transition>
    <Popup
      v-model="popupOpen"
      @close="closePopup"
    >
      <PaySelect
        :order-popup-info="orderPopupInfo"
        @payment-success="onPaymentSuccess"
        @close="closePopup"
      />
    </Popup>
    <PopupBubble
      v-model="showPopupBubble"
      :box-data="boxData"
      :target="popupTargetElement"
      :prop="currentProp"
      :real-show="realShowPopupBubble"
      @close="closePopupBubble"
    />
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滑动
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* 列表项移动动画 */
.gift-list-move,
.gift-list-enter-active,
.gift-list-leave-active {
  transition: all 0.5s ease;
}

.gift-list-enter-from,
.gift-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保离开的元素不会影响布局 */
.gift-list-leave-active {
  position: absolute;
}
</style>
