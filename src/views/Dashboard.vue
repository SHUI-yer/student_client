<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="item in statCards" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :style="{ color: item.color }"><component :is="item.icon" /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-main-row">
      <!-- 左侧：成绩分布与及格率 -->
      <el-col :span="16">
        <el-card class="main-chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span><el-icon><BarChart /></el-icon> 全校成绩趋势与及格率分析</span>
            </div>
          </template>
          <div ref="mainBarChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <!-- 右侧：各专业平均分 -->
      <el-col :span="8">
        <el-card class="main-chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span><el-icon><PieChart /></el-icon> 专业学分占比</span>
            </div>
          </template>
          <div ref="majorPieChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-bottom-row">
      <!-- 下方左侧：课程难度雷达图 -->
      <el-col :span="12">
        <el-card class="sub-chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span><el-icon><RadarChart /></el-icon> 课程综合难度评估</span>
            </div>
          </template>
          <div ref="difficultyRadarChartRef" class="chart-box-small"></div>
        </el-card>
      </el-col>
      <!-- 下方右侧：近期录入动态 -->
      <el-col :span="12">
        <el-card class="sub-chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span><el-icon><Timer /></el-icon> 最近录入动态</span>
            </div>
          </template>
          <el-table :data="recentActivities" style="width: 100%" size="small">
            <el-table-column prop="time" label="时间" width="100" />
            <el-table-column prop="student" label="学生" />
            <el-table-column prop="course" label="课程" />
            <el-table-column prop="score" label="分数">
              <template #default="{ row }">
                <span :style="{ color: row.score < 60 ? 'var(--md-error)' : 'var(--md-primary)' }">{{ row.score }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { useDark } from '@vueuse/core'
import { User, Notebook, DocumentChecked, TrendCharts, PieChart, Timer, DataAnalysis as RadarChart, Histogram as BarChart } from '@element-plus/icons-vue'
import request from '../api/request'

const isDark = useDark()
const mainBarChartRef = ref<HTMLElement | null>(null)
const majorPieChartRef = ref<HTMLElement | null>(null)
const difficultyRadarChartRef = ref<HTMLElement | null>(null)

let mainBarChart: echarts.ECharts | null = null
let majorPieChart: echarts.ECharts | null = null
let difficultyRadarChart: echarts.ECharts | null = null

const statCards = ref([
  { title: '在校学生', value: '0', icon: User, color: '#00695c' },
  { title: '开设课程', value: '0', icon: Notebook, color: '#ff8f00' },
  { title: '及格总率', value: '0%', icon: DocumentChecked, color: '#4caf50' },
  { title: '平均学分', value: '0', icon: TrendCharts, color: '#2196f3' }
])

const recentActivities = ref<any[]>([])
const majorData = ref<any[]>([])
const trendData = ref<any>({ periods: [], scores: [], rates: [] })
const difficultyData = ref<any[]>([])

const fetchStatData = async () => {
  try {
    const res = await request.get('/api/stat/dashboard') as any
    if (res.code === 200) {
      const data = res.data
      statCards.value[0].value = data.studentCount.toLocaleString()
      statCards.value[1].value = data.courseCount.toString()
      statCards.value[2].value = data.passRate + '%'
      statCards.value[3].value = data.avgCredit.toString()
      
      recentActivities.value = data.recentActivities.map((item: any) => ({
        time: '最近',
        student: item.studentName,
        course: item.courseName,
        score: item.originalScore || item.score // 优先显示原始百分制分数
      }))
      
      majorData.value = data.majorDistribution
      trendData.value = {
        periods: data.trendPeriods,
        scores: data.trendAvgScores,
        rates: data.trendPassRates
      }
      difficultyData.value = data.courseDifficulty
      
      // 数据加载后重新初始化图表
      initCharts()
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initCharts = () => {
  const textColor = isDark.value ? '#FFFFFF' : '#000000'
  const subTextColor = isDark.value ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)'
  const splitLineColor = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'

  // 1. 主趋势图 (柱状+折线混合)
  if (mainBarChartRef.value) {
    mainBarChart?.dispose()
    mainBarChart = echarts.init(mainBarChartRef.value)
    mainBarChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { textStyle: { color: textColor }, bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: trendData.value.periods.length > 0 ? trendData.value.periods : ['2019', '2020', '2021', '2022', '2023', '2024'],
        axisLabel: { color: subTextColor },
        axisLine: { lineStyle: { color: splitLineColor } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: subTextColor },
        splitLine: { lineStyle: { color: splitLineColor } }
      },
      series: [
        {
          name: '平均分',
          type: 'bar',
          data: trendData.value.scores.length > 0 ? trendData.value.scores : [78, 82, 81, 85, 84, 87],
          itemStyle: { color: '#00695c', borderRadius: [4, 4, 0, 0] }
        },
        {
          name: '及格率',
          type: 'line',
          smooth: true,
          data: trendData.value.rates.length > 0 ? trendData.value.rates : [91, 93, 92, 95, 94, 96],
          itemStyle: { color: '#ff8f00' }
        }
      ]
    })
  }

  // 2. 专业饼图
  if (majorPieChartRef.value) {
    majorPieChart?.dispose()
    majorPieChart = echarts.init(majorPieChartRef.value)
    majorPieChart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: isDark.value ? '#1c1c1e' : '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold', color: textColor } },
          data: majorData.value.length > 0 ? majorData.value : [
            { value: 1, name: '暂无数据', itemStyle: { color: '#ccc' } }
          ]
        }
      ]
    })
  }

  // 3. 难度雷达图
  if (difficultyRadarChartRef.value) {
    difficultyRadarChart?.dispose()
    difficultyRadarChart = echarts.init(difficultyRadarChartRef.value)
    difficultyRadarChart.setOption({
      radar: {
        indicator: [
          { name: '理论难度', max: 100 },
          { name: '挂科风险', max: 100 },
          { name: '考试及格率', max: 100 },
          { name: '分差波动', max: 100 },
          { name: '学分压力', max: 100 }
        ],
        axisName: { color: subTextColor },
        splitArea: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
        axisLine: { lineStyle: { color: splitLineColor } }
      },
      series: [
        {
          type: 'radar',
          data: difficultyData.value.length > 0 ? difficultyData.value.map((item, index) => ({
            value: item.value,
            name: item.name,
            areaStyle: { color: index % 2 === 0 ? 'rgba(0, 105, 92, 0.3)' : 'rgba(255, 143, 0, 0.3)' },
            lineStyle: { color: index % 2 === 0 ? '#00695c' : '#ff8f00' },
            itemStyle: { color: index % 2 === 0 ? '#00695c' : '#ff8f00' }
          })) : [
            {
              value: [85, 90, 70, 40, 95],
              name: '高等数学 (示例)',
              areaStyle: { color: 'rgba(0, 105, 92, 0.3)' },
              lineStyle: { color: '#00695c' },
              itemStyle: { color: '#00695c' }
            }
          ]
        }
      ]
    })
  }
}

const handleResize = () => {
  mainBarChart?.resize()
  majorPieChart?.resize()
  difficultyRadarChart?.resize()
}

watch(isDark, () => {
  initCharts()
})

onMounted(() => {
  fetchStatData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  mainBarChart?.dispose()
  majorPieChart?.dispose()
  difficultyRadarChart?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  border-radius: var(--md-radius-md);
  background-color: var(--bg-tertiary);
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 32px;
  padding: 10px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-title {
  font-size: 13px;
  color: var(--text-secondary);
}

.main-chart-card, .sub-chart-card {
  border-radius: var(--md-radius-md);
  background-color: var(--bg-tertiary);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-box {
  height: 350px;
  width: 100%;
}

.chart-box-small {
  height: 250px;
  width: 100%;
}

.chart-main-row, .chart-bottom-row {
  margin-bottom: 20px;
}

:deep(.el-table) {
  background-color: transparent !important;
}
:deep(.el-table tr) {
  background-color: transparent !important;
}
:deep(.el-table th.el-table__cell) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  font-weight: bold;
}
:deep(.el-table .el-table__header-wrapper th) {
  color: var(--text-primary) !important;
}
</style>
