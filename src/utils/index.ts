function setRootFontSize() {
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth
  if (!clientWidth)
    return

  // 根据屏幕宽度设置不同的根字体大小
  if (clientWidth <= 1024) {
    // 移动端设计稿宽度为 750px，1rem = 100px
    docEl.style.fontSize = `${100 * (clientWidth / 750)}px`
  }
  else {
    // 桌面端设计稿宽度为 1920px，1rem = 100px
    docEl.style.fontSize = `${100 * (clientWidth / 1920)}px`
  }
}

setRootFontSize()
window.addEventListener('resize', setRootFontSize)

export function getPGImg(name: string | undefined) {
  if (!name)
    return ''
  return `https://piggygo-static-jy.forevernine.com/cdn/officialpay/${name}`
}

// 创建CSS动画Promise函数 - 使用事件监听器和超时保护
export function animateWithClass(element: Element | null, className: string, duration: number): Promise<void> {
  return new Promise((resolve) => {
    if (!element) {
      resolve()
      return
    }

    // 使用 once: true 选项，确保事件只触发一次
    const onAnimationEnd = () => {
      resolve()
    }

    element.addEventListener('animationend', onAnimationEnd, { once: true })
    element.classList.add(className)

    // 安全超时仍然保留
    setTimeout(() => {
      if (element.classList.contains(className)) {
        element.removeEventListener('animationend', onAnimationEnd)
        resolve()
      }
    }, duration + 50)
  })
}

export function formatPrice(price: number) {
  return `$${(price / 100).toFixed(2)}`
}

// 获取设备类型
export function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/android/.test(userAgent)) {
    return 'android'
  }
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  }
  return 'pc'
}
