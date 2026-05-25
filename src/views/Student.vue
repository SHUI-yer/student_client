<template>
  <div class="student-page">
    <!-- 顶部操作栏 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <div class="search-left">
          <el-input
            v-model="searchKeyword"
            placeholder="按姓名或学号搜索..."
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
            新增学生
          </el-button>
          <el-button @click="fetchData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-dropdown style="margin-left: 12px">
            <el-button>
              Excel操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #header></template>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="downloadTemplate">下载导入模板</el-dropdown-item>
                <el-dropdown-item @click="triggerImport">
                  批量导入数据
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="格式：姓名、学号、性别、年龄、专业、班级。请确保学号唯一。"
                  >
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-dropdown-item>
                <el-dropdown-item @click="exportData" divided>导出全部数据</el-dropdown-item>
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
        </div>
      </div>
    </el-card>

    <!-- 筛选导出对话框 -->
    <el-dialog
      v-model="showExportFilter"
      title="筛选导出学生数据"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="专业">
          <el-select v-model="filterMajor" placeholder="选择专业(可选)" clearable style="width: 100%">
            <el-option v-for="m in uniqueMajors" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="filterClass" placeholder="选择班级(可选)" clearable style="width: 100%">
            <el-option v-for="c in uniqueClasses" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExportFilter = false">取消</el-button>
        <el-button type="primary" @click="handleFilteredExport">确认导出</el-button>
      </template>
    </el-dialog>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <!-- 骨架屏加载 -->
      <el-skeleton :rows="10" animated :loading="loading">
        <template #default>
          <el-table :data="tableData" stripe border style="width: 100%">
            <template #empty>
              <EmptyState />
            </template>
            <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="scope">
            <el-avatar 
              :size="40" 
              :src="scope.row.avatarUrl ? `http://localhost:8080${scope.row.avatarUrl}` : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
            />
          </template>
        </el-table-column>
        <el-table-column prop="studentNumber" label="学号" width="140" sortable />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.gender === '男' ? '' : 'danger'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" align="center" />
        <el-table-column prop="major" label="专业" min-width="150" show-overflow-tooltip />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </template>
      </el-skeleton>

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
      :title="form.id ? '编辑学生信息' : '新增学生信息'"
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
        <el-form-item label="学生头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
          >
            <img v-if="form.avatarUrl" :src="`http://localhost:8080${form.avatarUrl}`" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="form.studentNumber" placeholder="例如：20230001" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
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
import { ref, onMounted, reactive, computed } from 'vue'
import request from '../api/request'
import { ElMessage, ElMessageBox, type FormInstance, type UploadProps } from 'element-plus'
import { Search, Plus, Refresh, ArrowDown, QuestionFilled } from '@element-plus/icons-vue'
import EmptyState from '../components/EmptyState.vue'
import type { Student, ApiResponse, PageResult } from '../types'

// 1. 基础状态
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<Student[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const excelInput = ref<HTMLInputElement | null>(null)

// 2. 导出筛选相关
const showExportFilter = ref(false)
const filterMajor = ref('')
const filterClass = ref('')

const uniqueMajors = computed(() => {
  const majors = tableData.value.map(s => s.major).filter(Boolean)
  return Array.from(new Set(majors))
})

const uniqueClasses = computed(() => {
  const classes = tableData.value.map(s => s.className).filter(Boolean)
  return Array.from(new Set(classes))
})

// 3. 表单相关
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Student>({
  id: undefined,
  name: '',
  studentNumber: '',
  gender: '男',
  age: 18,
  major: '',
  className: '',
  avatarUrl: ''
})

// 头像上传的请求头 (携带 Token)
const uploadHeaders = computed(() => {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

// 头像上传成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    form.avatarUrl = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 头像上传前校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGorPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPGorPNG && isLt2M
}

// 表单校验规则
const rules = {
  studentNumber: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }]
}

// 3. 核心方法
const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get<ApiResponse<PageResult<Student>>>('/api/student/page', {
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
    name: '',
    studentNumber: '',
    gender: '男',
    age: 18,
    major: '',
    className: '',
    avatarUrl: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Student) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await request.post<ApiResponse<void>>('/api/student/save', form) as any
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

const handleDelete = (row: Student) => {
  ElMessageBox.confirm(`此操作将永久删除学生【${row.name}】的信息, 是否继续?`, '严重警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '点错了',
    type: 'error',
    buttonSize: 'default'
  }).then(async () => {
    try {
      const res = await request.delete<ApiResponse<void>>(`/api/student/${row.id}`) as any
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

// 5. Excel 操作
const downloadTemplate = () => {
  window.open('http://localhost:8080/api/excel/template/student', '_blank')
}

const exportData = () => {
  window.open('http://localhost:8080/api/excel/export/student', '_blank')
}

const handleFilteredExport = () => {
  let url = 'http://localhost:8080/api/excel/export/student?'
  if (filterMajor.value) url += `major=${encodeURIComponent(filterMajor.value)}&`
  if (filterClass.value) url += `className=${encodeURIComponent(filterClass.value)}&`
  window.open(url, '_blank')
  showExportFilter.value = false
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
    const res = await request.post('/api/excel/import/student', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }) as any
    if (res.code === 200) {
      ElMessage.success('数据导入成功')
      fetchData()
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('Excel 导入失败')
  } finally {
    loading.value = false
    if (excelInput.value) excelInput.value.value = ''
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.student-page {
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

/* 头像上传组件样式 */
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
