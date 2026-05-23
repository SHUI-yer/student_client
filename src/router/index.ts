import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 1. 配置路由表
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        // 这里是整个系统的后台大本营
        path: '/layout',
        name: 'Layout',
        component: () => import('../views/Layout.vue'),
        // 当访问 /layout 时，默认重定向到首页大厅
        redirect: '/home',
        // children 就是嵌套在大框架里的子页面！
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue')
            },
            {
                path: '/student',
                name: 'Student',
                component: () => import('../views/Student.vue')
            },
            {
                path: '/course',
                name: 'Course',
                component: () => import('../views/Course.vue')
            },
            {
                path: '/score',
                name: 'Score',
                component: () => import('../views/Score.vue')
            }
            // 明天我们要写的学生列表页面，也会塞进这个 children 里面！
        ]
    }
]

// 2. 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置路由守卫
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')

    // 放行白名单：去登录页，直接放行
    if (to.path === '/login') {
        return next()
    }

    // 非法硬闯拦截：去其他页面但没带 Token，踹回登录页
    if (!token) {
        ElMessage.warning('🚫 请先登录系统！')
        return next('/login')
    }

    // 合法放行
    next()
})

export default router