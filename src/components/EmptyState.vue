<template>
  <div class="empty-state">
    <div class="icon-wrapper">
      <el-icon class="main-icon"><Search /></el-icon>
      <el-icon class="sub-icon"><CircleCloseFilled /></el-icon>
    </div>
    <h3 class="empty-title">{{ title || '暂无匹配数据' }}</h3>
    <p class="empty-desc">{{ description || '请尝试调整搜索关键词或筛选条件' }}</p>
    <div class="empty-action" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, CircleCloseFilled } from '@element-plus/icons-vue'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.icon-wrapper {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon {
  font-size: 64px;
  color: var(--md-primary-light);
  opacity: 0.5;
}

.sub-icon {
  position: absolute;
  bottom: 0;
  right: -5px;
  font-size: 24px;
  color: var(--md-secondary);
  background: var(--bg-tertiary);
  border-radius: 50%;
}

.empty-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty-action {
  margin-top: 20px;
}
</style>
