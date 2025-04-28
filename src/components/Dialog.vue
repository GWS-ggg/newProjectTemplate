<script setup>
// import Button from '../Button/index.vue'

// 定义过渡时间
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    // 控制开关
    type: Boolean,
    required: true,
  },
  title: {
    // 标题
    type: String,
  },
  cancelText: {
    // 删除按钮文字
    type: String,
    default: '取消',
  },
  okText: {
    // 确认按钮文字
    type: String,
    default: '确认',
  },
  onCancel: {
    // 取消按钮事件
    type: Function,
  },
  onOk: {
    // 确认按钮事件
    type: Function,
  },
  close: {
    // 关闭按钮事件
    type: Function,
  },
  customeClass: {
    type: String,
  },
  fadeVisible: {
    type: Boolean,
    default: true,
  },
  closeButtonShow: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number,
    default: 3000,
  },
})
const emits = defineEmits(['update:modelValue', 'onFadeClose'])
// const DURATION = '0.5s' // 关闭事件
function onClose() {
  emits('update:modelValue', false)
}
// const loading = ref(false)
// // 取消事件
// function onCancel() {
//   props.onCancel?.()
//   onClose()
// }

// // 取消确认
// function onOk() {
//   if (!props.onOk) {
//     onClose()
//     return false
//   }
//   const result = props.onOk()
//   // 判断 result 是不是promise对象？ 如果是则`promise`的状态变为`成功状态时`才会关闭`Dialog`，如果不是则直接关闭
//   if (result && result.then && typeof result.then === 'function') {
//     loading.value = true
//     result
//       .then(() => {
//         onClose()
//       })
//       .finally(() => {
//         loading.value = false
//       })
//   }
//   else {
//     onClose()
//   }
// }

// 遮罩层显示时 滚轮隐藏 固定页面
function disableScroll() {
  document.body.style.overflow = 'hidden'
  document.body.style.width = '100%'
}
function enableScroll() {
  document.body.style.overflow = ''
  document.body.style.width = ''
}
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    disableScroll()
  }
  else {
    enableScroll()
  }
})
function onClickfadeClose() {
  emits('onFadeClose')
}
</script>

<template>
  <teleport to="body">
    <div>
      <!-- 遮罩层 -->
      <transition
        v-if="fadeVisible"
        name="fade"
      >
        <div
          v-if="modelValue"
          class="element-with-scroll fixed left-0 top-0 h-screen w-full bg-zinc-900/80"
          :style="{ zIndex: props.zIndex }"
          @click="onClickfadeClose"
        />
      </transition>
      <!-- 内容 -->
      <transition name="up">
        <div
          v-if="modelValue"
          class="fixed left-1/2 top-[50%] min-w-[256px] translate-x-[-50%] translate-y-[-50%] rounded-20 bg-white p-1.5"
          :style="{ zIndex: props.zIndex }"
          :class="customeClass"
        >
          <!-- title标题 -->
          <div class="mb-1 text-sm text-zinc-800 font-bold dark:text-zinc-200">
            {{ title }}
          </div>
          <!-- 关闭按钮内容 -->
          <div
            v-if="closeButtonShow"
            class="absolute right-20 top-20 z-200 f-c cursor-pointer border-2 border-[#757575] rounded-full border-solid"
            @click="onClose"
          >
            <div
              class="i-material-symbols:close h-30 w-30"
              style="color:#757575;"
            />
          </div>
          <!-- content内容 -->
          <div class="text-zinc-700 dark:text-zinc-300">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style  scoped>
/* 遮罩层过渡 */
/* .fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
} */

/* 弹框过渡 */
/* .up-enter-from,
.up-leave-to {
  transform: translate3d(-50%, 100px, 0);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
} */
  /* 隐藏滚动条 */
  .element-with-scroll {
    overflow: auto;
    /* 或者 overflow-y: auto; 或者 overflow-x: auto; */
    scrollbar-width: 0;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 和 Edge */
  }

  /* 隐藏滚动条 */
  .element-with-scroll::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari 和 Opera */
  }
</style>
