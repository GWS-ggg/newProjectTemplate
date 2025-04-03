<script setup lang="ts">
import { computed, defineExpose, defineProps, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  iconUrl: {
    type: String,
    required: true,
  },
  // 动画持续时间
  duration: {
    type: Number,
    default: 2,
  },
  // 起始位置（可以是元素引用或坐标对象）
  startElement: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  // 目标位置（可以是元素引用或坐标对象）
  targetElement: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
})

const iconRef = ref<HTMLElement | null>(null)
const animationActive = ref(false)
const startPos = ref({ x: 0, y: 0 })
const endPos = ref({ x: 0, y: 0 })

// 计算动画样式
const animationStyle = computed(() => {
  if (!animationActive.value)
    return {}

  return {
    position: 'fixed',
    left: '300px',
    top: '300px',
    zIndex: '1200',
    pointerEvents: 'none',
  }
})

// 触发动画方法
function triggerAnimation() {
  // 先激活动画状态
  animationActive.value = true

  // 使用 nextTick 确保 DOM 更新后再获取引用
  nextTick(() => {
    setTimeout(() => {
      console.log('triggerAnimation icon', iconRef.value)
      if (!iconRef.value)
        return

      // 计算起始位置
      if (props.startElement) {
        const rect = props.startElement.getBoundingClientRect()
        startPos.value = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      }

      // 计算目标位置
      if (props.targetElement) {
        const rect = props.targetElement.getBoundingClientRect()
        endPos.value = {
          x: rect.left,
          y: rect.top,
        }
      }
      else {
      // 默认目标位置（例如页面顶部中间）
        endPos.value = {
          x: window.innerWidth / 2,
          y: 50,
        }
      }
      console.log('startPos', startPos.value)
      console.log('endPos', endPos.value)

      // 设置初始样式
      Object.assign(iconRef.value.style, {
        left: `${startPos.value.x}px`,
        top: `${startPos.value.y}px`,
        transform: 'translate(-50%, -50%)',
        opacity: '0',
      })

      // 重置并触发动画
      iconRef.value.classList.remove('animate')
      void iconRef.value.offsetWidth // 强制重绘
      iconRef.value.classList.add('animate')
    }, 50)
    // 动画结束后处理
    // setTimeout(() => {
    //   animationActive.value = false
    // }, props.duration * 1000)
  })
}

// 将方法暴露给父组件
defineExpose({
  triggerAnimation,
})

// 监听动画结束
onMounted(() => {
  if (!iconRef.value)
    return

  // 动画结束监听
  iconRef.value.addEventListener('animationend', () => {
    animationActive.value = false
  })
})
</script>

<template>
  <div
    v-show="animationActive"
    ref="iconRef"
    class="animated-icon"
  >
    <div class="relative z-1000 h-100 w-100 flex items-center justify-center">
      <img
        :src="iconUrl"
        class="z-1000 z-20 w-100"
        alt=""
      >
    </div>
  </div>
</template>

<style scoped>
.animated-icon {
  position: fixed;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.animated-icon.animate {
  animation: moveToTarget 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes moveToTarget {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(calc(v-bind('endPos.x - startPos.x') * 1px),
        calc(v-bind('endPos.y - startPos.y') * 1px)) scale(0.75);
    /* transform: translate(300px, 300px) scale(0.75); */
  }
}
</style>
