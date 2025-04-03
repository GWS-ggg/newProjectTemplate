<script setup lang="ts">
import type AnimatedIcon from './AnimatedIcon.vue'
import { useScoreElementStore } from '@/store/modules/scoreElement'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  radius: {
    type: String,
    default: '32px',
  },
  borderWidth: {
    type: String,
    default: '2px',
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
  // 动画目标元素
  scoreTarget: {
    type: Object as () => HTMLElement | null,
    default: null,
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
scoreIconImg.value = getImageUrl('icon_会员积分.png')

const scoreSingleIconRef = ref<HTMLElement | null>(null)
const animatedIconSingleRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)
// 单个积分 点击按钮时触发积分动画
function triggerScoreSingleAnimation() {
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
  if (!scoreAddShow.value) {
    triggerScoreSingleAnimation()
  }
  else {
    triggerScoreAnimation()
    triggerScoreAddAnimation()
  }
}

// 暴露方法给父组件
defineExpose({
  triggerAnimation,
})
</script>

<template>
  <div class="h-full w-full click-animate">
    <div class="btn-bg relative h-full w-full flex cursor-pointer items-center justify-center">
      <slot />
      <div
        v-if="!scoreAddShow"
        class="absolute right-0 h-74 translate-x-1/2 -top-50"
      >
        <div class="relative">
          <img

            src="@/assets/images/components/GreenButton/img_气泡_小.png"
            alt=""
            class="h-73 w-74"
          >
          <div class="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="relative mb-4 flex items-center justify-center">
              <img
                ref="scoreSingleIconRef"
                src="@/assets/images/components/GreenButton/icon_会员积分.png"
                alt=""
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
        class="absolute right-0 h-91 translate-x-1/2 -top-74"
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
                src="@/assets/images/components/GreenButton/icon_会员积分.png"
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
                src="@/assets/images/components/GreenButton/icon_会员积分.png"
                alt=""
                class="h-73"
              >
              <div class="absolute top-20 rotate-10 text-24 text-red -right-10 -mt-25">
                bonus
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
      />
    </Teleport>
    <Teleport to="body">
      <AnimatedIcon
        ref="animatedIconAddRef"
        :icon-url="scoreIconImg"
        :start-element="scoreAddIconRef"
        :target-element="scoreRef"
      />
    </Teleport>

    <Teleport to="body">
      <AnimatedIcon
        ref="animatedIconSingleRef"
        :icon-url="scoreIconImg"
        :start-element="scoreSingleIconRef"
        :target-element="scoreRef"
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
  top: v-bind('`-${borderWidth}`');
  left: v-bind('`-${borderWidth}`');
  right: v-bind('`-${borderWidth}`');
  bottom: v-bind('`-${borderWidth}`');
  background: linear-gradient(0deg, #1d6301 0%, #5f9f26 100%);
  border-radius: v-bind('`calc(${radius} + ${borderWidth})`'); /* 动态计算，比按钮圆角大 2px */
  z-index: -1;
}
</style>
