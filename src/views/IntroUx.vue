<template>
  <div class="intro-page">
    <el-card class="hero" shadow="never">
      <div class="hero-title">极致 UI/UX 体验</div>
      <div class="hero-subtitle">统一主题 · 暗黑模式 · 异常处理 · 丝滑动效 · 骨架屏加载</div>
    </el-card>

    <el-card class="content-card" shadow="never">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="theme" title="1. 统一主题体系">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="全局变量">使用背景/文字/主题色变量，保证所有页面风格一致。</el-descriptions-item>
            <el-descriptions-item label="控件统一">对卡片、表格、弹窗、输入框、按钮做统一风格收敛。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="dark" title="2. 暗黑模式">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="切换方式">顶栏开关一键切换，浅/暗模式均使用同一套变量体系。</el-descriptions-item>
            <el-descriptions-item label="细节适配">表格边框、分页控件、下拉面板等在暗色模式下保持灰度一致。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="robust" title="3. 稳定性与容错">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="网络异常">Axios 全局拦截器统一处理 401/404/500/网络错误。</el-descriptions-item>
            <el-descriptions-item label="404 兜底">路由兜底页面，避免用户进入空白页。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="motion" title="4. 动效与加载体验">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="路由动效">页面切换使用滑入/淡出动画，整体更顺滑。</el-descriptions-item>
            <el-descriptions-item label="骨架屏">列表请求期间展示骨架屏，减少视觉跳变。</el-descriptions-item>
            <el-descriptions-item label="Loading">全局 Loading 视觉优化，更柔和、更丝滑。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['theme'])
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
  color: #fff;
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
