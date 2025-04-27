export function isPaintOrderSupported(): boolean {
  try {
    // 检查是否支持SVG
    if (typeof SVGElement === 'undefined')
      return false

    // 创建SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.position = 'absolute'
    svg.style.visibility = 'hidden'

    // 创建文本元素
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.textContent = '测试'

    // 应用paint-order样式
    text.setAttribute('style', 'paint-order: stroke fill')

    // 添加到DOM
    svg.appendChild(text)
    document.body.appendChild(svg)

    // 检查计算样式
    const computedStyle = window.getComputedStyle(text)
    const paintOrderValue = computedStyle.getPropertyValue('paint-order').trim()

    // 清理DOM
    document.body.removeChild(svg)

    // 验证结果：如果浏览器支持该属性，应该返回非默认值
    // 默认值通常是"normal"或空字符串
    return paintOrderValue !== '' && paintOrderValue !== 'normal'
  }
  catch (e) {
    console.error('检测paint-order支持时出错:', e)
    return false
  }
}
