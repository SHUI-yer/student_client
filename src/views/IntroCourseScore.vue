<template>
  <div class="intro-page">
    <el-card class="hero" shadow="never">
      <div class="hero-title">课程与成绩管理</div>
      <div class="hero-subtitle">课程维护 · 成绩录入 · 动态学分上限校验 · 列表检索与分页</div>
    </el-card>

    <el-card class="content-card" shadow="never">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="course" title="1. 课程信息管理">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="课程维护">支持课程号、课程名称、学分、授课教师、学期等字段的新增/编辑/删除。</el-descriptions-item>
            <el-descriptions-item label="检索分页">按课程名或课程号搜索，分页展示，快速定位课程。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="score" title="2. 成绩查询与录入">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="录入流程">选择学生与课程后录入成绩，支持编辑与删除。</el-descriptions-item>
            <el-descriptions-item label="标签呈现">及格/不及格通过 Tag 颜色区分，信息一眼可读。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="rule" title="3. 动态学分上限校验">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="业务规则">成绩不得超过所选课程的学分上限。</el-descriptions-item>
            <el-descriptions-item label="物理拦截">输入框 max 动态绑定，直接限制非法输入。</el-descriptions-item>
            <el-descriptions-item label="表单校验">自定义校验器双重验证（blur/change），防止绕过。</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['course'])
</script>

<style scoped>
.intro-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero {
  background: linear-gradient(135deg, var(--md-secondary) 0%, var(--md-secondary-light) 100%);
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
