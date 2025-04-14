import { ref } from 'vue'

// 定义一个通用的带有动画方法的组件接口
interface AnimatableComponent {
  triggerAnimationWithCallback: (callback?: () => void) => void
}

/**
 * 用于管理带动画按钮组件引用的组合式函数
 *
 * @returns 包含按钮引用和操作方法的对象
 */
export function useAnimatableRefs() {
  // 创建一个映射来存储组件refs
  const refs = ref(new Map<number, AnimatableComponent>())

  // 设置ref的方法
  function setRef(el: any, id: number) {
    if (el && typeof el.triggerAnimationWithCallback === 'function') {
      refs.value.set(id, el)
    }
  }

  // 获取特定ID的组件
  function getRef(id: number) {
    return refs.value.get(id)
  }

  // 触发组件动画
  function triggerAnimation(id: number, callback?: () => void) {
    const component = getRef(id)
    if (component) {
      component.triggerAnimationWithCallback(callback)
    }
    else if (callback) {
      callback()
    }
  }

  return {
    refs,
    setRef,
    getRef,
    triggerAnimation,
  }
}
