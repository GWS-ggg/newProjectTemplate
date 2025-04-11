<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 结束时间的时间戳（秒）
  endTime: {
    type: Number,
    required: false,
    default: undefined,
  },
  // 格式：'HH:MM:SS' 或 'DD:HH:MM:SS'
  format: {
    type: String,
    default: 'HH:MM:SS',
  },
  // 文本样式
  textClass: {
    type: String,
    default: 'text-26 text-[#d9cdb9] text-stroke-1 paint-order text-stroke-[#164b2e]',
  },
  // 倒计时结束回调
  onFinish: {
    type: Function,
    default: () => {},
  },
})

// 是否正在加载（endTime未定义）
const isLoading = computed(() => props.endTime === undefined)

// 剩余时间（秒）
const remainingTime = ref(0)

// 计算剩余时间
function calculateRemainingTime() {
  if (props.endTime === undefined) {
    return 0
  }
  return Math.max(0, props.endTime - Math.floor(Date.now() / 1000))
}

// 初始化剩余时间
remainingTime.value = calculateRemainingTime()

// 倒计时是否结束（仅当endTime有值且remainingTime为0时才算结束）
const isFinished = computed(() => {
  return !isLoading.value && remainingTime.value <= 0
})

// 监听endTime变化
watch(() => props.endTime, () => {
  // endTime变化后立即更新剩余时间
  remainingTime.value = calculateRemainingTime()
})

// 补零函数
function padZero(num: number) {
  return num.toString().padStart(2, '0')
}

// 格式化时间
const formattedTime = computed(() => {
  // 计算各时间单位
  const days = Math.floor(remainingTime.value / (60 * 60 * 24))
  const hours = Math.floor((remainingTime.value % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((remainingTime.value % (60 * 60)) / 60)
  const seconds = Math.floor(remainingTime.value % 60)

  // 根据格式返回
  if (props.format === 'DD:HH:MM:SS') {
    return `${padZero(days)}:${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }
  else {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }
})

// 倒计时定时器
let timer: number | null = null

// 更新倒计时
function updateCountdown() {
  // 如果endTime未定义，不更新倒计时
  if (isLoading.value) {
    return
  }

  const newRemainingTime = calculateRemainingTime()

  // 检测倒计时是否刚刚结束
  if (newRemainingTime <= 0 && remainingTime.value > 0) {
    props.onFinish()
  }

  remainingTime.value = newRemainingTime
}

// 暴露给父组件的方法
defineExpose({
  // 刷新倒计时（如果需要手动刷新）
  refresh: updateCountdown,
})

// 组件挂载时启动定时器
onMounted(() => {
  // 每秒更新一次
  timer = window.setInterval(updateCountdown, 1000)
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div :class="textClass">
    <!-- 加载状态：endTime未定义 -->
    <template v-if="isLoading">
      <slot name="loading">
        正在获取...
      </slot>
    </template>

    <!-- 完成状态：endTime有值且剩余时间为0 -->
    <template v-else-if="isFinished">
      <slot name="finished">
        Time's up!
      </slot>
    </template>

    <!-- 倒计时状态：endTime有值且剩余时间大于0 -->
    <template v-else>
      <slot
        :time="formattedTime"
        :days="padZero(Math.floor(remainingTime / (60 * 60 * 24)))"
        :hours="padZero(Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60)))"
        :minutes="padZero(Math.floor((remainingTime % (60 * 60)) / 60))"
        :seconds="padZero(Math.floor(remainingTime % 60))"
      >
        {{ formattedTime }}
      </slot>
    </template>
  </div>
</template>
