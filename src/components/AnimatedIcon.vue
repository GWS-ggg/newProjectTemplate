<script setup lang="ts">
import { useLoginStore } from '@/store/modules/loginStore'
import { defineEmits, defineExpose, defineProps, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  iconUrl: {
    type: String,
    required: true,
  },
  // A动画持续时间
  duration: {
    type: Number,
    default: 2,
  },
  // 起始元素
  startElement: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  // 目标元素
  targetElement: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  score: {
    type: Number,
    default: 0,
  },
})

// 定义事件
const emit = defineEmits(['animationComplete'])

const iconRef = ref<HTMLElement | null>(null)
const animationActive = ref(false)

// 存储位置信息
const startPos = ref({ x: 0, y: 0 })
const endPos = ref({ x: 0, y: 0 })

// 获取当前根元素fontSize
function getRootFontSize(): number {
  return Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
}
const { getLoginInfo } = useLoginStore()

// 触发动画方法
function triggerAnimation() {
  getLoginInfo()
  // 触发动画的时候 重新登录拉取积分

  // 如果元素不存在，不执行动画
  if (!props.startElement || !props.targetElement)
    return

  // 获取起始元素和目标元素位置
  const startRect = props.startElement.getBoundingClientRect()
  const targetRect = props.targetElement.getBoundingClientRect()

  // 计算起始位置（元素中心）
  startPos.value = {
    x: startRect.left + startRect.width / 2,
    y: startRect.top + startRect.height / 2,
  }

  // 计算目标位置（元素左上角）
  endPos.value = {
    x: targetRect.left,
    y: targetRect.top,
  }

  // 激活动画
  animationActive.value = true

  nextTick(() => {
    if (!iconRef.value)
      return

    // 获取当前根字体大小
    const rootFontSize = getRootFontSize()

    // 设置初始位置，使用rem单位
    Object.assign(iconRef.value.style, {
      left: `${startPos.value.x / rootFontSize}rem`,
      top: `${startPos.value.y / rootFontSize}rem`,
      transform: 'translate(-50%, -50%)',
      opacity: '0',
    })

    // 将位置差值存储为CSS变量，以便在动画中使用
    const diffX = endPos.value.x - startPos.value.x
    const diffY = endPos.value.y - startPos.value.y

    // 将差值转换为与根字体大小无关的单位
    iconRef.value.style.setProperty('--diff-x', `${diffX / rootFontSize}`)
    iconRef.value.style.setProperty('--diff-y', `${diffY / rootFontSize}`)

    console.log('动画信息:', {
      rootFontSize,
      startPos: startPos.value,
      endPos: endPos.value,
      diffX: `${diffX / rootFontSize}rem`,
      diffY: `${diffY / rootFontSize}rem`,
    })

    // 重置并触发动画
    setTimeout(() => {
      if (!iconRef.value)
        return
      iconRef.value.classList.remove('animate')
      void iconRef.value.offsetWidth // 强制重绘
      iconRef.value.classList.add('animate')
    }, 50)
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

  iconRef.value.addEventListener('animationend', () => {
    animationActive.value = false
    // 使用Vue事件机制发出事件
    emit('animationComplete')
  })
})
// TODO
const fontFamily = ref('font-en')
</script>

<template>
  <div
    v-show="animationActive"
    ref="iconRef"
    class="animated-icon"
    :style="{ fontFamily }"
  >
    <div class="relative h-100 w-100 flex flex-col items-center justify-center">
      <img
        :src="iconUrl"
        class="w-100"
        alt="动画图标"
      >
      <div
        v-if="score"
        class="absolute bottom-0 left-1/2 text-24 text-white -translate-x-1/2 -translate-y-15"
      >
        <TextStroke
          stroke-color="#40403e"
          :stroke-width="3"
        >
          +{{ score }}
        </TextStroke>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-icon {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  /* 初始化CSS变量 */
  --diff-x: 0;
  --diff-y: 0;
}

.animated-icon.animate {
  animation: moveToTarget 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
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
    /* 使用CSS变量计算动画位移 */
    /* transform: translate(
      calc(-50% + var(--diff-x) * 0.7rem),
      calc(-50% + var(--diff-y) * 0.7rem)
    ) scale(0.9); */
  }

  100% {
    opacity: 0;
    /* 使用CSS变量计算动画位移 */
    transform: translate(
      calc(var(--diff-x) * 1rem),
      calc(var(--diff-y) * 1rem)
    ) scale(0.75);
  }
}
</style>
