<script setup lang="ts">
import type { BoxData } from '@/api/types'
import type { Prop } from '@/types'
import type { PropType } from 'vue'
import { getPGImg } from '@/utils'
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  realShow: {
    type: Boolean,
    default: false,
  },
  boxData: {
    type: Object as PropType<BoxData>,
    default: null,
  },
  target: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  prop: {
    type: Object as PropType<Prop>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const position = ref({ top: '0rem', left: '0rem' })
// 为箭头位置设置一个安全的默认值，确保始终有值
const arrowPositionLeft = ref('50%') // 默认箭头居中
// 用于跟踪是否是页面刷新后的首次加载
const isFirstTimeLoad = ref(true)

// 存储滚动事件的防抖定时器ID
let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null

// 存储所有的timeout IDs，以便能在组件卸载时清除
const positionTimeouts: ReturnType<typeof setTimeout>[] = []

// 计算当前设备的rem基准值
function getRootFontSize(): number {
  const screenWidth = window.innerWidth

  // 根据屏幕宽度计算fontSize
  // 750px对应100px, 375px对应50px, 线性计算中间值
  if (screenWidth >= 750) {
    return 100 // 750px及以上时为100px
  }
  else {
    // 线性关系：fontSize = screenWidth / 750 * 100
    return Math.max((screenWidth / 750) * 100, 50)
  }
}

// 将px转换为rem
function pxToRem(px: number): string {
  const remBase = getRootFontSize()
  return `${px / remBase}rem`
}

// 计算定位样式
const computedStyle = computed(() => {
  return {
    top: position.value.top,
    left: position.value.left,
  }
})

const typeTwoMaxRollCountItem = computed(() => {
  if (props.boxData?.BoxInfo.BoxType !== 2) {
    return null
  }
  return props.boxData?.Props.find(item => item.MaxRollCount)
})
const typeTwoOtherItem = computed(() => {
  if (props.boxData?.BoxInfo.BoxType !== 2) {
    return null
  }
  return props.boxData?.Props.filter(item => !item.MaxRollCount)
})

const typeFourProgressItem = computed(() => {
  if (props.boxData?.BoxInfo.BoxType !== 4) {
    return null
  }
  return props.boxData?.Props.find(item => item.BoxMiniCount)
})

// 计算网格布局样式
const gridStyle = computed(() => {
  if (!props.boxData || !props.boxData.Props)
    return {}

  let propsLength = props.boxData.Props.length
  if (props.boxData?.BoxInfo.BoxType === 2) {
    propsLength = typeTwoOtherItem.value?.length || 0
  }
  // 根据不同数量决定布局
  if (propsLength <= 4) {
    // 一行显示
    return {
      'grid-template-columns': `repeat(${propsLength}, 1fr)`,
      'grid-template-rows': '1fr',
    }
  }
  else if (propsLength <= 8) {
    // 两行显示，每行最多4个
    const columns = Math.min(Math.ceil(propsLength / 2), 4)
    return {
      'grid-template-columns': `repeat(${columns}, 1fr)`,
      'grid-template-rows': 'repeat(2, 1fr)',
    }
  }
  else {
    // 三行显示，每行最多4个
    const columns = Math.min(Math.ceil(propsLength / 3), 4)
    return {
      'grid-template-columns': `repeat(${columns}, 1fr)`,
      'grid-template-rows': 'repeat(3, 1fr)',
    }
  }
})
const bubbleElement = ref<HTMLElement | null>(null)

// 更新弹框位置
function updatePosition(isScroll?: boolean) {
  if (!props.modelValue || !props.target) {
    // 如果没有目标元素或气泡不显示，将箭头设置在默认位置
    arrowPositionLeft.value = '50%'
    return
  }

  // 获取目标元素尺寸
  const targetRect = props.target.getBoundingClientRect()
  console.log(targetRect, 'targetRect')

  // 使用nextTick确保DOM完全更新
  nextTick(() => {
    // 安全检查，避免组件已被卸载的情况
    if (!props.modelValue || !props.target)
      return

    if (!bubbleElement.value)
      return

    // 获取最新的目标位置
    const latestTargetRect = props.target.getBoundingClientRect()

    // 计算目标元素的中心点位置
    const targetCenterX = latestTargetRect.left + (latestTargetRect.width / 2)

    // 计算宝箱元素的尺寸
    let bubbleWidth = 600 // 默认宽度
    let bubbleHeight = 300 // 默认高度

    // 获取气泡元素已渲染的实际尺寸
    const bubbleRect = bubbleElement.value.getBoundingClientRect()

    // 只有当气泡真实渲染后，才更新尺寸（避免获取到0值）
    if (bubbleRect.width > 10 && bubbleRect.height > 10) {
      bubbleWidth = bubbleRect.width
      bubbleHeight = bubbleRect.height
    }

    // 计算气泡应该在元素的正上方的位置
    const topPosition = latestTargetRect.top - bubbleHeight - 20 // 20px的额外间距给箭头

    // 计算气泡的左侧位置，使其水平居中对齐
    const leftPosition = targetCenterX - (bubbleWidth / 2)

    // 确保不会超出屏幕边界
    const actualLeftPosition = Math.max(10, Math.min(leftPosition, window.innerWidth - bubbleWidth - 35))

    if (isScroll) {
      position.value.top = pxToRem(Math.max(10, topPosition)) // 确保不会显示在页面顶部以外
    }
    else {
      position.value = {
        top: pxToRem(Math.max(10, topPosition)), // 确保不会显示在页面顶部以外
        left: pxToRem(actualLeftPosition), // 确保不会超出左右边界
      }
    }
    // 不重复计算箭头位置
    if (isScroll) {
      return
    }
    // 计算箭头位置：箭头应该位于目标元素的中心点上方
    try {
      // 箭头位置 = 目标元素中心点 - 气泡左侧位置
      const arrowLeft = targetCenterX - actualLeftPosition

      // 确保 arrowLeft 是有效的数字
      if (!Number.isNaN(arrowLeft) && Number.isFinite(arrowLeft)) {
        arrowPositionLeft.value = pxToRem(arrowLeft)
      }
      else {
        // 如果计算结果无效，使用默认值
        arrowPositionLeft.value = '50%'
      }
    }
    catch (error) {
      console.error('计算箭头位置出错:', error)
      // 出错时使用默认值
      arrowPositionLeft.value = '50%'
    }
  })
}

// 包装函数，用于 resize 事件监听器
function handleResize() {
  updatePosition() // 不传递参数
}

// 防抖处理滚动事件
function handleScroll() {
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer)
  }
  scrollDebounceTimer = setTimeout(() => {
    updatePosition(true)
    scrollDebounceTimer = null // 清除定时器ID
  }, 100) // 100ms 防抖延迟
}

