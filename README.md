````markdown
# 学生综合信息服务平台文档

## 一、学生应用端（Student-Facing Application）

核心关键词：学习、作业、简历、就业、反馈、荣誉、任务

1. **登录/注册页面（Login/Register）**
   - 功能：学号/手机号注册登录、验证码认证、找回密码。
   - 技术栈：Vue3 + Naive UI + Pinia。

2. **首页仪表盘（Dashboard/Home）**
   - 功能：展示学生头像、学业状态、最新任务/作业提醒、重要消息公告等。
   - 技术栈：Vue3 + Naive UI 卡片布局 + Pinia。

3. **教师信息查询页（Teacher Info）**
   - 功能：按学院/研究方向查询老师，展示联系信息和科研方向。
   - 技术栈：Vue3 + Naive UI 表格 + Pinia。

4. **反馈与申诉（Feedback & Appeal）**
   - 功能：提交匿名或实名反馈、问题申诉，显示处理进度。
   - 技术栈：Vue3 + Naive UI 表单与进度条 + Pinia。

5. **课程与毕业查询（Curriculum & Graduation）**
   - 功能：展示培养方案、已修/待修学分、课程分类等。
   - 技术栈：Vue3 + Naive UI 表格与分页 + Pinia。

6. **作业管理（Assignment Overview）**
   - 功能：按课程展示所有作业，支持提交状态查看、下载入口。
   - 技术栈：Vue3 + Naive UI 标签与分页 + Pinia。

7. **简历生成（Resume Generator）**
   - 功能：上传奖项、经历自动填入模板生成PDF。
   - 技术栈：Vue3 + Naive UI 表单 + Pinia。

8. **就业推荐（Job Recommendation）**
   - 功能：AI推荐岗位、岗位描述、收藏、外链申请。
   - 技术栈：Vue3 + Naive UI 列表与评分 + Pinia。

9. **人才市场（Talent Market）**
   - 功能：展示企业招聘信息、职位详情、企业联系、简历投递。
   - 技术栈：Vue3 + Naive UI 卡片与表格 + Pinia。

10. **咨询预约（Consulting Appointment）**
    - 功能：查看咨询老师时间表，预约时间段。
    - 技术栈：Vue3 + Naive UI 日历 + Pinia。

11. **荣誉展示（Honors & Rewards）**
    - 功能：上传证书，展示获奖分类，奖学金统计。
    - 技术栈：Vue3 + Naive UI 上传与图表 + Pinia。

12. **团党任务（Party & League Tasks）**
    - 功能：查看任务、上报进度、历史记录。
    - 技术栈：Vue3 + Naive UI 进度条与上传 + Pinia。

13. **问卷投票（Surveys & Polls）**
    - 功能：教师发起问卷，学生填写。
    - 技术栈：Vue3 + Naive UI 动态表单 + Pinia。

---

## 二、后台管理端（Admin Panel）

核心关键词：用户、AI配置、数据管理、任务审核、知识库

1. **后台登录（Admin Login）**
   - 功能：管理员工号登录。
   - 技术栈：Vue3 + Naive UI + Pinia。

2. **后台仪表盘（Admin Dashboard）**
   - 功能：注册人数、活跃度、完成率、AI调用次数等图表。
   - 技术栈：Vue3 + Naive UI 卡片与图表 + Pinia。

3. **用户管理（User Management）**
   - 功能：查找用户、权限分配、导入导出。
   - 技术栈：Vue3 + Naive UI 表格与树形 + Pinia。

4. **申诉审核（Appeal Review）**
   - 功能：审批反馈/申诉，标记、转交。
   - 技术栈：Vue3 + Naive UI 步骤条与状态 + Pinia。

5. **AI配置（AI Settings）**
   - 功能：配置Prompt、模块启停、监控调用。
   - 技术栈：Vue3 + Naive UI 代码编辑器与折叠面板 + Pinia。

6. **数据整合（Data Integration）**
   - 功能：数据源状态、ETL规则、预览与检测。
   - 技术栈：Vue3 + Naive UI 步骤条与表格 + Pinia。

7. **知识库管理（Knowledge Base）**
   - 功能：PDF上传、自动提取、图谱编辑。
   - 技术栈：Vue3 + Naive UI 文件上传与编辑器 + Pinia。

---

## 三、项目目录结构

```text
stu_plt/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/                 # 静态资源
│   ├── components/             # 组件存放
│   │   ├── student/            # 学生端组件
│   ├── layout/                 # 布局组件
│   ├── plugins/                # 插件注册（如naive-ui）
│   ├── router/                 # Vue Router 配置
│   ├── server/api/             # 后端 API 接口定义
│   │   ├── api.ts
│   │   └── http.ts
│   ├── store/                  # Pinia 状态管理
│   │   └── index.ts
│   ├── utils/                  # 工具函数
│   ├── views/                  # 页面视图
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── .env                         # 环境变量
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
````

---

## 四、API 接口规范

````markdown
### 1. 登录认证

- **URL:** `/api/auth/login`
- **方法:** `POST`
- **请求头:** `Content-Type: application/json`
- **请求体:**
  ```json
  {
    "identifier": "string", // 学号或手机号
    "password": "string"
  }
