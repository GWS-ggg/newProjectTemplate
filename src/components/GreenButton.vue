<script setup lang="ts">
import type AnimatedIcon from './AnimatedIcon.vue'
import { useScoreElementStore } from '@/store/modules/scoreElement'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  radius: {
    type: String,
    default: '0.32rem',
  },
  borderWidth: {
    type: String,
    default: '0.02rem',
  },
  score: {
    type: Number,
    default: 0,
  },
  scoreAdd: {
    type: Number,
    default: 0,
  },
  scoreShow: {
    type: Boolean,
    default: false,
  },
  // 蒙版
  maskShow: {
    type: Boolean,
    default: false,
  },
  // 动画目标元素
  scoreTarget: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  // 气泡位置自定义
  bubblePosition: {
    type: Object as () => {
      top?: string
      right?: string
      bottom?: string
      left?: string
      translateX?: string
      translateY?: string
    },
    default: () => ({}),
  },
  // 单个气泡位置
  singleBubblePosition: {
    type: Object as () => {
      top?: string
      right?: string
      bottom?: string
      left?: string
      translateX?: string
      translateY?: string
    },
    default: () => ({}),
  },
})

const { scoreRef } = useScoreElementStore()

const scoreIconRef = ref<HTMLElement | null>(null)
const animatedIconRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)

const scoreAddIconRef = ref<HTMLElement | null>(null)
const animatedIconAddRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)
function getImageUrl(name: string) {
  return new URL(`../assets/images/components/GreenButton/${name}`, import.meta.url).href
}

// 积分图标URL（应根据实际路径调整）
const scoreIconImg = ref('')
scoreIconImg.value = getImageUrl('icon_score.png')

const scoreSingleIconRef = ref<HTMLElement | null>(null)
const animatedIconSingleRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)
// 单个积分 点击按钮时触发积分动画
function triggerScoreSingleAnimation() {
  console.log('triggerScoreSingleAnimation')
  if (animatedIconSingleRef.value && props.score > 0) {
    animatedIconSingleRef.value.triggerAnimation()
  }
}
// 点击按钮时触发积分动画
function triggerScoreAnimation() {
  if (animatedIconRef.value && props.score > 0) {
    animatedIconRef.value.triggerAnimation()
  }
}

function triggerScoreAddAnimation() {
  if (animatedIconAddRef.value && props.scoreAdd > 0) {
    animatedIconAddRef.value.triggerAnimation()
  }
}

const scoreAddShow = computed(() => {
  return props.scoreShow && props.scoreAdd !== 0
})

function triggerAnimation() {
  console.log('triggerAnimation')
  if (!scoreAddShow.value) {
    console.log('triggerScoreSingleAnimation')
    triggerScoreSingleAnimation()
  }
  else {
    triggerScoreAnimation()
    triggerScoreAddAnimation()
  }
}

// 存储当前回调
let currentAnimationCallback: (() => void) | undefined

// 动画完成处理函数
function animationCompletedHandler() {
  console.log('Animation completed')
  if (currentAnimationCallback) {
    currentAnimationCallback()
    currentAnimationCallback = undefined
  }
}

// 带回调的动画触发函数
function triggerAnimationWithCallback(callback?: () => void) {
  console.log('triggerAnimationWithCallback')

  // 存储回调函数以便在事件触发时调用
  currentAnimationCallback = callback

  // 触发动画
  triggerAnimation()

  // 设置超时保证回调会执行
  setTimeout(() => {
    if (currentAnimationCallback) {
      currentAnimationCallback()
      currentAnimationCallback = undefined
    }
  }, 2000)
}

// 暴露方法给父组件
defineExpose({
  triggerAnimation,
  triggerAnimationWithCallback,
})
</script>

