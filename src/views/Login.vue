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

<script setup lang="ts"> // 👈 注意这里：加了 lang="ts"
import { ref } from 'vue'
import request from '../api/request' // 这里会自动寻找 request.ts
import { ElMessage } from 'element-plus'

// 定义表单绑定的数据结构
const loginForm = ref({
  username: '',
  password: ''
})

// 点击登录按钮触发
const handleLogin = async () => {
  try {
    // 调用后端的 POST /api/login 接口
    const res = await request.post('/api/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    }) as any // 临时断言为 any，防止严格的 TS 抱怨 res 上找不到 data

    // 登录成功！把 Token 牢牢存在浏览器的 LocalStorage 里
    localStorage.setItem('token', res.data.token)
    ElMessage.success('登录成功！')

    // 在浏览器控制台打印一下，验证 Token 是否真的存进去了
    console.log('现在抽屉里的Token是：', localStorage.getItem('token'))

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