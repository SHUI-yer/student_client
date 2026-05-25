<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <el-icon class="logo-icon"><School /></el-icon>
        <span class="logo-text">学生管理系统</span>
      </div>

      <el-menu
          active-text-color="#00695c"
          background-color="transparent"
          :text-color="isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)'"
          router
          :default-active="route.path"
          class="el-menu-vertical md-menu"
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
        <el-menu-item index="/score">
          <el-icon><List /></el-icon>
          <span>学生成绩查询</span>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据可视化大屏</span>
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
          
          <!-- 暗黑模式切换按钮 -->
          <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            style="margin-right: 10px; --el-switch-on-color: #2c2c2c; --el-switch-off-color: #ffb300"
          />

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
          <transition name="slide-fade" mode="out-in">
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
import { HomeFilled, UserFilled, ArrowDown, Management, List, Moon, Sunny, School, DataAnalysis } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

// 引入暗黑模式 hook
const isDark = useDark()

const currentRouteName = computed(() => {
  if (route.path === '/home') return '首页大厅'
  if (route.path === '/student') return '学生信息管理'
  if (route.path === '/course') return '课程信息管理'
  if (route.path === '/score') return '学生成绩查询'
  if (route.path === '/dashboard') return '数据可视化大屏'
  if (route.path === '/intro/student') return '学生档案管理'
  if (route.path === '/intro/course-score') return '课程与成绩管理'
  if (route.path === '/intro/ux') return '极致 UI/UX 体验'
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
  background-color: var(--bg-main);
}
.aside {
  background-color: var(--bg-main);
  transition: width 0.3s;
  overflow-x: hidden;
  box-shadow: var(--md-shadow-2);
  z-index: 20;
  border-right: 1px solid var(--border);
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  color: var(--text-primary);
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.logo-icon {
  font-size: 24px;
}
.logo-text {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}
.el-menu-vertical {
  border-right: none;
}
.md-menu :deep(.el-menu-item) {
  transition: var(--md-transition);
}
.md-menu :deep(.el-menu-item:hover) {
  background-color: var(--md-primary-light) !important;
}
.md-menu :deep(.el-menu-item.is-active) {
  background-color: var(--md-primary-light) !important;
  color: var(--md-primary) !important;
  border-right: 3px solid var(--md-primary);
}
.header {
  background-color: var(--navbar-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: var(--md-shadow-1);
  z-index: 10;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--navbar-border);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.welcome-text {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: var(--md-transition);
}
.el-dropdown-link:hover {
  transform: scale(1.05);
}
.main {
  background-color: var(--bg-secondary);
  padding: 24px;
  overflow-y: auto;
}

/* Transition */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
