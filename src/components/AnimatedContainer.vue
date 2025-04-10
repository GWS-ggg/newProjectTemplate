<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

interface AnimatedContainerProps {
  // 动画名称: fade, slide, scale, etc.
  animation?: string
  // 动画方向: up, down, left, right
  direction?: string
  // 动画持续时间（毫秒）
  duration?: number
  // 动画延迟（毫秒）
  delay?: number
  // 动画触发器，当此值变为true时触发动画
  trigger?: boolean
  // 动画结束后是否自动复位（适用于toggle类动画）
  autoReset?: boolean
  // 动画结束回调函数
  onComplete?: () => void
  // 自定义动画曲线
  easing?: string
  // 是否保持最终状态
  keepFinal?: boolean
}

// 组件属性
const props = withDefaults(defineProps<AnimatedContainerProps>(), {
  animation: 'fade',
  direction: 'up',
  duration: 500,
  delay: 0,
  trigger: false,
  autoReset: false,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  keepFinal: true,
})

// 动画状态
const isAnimating = ref(false)
const isVisible = ref(true)
const hasAnimationEnded = ref(false)

// 计算出CSS样式
const containerStyle = computed(() => {
  return {
    '--animation-duration': `${props.duration}ms`,
    '--animation-delay': `${props.delay}ms`,
    '--animation-easing': props.easing,
  }
})

// 计算CSS类名
const containerClasses = computed(() => {
  const baseClass = 'animated-container'
  const animationClass = `animation-${props.animation}-${props.direction}`
  const stateClass = isAnimating.value ? 'is-animating' : ''
  const visibilityClass = isVisible.value ? 'is-visible' : 'is-hidden'
  const finalClass = hasAnimationEnded.value && props.keepFinal ? 'animation-ended' : ''

  return [baseClass, animationClass, stateClass, visibilityClass, finalClass]
})

// 监听动画触发器
watch(() => props.trigger, (newVal) => {
  if (newVal) {
    startAnimation()
  }
  else if (props.autoReset) {
    resetAnimation()
  }
})

// 引用动画容器元素
const containerRef = ref<HTMLElement | null>(null)

// 启动动画
function startAnimation() {
  isAnimating.value = true
  hasAnimationEnded.value = false

  // 等待动画完成
  const animationDuration = props.duration + props.delay
  setTimeout(() => {
    isAnimating.value = false
    hasAnimationEnded.value = true

    // 调用完成回调
    if (props.onComplete) {
      props.onComplete()
    }
  }, animationDuration)
}

// 重置动画
function resetAnimation() {
  isAnimating.value = false
  hasAnimationEnded.value = false
}

// 暴露组件方法
defineExpose({
  startAnimation,
  resetAnimation,
})

// 监听动画事件
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('animationend', () => {
      if (isAnimating.value) {
        isAnimating.value = false
        hasAnimationEnded.value = true

        // 调用完成回调
        if (props.onComplete) {
          props.onComplete()
        }
      }
    })
  }
})
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClasses"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.animated-container {
  /* 基础样式 */
  position: relative;
  overflow: hidden;

  /* 自定义CSS变量 */
  --animation-duration: 500ms;
  --animation-delay: 0ms;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 淡入淡出动画 */
.animation-fade-up.is-animating {
  animation: fadeInUp var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-fade-down.is-animating {
  animation: fadeInDown var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-fade-left.is-animating {
  animation: fadeInLeft var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-fade-right.is-animating {
  animation: fadeInRight var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

/* 滑动动画 */
.animation-slide-up.is-animating {
  animation: slideUp var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-slide-down.is-animating {
  animation: slideDown var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-slide-left.is-animating {
  animation: slideLeft var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-slide-right.is-animating {
  animation: slideRight var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

/* 缩放动画 */
.animation-scale-up.is-animating {
  animation: scaleUp var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

.animation-scale-down.is-animating {
  animation: scaleDown var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
}

/* 关键帧动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}

@keyframes scaleDown {
  from {
    transform: scale(1.5);
  }
  to {
    transform: scale(1);
  }
}

/* 可见性状态 */
.is-hidden {
  visibility: hidden;
  opacity: 0;
}

/* 按需添加更多动画 */
</style>
