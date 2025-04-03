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
