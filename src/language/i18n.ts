import type { App } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import de from './locales/de'
import en from './locales/en'
import fr from './locales/fr'
import it from './locales/it'
import ms from './locales/ms'
import th from './locales/th'
import vi from './locales/vi'
import zh from './locales/zh'

const messages = {
  de,
  en,
  fr,
  it,
  ms,
  th,
  vi,
  zh,
}
export type LocaleKey = keyof typeof messages
// 获取浏览器的默认语言
// const browserLanguage = navigator.language || navigator.languages[0]
function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.languages[0]
  const shortLang = browserLang.split('-')[0]

  // 检查是否支持该语言
  if (['zh', 'en', 'de', 'fr', 'th', 'it', 'vi', 'ms'].includes(shortLang)) {
    return shortLang
  }

  // 特殊情况处理
  if (browserLang.startsWith('zh-')) {
    return 'zh'
  }

  // 默认返回英文
  return 'en'
}

const i18n = createI18n({
  locale: getBrowserLanguage(),
  fallbackLocale: 'en', // 语言缺少替补
  messages,
  legacy: false,
})

// main.ts中使用
export function setupI18n(app: App) {
  app.use(i18n)
}

export function t(key: string): string {
  const { t } = useI18n()
  return t(key) as string
}

// 用于设定在本地存储选择的语言类型
export function setLocale(locale: LocaleKey) {
  i18n.global.locale.value = locale
  // localStorage.setItem('99_lang', locale)
}

export function getLocale() {
  return i18n.global.locale.value
}

export default i18n
