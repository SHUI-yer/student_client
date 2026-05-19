<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>学生管理系统 - 登录</h2>
      <el-form :model="loginForm" label-width="0px">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '../api/request'
import { ElMessage } from 'element-plus'
// 👇 1. 新增：引入 vue-router 的路由跳转工具
import { useRouter } from 'vue-router'

// 👇 2. 新增：召唤路由管家实例
const router = useRouter()

// 定义表单绑定的数据结构
const loginForm = ref({
  username: '',
  password: ''
})

// 点击登录按钮触发
const handleLogin = async () => {
  try {
    const res = await request.post('/api/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    }) as any

    // 登录成功！存 Token，弹提示
    localStorage.setItem('token', res.data.token)
    ElMessage.success('登录成功！')
    console.log('现在抽屉里的Token是：', localStorage.getItem('token'))

    // 👇 3. 新增：万事俱备，让路由管家直接把我们推进 layout 大厅！
    router.push('/layout')

  } catch (error) {
    console.error('登录失败：', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}
.login-card {
  width: 400px;
  text-align: center;
}
h2 {
  margin-bottom: 30px;
  color: #303133;
}
.login-btn {
  width: 100%;
}
</style>