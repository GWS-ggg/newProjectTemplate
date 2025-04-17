<script setup lang="ts">
import type { BattlePassItemInfo } from '@/types'
import { getProductListApi } from '@/api/index'
// 按钮点击动画
import AnimatedIcon from '@/components/AnimatedIcon.vue'

import { useScoreElementStore } from '@/store/modules/scoreElement'
import { formatPrice } from '@/utils'
import { computed, ref } from 'vue'

// 获取积分元素引用
const { scoreRef } = useScoreElementStore()

// API数据
const itemInfoList = ref<BattlePassItemInfo[]>([])

// 资源URL辅助函数
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/newBattlePass/${name}`, import.meta.url).href
}

// 图片资源映射
const imgMap = {
  bg1Img: getImageUrl('赛季_0001_1.png'),
  bg2Img: getImageUrl('赛季_0000_2.png'),
  passImg: getImageUrl('赛季入口图标彩色-没进度条.png'),
  pass2Img: getImageUrl('通行证图标1.png'),
  boxImg: getImageUrl('通行证宝箱图标5.png'),
  giftImg: getImageUrl('通行证图标2.png'),
  gift2Img: getImageUrl('通行证图标3.png'),
}

const scoreIconImg = new URL('../../assets/images/common/icon_score.png', import.meta.url).href
const okImg = new URL('../../assets/images/common/icon_ok.png', import.meta.url).href
// 礼物数据类型
interface Gift {
  id: number
  iconImg: string
  title: string
  desc?: string
}

// 礼物列表数据
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
    title: 'Silver Name & Gifts for Team',
  },
])

// 商品数据相关计算属性
const firstProduct = computed(() => itemInfoList.value[0] || { Price: 0, Props: [{ VipScore: 0 }], AddProps: [{ VipScore: 0 }] })
const secondProduct = computed(() => itemInfoList.value[1] || { Price: 0, Props: [{ VipScore: 0 }], AddProps: [{ VipScore: 0 }] })

// 动画相关引用
// 第一个按钮
const scoreIconRef = ref<HTMLElement | null>(null)
const scoreAddIconRef = ref<HTMLElement | null>(null)
const animatedIconRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)
const animatedIconAddRef = ref<InstanceType<typeof AnimatedIcon> | null>(null)

// 第二个按钮
const scoreIconRefSecond = ref<HTMLElement | null>(null)
const scoreAddIconRefSecond = ref<HTMLElement | null>(null)
const animatedIconRefSecond = ref<InstanceType<typeof AnimatedIcon> | null>(null)
const animatedIconAddRefSecond = ref<InstanceType<typeof AnimatedIcon> | null>(null)

// 通用触发动画函数
function triggerAnimation(mainRef: any, addRef: any) {
  if (mainRef?.value) {
    mainRef.value.triggerAnimation()
    addRef?.value?.triggerAnimation()
  }
}

// 按钮点击事件处理函数
function handleBtnClick(id: number, itemInfo: BattlePassItemInfo) {
  console.log('handleBtnClick', id)
  if (id === 1) {
    triggerAnimation(animatedIconRef, animatedIconAddRef)
  }
  else {
    triggerAnimation(animatedIconRefSecond, animatedIconAddRefSecond)
  }

  itemInfo.BuyTimes = 1
}

// 获取商品数据
async function getProductList() {
  try {
    const res = await getProductListApi({
      appid: '616876868660610',
      uid: '102191',
      producttype: 2,
    })
    itemInfoList.value = res.ItemInfo as BattlePassItemInfo[]
    itemInfoList.value.forEach((item) => {
      if (item.BuyTimes === undefined)
        item.BuyTimes = 0
    })
    console.log('battle pass itemInfoList', itemInfoList.value)
  }
  catch (error) {
    console.error('Failed to fetch product list:', error)
  }
}

// 初始化数据
getProductList()
</script>

<template>
  <div class="relative mb-30 flex flex-col items-center text-29 color-white leading-tight">
    <div class="mt-30 text-29 color-[#fff] text-stroke-3 text-stroke-[#19093e] paint-order">
      仅限此赛季
    </div>

    <!-- 第一个通行证卡片 -->
    <div
      class="relative mt-20 h-636 w-667 flex flex-col bg-cover bg-center bg-no-repeat px-20 py-20"
      :style="{ backgroundImage: `url(${imgMap.bg1Img})` }"
    >
      <div class="flex flex-1 flex-col justify-start">
        <!-- 卡片标题 -->
        <div class="ml-10 text-40 color-[#fbd506] leading-44">
          Super piggy pass
        </div>

        <!-- 分隔线 -->
        <div
          class="mt-8 border border-[#303487] rounded-1 border-solid"
          style="box-shadow: 0px 1px 0px 0px rgba(120, 125, 250, 0.34);"
        />

        <!-- 礼物列表 -->
        <div class="ml-40 mt-30 flex flex-col gap-24">
          <div
            v-for="item in giftList"
            :key="item.id"
            class="flex gap-24"
          >
            <!-- 礼物图标 -->
            <div class="w-120 f-c">
              <img
                :src="item.iconImg"
                class="h-80"
                alt="Gift icon"
              >
            </div>

            <!-- 礼物描述 -->
            <div class="f-c flex-col">
              <div class="text-stroke-4 text-stroke-[#3e3d94] paint-order">
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

        <!-- 购买按钮 -->
        <div
          class="absolute bottom-0 left-1/2 h-100 w-667 f-c text-40 color-[#944d07] -translate-x-1/2"
          @click="handleBtnClick(1, firstProduct)"
        >
          <div class="relative h-full w-full f-c cursor-pointer">
            <div v-if="firstProduct.BuyTimes === 0">
              {{ formatPrice(firstProduct.Price) }}
            </div>
            <div
              v-else
              class="fade-in h-full f-c -mt-10"
            >
              <img
                class="h-90"
                :src="okImg"
                alt=""
              >
            </div>
            <!-- 积分气泡 -->
            <div
              v-show="firstProduct.BuyTimes === 0"
              class="absolute right-70 h-91 translate-x-1/2 -top-34"
            >
              <div class="relative">
                <img
                  src="@/assets/images/components/GreenButton/img_气泡_大.png"
                  alt="分数气泡"
                  class="h-91 w-173"
                >
                <div class="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                  <!-- 主分数显示 -->
                  <div class="relative flex items-center justify-center -mr-10">
                    <img
                      ref="scoreIconRef"
                      :src="scoreIconImg"
                      alt="积分图标"
                      class="h-73"
                    >
                    <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                      {{ firstProduct.Props[0]?.VipScore || 0 }}
                    </div>
                  </div>

                  <!-- 加号 -->
                  <img
                    src="@/assets/images/components/GreenButton/img_+.png"
                    alt="加号"
                    class="h-30"
                  >

                  <!-- 额外分数显示 -->
                  <div class="relative flex items-center justify-center -ml-10">
                    <img
                      ref="scoreAddIconRef"
                      :src="scoreIconImg"
                      alt="额外积分图标"
                      class="h-73"
                    >
                    <!-- Bonus标签 -->
                    <div class="absolute top-20 rotate-15 text-24 -right-10 -mt-25">
                      <div class="flex flex-col items-end font-normal">
                        <div class="dual-color-text relative">
                          <div class="absolute inset-0 text-[#ffe318] text-stroke-3 text-stroke-[#ffffff] paint-order">
                            bonus
                          </div>
                          <div class="red-gradient-text relative z-10">
                            bonus
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                      {{ firstProduct.AddProps[0]?.VipScore || 0 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二个通行证卡片 -->
    <div
      class="relative mt-20 h-401 w-667 flex flex-col bg-cover bg-center bg-no-repeat px-20 py-20"
      :style="{ backgroundImage: `url(${imgMap.bg2Img})` }"
    >
      <div class="flex flex-1 flex-col justify-start">
        <!-- 卡片标题 -->
        <div class="ml-10 text-40 color-[#fbd506] leading-44">
          Super pass
        </div>

        <!-- 分隔线 -->
        <div
          class="mt-8 border border-[#303487] rounded-1 border-solid"
          style="box-shadow: 0px 1px 0px 0px rgba(120, 125, 250, 0.34);"
        />

        <!-- 礼物列表 -->
        <div class="ml-40 mt-30 flex flex-col gap-24">
          <div
            v-for="item in giftList2"
            :key="item.id"
            class="flex gap-24"
          >
            <!-- 礼物图标 -->
            <div class="w-120 f-c">
              <img
                :src="item.iconImg"
                class="h-80"
                alt="Gift icon"
              >
            </div>

            <!-- 礼物描述 -->
            <div class="f-c flex-col">
              <div class="text-stroke-4 text-stroke-[#3e3d94] paint-order">
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

        <!-- 购买按钮 -->
        <div
          class="absolute bottom-0 left-1/2 h-100 w-667 f-c text-40 color-[#133e8a] -translate-x-1/2"
          @click="handleBtnClick(2, secondProduct)"
        >
          <div class="relative h-full w-full f-c cursor-pointer">
            <div v-if="secondProduct.BuyTimes === 0">
              {{ formatPrice(secondProduct.Price) }}
            </div>
            <div
              v-else
              class="fade-in h-full f-c -mt-10"
            >
              <img
                class="h-90"
                :src="okImg"
                alt=""
              >
            </div>
            <!-- 积分气泡 -->
            <div
              v-show="secondProduct.BuyTimes === 0"
              class="absolute right-70 h-91 translate-x-1/2 -top-34"
            >
              <div class="relative">
                <img
                  src="@/assets/images/components/GreenButton/img_气泡_大.png"
                  alt="分数气泡"
                  class="h-91 w-173"
                >
                <div class="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                  <!-- 主分数显示 -->
                  <div class="relative flex items-center justify-center -mr-10">
                    <img
                      ref="scoreIconRefSecond"
                      :src="scoreIconImg"
                      alt="积分图标"
                      class="h-73"
                    >
                    <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                      {{ secondProduct.Props[0]?.VipScore || 0 }}
                    </div>
                  </div>

                  <!-- 加号 -->
                  <img
                    src="@/assets/images/components/GreenButton/img_+.png"
                    alt="加号"
                    class="h-30"
                  >

                  <!-- 额外分数显示 -->
                  <div class="relative flex items-center justify-center -ml-10">
                    <img
                      ref="scoreAddIconRefSecond"
                      :src="scoreIconImg"
                      alt="额外积分图标"
                      class="h-73"
                    >
                    <!-- Bonus标签 -->
                    <div class="absolute top-20 rotate-15 text-24 -right-10 -mt-25">
                      <div class="flex flex-col items-end font-normal">
                        <div class="dual-color-text relative">
                          <div class="absolute inset-0 text-[#ffe318] text-stroke-3 text-stroke-[#ffffff] paint-order">
                            bonus
                          </div>
                          <div class="red-gradient-text relative z-10">
                            bonus
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="absolute bottom-0 left-1/2 text-24 text-white text-stroke-black -mt-25 -translate-x-1/2">
                      {{ secondProduct.AddProps[0]?.VipScore || 0 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 动画图标组件 - 使用单个Teleport包裹所有AnimatedIcon组件 -->
    <Teleport to="body">
      <!-- 第一个按钮的动画组件 -->
      <AnimatedIcon
        ref="animatedIconRef"
        :icon-url="scoreIconImg"
        :score="firstProduct.Props[0]?.VipScore || 0"
        :start-element="scoreIconRef"
        :target-element="scoreRef"
      />
      <AnimatedIcon
        ref="animatedIconAddRef"
        :icon-url="scoreIconImg"
        :score="firstProduct.AddProps[0]?.VipScore || 0"
        :start-element="scoreAddIconRef"
        :target-element="scoreRef"
      />

      <!-- 第二个按钮的动画组件 -->
      <AnimatedIcon
        ref="animatedIconRefSecond"
        :icon-url="scoreIconImg"
        :score="secondProduct.Props[0]?.VipScore || 0"
        :start-element="scoreIconRefSecond"
        :target-element="scoreRef"
      />
      <AnimatedIcon
        ref="animatedIconAddRefSecond"
        :icon-url="scoreIconImg"
        :score="secondProduct.AddProps[0]?.VipScore || 0"
        :start-element="scoreAddIconRefSecond"
        :target-element="scoreRef"
      />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.dual-color-text {
  /* 确保两层文本完全重叠 */
  display: inline-block;
  position: relative;
}

.red-gradient-text {
  background: linear-gradient(355deg, #e71010 33%, #f35d2a 49%, #ffa943 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
