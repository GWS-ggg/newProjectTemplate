// src/plugins/rootFontSize.ts
export function initRootFontSize() {
  function setRootFontSize() {
    const docEl = document.documentElement
    const clientWidth = docEl.clientWidth
    if (!clientWidth)
      return

    if (clientWidth <= 750) {
      docEl.style.fontSize = `${100 * (clientWidth / 750)}px`
    }
    else {
      docEl.style.fontSize = `100px`
    }
  }

  setRootFontSize()
  window.addEventListener('resize', setRootFontSize)
}