<template>
  <div class="relative h-full w-full click-animate">
    <div
      v-if="maskShow"
      class="absolute z-50 bg-[#000] opacity-23 -inset-2"
      :style="{ borderRadius: radius, width: `calc(100% + ${borderWidth} + ${borderWidth})`, height: `calc(100% + ${borderWidth} + ${borderWidth})` }"
    />

    <div class="btn-bg relative h-full w-full flex cursor-pointer items-center justify-center">
      <slot />
      <div
        v-if="!scoreAddShow && scoreShow"
        class="absolute z-50 h-74"
        :style="{
          top: singleBubblePosition.top ?? '-0.3rem',
          right: singleBubblePosition.right ?? '0',
          bottom: singleBubblePosition.bottom,
          left: singleBubblePosition.left,
          transform: `translate(${singleBubblePosition.translateX ?? '50%'}, ${singleBubblePosition.translateY ?? '0'})`,
        }"
      >
        <div class="relative">
          <img
            src="@/assets/images/components/GreenButton/img_气泡_小.png"
            alt=""
            class="h-73 w-74"
          >
          <div class="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="relative mb-4 ml-4 flex items-center justify-center">
              <img
                ref="scoreSingleIconRef"
                :src="scoreIconImg"
                class="h-73"
              >
              <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                {{ score }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="scoreAddShow"
        class="absolute z-50 h-91 scale-[0.8]!"
        :style="{
          top: bubblePosition.top ?? '-40px',
          right: bubblePosition.right ?? '0',
          bottom: bubblePosition.bottom,
          left: bubblePosition.left,
          transform: `translate(${bubblePosition.translateX ?? '50%'}, ${bubblePosition.translateY ?? '0'})`,
        }"
      >
        <div class="relative">
          <img
            src="@/assets/images/components/GreenButton/img_气泡_大.png"
            alt=""
            class="h-91 w-173"
          >
          <div class="absolute left-1/2 top-1/2 flex flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="relative flex items-center justify-center -mr-10">
              <img
                ref="scoreIconRef"
                :src="scoreIconImg"
                alt=""
                class="h-73"
              >
              <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                {{ score }}
              </div>
            </div>
            <img
              src="@/assets/images/components/GreenButton/img_+.png"
              alt=""
              class="h-30"
            >
            <div class="relative flex items-center justify-center -ml-10">
              <img
                ref="scoreAddIconRef"
                :src="scoreIconImg"
                alt=""
                class="h-73"
              >
              <div class="absolute top-20 rotate-15 text-24 -right-10 -mt-25">
                <div class="flex flex-col items-end font-normal">
                  <div class="dual-color-text relative">
                    <div class="absolute inset-0 text-[#ffe318] text-stroke-3 text-stroke-[#ffffff] paint-order">
                      bouns
                    </div>
                    <div class="red-gradient-text relative z-10">
                      bouns
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                {{ scoreAdd }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 动画图标组件 -->
    <Teleport to="body">
      <AnimatedIcon
        ref="animatedIconRef"
        :icon-url="scoreIconImg"
        :start-element="scoreIconRef"
        :target-element="scoreRef"
        :score="score"
        @animation-complete="animationCompletedHandler"
      />
    </Teleport>
    <Teleport to="body">
      <AnimatedIcon
        ref="animatedIconAddRef"
        :icon-url="scoreIconImg"
        :start-element="scoreAddIconRef"
        :target-element="scoreRef"
        :score="scoreAdd"
        @animation-complete="animationCompletedHandler"
      />
    </Teleport>

    <Teleport to="body">
      <AnimatedIcon
        ref="animatedIconSingleRef"
        :icon-url="scoreIconImg"
        :start-element="scoreSingleIconRef"
        :target-element="scoreRef"
        :score="score"
        @animation-complete="animationCompletedHandler"
      />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
/* 如果需要额外的样式可以在这里添加 */
.btn-bg {
  position: relative;
  background-image: linear-gradient(0deg, #52c011 0%, #ace81d 99%), linear-gradient(#93d616, #93d616);
  background-blend-mode: normal, normal;
  border-radius: v-bind('radius');
  box-shadow: 0 4px 1px -1px rgba(0,0,0,.2) ,inset 0 -4px 2px -1px #259302;
}

.btn-bg::before {
  content: "";
  position: absolute;
  top: v-bind('`-${borderWidth || "2px"}`');
  left: v-bind('`-${borderWidth || "2px"}`');
  right: v-bind('`-${borderWidth || "2px"}`');
  bottom: v-bind('`-${borderWidth || "2px"}`');
  background: linear-gradient(0deg, #1d6301 0%, #5f9f26 100%);
   border-radius: v-bind('`${radius}`'); /* 动态计算，比按钮圆角大 2px */
  z-index: -1;
}

/* 气泡容器样式 */
.bubble-small-container {
  position: absolute;
  top: -25px;
  right: -15px;
  z-index: 9999; /* 超高层级 */
  pointer-events: none; /* 让用户点击能穿透气泡 */
}

.bubble-large-container {
  position: absolute;
  top: -40px;
  right: -30px;
  z-index: 9999;
  pointer-events: none;
}

.dual-color-text {
  /* 确保两层文本完全重叠 */
  display: inline-block;
  position: relative;
}

.red-gradient-text {
  background: linear-gradient(355deg, #e71010 33%,#f35d2a 49%, #ffa943 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  /* 移除文字阴影，因为我们现在使用双层文本 */
}
</style>
