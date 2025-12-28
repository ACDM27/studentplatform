import http, { httpRoot, toAbsoluteUrl, getServerURL, getBaseURL } from './http'

// 通用类型定义
interface LoginData {
  identifier: string
  password: string
}

interface SubmitData {
  [key: string]: any
}

type ID = string | number

// 认证相关 API
export const login = async (loginData: LoginData) => {
  try {
    const response = await http.post('/auth/local', {
      identifier: loginData.identifier,
      password: loginData.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    throw error
  }
}

export const logout = () => http.post('/auth/logout')
export const refreshToken = () => http.post('/auth/refresh')

// 学生相关 API
export const fetchStudentMe = () => http.get('/users/me')
export const fetchStudentById = (id: ID) => http.get(`/students/${id}`)
export const fetchStatistics = () => http.get('/students/statistics')

// 课程相关 API
export const fetchCourses = () => http.get('/courses')
export const fetchCourseById = (id: ID) => http.get(`/courses/${id}`)

// 作业相关 API
export const fetchAssignments = () => http.get('/assignments')
export const fetchAssignmentById = (id: ID) => http.get(`/assignments/${id}`)
export const submitAssignment = (data: SubmitData) => http.post('/assignments/submit', data)

// 咨询相关 API
export const fetchConsultants = () => http.get('/consultants')
export const fetchConsultantById = (id: ID) => http.get(`/consultants/${id}`)
export const bookConsultation = (data: SubmitData) => http.post('/consultations/book', data)

// 咨询师相关 API
export const fetchConsultTeachers = () => http.get('/consult-teachsers?populate=avatar')
export const fetchConsultTeacherById = (id: ID) => http.get(`/consult-teachsers/${id}?populate=avatar`)
export const createConsultTeacher = (data: SubmitData) => http.post('/consult-teachsers', data)
export const updateConsultTeacher = (id: ID, data: SubmitData) => http.put(`/consult-teachsers/${id}`, data)
export const deleteConsultTeacher = (id: ID) => http.delete(`/consult-teachsers/${id}`)
export const fetchConsultTeachersByType = (type: string) => http.get(`/consult-teachsers?type=${type}&populate=avatar`)
export const fetchOnlineConsultTeachers = () => http.get('/consult-teachsers?is_online=true&populate=avatar')

// 荣誉相关 API
export const fetchAchievements = (includeDeleted: boolean = false) => {
  const params = includeDeleted ? { includeDeleted: true } : {}
  return http.get('/achievements', { params })
}
export const fetchAchievementById = (id: ID, includeDeleted: boolean = false) => {
  const url = `/achievements/${id}`
  const params = includeDeleted ? { includeDeleted: true } : {}
  return http.get(url, { params })
}
export const createAchievement = (data: SubmitData) => http.post('/achievements', data)
export const updateAchievement = (id: ID, data: SubmitData) => http.put(`/achievements/${id}`, data)
// 删除成果 - 使用PUT请求进行软删除
export const deleteAchievement = (id: ID) => {
  console.log(`准备软删除成果，ID: ${id}`);
  // 确保ID是有效的
  if (!id) {
    console.error('软删除成果失败: 无效的ID');
    return Promise.reject(new Error('无效的ID'));
  }
  
  // Strapi v5支持数字ID和documentId，直接使用传入的ID
  const url = `/achievements/${id}`;
  console.log(`软删除成果URL: ${url}`);
  console.log(`完整URL将是: http://localhost:1337/api${url}`);
  
  // 使用PUT请求进行软删除，按照Strapi v5标准格式
  // Strapi v5要求数据包装在data对象中
  return http.put(url, {
    data: {
      is_deleted: true,
      deleted_at: new Date().toISOString()
    }
  });
}
export const viewAchievementDetail = (id: ID) => http.get(`/achievements/${id}/`)


// 活动相关 API
export const fetchActivities = () => http.get('/activities')
export const fetchActivityById = (id: ID) => http.get(`/activities/${id}`)
export const createActivity = (data: SubmitData) => http.post('/activities', data)
export const updateActivity = (id: ID, data: SubmitData) => http.put(`/activities/${id}`, data)
export const deleteActivity = (id: ID) => http.delete(`/activities/${id}`)
export const viewActivityDetail = (id: ID) => http.get(`/activities/${id}/view`)
export const joinActivity = (id: ID) => http.post(`/activities/${id}/join`)

// 反馈相关 API
export const fetchFeedbacks = (params?: { page?: number, pageSize?: number }) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('pagination[page]', params.page.toString())
  if (params?.pageSize) queryParams.append('pagination[pageSize]', params.pageSize.toString())
  
  const queryString = queryParams.toString()
  return http.get(`/feedbacks?${queryString}`)
}

export const fetchFeedbackById = (id: ID) => http.get(`/feedbacks/${id}`)

export const submitFeedback = (data: SubmitData) => http.post('/feedbacks', { data })

export const updateFeedback = (id: ID, data: SubmitData) => http.put(`/feedbacks/${id}`, { data })

export const deleteFeedback = (id: ID) => http.delete(`/feedbacks/${id}`)

// 简历相关 API
export const fetchResumeData = () => http.get('/resume')
export const updateResume = (data: SubmitData) => http.put('/resume', data)

// 教师相关 API
export const fetchTeachers = () => http.get('/teachers?populate=avatar')
export const fetchTeacherById = (id: ID) => http.get(`/teachers/${id}?populate=avatar`)
export const createTeacher = (data: SubmitData) => http.post('/teachers', data)
export const updateTeacher = (id: ID, data: SubmitData) => http.put(`/teachers/${id}`, data)
export const deleteTeacher = (id: ID) => http.delete(`/teachers/${id}`)
export const fetchTeachersByDept = (dept: string) => http.get(`/teachers?department=${dept}`)
export const fetchRecruitingTeachers = () => http.get('/teachers?recruiting=true')

// 教师学院相关 API - 尝试多种可能的API路径
export const fetchTeacherDepartments = () => {
  // 尝试多种可能的API路径
  return http.get('/teacher-departments?populate=*').catch(() => 
    http.get('/departments?populate=*').catch(() => 
      http.get('/colleges?populate=*').catch(() => 
        http.get('/faculties?populate=*')
      )
    )
  )
}
export const fetchTeacherDepartmentById = (id: ID) => http.get(`/teacher-departments/${id}?populate=*`)
export const createTeacherDepartment = (data: SubmitData) => http.post('/teacher-departments', { data })
export const updateTeacherDepartment = (id: ID, data: SubmitData) => http.put(`/teacher-departments/${id}`, { data })
export const deleteTeacherDepartment = (id: ID) => http.delete(`/teacher-departments/${id}`)
export const fetchTeacherDepartmentByCode = (code: string) => {
  return http.get(`/teacher-departments?filters[code][$eq]=${code}&populate=*`).catch(() => 
    http.get(`/departments?filters[code][$eq]=${code}&populate=*`).catch(() => 
      http.get(`/colleges?filters[code][$eq]=${code}&populate=*`).catch(() => 
        http.get(`/faculties?filters[code][$eq]=${code}&populate=*`)
      )
    )
  )
}
export const fetchTeachersByDepartmentId = (departmentId: ID) => http.get(`/teachers?filters[teacher_department][id][$eq]=${departmentId}&populate=*`)

// 新闻相关 API
export const fetchNews = () => http.get('/news')
export const fetchNewsById = (id: ID) => http.get(`/news/${id}`)
export const fetchNewsByCategory = (category: string) => http.get(`/news?category=${category}`)
export const createNews = (data: SubmitData) => http.post('/news', data)
export const updateNews = (id: ID, data: SubmitData) => http.put(`/news/${id}`, data)
export const deleteNews = (id: ID) => http.delete(`/news/${id}`)

// 文件上传相关 API
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('files', file)
  return http.post('/upload', formData)
}

