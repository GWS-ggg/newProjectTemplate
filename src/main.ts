import { createApp } from 'vue'
import App from './App.vue'
import { initRootFontSize } from './plugins/rootFontSize'
import router from './router'
import store from './store'
import 'virtual:uno.css'
import '@/assets/styles/font.css' // 引入自定义字体CSS
import '@/assets/styles/base.css'
import '@/assets/reset.css'

initRootFontSize()
const app = createApp(App)
app.use(store)
app.use(router)

app.mount('#app')
