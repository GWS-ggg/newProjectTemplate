<script setup lang="ts">
import { defineExpose, defineProps, onMounted, ref } from 'vue'

const props = defineProps({
  iconUrl: {
    type: String,
    required: true,
  },
  glowUrl: {
    type: String,
    default: '',
  },
  showGlow: {
    type: Boolean,
    default: true,
  },
  // 可以自定义动画持续时间
  duration: {
    type: Number,
    default: 2,
  },
})

const iconRef = ref<HTMLElement | null>(null)

function triggerAnimation() {
  if (!iconRef.value)
    return

  iconRef.value.classList.remove('animate')
  // 强制浏览器重绘以重启动画
  void iconRef.value.offsetWidth
  iconRef.value.classList.add('animate')
}

// 将方法暴露给父组件使用
defineExpose({
  triggerAnimation,
})
</script>

<template>
  <div
    ref="iconRef"
    class="animated-icon"
  >
    <div class="relative z-200 h-100 w-100 f-c">
      <img
        :src="iconUrl"
        class="z-150 w-100"
        alt=""
      >
      <img
        v-if="showGlow"
        :src="glowUrl"
        class="absolute left-0 top-0 z-105 w-100"
        alt=""
      >
    </div>
  </div>
</template>

<style scoped>
.animated-icon {
  position: fixed;
  left: 50%;
  bottom: 15vh;
  transform: translateX(-50%) translateY(0vh);
  opacity: 0;
  z-index: 100;
}

.animated-icon.animate {
  animation: moveUp v-bind('`${props.duration}s`') forwards;
}

@keyframes moveUp {
  0% {
    transform: translate(-50%, 0vh);
    opacity: 0;
  }
  40% {
    transform: translate(-50%, 0vh);
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -75vh);
    opacity: 0;
  }
}
</style>
