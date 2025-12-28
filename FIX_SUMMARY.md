# 证书OCR组件错误修复说明

## 问题描述
提交证书信息时出现错误：
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid key image_url"
  }
}
```

## 问题原因
后端 Achievement 模型不支持 `image_url` 字段，直接在创建时传入该字段会导致验证失败。

## 解决方案

### 1. 移除无效字段 ✅
从提交数据中移除了 `image_url` 字段，只提交后端模型支持的字段：
- `title` - 证书标题
- `name` - 学生姓名
- `tutor_name` - 指导教师
- `date` - 获奖日期
- `category` - 成果类型
- `level` - 成果级别
- `award` - 奖项等级
- `issuer` - 颁发机构
- `notes` - 备注信息
- `student` - 学生ID（关联）
- `student_id` - 学生ID（字符串）

### 2. 简化图片处理 ✅
采用"仅识别不保存"的策略：

**图片用途**
- ✅ 用于AI识别提取文字信息
- ✅ 用于前端预览
- ❌ 不保存到数据库
- ❌ 不上传到服务器

**优势**
- 避免存储空间浪费
- 减少上传失败风险
- 简化提交流程
- 提高成功率

### 3. 增强错误处理 ✅
- 详细的错误日志输出
- 友好的错误提示信息
- 字段验证错误的详细说明
- 清晰的成功提示

## 使用方法

### 标准流程
1. 上传证书图片（仅用于识别）
2. 点击识别按钮
3. 查看自动填充的表单信息
4. 确认或修改表单内容
5. 点击提交保存
6. 系统保存文字信息到数据库
7. 表单自动重置，可继续添加

### 图片说明
- 📷 上传的图片仅用于AI识别
- 📝 只保存识别出的文字信息
- 🗑️ 图片不会保存到数据库
- 📎 如需保存图片，请在成果详情页手动上传

## 测试建议

### 测试场景1：标准流程
- 上传证书 → 识别 → 提交
- 预期：文字信息保存成功，显示成功提示

### 测试场景2：手动修改
- 上传证书 → 识别 → 修改表单 → 提交
- 预期：修改后的信息保存成功

### 测试场景3：必填字段验证
- 上传证书 → 识别 → 清空必填字段 → 提交
- 预期：显示验证错误提示

## 后端要求

### Achievement 模型字段
确保后端模型包含以下字段：
```typescript
{
  title: string
  name: string
  tutor_name: string
  date: string (YYYY-MM-DD)
  category: enum
  level: enum
  award: enum
  issuer: string
  notes: string
  student: relation
  student_id: string
  attachments: relation (多个文件)
}
```

### OCR识别接口
```
POST /ocr/process
Content-Type: multipart/form-data

参数：
- image: File
- certificateType: string
- userId: string

返回：识别结果（仅用于提取文字信息）
```

## 已修复的问题
- ✅ ValidationError: Invalid key image_url
- ✅ 图片上传导致的错误
- ✅ 错误提示不够友好
- ✅ 提交流程复杂

## 优化改进
- ✅ 简化为"仅识别不保存"模式
- ✅ 移除所有图片上传相关代码
- ✅ 详细的错误处理和日志
- ✅ 清晰的用户提示信息
- ✅ 更高的提交成功率
