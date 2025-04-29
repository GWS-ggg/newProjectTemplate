import { createI18n } from 'vue-i18n'
import de from './locales/de'
import en from './locales/en'
import fr from './locales/fr'
import it from './locales/it'
import ms from './locales/ms'
import th from './locales/th'
import vi from './locales/vi'
import zh from './locales/zh'

interface Messages {
  [key: string]: any
}

const messages: Messages = {
  de,
  en,
  fr,
  it,
  ms,
  th,
  vi,
  zh,
}

// 获取浏览器语言设置
function getBrowserLanguage(): string {
  const language = navigator.language.toLowerCase()
  const languageWithoutRegionCode = language.split('-')[0]

  // 检查是否支持该语言
  if (Object.prototype.hasOwnProperty.call(messages, languageWithoutRegionCode)) {
    return languageWithoutRegionCode
  }

  // 默认返回英语
  return 'en'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getBrowserLanguage(), // 设置语言
  fallbackLocale: 'en', // 设置备用语言
  messages, // 设置语言包
  globalInjection: true, // 全局注入 $t 函数
})

export default i18n
