<template>
  <div class="certificate-recognizer">

    <!-- 1. 上传区域 -->
    <el-card class="upload-card" shadow="hover">
      <el-upload
        drag
        action=""
        :http-request="handleUpload"
        :show-file-list="false"
        accept="image/*"
        :before-upload="beforeUpload"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          {{ imageUrl ? '重新上传证书图片' : '拖拽证书图片到此处，或点击上传' }}
        </div>
      </el-upload>

      <!-- 预览上传的图片 -->
      <div v-if="imageUrl" class="image-preview">
        <img :src="imageUrl" alt="证书预览" />
        <el-button type="primary" size="small" @click="recognizeCertificate" :loading="recognizing">
          {{ recognizing ? '识别中...' : '点击识别证书内容' }}
        </el-button>
      </div>
    </el-card>

    <!-- 2. 识别结果表单 -->
    <el-card class="form-card" shadow="hover" style="margin-top: 20px">
      <template #header>
        <span>证书信息</span>
      </template>

      <el-form :model="form" label-width="120px" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="证书标题" prop="title" required>
              <el-input v-model="form.title" placeholder="请输入证书标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成果类型" prop="category" required>
              <el-select v-model="form.category" placeholder="请选择成果类型" style="width: 100%">
                <el-option label="竞赛类" value="competition" />
                <el-option label="专利类" value="patent" />
                <el-option label="论文类" value="paper" />
                <el-option label="项目类" value="project" />
                <el-option label="证书类" value="certificate" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="name" required>
              <el-input v-model="form.name" placeholder="多个学生用逗号分隔" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指导教师" prop="tutor_name">
              <el-input v-model="form.tutor_name" placeholder="多个老师用逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成果级别" prop="level" required>
              <el-select v-model="form.level" placeholder="请选择成果级别" style="width: 100%">
                <el-option label="国际级" value="international" />
                <el-option label="国家级" value="national" />
                <el-option label="省级" value="provincial" />
                <el-option label="校级" value="university" />
                <el-option label="院级" value="college" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖项等级" prop="award">
              <el-select v-model="form.award" placeholder="请选择奖项等级（可选）" clearable style="width: 100%">
                <el-option label="特等奖" value="grandprize" />
                <el-option label="一等奖" value="firstprize" />
                <el-option label="二等奖" value="secondprize" />
                <el-option label="三等奖" value="thirdprize" />
                <el-option label="优秀奖" value="honorablemention" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="获奖时间" prop="date" required>
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择获奖日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁发机构" prop="issuer">
              <el-input v-model="form.issuer" placeholder="请输入颁发机构" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注信息" prop="notes">
              <el-input 
                v-model="form.notes" 
                type="textarea" 
                :rows="3"
                placeholder="请输入备注信息（如作品名称、获奖届次等）" 
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24" style="text-align: center">
            <el-form-item>
              <el-button type="success" @click="submitForm" size="large">
                提交保存证书信息
              </el-button>
              <el-button @click="resetForm" size="large">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 识别状态提示 -->
    <el-alert v-if="recognitionTip" :title="recognitionTip" type="info" style="margin-top: 20px" show-icon />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { processOcr, fetchStudentMe, createAchievement } from '@/server/api/api'
import { toAbsoluteUrl } from '@/server/api/http'

// 状态
const imageUrl = ref('')
const recognizing = ref(false)
const recognitionTip = ref('')
const selectedFile = ref(null)
const previewObjectUrl = ref('')
const studentId = ref('')

// 表单数据 - 对应后端 Achievement 字段
const form = reactive({
  title: '',              // 证书标题
  name: '',               // 学生姓名
  tutor_name: '',         // 指导教师
  date: '',               // 获奖日期 YYYY-MM-DD
  category: '',           // 成果类型（英文枚举）
  level: '',              // 成果级别（英文枚举）
  award: '',              // 奖项等级（英文枚举）
  issuer: '',             // 颁发机构
  notes: ''               // 备注信息
})

const extractedInfo = reactive({
  title: '',
  recipient: '',
  issuer: '',
  awardDate: null,
  type: '',
  level: '',
  prize: '',
  description: ''
})

// 枚举映射 - 中英文对照
const levelCnMap = {
  international: '国际级',
  national: '国家级',
  provincial: '省级',
  university: '校级',
  college: '院级',
  other: '其他'
}
const levelEnMap = {
  国际级: 'international',
  国家级: 'national',
  省级: 'provincial',
  校级: 'university',
  院级: 'college',
  其他: 'other'
}

