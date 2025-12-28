import http from '@/server/api/http'

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
}

//使用真实存在的接口测试基础连接
export async function testBaseConnection(): Promise<ConnectionTestResult> {
  try {
    console.log('正在测试基础 API 连接...')

    const config = {
      baseURL: http.defaults.baseURL,
      timeout: http.defaults.timeout,
      headers: http.defaults.headers
    }

    console.log('当前 Axios 配置:', config)

    //改为 Strapi 默认存在的上传接口
    const response = await http.get('/upload/files')

    return {
      success: true,
      message: `连接成功`,
      details: {
        data: response,
        config
      }
    }
  } catch (error: any) {
    console.error('基础连接失败:', error)

    return {
      success: false,
      message: `基础连接失败: ${error.message}`,
      details: {
        error: error.response?.data || error.message,
        status: error.response?.status || 'N/A'
      }
    }
  }
}

// 测试实际存在的内容类型接口
export async function testAchievementsAPI(): Promise<ConnectionTestResult> {
  try {
    console.log('测试 /achievements 接口...')

    const response = await http.get('/achievements')

    return {
      success: true,
      message: `成果接口连接成功`,
      details: {
        dataType: typeof response,
        hasData: response && response.data ? true : false,
        dataIsArray: response && Array.isArray(response.data),
        dataLength: response && Array.isArray(response.data) ? response.data.length : 'N/A',
        sampleData: response
      }
    }
  } catch (error: any) {
    console.error('❌ 成果接口连接失败:', error)

    return {
      success: false,
      message: `成果接口连接失败: ${error.message}`,
      details: {
        error: error.response?.data || error.message,
        status: error.response?.status || 'N/A'
      }
    }
  }
}

// ✅ 综合测试所有接口连接情况
export async function runFullAPITest(): Promise<{
  baseConnection: ConnectionTestResult
  achievementsAPI: ConnectionTestResult
}> {
  console.log('🚀 开始 API 综合连接测试...')

  const baseConnection = await testBaseConnection()
  const achievementsAPI = await testAchievementsAPI()

  console.log('📦 测试结果：')
  console.log('基础连接:', baseConnection.message)
  console.log('成果接口:', achievementsAPI.message)

  return {
    baseConnection,
    achievementsAPI
  }
}
