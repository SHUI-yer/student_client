import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router' // 引入我们昨天建好的路由管家

// 1. 创建 Axios 实例
const request = axios.create({
    baseURL: 'http://localhost:8080', // 后端地址
    timeout: 5000
})

// 2. 请求拦截器（发请求前，把 Token 塞进 Header）
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        // 再次防呆提醒：Bearer 后面必须有一个空格！
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 🛡️ 3. 响应拦截器（收快递前，检查后端有没有亮红牌）
request.interceptors.response.use(
    response => {
        // 状态码是 200，正常放行数据
        return response
    },
    error => {
        // 如果发生异常，捕获状态码
        if (error.response) {
            if (error.response.status === 401) {
                // 🚨 抓捕到 401！说明 Token 过期或伪造
                ElMessage.error('登录凭证已失效或无权限，请重新登录！')
                // 1. 撕毁本地的假通行证
                localStorage.removeItem('token')
                // 2. 强行扭送回登录页
                router.push('/login')
            } else {
                // 其他错误 (如 404, 500)
                ElMessage.error(error.response.data || '系统服务器异常，请稍后再试')
            }
        } else {
            ElMessage.error('网络连接失败，请检查后端服务是否启动')
        }
        return Promise.reject(error)
    }
)

export default request