const categoryCnMap = {
  competition: '竞赛类',
  patent: '专利类',
  paper: '论文类',
  project: '项目类',
  certificate: '证书类',
  other: '其他'
}
const categoryEnMap = {
  竞赛类: 'competition',
  专利类: 'patent',
  论文类: 'paper',
  项目类: 'project',
  证书类: 'certificate',
  其他: 'other'
}

const awardCnMap = {
  grandprize: '特等奖',
  firstprize: '一等奖',
  secondprize: '二等奖',
  thirdprize: '三等奖',
  honorablemention: '优秀奖',
  other: '其他'
}
const awardEnMap = {
  特等奖: 'grandprize',
  一等奖: 'firstprize',
  二等奖: 'secondprize',
  三等奖: 'thirdprize',
  优秀奖: 'honorablemention',
  其他: 'other'
}

const pickFirst = (obj, keys) => {
  for (const k of keys) {
    const v = obj && obj[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
}

const toTimestamp = (v) => {
  if (v === undefined || v === null || v === '') return null
  if (typeof v === 'number') return isNaN(v) ? null : v
  if (typeof v === 'string') {
    const n = Number(v)
    if (!isNaN(n) && String(n).length >= 10) return n
    const t = new Date(v).getTime()
    return isNaN(t) ? null : t
  }
  if (v instanceof Date) {
    const t = v.getTime()
    return isNaN(t) ? null : t
  }
  return null
}

const normalizeLevel = (v) => {
  const s = String(v || '').trim()
  if (!s) return ''
  if (levelCnMap[s]) return levelEnMap[s]
  const allowed = new Set(['international','national','provincial','university','college'])
  if (allowed.has(s)) return s
  if (/国际|世界/.test(s)) return 'international'
  if (/全国|国家|中国/.test(s)) return 'national'
  if (/省|市/.test(s)) return 'provincial'
  if (/院/.test(s)) return 'college'
  return 'university'
}

const getRawTextFromPayload = (payload) => {
  const p = payload || {}
  const candidates = [
    p.rawText,
    p.text,
    p.ocrText,
    p.result && p.result.rawText,
    p.result && p.result.text,
    p.data && p.data.rawText,
    p.data && p.data.text,
    p.data && p.data.ocrText
  ].filter((v) => typeof v === 'string' && v.trim() !== '')
  if (candidates.length > 0) return String(candidates[0])
  if (typeof p.data === 'string') return p.data
  if (typeof p === 'string') return p
  try {
    return JSON.stringify(p.data ?? p, null, 2)
  } catch {
    return ''
  }
}

const writeToForm = () => {
  console.log('writeToForm 被调用，extractedInfo:', extractedInfo)
  
  // 映射到后端 Achievement 字段
  form.title = extractedInfo.title || ''
  form.name = extractedInfo.recipient || ''
  form.tutor_name = extractedInfo.issuer || ''
  form.issuer = extractedInfo.issuer || ''
  form.notes = extractedInfo.description || ''
  
  // 成果级别映射（英文枚举）
  form.level = extractedInfo.level || ''
  
  // 成果类型映射（默认竞赛类）
  form.category = extractedInfo.type || 'competition'
  
  // 奖项等级映射（英文枚举）
  form.award = extractedInfo.prize || ''
  
  // 日期格式化为 YYYY-MM-DD
  if (extractedInfo.awardDate) {
    const d = new Date(extractedInfo.awardDate)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const da = String(d.getDate()).padStart(2, '0')
      form.date = `${y}-${m}-${da}`
    }
  }
  
  console.log('writeToForm 执行后，form:', {
    title: form.title,
    name: form.name,
    tutor_name: form.tutor_name,
    date: form.date,
    category: form.category,
    level: form.level,
    award: form.award,
    issuer: form.issuer,
    notes: form.notes
  })
}

// 上传前校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片格式！')
    return false
  }
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件过大，需小于10MB')
    return false
  }
  return true
}

// 自定义上传（这里转为 base64 并预览）
const handleUpload = ({ file }) => {
  selectedFile.value = file
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = ''
  }
  previewObjectUrl.value = URL.createObjectURL(file)
  imageUrl.value = previewObjectUrl.value
  recognitionTip.value = '图片上传成功，请点击识别'
}

