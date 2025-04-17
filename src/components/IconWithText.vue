<script setup lang="ts">
import { getPGImg } from '@/utils'

interface Props {
  iconUrl?: string
  text?: string
  iconHeight?: number
  textClass?: string
  containerClass?: string
  useGetPGImg?: boolean
  bottom?: number
  textSize?: number
  textColor?: string
}

withDefaults(defineProps<Props>(), {
  iconUrl: '',
  text: '',
  iconHeight: 90,
  textClass: ' text-stroke-3 text-stroke-[#464646] paint-order',
  containerClass: 'relative h-full flex flex-col items-center justify-center',
  useGetPGImg: false,
  bottom: 0,
  textSize: 45,
  textColor: '#fff',
})
</script>

<template>
  <div :class="containerClass">
    <img
      :src="useGetPGImg ? getPGImg(iconUrl) : iconUrl"
      alt=""
      :style="{
        height: `${iconHeight / 100}rem`,
      }"
    >
    <div
      v-if="text"
      class="absolute left-1/2 -translate-x-1/2"
      :class="textClass"
      :style="{
        bottom: `${bottom / 100}rem`,
        fontSize: `${textSize / 100}rem`,
        color: textColor,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>
