<template>
  <div class="home-container">
    <div class="content-box">
      <div class="platform-title">
        <div class="icon-box">
          <n-icon size="32" class="title-icon">
            <IconSchool :size="32" />
          </n-icon>
        </div>
        <h1>学生综合信息服务平台</h1>
      </div>
      <p class="platform-desc">为学生提供一站式综合服务，助力学业发展与成长</p>
      
      <div class="platform-content">
        <div class="avatar-container">
          <n-avatar size="large" round>
            <n-icon size="30">
              <IconUser :size="30" />
            </n-icon>
          </n-avatar>
        </div>
        
        <div class="feature-icons">
          <div class="feature-item">
            <n-icon size="32" class="feature-icon">
              <IconBook :size="32" />
            </n-icon>
            <span>学习管理</span>
          </div>
          <div class="feature-item">
            <n-icon size="32" class="feature-icon">
              <IconBell :size="32" />
            </n-icon>
            <span>课程提示</span>
          </div>
          <div class="feature-item">
            <n-icon size="32" class="feature-icon">
              <IconMessageCircle :size="32" />
            </n-icon>
            <span>交流咨询</span>
          </div>
          <div class="feature-item">
            <n-icon size="32" class="feature-icon">
              <IconTrendingUp :size="32" />
            </n-icon>
            <span>就业动向</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <n-button type="primary" size="large" class="login-btn" @click="goToLogin" color="#000000">学生登录</n-button>
          <n-button size="large" class="register-btn" @click="goToRegister" :color="hoverRegister ? '#1890ff' : undefined" @mouseenter="hoverRegister = true" @mouseleave="hoverRegister = false">新用户注册</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import {
  IconUser,
  IconBook,
  IconBell,
  IconMessageCircle,
  IconTrendingUp,
  IconSchool
} from '@tabler/icons-vue'

const router = useRouter()
const hoverRegister = ref(false)

const goToLogin = () => {
  router.push('/student/login')
}

const goToRegister = () => {
  router.push('/student/register')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e6f7ff 0%, #d0e8ff 50%, #c2e0ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.content-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  padding: 40px 30px;
  text-align: center;
}

.platform-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #1890ff;
  border-radius: 4px;
  margin-right: 12px;
}

.title-icon {
  color: white;
}

.platform-title h1 {
  font-size: 28px;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.platform-desc {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 30px;
}

.avatar-container {
  margin-bottom: 20px;
}

.service-title {
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.service-desc {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 30px;
}

.feature-icons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.feature-icon {
  color: #1890ff;
  margin-bottom: 8px;
}

.feature-item span {
  font-size: 14px;
  color: #64748b;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.login-btn {
  flex: 1;
}

.register-btn {
  flex: 1;
}
</style>