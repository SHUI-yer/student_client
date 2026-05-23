<template>
  <div class="course-page">
    <!-- 顶部操作栏 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <div class="search-left">
          <el-input
            v-model="searchKeyword"
            placeholder="按课程名或课程号搜索..."
            class="search-input"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="search-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增课程
          </el-button>
          <el-button @click="fetchData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="courseNumber" label="课程号" width="140" sortable />
        <el-table-column prop="name" label="课程名称" width="180" />
        <el-table-column prop="credit" label="学分" width="80" align="center" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="semester" label="开课学期" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑课程信息' : '新增课程信息'"
      width="550px"
      destroy-on-close
    >
      <el-form 
        ref="formRef"
        :model="form" 
        :rules="rules"
        label-width="100px" 
        status-icon
      >
        <el-form-item label="课程号" prop="courseNumber">
          <el-input v-model="form.courseNumber" placeholder="例如：C001" />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input-number v-model="form.credit" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="开课学期" prop="semester">
          <el-select v-model="form.semester" placeholder="请选择学期" style="width: 100%">
            <el-option label="2025秋季" value="2025秋季" />
            <el-option label="2026春季" value="2026春季" />
            <el-option label="2026秋季" value="2026秋季" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submitForm">
            提交保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import request from '../api/request'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import type { Course, ApiResponse, PageResult } from '../types'

// 1. 基础状态
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<Course[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')

// 2. 表单相关
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Course>({
  id: undefined,
  courseNumber: '',
  name: '',
  credit: 2,
  teacher: '',
  semester: ''
})

// 表单校验规则
const rules = {
  courseNumber: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }]
}

// 3. 核心方法
const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get<ApiResponse<PageResult<Course>>>('/api/course/page', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value
      }
    }) as any
    
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

// 4. CRUD 操作
const handleAdd = () => {
  Object.assign(form, {
    id: undefined,
    courseNumber: '',
    name: '',
    credit: 2,
    teacher: '',
    semester: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Course) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await request.post<ApiResponse<void>>('/api/course/save', form) as any
        if (res.code === 200) {
          ElMessage.success(form.id ? '修改成功' : '新增成功')
          dialogVisible.value = false
          fetchData()
        } else {
          ElMessage.error(res.message || '操作失败')
        }
      } catch (error: any) {
        console.error('提交失败:', error)
        ElMessage.error(error.response?.data?.message || '服务器异常')
      } finally {
        submitting.value = false
      }
    } else {
      console.warn('表单校验未通过', fields)
    }
  })
}

const handleDelete = (row: Course) => {
  ElMessageBox.confirm(`此操作将永久删除课程【${row.name}】的信息, 是否继续?`, '严重警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '点错了',
    type: 'error',
    buttonSize: 'default'
  }).then(async () => {
    try {
      const res = await request.delete<ApiResponse<void>>(`/api/course/${row.id}`) as any
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.course-page {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.search-card {
  margin-bottom: 0;
}
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-input {
  width: 320px;
}
.search-right {
  display: flex;
  gap: 10px;
}
.table-card {
  min-height: 500px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
