# OCR structuredData 更新说明

## 更新内容

已将 OCR 证书识别功能从使用 `prefillFields` 更新为使用 `structuredData`。

## 修改的文件

1. ✅ `src/components/student/honors/CertificateOcr.vue`
2. ✅ `CERTIFICATE_OCR_USAGE.md`

## 数据结构变化

### 修改前（prefillFields）

```json
{
  "success": true,
  "data": {
    "prefillFields": {
      "certificateTitle": "...",
      "studentNames": "...",
      ...
    }
  }
}
```

### 修改后（structuredData）

**格式 1：扁平结构**
```json
{
  "success": true,
  "structuredData": {
    "certificateTitle": "...",
    "studentNames": "...",
    ...
  }
}
```

**格式 2：嵌套结构**
```json
{
  "success": true,
  "data": {
    "structuredData": {
      "certificateTitle": "...",
      "studentNames": "...",
      ...
    }
  }
}
```

## 兼容性

代码已经实现了向后兼容，会按以下优先级查找数据：

1. `ocrRes.structuredData` - 新格式（扁平）
2. `ocrRes.data.structuredData` - 新格式（嵌套）
3. `ocrRes.prefillFields` - 旧格式（扁平）- 兼容
4. `ocrRes.data.prefillFields` - 旧格式（嵌套）- 兼容

```typescript
const structuredData = ocrRes.structuredData 
                    || ocrRes.data?.structuredData 
                    || ocrRes.prefillFields 
                    || ocrRes.data?.prefillFields 
                    || {}
```

## 调试信息

代码会输出详细的调试信息，帮助确定数据来源：

```
OCR 响应数据: {...}
OCR 响应数据结构: {...}
structuredData 对象: {...}
structuredData 来源: ocrRes.structuredData
```

可能的来源值：
- `ocrRes.structuredData` - 使用新格式（扁平）
- `ocrRes.data.structuredData` - 使用新格式（嵌套）
- `ocrRes.prefillFields (兼容旧格式)` - 使用旧格式（扁平）
- `ocrRes.data.prefillFields (兼容旧格式)` - 使用旧格式（嵌套）
- `未找到` - 数据结构不匹配

## 后端要求

后端 OCR 接口应该返回以下格式之一：

### 推荐格式（扁平）
```json
{
  "success": true,
  "structuredData": {
    "certificateTitle": "第六届智警杯大数据技能竞赛",
    "studentNames": "朱锋、潘思翰、吴东泽",
    "teacherNames": "秦振凯、李猛",
    "awardDate": "2024-06-01",
    "achievementLevel": "省级",
    "achievementType": "竞赛类",
    "awardLevel": "一等奖"
  },
  "tempFileUrl": "/uploads/temp/xxx.jpg"
}
```

### 备选格式（嵌套）
```json
{
  "success": true,
  "data": {
    "structuredData": {
      "certificateTitle": "第六届智警杯大数据技能竞赛",
      "studentNames": "朱锋、潘思翰、吴东泽",
      "teacherNames": "秦振凯、李猛",
      "awardDate": "2024-06-01",
      "achievementLevel": "省级",
      "achievementType": "竞赛类",
      "awardLevel": "一等奖"
    },
    "tempFileUrl": "/uploads/temp/xxx.jpg"
  }
}
```

## structuredData 字段说明

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `certificateTitle` | string | 证书标题 | "第六届智警杯大数据技能竞赛" |
| `studentNames` | string | 学生姓名（多个用逗号分隔） | "朱锋、潘思翰、吴东泽" |
| `teacherNames` | string | 指导教师（多个用逗号分隔） | "秦振凯、李猛" |
| `awardDate` | string | 获奖日期 | "2024-06-01" |
| `achievementLevel` | string | 成果级别 | "省级" / "national" |
| `achievementType` | string | 成果类型 | "竞赛类" / "competition" |
| `awardLevel` | string | 奖项等级 | "一等奖" / "firstprize" |
| `notes` | string | 备注信息 | "第六届，作品名：六栋五幺六" |

## 测试步骤

1. 打开证书识别页面
2. 上传证书图片
3. 点击"点击识别证书内容"
4. 打开浏览器控制台（F12）
5. 查看输出的调试信息：
   - 确认 `structuredData 来源` 显示正确
   - 确认 `structuredData 对象` 包含数据
   - 确认表单字段被正确填充

## 注意事项

1. ✅ 代码已兼容旧的 `prefillFields` 格式
2. ✅ 优先使用 `structuredData`
3. ✅ 支持扁平和嵌套两种结构
4. ⚠️ 如果后端使用其他字段名，需要修改代码中的字段查找逻辑

## 相关文档

- `CERTIFICATE_OCR_USAGE.md` - 证书OCR识别组件使用说明
- `前后端数据不一致问题解决方案.md` - 响应拦截器修改说明
