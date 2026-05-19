<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">🎓 学生管理系统</div>

      <el-menu
          active-text-color="#ffd04b"
          background-color="#304156"
          text-color="#fff"
          router
          default-active="/home"
      >
        <el-menu-item index="/home">
          <span>🏠 首页大厅</span>
        </el-menu-item>
        <el-menu-item index="/student">
          <span>👨‍🎓 学生信息管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">欢迎回来，超级管理员！</div>
        <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
      </el-header>

      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 退出登录逻辑
const handleLogout = () => {
  // 1. 撕毁通行证 (清除 localStorage 里的 token)
  localStorage.removeItem('token')
  // 2. 弹出提示
  ElMessage.success('已安全退出系统')
  // 3. 让路由守卫把你踢回登录页
  router.push('/login')
}
</script>

<style scoped>
/* 撑满全屏的高级布局样式 */
.layout-container {
  height: 100vh;
  width: 100vw;
}
.aside {
  background-color: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}
.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}
.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>