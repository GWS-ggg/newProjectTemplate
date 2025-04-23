<script setup>
const emits = defineEmits(['close'])
const open = defineModel({ required: true, type: Boolean })

// 点击蒙层关闭
function handleMaskClick() {
  emits('close')
}
</script>

<template>
  <div>
    <teleport to="body">
      <transition name="mask">
        <div
          v-if="open"
          class="fixed left-0 top-0 z-400 h-screen w-full bg-zinc-700/80"
          @click="handleMaskClick"
        />
      </transition>
      <transition name="popup">
        <div
          v-if="open"
          class="fixed bottom-0 left-1/2 z-500 max-w-750 w-screen transform overflow-hidden rounded-t-24 bg-white -translate-x-1/2"
        >
          <slot />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.mask-enter-active,
.mask-leave-active {
  transition: 0.3s;
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: 0.3s;
}

.popup-enter-from,
.popup-leave-to {
  transform:  translate(-50%, 100%);
}
</style>
