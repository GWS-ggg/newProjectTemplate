<script setup lang="ts">
import GreenButton from '@/components/GreenButton.vue'
import { computed, ref, watchEffect } from 'vue'

// 类型定义和数据初始化（简化示例）
interface Gift {
  id: number
  // ... 其他属性
  BuyTimes: number
  sortId?: number
  score: number
  bgImg: string
  btnDesc: string
  isFree: boolean
  isPurchased: boolean
}

// 礼物列表数据
const giftList = ref<Gift[]>([
  // ... 数据示例
])

// 当前显示的礼物
const displayGiftList = ref<Gift[]>([])

// 动画相关状态
const isAnimating = ref(false)
const buttonRefs = ref(new Map())

// 初始化礼物列表
watchEffect(() => {
  // 选择未购买的礼物
  displayGiftList.value = giftList.value
    .filter(item => item.BuyTimes === 0)
    .slice(0, 3)

  // 设置排序ID
  let sortId = 1
  displayGiftList.value.forEach((item) => {
    item.sortId = sortId++
  })
})

// 处理礼物购买
function handlePurchaseButton(gift: Gift) {
  // 防止重复点击
  if (isAnimating.value)
    return
  isAnimating.value = true

  // 获取按钮引用
  const buttonRef = buttonRefs.value.get(gift.id)
  if (buttonRef) {
    // 触发积分动画
    buttonRef.triggerAnimationWithCallback(() => {
      isAnimating.value = false
    })
  }

  // 更新礼物状态
  const selectedGift = giftList.value.find(item => item.id === gift.id)
  if (selectedGift) {
    // 设置为已购买
    setTimeout(() => {
      selectedGift.BuyTimes = 1
    }, 500)
  }
}

// 设置按钮引用
function setButtonRef(el: any, id: number) {
  if (el)
    buttonRefs.value.set(id, el)
}
</script>

<template>
  <div class="gift-page">
    <h1>礼物列表</h1>

    <!-- 使用TransitionGroup实现列表动画 -->
    <TransitionGroup
      name="gift-list"
      tag="div"
      class="gift-list"
    >
      <div
        v-for="gift in displayGiftList"
        :key="gift.id"
        class="gift-item"
      >
        <!-- 礼物内容 -->
        <div class="gift-image">
          <img
            :src="gift.bgImg"
            alt="礼物图片"
          >
        </div>

        <!-- 使用Transition组件包装按钮，实现按钮的进入/离开动画 -->
        <Transition name="button-fade">
          <div
            v-if="!gift.isPurchased"
            class="gift-button"
            @click="handlePurchaseButton(gift)"
          >
            <GreenButton
              :ref="el => setButtonRef(el, gift.id)"
              radius="20px"
              border-width="2px"
              :score="gift.score"
              score-show
            >
              <span>{{ gift.btnDesc }}</span>
            </GreenButton>
          </div>
        </Transition>

        <!-- 使用Transition组件实现已购买标记的动画 -->
        <Transition name="purchased-badge">
          <div
            v-if="gift.BuyTimes > 0"
            class="purchased-badge"
          >
            已购买
          </div>
        </Transition>
      </div>
    </TransitionGroup>

    <!-- 底部说明 -->
    <Transition name="fade">
      <div
        v-if="displayGiftList.length === 0"
        class="empty-message"
      >
        暂无可用礼物
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.gift-page {
  padding: 20px;
}

.gift-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  position: relative;
}

.gift-item {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.gift-image {
  width: 100%;
  img {
    width: 100%;
    display: block;
  }
}

.gift-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.purchased-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 5px 15px;
  border-radius: 4px;
  font-weight: bold;
}

/* TransitionGroup 动画 */
.gift-list-move {
  transition: transform 0.5s ease;
}

.gift-list-enter-active,
.gift-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.gift-list-enter-from,
.gift-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 确保离开的元素不会影响布局 */
.gift-list-leave-active {
  position: absolute;
  width: 100%;
}

/* 按钮淡入淡出 */
.button-fade-enter-active,
.button-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.button-fade-enter-from,
.button-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 已购买标记动画 */
.purchased-badge-enter-active {
  animation: badge-bounce 0.5s;
}

.purchased-badge-leave-active {
  animation: badge-bounce 0.5s reverse;
}

@keyframes badge-bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 空消息淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
