<template>
  <div class="collect_page">
    <!-- 页面标题区域 -->
    <header class="header">
      <div class="header_top">
        <n-button 
          text 
          size="large" 
          @click="go_back"
          class="back_btn"
        >
          <template #icon>
            <ArrowLeft :size="20" />
          </template>
          返回成果展示
        </n-button>
      </div>
      <h1>成果收集</h1>
      <p>填写您的成果信息，记录成长足迹</p>
    </header>

    <!-- 表单区域 -->
    <n-card class="form_card">
      <n-form 
        ref="form_ref" 
        :model="form_data" 
        :rules="form_rules" 
        label-placement="top"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <!-- 基本信息区域 -->
        <div class="form_section">
          <h3 class="section_title">
            <FileText :size="20" />
            基本信息
          </h3>
          
          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <n-grid-item>
              <n-form-item label="学生ID" path="student_id">
                <n-input 
                  v-model:value="form_data.student_id" 
                  placeholder="请输入学生ID"
                  clearable
                />
              </n-form-item>
            </n-grid-item>
            
            <n-grid-item>
              <n-form-item label="姓名" path="name">
                <n-input 
                  v-model:value="form_data.name" 
                  placeholder="请输入姓名"
                  clearable
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <n-grid-item>
              <n-form-item label="成果标题" path="title">
                <n-input 
                  v-model:value="form_data.title" 
                  placeholder="请输入成果标题"
                  clearable
                />
              </n-form-item>
            </n-grid-item>
            
            <n-grid-item>
              <n-form-item label="成果类别" path="category">
                <n-select 
                  v-model:value="form_data.category" 
                  :options="category_opts" 
                  placeholder="请选择成果类别"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </div>

        <!-- 详细信息区域 -->
        <div class="form_section">
          <h3 class="section_title">
            <Award :size="20" />
            详细信息
          </h3>
          
          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <n-grid-item>
              <n-form-item label="奖项" path="award">
                <n-select 
                  v-model:value="form_data.award" 
                  :options="award_opts" 
                  placeholder="请选择奖项"
                />
              </n-form-item>
            </n-grid-item>
            
            <n-grid-item>
              <n-form-item label="等级" path="level">
                <n-select 
                  v-model:value="form_data.level" 
                  :options="level_opts" 
                  placeholder="请选择等级"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <n-grid-item>
              <n-form-item label="获奖日期" path="date">
                <n-date-picker 
                  v-model:value="form_data.date" 
                  type="date" 
                  placeholder="选择获奖日期"
                  @update:value="handle_date_change"
                  clearable
                />
              </n-form-item>
            </n-grid-item>
            
            <n-grid-item>
              <n-form-item label="导师姓名" path="tutor_name">
                <n-input 
                  v-model:value="form_data.tutor_name" 
                  placeholder="请输入导师姓名"
                  clearable
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </div>

        <!-- 附件上传区域 -->
        <div class="form_section">
          <h3 class="section_title">
            <Upload :size="20" />
            附件上传
          </h3>
          
          <n-form-item label="相关文件" path="attachments">
            <n-upload
              v-model:file-list="form_data.attachments"
              multiple
              directory-dnd
              :max="5"
              list-type="text"
              @before-upload="before_upload"
              @remove="handle_file_remove"
            >
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3">
                    <Upload />
                  </n-icon>
                </div>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域来上传
                </n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                  支持上传证书、获奖证明、论文等相关文件，最多5个文件
                </n-p>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form_actions">
          <n-space justify="center" size="large">
            <n-button size="large" @click="reset_form">
              <template #icon>
                <Refresh :size="20" />
              </template>
              重置表单
            </n-button>
            <n-button size="large" @click="save_draft">
              <template #icon>
                <Save :size="20" />
              </template>
              保存草稿
            </n-button>
            <n-button type="primary" size="large" @click="submitAchievementForm" :loading="submitting">
              <template #icon>
                <Send :size="20" />
              </template>
              提交成果
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst, UploadFileInfo } from 'naive-ui'
import {
  IconFileText as FileText,
  IconAward as Award,
  IconUpload as Upload,
  IconRefresh as Refresh,
  IconDeviceFloppy as Save,
  IconSend as Send,
  IconArrowLeft as ArrowLeft
} from '@tabler/icons-vue'
import { createAchievement } from '@/server/api/api'

const router = useRouter()
const message = useMessage()

// 表单引用
const form_ref = ref<FormInst | null>(null)

// 提交状态
const submitting = ref(false)

