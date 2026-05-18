- - # 🎨 学生信息管理系统 - 前端工程（student_client）

    本项目是学生信息管理系统的现代化前端工程，基于 **Vite + Vue 3 + TypeScript** 架构搭建，引入 **Element Plus** 组件库提供高颜值后台交互。
  
    ---
  
    # 🛠️ 一、 本地开发环境依赖
  
    在运行本项目前，请确保您的本地电脑已安装好以下环境：
  
    - **Node.js**：`v18.x` 或更高版本（内置 `npm`）
    - **推荐 IDE**：
      - `WebStorm`
      - `VS Code`（推荐安装 `Volar` 插件）
  
    ---
  
    # 🚀 二、 克隆后的快速配置与运行
  
    ## 步骤 1：安装项目“家具”（依赖包）
  
    由于工程配置了严格的 `.gitignore` 规则，庞大的 `node_modules` 实体依赖包未上传至云端。
  
    克隆项目后，需在前端根目录下打开终端，执行以下命令进行完整恢复：
  
    ```bash
    # 使用 npm 安装全套开发依赖
    npm install
    ```
  
    执行完毕后，本地会自动生成：
  
    ```text
    node_modules
    ```
  
    文件夹。
  
    ---
  
    ## 步骤 2：检查底层开发环境配置（TypeScript 防傲娇）
  
    本项目开启了严格的：
  
    ```json
    verbatimModuleSyntax
    ```
  
    类型安全检测。
  
    如果您的编辑器报错，请确保根目录下的：
  
    ```text
    env.d.ts
    ```
  
    类型声明文件完好。
  
    它负责为：
  
    ```text
    .vue
    ```
  
    单文件组件提供类型翻译。
  
    ---
  
    ### ⚠️ 纯类型引入规范
  
    纯类型引入必须严格遵循：
  
    ```ts
    import type { AxiosResponse } from 'axios'
    ```
  
    规范。
  
    严禁类型与运行时代码混合导入，否则 TS 编译器可能疯狂亮红。
  
    ---
  
    ## 步骤 3：联调与启动服务
  
    请确保您的 Java 后端服务（`8080` 端口）已处于开启状态。
  
    在前端根目录下执行开发环境拉起命令：
  
    ```bash
    npm run dev
    ```
  
    终端输出启动成功链接后：
  
    - 按住 `Ctrl`
    - 点击地址
  
    默认访问地址：
  
    ```text
    http://localhost:5173
    ```
  
    即可在浏览器中打开系统。
  
    ---
  
    # 📁 三、 核心代码目录拓扑说明
  
    为了保持高标准的：
  
    - 代码组织
    - 模块解耦
    - 工程规整度
  
    请遵循以下模块进行二次开发：
  
    ```text
    src/
    ├── api/
    │   └── request.ts
    │       # 核心封装的 Axios 拦截器
    │       # （统一注入 Token 与拦截异常码）
    │
    ├── views/
    │   └── Login.vue
    │       # 基于 Element Plus 响应式布局的登录控制中心
    │
    ├── main.ts
    │       # 前端总管入口
    │       # （全局注入 Element Plus 组件库与样式皮肤）
    │
    └── env.d.ts
            # TS 全局环境翻译官声明文件
    ```
  
    ---
  
    # ⚡ 四、 Windows 环境专属：全栈极速通关
  
    如果您在前后端同级目录下看到了自动化脚本，在配置好数据库后，甚至无需打开 IDEA 和 WebStorm。
  
    ---
  
    ## ▶️ start.bat（一键开工）
  
    双击：
  
    ```text
    start.bat
    ```
  
    即可自动拉起两个独立的后台终端：
  
    - 8080 后端服务
    - 5173 前端服务
  
    实现真正意义上的：
  
    > 一键全栈启动
  
    ---
  
    ## 🛑 stop.bat（一键收工）
  
    双击：
  
    ```text
    stop.bat
    ```
  
    即可：
  
    - 安全强杀端口进程
    - 关闭全部开发服务
    - 清理后台占用
  
    从源头杜绝：
  
    - 第二次启动失败
    - 端口冲突
    - 僵尸进程残留
  
    等经典开发期 Bug。
  
    ---
  
    # 📦 五、 前端技术栈总览
  
    本项目当前采用如下核心技术栈：
  
    | 技术         | 作用                 |
    | ------------ | -------------------- |
    | Vue 3        | 前端核心框架         |
    | TypeScript   | 类型安全与工程化开发 |
    | Vite         | 极速构建工具         |
    | Element Plus | 企业级 UI 组件库     |
    | Axios        | HTTP 网络请求工具    |
    | Vue Router   | 前端页面路由管理     |
    | LocalStorage | Token 本地缓存固化   |
  
    ---
  
    # 🔐 六、 登录鉴权机制说明
  
    系统登录流程如下：
  
    ```mermaid
    sequenceDiagram
        autonumber
    
        actor User as 👤 用户
        participant View as 🎨 Login.vue
        participant Axios as 📡 request.ts
        participant Backend as ☕ SpringBoot 后端
        participant Storage as 💾 LocalStorage
    
        User->>View: 输入账号密码
        View->>Axios: 发起 POST 登录请求
        Axios->>Backend: 请求 /api/login
        Backend-->>Axios: 返回 Token
        Axios->>Storage: localStorage.setItem()
        Axios-->>View: 登录成功
    ```
  
    ---
  
    # 🧠 七、 开发规范建议
  
    ## ✅ 推荐提交规范（Git Commit）
  
    建议采用如下格式：
  
    ```bash
    feat: 新增登录页
    fix: 修复 token 丢失问题
    style: 调整页面布局
    refactor: 重构 request.ts
    ```
  
    ---
  
    ## ✅ 推荐模块拆分原则
  
    - 页面放 `views`
    - 网络请求放 `api`
    - 公共组件放 `components`
    - 工具函数放 `utils`
    - 路由配置放 `router`
  
    保持：
  
    > 单模块职责单一原则
  
    避免后期代码爆炸式混乱。
  
    ---
  
    # 🎯 八、 当前工程阶段
  
    目前系统已完成：
  
    - ✅ 前后端联调
    - ✅ 登录鉴权
    - ✅ Axios Token 注入
    - ✅ CORS 跨域放行
    - ✅ LocalStorage 持久化
    - ✅ Element Plus UI 初始化
    - ✅ TypeScript 环境适配
  
    下一阶段建议开发：
  
    - 📚 学生管理模块
    - 📚 课程管理模块
    - 📚 成绩录入系统
    - 📚 JWT 路由守卫
    - 📚 权限角色管理（RBAC）
  
    ---