// 主功能：调用通义千问视觉识别（示例使用阿里云 DashScope API）
const recognizeCertificate = async () => {
  if (!imageUrl.value) return

  recognizing.value = true
  recognitionTip.value = '正在使用通义千问视觉模型识别证书内容，请稍候...'

  const loading = ElLoading.service({
    lock: true,
    text: 'AI 识别中，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    if (!studentId.value) {
      try {
        const me = await fetchStudentMe()
        // 注意：响应拦截器已经返回了 response.data，所以 me 就是数据本身
        const id = me && (me.student_id || me.id)
        if (id) studentId.value = String(id)
      } catch {}
    }
    const ocrRes = await processOcr(selectedFile.value, {
      certificateType: 'certificate',
      userId: studentId.value
    })
    
    // 添加调试日志
    console.log('OCR 响应数据:', ocrRes)
    console.log('OCR 响应数据类型:', typeof ocrRes)
    console.log('OCR 响应数据结构:', JSON.stringify(ocrRes, null, 2))
    
    // 注意：响应拦截器已经返回了 response.data，所以 ocrRes 就是数据本身
    if (!ocrRes || ocrRes.success === false) {
      const errMsg = (ocrRes && ocrRes.error) || '识别失败或返回异常'
      throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg))
    }
    
    // 获取 structuredData 对象（后端返回的结构化数据）
    // 优先使用 structuredData，兼容旧的 prefillFields
    const structuredData = ocrRes.structuredData 
                        || ocrRes.data?.structuredData 
                        || ocrRes.prefillFields 
                        || ocrRes.data?.prefillFields 
                        || {}
    
    // 添加调试日志
    console.log('structuredData 对象:', structuredData)
    console.log('structuredData 来源:', 
      ocrRes.structuredData ? 'ocrRes.structuredData' :
      ocrRes.data?.structuredData ? 'ocrRes.data.structuredData' :
      ocrRes.prefillFields ? 'ocrRes.prefillFields (兼容旧格式)' :
      ocrRes.data?.prefillFields ? 'ocrRes.data.prefillFields (兼容旧格式)' :
      '未找到'
    )
    
    // 重置 extractedInfo
    Object.assign(extractedInfo, {
      title: '',
      recipient: '',
      issuer: '',
      awardDate: null,
      type: '',
      level: '',
      prize: '',
      description: ''
    })
    
    // 直接从 structuredData 提取数据
    if (structuredData && typeof structuredData === 'object') {
      // 证书标题
      extractedInfo.title = structuredData.certificateTitle || structuredData.title || ''
      
      // 学生姓名
      extractedInfo.recipient = structuredData.studentNames || structuredData.winnerName || structuredData.name || ''
      
      // 指导老师
      extractedInfo.issuer = structuredData.teacherNames || structuredData.tutor || structuredData.issuer || ''
      
      // 获奖日期
      if (structuredData.awardDate) {
        const ts = toTimestamp(structuredData.awardDate)
        extractedInfo.awardDate = ts
      }
      
      // 成果级别
      if (structuredData.achievementLevel || structuredData.level) {
        const lvl = normalizeLevel(structuredData.achievementLevel || structuredData.level)
        extractedInfo.level = lvl
      }
      
      // 成果类型
      if (structuredData.achievementType || structuredData.category) {
        const typeStr = String(structuredData.achievementType || structuredData.category).toLowerCase()
        if (categoryEnMap[structuredData.achievementType]) {
          extractedInfo.type = categoryEnMap[structuredData.achievementType]
        } else if (/竞赛|比赛|contest|competition/.test(typeStr)) {
          extractedInfo.type = 'competition'
        } else if (/专利|patent/.test(typeStr)) {
          extractedInfo.type = 'patent'
        } else if (/论文|paper/.test(typeStr)) {
          extractedInfo.type = 'paper'
        } else if (/项目|project/.test(typeStr)) {
          extractedInfo.type = 'project'
        } else if (/证书|certificate/.test(typeStr)) {
          extractedInfo.type = 'certificate'
        } else {
          extractedInfo.type = 'competition' // 默认竞赛类
        }
      }
      
      // 奖项等级（映射到后端支持的枚举值）
      if (structuredData.awardLevel || structuredData.prize) {
        const prizeStr = String(structuredData.awardLevel || structuredData.prize)
        if (awardEnMap[prizeStr]) {
          extractedInfo.prize = awardEnMap[prizeStr]
        } else if (/特等|grand|特/.test(prizeStr)) {
          extractedInfo.prize = 'grandprize'
        } else if (/一等|first|1st/.test(prizeStr)) {
          extractedInfo.prize = 'firstprize'
        } else if (/二等|second|2nd/.test(prizeStr)) {
          extractedInfo.prize = 'secondprize'
        } else if (/三等|third|3rd/.test(prizeStr)) {
          extractedInfo.prize = 'thirdprize'
        } else if (/优秀|honorable|excellence/.test(prizeStr)) {
          extractedInfo.prize = 'honorablemention'
        }
      }
      
      // 备注信息
      extractedInfo.description = structuredData.notes || structuredData.description || structuredData.remark || ''
      
      console.log('从 structuredData 提取的数据:', extractedInfo)
    }
    
    // 添加调试日志
    console.log('提取后的 extractedInfo:', extractedInfo)
    console.log('调用 writeToForm 前的 form:', form)
    
    writeToForm()
    
    // 添加调试日志
    console.log('调用 writeToForm 后的 form:', form)
    
    recognitionTip.value = '识别完成，已自动填充信息'
    ElMessage.success('证书识别成功')
  } catch (err) {
    console.error(err)
    recognitionTip.value = '识别失败，请检查图片清晰度或稍后重试'
    ElMessage.error('证书识别失败：' + err.message)
  } finally {
    recognizing.value = false
    loading.close()
  }
}

