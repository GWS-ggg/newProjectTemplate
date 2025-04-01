<script setup lang="ts">
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/newBattlePass/${name}`, import.meta.url).href
}
const imgMap = {
  bg1Img: getImageUrl('赛季_0001_1.png'),
  bg2Img: getImageUrl('赛季_0000_2.png'),
  passImg: getImageUrl('赛季入口图标彩色-没进度条.png'),
  pass2Img: getImageUrl('通行证图标1.png'),
  boxImg: getImageUrl('通行证宝箱图标5.png'),
  giftImg: getImageUrl('通行证图标2.png'),
  gift2Img: getImageUrl('通行证图标3.png'),
}

interface Gift {
  id: number
  iconImg: string
  title: string
  desc?: string
}
const giftList = ref<Gift[]>([
  {
    id: 1,
    iconImg: imgMap.passImg,
    title: 'Unlock All Rewards',
  },
  {
    id: 2,
    iconImg: imgMap.pass2Img,
    title: 'Reach LV.20 at once',
    desc: '(worth 4000 gems)',
  },
  {
    id: 3,
    iconImg: imgMap.boxImg,
    title: 'Auto Open Card Chest',
  },
  {
    id: 4,
    iconImg: imgMap.giftImg,
    title: 'Gold Name & Gifts for Team',
  },
])
const giftList2 = ref<Gift[]>([
  {
    id: 1,
    iconImg: imgMap.passImg,
    title: 'Unlock All Rewards',
  },
  {
    id: 2,
    iconImg: imgMap.gift2Img,
    title: 'Silver Name & Gifts for Tea,',
  },
])
</script>

<template>
  <div class="relative mb-30 flex flex-col items-center text-29 color-white leading-tight">
    <div class="mt-19 text-29 color-[#fff] text-stroke-0.3 text-stroke-[#19093e]">
      仅限此赛季
    </div>
    <div
      class="relative mt-20 h-636 w-667 flex flex-col bg-cover bg-center bg-no-repeat px-20 py-20"
      :style="{ backgroundImage: `url(${imgMap.bg1Img})` }"
    >
      <div class="flex flex-1 flex-col justify-start">
        <div class="ml-10 text-40 color-[#fbd506] leading-44">
          Super piggy pass
        </div>
        <div
          style="box-shadow: 0px 1px 0px 0px rgba(120, 125, 250, 0.34);"
          class="mt-8 border border-[#303487] rounded-1 border-solid"
        />
        <div class="ml-40 mt-30 flex flex-col gap-24">
          <div
            v-for="item in giftList"
            :key="item.id"
            class="flex gap-24"
          >
            <div class="w-120 f-c">
              <img
                :src="item.iconImg"
                class="h-80"
              >
            </div>

            <div class="f-c flex-col">
              <div class="text-stroke-1 text-stroke-[#3e3d94]">
                {{ item.title }}
              </div>
              <div
                v-if="item.desc"
                class="text-24 color-[#fbd506]"
              >
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-25 left-1/2 text-40 color-[#944d07] -translate-x-1/2">
          <div class="f-c">
            USD 18.99
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative mt-20 h-401 w-667 flex flex-col bg-cover bg-center bg-no-repeat px-20 py-20"
      :style="{ backgroundImage: `url(${imgMap.bg2Img})` }"
    >
      <div class="flex flex-1 flex-col justify-start">
        <div class="ml-10 text-40 color-[#fbd506] leading-44">
          Super pass
        </div>
        <div
          style="box-shadow: 0px 1px 0px 0px rgba(120, 125, 250, 0.34);"
          class="mt-8 border border-[#303487] rounded-1 border-solid"
        />
        <div class="ml-40 mt-30 flex flex-col gap-24">
          <div
            v-for="item in giftList2"
            :key="item.id"
            class="flex gap-24"
          >
            <div class="w-120 f-c">
              <img
                :src="item.iconImg"
                class="h-80"
              >
            </div>

            <div class="f-c flex-col">
              <div class="text-stroke-1 text-stroke-[#3e3d94]">
                {{ item.title }}
              </div>
              <div
                v-if="item.desc"
                class="text-24 color-[#fbd506]"
              >
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-25 left-1/2 text-40 color-[#153e8a] -translate-x-1/2">
          <div class="f-c">
            USD 5.99
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
