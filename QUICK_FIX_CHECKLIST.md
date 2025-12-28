# 登录跳转问题 - 快速修复清单

## ✅ 已完成的修复

1. **登录响应处理优化** (`src/components/student/login/LoginPage.vue`)
   - 兼容多种响应数据格式 (`response.jwt` 和 `response.data.jwt`)
   - 添加详细的控制台日志
   - 优化错误提示信息

2. **路由守卫日志增强** (`src/router/index.ts`)
   - 添加详细的路由跳转日志
   - Token 检查日志
   - 便于追踪路由跳转过程

3. **HTTP 拦截器优化** (`src/server/api/http.ts`)
   - 特殊处理登录接口响应
   - 保持数据结构一致性

## 🔍 立即检查项

### 1. 后端服务状态
```bash
# 检查后端是否运行
curl http://localhost:1337/api
```
**预期结果**: 返回 API 响应，不是连接错误

### 2. 环境变量配置
检查 `.env` 文件：
```
VITE_API_URL=http://localhost:1337
VITE_API_BASE_URL=http://localhost:1337/api
```

### 3. 浏览器控制台
打开开发者工具（F12），执行登录操作，查看：
- ✅ 是否有 "发送 POST 请求到: /auth/local"
- ✅ 是否有 "响应成功: 200"
- ✅ 是否有 "成功获取token"
- ✅ 是否有 "开始跳转到 /student/dashboard"
- ✅ 是否有 "路由跳转成功"

### 4. localStorage 检查
在控制台执行：
```javascript
localStorage.getItem('token')
```
**预期结果**: 返回一个 JWT token 字符串（不是 null）

## 🚀 测试步骤

### 方法 1: 使用测试工具（推荐）
1. 在浏览器中打开 `test-login-flow.html`
2. 按照页面提示逐步测试
3. 查看每个测试的结果

### 方法 2: 手动测试
1. 启动前端开发服务器：
   ```bash
   npm run dev
   ```

2. 访问登录页面：
   ```
   http://localhost:5173/#/login
   ```

3. 输入正确的用户名和密码

4. 点击登录，观察：
   - 是否显示 "登录成功，正在跳转..."
   - 是否自动跳转到 Dashboard
   - URL 是否变为 `/#/student/dashboard`

### 方法 3: API 直接测试
使用 curl 或 Postman 测试登录接口：
```bash
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{"identifier":"你的用户名","password":"你的密码"}'
```

**预期响应**:
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

## 🐛 常见问题及解决方案

### 问题 1: "网络连接失败"
**原因**: 后端服务未启动或地址错误

**解决**:
```bash
# 检查后端服务
curl http://localhost:1337

# 如果失败，启动后端服务
cd your-backend-folder
npm run develop
```

### 问题 2: "用户名或密码错误"
**原因**: 
- 用户不存在
- 密码不正确
- 后端数据库未初始化

**解决**:
1. 确认用户已在后端创建
2. 检查密码是否正确
3. 查看后端日志确认错误详情

### 问题 3: 登录成功但没有跳转
**原因**: 
- Token 未正确保存
- 路由配置问题
- 响应数据格式不匹配

**解决**:
1. 检查控制台日志，查找 "成功获取token" 消息
2. 检查 localStorage 是否有 token
3. 查看完整的响应数据结构

### 问题 4: 跳转后立即返回登录页
**原因**: 
- Token 验证失败
- 路由守卫拦截

**解决**:
1. 检查控制台日志中的 "Token检查" 输出
2. 确认 token 格式正确
3. 检查后端 JWT 配置

### 问题 5: 404 错误
**原因**: Dashboard 组件不存在或路径错误

**解决**:
1. 确认文件存在: `src/components/student/dashboard/DashboardPage.vue`
2. 检查路由配置中的 import 路径
3. 重启开发服务器

## 📝 调试命令速查

### 清除登录状态
```javascript
localStorage.clear()
location.reload()
```

### 手动设置 Token
```javascript
localStorage.setItem('token', 'your-token-here')
```

### 手动跳转
```javascript
window.location.href = '/#/student/dashboard'
```

### 查看所有 localStorage
```javascript
console.table(Object.entries(localStorage))
```

### 测试路由守卫
```javascript
// 在控制台执行
console.log('Token:', localStorage.getItem('token'))
window.$router.push('/student/dashboard')
```

## 🎯 下一步行动

如果以上步骤都无法解决问题，请：

1. **收集信息**:
   - 浏览器控制台的完整日志（截图或复制）
   - Network 标签中登录请求的详情
   - localStorage 的内容
   - 当前停留的 URL

2. **提供后端信息**:
   - 后端框架和版本（Strapi 版本）
   - 登录接口的实际响应格式
   - 后端日志中的错误信息

3. **尝试临时方案**:
   ```javascript
   // 在登录成功后，使用强制刷新跳转
   window.location.href = '/#/student/dashboard'
   window.location.reload()
   ```

## 📞 需要帮助？

如果问题仍然存在，请提供：
1. 完整的控制台日志
2. Network 请求详情
3. 后端响应数据
4. 当前的 URL 和路由状态

这将帮助快速定位问题！
