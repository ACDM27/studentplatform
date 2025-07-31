<template>
  <div class="register-container">
    <h2>学生注册</h2>
    <n-form>
      <n-form-item label="用户名">
        <n-input v-model:value="username" placeholder="请输入用户名"/>
      </n-form-item>
      <n-form-item label="密码">
        <n-input v-model:value="password" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item label="确认密码">
        <n-input v-model:value="confirmPassword" type="password" placeholder="请再次输入密码"/>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="handleRegister">注册</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  // 这里添加注册逻辑
  console.log('注册信息:', username.value, password.value, confirmPassword.value)
  // 注册成功后跳转
  // router.push('/student/login')
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>