// OCR 新接口（根域，无 /api 前缀）
export const uploadOcrTemp = (file: File, options?: { certificateType?: string, userId?: string }) => {
  const fd = new FormData()
  fd.append('image', file)
  if (options?.certificateType) fd.append('certificateType', options.certificateType)
  if (options?.userId) fd.append('userId', options.userId)
  return httpRoot.post('/ocr/upload-temp', fd)
}

export const processOcr = (file: File, options?: { certificateType?: string, userId?: string }) => {
  const fd = new FormData()
  fd.append('image', file)
  if (options?.certificateType) fd.append('certificateType', options.certificateType)
  if (options?.userId) fd.append('userId', options.userId)
  return httpRoot.post('/ocr/process', fd)
}

export const batchOcr = (files: File[], options?: { certificateType?: string, userId?: string }) => {
  const fd = new FormData()
  files.forEach(f => fd.append('images', f))
  if (options?.certificateType) fd.append('certificateType', options.certificateType)
  if (options?.userId) fd.append('userId', options.userId)
  return httpRoot.post('/ocr/batch', fd)
}

export const fetchOcrAchievementTypes = () => httpRoot.get('/ocr/achievement-types')
export const fetchOcrHistory = () => httpRoot.get('/ocr/history')
export const fetchOcrStats = () => httpRoot.get('/ocr/stats')