// 处理文档点击事件
function handleDocumentClick() {
  // 如果弹窗未显示或目标元素不存在，则不处理
  if (!props.modelValue || !props.target) {
    return
  }
  emit('close')

  // // 获取点击的元素
  // const clickedElement = event.target as Node

  // // 检查点击是否发生在触发弹窗的目标元素内部
  // const isClickInsideTarget = props.target.contains(clickedElement)

  // // 如果点击的目标不是触发元素，则关闭弹窗
  // if (!isClickInsideTarget) {
  //   console.log('Clicked outside target, closing popup')
  //   emit('close')
  // }
}

// 监听目标元素位置变化
onMounted(() => {
  window.addEventListener('resize', handleResize) // 使用包装函数
  // 使用防抖处理滚动
  window.addEventListener('scroll', handleScroll)
  // 移除: 不再在 onMounted 中添加 click 监听器
  // document.addEventListener('click', handleDocumentClick);

  // 监听window的load事件，确保所有资源加载完成后再计算位置
  window.addEventListener('load', () => {
    // 重置首次加载标志
    isFirstTimeLoad.value = true
    // 页面加载完成后也更新一次位置
    if (props.modelValue) {
      updatePosition()
    }
  })
})

// 在组件销毁时移除事件监听和清除所有timeout
onUnmounted(() => {
  window.removeEventListener('resize', handleResize) // 使用包装函数
  window.removeEventListener('scroll', handleScroll)
  // 移除: 不再在 onUnmounted 中移除 click 监听器 (由 watch 处理)
  // document.removeEventListener('click', handleDocumentClick);

  // 确保移除可能存在的 click 监听器
  document.removeEventListener('click', handleDocumentClick)

  // 清除所有pending的timeout
  positionTimeouts.forEach(id => clearTimeout(id))
  // 清除防抖定时器
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer)
  }
})

