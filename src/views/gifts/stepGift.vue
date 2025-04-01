<script setup lang="ts">
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/stepGift/${name}`, import.meta.url).href
}

const imgMap: Record<string, string> = {
  bgImg: getImageUrl('_0008_组-2.png'),
  textImg: getImageUrl('文字横条.png'),
  tagImg: getImageUrl('新标签.png'),
  headerImg: getImageUrl('头部1.png'),
  diceImg: getImageUrl('骰子-列表.png'),
  bgImg2: getImageUrl('img_付费副阶梯标签叠加资源.png'),
  bgImg3: getImageUrl('img_付费副阶梯标签叠加资源.png'),
  btn_bg: getImageUrl('btn_6阶N段式按钮_小.png'),
  taskBarImg: getImageUrl('img_付费副阶梯_任务条.png'),
  processBgImg: getImageUrl('img_付费副阶梯_进度条_bg.png'),
  processImg: getImageUrl('img_付费副阶梯_进度条.png'),
  carImg: getImageUrl('传送-列表.png'),
  bombImg: getImageUrl('列表-炮收集.png'),
  stealImg: getImageUrl('列表-偷收集.png'),
  back: new URL('../../assets/images/gifts/icon_back.png', import.meta.url).href,
}

interface Good {
  id: number
  leftImg: string
  rightImg: string
  desc: string
  progress?: number
  processAll?: number
  price: string
}

const goodsList: Good[] = [
  {
    id: 1,
    leftImg: imgMap.carImg,
    rightImg: imgMap.diceImg,
    desc: 'TASK EXPIRED',
    price: '12M',
  },
  {
    id: 2,
    leftImg: imgMap.diceImg,
    rightImg: imgMap.diceImg,
    desc: 'RAID 100 TIMERAID',
    price: '18M',
    progress: 21,
    processAll: 200,
  },
  {
    id: 3,
    leftImg: imgMap.bombImg,
    rightImg: imgMap.diceImg,
    desc: 'RAID 100 TIMERAID',
    price: '18M',
    progress: 21,
    processAll: 200,
  },
  {
    id: 4,
    leftImg: imgMap.stealImg,
    rightImg: imgMap.diceImg,
    desc: 'RAID 100 TIMESRAID',
    price: '18M',
    progress: 21,
    processAll: 200,
  },
  {
    id: 5,
    leftImg: imgMap.stealImg,
    rightImg: imgMap.diceImg,
    desc: 'RAID 100 TUNES',
    price: '18M',
    progress: 21,
    processAll: 200,
  },
]
</script>

<template>
  <div class="relative h-950 flex flex-col items-center text-32">
    <div
      class="w-full flex flex-col items-center justify-center bg-cover bg-center pt-190"
      :style="{ backgroundImage: `url(${imgMap.bgImg})`,
                backgroundSize: '120% auto',
                backgroundPosition: 'center top 10%',
                backgroundRepeat: 'no-repeat' }"
    >
      <div
        class="relative w-full bg-cover bg-center py-10 text-center"
        :style="{ backgroundImage: `url(${imgMap.textImg})` }"
      >
        <div
          class="absolute bottom-10 left-25 h-150 w-150 f-c bg-cover bg-center"
          :style="{ backgroundImage: `url(${imgMap.tagImg})` }"
        >
          <div class="absolute bottom-0 left-0 z-30 h-150 w-150 f-c bg-cover bg-center">
            <img
              :src="imgMap.bgImg2"
              class="h-full w-full"
            >
          </div>
          <!-- 左侧图标 -->
          <div class="gradient-text flex flex-col items-start justify-center text-46 font-normal text-stroke-3 text-stroke-[#7e0a1a] -rotate-10">
            <div class="gradient-text">
              300 %
            </div>
            <div class="gradient-text">
              MORE
            </div>
          </div>
        </div>
        <div class="f-c text-38 text-stroke-2 text-stroke-[#46344a]">
          <div>
            Get up to <span class="color-[#fff44b]">30,000</span>
          </div>
          <img
            :src="imgMap.diceImg"
            class="ml-20 w-45"
          >
        </div>
      </div>
    </div>
    <div
      class="bg-sacle-w-120 h-108 w-full flex flex-shrink-0 justify-center bg-cover bg-center"
      :style="{ backgroundImage: `url(${imgMap.headerImg})`,
      }"
    >
      <div class="flex items-center justify-center -mt-15">
        <div class="mr-20 flex flex-col items-end text-29 font-normal">
          <div class="dual-color-text relative">
            <span
              class="absolute inset-0 text-[#ffffd3] text-stroke-2 text-stroke-[#581368]"
              style="text-shadow: 0px 3px 0px 0px #5f156f"
            >Buy now to Claim</span>
            <span class="gold-gradient-text relative z-10">Buy now to Claim</span>
          </div>
          <div class="dual-color-text relative">
            <span
              class="absolute inset-0 text-[#ffffd3] text-stroke-2 text-stroke-[#581368]"
              style="text-shadow: 0px 3px 0px 0px #5f156f"
            >your earned rewards</span>
            <span class="gold-gradient-text relative z-10">your earned rewards</span>
          </div>
        </div>
        <div class="z-20 h-75 w-220 f-c">
          <GreenButton
            radius="20px"
            border-width="1px"
          >
            <div
              class="z-10 text-47 text-[#1c6904]"
              style="text-shadow: 0px 2px 0px rgba(190, 251, 91, 0.75);"
            >
              $19.00
            </div>
          </GreenButton>
          <!-- <img
            class="absolute left-0 top-0 h-full w-full"
            :src="imgMap.btn_bg"
            alt=""
          > -->
          <!-- <div
            class="z-10 text-47 text-[#1c6904]"
            style="text-shadow: 0px 2px 0px rgba(190, 251, 91, 0.75);"
          >
            $19.00
          </div> -->
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="hide-scrollbar mx-15 h-500 flex flex-shrink-0 flex-col overflow-x-hidden overflow-y-auto rounded-20 bg-[#171f3d] bg-opacity-70 px-10 py-20">
        <template
          v-for="item in goodsList"
          :key="item.id"
        >
          <div
            class="relative mt-7 h-110 w-705 f-b flex-shrink-0 bg-cover text-white"
            :style="{ backgroundImage: `url(${imgMap.taskBarImg})` }"
          >
            <div class="ml-43 f-s">
              <img
                :src="item.leftImg"
                class="w-66"
              >
              <div class="ml-32 flex flex-col">
                <div class="text-31 text-[#426676]">
                  {{ item.desc }}
                </div>
                <div
                  v-if="item.progress"
                  class="relative mt-16 h-37 w-271"
                >
                  <img
                    :src="imgMap.processBgImg"
                    class="h-full w-full"
                  >

                  <div class="absolute left-0 top-0 h-full w-[21%] overflow-hidden">
                    <img
                      :src="imgMap.processImg"
                      class="h-full w-auto"
                    >
                  </div>
                  <div class="absolute left-1/2 top-1/2 text-22 text-white text-stroke-2 text-stroke-[#426676] -translate-x-1/2 -translate-y-1/2">
                    {{ item.progress }} / {{ item.processAll }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mr-37 flex flex-col">
              <img
                :src="item.rightImg"
                class="w-58"
              >
              <div class="text-28 text-stroke-2 text-stroke-[#4d4d4d] -mt-10">
                {{ item.price }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="mb-20 mt-20 w-full f-c">
      <div class="rounded-20 bg-[#232e58] bg-opacity-70 px-20 py-10 text-31 text-white">
        Ends in 30:00:00
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-scale-120 {
  background-size: 120% 120%;
}

.gradient-text {
  /* 渐变背景，可以自定义多个颜色段 */
  background: linear-gradient(-4deg, #fc9b28 0%, #ecfb3c 100%);
  /* 让背景只作用于文字部分 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-sacle-w-120 {
  background-size: 110% 110%;
}

.gold-gradient-text {
  background: linear-gradient(0deg, #f0e8ac 0%, #f9f7dc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  /* 移除文字阴影，因为我们现在使用双层文本 */
}

.dual-color-text {
  /* 确保两层文本完全重叠 */
  display: inline-block;
  position: relative;
}

.btn-text {
  box-shadow: 0px 2px 0px 0px rgba(190, 251, 91, 0.75);
}

/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */

  /* Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
