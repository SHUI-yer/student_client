import { createApp } from 'vue'
import App from './App.vue'
import './style.css' // 引入全局样式文件

//引入 Element Plus 组件库和它的全套精美皮肤（样式）

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入刚刚写好的路由

import router from './router'
const app = createApp(App)

//告诉 Vue，全盘启用 Element Plus
//让 Vue 使用路由
app.use(router)
app.use(ElementPlus)
app.use(router)// (注意：use 必须在 mount 之前调用)
app.mount('#app')
