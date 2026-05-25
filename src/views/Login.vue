<template>
  <div class="login-container">
    <transition name="fade">
      <LegoLoader v-if="showSplash" />
    </transition>
    
    <el-card class="login-card" v-show="!showSplash">
      <h2>学生管理系统 - 登录</h2>
      <el-form ref="formRef" :model="loginForm" :rules="rules" label-width="0px" class="md-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名" 
            @keyup.enter="focusPassword"
            class="md-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            ref="passwordInputRef"
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password 
            @keyup.enter="handleLogin"
            class="md-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn md-button" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '../api/request'
import { ElMessage } from 'element-plus'
// 👇 1. 新增：引入 vue-router 的路由跳转工具
import { useRouter } from 'vue-router'
import LegoLoader from '../components/LegoLoader.vue'

// 👇 2. 新增：召唤路由管家实例
const router = useRouter()

// 闪屏控制
const showSplash = ref(true)

onMounted(() => {
  // 模拟系统自检/资源预加载，时长延长至 4.5s 增强沉浸感
  setTimeout(() => {
    showSplash.value = false
  }, 4500)
})

// 获取表单和密码输入框的引用
const formRef = ref()
const passwordInputRef = ref()

// 按钮加载状态
const loading = ref(false)

// 定义表单绑定的数据结构
const loginForm = ref({
  username: '',
  password: ''
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 切换焦点到密码输入框
const focusPassword = () => {
  if (passwordInputRef.value) {
    passwordInputRef.value.focus()
  }
}

// 点击登录按钮触发
const handleLogin = async () => {
  if (!formRef.value) return
  
  // 校验表单
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请检查输入数据是否合法')
      return
    }
    
    loading.value = true
    try {
    const res = await request.post('/api/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    }) as any

    if (res.code === 200) {
      // 这里的 res 已经是后端返回的 Result 对象了
      // Token 嵌套在 res.data.token 中
      localStorage.setItem('token', res.data.token)
      ElMessage.success('登录成功！')
      router.push('/layout')
    } else {
      ElMessage.error(res.message || '登录失败')
    }

  } catch (error) {
    console.error('登录失败：', error)
  } finally {
    loading.value = false
  }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

/* 渐变淡出 */
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: var(--md-primary-light);
  border-radius: 50%;
  filter: blur(40px);
}

.login-card {
  width: 420px;
  text-align: center;
  border-radius: var(--md-radius-lg);
  box-shadow: var(--md-shadow-3);
  border: 1px solid rgba(0, 0, 0, 0.04);
  background-color: var(--bg-tertiary);
  padding: 22px 14px;
  transition: var(--md-transition);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--md-shadow-3);
}

h2 {
  margin-bottom: 30px;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 1px;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: var(--md-primary);
  border: none;
  box-shadow: var(--md-shadow-2);
  transition: var(--md-transition);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--md-shadow-3);
  background: var(--md-primary-hover);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: var(--md-shadow-2);
}

:deep(.el-input__wrapper) {
  border-radius: var(--md-radius-md);
  box-shadow: var(--md-shadow-1);
  transition: var(--md-transition);
  padding: 8px 12px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px var(--md-primary-light), var(--md-shadow-2);
}
</style>
