<template>
  <div class="env-test">
    <h2>环境变量测试页面</h2>
    <div class="test-results">
      <h3>测试结果:</h3>
      <p><strong>环境检查状态:</strong> {{ envStatus }}</p>
      <p><strong>开发环境:</strong> {{ isDev }}</p>
      <p><strong>API基础URL:</strong> {{ apiBaseUrl }}</p>
      <p><strong>错误信息:</strong> {{ errorMessage || '无错误' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const envStatus = ref('检查中...')
const isDev = ref(false)
const apiBaseUrl = ref('')
const errorMessage = ref('')

// 安全获取环境变量
const getEnvVar = (key: string, defaultValue: string = '') => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || defaultValue
    }
    return defaultValue
  } catch (error) {
    console.warn(`无法获取环境变量 ${key}:`, error)
    return defaultValue
  }
}

// 安全检查开发环境
const checkDevelopment = (): boolean => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.DEV === true || import.meta.env.NODE_ENV === 'development'
    }
    return false
  } catch (error) {
    console.warn('无法检查开发环境:', error)
    return false
  }
}

onMounted(() => {
  try {
    envStatus.value = '检查完成'
    isDev.value = checkDevelopment()
    apiBaseUrl.value = getEnvVar('VITE_API_BASE_URL', 'http://localhost:1337/api')
    
    console.log('环境变量测试完成')
    console.log('开发环境:', isDev.value)
    console.log('API基础URL:', apiBaseUrl.value)
  } catch (error) {
    envStatus.value = '检查失败'
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    console.error('环境变量测试失败:', error)
  }
})
</script>

<style scoped>
.env-test {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.test-results {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.test-results p {
  margin: 10px 0;
}
</style>