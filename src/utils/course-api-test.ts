// 课程 API 测试工具
import { getCourses } from '@/apis/index'
import type { IGetCoursesResp } from '@/types/api'

export interface CourseTestResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

// 测试课程 API 连接
export async function testCoursesAPI(): Promise<CourseTestResult> {
  try {
    console.log('🔍 测试课程API连接...')
    
    const response: IGetCoursesResp = await getCourses()
    console.log('课程API响应:', response)
    
    if (response && response.data && Array.isArray(response.data)) {
      return {
        success: true,
        message: `✅ 课程API连接成功，获取到 ${response.data.length} 门课程`,
        data: response.data
      }
    } else {
      return {
        success: false,
        message: '❌ 课程API返回数据格式异常',
        data: response
      }
    }
  } catch (error: any) {
    console.error('课程API测试失败:', error)
    return {
      success: false,
      message: `❌ 课程API连接失败: ${error.message || '未知错误'}`,
      error: error
    }
  }
}

// 在浏览器控制台中运行测试
export function runCourseAPITest() {
  testCoursesAPI().then(result => {
    console.log('课程API测试结果:', result)
    if (result.success) {
      console.log('✅ 测试通过')
      if (result.data) {
        console.log('课程数据:', result.data)
      }
    } else {
      console.log('❌ 测试失败')
      if (result.error) {
        console.error('错误详情:', result.error)
      }
    }
  })
}

// 将测试函数暴露到全局，方便在控制台调用
if (typeof window !== 'undefined') {
  (window as any).testCourseAPI = runCourseAPITest
}