// OCR相关 API
export const createCertificateRecord = (data: SubmitData) => http.post('/certificate-records', data)
export const fetchCertificateRecords = () => http.get('/certificate-records')
export const fetchCertificateRecordById = (id: ID) => http.get(`/certificate-records/${id}`)
export const updateCertificateRecord = (id: ID, data: SubmitData) => http.put(`/certificate-records/${id}`, data)
export const deleteCertificateRecord = (id: ID) => http.delete(`/certificate-records/${id}`)
// OCR证书识别处理接口
export const processImageOcr = (data: any) => {
  return http.post('/certificate-records', { data })
}

// OCR处理记录相关 API
export const createOcrProcessing = (data: SubmitData) => http.post('/ocr-processings', { data })
export const fetchOcrProcessings = (params?: { page?: number, pageSize?: number, userId?: string, status?: string }) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('pagination[page]', params.page.toString())
  if (params?.pageSize) queryParams.append('pagination[pageSize]', params.pageSize.toString())
  if (params?.userId) queryParams.append('filters[userId][$eq]', params.userId)
  if (params?.status) queryParams.append('filters[status][$eq]', params.status)
  
  const queryString = queryParams.toString()
  return http.get(`/ocr-processings?${queryString}`)
}
export const fetchOcrProcessingById = (id: ID) => http.get(`/ocr-processings/${id}`)
export const updateOcrProcessing = (id: ID, data: SubmitData) => http.put(`/ocr-processings/${id}`, { data })
export const deleteOcrProcessing = (id: ID) => http.delete(`/ocr-processings/${id}`)
export const fetchOcrProcessingsByType = (achievementType: string) => http.get(`/ocr-processings?filters[achievementType][$eq]=${achievementType}`)
export const fetchOcrProcessingsByStatus = (status: string) => http.get(`/ocr-processings?filters[status][$eq]=${status}`)
export const fetchUserOcrProcessings = (userId: string) => http.get(`/ocr-processings?filters[userId][$eq]=${userId}`)

