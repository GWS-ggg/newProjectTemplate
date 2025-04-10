<script setup lang="ts">
import GreenButton from '@/components/GreenButton.vue'
import { computed, ref, watchEffect } from 'vue'

// ... 数据结构和初始化代码与原文件相同 ...

// 简化的动画状态管理
const animationStates = ref({
  isAnimating: false,
  selectedGiftId: null as null | number,
  showNewGift: false,
})

// 管理礼物列表
const displayGiftList = ref<Gift[]>([])

watchEffect(() => {
  displayGiftList.value = giftList.value.filter(item => item.BuyTimes === 0).slice(0, 3)
  let sortId = 1
  displayGiftList.value.forEach((item) => {
    item.sortId = sortId++
  })
})

// 创建一个映射来存储button refs
const greenButtonRefs = ref<Map<number, InstanceType<typeof GreenButton>>>(new Map())

// 设置ref的方法
function setButtonRef(el: any, id: number) {
  if (el) {
    greenButtonRefs.value.set(id, el as InstanceType<typeof GreenButton>)
  }
}

// 简洁的动画处理函数
function handlePurchaseButton(currentGift: Gift) {
  // 防止重复点击
  if (animationStates.value.isAnimating)
    return

  animationStates.value.isAnimating = true
  animationStates.value.selectedGiftId = currentGift.id

  // 触发积分动画
  const buttonRef = greenButtonRefs.value.get(currentGift.id)
  if (buttonRef) {
    buttonRef.triggerAnimationWithCallback(() => {
      // 动画完成回调
      animationStates.value.isAnimating = false
    })
  }

  // 更新礼物状态 - 这会触发CSS过渡
  const selectedGift = giftList.value.find(item => item.id === currentGift.id)
  if (selectedGift) {
    // 短暂延迟以确保动画顺序正确
    setTimeout(() => selectedGift.BuyTimes = 1, 1200)
  }

  // 显示新礼物 - 通过CSS动画完成
  setTimeout(() => {
    animationStates.value.showNewGift = true
    setTimeout(() => {
      animationStates.value.showNewGift = false
    }, 600)
  }, 1100)
}

// 计算哪个礼物应该应用动画
const shouldFadeOut = computed(() => (id: number) => {
  return animationStates.value.isAnimating && animationStates.value.selectedGiftId === id
})

const shouldMoveUp = computed(() => (sortId: number) => {
  return animationStates.value.isAnimating && sortId >= 2
})

const shouldFadeIn = computed(() => (sortId: number) => {
  return sortId === 3 && animationStates.value.showNewGift
})
</script>

<template>
  <div class="mb-30 flex flex-col items-center justify-center text-29">
    <div class="mt-10 text-[#fff] text-stroke-1 text-stroke-[#19093e]">
      END IN: 60:00:00
    </div>
    <div class="mt-24 text-24 text-[#fef29f] text-stroke-1 text-stroke-[#682c2e]">
      Take each deal take each deal !"
    </div>
    <div
      v-for="item in displayGiftList"
      :id="`gift-${item.sortId}`"
      :key="item.id"
      class="gift-container relative mt-20 w-710 flex items-center justify-center"
      :class="{
        'fade-out-active': shouldFadeOut(item.id),
        'move-up-active': shouldMoveUp(item.sortId),
        'fade-in-active': shouldFadeIn(item.sortId),
      }"
    >
      <div class="w-710">
        <img
          :src="item.bgImg"
          alt=""
          class="w-full"
        >
      </div>

      <!-- 礼物内容和按钮 -->
      <div class="absolute left-0 top-30 h-120 w-full">
        <!-- ... 内容部分与原文件相同 ... -->
      </div>
      <div
        class="absolute bottom-38 left-1/2 z-30 h-100 w-300 -translate-x-1/2"
        @click="handlePurchaseButton(item)"
      >
        <GreenButton
          :ref="el => setButtonRef(el, item.id)"
          radius="20px"
          border-width="2px"
          :score="item.score"
          score-show
        >
          <!-- ... 按钮内容与原文件相同 ... -->
        </GreenButton>
      </div>
      <!-- ... 其他内容与原文件相同 ... -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 基础样式与原文件相同 */

/* 使用CSS类名触发动画，而不是JS添加/删除类 */
.gift-container {
  /* 基础状态 */
  opacity: 1;
  transform: scale(1) translateY(0);
  transition-property: opacity, transform;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 消失效果 - 使用类触发 */
.fade-out-active {
  opacity: 0;
  transform: scale(0.8);
}

/* 上移效果 - 使用类触发 */
.move-up-active {
  transform: translateY(-360px);
}

/* 出现效果 - 使用类触发 */
.fade-in-active {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
