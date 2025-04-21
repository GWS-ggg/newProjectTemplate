<script setup lang="ts">
import type { BoxData } from '@/api/types'
import type { Prop } from '@/types'
import type { PropType } from 'vue'
import { getPGImg } from '@/utils'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
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

const emit = defineEmits(['update:modelValue'])

const position = ref({ top: '0rem', left: '0rem' })
// 为箭头位置设置一个安全的默认值，确保始终有值
const arrowPositionLeft = ref('50%') // 默认箭头居中
// 添加标志变量，用于跟踪是否是第一次点击
const isFirstClick = ref(true)

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

// 计算网格布局样式
const gridStyle = computed(() => {
  if (!props.boxData || !props.boxData.Props)
    return {}

  const propsLength = props.boxData.Props.length

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

// 更新弹框位置
function updatePosition() {
  if (!props.target)
    return

  const targetRect = props.target.getBoundingClientRect()
  const bubbleElement = document.querySelector('.popup-bubble') as HTMLElement | null

  // 由于在初次计算时可能还没有渲染完成，所以使用一个预估高度
  let bubbleHeight = bubbleElement?.offsetHeight || 100
  let bubbleWidth = bubbleElement?.offsetWidth || 600

  // 防止获取到0，导致计算错误
  if (bubbleHeight < 10)
    bubbleHeight = 100
  if (bubbleWidth < 10)
    bubbleWidth = 600

  // 计算气泡应该在元素的正上方
  const topPosition = targetRect.top - bubbleHeight - 20 // 20px的额外间距给箭头

  // 计算目标元素的中心点
  const targetCenterX = targetRect.left + (targetRect.width / 2)

  // 计算气泡的左侧位置，使其水平居中对齐
  const leftPosition = targetCenterX - (bubbleWidth / 2)

  // 设置位置
  position.value = {
    top: pxToRem(Math.max(0, topPosition)), // 确保不会显示在页面顶部以外
    left: pxToRem(Math.max(0, Math.min(leftPosition, window.innerWidth - bubbleWidth))), // 同时限制左右边界 // 确保不会超出左边界
  }

  // 先设置一个默认的箭头位置（在气泡中间）
  arrowPositionLeft.value = '50%'

  // 使用延时确保DOM完全渲染后再次计算位置
  setTimeout(() => {
    nextTick(() => {
      try {
        const bubbleRect = bubbleElement?.getBoundingClientRect()
        console.log(bubbleRect, 'bubbleRect')
        if (bubbleRect && bubbleRect.width > 0) {
          // 确保有有效的宽度值
          // arrowPositionLeft.value = pxToRem(bubbleRect.width / 2)

          // 重新计算位置，确保弹窗位置准确
          if (bubbleRect.height > 10 && (Math.abs(bubbleRect.height - bubbleHeight) > 10 || Math.abs(bubbleRect.width - bubbleWidth) > 10)) {
            // 计算新位置
            const newTopPosition = targetRect.top - bubbleRect.height - 20
            const newLeftPosition = targetCenterX - (bubbleRect.width / 2)

            // 更新位置
            position.value = {
              top: pxToRem(Math.max(0, newTopPosition)),
              left: pxToRem(Math.max(0, newLeftPosition)),
            }
          }
        }
      }
      catch (error) {
        console.error('计算箭头位置出错:', error)
      }
    })
  }, 10) // 等待50毫秒确保DOM已完全渲染
}

// 处理文档点击事件
function handleDocumentClick(event: MouseEvent) {
  if (!props.modelValue)
    return

  console.log('close')
  // 获取点击的元素
  const clickedElement = event.target as HTMLElement

  // 检查是否点击在target目标元素上
  const isClickOnTarget = props.target && props.target.contains(clickedElement)

  if (isFirstClick.value) {
    // 第一次点击，只设置标志，不关闭弹窗
    isFirstClick.value = false
    console.log('first click, not closing')
  }
  else {
    // 第二次点击，如果不是点击在target元素上，才关闭弹窗
    if (!isClickOnTarget) {
      console.log('second click, closing')
      emit('update:modelValue', false)
      isFirstClick.value = true
    }
    else {
      console.log('click on target, not closing')
    }
  }
  // // 获取点击的元素
  // const clickedElement = event.target as HTMLElement
  // // 获取弹窗元素
  // const bubbleElement = document.querySelector('.popup-bubble')

  // // 检查目标元素是否为弹窗的一部分或者是触发弹窗的元素
  // if (bubbleElement && !bubbleElement.contains(clickedElement)
  //   && (!props.target || !props.target.contains(clickedElement))) {
  //   // 如果不是，发送事件关闭弹窗
  //   emit('update:modelValue', false)
  // }
}

// 监听目标元素位置变化
onMounted(() => {
  updatePosition()
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
  // 添加点击事件监听
  document.addEventListener('click', handleDocumentClick)
})

// 在组件销毁时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
  // 移除点击事件监听
  document.removeEventListener('click', handleDocumentClick)
})

