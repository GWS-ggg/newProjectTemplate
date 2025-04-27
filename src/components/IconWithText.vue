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
  strokeColor?: string
  strokeWidth?: number
  giftType?: number
}

withDefaults(defineProps<Props>(), {
  iconUrl: '',
  text: '',
  iconHeight: 90,
  textClass: '',
  containerClass: 'relative  flex flex-col items-center justify-center',
  useGetPGImg: false,
  bottom: 0,
  textSize: 45,
  textColor: '#fff',
  strokeColor: '#464646',
  strokeWidth: 3,
})
</script>

<template>
  <div :class="containerClass">
    <img
      :src="useGetPGImg ? getPGImg(iconUrl) : iconUrl"
      alt=""
      :class="giftType === 11 ? 'scale-120' : ''"
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
      <TextStroke
        :stroke-color="strokeColor"
        :stroke-width="strokeWidth"
      >
        {{ text }}
      </TextStroke>
    </div>
  </div>
</template>
