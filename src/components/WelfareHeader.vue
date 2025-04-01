<script setup lang="ts"></script>

<template>
  <div class="welfare-header h-240 w-750 flex items-center">
    <div class="relative h-full w-[40%]">
      <div class="absolute left-30 top-30 z-10 w-[80%]">
        <div class="board-bg relative aspect-square w-full f-c">
          <div class="mb-40 flex flex-col gap-10">
            <div class="f-c text-30">
              welfare
            </div>
            <div class="f-c text-50 text-white font-bold">
              100%
            </div>
            <div class="f-e text-white">
              more
            </div>
          </div>
        </div>
      </div>
      <img
        class="absolute left-0 top-0 w-300"
        src="@/assets/images/WelfareHeader/img_光.png"
      >
    </div>
    <div class="flex flex-col items-start gap-10">
      <div class="gradient-text">
        same price
      </div>
      <div class="gradient-text">
        More Rewards
      </div>
      <div class="flex items-center">
        <img
          src="@/assets/images/WelfareHeader/icon_徽章1.png"
          alt=""
          class="h-60 w-60"
        >
        <div class="rounded-[15px] bg-[rgba(0,0,0,0.2)] bg-cover bg-no-repeat px-[15px] py-[5px] text-white -ml-5">
          21/100
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welfare-header {
  background-image: url('@/assets/images/WelfareHeader/img_bg.png');
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
  font-size: 48px;
  font-weight: bold;
  /* 渐变背景，可以自定义多个颜色段 */
  background: linear-gradient(rgba(255,247,112,1) 25%, rgba(248,150,11,1) 80%);
  /* 让背景只作用于文字部分 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
