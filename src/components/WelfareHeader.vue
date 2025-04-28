<script setup lang="ts">
import { useLoginStore } from '@/store/modules/loginStore'
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
const loginStore = useLoginStore()

const loginInfo = computed(() => loginStore.loginInfo)
setTimeout(() => {
  loginStore.setLoginInfo({
    username: 'test',
    viplevel: 5,
    vipscore: 100,
    viptargetscore: 100,
  })
}, 3000)
</script>

<template>
  <div class="h-304 w-full flex">
    <div class="relative h-full w-[40%]">
      <div class="absolute left-50 top-30 z-10 w-[80%]">
        <div class="relative aspect-square w-full f-c">
          <div class="mb-40 flex flex-col">
            <div class="mt-40 f-c text-40 color-[#e77bff]">
              welfare
            </div>
            <div class="text-61">
              <TextStroke
                stroke-color="#5b1800"
                :stroke-width="3"
                text-color="#fff309"
              >
                100%
              </TextStroke>
            </div>
            <div class="f-e text-30">
              <TextStroke
                stroke-color="#271a58"
                :stroke-width="2"
                text-color="#acb3ff"
              >
                more
              </TextStroke>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ml-30 mt-60 flex flex-col items-start">
      <div class="flex flex-col items-start leading-60 -ml-25">
        <div
          class="gradient-text-with-stroke text-52"
          data-text="&nbsp;same price&nbsp;"
        >
          <span>&nbsp;same price&nbsp;</span>
        </div>
        <div
          class="gradient-text-with-stroke text-52"
          data-text="&nbsp;More Rewards&nbsp;"
        >
          <span>&nbsp;More  Rewards&nbsp;</span>
        </div>
      </div>

      <div class="mt-18 flex items-center -ml-10">
        <img
          :ref="el => scoreElementStore.setScoreRef(el as HTMLElement)"
          :src="currentVipLevel.icon"
          alt=""
          class="z-10 w-78"
        >
        <div class="rounded-[24px] bg-[#200b49] bg-opacity-35 bg-cover bg-no-repeat px-25 py-2 pl-35 text-30 text-white -ml-25">
          <TextStroke
            stroke-color="#181818"
            :stroke-width="1"
          >
            {{ loginInfo.vipscore }}/{{ loginInfo.viptargetscore }}
          </TextStroke>
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

/* 添加新的类，专门用于处理渐变文本+描边 */
.gradient-text-with-stroke {
  position: relative;
  z-index: 1;
  display: inline-block;
  --stroke-color: #632b0e;
  --stroke-width: 2px;
  --gradient: linear-gradient(180deg, #fdff79 27%, #f76901 100%);
  width: fit-content;
  // padding: 0 0.1em; /* 增加内边距 */
  overflow: visible; /* 允许内容溢出 */
}

.gradient-text-with-stroke::before {
  content: attr(data-text);
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-text-stroke: var(--stroke-width) var(--stroke-color);
  text-stroke: var(--stroke-width) var(--stroke-color);
  color: transparent;
  white-space: nowrap; /* 确保文本不换行 */
}

.gradient-text-with-stroke span {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap; /* 确保文本不换行 */
  display: block; /* 块级显示更精确控制尺寸 */
  width: 100%;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
</style>
