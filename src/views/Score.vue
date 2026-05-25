<template>
  <div class="score-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键字">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入学生姓名/学号/课程名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleAdd">录入成绩</el-button>
          <el-dropdown style="margin-left: 12px">
            <el-button type="warning">
              Excel操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="downloadTemplate">下载导入模板</el-dropdown-item>
                <el-dropdown-item @click="triggerImport">
                  批量导入成绩
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="格式：学号、课程编号、百分制成绩。系统会自动换算学分绩点。"
                  >
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item @click="exportScore" divided>导出全部成绩</el-dropdown-item>
                <el-dropdown-item @click="showExportFilter = true">按条件筛选导出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 隐藏的文件上传 input -->
          <input
            ref="excelInput"
            type="file"
            style="display: none"
            accept=".xlsx, .xls"
            @change="handleImport"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 筛选导出对话框 -->
    <el-dialog
      v-model="showExportFilter"
      title="筛选导出成绩数据"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="专业">
          <el-select v-model="filterMajor" placeholder="选择专业(可选)" clearable style="width: 100%">
            <el-option v-for="m in uniqueMajors" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="filterStudentNumber" placeholder="输入学号(可选)" clearable />
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="filterCourseNumber" placeholder="输入课程号(可选)" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExportFilter = false">取消</el-button>
        <el-button type="primary" @click="handleFilteredExport">确认导出</el-button>
      </template>
    </el-dialog>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <!-- 骨架屏加载 -->
      <el-skeleton :rows="10" animated :loading="loading">
        <template #default>
          <el-table :data="tableData" style="width: 100%" border>
            <template #empty>
              <EmptyState title="未查询到成绩" description="暂无该学生的成绩记录或该课程尚未录入成绩" />
            </template>
            <el-table-column prop="id" label="ID" width="80" align="center" />
            <el-table-column prop="studentNumber" label="学号" width="150" align="center" />
            <el-table-column prop="studentName" label="学生姓名" width="120" align="center" />
            <el-table-column prop="major" label="专业" width="150" align="center" />
            <el-table-column prop="courseNumber" label="课程号" width="120" align="center" />
            <el-table-column prop="courseName" label="课程名称" min-width="150" align="center" />
            <el-table-column prop="credit" label="学分" width="80" align="center" />
            <el-table-column prop="originalScore" label="原始成绩(100)" width="120" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.originalScore >= 60 ? 'success' : 'danger'">
                  {{ scope.row.originalScore }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="学分得分" width="100" align="center">
              <template #default="scope">
                <span style="font-weight: bold; color: var(--md-primary)">{{ scope.row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageParams.pageNum"
          v-model:page-size="pageParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 录入/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="选择学生" prop="studentId">
          <el-select v-model="formData.studentId" placeholder="请选择学生" filterable style="width: 100%">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.name + ' (' + item.studentNumber + ')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择课程" prop="courseId">
          <el-select v-model="formData.courseId" placeholder="请选择课程" filterable style="width: 100%">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name + ' (' + item.courseNumber + ') - ' + item.credit + '学分'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="百分制成绩" prop="originalScore">
          <el-input-number v-model="formData.originalScore" :min="0" :max="100" :precision="1" :step="1" style="width: 100%" />
          <div class="score-tip" v-if="formData.courseId && formData.originalScore !== undefined">
            预计折算学分成绩：<span style="color: var(--md-primary); font-weight: bold;">{{ (formData.originalScore * maxScore / 100).toFixed(2) }}</span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowDown, QuestionFilled } from '@element-plus/icons-vue'
import EmptyState from '../components/EmptyState.vue'
import { getScorePage, saveScore, deleteScore, getAllStudents, getAllCourses } from '../api/score'
import request from '../api/request'

// -- 变量定义 --
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const studentList = ref<any[]>([])
const courseList = ref<any[]>([])
const excelInput = ref<HTMLInputElement | null>(null)

// 导出筛选相关
const showExportFilter = ref(false)
const filterMajor = ref('')
const filterStudentNumber = ref('')
const filterCourseNumber = ref('')

const uniqueMajors = computed(() => {
  const majors = tableData.value.map((s: any) => s.major).filter(Boolean)
  return Array.from(new Set(majors))
})

const searchForm = reactive({
  keyword: ''
})

const pageParams = reactive({
  pageNum: 1,
  pageSize: 10
})

const dialogVisible = ref(false)
const dialogTitle = ref('录入成绩')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: undefined as number | undefined,
  studentId: undefined as number | undefined,
  courseId: undefined as number | undefined,
  originalScore: 0,
  score: 0
})

