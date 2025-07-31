// 课程API连接测试工具
import { fetchCourses } from '../server/api/api'

/**
 * 测试课程API连接
 * 使用与教师页面相同的axios调用方式
 */
export const testCourseAPIConnection = async () => {
  console.log(' 开始测试课程API连接...')
  
  try {
    const response = await fetchCourses()
    console.log('课程API连接成功!')
    console.log('响应数据结构:', response)
    
    if (response && response.data) {
      console.log('响应数据详情:', JSON.stringify(response.data, null, 2))
      
      // 检查数据结构
      let courseData = []
      if (Array.isArray(response.data)) {
        courseData = response.data
        console.log(`直接数组格式，共 ${courseData.length} 门课程`)
      } else if (response.data.data && Array.isArray(response.data.data)) {
        courseData = response.data.data
        console.log(` 嵌套数组格式，共 ${courseData.length} 门课程`)
      } else if (typeof response.data === 'object') {
        const keys = Object.keys(response.data)
        if (keys.length > 0 && typeof response.data[keys[0]] === 'object') {
          courseData = Object.values(response.data)
          console.log(`对象格式转换，共 ${courseData.length} 门课程`)
        }
      }
      
      // 显示第一门课程的详细信息
      if (courseData.length > 0) {
        console.log('第一门课程详情:', courseData[0])
      }
      
      return {
        success: true,
        data: courseData,
        message: `成功获取 ${courseData.length} 门课程`
      }
    } else {
      console.warn('响应中没有找到有效数据')
      return {
        success: false,
        data: [],
        message: '响应中没有找到有效数据'
      }
    }
  } catch (error: any) {
    console.error('课程API连接失败:', error)
    console.error('错误详情:', error.message)
    console.error('错误堆栈:', error.stack)
    
    return {
      success: false,
      data: [],
      message: `API连接失败: ${error.message}`
    }
  }
}

/**
 * 在浏览器控制台中运行测试
 * 使用方法: 在浏览器控制台中输入 window.testCourseAPI()
 */
export const runCourseAPIConnectionTest = async () => {
  const result = await testCourseAPIConnection()
  console.log('测试结果:', result)
  return result
}

// 将测试函数挂载到全局对象，便于在浏览器控制台中调用
if (typeof window !== 'undefined') {
  (window as any).testCourseAPI = runCourseAPIConnectionTest
  console.log('课程API测试工具已加载，可在控制台中使用 window.testCourseAPI() 进行测试')
}