// 监听props.target的变化
watch(() => props.target, () => {
  nextTick(() => {
    updatePosition()
  })
}, { immediate: true })

// 监听显示状态变化
watch(() => props.modelValue, (newVal: boolean) => {
  if (newVal) {
    // 弹框显示时更新位置
    nextTick(() => {
      updatePosition()
    })
    // 弹框显示时重置点击标志
    isFirstClick.value = true
  }
})
function formatCount(count: number) {
  if (count < 1000) {
    return count
  }
  else if (count < 10000) {
    return `${(count / 1000)}K`
  }
  else if (count < 1000000) {
    return `${(count / 10000)}W`
  }
  else {
    return `${(count / 1000000)}M`
  }
}

// TODO
const fontFamily = ref('font-en')
const progress = ref(50)
const total = ref(100)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
    >
      <div
        v-if="modelValue"
        class="popup-bubble bg-outer pointer-events-auto fixed z-99999 h-auto max-w-750 border-2 border-[#233f59] rounded-13 border-solid p-15 text-20 text-[#fff] text-stroke-2 text-stroke-[#464646] paint-order"
        :style="{ ...computedStyle, fontFamily }"
        @click.stop
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
          class="flex flex-col gap-15"
        >
          <div class="bg-inner h-104 w-full f-c">
            <img
              :src="getPGImg(boxData?.Props[2].Icon)"
              alt=""
              class="mr-16 h-full -mt-20"
            >
            <div class="flex flex-col items-start text-23">
              <div class="text-21 color-[#464646] leading-36">
                1 out of 10 chests contains a
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
              v-for="(item, index) in boxData?.Props"
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
          class="relative"
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
          class="relative"
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
          <div class="absolute bottom-3 left-0 h-53 w-full flex items-center justify-evenly rounded-b-13 bg-[#000] opacity-20" />
          <div class="absolute bottom-3 left-0 h-53 w-full f-c">
            <!-- 进度条容器 -->
            <div class="progress-mask relative h-23 w-306 f-c overflow-hidden rounded-full">
              <!-- 进度条填充部分 -->
              <div
                class="progress-bar absolute left-0 top-0 h-full f-c rounded-l-full"
                :style="{ width: `${progress / total * 100}%` }"
              />

              <div class="z-10 text-22 text-[#d8ffff] font-medium drop-shadow-md">
                {{ progress }}/{{ total }}
              </div>

              <!-- 光泽效果 -->
              <!-- <div class="absolute left-0 top-0 h-1/2 w-full rounded-t-full bg-white bg-opacity-15" /> -->
            </div>
            <img
              :src="getPGImg(prop?.Icon)"
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
    </Transition>
  </Teleport>
</template>

<style>
/* 气泡箭头样式 - 使用伪元素实现 */
.popup-bubble::after {
  content: '';
  position: absolute;
  bottom: -0.19rem;
  /* 位于气泡底部下方 */
  left: v-bind(arrowPositionLeft);
  /* 动态定位 */
  width: 0;
  height: 0;
  border-left: 0.2rem solid transparent;
  border-right: 0.2rem solid transparent;
  border-top: 0.2rem solid #daecef;
  transform: translateX(-50%);
  /* border-color: linear-gradient(#daecef, #daecef), linear-gradient(0deg,
      #f7e9d4 0%,
      #fbeed2 100%),
    linear-gradient(#cbe5e9,
      #cbe5e9); */
  /* 气泡背景色 */
  /* filter: drop-shadow(0 0.04rem 0.04rem rgba(0, 0, 0, 0.2)); */
  /* 添加阴影 */
  z-index: 2;
  /* 确保箭头在最前面 */
}

/* 气泡边框箭头 - 使箭头周围有边框效果 */
.popup-bubble::before {
  content: '';
  position: absolute;
  bottom: -0.21rem;
  left: v-bind(arrowPositionLeft);
  width: 0;
  height: 0;
  border-left: 0.21rem solid transparent;
  border-right: 0.21rem solid transparent;
  border-top: 0.21rem solid #233f59;
  transform: translateX(-50%);
  z-index: 1;
}

/* 气泡样式 */
.popup-bubble {
  position: relative;
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
