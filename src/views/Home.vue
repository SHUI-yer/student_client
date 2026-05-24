<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="welcome-title">
            <el-icon style="vertical-align: -2px; margin-right: 6px;"><MagicStick /></el-icon>
            欢迎进入学生信息管理系统
          </span>
        </div>
      </template>
      <div class="welcome-content">
        <p>这是一个基于 <strong>Spring Boot 3</strong> 与 <strong>Vue 3 + TypeScript</strong> 打造的校园风全栈管理系统。</p>
        <p>系统已全面升级为 <strong>Material Design 3</strong> 沉浸式交互设计，打通了从底层数据库、文件上传到前端响应式的全链路功能，为您提供丝滑、高效的管理体验。</p>
      </div>
    </el-card>

    <!-- 核心功能介绍 -->
    <el-row :gutter="20" class="feature-row">
      <el-col :span="8">
        <el-card class="feature-card feature-click" shadow="hover" @click="goIntro('student')">
          <el-icon class="feature-icon" color="var(--md-primary)"><UserFilled /></el-icon>
          <h3>学生档案管理</h3>
          <p>支持学生信息的全功能 CRUD 及图片头像全栈上传，包含分页展示与严谨的表单防呆校验。</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card feature-click" shadow="hover" @click="goIntro('course-score')">
          <el-icon class="feature-icon" color="var(--md-primary-light)"><DataLine /></el-icon>
          <h3>课程与成绩管理</h3>
          <p>轻松维护全校课程库，支持动态计算课程学分上限，有效防止越界成绩录入，业务逻辑滴水不漏。</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card feature-click" shadow="hover" @click="goIntro('ux')">
          <el-icon class="feature-icon" color="var(--md-secondary)"><Brush /></el-icon>
          <h3>极致 UI/UX 体验</h3>
          <p>集成全局异常拦截、404 兜底路由、快捷键登录、全局 Loading 遮罩以及丝滑的组件动画特效。</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表分析与项目介绍 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon style="vertical-align: -2px; margin-right: 6px;"><PieChart /></el-icon>
                核心业务模块占比 (环形图)
              </span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon style="vertical-align: -2px; margin-right: 6px;"><DataAnalysis /></el-icon>
                系统综合能力评估 (雷达图)
              </span>
            </div>
          </template>
          <div ref="radarChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { UserFilled, DataLine, Brush, MagicStick, PieChart, DataAnalysis } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useDark } from '@vueuse/core'
import { useRouter } from 'vue-router'

const isDark = useDark()
const router = useRouter()

const pieChartRef = ref<HTMLElement | null>(null)
const radarChartRef = ref<HTMLElement | null>(null)
let pieChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null

const goIntro = (type: 'student' | 'course-score' | 'ux') => {
  router.push(`/intro/${type}`)
}

const initCharts = () => {
  const legendTextColor = isDark.value ? '#FFFFFF' : '#000000'
  const cardBorderColor = isDark.value ? '#2C2C2E' : '#FFFFFF'
  const pieColors = ['#00695c', '#00897b', '#4db6ac', '#ff8f00', '#ffb300']

  const radarTextColor = isDark.value ? '#FFFFFF' : '#000000'
  const radarLineColor = isDark.value ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.16)'
  const radarAreaColor = isDark.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'

  // 初始化饼图（环形图）
  if (pieChartRef.value) {
    // 销毁旧实例防止内存泄漏
    if (pieChart) pieChart.dispose()
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center', textStyle: { color: legendTextColor } },
      color: pieColors,
      series: [
        {
          name: '模块代码量/复杂度',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: cardBorderColor,
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 18, fontWeight: 'bold', color: legendTextColor }
          },
          labelLine: { show: false },
          data: [
            { value: 1048, name: '学生管理' },
            { value: 735, name: '课程配置' },
            { value: 580, name: '成绩核算' },
            { value: 484, name: '安全鉴权' },
            { value: 300, name: '文件存储' }
          ]
        }
      ]
    })
  }

  // 初始化雷达图
  if (radarChartRef.value) {
    if (radarChart) radarChart.dispose()
    radarChart = echarts.init(radarChartRef.value)
    radarChart.setOption({
      color: [radarTextColor],
      tooltip: {},
      radar: {
        indicator: [
          { name: '前端交互 (UI/UX)', max: 100 },
          { name: '后端服务 (API)', max: 100 },
          { name: '数据设计 (DB)', max: 100 },
          { name: '安全防御 (Security)', max: 100 },
          { name: '异常处理 (Error)', max: 100 },
          { name: '代码质量 (Clean)', max: 100 }
        ],
        splitArea: {
          areaStyle: {
            color: isDark.value
              ? ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.08)']
              : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0.06)', 'rgba(0, 0, 0, 0.08)']
          }
        },
        axisLine: { lineStyle: { color: radarLineColor } },
        splitLine: { lineStyle: { color: radarLineColor } },
        axisName: { color: radarTextColor }
      },
      series: [
        {
          name: '项目能力评估',
          type: 'radar',
          data: [
            {
              value: [95, 90, 85, 92, 88, 95],
              name: '系统能力分值',
              areaStyle: { color: radarAreaColor },
              lineStyle: { color: radarTextColor },
              itemStyle: { color: radarTextColor }
            }
          ]
        }
      ]
    })
  }
}

const handleResize = () => {
  pieChart?.resize()
  radarChart?.resize()
}

watch(isDark, () => {
  initCharts()
})

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  radarChart?.dispose()
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.welcome-card {
  background: linear-gradient(135deg, var(--md-primary) 0%, var(--md-primary-light) 100%);
  color: white;
  border-radius: var(--md-radius-lg);
}

.welcome-title {
  font-size: 22px;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

.welcome-content {
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.feature-row {
  margin-top: 10px;
}

.feature-card {
  text-align: center;
  padding: 24px 10px;
  border-radius: var(--md-radius-md);
  transition: var(--md-transition);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--md-shadow-3) !important;
}
.feature-click {
  cursor: pointer;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
  transition: var(--md-transition);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  margin: 10px 0;
  color: var(--md-primary-dark);
  font-weight: 600;
}

.feature-card p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.chart-row {
  margin-top: 10px;
}

.chart-card {
  background-color: var(--md-surface);
  border-radius: var(--md-radius-md);
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style>
