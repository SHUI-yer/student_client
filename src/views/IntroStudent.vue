<template>
  <div class="intro-page">
    <el-card class="hero" shadow="never">
      <div class="hero-title">学生档案管理</div>
      <div class="hero-subtitle">学生信息 CRUD · 头像上传 · 分页检索 · 表单防呆校验</div>
    </el-card>

    <el-card class="content-card" shadow="never">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="crud" title="1. 学生信息 CRUD">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="新增 / 编辑">弹窗表单录入，字段校验齐全，提交按钮防重。</el-descriptions-item>
            <el-descriptions-item label="删除">二次确认弹窗，避免误删。</el-descriptions-item>
            <el-descriptions-item label="分页 / 搜索">支持按姓名或学号模糊搜索，分页展示列表。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="avatar" title="2. 头像全栈上传与回显">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="上传">前端使用 el-upload，携带 Token 头，限制图片格式与大小。</el-descriptions-item>
            <el-descriptions-item label="存储">后端接收 MultipartFile，保存到 uploads 目录并返回可访问路径。</el-descriptions-item>
            <el-descriptions-item label="回显">列表与编辑表单均支持头像预览，提升档案辨识度。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="robust" title="3. 健壮性与体验优化">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="异常提示">Axios 全局异常拦截，统一提示网络/权限/服务端错误。</el-descriptions-item>
            <el-descriptions-item label="骨架屏">列表加载期间展示骨架屏，减少页面跳动。</el-descriptions-item>
            <el-descriptions-item label="统一主题">浅色/暗色统一变量体系，控件风格一致。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['crud'])
</script>

<style scoped>
.intro-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero {
  background: linear-gradient(135deg, var(--md-primary) 0%, var(--md-primary-light) 100%);
  border-radius: var(--md-radius-lg);
  color: #fff;
}
.hero :deep(.el-card__body) {
  background: transparent;
}
.hero :deep(.el-card__body),
.hero :deep(.el-card__header) {
  border: 0;
}
.hero-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.hero-subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}
.content-card {
  background-color: var(--bg-tertiary);
  border-radius: var(--md-radius-lg);
}
.content-card :deep(.el-card__body) {
  background-color: var(--bg-tertiary);
}
.content-card :deep(.el-card__body),
.content-card :deep(.el-card__header) {
  border-color: var(--border);
}
.content-card :deep(.el-collapse) {
  border: 1px solid var(--border);
  background-color: var(--bg-tertiary);
}
.content-card :deep(.el-collapse-item__header) {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
}
.content-card :deep(.el-collapse-item__wrap) {
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border);
}
.content-card :deep(.el-collapse-item__content) {
  color: var(--text-secondary);
}
.content-card :deep(.el-descriptions__body),
.content-card :deep(.el-descriptions__table) {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}
.content-card :deep(.el-descriptions__cell) {
  border-color: var(--border) !important;
}
.content-card :deep(.el-descriptions__label) {
  color: var(--text-secondary);
}
</style>
