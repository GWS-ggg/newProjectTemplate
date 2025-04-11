<script setup lang="ts">
import { ref } from 'vue'

function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/threeChoiceOne/${name}`, import.meta.url).href
}

const imgMap = {
  bg1Img: getImageUrl('1.png'),
  bg2Img: getImageUrl('2.png'),
  bg3Img: getImageUrl('3.png'),
  gift1Icon1Img: getImageUrl('体力3.png'),
  gift1Icon2Img: getImageUrl('药水魔力瓶.png'),
  gift1Icon3Img: getImageUrl('钻石1.png'),
  gift2Icon1Img: getImageUrl('体力3.png'),
  gift2Icon2Img: getImageUrl('卡牌宝箱33.png'),
  gift2Icon3Img: getImageUrl('Bet-Blast-低级-礼包活动icon.png'),
  gift3Icon1Img: getImageUrl('体力3.png'),
  gift3Icon2Img: getImageUrl('魔法宝箱.png'),
  gift3Icon3Img: getImageUrl('天降buff-礼包活动icon.png'),
  gift3Icon4Img: getImageUrl('卡牌收益buff-礼包活动icon.png'),
  btnImg: getImageUrl('btn_三选一礼包按钮.png'),
  btnSmallImg: getImageUrl('按钮.png'),
  maskImg: getImageUrl('上锁半透明蒙版.png'),
  lockImg: getImageUrl('三选一礼包_0005_suo-拷贝-3.png'),
}

interface Gift {
  id: number
  iconImg: string
  title?: string
}

const giftList1 = ref<Gift[]>([
  {
    id: 1,
    iconImg: imgMap.gift1Icon1Img,
    title: '750',
  },
  {
    id: 2,
    iconImg: imgMap.gift1Icon2Img,
    title: '20K',
  },
  {
    id: 3,
    iconImg: imgMap.gift1Icon3Img,
    title: '200',
  },
])

const giftList2 = ref<Gift[]>([
  {
    id: 1,
    iconImg: imgMap.gift2Icon1Img,
    title: '1600',
  },
  {
    id: 2,
    iconImg: imgMap.gift2Icon2Img,
  },
  {
    id: 3,
    iconImg: imgMap.gift2Icon3Img,
    title: '10min',
  },
])

const giftList3 = ref<Gift[]>([
  {
    id: 1,
    iconImg: imgMap.gift3Icon1Img,
    title: '2100',
  },
  {
    id: 2,
    iconImg: imgMap.gift3Icon2Img,
  },
  {
    id: 3,
    iconImg: imgMap.gift3Icon3Img,
    title: '10min',
  },
  {
    id: 4,
    iconImg: imgMap.gift3Icon4Img,
    title: '10min',
  },
])

const activeGift = ref(1)
function handleClickGift(id: number) {
  activeGift.value = id
}
// 创建一个24小时后的时间戳
const endTimestamp = ref(Date.now() + 24 * 45 * 60 * 9)
</script>

<template>
  <div class="relative mb-30 f-c flex-col text-29">
    <div class="mt-30 text-29 text-stroke-2 text-stroke-[#19093e]">
      Only one purchase can be made !
    </div>
    <div class="min-h-789 w-700 flex items-end justify-center">
      <div
        class="relative w-233 flex items-center justify-center"
        @click="handleClickGift(0)"
      >
        <img
          class="w-full"
          :src="imgMap.bg1Img"
          alt=""
        >
        <img
          v-if="activeGift !== 0"
          class="absolute bottom-300 left-1/2 z-40 w-170 -translate-x-1/2"
          :src="imgMap.lockImg"
          alt=""
        >
        <div
          v-if="activeGift !== 0"
          class="absolute bottom-20 left-1/2 z-30 h-540 w-170 f-c rounded-14 bg-[#253c6b] opacity-67 -translate-x-1/2"
        />
        <div class="absolute bottom-30 left-0 z-20 w-full flex flex-col items-center justify-end">
          <div class="mb-50 flex flex-col items-center justify-center gap-30">
            <div
              v-for="item in giftList1"
              :key="item.id"
              class="flex flex-col items-center justify-center"
            >
              <img
                class="h-90"
                :src="item.iconImg"
                alt=""
              >
              <div class="text-31 text-stroke-2 text-stroke-[#464646] -mt-15">
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="btn-bg-small h-57 w-155 f-c">
            <div class="text-29 text-stroke-1 text-stroke-[#164b2e]">
              $30.00
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative w-233 flex items-center justify-center"
        @click="handleClickGift(1)"
      >
        <img
          class="w-full"
          :src="imgMap.bg2Img"
          alt=""
        >
        <img
          v-if="activeGift !== 1"
          class="absolute bottom-300 left-1/2 z-40 w-170 -translate-x-1/2"
          :src="imgMap.lockImg"
          alt=""
        >
        <div
          v-if="activeGift !== 1"
          class="absolute bottom-20 left-1/2 z-30 h-591 w-170 f-c rounded-14 bg-[#253c6b] opacity-67 -translate-x-1/2"
        />
        <div class="absolute bottom-30 left-0 w-full flex flex-col items-center justify-end">
          <div class="mb-50 flex flex-col items-center justify-center gap-70">
            <div
              v-for="item in giftList2"
              :key="item.id"
              class="flex flex-col items-center justify-center"
            >
              <img
                class="h-90"
                :src="item.iconImg"
                alt=""
              >
              <div class="text-31 text-stroke-2 text-stroke-[#464646] -mt-15">
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="z-10 h-57 w-155 f-c">
            <GreenButton radius="20px">
              <div class="pai text-29 text-stroke-1 text-stroke-[#164b2e]">
                $30.00
              </div>
            </GreenButton>
          </div>
        </div>
      </div>
      <div
        class="relative w-233 flex items-center justify-center"
        @click="handleClickGift(2)"
      >
        <img
          class="w-full"
          :src="imgMap.bg3Img"
          alt=""
        >
        <img
          v-if="activeGift !== 2"
          class="absolute bottom-300 left-1/2 z-40 w-170 -translate-x-1/2"
          :src="imgMap.lockImg"
          alt=""
        >
        <div
          v-if="activeGift !== 2"
          class="absolute bottom-20 left-1/2 z-30 h-647 w-170 f-c rounded-14 bg-[#253c6b] opacity-67 -translate-x-1/2"
        />
        <div class="absolute bottom-30 left-0 w-full flex flex-col items-center justify-end">
          <div class="mb-50 flex flex-col items-center justify-center gap-40">
            <div
              v-for="item in giftList3"
              :key="item.id"
              class="flex flex-col items-center justify-center"
            >
              <img
                class="h-90"
                :src="item.iconImg"
                alt=""
              >
              <div class="text-31 text-stroke-2 text-stroke-[#464646] -mt-15">
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="btn-bg-small h-57 w-155 f-c">
            <div class="text-29 text-stroke-2 text-stroke-[#164b2e] paint-order">
              $30.00
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="z-10 mt-20 h-90 w-400">
      <GreenButton radius="32px">
        <div class="text-33 text-stroke-3 text-stroke-[#164b2e] paint-order">
          BUY ALL $6.99
        </div>
      </GreenButton>
    </div>

    <div class="mt-20 f-c">
      <CountDown
        :end-time="endTimestamp"
        class="text-26 text-[#f1e49e]"
      >
        <template #default="{ hours, minutes, seconds }">
          End in {{ hours }}:{{ minutes }}:{{ seconds }}
        </template>
      </CountDown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-bg {

    background-image: linear-gradient(0deg,
        #5acd16 0%,
        #ace81d 99%),
      linear-gradient(#66af0f,
        #66af0f);
    background-blend-mode: normal,
      normal;
    box-shadow: 0px 4px 1px 0px rgba(25, 25, 25, 0.36);
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(0deg,
        #1d6301 0%,
        #5f9f26 100%);
    border-radius: 18px;

}

.btn-bg-small {
  background-image: -moz-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  background-image: -webkit-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  background-image: -ms-linear-gradient( 90deg, rgb(82,192,17) 0%, rgb(172,232,29) 99%);
  box-shadow: 0px 2px 0.73px 0.27px rgba(25, 25, 25, 0.36);
  border-radius: 20px;
  border: 1px solid #3E8114;
}
</style>
