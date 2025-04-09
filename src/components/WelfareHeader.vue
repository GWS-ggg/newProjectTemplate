<script setup lang="ts">
import { useScoreElementStore } from '@/store/modules/scoreElement'
import { computed, ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../assets/images/WelfareHeader/${name}`, import.meta.url).href
}
const scoreElementStore = useScoreElementStore()
const vipLevel = ref(5)

const vipLevelList = ref([
  {
    level: 0,
    name: 'VIP1',
    icon: getImageUrl('icon_会员卡1.png'),
  },
  {
    level: 1,
    name: 'VIP2',
    icon: getImageUrl('icon_会员卡2.png'),
  },
  {
    level: 2,
    name: 'VIP3',
    icon: getImageUrl('icon_会员卡3.png'),
  },
  {
    level: 3,
    name: 'VIP4',
    icon: getImageUrl('icon_会员卡4.png'),
  },
  {
    level: 4,
    name: 'VIP5',
    icon: getImageUrl('icon_会员卡5.png'),
  },
  {
    level: 5,
    name: 'VIP6',
    icon: getImageUrl('icon_会员卡6.png'),
  },
])

const currentVipLevel = computed(() => vipLevelList.value[vipLevel.value])
</script>

<template>
  <div class="h-304 w-full flex items-center">
    <div class="relative h-full w-[40%]">
      <div class="absolute left-50 top-30 z-10 w-[80%]">
        <div class="relative aspect-square w-full f-c">
          <div class="mb-40 flex flex-col">
            <div class="mt-40 f-c text-40 color-[#e77bff]">
              welfare
            </div>
            <div
              class="text-61 text-[#fff309] font-bold"
              style="text-shadow:  3px 3px 0 #5b1800,  -1px 1px 0 #5b1800;"
            >
              100%
            </div>
            <div class="f-e text-30 text-[#acb3ff] text-stroke-2 text-stroke-[#271a58] paint-order">
              more
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start">
      <div class="gradient-text text-52 text-stroke-2 text-stroke-[#632b0e] paint-order">
        same price
      </div>
      <div class="gradient-text text-52 text-stroke-2 text-stroke-[#632b0e] paint-order">
        More Rewards
      </div>
      <div class="flex items-center">
        <img
          :ref="el => scoreElementStore.setScoreRef(el as HTMLElement)"
          :src="currentVipLevel.icon"
          alt=""
          class="z-10 w-78"
        >
        <div class="rounded-[15px] bg-[#200b49] bg-opacity-35 bg-cover bg-no-repeat px-[15px] py-[5px] text-white text-stroke-1 text-stroke-[#181818] paint-order -ml-12">
          21/100
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welfare-header {
  background-image: url('@/assets/images/WelfareHeader/img_背景_上.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.board-bg {
  background-image: url('@/assets/images/WelfareHeader/img_board.png');
  background-size: cover;
  background-position: center;
}
.bg-linear {
  -webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background: linear-gradient(0deg, #647eff, #F2C511)
}
.gradient-text {
  /* 渐变背景，可以自定义多个颜色段 */
  background: linear-gradient(180deg, #fdff79 27%, #f76901 100%);
  /* 让背景只作用于文字部分 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
