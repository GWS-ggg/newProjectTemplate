<script setup lang="ts">
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
import { computed, ref, watch } from 'vue'

const giftStore = useGiftStore()
const currentPackageId = computed(() => {
  return giftStore.currentPackageId
})
const currentGiftComponent = computed(() => {
  switch (currentPackageId.value) {
    case 1:
      return stepGift
    case 2:
      return newBattlePass
    case 3:
      return sixSegment
    case 4:
      return onePlusTwo
    case 5:
      return newThreeChoiceOne
    case 6:
      return dailyLogin
    case 7:
      return roulette
    case 8:
      return threeSegmentN
    case 9:
      return threeSegment
    case 10:
      return threeChoiceOne
    default:
      return null
  }
})

// 监听组件变化，自动滚动到顶部
watch(() => currentGiftComponent.value, () => {
  // 使用 setTimeout 确保在DOM更新后滚动
  setTimeout(() => {
    // 滚动整个页面到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    // 或者如果您只想滚动特定容器：
    // document.querySelector('.main-content').scrollTop = 0
  }, 0)
})

// 组件切换函数示例
// function switchToComponent(component) {
//   currentGiftComponent.value = component
//   // 不需要在这里滚动，watch会处理
// }
</script>

<template>
  <div class="h-full text-white">
    <Transition
      name="slide"
      mode="out-in"
    >
      <component :is="currentGiftComponent" />
    </Transition>
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
