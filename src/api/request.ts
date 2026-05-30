import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
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
        // 直接返回后端定义的 Result 对象内容
        return response.data
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
            } else if (error.response.status === 404) {
                ElMessage.error('请求的接口不存在 (404)')
            } else if (error.response.status === 500) {
                // 优先取后端返回的错误信息，如果没有则给通用提示
                ElMessage.error(error.response.data?.message || '后端服务器异常，请联系管理员 (500)')
            } else {
                // 其他错误 (如 400, 403)
                ElMessage.error(error.response.data?.message || error.response.data || '系统服务器异常，请稍后再试')
            }
        } else {
            // 如果连 error.response 都没有，说明网络断了或者后端完全没响应（比如跨域问题）
            ElMessage.error(error.message === 'Network Error' ? '网络连接失败，请检查后端服务是否启动' : '请求超时或网络异常')
        }
        return Promise.reject(error)
    }
)

export default request