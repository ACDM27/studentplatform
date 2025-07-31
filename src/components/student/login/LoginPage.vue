<template>
  <div class="login-page">
    <div class="back-home" @click="goToHome">
      <n-icon size="20" class="back-icon">
        <IconArrowLeft :size="20" />
      </n-icon>
      <span>返回首页</span>
    </div>
    
    <div class="login-container">
      <div class="platform-header">
        <div class="icon-box">
          <n-icon size="32" class="platform-icon">
            <IconSchool :size="32" />
          </n-icon>
        </div>
        <h1>学生综合信息服务平台</h1>
      </div>
      
      <div class="login-box">
        <div class="avatar-container">
          <n-avatar size="large" round>
            <n-icon size="30">
              <IconUser :size="30" />
            </n-icon>
          </n-avatar>
        </div>
        
        <h2>学生登录</h2>
        <p class="login-tip">使用学号或手机号登录您的账户</p>
        
        <div class="login-tabs">
          <div 
            class="tab-item" 
            :class="{ active: loginType === 'id' }" 
            @click="loginType = 'id'"
          >
            学号登录
          </div>
          <div 
            class="tab-item" 
            :class="{ active: loginType === 'phone' }" 
            @click="loginType = 'phone'"
          >
            手机登录
          </div>
        </div>
        
        <n-form 
          class="login-form" 
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <template v-if="loginType === 'id'">
            <n-form-item label="学号" path="studentId">
              <n-input 
                v-model:value="formData.studentId" 
                placeholder="请输入学号"
                clearable
              >
                <template #prefix>
                  <n-icon class="input-icon">
                    <IconUser :size="24" />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input 
                v-model:value="formData.password" 
                type="password" 
                placeholder="请输入密码"
                clearable
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon class="input-icon">
                    <IconLock :size="24" />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <div class="remember-password">
                <n-checkbox v-model:checked="rememberPassword">记住密码</n-checkbox>
              </div>
            </n-form-item>
          </template>
          
          <template v-else>
            <n-form-item label="手机号" path="phone">
              <n-input 
                v-model:value="formData.phone" 
                placeholder="请输入手机号"
                clearable
              >
                <template #prefix>
                  <n-icon class="input-icon">
                    <IconPhone :size="24" />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="验证码" path="verifyCode">
              <div class="verify-code">
                <n-input 
                  v-model:value="formData.verifyCode" 
                  placeholder="请输入验证码"
                  clearable
                  class="verify-input"
                >
                  <template #prefix>
                    <n-icon class="input-icon verify-icon">
                      <IconMessageCircle :size="24" />
                    </n-icon>
                  </template>
                </n-input>
                <n-button class="code-btn" @click="sendVerifyCode" :disabled="sendingCode" :loading="sendingCode">
                  {{ codeButtonText }}
                </n-button>
              </div>
            </n-form-item>
          </template>
          
          <n-form-item>
            <n-button type="primary" block @click="handleLogin" color="#000000" :loading="loading">登录</n-button>
          </n-form-item>
        </n-form>
        
        <div class="login-footer">
          <n-button text class="forget-btn">忘记密码？</n-button>
          <n-button text class="register-btn" @click="goToRegister">注册账号</n-button>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <n-message-provider>
      <message-consumer ref="messageRef" />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IconUser,
  IconArrowLeft,
  IconIdBadge2,
  IconLock,
  IconPhone,
  IconMessageCircle,
  IconSchool
} from '@tabler/icons-vue'
import { login } from '../../../server/api/api'
import { FormInst, FormRules, useMessage } from 'naive-ui'

// 创建消息组件
const message = useMessage()
const MessageConsumer = {
  setup() {
    return {}
  },
  render() {
    return null
  }
}

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const messageRef = ref(null)
const loginType = ref('id') 
const loading = ref(false)
const sendingCode = ref(false)
const codeButtonText = ref('获取验证码')
const rememberPassword = ref(false)
const countdown = ref(60)

// 表单数据
const formData = reactive({
  studentId: '',
  password: '',
  phone: '',
  verifyCode: ''
})

// 表单验证规则
const rules: FormRules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
    // 已删除学号格式验证要求
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
  ]
}

