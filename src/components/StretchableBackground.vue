<script setup>
defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 200,
  },
})
</script>

<template>
  <div
    class="stretchable-bg"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderImageSource: `url(${imageUrl})`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.stretchable-bg {
  border: 30px solid transparent;
  border-image-slice: 30;
  border-image-width: 30px;
  border-image-repeat: stretch;
  box-sizing: border-box;
  background-clip: padding-box;
  position: relative;
}
</style>
