import { createVNode, onUnmounted, ref, render } from 'vue'
import ToastComponent from '../components/ToastComponent.vue'

export function useToast() {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref<'info' | 'success' | 'error' | 'loading'>('info')
  const duration = ref(2000)

  // 创建DOM容器
  let container: HTMLElement | null = null

  // 确保DOM容器存在
  const ensureContainer = () => {
    if (!container) {
      container = document.createElement('div')
      container.className = 'toast-container'
      document.body.appendChild(container)
    }
    return container
  }

  // 显示Toast
  const show = (config: {
    message: string
    type?: 'info' | 'success' | 'error' | 'loading'
    duration?: number
  }) => {
    message.value = config.message
    type.value = config.type || 'info'
    duration.value = config.duration || 2000

    const container = ensureContainer()

    // 创建虚拟节点
    const vnode = createVNode(ToastComponent, {
      message: message.value,
      type: type.value,
      onClose: () => {
        isVisible.value = false
      },
    })

    // 渲染到容器
    render(vnode, container)
    isVisible.value = true

    // 如果不是loading类型，自动关闭
    if (type.value !== 'loading' && duration.value > 0) {
      setTimeout(() => {
        close()
      }, duration.value)
    }
  }

  // 关闭Toast
  const close = () => {
    if (container) {
      render(null, container)
      isVisible.value = false
    }
  }

  // 便捷方法
  const info = (message: string, duration?: number) => {
    show({ message, type: 'info', duration })
  }

  const success = (message: string, duration?: number) => {
    show({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    show({ message, type: 'error', duration })
  }

  const loading = (message: string = '加载中...') => {
    show({ message, type: 'loading', duration: 0 })
  }

  // 组件卸载时清理
  onUnmounted(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
      container = null
    }
  })

  return {
    isVisible,
    show,
    close,
    info,
    success,
    error,
    loading,
  }
}
