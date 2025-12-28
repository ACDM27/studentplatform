# 登录跳转问题调试指南

## 已修复的问题

### 1. 登录响应数据处理
- **问题**: 登录 API 返回的数据结构可能不一致
- **修复**: 在 `LoginPage.vue` 中添加了兼容性处理，支持 `response.jwt` 和 `response.data.jwt` 两种格式
- **位置**: `src/components/student/login/LoginPage.vue` 第 183-185 行

### 2. 路由跳转日志
- **问题**: 无法追踪路由跳转过程
- **修复**: 添加了详细的控制台日志，可以追踪跳转过程
- **位置**: `src/components/student/login/LoginPage.vue` 第 199-203 行

### 3. 路由守卫日志
- **问题**: 无法确认路由守卫是否正确执行
- **修复**: 在路由守卫中添加了详细日志
- **位置**: `src/router/index.ts` 第 127-150 行

## 调试步骤

### 步骤 1: 检查后端 API
1. 确认后端服务运行在 `http://localhost:1337`
2. 测试登录接口是否正常：
```bash
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{"identifier":"你的用户名","password":"你的密码"}'
```

预期响应格式：
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 步骤 2: 检查浏览器控制台
打开浏览器开发者工具（F12），查看控制台输出：

1. **登录请求日志**：
   - `发送 POST 请求到: /auth/local`
   - `请求数据: {identifier: "...", password: "..."}`

2. **登录响应日志**：
   - `响应成功: 200 {...}`
   - `登录响应数据结构: {...}`
   - `成功获取token，准备保存并跳转`

3. **路由跳转日志**：
   - `开始跳转到 /student/dashboard`
   - `路由守卫检查: {to: "/student/dashboard", ...}`
   - `Token检查: 存在`
   - `已登录，允许访问`
   - `路由跳转成功`

### 步骤 3: 检查 localStorage
在浏览器控制台执行：
```javascript
localStorage.getItem('token')
```
应该返回一个 JWT token 字符串

### 步骤 4: 手动测试路由
在登录后，在浏览器控制台执行：
```javascript
window.$router.push('/student/dashboard')
```
查看是否能成功跳转

## 常见问题排查

### 问题 1: 登录成功但没有跳转
**可能原因**:
- 后端返回的数据结构不包含 `jwt` 字段
- Token 没有正确保存到 localStorage

**解决方法**:
1. 检查控制台日志中的 "登录响应数据结构"
2. 确认是否输出了 "成功获取token"
3. 检查 localStorage 中是否有 token

### 问题 2: 跳转后立即返回登录页
**可能原因**:
- Token 保存失败
- 路由守卫检查失败

**解决方法**:
1. 检查控制台日志中的 "Token检查" 输出
2. 确认路由守卫是否输出 "已登录，允许访问"

### 问题 3: 404 错误
**可能原因**:
- Dashboard 组件路径错误
- 路由配置问题

**解决方法**:
1. 确认文件存在: `src/components/student/dashboard/DashboardPage.vue`
2. 检查路由配置中的 component 路径

### 问题 4: 后端 API 连接失败
**可能原因**:
- 后端服务未启动
- API 地址配置错误
- CORS 问题

**解决方法**:
1. 确认后端服务运行: `http://localhost:1337`
2. 检查 `.env` 文件中的 `VITE_API_BASE_URL`
3. 检查后端 CORS 配置

## 测试用例

### 测试 1: 正常登录流程
1. 访问 `http://localhost:5173/#/login`
2. 输入正确的用户名和密码
3. 点击登录按钮
4. 观察控制台日志
5. 应该自动跳转到 `/student/dashboard`

### 测试 2: Token 持久化
1. 完成登录
2. 刷新页面
3. 应该保持登录状态，不会返回登录页

### 测试 3: 未登录访问保护路由
1. 清除 localStorage: `localStorage.clear()`
2. 访问 `http://localhost:5173/#/student/dashboard`
3. 应该自动重定向到登录页

## 下一步操作

如果问题仍然存在，请提供以下信息：

1. **浏览器控制台的完整日志**（从点击登录到跳转失败的所有日志）
2. **Network 标签中的登录请求详情**（请求和响应）
3. **localStorage 中的内容**（执行 `console.log(localStorage)` 的结果）
4. **当前 URL**（登录后停留在哪个页面）

## 临时解决方案

如果需要快速测试，可以在登录成功后手动跳转：

1. 登录成功后，在控制台执行：
```javascript
localStorage.setItem('token', 'your-token-here')
window.location.href = '/#/student/dashboard'
```

2. 或者修改登录组件，使用 `window.location.href` 代替 `router.push`：
```javascript
window.location.href = '/#/student/dashboard'
```