// 计算当前选中课程的最高学分（分数上限）
const maxScore = computed(() => {
  if (!formData.courseId) return 100
  const course = courseList.value.find(c => c.id === formData.courseId)
  return course ? course.credit : 100
})

// 自定义成绩校验器
const validateScore = (_rule: any, value: any, callback: any) => {
  if (value === undefined || value === null) {
    callback(new Error('请输入成绩'))
  } else if (value > 100) {
    callback(new Error('成绩不能超过100分'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  originalScore: [
    { required: true, message: '请输入百分制成绩', trigger: 'blur' },
    { validator: validateScore, trigger: 'blur' }
  ]
})

// -- 方法定义 --
const loadData = async () => {
  loading.value = true
  try {
    const res: any = await getScorePage({
      ...pageParams,
      keyword: searchForm.keyword
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadOptions = async () => {
  try {
    const [stuRes, curRes]: any = await Promise.all([getAllStudents(), getAllCourses()])
    if (stuRes.code === 200) studentList.value = stuRes.data
    if (curRes.code === 200) courseList.value = curRes.data
  } catch (error) {
    console.error('Failed to load options', error)
  }
}

const handleSearch = () => {
  pageParams.pageNum = 1
  loadData()
}

const resetSearch = () => {
  searchForm.keyword = ''
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pageParams.pageSize = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '录入成绩'
  Object.assign(formData, {
    id: undefined,
    studentId: undefined,
    courseId: undefined,
    originalScore: 0,
    score: 0
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑成绩'
  Object.assign(formData, {
    id: row.id,
    studentId: row.studentId,
    courseId: row.courseId,
    originalScore: row.originalScore,
    score: row.score
  })
  dialogVisible.value = true
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这条成绩记录吗？此操作不可恢复', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res: any = await deleteScore(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadData()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const res: any = await saveScore(formData)
        if (res.code === 200) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          loadData()
        } else {
          ElMessage.error(res.message || '保存失败')
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || error.message || '保存失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const exportScore = () => {
  window.open('http://localhost:8080/api/excel/export/score', '_blank')
}

const handleFilteredExport = () => {
  let url = 'http://localhost:8080/api/excel/export/score?'
  if (filterMajor.value) url += `major=${encodeURIComponent(filterMajor.value)}&`
  if (filterStudentNumber.value) url += `studentNumber=${encodeURIComponent(filterStudentNumber.value)}&`
  if (filterCourseNumber.value) url += `courseNumber=${encodeURIComponent(filterCourseNumber.value)}&`
  window.open(url, '_blank')
  showExportFilter.value = false
}

const downloadTemplate = () => {
  window.open('http://localhost:8080/api/excel/template/score', '_blank')
}

const triggerImport = () => {
  excelInput.value?.click()
}

const handleImport = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const formData = new FormData()
  formData.append('file', files[0])

  loading.value = true
  try {
    const res = await request.post('/api/excel/import/score', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }) as any
    if (res.code === 200) {
      ElMessage.success('成绩数据导入成功')
      loadData()
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('Excel 导入失败')
  } finally {
    loading.value = false
    if (excelInput.value) excelInput.value.value = ''
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadData()
  loadOptions()
})
</script>

<style scoped>
.score-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  border-radius: 8px;
}

.table-card {
  border-radius: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