// 学生画像相关 API
export const fetchStudentPortraits = (params?: { page?: number, pageSize?: number, studentId?: string }) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('pagination[page]', params.page.toString())
  if (params?.pageSize) queryParams.append('pagination[pageSize]', params.pageSize.toString())
  if (params?.studentId) queryParams.append('filters[student][id][$eq]', params.studentId)
  
  const queryString = queryParams.toString()
  return http.get(`/student-portraits?${queryString}&populate=*`)
}
export const fetchStudentPortraitById = (id: ID) => http.get(`/student-portraits/${id}?populate=*`)
export const createStudentPortrait = (data: SubmitData) => http.post('/student-portraits', { data })
export const updateStudentPortrait = (id: ID, data: SubmitData) => http.put(`/student-portraits/${id}`, { data })
export const deleteStudentPortrait = (id: ID) => http.delete(`/student-portraits/${id}`)
export const fetchStudentPortraitByStudentId = (studentId: ID) => http.get(`/student-portraits?filters[student][id][$eq]=${studentId}&populate=*`)
export const updateStudentPortraitSummary = (id: ID, summary: string) => http.put(`/student-portraits/${id}`, { data: { summary } })
export const updateStudentPortraitSkills = (id: ID, skills: any) => http.put(`/student-portraits/${id}`, { data: { skills } })
export const updateStudentPortraitInterests = (id: ID, interests: any) => http.put(`/student-portraits/${id}`, { data: { interests } })
export const addQaHistory = (id: ID, qaData: any) => {
  return fetchStudentPortraitById(id).then(response => {
    const currentQaHistory = response.data?.qa_history || []
    const updatedQaHistory = [...currentQaHistory, qaData]
    return http.put(`/student-portraits/${id}`, { data: { qa_history: updatedQaHistory } })
  })
}
export const addRiskAlert = (id: ID, riskData: any) => {
  return fetchStudentPortraitById(id).then(response => {
    const currentRiskAlerts = response.data?.risk_alerts || []
    const updatedRiskAlerts = [...currentRiskAlerts, riskData]
    return http.put(`/student-portraits/${id}`, { data: { risk_alerts: updatedRiskAlerts } })
  })
}

