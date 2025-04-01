<script setup lang="ts">
import { useGiftStore } from '@/store/modules/giftStore'
import onePlusTwo from '@/views/gifts/1+2.vue'
import battlePass from '@/views/gifts/battlePass.vue'
import dailyLogin from '@/views/gifts/dailyLogin.vue'
import newBattlePass from '@/views/gifts/newBattlePass.vue'
import roulette from '@/views/gifts/roulette.vue'
import sixSegment from '@/views/gifts/sixSegment.vue'
import stepGift from '@/views/gifts/stepGift.vue'
import threeChoiceOne from '@/views/gifts/threeChoiceOne.vue'
import threeSegment from '@/views/gifts/threeSegment.vue'
import threeSegmentN from '@/views/gifts/threeSegmentN.vue'
import { computed, ref } from 'vue'

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
      return threeChoiceOne
    case 6:
      return dailyLogin
    case 7:
      return roulette
    case 8:
      return threeSegmentN
    case 9:
      return threeSegment
    default:
      return null
  }
})
</script>

<template>
  <div class="text-white">
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
</style>
