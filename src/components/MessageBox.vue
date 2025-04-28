<script lang="ts" setup>
import type { Pop } from '@/types'

const props = withDefaults(defineProps<Props>(), {
  pop: () => {
    return {
      visible: false,
      type: 'success', // 'success' | 'error' | 'failed'
      content: '',
      closeable: false,
      textAlign: 'center',
      defaultBtn: {
        text: '',
        onClick: () => { },
      },
      primaryBtn: {
        text: '',
        onClick: () => { },
      },
    }
  },
})
const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
interface Props {
  pop: Pop
}

// 关闭对话框
function handleClose() {
  emit('update:visible', false)
}

// 确认按钮处理函数
function handleConfirm() {
  // 如果有定义onClick函数，则执行
  if (props.pop.primaryBtn?.onClick) {
    props.pop.primaryBtn.onClick()
  }
  // 关闭对话框
  handleClose()
}

// 取消按钮处理函数
function handleCancel() {
  emit('cancel')
  // 如果有定义onClick函数，则执行
  if (props.pop.defaultBtn?.onClick) {
    props.pop.defaultBtn.onClick()
  }
  // 关闭对话框
  handleClose()
}

// 如果日后需要显示标题，可以取消注释模板中的标题区域
// 并使用此函数返回对应类型的标题文本
// function getTitle(type: string): string {
//   switch (type) {
//     case 'success':
//       return '支付成功'
//     case 'error':
//       return '支付失败'
//     case 'failed':
//       return '下单失败'
//     default:
//       return '提示'
//   }
// }
</script>

<template>
  <div
    v-if="pop.visible"
    class="message-box-wrapper fixed left-0 top-0 z-2000 h-[100vh] w-[100vw] flex items-center justify-center bg-black/20"
  >
    <div class="relative z-100 h-[626px] w-[626px] rounded-[20px] bg-white p-50">
      <!-- <div
        v-if="pop.closeable"
        class="absolute right-20 top-20 z-200 f-c cursor-pointer border-2 border-[#757575] rounded-full border-solid"
        @click="handleClose"
      >
        <div
          class="i-material-symbols:close h-30 w-30"
          style="color:#757575;"
        />
      </div> -->
      <div class="mb-30 w-full flex justify-center">
        <img
          v-if="pop.type === 'success'"
          src="@/assets/icons/success-icon.png"
          alt="成功"
          class="h-[207px] w-[207px]"
        >
        <img
          v-if="pop.type === 'error'"
          src="@/assets/icons/error-icon.png"
          alt="失败"
          class="h-[207px] w-[207px]"
        >
        <img
          v-if="pop.type === 'failed'"
          src="@/assets/icons/error-icon.png"
          alt="失败"
          class="h-[207px] w-[207px]"
        >
      </div>
      <!-- <div class="text-36px font-bold text-center text-[#222C37] mb-20">
        {{ getTitle(pop.type) }}
      </div> -->
      <div
        class="mt-20 f-c whitespace-pre-wrap text-center text-[36px] text-[#222C37] font-normal leading-[34px] tracking-0"
        :class="{
          'text-left': pop.textAlign === 'left',
          'text-right': pop.textAlign === 'right',
        }"
      >
        {{ pop.content }}
      </div>
      <div class="absolute bottom-50 h-[88px] w-[526px] flex justify-between">
        <div
          v-if="pop.defaultBtn?.text"
          class="w-full flex cursor-pointer items-center justify-center bg-[#ED6504] text-[25px] text-[#efefef] font-bold leading-[52px]"
          @click="handleCancel"
        >
          {{ pop.defaultBtn.text }}
        </div>
        <div
          v-if="pop.primaryBtn?.text"
          class="w-full flex justify-between"
        >
          <div
            class="w-full flex cursor-pointer items-center justify-center text-32 text-[#efefef] font-bold leading-[52px] bg-[#ED6504]!"
            @click="handleConfirm"
          >
            {{ pop.primaryBtn.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pop-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);

  .pop-main {
    position: relative;
    z-index: 100;
    padding: 66px 50px 50px;
    width: 626px;
    height: 626px;
    background-color: #fff;
    border-radius: 20px;

    .pop-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      width: 100%;

      img {
        width: 207px;
        height: 207px;
      }
    }

    .pop-title {
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      color: #222C37;
      margin-bottom: 20px;
    }

    .close-btn {
      position: absolute;
      top: 28px;
      right: 28px;
      width: 24px;
      height: 24px;
      background-size: 100%;
      cursor: pointer;
      background-image: url("/img/close-icon.png");
    }

    .pop-content {
      font-size: 30px;
      white-space: pre-wrap;  /* 保留空格和换行符，文本自动换行 */
      color: #222C37;
      font-stretch: normal;
      letter-spacing: 0px;
      line-height: 34px;
    }

    .btns {
      position: absolute;
      bottom: 50px;
      display: flex;
      justify-content: space-between;
      width: 526px;
      height: 88px;

      .btn {
        width: 100%;
      }

      .btn-default {
        background-color: #ED6504;
      }

      .btn+.btn {
        margin-left: 29px;
      }
    }
  }
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-family: "Helvetica-Bold", sans-serif;
  color: #efefef;
  background-color: #3a7bfc;
  font-weight: bold;
  font-stretch: normal;
  line-height: 52px;
  letter-spacing: 0px;
  cursor: pointer;
}

.cover-img {
  img {
    width: 100%;
    height: 100%;
  }
}

.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
</style>
