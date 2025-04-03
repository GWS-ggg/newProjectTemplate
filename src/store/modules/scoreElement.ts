import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScoreElementStore = defineStore('scoreElement', () => {
  const scoreRef: Ref<HTMLElement | null> = ref(null)
  // 更新引用的方法
  function setScoreRef(el: HTMLElement | null) {
    scoreRef.value = el
  }

  return {
    scoreRef,
    setScoreRef,
  }
})