// 检查是否有保存的登录信息
onMounted(() => {
  const savedStudentId = localStorage.getItem('savedStudentId')
  const savedPassword = localStorage.getItem('savedPassword')
  const savedRememberPassword = localStorage.getItem('rememberPassword')
  
  if (savedStudentId && savedPassword && savedRememberPassword === 'true') {
    formData.studentId = savedStudentId
    formData.password = savedPassword
    rememberPassword.value = true
  }
})

const handleLogin = async () => {
  if (loading.value) return
  
  // 表单验证
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查输入信息')
      return
    }
    
    loading.value = true
    
    try {
      if (loginType.value === 'id') {
        // 学号登录逻辑
        const loginData = {
          identifier: formData.studentId,  // 使用identifier，与后端API保持一致
          password: formData.password,
          rememberMe: rememberPassword.value
        }
        
        console.log('正在登录:', loginData)
        
        // 调用后端登录API
        const response = await login(loginData)
        
        console.log('登录响应:', response)
        
        // 处理登录成功响应
        if (response.data && response.data.jwt) {
          const token = response.data.jwt
          localStorage.setItem('token', token)
          
          // 记住密码功能
          if (rememberPassword.value) {
            localStorage.setItem('savedStudentId', formData.studentId)
            localStorage.setItem('savedPassword', formData.password)
            localStorage.setItem('rememberPassword', 'true')
          } else {
            localStorage.removeItem('savedStudentId')
            localStorage.removeItem('savedPassword')
            localStorage.removeItem('rememberPassword')
          }
          
          message.success('登录成功')
          
          // 登录成功后跳转
          setTimeout(() => {
            router.push('/student/dashboard')
          }, 1000)
        }
      } else {
        // 手机号登录逻辑
        console.log('手机登录信息:', formData.phone, formData.verifyCode)
        message.info('手机号登录功能开发中')
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      // 显示友好的错误提示
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        if (status === 400) {
          message.error('用户名或密码错误')
        } else if (status === 429) {
          message.error('登录尝试次数过多，请稍后再试')
        } else {
          message.error(data?.error?.message || '登录失败，请稍后再试')
        }
      } else {
        message.error('网络错误，请检查网络连接')
      }
    } finally {
      loading.value = false
    }
  })
}

const startCountdown = () => {
  sendingCode.value = true
  countdown.value = 60
  codeButtonText.value = `${countdown.value}秒后重试`
  
  const timer = setInterval(() => {
    countdown.value--
    codeButtonText.value = `${countdown.value}秒后重试`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      sendingCode.value = false
      codeButtonText.value = '获取验证码'
    }
  }, 1000)
}

const sendVerifyCode = () => {
  // 验证手机号
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    message.error('请输入正确的手机号')
    return
  }
  
  // 发送验证码逻辑
  console.log('发送验证码到:', formData.phone)
  message.success(`验证码已发送至 ${formData.phone}`)
  startCountdown()
}

const goToHome = () => {
  router.push('/')
}

const goToRegister = () => {
  router.push('/student/register')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e6f7ff 0%, #d0e8ff 50%, #c2e0ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
}

.back-home {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}

.back-icon {
  margin-right: 5px;
}

.login-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.platform-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background-color: #1890ff;
  border-radius: 4px;
  margin-right: 12px;
}

.platform-icon {
  color: white;
}

.platform-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  text-align: center;
}

.avatar-container {
  margin-bottom: 15px;
}

.login-box h2 {
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
  margin: 0 0 5px 0;
}

.login-tip {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s;
  font-size: 14px;
}

.tab-item.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.login-form {
  width: 100%;
  text-align: left;
}

.verify-code {
  display: flex;
  gap: 10px;
  width: 100%;
}

.verify-input {
  flex: 1;
}

.code-btn {
  white-space: nowrap;
}

.input-icon {
  margin: 0 4px;
}

.verify-icon {
  margin-left: 0;
}

.verify-input .n-input__placeholder {
  padding-left: 0;
}

.remember-password {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.forget-btn, .register-btn {
  font-size: 14px;
  color: #64748b;
}
</style>