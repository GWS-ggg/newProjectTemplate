<script setup lang="ts">
function getImageUrl(name: string) {
  return new URL(`../../assets/images/gifts/battlePass/${name}`, import.meta.url).href
}
const imgMap = {
  bgImg: getImageUrl('周年庆-预告图.png'),
  goldImg: getImageUrl('201.png'),
  potionImg: getImageUrl('药水魔力瓶.png'),
  box2Img: getImageUrl('卡牌宝箱2.png'),
  box3Img: getImageUrl('卡牌宝箱3.png'),
  cardImg: getImageUrl('卡牌多送icon-120X120.png'),
  hamburgerImg: getImageUrl('行为礼包-汉堡包1.png'),
  diamondImg: getImageUrl('203.png'),
  btnImg: getImageUrl('btn_轮盘礼包按钮+每日登录按钮+battle pass按钮.png'),
  iconImg: getImageUrl('battle-pass普通.png'),
}
interface Goods {
  img: string
  desc?: string
}

const goodsList: Goods[] = [
  {
    img: imgMap.potionImg,
    desc: '100',
  },
  {
    img: imgMap.goldImg,
  },
  {
    img: imgMap.goldImg,
    desc: '100',
  },
  {
    img: imgMap.goldImg,
    desc: '100',
  },
  {
    img: imgMap.goldImg,
  },
  {
    img: imgMap.box3Img,
    desc: '2',
  },
  {
    img: imgMap.box2Img,
  },
  {
    img: imgMap.cardImg,
    desc: '60mins',
  },
  {
    img: imgMap.diamondImg,
    desc: '100',
  },
  {
    img: imgMap.hamburgerImg,
  },
]
</script>

<template>
  <div class="w-full flex flex-col items-center text-32">
    <div class="relative my-40 h-927 w-550">
      <div class="absolute left-1/2 top-0 -translate-x-1/2">
        <div class="h-95 w-353">
          <div class="golden-banner">
            <div class="f-c">
              <img
                :src="imgMap.iconImg"
                alt=""
                class="w-60"
              >
              <div class="relative text-24">
                <!-- 底层：只有阴影的文字 -->
                <div
                  class="absolute inset-0 text-transparent"
                  style="text-shadow: 0px 2px 0px rgba(253, 219, 118, 0.75);"
                >
                  SUPER CHAMPION
                </div>
                <!-- 顶层：只有渐变的文字 -->
                <div class="gradient-text-with-shadow-title relative">
                  SUPER CHAMPION
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        :src="imgMap.bgImg"
        alt=""
        class="w-full"
      >
      <div class="absolute left-200 top-512 h-44 w-135 f-c">
        <div class="text-30 text-[#ac5500]">
          2000
        </div>
      </div>
      <div class="absolute left-1/2 top-110 h-35 w-262 f-c rounded-16 bg-[#0d1b10] bg-opacity-26 -translate-x-1/2">
        <div class="text-24 text-white">
          Opens  in 30.00.00
        </div>
      </div>

      <div class="absolute bottom-130 left-1/2 h-210 w-506 rounded-20 bg-[#0d1b10] bg-opacity-66 -translate-x-1/2">
        <div class="relative flex flex-col items-center justify-center">
          <div class="absolute left-1/2 top-0 text-60 -translate-1/2">
            <div class="relative">
              <!-- 底层：只有阴影的文字 -->
              <div
                class="absolute inset-0 text-transparent"
                style="text-shadow: 0px 2px 0px #bd7207;"
              >
                +
              </div>

              <!-- 顶层：只有渐变的文字 -->
              <div class="gradient-text-with-shadow relative">
                +
              </div>
            </div>
          </div>
          <div class="complex-text mt-30 text-24 color-[#ffd952] font-medium text-stroke-0.2 text-stroke-[#26073a]">
            赛季内包含的其他奖励
          </div>
          <div class="grid grid-cols-5 mt-16 gap-20">
            <template
              v-for="goods in goodsList"
              :key="goods.img"
            >
              <div class="relative flex flex-col items-center justify-center">
                <img
                  :src="goods.img"
                  alt=""
                  class="w-47"
                >
                <div class="absolute bottom-0 left-1/2 translate-y-1/2 text-22 text-stroke-2 text-stroke-[#464646] -translate-x-1/2">
                  {{ goods.desc }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-18 left-1/2 h-94 w-313 bg-cover bg-no-repeat -translate-x-1/2"
        :style="{ backgroundImage: `url(${imgMap.btnImg})` }"
      >
        <div class="h-full w-full f-c text-38 text-stroke-1 text-stroke-[#164b2e]">
          $5.99
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text-with-shadow {
  /* 渐变背景 */
  background: linear-gradient(0deg, #ffc73b 0%, #ffec69 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  /* 文字阴影 */
  // text-shadow: 0px 2px 0px #bd7207;
}
.gradient-text-with-shadow-title {
  /* 渐变背景 */
  background: linear-gradient(0deg, #923706 0%, #923706 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  /* 文字阴影 */
  // text-shadow: 0px 2px 0px #bd7207;
}

.golden-banner {
  position: relative;
  width: 100%;
  height: 100%;
  /* 金色渐变背景 */
  background: #f3a800;
  /* 半圆形底部 */
   /* 水平半径: 左上 右上 右下 左下 / 垂直半径: 左上 右上 右下 左下 */
  border-radius: 0 0 50% 50% / 0 0 90% 90%;
  /* 外边框 */
  border: 2px solid #d06c00;
  border-top: none;
  /* 阴影效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 内部光泽效果 */
  overflow: hidden;
}

/* 内部边框 */
.golden-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  bottom: 10px;
  /* 内部边框也是半圆形 */
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  border: 6px solid #d06c00;
  border-top: none;
  pointer-events: none;
}

/* 虚线分隔线 */
// .golden-banner::after {
//   content: "";
//   position: absolute;
//   top: 60px; /* 可以调整位置 */
//   left: 0;
//   right: 0;
//   height: 1px;
//   border-top: 1px dashed #c17e00;
//   opacity: 0.5;
// }
</style>
