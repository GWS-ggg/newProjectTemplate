import { createApp } from 'vue'
import App from './App.vue'
import { initRootFontSize } from './plugins/rootFontSize'
import router from './router'
import './assets/main.css'
import 'virtual:uno.css'

initRootFontSize()
const app = createApp(App)

app.use(router)

app.mount('#app')
