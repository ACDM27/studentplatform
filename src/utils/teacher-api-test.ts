// 教师API测试工具
import { fetchTeachers, fetchTeacherById } from '../server/api/api'

/**
 * 测试教师API连接
 */
export const testTeacherAPI = async () => {
  console.log('=== 开始测试教师API ===')
  
  try {
    // 1. 测试获取教师列表
    console.log('1. 测试获取教师列表...')
    const teachersResponse = await fetchTeachers()
    console.log('教师列表响应:', teachersResponse)
    
    if (teachersResponse && teachersResponse.data) {
      let teachersList = []
      
      // 处理不同的响应格式
      if (Array.isArray(teachersResponse.data)) {
        teachersList = teachersResponse.data
      } else if (teachersResponse.data.data && Array.isArray(teachersResponse.data.data)) {
        teachersList = teachersResponse.data.data
      }
      
      console.log(`获取到 ${teachersList.length} 个教师`)
      
      if (teachersList.length > 0) {
        const firstTeacher = teachersList[0]
        console.log('第一个教师数据:', firstTeacher)
        console.log('第一个教师ID:', firstTeacher.id, '类型:', typeof firstTeacher.id)
        
        // 2. 测试获取教师详情
        console.log('2. 测试获取教师详情...')
        const teacherId = firstTeacher.id
        console.log(`尝试获取教师详情，ID: ${teacherId}`)
        
        try {
          const teacherDetailResponse = await fetchTeacherById(teacherId)
          console.log('教师详情响应:', teacherDetailResponse)
          console.log('✅ 教师详情API测试成功')
        } catch (detailError: any) {
          console.error('❌ 教师详情API测试失败:', detailError)
          
          if (detailError.response) {
            console.error(`HTTP状态码: ${detailError.response.status}`)
            console.error(`错误信息: ${detailError.response.statusText}`)
            console.error('响应数据:', detailError.response.data)
          }
          
          // 尝试其他可能的ID格式
          console.log('尝试其他ID格式...')
          const alternativeIds = [
            String(teacherId),
            Number(teacherId),
            `teacher_${teacherId}`,
            teacherId.toString()
          ]
          
          for (const altId of alternativeIds) {
            try {
              console.log(`尝试ID: ${altId} (类型: ${typeof altId})`)
              const altResponse = await fetchTeacherById(altId)
              console.log(`✅ 使用ID ${altId} 成功获取教师详情:`, altResponse)
              break
            } catch (altError) {
              console.log(`❌ ID ${altId} 失败`)
            }
          }
        }
      } else {
        console.warn('教师列表为空，无法测试详情API')
      }
    } else {
      console.error('获取教师列表失败：响应格式错误')
    }
  } catch (error: any) {
    console.error('❌ 教师列表API测试失败:', error)
    
    if (error.response) {
      console.error(`HTTP状态码: ${error.response.status}`)
      console.error(`错误信息: ${error.response.statusText}`)
    }
  }
  
  console.log('=== 教师API测试完成 ===')
}

/**
 * 测试特定教师ID的详情获取
 */
export const testSpecificTeacherDetail = async (teacherId: string | number) => {
  console.log(`=== 测试特定教师详情 (ID: ${teacherId}) ===`)
  
  try {
    const response = await fetchTeacherById(teacherId)
    console.log('✅ 成功获取教师详情:', response)
    return response
  } catch (error: any) {
    console.error('❌ 获取教师详情失败:', error)
    
    if (error.response) {
      console.error(`HTTP状态码: ${error.response.status}`)
      console.error(`错误信息: ${error.response.statusText}`)
      console.error('完整错误响应:', error.response)
    }
    
    throw error
  }
}

/**
 * 安全获取环境变量
 */
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

/**
 * 检查是否为开发环境
 */
const isDev = () => {
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

/**
 * 检查API基础配置
 */
export const checkAPIConfig = () => {
  console.log('=== API配置检查 ===')
  
  const baseURL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:1337/api')
  console.log('API基础URL:', baseURL)
  
  // 检查环境变量
  console.log('环境变量:')
  console.log('- VITE_API_BASE_URL:', getEnvVar('VITE_API_BASE_URL'))
  console.log('- NODE_ENV:', getEnvVar('NODE_ENV'))
  console.log('- DEV:', isDev())
  console.log('- PROD:', getEnvVar('PROD'))
  
  // 检查完整的API端点
  console.log('教师相关API端点:')
  console.log('- 教师列表:', `${baseURL}/teachers`)
  console.log('- 教师详情:', `${baseURL}/teachers/{id}`)
  
  console.log('=== API配置检查完成 ===')
}