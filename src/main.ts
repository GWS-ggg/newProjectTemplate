import VConsole from 'vconsole'
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './language/i18n'
import { initRootFontSize } from './plugins/rootFontSize'
import router from './router'
import store from './store'
import 'virtual:uno.css'
import '@/assets/styles/font.css' // 引入自定义字体CSS
import '@/assets/styles/base.css'
import '@/assets/reset.css'

initRootFontSize()
const app = createApp(App)

const _vConsole = new VConsole()
app.use(store)
app.use(router)
setupI18n(app)
app.mount('#app')