// 监听显示状态变化，在显示状态改变时准确更新位置和管理点击监听器
watch(() => props.modelValue, (newVal: boolean) => {
  if (newVal) {
    // 添加文档点击监听器
    // 使用 setTimeout 确保监听器在当前事件循环之后添加，避免立即触发关闭
    setTimeout(() => {
      document.addEventListener('click', handleDocumentClick)
    }, 0)

    // 弹框显示时设置一次位置，确保CSS过渡生效
    if (props.target) {
      // 初始定位，使用 nextTick 确保元素已渲染
      nextTick(() => {
        updatePosition()
        // 可以保留一次短延迟的更新，应对内容可能造成的尺寸变化
        const timeoutId = setTimeout(() => {
          updatePosition()
        }, 50) // 稍微减少延迟
        positionTimeouts.push(timeoutId)
      })
    }
  }
  else {
    // 移除文档点击监听器
    document.removeEventListener('click', handleDocumentClick)

    // 可选：隐藏时清除可能还在等待执行的定位timeout
    positionTimeouts.forEach(id => clearTimeout(id))
    positionTimeouts.length = 0 // 清空数组
    if (scrollDebounceTimer) {
      clearTimeout(scrollDebounceTimer)
      scrollDebounceTimer = null
    }
  }
})

function formatCount(count: number) {
  if (count < 1000) {
    return count
  }
  else if (count < 1000000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  else if (count < 1000000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  else if (count < 1000000000000) {
    return `${(count / 1000000000).toFixed(1).replace(/\.0$/, '')}B`
  }
  else {
    return `${(count / 1000000000000).toFixed(1).replace(/\.0$/, '')}T`
  }
}

// TODO
const fontFamily = ref('font-en')
const arrowAfterStyle = computed(() => {
  return {
    '--arrow-left-position': arrowPositionLeft.value || '50%',
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      ref="bubbleElement"
      class="popup-bubble bg-outer pointer-events-auto fixed z-99999 h-auto max-w-750 border-2 border-[#233f59] rounded-13 border-solid p-15 text-20 text-[#fff] text-stroke-2 text-stroke-[#464646] will-change-transform paint-order"
      :class="{ 'popup-animation': realShow }"
      :style="{ ...computedStyle, fontFamily, ...arrowAfterStyle, visibility: realShow ? 'visible' : 'hidden' }"
    >
      <div
        v-if="boxData?.BoxInfo.BoxType === 1"
        class="grid gap-15"
        :style="gridStyle"
      >
        <div
          v-for="(item, index) in boxData?.Props"
          :key="index"
          class="bg-inner relative h-128 w-128 flex flex-col items-center justify-center rounded-13 bg-[#86c8d5]"
        >
          <img
            :src="getPGImg(item.Icon)"
            alt=""
            class="h-76"
          >
          <div class="mt-5 flex flex-nowrap items-center justify-center text-23">
            <div
              v-if="item.PreviewMinCount && item.PreviewMaxCount"
              class="whitespace-nowrap"
            >
              {{ formatCount(item.PreviewMinCount) }} - {{ formatCount(item.PreviewMaxCount) }}
            </div>
            <div v-else>
              {{ item.Text }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="boxData?.BoxInfo.BoxType === 2"
        class="min-h-251 flex flex-col gap-15"
      >
        <div class="bg-inner h-104 w-full f-c">
          <img
            :src="getPGImg(typeTwoMaxRollCountItem?.Icon)"
            alt=""
            class="mr-16 h-full -mt-20"
          >
          <div class="flex flex-col items-start text-23">
            <div class="text-21 color-[#464646] leading-36">
              1 out of {{ typeTwoMaxRollCountItem?.MaxRollCount }} chests contains a
            </div>

            <div class="dual-color-text relative text-40 text-stroke-2 text-stroke-[#8c4a03] paint-order">
              <span
                class="absolute inset-0 text-[#8c4a03]"
                style="text-shadow: 0px 0.03rem 0px 0px #8c4a03"
              >JOKER CARD</span>
              <span class="gold-gradient-text relative z-10">JOKER CARD</span>
            </div>
          </div>
        </div>
        <div
          class="grid gap-15"
          :style="gridStyle"
        >
          <div
            v-for="(item, index) in typeTwoOtherItem"
            :key="index"
            class="bg-inner relative h-128 w-128 flex flex-col items-center justify-center rounded-13"
          >
            <img
              :src="getPGImg(item.Icon)"
              alt=""
              class="h-76"
            >
            <div class="mt-5 flex flex-nowrap items-center justify-center text-23">
              <div
                v-if="item.PreviewMinCount && item.PreviewMaxCount"
                class="whitespace-nowrap"
              >
                {{ formatCount(item.PreviewMinCount) }} - {{ formatCount(item.PreviewMaxCount) }}
              </div>
              <div v-else>
                {{ item.Text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="boxData?.BoxInfo.BoxType === 3"
        class="relative min-h-284"
      >
        <img
          :src="getPGImg(boxData?.BoxInfo.Pic[0])"
          alt=""
          class="w-475"
        >
        <div class="absolute bottom-10 left-17 h-90 w-440 flex items-center justify-evenly">
          <div
            v-for="(item, index) in boxData?.Props"
            :key="index"
            class="relative flex flex-col items-center justify-center"
          >
            <img
              :src="getPGImg(item.Icon)"
              alt=""
              class="h-60"
            >
            <div class="flex flex-nowrap items-center justify-center text-24 -mt-10">
              <div
                v-if="item.PreviewMinCount && item.PreviewMaxCount"
                class="whitespace-nowrap"
              >
                {{ formatCount(item.PreviewMinCount) }} - {{ formatCount(item.PreviewMaxCount) }}
              </div>
              <div v-else>
                {{ item.Text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="boxData?.BoxInfo.BoxType === 4"
        class="relative min-h-331"
      >
        <img
          :src="getPGImg(boxData?.BoxInfo.Pic[0])"
          alt=""
          class="w-543"
        >
        <img
          :src="getPGImg(boxData?.BoxInfo.Pic[1])"
          alt=""
          class="absolute left-1/2 top-30 h-200 -translate-x-1/2"
        >
        <div class="absolute left-1/2 top-230 f-c text-36 text-stroke-2 text-stroke-[#203e51] paint-order -translate-x-1/2">
          <div class="color-[#ffed22]">
            x{{ boxData?.Props[0].DeltaCount }}&nbsp;
          </div>
          <div>
            Cards
          </div>
        </div>
        <div
          v-if="typeFourProgressItem"
          class="absolute bottom-3 left-0 h-53 w-full flex items-center justify-evenly rounded-b-13 bg-[#000] opacity-20"
        />
        <div
          v-if="typeFourProgressItem"
          class="absolute bottom-3 left-0 h-53 w-full f-c"
        >
          <!-- 进度条容器 -->
          <div class="progress-mask relative h-23 w-306 f-c overflow-hidden rounded-full">
            <!-- 进度条填充部分 -->
            <div
              class="progress-bar absolute left-0 top-0 h-full f-c rounded-l-full"
              :style="{ width: `${(typeFourProgressItem.BoxCurOpenCount as number / (typeFourProgressItem.BoxMiniCount as number)) * 100}%` }"
            />

            <div class="z-10 text-22 text-[#d8ffff] font-medium drop-shadow-md">
              {{ typeFourProgressItem.BoxCurOpenCount }}/{{ typeFourProgressItem.BoxMiniCount }}
            </div>

            <!-- 光泽效果 -->
            <!-- <div class="absolute left-0 top-0 h-1/2 w-full rounded-t-full bg-white bg-opacity-15" /> -->
          </div>
          <img
            :src="getPGImg(typeFourProgressItem?.Icon)"
            alt=""
            class="absolute left-85 top-0 z-30 h-53"
          >
          <img
            :src="getPGImg(boxData?.Props[0].Icon)"
            alt=""
            class="absolute right-85 top-0 z-30 h-53"
          >
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* 气泡箭头样式 - 使用伪元素实现 */
.popup-bubble::after {
  content: '';
  position: absolute;
  bottom: -0.19rem;
  /* 位于气泡底部下方 */
  left: var(--arrow-left-position, 50%);
  /* 动态定位 */
  width: 0;
  height: 0;
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #daecef;
  transform: translateX(-50%);
  z-index: 2;
  /* 确保箭头在最前面 */
  will-change: left;
  /* transition: left 0.15s ease-out; */
}

/* 气泡边框箭头 - 使箭头周围有边框效果 */
.popup-bubble::before {
  content: '';
  position: absolute;
  bottom: -0.21rem;
  left: var(--arrow-left-position, 50%);
  width: 0;
  height: 0;
  border-left: 0.21rem solid transparent;
  border-right: 0.21rem solid transparent;
  border-top: 0.21rem solid #233f59;
  transform: translateX(-50%);
  z-index: 1;
  will-change: left;
  /* transition: left 0.15s ease-out; */
}

/* 气泡样式 */
.popup-bubble {
  position: relative;
  transform-origin: top;
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 添加动画效果 */
.popup-animation {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 确保内容区域正确布局 */
.bubble-content {
  width: 100%;
  height: 100%;
}

.bg-outer {
  /* background-image: linear-gradient(#daecef, #daecef), linear-gradient(0deg,
      #f7e9d4 0%,
      #fbeed2 100%),
    linear-gradient(#cbe5e9,
      #cbe5e9); */
  background-color: #daecef;
  background-blend-mode: normal, normal;
  box-shadow: 0px 0.01rem 0px 0px rgba(255, 255, 255, 0.34), inset 0px 0.02rem 0px 0px rgba(34, 130, 142, 0.15);
}

.bg-inner {
  background-image: linear-gradient(#86c8d5,
      #86c8d5),
    linear-gradient(#eecbb4,
      #eecbb4);
  background-blend-mode: normal, normal;
  box-shadow: 0px 0.01rem 0px 0px rgba(255, 255, 255, 0.34), inset 0px 0.02rem 0px 0px rgba(34, 130, 142, 0.15);
}

.progress-bar {
  background-image: linear-gradient(0deg,
      #1a90c1 0%,
      #4fffe0 100%),
    linear-gradient(#f68400,
      #f68400);
  background-blend-mode: normal,
    normal;
}

.progress-mask {
  background-color: #270631;
  box-shadow: inset 0px -3px 7px 0px rgba(44, 13, 73, 0.64),
    inset 0px 2px 7px 0px rgba(1, 13, 20, 0.42);
  border-radius: 11px;
  opacity: 0.95;
}

.gold-gradient-text {
  background: linear-gradient(0deg, #ffc902 0%, #fff839 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  /* 移除文字阴影，因为我们现在使用双层文本 */
}

.dual-color-text {
  /* 确保两层文本完全重叠 */
  display: inline-block;
  position: relative;
}
</style>
