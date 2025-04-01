<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

// 按钮位置状态，改为对象以同时存储 x 和 y 坐标
const btnPosition = reactive({ x: 20, y: 20 }) // 初始左下角位置
const backBtn = ref(null)
const isDragging = ref(false)
const startPos = reactive({ x: 0, y: 0 })
const startBtnPos = reactive({ x: 0, y: 0 })
const screenSize = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
})

// 开始拖动
function startDrag(event) {
  isDragging.value = true

  // 根据事件类型获取初始触摸/鼠标位置
  if (event.type === 'mousedown') {
    startPos.x = event.clientX
    startPos.y = event.clientY
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }
  else {
    startPos.x = event.touches[0].clientX
    startPos.y = event.touches[0].clientY
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('touchend', stopDrag)
  }

  // 记录按钮的初始位置
  startBtnPos.x = btnPosition.x
  startBtnPos.y = btnPosition.y

  // 阻止默认行为
  event.preventDefault()
}

// 拖动中
function onDrag(event) {
  if (!isDragging.value)
    return

  // 获取当前位置
  let currentX, currentY
  if (event.type === 'mousemove') {
    currentX = event.clientX
    currentY = event.clientY
  }
  else {
    currentX = event.touches[0].clientX
    currentY = event.touches[0].clientY
  }

  // 计算位移
  const deltaX = currentX - startPos.x
  const deltaY = startPos.y - currentY // 注意：y轴方向是相反的，因为我们使用bottom属性

  // 计算新位置
  let newX = startBtnPos.x + deltaX
  let newY = startBtnPos.y + deltaY

  // 限制范围，防止按钮超出屏幕
  const btnWidth = backBtn.value ? backBtn.value.offsetWidth : 130
  const btnHeight = backBtn.value ? backBtn.value.offsetHeight : 130

  // 横向限制
  newX = Math.max(10, Math.min(newX, screenSize.width - btnWidth - 10))

  // 纵向限制 (bottom 属性，所以上限是 screenSize.height - btnHeight)
  newY = Math.max(10, Math.min(newY, screenSize.height - btnHeight - 10))

  // 更新位置
  btnPosition.x = newX
  btnPosition.y = newY

  // 阻止页面滚动
  event.preventDefault()
}

// 停止拖动
function stopDrag() {
  if (!isDragging.value)
    return

  // 获取按钮尺寸
  const btnWidth = backBtn.value ? backBtn.value.offsetWidth : 130
  // const btnHeight = backBtn.value ? backBtn.value.offsetHeight : 130

  // 水平方向自动靠边
  if (btnPosition.x + btnWidth / 2 < screenSize.width / 2) {
    btnPosition.x = 20 // 靠左
  }
  else {
    btnPosition.x = screenSize.width - btnWidth - 20 // 靠右
  }
  // // 在 stopDrag 函数中添加垂直靠边逻辑
  // if (btnPosition.y + btnHeight/2 < screenSize.height / 2) {
  //   btnPosition.y = 20; // 靠底部
  // } else {
  //   btnPosition.y = screenSize.height - btnHeight - 20; // 靠顶部
  // }
  // 清理状态和事件监听
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 监听窗口大小变化
function handleResize() {
  screenSize.width = window.innerWidth
  screenSize.height = window.innerHeight

  // 确保按钮在调整窗口大小后仍然在可见区域内
  const btnWidth = backBtn.value ? backBtn.value.offsetWidth : 130
  const btnHeight = backBtn.value ? backBtn.value.offsetHeight : 130

  if (btnPosition.x > screenSize.width - btnWidth - 10) {
    btnPosition.x = screenSize.width - btnWidth - 20
  }

  if (btnPosition.y > screenSize.height - btnHeight - 10) {
    btnPosition.y = screenSize.height - btnHeight - 20
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <img
    ref="backBtn"
    class="fixed z-60 h-130 cursor-pointer"
    :style="{ left: `${btnPosition.x}px`, bottom: `${btnPosition.y}px` }"
    src="../assets/images/gifts/icon_back.png"
    alt=""
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
</template>