// 提交表单到后端
const submitForm = async () => {
  // 表单验证
  if (!form.title) {
    ElMessage.warning('请填写证书标题')
    return
  }
  if (!form.name) {
    ElMessage.warning('请填写学生姓名')
    return
  }
  if (!form.date) {
    ElMessage.warning('请选择获奖日期')
    return
  }
  if (!form.category) {
    ElMessage.warning('请选择成果类型')
    return
  }
  if (!form.level) {
    ElMessage.warning('请选择成果级别')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '正在保存证书信息...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 获取当前学生ID
    let currentStudentId = studentId.value
    if (!currentStudentId) {
      const me = await fetchStudentMe()
      // 注意：响应拦截器已经返回了 response.data，所以 me 就是数据本身
      currentStudentId = me?.id || me?.student_id
    }
    
    // 构建提交数据（符合后端 Achievement 结构）
    // 只包含后端模型定义的字段
    const submitData = {
      data: {
        title: form.title,
        name: form.name,
        tutor_name: form.tutor_name || '',
        date: form.date,
        category: form.category,
        level: form.level,
        award: form.award || '', // 后端支持空字符串
        issuer: form.issuer || '',
        notes: form.notes || ''
      }
    }
    
    // 添加学生关联（如果有ID）
    if (currentStudentId) {
      // 尝试两种可能的字段名
      submitData.data.student = parseInt(currentStudentId)
      submitData.data.student_id = String(currentStudentId)
    }
    
    console.log('提交到后端的数据：', submitData)
    
    // 调用创建成果接口
    const response = await createAchievement(submitData)
    
    console.log('保存成功，响应：', response)
    
    // 注意：响应拦截器已经返回了 response.data，所以 response 就是数据本身
    // 检查响应是否成功
    if (response?.error) {
      throw new Error(response.error.message || '保存失败')
    }
    
    const achievementId = response?.data?.id || response?.id
    
    ElMessage({
      message: `证书信息已成功保存！${achievementId ? `(ID: ${achievementId})` : ''}`,
      type: 'success',
      duration: 3000,
      showClose: true
    })
    
    // 重置表单
    setTimeout(() => {
      resetForm()
    }, 500)
    
  } catch (error) {
    console.error('保存失败，完整错误：', error)
    
    // 解析错误信息
    let errorMessage = '保存失败'
    
    if (error?.response?.data?.error) {
      const err = error.response.data.error
      errorMessage = err.message || errorMessage
      
      // 如果是字段验证错误，显示详细信息
      if (err.details) {
        console.error('字段验证错误详情：', err.details)
        errorMessage += `：${err.details.key || ''} 字段无效`
      }
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    ElMessage({
      message: errorMessage,
      type: 'error',
      duration: 5000,
      showClose: true
    })
  } finally {
    loading.close()
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    title: '',
    name: '',
    tutor_name: '',
    date: '',
    category: '',
    level: '',
    award: '',
    issuer: '',
    notes: ''
  })
  Object.assign(extractedInfo, {
    title: '',
    recipient: '',
    issuer: '',
    awardDate: null,
    type: '',
    level: '',
    prize: '',
    description: ''
  })
  imageUrl.value = ''
  recognitionTip.value = ''
  selectedFile.value = null
  
  // 清理预览图片的内存
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = ''
  }
}
</script>

<style scoped>
.certificate-recognizer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.upload-card {
  text-align: center;
}

.image-preview {
  margin-top: 20px;
}

.image-preview img {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.el-icon--upload {
  font-size: 48px;
  color: #409eff;
}
</style>