````

* **响应:**

  ```json
  {
    "token": "jwt-token",
    "user": { "id": number, "role": "student|admin|counselor" }
  }
  ```

### 2. 获取用户信息

* **URL:** `/api/auth/me`
* **方法:** `GET`
* **请求头:** `Authorization: Bearer <token>`
* **响应:**

  ```json
  {
    "id": 1,
    "name": "张三",
    "role": "student",
    "avatar": "url"
  }
  ```

### 3. 作业列表

* **URL:** `/api/assignments`
* **方法:** `GET`
* **请求头:** `Authorization: Bearer <token>`
* **查询参数:** `courseId`（可选）
* **响应:**

  ```json
  [
    { "id":1, "title":"作业1", "dueDate":"2025-07-20" },
    ...
  ]
  ```

### 4. 提交作业

* **URL:** `/api/assignments/{id}/submit`
* **方法:** `POST`
* **请求头:** `Authorization: Bearer <token>`
* **请求体:** `FormData`，包含 `file` 字段上传文件
* **响应:**

  ```json
  { "status": "success" }
  ```

### 5. 人才市场 - 获取企业列表

* **URL:** `/api/companies`
* **方法:** `GET`
* **请求头:** `Authorization: Bearer <token>`
* **查询参数:** `search`（可选）、`industry`（可选）、`location`（可选）、`size`（可选）
* **响应:**

  ```json
  {
    "companies": [
      {
        "id": 1,
        "name": "腾讯科技",
        "logo": "url",
        "industry": "互联网",
        "location": "深圳",
        "size": "10000+",
        "description": "公司描述",
        "positions": [
          {
            "id": 1,
            "title": "前端开发工程师",
            "salary": "15-25K",
            "type": "全职",
            "requirements": "要求描述"
          }
        ]
      }
    ],
    "total": 50
  }
  ```

### 6. 人才市场 - 获取企业详情

* **URL:** `/api/companies/{id}`
* **方法:** `GET`
* **请求头:** `Authorization: Bearer <token>`
* **响应:**

  ```json
  {
    "id": 1,
    "name": "腾讯科技",
    "logo": "url",
    "industry": "互联网",
    "location": "深圳",
    "size": "10000+",
    "description": "详细公司描述",
    "website": "https://www.tencent.com",
    "contact": {
      "email": "hr@tencent.com",
      "phone": "400-123-4567"
    },
    "positions": [...]
  }
  ```

### 7. 人才市场 - 联系企业

* **URL:** `/api/companies/{id}/contact`
* **方法:** `POST`
* **请求头:** `Authorization: Bearer <token>`
* **请求体:**

  ```json
  {
    "message": "联系信息",
    "resume_id": 1
  }
  ```

* **响应:**

  ```json
  { "status": "success", "message": "联系请求已发送" }
  ```

### 8. 人才市场 - 获取市场统计

* **URL:** `/api/market/stats`
* **方法:** `GET`
* **请求头:** `Authorization: Bearer <token>`
* **响应:**

  ```json
  {
    "total_companies": 150,
    "total_positions": 320,
    "active_recruitments": 89,
    "new_this_week": 25
  }
  ```

> 更多接口请参照 `src/server/api/api.ts`。

````

## 五、组件库使用规范

```markdown
- **UI 框架:** Naive UI

- **注册方式:** 在 `src/plugins/naive.ts` 中统一导入并注册：
  ```ts
  import { create, NConfigProvider, NButton, /* ... */ } from 'naive-ui'
  import type { App } from 'vue'

  export default function setupNaive(app: App) {
    const naive = create({
      components: [NConfigProvider, NButton /* ... */]
    })
    app.use(naive)
  }
````

* **图标库:** unplugin-icons + `Icon` 前缀，页面中直接使用：

  ```vue
  <template>
    <IconSchool />
  </template>
  ```

* **按需加载:** 配置 `unplugin-vue-components` 和 `unplugin-icons`，无需手动全局注册。

````

## 六、Vue 项目搭建规范

1. **初始化项目**
   ```bash
   npm init vue@latest stu_plt
   # 选择 Vue3 + TypeScript + Vue Router + Pinia + ESLint + Prettier + TailwindCSS
   cd stu_plt
   npm install
````

2. **目录调整**

   * 按照上文目录结构调整文件夹。

3. **环境变量**

   * 在根目录创建 `.env`：

     ```dotenv
     VITE_API_BASE_URL=http://localhost:1337/api
     ```
   * `src/utils/http.ts` 使用：

     ```ts
     import axios from 'axios'
     export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
     ```

4. **代码规范**

   * ESLint + Prettier 已配置，`npm run lint` 检查。

5. **启动项目**

   ```bash
   npm run dev
   ```