// 表单数据
const form_data = ref({
  student_id: '',
  name: '',
  category: '1', // 成果类别，对应后端category字段，默认为竞赛类
  award: '', // 奖项，对应后端award字段
  date: null as number | null, // 获奖日期，对应后端date字段
  level: '',
  title: '',
  tutor_name: '',
  attachments: [] as UploadFileInfo[]
})

// 表单验证规则
const form_rules = {
  student_id: [
    { required: true, message: '请输入学生ID', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9_-]+$/, 
      message: '学生ID只能包含字母、数字、下划线和短横线', 
      trigger: 'blur' 
    }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度应在2-50字符之间', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入成果标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2-100字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择成果类别', trigger: 'change' }
  ],
  award: [
    { required: true, message: '请选择奖项', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择等级', trigger: 'change' }
  ],
  date: [
    { 
      required: true, 
      message: '请选择获奖日期', 
      trigger: 'change',
      validator: (rule: any, value: number | null) => {
        if (!value) {
          return new Error('请选择获奖日期')
        }
        const selected_date = new Date(value)
        const today = new Date()
        if (selected_date > today) {
          return new Error('获奖日期不能晚于今天')
        }
        return true
      }
    }
  ],
  tutor_name: [
    { required: true, message: '请输入导师姓名', trigger: 'blur' },
    { min: 2, max: 30, message: '导师姓名长度应在2-30字符之间', trigger: 'blur' }
  ]
}

// 选项配置 - 保留数字值，映射为后端字段值
const category_opts = [
  { label: '竞赛类', value: '1', backendValue: 'competition' },
  { label: '科研类', value: '2', backendValue: 'research' },
  { label: '项目类', value: '3', backendValue: 'project' },
  { label: '论文类', value: '4', backendValue: 'paper' },
  { label: '专利类', value: '5', backendValue: 'patent' },
  { label: '证书类', value: '6', backendValue: 'certification' }
]

// 修正奖项配置，确保标签与值匹配
const award_opts = [
  { label: '特等奖', value: 'grandprize' },
  { label: '一等奖', value: 'firstprize' },
  { label: '二等奖', value: 'secondprize' },
  { label: '三等奖', value: 'thirdprize' },
  { label: '优秀奖', value: 'honorablemention' },
]

const level_opts = [
  { label: '国家级', value: 'international' },
  { label: '省部级', value: 'provincial' },
  { label: '校级', value: 'university' },
  { label: '院级', value: 'college' }
]

// 允许的文件类型配置
const allowed_file_types = {
  'application/pdf': 'PDF文件',
  'image/jpeg': 'JPEG图片',
  'image/jpg': 'JPG图片',
  'image/png': 'PNG图片',
  'application/msword': 'Word文档',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
  'application/vnd.ms-excel': 'Excel文档',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel文档'
}

// 最大文件大小（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 方法
const go_back = () => {
  router.push('/student/achievement')
}

const handle_date_change = (value: number | null) => {
  // 日期变化时无需额外处理，直接使用 date
  console.log('日期已更新:', value ? new Date(value).toLocaleDateString() : '未选择')
}

const before_upload = (data: { file: UploadFileInfo }) => {
  const file = data.file
  
  // 检查文件类型
  if (!file.type || !allowed_file_types[file.type as keyof typeof allowed_file_types]) {
    const allowed_types = Object.values(allowed_file_types).join('、')
    message.error(`只支持以下文件类型：${allowed_types}`)
    return false
  }
  
  // 检查文件大小
  if ((file.file?.size || 0) > MAX_FILE_SIZE) {
    message.error('文件大小不能超过10MB')
    return false
  }
  
  // 检查文件名长度
  if (file.name && file.name.length > 100) {
    message.error('文件名长度不能超过100个字符')
    return false
  }
  
  // 检查是否有重复文件
  const existing_files = form_data.value.attachments
  const is_duplicate = existing_files.some(existing_file => 
    existing_file.name === file.name && existing_file.file?.size === file.file?.size
  )
  
  if (is_duplicate) {
    message.warning('该文件已存在，请勿重复上传')
    return false
  }
  
  return true
}

const handle_file_remove = (data: { file: UploadFileInfo }) => {
  message.info('文件已移除')
}

const reset_form = () => {
  form_ref.value?.restoreValidation()
  Object.assign(form_data.value, {
    student_id: '',
    name: '',
    category: '1', // 默认为竞赛类
    award: '',
    date: null,
    level: '',
    title: '',
    tutor_name: '',
    attachments: []
  })
  message.success('表单已重置')
}

