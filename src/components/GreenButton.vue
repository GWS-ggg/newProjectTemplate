<script setup lang="ts">
import { ref } from 'vue'

defineProps({
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

})
</script>

<template>
  <div class="h-full w-full click-animate">
    <div class="btn-bg relative h-full w-full flex cursor-pointer items-center justify-center">
      <slot />
      <div
        v-show="scoreShow && scoreAdd === 0"
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
        v-show="scoreShow && scoreAdd !== 0"
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
  </div>
</template>

<style lang="scss" scoped>
/* 如果需要额外的样式可以在这里添加 */
.btn-bg {
  position: relative;
  background-image: linear-gradient(0deg, #52c011 0%, #ace81d 99%), linear-gradient(#93d616, #93d616);
  background-blend-mode: normal, normal;
  border-radius: v-bind('radius');
  box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
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
