import http from './http'

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
export const fetchMe = () => http.get('/students/me')
export const fetchStudentById = (id: ID) => http.get(`/students/${id}`)
export const fetchStudentProfile = () => http.get('/students/profile')
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
export const fetchAchievements = () => http.get('/achievements')
export const fetchAchievementById = (id: ID) => http.get(`/achievements/${id}`)
export const createAchievement = (data: SubmitData) => http.post('/achievements', data)
export const updateAchievement = (id: ID, data: SubmitData) => http.put(`/achievements/${id}`, data)
export const deleteAchievement = (id: ID) => http.delete(`/achievements/${id}`)
export const viewAchievementDetail = (id: ID) => http.get(`/achievements/${id}/view`)


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

// 新闻相关 API
export const fetchNews = () => http.get('/news')
export const fetchNewsById = (id: ID) => http.get(`/news/${id}`)
export const fetchNewsByCategory = (category: string) => http.get(`/news?category=${category}`)
export const createNews = (data: SubmitData) => http.post('/news', data)
export const updateNews = (id: ID, data: SubmitData) => http.put(`/news/${id}`, data)
export const deleteNews = (id: ID) => http.delete(`/news/${id}`)

// 默认导出所有API函数
export default {
  // 认证相关
  login,
  logout,
  refreshToken,
  // 学生相关
  fetchMe,
  fetchStudentById,
  fetchStudentProfile,
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
}
