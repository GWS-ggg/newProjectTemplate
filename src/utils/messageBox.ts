import type { Pop } from '@/types'
import type { App } from 'vue'
import MessageBoxVue from '@/components/MessageBox.vue'
import { createVNode, render } from 'vue'

// 单例模式管理
let currentInstance: {
  close: () => void
  container: HTMLElement | null
} | null = null

// 强制关闭所有可能存在的消息框
function forceCloseAll() {
  // 查找所有可能的消息框容器并移除
  const allMessageBoxes = document.querySelectorAll('.message-box-container')
  allMessageBoxes.forEach((el) => {
    document.body.removeChild(el)
  })

  // 重置当前实例
  currentInstance = null
}

// 创建消息框实例
function createMessageBox(options: Partial<Pop> = {}) {
  // 强制关闭所有消息框
  forceCloseAll()

  // 创建一个容器并添加特殊类名用于标识
  const container = document.createElement('div')
  container.className = 'message-box-container'
  document.body.appendChild(container)

  // 默认配置
  const defaultOptions: Pop = {
    visible: true,
    type: 'success',
    content: '',
    closeable: true,
    textAlign: 'center',
    defaultBtn: {
      text: '',
      onClick: () => {},
    },
    primaryBtn: {
      text: '确定',
      onClick: () => {},
    },
  }

  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }

  // 创建虚拟节点
  const vnode = createVNode(MessageBoxVue, {
    'pop': mergedOptions,
    'onUpdate:visible': (val: boolean) => {
      if (!val) {
        // 销毁组件
        setTimeout(() => {
          // 再次检查容器是否仍然存在
          if (container && container.parentNode) {
            render(null, container)
            document.body.removeChild(container)
          }
          // 如果当前实例就是要销毁的实例，则重置当前实例
          if (currentInstance && currentInstance.container === container) {
            currentInstance = null
          }
        }, 300)
      }
    },
    'onConfirm': () => {
      if (options.primaryBtn?.onClick) {
        options.primaryBtn.onClick()
      }
    },
    'onCancel': () => {
      if (options.defaultBtn?.onClick) {
        options.defaultBtn.onClick()
      }
    },
  })

  // 渲染到容器中
  render(vnode, container)

  // 创建实例并保存容器引用
  const instance = {
    close: () => {
      const comp = vnode.component
      if (comp && comp.props) {
        // 使用类型断言解决类型问题
        const props = comp.props as { pop: { visible: boolean } }
        props.pop.visible = false
      }
    },
    container,
  }

  // 保存当前实例
  currentInstance = instance

  // 返回实例
  return instance
}

// 创建MessageBox对象
export const MessageBox = {
  // 支付成功
  paymentSuccess: (content: string, btnText: string = '确定', callback?: () => void) => {
    return createMessageBox({
      type: 'success',
      content,
      primaryBtn: {
        text: btnText,
        onClick: callback || (() => {}),
      },
    })
  },

  // 支付失败
  paymentFailed: (content: string, btnText: string = '确定', callback?: () => void) => {
    return createMessageBox({
      type: 'error',
      content,
      primaryBtn: {
        text: btnText,
        onClick: callback || (() => {}),
      },
    })
  },

  // 下单失败
  orderFailed: (content: string, btnText: string = '确定', callback?: () => void) => {
    return createMessageBox({
      type: 'failed',
      content,
      primaryBtn: {
        text: btnText,
        onClick: callback || (() => {}),
      },
    })
  },

  // 自定义消息
  custom: (options: Partial<Pop>) => {
    return createMessageBox(options)
  },

  // 关闭所有消息框方法
  closeAll: () => {
    forceCloseAll()
  },
}

// 创建Vue插件
export default {
  install: (app: App) => {
    app.config.globalProperties.$messageBox = MessageBox
  },
}

// 添加全局类型声明到当前模块
declare module 'vue' {
  interface ComponentCustomProperties {
    $messageBox: typeof MessageBox
  }
}
