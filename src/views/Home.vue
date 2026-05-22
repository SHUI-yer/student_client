<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="welcome-title">🎉 欢迎进入学生信息管理系统</span>
        </div>
      </template>
      <div class="welcome-content">
        <p>这是一个基于 <strong>Spring Boot 25</strong> 与 <strong>Vue 3 + TypeScript</strong> 打造的企业级全栈管理系统。</p>
        <p>系统已实现了从底层数据库设计到前端响应式交互的全链路功能，旨在为您提供高效、稳定的管理体验。</p>
      </div>
    </el-card>

    <!-- 核心功能介绍 -->
    <el-row :gutter="20" class="feature-row">
      <el-col :span="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon" color="#409EFF"><UserFilled /></el-icon>
          <h3>学生管理</h3>
          <p>支持学生信息的全功能 CRUD，包含分页展示、模糊搜索以及严谨的表单校验。</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon" color="#67C23A"><Management /></el-icon>
          <h3>课程管理</h3>
          <p>轻松维护全校课程库，支持课程号、学分、授课教师及开课学期的精细化管理。</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card" shadow="hover">
          <el-icon class="feature-icon" color="#E6A23C"><Lock /></el-icon>
          <h3>安全防御</h3>
          <p>集成 JWT 认证、全路径拦截器及前端路由守卫，全方位保障数据安全。</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 开发进度看板 -->
    <el-card class="status-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>📈 系统当前开发进度</span>
        </div>
      </template>
      <div class="progress-item">
        <span>总体开发进度</span>
        <el-progress :percentage="60" :stroke-width="15" striped animated />
      </div>
      <div class="progress-item">
        <span>后端 API 接口</span>
        <el-progress :percentage="70" status="success" :stroke-width="10" />
      </div>
      <div class="progress-item">
        <span>前端 UI 渲染</span>
        <el-progress :percentage="65" color="#f56c6c" :stroke-width="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Management, Lock } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.welcome-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.welcome-content {
  line-height: 1.8;
  color: #606266;
}

.feature-row {
  margin-top: 10px;
}

.feature-card {
  text-align: center;
  padding: 20px 10px;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 10px 0;
  color: #303133;
}

.feature-card p {
  font-size: 14px;
  color: #909399;
}

.status-card {
  background-color: #fafafa;
}

.progress-item {
  margin-bottom: 20px;
}

.progress-item span {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}
</style>
