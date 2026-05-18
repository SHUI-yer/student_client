import { createApp } from 'vue'
import App from './App.vue'

// 1. 核心：引入 Element Plus 组件库和它的全套精美皮肤（样式）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 2. 核心：告诉 Vue，全盘启用 Element Plus
app.use(ElementPlus)

app.mount('#app')
