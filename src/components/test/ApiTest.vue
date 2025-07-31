<template>
  <div class="api_test_page">
    <n-card title="API 测试工具">
      <div class="test_section">
        <h3>测试 getAchievementById 接口</h3>
        
        <div class="input_group">
          <n-input 
            v-model:value="test_id" 
            placeholder="请输入成果ID" 
            style="width: 200px; margin-right: 12px;"
          />
          <n-button type="primary" @click="testApi" :loading="testing">
            测试接口
          </n-button>
        </div>
        
        <div v-if="result" class="result_section">
          <h4>测试结果：</h4>
          <n-code :code="JSON.stringify(result, null, 2)" language="json" />
        </div>
        
        <div v-if="error" class="error_section">
          <h4>错误信息：</h4>
          <n-alert type="error" :title="error" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { getAchievementById } from '@/apis/index'

const message = useMessage()

const test_id = ref('1')
const testing = ref(false)
const result = ref<any>(null)
const error = ref('')

const testApi = async () => {
  if (!test_id.value) {
    message.error('请输入成果ID')
    return
  }
  
  testing.value = true
  result.value = null
  error.value = ''
  
  try {
    console.log('开始测试API，ID:', test_id.value)
    const response = await getAchievementById({ id: test_id.value })
    console.log('API测试成功，响应:', response)
    
    result.value = response
    message.success('API调用成功')
  } catch (err: any) {
    console.error('API测试失败:', err)
    error.value = err.message || '未知错误'
    message.error('API调用失败')
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.api_test_page {
  padding: 20px;
}

.test_section {
  margin-bottom: 24px;
}

.input_group {
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.result_section,
.error_section {
  margin-top: 16px;
}

.result_section h4,
.error_section h4 {
  margin-bottom: 8px;
}
</style>