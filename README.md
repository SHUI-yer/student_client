# 🎨 学生信息管理系统 - 前端工程 (student_client)

本项目是学生信息管理系统的现代化前端工程，基于 **Vite + Vue 3 + TypeScript** 架构搭建。全站遵循 **Material Design 3** 视觉规范，引入 **ECharts 6** 提供专业级决策大屏。

---

# ✨ 核心视觉与交互亮点 (UI/UX Highlights)

- **Material Design 3 极致重构**: 建立了标准的三级灰阶背景体系 (`#000000 / #1C1C1E / #2C2C2E`)，确保在暗黑模式下拥有极致的物理纵深感与视觉沉浸。
- **数字化决策分析大屏**: 新增 `/dashboard` 页面，实时展示历年趋势聚合、及格率波动、以及基于**标准差算法**的课程难度评估雷达图。
- **高级过场动画**: 登录页集成“乐高积木堆叠 + 动态打字机光标”特效，赋予系统极强的科技品牌感与仪式感。
- **Excel 全链路集成**: 学生、课程、成绩三大模块全面支持“下载模板 -> 格式引导(带图标提示) -> 批量导入 -> **按条件筛选导出**”的闭环操作。
- **毛玻璃与沉浸式体验**: 顶栏集成 `backdrop-filter` 模糊特效，配合骨架屏加载、路由滑入滑出动效。
- **交互逻辑加固**: 成绩录入支持百分制实时预览学分换算，自动空状态 (EmptyState) 占位提示，键盘快捷键 (Enter) 登录优化。

---

# 📂 核心目录结构
```text
student_client/
├── src/
│   ├── api/                # Axios 封装与业务 API 接口
│   ├── assets/             # 静态资源 (Logo、图标)
│   ├── components/         # 复用组件 (含 EmptyState 占位、LegoLoader 动画)
│   ├── router/             # Vue Router 路由守卫与映射配置
│   ├── types/              # TypeScript 全局接口强类型定义
│   ├── views/              # 业务页面 (Student、Dashboard、Intro 等)
│   ├── App.vue             # 根组件 (全局动画与注入点)
│   └── style.css           # 🎨 全局 Material Design 3 样式变量库
├── public/                 # 根路径静态资源
├── index.html              # 单页应用挂载主页
└── vite.config.ts          # Vite 构建引擎与反向代理配置
```

---

# 🚀 页面进展看板 (Frontend Status)
- [x] **登录门户**: 乐高动画闪屏、快捷键适配、暗黑模式适配
- [x] **决策看板**: ECharts 6 多维动态分析、自适应响应式布局
- [x] **学生管理**: 头像全栈上传、Excel 全能导入导出、分页 CRUD
- [x] **课程管理**: Excel 全能导入导出、学分动态绑定
- [x] **成绩录入**: 学分自动折算预览、Excel 筛选导出、三表联查展示
- [x] **系统健壮性**: 404 兜底页面、Axios 异常精准拦截、EmptyState 占位

---

# 🚀 极速启动指南

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

---

## 💎 开发环境依赖
- **Node.js**: v18.x 或更高
- **IDE**: WebStorm 或 VS Code (推荐安装 Volar 插件)
