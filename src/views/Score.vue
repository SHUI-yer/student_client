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
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="studentNumber" label="学号" width="150" align="center" />
        <el-table-column prop="studentName" label="学生姓名" width="120" align="center" />
        <el-table-column prop="major" label="专业" width="150" align="center" />
        <el-table-column prop="courseNumber" label="课程号" width="120" align="center" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" align="center" />
        <el-table-column prop="credit" label="学分" width="80" align="center" />
        <el-table-column prop="score" label="成绩" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.score >= 60 ? 'success' : 'danger'">
              {{ scope.row.score }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
              :label="item.name + ' (' + item.courseNumber + ')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input-number v-model="formData.score" :min="0" :max="100" :precision="1" :step="1" style="width: 100%" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getScorePage, saveScore, deleteScore, getAllStudents, getAllCourses } from '../api/score'

// -- 变量定义 --
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const studentList = ref<any[]>([])
const courseList = ref<any[]>([])

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
  score: 0
})

const rules = reactive<FormRules>({
  studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  score: [{ required: true, message: '请输入成绩', trigger: 'blur' }]
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
