/**
 * API调试工具
 * 用于测试和调试API调用
 */

import { getStudentsMe, getStudentsProfile } from '../apis/index'

// 模拟登录token（用于测试）
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMwMDg2NDAwfQ.test'

// 设置模拟token
export const setMockToken = () => {
  localStorage.setItem('token', MOCK_TOKEN)
  console.log('已设置模拟token')
}

// 清除token
export const clearToken = () => {
  localStorage.removeItem('token')
  console.log('已清除token')
}

// 测试API调用
export const testUserAPI = async () => {
  console.log('=== 开始API测试 ===')
  
  try {
    console.log('1. 测试getStudentsMe...')
    const userResponse = await getStudentsMe()
    console.log('getStudentsMe成功:', userResponse)
  } catch (error) {
    console.error('getStudentsMe失败:', error)
  }
  
  try {
    console.log('2. 测试getStudentsProfile...')
    const profileResponse = await getStudentsProfile()
    console.log('getStudentsProfile成功:', profileResponse)
  } catch (error) {
    console.error('getStudentsProfile失败:', error)
  }
  
  console.log('=== API测试完成 ===')
}

// 在浏览器控制台中可用的全局函数
if (typeof window !== 'undefined') {
  (window as any).apiDebug = {
    setMockToken,
    clearToken,
    testUserAPI,
    checkToken: () => {
      const token = localStorage.getItem('token')
      console.log('当前token:', token ? '存在' : '不存在')
      if (token) {
        console.log('Token内容:', token)
      }
    }
  }
  
  console.log('API调试工具已加载，可在控制台使用:')
  console.log('- apiDebug.setMockToken() // 设置模拟token')
  console.log('- apiDebug.clearToken() // 清除token')
  console.log('- apiDebug.testUserAPI() // 测试API调用')
  console.log('- apiDebug.checkToken() // 检查当前token')
}