// 拆分成两行：第一行导入普通的 axios 和类型，第二行用 type 专门导入严格的配置类型
// 1. 普通导入：只导入 axios 核心实例
import axios from 'axios'

// 2. 类型导入：用 type 关键字把所有纯类型全部打包在一起导入
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// 3. 组件库提示导入
import { ElMessage } from 'element-plus'

// 1. 创建 axios 实例
const request = axios.create({
    baseURL: 'http://localhost:8080', // 后端本地运行端口
    timeout: 5000
})

// 2. 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
            // 严格遵循考核文档规范
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 3. 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        // 根据后端约定的统一响应格式进行拦截
        if (res.code === 200) {
            return res
        } else {
            ElMessage.error(res.message || '系统错误')
            return Promise.reject(new Error(res.message || 'Error'))
        }
    },
    (error) => {
        ElMessage.error('网络请求失败，请检查后端是否启动')
        return Promise.reject(error)
    }
)

export default request