const save_draft = () => {
  try {
    const draft_data = { ...form_data.value }
    // 不保存文件对象，只保存文件信息
    draft_data.attachments = draft_data.attachments.map(file => ({
      ...file,
      file: null // 清除文件对象，避免序列化问题
    }))
    
    localStorage.setItem('achievement_draft', JSON.stringify(draft_data))
    message.success('草稿已保存')
  } catch (error) {
    console.error('保存草稿失败:', error)
    message.error('保存草稿失败，请重试')
  }
}

// 主要提交函数
const submitAchievementForm = async () => {
  try {
    // 表单验证
    await form_ref.value?.validate()
    submitting.value = true
    
    // 获取当前选择的 category 数字值
    const selectedCategory = form_data.value.category;
    
    // 找到对应的后端字段值
    const selectedCategoryOption = category_opts.find(option => option.value === selectedCategory);
    const categoryBackendValue = selectedCategoryOption ? selectedCategoryOption.backendValue : '';

    // 构建符合后端API要求的提交数据格式
    const submit_data = {
      data: {
        student_id: form_data.value.student_id.trim(),
        name: form_data.value.name.trim(),
        category: categoryBackendValue,  // 使用映射后的值
        award: form_data.value.award,
        level: form_data.value.level,
        date: form_data.value.date ? new Date(form_data.value.date).toISOString() : new Date().toISOString(),
        title: form_data.value.title.trim(),
        tutor_name: form_data.value.tutor_name.trim(),
      }
    }
    
    console.log('提交数据:', submit_data)
    
    // 调用API提交到 /api/achievements
    const response = await createAchievement(submit_data)
    
    if (response.status === 200 || response.status === 201) {
      message.success('成果提交成功！')
      // 清除草稿
      localStorage.removeItem('achievement_draft')
      // 返回成果展示页面
      router.push('/student/achievement')
    } else {
      throw new Error(`提交失败，状态码：${response.status}`)
    }
    
  } catch (error: any) {
    console.error('提交失败:', error)
    
    // 详细的错误处理
    if (error.name === 'ValidationError') {
      message.error('请完善必填信息后再提交')
    } else if (error.response?.status === 400) {
      message.error('数据格式有误，请检查后重试')
    } else if (error.response?.status === 401) {
      message.error('身份验证失败，请重新登录')
    } else if (error.response?.status === 403) {
      message.error('权限不足，无法提交成果')
    } else if (error.response?.status === 500) {
      message.error('服务器错误，请稍后重试')
    } else if (error.message?.includes('网络')) {
      message.error('网络连接异常，请检查网络后重试')
    } else {
      message.error('提交失败，请重试或联系管理员')
    }
  } finally {
    submitting.value = false
  }
}

// 页面初始化
onMounted(() => {
  // 尝试恢复草稿
  try {
    const draft = localStorage.getItem('achievement_draft')
    if (draft) {
      const draft_data = JSON.parse(draft)
      // 恢复基本数据，但不恢复文件列表（文件对象无法序列化）
      Object.assign(form_data.value, {
        ...draft_data,
        attachments: [] // 重置文件列表
      })
      message.info('已恢复上次保存的草稿（不包含文件）')
    }
  } catch (error) {
    console.error('恢复草稿失败:', error)
    localStorage.removeItem('achievement_draft') // 清除损坏的草稿
  }
})
</script>

<style scoped>
.collect_page {
  padding: 16px;
  font-family: "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
  padding: 20px 0;
}

.header_top {
  margin-bottom: 16px;
}

.back_btn {
  color: #409eff;
  font-size: 14px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.back_btn:hover {
  background-color: #f0f8ff;
  color: #337ecc;
}

.header h1 {
  font-weight: 700;
  font-size: 28px;
  margin: 0;
  color: #333;
}

.header p {
  color: #666;
  font-size: 16px;
  margin: 8px 0 0 0;
}

.form_card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form_section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form_section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section_title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.form_actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .collect_page {
    padding: 12px;
  }
  
  .form_section {
    margin-bottom: 24px;
  }
  
  .section_title {
    font-size: 14px;
  }
  
  /* 移动端表单布局调整 */
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
}

/* 文件上传样式优化 */
:deep(.n-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

:deep(.n-upload-dragger:hover) {
  border-color: #409eff;
  background-color: #f0f8ff;
}

/* 表单项间距优化 */
:deep(.n-form-item) {
  margin-bottom: 0;
}

/* 按钮样式优化 */
:deep(.n-button) {
  border-radius: 6px;
}

/* 输入框样式优化 */
:deep(.n-input) {
  border-radius: 6px;
}

:deep(.n-select) {
  border-radius: 6px;
}

:deep(.n-date-picker) {
  width: 100%;
}
</style>