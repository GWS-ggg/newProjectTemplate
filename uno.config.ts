import UnocssIcons from '@unocss/preset-icons'
import presetRemToPx from '@unocss/preset-rem-to-px'
// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    fontFamily: {
      sans: ['PingFangSC', 'PingFang SC', 'sans-serif'],
    },
    breakpoints: {
      lg: '1025px', // 修改 lg 断点为 1025px
    },
  },
  presets: [
    presetUno(),
    // unocss 默认rem，转成px
    presetRemToPx({
      baseFontSize: 4, // 基准字体大小  官方的默认预设16（1单位 = 0.25rem）所以这里为4 为1：1
    }),
    // 属性化预设
    presetAttributify(),
    presetIcons({
      // 图标默认样式
      extraProperties: {
        display: 'inline-block',
        height: '1em',
        width: '1em',
      },
      /* options */
    }),
    UnocssIcons(),

  ],
  shortcuts: {
    'f-b': 'flex justify-between items-center',
    'f-c': 'flex justify-center items-center',
    'f-s': 'flex justify-start items-center',
    'f-e': 'flex justify-end items-center',
    'text-overflow': 'truncate',
    'wh-full': 'w-full h-full',
    'b-s': 'border border-solid border-[#f6f6f6]',
    'b-s-gray': 'border border-solid border-[#EEEEEE] ',
  },
  rules: [['shadow-custom', { 'box-shadow': '0 2px 10px rgba(0, 0, 0, .1)' }]],
  transformers: [transformerDirectives()],
})
