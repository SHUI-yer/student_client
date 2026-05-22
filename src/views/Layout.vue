<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <span class="logo-icon">🎓</span>
        <span class="logo-text">学生管理系统</span>
      </div>

      <el-menu
          active-text-color="#ffd04b"
          background-color="#304156"
          text-color="#fff"
          router
          :default-active="route.path"
          class="el-menu-vertical"
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>首页大厅</span>
        </el-menu-item>
        <el-menu-item index="/student">
          <el-icon><UserFilled /></el-icon>
          <span>学生信息管理</span>
        </el-menu-item>
        <el-menu-item index="/course">
          <el-icon><Management /></el-icon>
          <span>课程信息管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="welcome-text">欢迎回来，超级管理员！</span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #footer>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
            <!-- Correcting el-dropdown usage for Element Plus -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled, UserFilled, ArrowDown, Management } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const currentRouteName = computed(() => {
  if (route.path === '/home') return '首页大厅'
  if (route.path === '/student') return '学生信息管理'
  if (route.path === '/course') return '课程信息管理'
  return ''
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已安全退出系统')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
}
.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #2b2f3a;
  gap: 10px;
}
.logo-icon {
  font-size: 24px;
}
.logo-text {
  font-size: 16px;
  font-weight: bold;
}
.el-menu-vertical {
  border-right: none;
}
.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  z-index: 10;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.welcome-text {
  font-size: 14px;
  color: #606266;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.main {
  background-color: #f0f2f5;
  padding: 20px;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>