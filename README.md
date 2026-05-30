# 🎨 学生信息管理系统 - 前端工程 (student_client)

本项目是学生信息管理系统的现代化前端工程，基于 **Vite + Vue 3 + TypeScript** 架构搭建。全站遵循 **Material Design 3** 视觉规范，引入 **ECharts 6** 提供专业级决策大屏。

---

# 🔗 相关仓库

| 仓库 | 地址 | 说明 |
|------|------|------|
| **前端** | [student_client](https://github.com/SHUI-yer/student_client) | Vue 3 + TypeScript 前端项目（本仓库） |
| **后端** | [student-server](https://github.com/SHUI-yer/student-server) | Spring Boot 后端项目 |

---

# 🚀 快速部署（给 Clone 用户）

### 环境要求
| 软件 | 版本 | 用途 |
|------|------|------|
| Java JDK | 17+ | 运行后端 |
| MySQL | 8.0+ | 数据库 |
| Node.js | 18+ | 运行前端 |

### 一键部署步骤

```bash
# 1. 克隆两个仓库
git clone https://github.com/SHUI-yer/student-server.git
git clone https://github.com/SHUI-yer/student_client.git

# 2. 创建数据库
mysql -u root -p -e "CREATE DATABASE student_systerm DEFAULT CHARACTER SET utf8mb4;"

# 3. 导入数据
mysql -u root -p student_systerm < student-server/init_database.sql

# 4. 配置数据库密码
# 编辑 student-server/src/main/resources/application-local.properties
# 修改 spring.datasource.password=你的MySQL密码

# 5. 启动后端（终端1）
cd student-server
./mvnw spring-boot:run

# 6. 启动前端（终端2）
cd student_client
npm install
npm run dev

# 7. 访问系统
# 打开浏览器 http://localhost:5173
```

### 默认登录账号
| 用户名 | 密码 |
|--------|------|
| admin | 123456 |

---

# ✨ 核心视觉与交互亮点 (UI/UX Highlights)

- **Material Design 3 极致重构**: 建立了标准的三级灰阶背景体系 (`#000000 / #1C1C1E / #2C2C2E`)，确保在暗黑模式下拥有极致的物理纵深感与视觉沉浸。
- **数字化决策分析大屏**: 新增 `/dashboard` 页面，实时展示历年趋势聚合、及格率波动、以及基于**标准差算法**的课程难度评估雷达图。
- **高级过场动画**: 登录页集成"乐高积木堆叠 + 动态打字机光标"特效，赋予系统极强的科技品牌感与仪式感。
- **Excel 全链路集成**: 学生、课程、成绩三大模块全面支持"下载模板 -> 格式引导(带图标提示) -> 批量导入 -> **按条件筛选导出**"的闭环操作。
- **毛玻璃与沉浸式体验**: 顶栏集成 `backdrop-filter` 模糊特效，配合骨架屏加载、路由滑入滑出动效。
- **交互逻辑加固**: 成绩录入支持百分制实时预览学分换算，自动空状态 (EmptyState) 占位提示，键盘快捷键 (Enter) 登录优化。

---

# 📂 核心目录结构
```text
student_client/
├── src/
│   ├── api/                # Axios 封装与业务 API 接口
│   │   ├── request.ts      # Axios 实例与拦截器配置
│   │   └── score.ts        # 成绩相关 API
│   ├── assets/             # 静态资源 (Logo、图标)
│   ├── components/         # 复用组件
│   │   ├── EmptyState.vue  # 空状态占位组件
│   │   └── LegoLoader.vue  # 乐高加载动画组件
│   ├── router/             # Vue Router 路由守卫与映射配置
│   ├── types/              # TypeScript 全局接口强类型定义
│   ├── views/              # 业务页面
│   │   ├── Login.vue       # 登录页 (含乐高动画)
│   │   ├── Layout.vue      # 主布局框架
│   │   ├── Home.vue        # 首页大厅
│   │   ├── Student.vue     # 学生管理
│   │   ├── Course.vue      # 课程管理
│   │   ├── Score.vue       # 成绩管理
│   │   └── Dashboard.vue   # 数据可视化大屏
│   ├── App.vue             # 根组件
│   ├── main.ts             # 应用入口
│   └── style.css           # 🎨 全局 Material Design 3 样式变量库
├── public/                 # 根路径静态资源
├── index.html              # 单页应用挂载主页
├── vite.config.ts          # Vite 构建引擎配置
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
└── package.json            # 项目依赖配置
```

---

# 🛠️ 环境准备

### 系统要求
| 环境 | 版本要求 | 说明 |
|------|----------|------|
| **Node.js** | 18.x+ | 推荐 LTS 版本 |
| **npm** | 9.x+ | 或使用 yarn/pnpm |

### IDE 推荐
- **WebStorm** 或 **VS Code**（推荐安装 Volar 插件）

---

# 🚀 启动方式

### 方式一：独立开发模式（推荐）

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
打开浏览器访问：**http://localhost:5173**

> ⚠️ 注意：开发模式需要同时启动后端服务（默认 http://localhost:8080）

### 方式二：打包后部署

1. **构建生产版本**
```bash
npm run build
```

2. **预览构建结果**
```bash
npm run preview
```

构建产物会生成在 `dist/` 目录，可部署到任意静态服务器。

---

# 📝 环境变量配置

项目使用环境变量区分开发和生产环境的 API 地址：

### `.env.development`（开发环境）
```properties
VITE_API_BASE_URL=http://localhost:8080
```

### `.env.production`（生产环境）
```properties
VITE_API_BASE_URL=
```

> 生产环境留空表示使用相对路径，适用于前后端一体化部署场景。

---

# 🔌 API 接口说明

前端通过 Axios 与后端通信，主要接口包括：

| 模块 | 接口 | 说明 |
|------|------|------|
| 认证 | `POST /api/login` | 用户登录 |
| 学生 | `GET/POST/DELETE /api/student/*` | 学生 CRUD |
| 课程 | `GET/POST/DELETE /api/course/*` | 课程 CRUD |
| 成绩 | `GET/POST/DELETE /api/score/*` | 成绩 CRUD |
| 统计 | `GET /api/stat/dashboard` | 大屏数据 |
| 文件 | `POST /api/file/upload` | 文件上传 |
| Excel | `GET/POST /api/excel/*` | Excel 导入导出 |

---

# 🎨 主题定制

项目使用 CSS 变量实现主题切换，主要变量定义在 `style.css`：

### 浅色模式
```css
--bg-main: #FFFFFF;        /* 主背景 */
--bg-secondary: #F2F2F7;   /* 次级背景 */
--bg-tertiary: #FFFFFF;    /* 三级背景 */
--text-primary: #000000;   /* 主文字 */
--text-secondary: rgba(60, 60, 67, 0.6);  /* 次级文字 */
```

### 深色模式
```css
--bg-main: #000000;        /* 主背景 */
--bg-secondary: #1C1C1E;   /* 次级背景 */
--bg-tertiary: #2C2C2E;    /* 三级背景 */
--text-primary: #FFFFFF;   /* 主文字 */
--text-secondary: rgba(235, 235, 245, 0.6);  /* 次级文字 */
```

---

# 📊 页面进展看板 (Frontend Status)
- [x] **登录门户**: 乐高动画闪屏、快捷键适配、暗黑模式适配
- [x] **决策看板**: ECharts 6 多维动态分析、自适应响应式布局
- [x] **学生管理**: 头像全栈上传、Excel 全能导入导出、分页 CRUD
- [x] **课程管理**: Excel 全能导入导出、学分动态绑定
- [x] **成绩录入**: 学分自动折算预览、Excel 筛选导出、三表联查展示
- [x] **系统健壮性**: 404 兜底页面、Axios 异常精准拦截、EmptyState 占位

---

# 💎 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5+ | 核心框架 |
| TypeScript | 5.0+ | 类型安全 |
| Vite | 5.0+ | 构建工具 |
| Element Plus | 2.4+ | UI 组件库 |
| ECharts | 5.4+ | 图表库 |
| Axios | 1.6+ | HTTP 客户端 |
| Vue Router | 4.2+ | 路由管理 |
| @vueuse/core | 10.0+ | 组合式工具库 |

---

# 📚 相关文档
- [后端项目](https://github.com/SHUI-yer/student-server)