// 学生画像聊天接口 - 直接调用后端API
export const chatWithStudentPortrait = async (question: string, student_id: string, context?: string) => {
  console.log('chatWithStudentPortrait 调用参数:', { question, student_id, context })
  
  // 构建请求数据 - 后端期望的格式
  const requestData = {
    question,
    student_id,
    context: context || undefined  // 如果没有context，发送undefined而不是空字符串
  }
  
  console.log('发送到 /student-portraits/chat 的数据:', requestData)
  console.log('完整URL将是:', `${getBaseURL()}/student-portraits/chat`)
  
  try {
    // 注意：http.post 的响应拦截器已经返回了 response.data
    // 所以这里的 response 实际上就是后端返回的数据对象
    const response = await http.post('/student-portraits/chat', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('chatWithStudentPortrait 原始响应:', response)
    console.log('响应类型:', typeof response)
    console.log('响应结构:', JSON.stringify(response, null, 2))
    
    // 由于响应拦截器已经返回了 response.data，这里直接返回
    return response
  } catch (error: any) {
    console.error('chatWithStudentPortrait 请求失败:', error)
    console.error('错误状态码:', error.response?.status)
    console.error('错误响应数据:', error.response?.data)
    console.error('错误消息:', error.message)
    
    // 如果是404错误，可能是路由不存在
    if (error.response?.status === 404) {
      console.error('404错误: 后端路由 /student-portraits/chat 可能不存在')
      console.error('请检查后端是否正确配置了该路由')
    }
    
    throw error
  }
}

// AI对话相关 API - 支持获取学生信息和数据库分析
export const chatWithAI = async (data: { question: string, student_id?: string, context?: string }) => {
  try {
    // 获取当前登录学生信息
    let currentStudentId = data.student_id
    if (!currentStudentId) {
      try {
        const studentResponse = await fetchStudentMe()
        currentStudentId = studentResponse.data?.id || studentResponse.data?.student_id
      } catch (error) {
        console.warn('无法获取当前学生信息:', error)
        throw new Error('无法获取当前学生信息，请确保已登录')
      }
    }
    
    if (!currentStudentId) {
      throw new Error('无法确定学生身份，请重新登录')
    }
    
    // 使用正确的后端API接口
    console.log('正在调用AI聊天API:', currentStudentId)
    return await chatWithStudentPortrait(
      data.question,
      currentStudentId.toString(),
      data.context
    )
  } catch (error: any) {
    // 如果AI端点不可用，返回统一错误提示
    console.warn('AI端点不可用:', error.message)
    
    // 统一错误响应格式
    const errorResponse = {
      data: {
        response: '抱歉，AI助手服务暂时不可用，请稍后再试。如有紧急问题，请联系管理员。',
        timestamp: new Date().toISOString(),
        student_id: data.student_id,
        error: true
      }
    }
    
    return errorResponse
  }
}

// 获取当前学生信息的AI查询接口
export const queryStudentInfo = async (data: { question: string, student_id?: string }) => {
  try {
    // 如果没有提供student_id，尝试从当前登录学生获取
    let targetStudentId = data.student_id
    if (!targetStudentId) {
      try {
        const studentResponse = await fetchStudentMe()
        targetStudentId = studentResponse.data?.student_id || studentResponse.data?.id
      } catch (error) {
        console.warn('无法获取当前学生信息:', error)
        return {
          data: {
            response: '无法获取当前学生信息，请确保已登录。',
            error: true
          }
        }
      }
    }
    
    if (!targetStudentId) {
      return {
        data: {
          response: '无法确定学生身份，请重新登录。',
          error: true
        }
      }
    }
    
    // 调用修正后的AI聊天接口
    return await chatWithAI({
      question: data.question,
      student_id: targetStudentId,
      context: '用户查询个人学习信息'
    })
  } catch (error: any) {
    console.error('查询学生信息失败:', error)
    return {
      data: {
        response: '查询学生信息时发生错误，请稍后重试。',
        error: true,
        timestamp: new Date().toISOString()
      }
    }
  }
}

const generateMockAIResponse = (message: string, context?: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('成果') || lowerMessage.includes('分析') || lowerMessage.includes('数据')) {
    return `根据您的学习画像分析：\n\n📊 **学习成果概览**\n- 您在技术类课程表现优秀，平均分85+\n- 已获得3项专业技能认证\n- 参与了2个实践项目\n\n🎯 **优势领域**\n- 编程能力：★★★★☆\n- 逻辑思维：★★★★★\n- 团队协作：★★★☆☆\n\n💡 **改进建议**\n- 建议加强团队协作能力的培养\n- 可以参与更多的小组项目\n- 考虑申请技术类实习机会`
  }
  
  if (lowerMessage.includes('兴趣') || lowerMessage.includes('推荐') || lowerMessage.includes('课程')) {
    return `基于您的兴趣画像，为您推荐：\n\n🎓 **课程推荐**\n- 人工智能基础\n- 数据结构与算法\n- Web开发实战\n\n📚 **学习资源**\n- 在线编程平台练习\n- 开源项目参与\n- 技术博客阅读\n\n🏆 **竞赛活动**\n- 程序设计竞赛\n- 创新创业大赛\n- 技术分享会\n\n这些内容与您的兴趣高度匹配，建议优先关注！`
  }
  
  if (lowerMessage.includes('职业') || lowerMessage.includes('规划') || lowerMessage.includes('就业')) {
    return `为您制定的职业发展路径：\n\n🎯 **短期目标（1年内）**\n- 完成核心专业课程学习\n- 获得至少2项技术认证\n- 参与1-2个实际项目\n\n🚀 **中期目标（2-3年）**\n- 掌握主流开发技术栈\n- 积累实习/工作经验\n- 建立个人技术品牌\n\n🌟 **长期目标（3-5年）**\n- 成为技术专家或团队负责人\n- 具备独立项目管理能力\n- 考虑创业或深造机会\n\n建议重点关注技术能力提升和实践经验积累！`
  }
  
  if (lowerMessage.includes('预警') || lowerMessage.includes('风险') || lowerMessage.includes('学情')) {
    return `学情预警分析报告：\n\n⚠️ **注意事项**\n- 近期数学类课程成绩有所下降\n- 作业提交及时率需要提高\n- 课堂参与度可以更积极\n\n📈 **改进建议**\n- 建议增加数学基础练习时间\n- 制定更合理的学习计划\n- 主动参与课堂讨论和答疑\n\n🎯 **目标设定**\n- 下月数学成绩提升至80+\n- 作业按时提交率达到95%\n- 每周至少参与2次课堂互动\n\n请及时调整学习策略，我会持续关注您的进展！`
  }
  
  // 默认通用响应
  const responses = [
    `感谢您的提问！基于您的学习画像，我建议您可以从以下几个方面来思考这个问题...`,
    `这是一个很好的问题！根据您的学习特点，我为您提供以下建议...`,
    `让我为您分析一下。结合您的个人情况，我认为...`,
    `基于您的学习数据和兴趣偏好，我的建议是...`
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  return `${randomResponse}\n\n针对您的问题"${message}"，我会结合您的个人学习数据为您提供更精准的建议。如果您需要更详细的分析，请告诉我具体的关注点。`
}

// 默认导出所有API函数
export default {
  // 认证相关
  login,
  logout,
  refreshToken,
  // 学生相关
  fetchStudentMe,
  fetchStudentById,
  fetchStatistics,
  // 课程相关
  fetchCourses,
  fetchCourseById,
  // 作业相关
  fetchAssignments,
  fetchAssignmentById,
  submitAssignment,
  // 咨询相关
  fetchConsultants,
  fetchConsultantById,
  bookConsultation,
  // 咨询师相关
  fetchConsultTeachers,
  fetchConsultTeacherById,
  createConsultTeacher,
  updateConsultTeacher,
  deleteConsultTeacher,
  fetchConsultTeachersByType,
  fetchOnlineConsultTeachers,
  // 荣誉相关
  fetchAchievements,
  fetchAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  viewAchievementDetail,
  // 反馈相关
  submitFeedback,
  // 简历相关
  fetchResumeData,
  updateResume,
  // 教师相关
  fetchTeachers,
  fetchTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchTeachersByDept,
  fetchRecruitingTeachers,
  // 教师学院相关
  fetchTeacherDepartments,
  fetchTeacherDepartmentById,
  createTeacherDepartment,
  updateTeacherDepartment,
  deleteTeacherDepartment,
  fetchTeacherDepartmentByCode,
  fetchTeachersByDepartmentId,
  // 新闻相关
  fetchNews,
  fetchNewsById,
  fetchNewsByCategory,
  createNews,
  updateNews,
  deleteNews,
  // 活动相关
  fetchActivities,
  fetchActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  viewActivityDetail,
  joinActivity,
  // 文件上传相关
  uploadFile,
  uploadOcrTemp,
  processOcr,
  batchOcr,
  fetchOcrAchievementTypes,
  fetchOcrHistory,
  fetchOcrStats,
  // OCR相关
  createCertificateRecord,
  fetchCertificateRecords,
  fetchCertificateRecordById,
  updateCertificateRecord,
  deleteCertificateRecord,
  processImageOcr,
  // OCR处理记录相关
  createOcrProcessing,
  fetchOcrProcessings,
  fetchOcrProcessingById,
  updateOcrProcessing,
  deleteOcrProcessing,
  fetchOcrProcessingsByType,
  fetchOcrProcessingsByStatus,
  fetchUserOcrProcessings,
  // 学生画像相关
  fetchStudentPortraits,
  fetchStudentPortraitById,
  createStudentPortrait,
  updateStudentPortrait,
  deleteStudentPortrait,
  fetchStudentPortraitByStudentId,
  updateStudentPortraitSummary,
  updateStudentPortraitSkills,
  updateStudentPortraitInterests,
  addQaHistory,
  addRiskAlert,
  chatWithStudentPortrait,
  chatWithAI,
  queryStudentInfo,
}
