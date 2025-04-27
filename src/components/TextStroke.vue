// src/components/TextStroke.vue
<script setup lang="ts">
defineProps({
  // 文本内容
  text: {
    type: String,
    required: true,
  },
  // 描边颜色
  strokeColor: {
    type: String,
    default: '#000',
  },
  // 描边宽度(rem)
  strokeWidth: {
    type: Number,
    default: 3,
  },
  // 文本颜色
  textColor: {
    type: String,
    default: '#fff',
  },
  // 自定义类名
  customClass: {
    type: String,
    default: '',
  },
  // 对齐方式
  align: {
    type: String,
    default: 'center',
  },
})
</script>

<template>
  <div>
    <div
      class="text-stroke-container relative"
      :class="[customClass, `text-${align}`]"
    >
      <!-- 描边层 -->
      <span
        class="absolute inset-0"
        :style="`-webkit-text-stroke: ${strokeWidth / 100}rem ${strokeColor}; text-stroke: ${strokeWidth / 100}rem ${strokeColor};`"
      >
        <slot>{{ text }}</slot>
      </span>
      <!-- 填充层 -->
      <span
        class="relative z-10"
        :style="{ color: textColor }"
      >
        <slot>{{ text }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
.text-stroke-container {
  display: inline-block;
}
</style>
