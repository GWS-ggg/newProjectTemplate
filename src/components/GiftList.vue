<script setup lang="ts">
import type { Component } from 'vue'
import { useGiftStore } from '@/store/modules/giftStore'
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
import { computed, onMounted, provide, ref, watch } from 'vue'

const giftStore = useGiftStore()

// 组件映射对象，方便获取组件
const componentMap: Record<number, Component> = {
  1: stepGift,
  2: newBattlePass,
  3: roulette,
  4: onePlusTwo,
  5: newThreeChoiceOne,
  6: dailyLogin,
  7: sixSegment,
  8: threeSegmentN,
  9: threeSegment,
  10: threeChoiceOne,
}

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

const currentGiftComponent = computed(() => {
  return componentMap[giftStore.currentGiftInfo?.ProductType || 1] || null
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

// 支付pop开关
const isVisblePopup = ref(false)
function showPopup() {
  isVisblePopup.value = true
}
function onClosePopup() {
  isVisblePopup.value = false
}
provide('isVisblePopup', isVisblePopup)
provide('showPopup', showPopup)
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
          @show-popup="showPopup"
        />
      </KeepAlive>
    </Transition>
  </div>
  <Popup
    :is-visble="isVisblePopup"
    @popup-close="onClosePopup"
  >
    <div>
      test 支付
    </div>
  </Popup>
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
