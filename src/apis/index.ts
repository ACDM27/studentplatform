/**
 * API调用封装函数
 * 每个函数返回Promise<T>
 * 函数名与接口名保持一致（camelCase）
 */

import http from '../server/api/http'
import type {
  ID,
  // 认证相关
  IPostAuthLocalReq,
  IPostAuthLocalResp,
  IPostAuthLogoutResp,
  IPostAuthRefreshResp,
  // 学生相关
  IGetStudentsMeResp,
  IGetStudentsByIdParams,
  IGetStudentsByIdResp,
  IGetStudentsProfileResp,
  IGetStudentsStatisticsResp,
  // 课程相关
  IGetCoursesResp,
  IGetCoursesByIdParams,
  IGetCoursesByIdResp,
  IPostCourseReq,
  IPostCourseResp,
  IPutCourseReq,
  IPutCourseResp,
  IDeleteCourseParams,
  IDeleteCourseResp,
  // 作业相关
  IGetAssignmentsResp,
  IGetAssignmentsByIdParams,
  IGetAssignmentsByIdResp,
  IPostAssignmentsSubmitReq,
  IPostAssignmentsSubmitResp,
  // 咨询相关
  IGetConsultantsResp,
  IGetConsultantsByIdParams,
  IGetConsultantsByIdResp,
  IPostConsultationsBookReq,
  IPostConsultationsBookResp,
  IGetConsultTeachersResp,
  IGetConsultTeacherByIdParams,
  IGetConsultTeacherByIdResp,
  IPostConsultTeacherReq,
  IPostConsultTeacherResp,
  IPutConsultTeacherReq,
  IPutConsultTeacherResp,
  IDeleteConsultTeacherParams,
  // 反馈相关
  IGetFeedbacksResp,
  IGetFeedbackByIdParams,
  IGetFeedbackByIdResp,
  IPostFeedbackReq,
  IPostFeedbackResp,
  IPutFeedbackReq,
  IPutFeedbackResp,
  IDeleteFeedbackParams,
  IDeleteFeedbackResp,
  IDeleteConsultTeacherResp,
  // 荣誉相关
  IGetAchievementsResp,
  IGetAchievementByIdParams,
  IGetAchievementByIdResp,

  // 简历相关
  IGetResumeResp,
  IPutResumeReq,
  IPutResumeResp,
  // 教师相关
  IGetTeachersResp,
  IGetTeachersByIdParams,
  IGetTeachersByIdResp,
  // 新闻相关
  IGetNewsResp,
  IGetNewsByIdParams,
  IGetNewsByIdResp,
  IPostNewsReq,
  IPostNewsResp,
  IPutNewsReq,
  IPutNewsResp,
  IDeleteNewsResp,
  // 人才市场相关
  IGetCompaniesResp,
  IGetCompanyByIdParams,
  IGetCompanyByIdResp,
  IGetPositionsResp,
  IGetPositionByIdParams,
  IGetPositionByIdResp,
  IPostContactCompanyReq,
  IPostContactCompanyResp,
  IPostApplyPositionReq,
  IPostApplyPositionResp,
  IGetMarketStatsResp,
  // 活动相关
  IGetActivitiesResp,
  IGetActivityByIdParams,
  IGetActivityByIdResp,
  IPostActivityReq,
  IPostActivityResp,
  IPutActivityReq,
  IPutActivityResp,
  IDeleteActivityParams,
  IDeleteActivityResp
} from '../types/api.d.ts'

// 认证相关 API
export const postAuthLocal = async (data: IPostAuthLocalReq): Promise<IPostAuthLocalResp> => {
  const response = await http.post('/auth/local', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

export const postAuthLogout = async (): Promise<IPostAuthLogoutResp> => {
  const response = await http.post('/auth/logout')
  return response.data
}

export const postAuthRefresh = async (): Promise<IPostAuthRefreshResp> => {
  const response = await http.post('/auth/refresh')
  return response.data
}

// 学生相关 API
export const getStudentsMe = async (): Promise<IGetStudentsMeResp> => {
  const response = await http.get('/students/me')
  return response.data
}

export const getStudentsById = async ({ id }: IGetStudentsByIdParams): Promise<IGetStudentsByIdResp> => {
  const response = await http.get(`/students/${id}`)
  return response.data
}

export const getStudentsProfile = async (): Promise<IGetStudentsProfileResp> => {
  const response = await http.get('/students/profile')
  return response.data
}

export const getStudentsStatistics = async (): Promise<IGetStudentsStatisticsResp> => {
  const response = await http.get('/students/statistics')
  return response.data
}

// 课程相关 API
export const getCourses = async (): Promise<IGetCoursesResp> => {
  const response = await http.get('/courses')
  return response.data
}

export const getCoursesById = async ({ id }: IGetCoursesByIdParams): Promise<IGetCoursesByIdResp> => {
  const response = await http.get(`/courses/${id}`)
  return response.data
}

export const postCourse = async (data: IPostCourseReq): Promise<IPostCourseResp> => {
  const response = await http.post('/courses', data)
  return response.data
}

export const putCourse = async (id: ID, data: IPutCourseReq): Promise<IPutCourseResp> => {
  const response = await http.put(`/courses/${id}`, data)
  return response.data
}

export const deleteCourse = async ({ id }: IDeleteCourseParams): Promise<IDeleteCourseResp> => {
  const response = await http.delete(`/courses/${id}`)
  return response.data
}

// 作业相关 API
export const getAssignments = async (): Promise<IGetAssignmentsResp> => {
  const response = await http.get('/assignments')
  return response.data
}

export const getAssignmentsById = async ({ id }: IGetAssignmentsByIdParams): Promise<IGetAssignmentsByIdResp> => {
  const response = await http.get(`/assignments/${id}`)
  return response.data
}

export const postAssignmentsSubmit = async (data: IPostAssignmentsSubmitReq): Promise<IPostAssignmentsSubmitResp> => {
  const response = await http.post('/assignments/submit', data)
  return response.data
}

// 咨询相关 API
export const getConsultants = async (): Promise<IGetConsultantsResp> => {
  const response = await http.get('/consultants')
  return response.data
}

export const getConsultantsById = async ({ id }: IGetConsultantsByIdParams): Promise<IGetConsultantsByIdResp> => {
  const response = await http.get(`/consultants/${id}`)
  return response.data
}

export const postConsultationsBook = async (data: IPostConsultationsBookReq): Promise<IPostConsultationsBookResp> => {
  const response = await http.post('/consultations/book', data)
  return response.data
}

// 荣誉相关 API
export const getAchievements = async (): Promise<IGetAchievementsResp> => {
  const response = await http.get('/achievements')
  return response.data
}

export const getAchievementById = async ({ id }: IGetAchievementByIdParams): Promise<IGetAchievementByIdResp> => {
  console.log('getAchievementById 调用，参数:', { id })
  console.log('请求URL:', `/achievements/${id}`)
  
  try {
    const response = await http.get(`/achievements/${id}`)
    console.log('getAchievementById 原始响应:', response)
    console.log('getAchievementById 响应数据:', response.data)
    console.log('getAchievementById 响应状态:', response.status)
    
    return response.data
  } catch (error: any) {
    console.error('getAchievementById 请求失败:', error)
    if (error.response) {
      console.error('错误响应状态:', error.response.status)
      console.error('错误响应数据:', error.response.data)
    }
    throw error
  }
}

// 反馈相关 API
export const getFeedbacks = async (params?: { page?: number, pageSize?: number }): Promise<IGetFeedbacksResp> => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('pagination[page]', params.page.toString())
  if (params?.pageSize) queryParams.append('pagination[pageSize]', params.pageSize.toString())
  
  const queryString = queryParams.toString()
  const response = await http.get(`/feedbacks?${queryString}`)
  return response.data
}

export const getFeedbackById = async ({ id }: IGetFeedbackByIdParams): Promise<IGetFeedbackByIdResp> => {
  const response = await http.get(`/feedbacks/${id}`)
  return response.data
}

export const postFeedback = async (data: IPostFeedbackReq): Promise<IPostFeedbackResp> => {
  const response = await http.post('/feedbacks', data)
  return response.data
}

export const putFeedback = async (id: ID, data: IPutFeedbackReq): Promise<IPutFeedbackResp> => {
  const response = await http.put(`/feedbacks/${id}`, { data })
  return response.data
}

export const deleteFeedback = async ({ id }: IDeleteFeedbackParams): Promise<IDeleteFeedbackResp> => {
  const response = await http.delete(`/feedbacks/${id}`)
  return response.data
}

// 简历相关 API
export const getResume = async (): Promise<IGetResumeResp> => {
  const response = await http.get('/resume')
  return response.data
}

export const putResume = async (data: IPutResumeReq): Promise<IPutResumeResp> => {
  const response = await http.put('/resume', data)
  return response.data
}

// 教师相关 API
export const getTeachers = async (): Promise<IGetTeachersResp> => {
  const response = await http.get('/teachers')
  return response.data
}

export const getTeachersById = async ({ id }: IGetTeachersByIdParams): Promise<IGetTeachersByIdResp> => {
  const response = await http.get(`/teachers/${id}`)
  return response.data
}

// 新闻相关 API
export const getNews = async (): Promise<IGetNewsResp> => {
  const response = await http.get('/news')
  return response.data
}

export const getNewsById = async ({ id }: IGetNewsByIdParams): Promise<IGetNewsByIdResp> => {
  const response = await http.get(`/news/${id}`)
  return response.data
}

export const getNewsByCategory = async (category: string): Promise<IGetNewsResp> => {
  const response = await http.get(`/news?category=${category}`)
  return response.data
}

export const postNews = async (data: IPostNewsReq): Promise<IPostNewsResp> => {
  const response = await http.post('/news', data)
  return response.data
}

export const putNews = async (id: ID, data: IPutNewsReq): Promise<IPutNewsResp> => {
  const response = await http.put(`/news/${id}`, data)
  return response.data
}

export const deleteNews = async (id: ID): Promise<IDeleteNewsResp> => {
  const response = await http.delete(`/news/${id}`)
  return response.data
}

// 人才市场相关 API
export const getCompanies = async (): Promise<IGetCompaniesResp> => {
  const response = await http.get('/companies')
  return response.data
}

export const getCompanyById = async ({ id }: IGetCompanyByIdParams): Promise<IGetCompanyByIdResp> => {
  const response = await http.get(`/companies/${id}`)
  return response.data
}

export const getPositions = async (): Promise<IGetPositionsResp> => {
  const response = await http.get('/positions')
  return response.data
}

export const getPositionById = async ({ id }: IGetPositionByIdParams): Promise<IGetPositionByIdResp> => {
  const response = await http.get(`/positions/${id}`)
  return response.data
}

export const postContactCompany = async (data: IPostContactCompanyReq): Promise<IPostContactCompanyResp> => {
  const response = await http.post('/companies/contact', data)
  return response.data
}

export const postApplyPosition = async (data: IPostApplyPositionReq): Promise<IPostApplyPositionResp> => {
  const response = await http.post('/positions/apply', data)
  return response.data
}

export const getMarketStats = async (): Promise<IGetMarketStatsResp> => {
  const response = await http.get('/market/stats')
  return response.data
}

// 活动相关 API
export const getActivities = async (): Promise<IGetActivitiesResp> => {
  const response = await http.get('/activities')
  return response.data
}

export const getActivityById = async ({ id }: IGetActivityByIdParams): Promise<IGetActivityByIdResp> => {
  const response = await http.get(`/activities/${id}`)
  return response.data
}

export const postActivity = async (data: IPostActivityReq): Promise<IPostActivityResp> => {
  const response = await http.post('/activities', data)
  return response.data
}

export const putActivity = async (id: ID, data: IPutActivityReq): Promise<IPutActivityResp> => {
  const response = await http.put(`/activities/${id}`, data)
  return response.data
}

export const deleteActivity = async ({ id }: IDeleteActivityParams): Promise<IDeleteActivityResp> => {
  const response = await http.delete(`/activities/${id}`)
  return response.data
}

// 咨询师相关 API
import {
  fetchConsultTeachers,
  fetchConsultTeacherById,
  fetchConsultTeachersByType,
  fetchOnlineConsultTeachers
} from '../server/api/api'

export const getConsultTeachers = async (): Promise<IGetConsultTeachersResp> => {
  const response = await fetchConsultTeachers()
  return response.data
}

export const getConsultTeacherById = async ({ id }: IGetConsultTeacherByIdParams): Promise<IGetConsultTeacherByIdResp> => {
  const response = await fetchConsultTeacherById(id)
  return response.data
}

export const getConsultTeachersByType = async (type: string): Promise<IGetConsultTeachersResp> => {
  const response = await fetchConsultTeachersByType(type)
  return response.data
}

export const getOnlineConsultTeachers = async (): Promise<IGetConsultTeachersResp> => {
  const response = await fetchOnlineConsultTeachers()
  return response.data
}

export const postConsultTeacher = async (data: IPostConsultTeacherReq): Promise<IPostConsultTeacherResp> => {
  const response = await http.post('/consult-teachsers', data)
  return response.data
}

export const putConsultTeacher = async (id: ID, data: IPutConsultTeacherReq): Promise<IPutConsultTeacherResp> => {
  const response = await http.put(`/consult-teachsers/${id}`, data)
  return response.data
}

export const deleteConsultTeacher = async ({ id }: IDeleteConsultTeacherParams): Promise<IDeleteConsultTeacherResp> => {
  const response = await http.delete(`/consult-teachsers/${id}`)
  return response.data
}

// 默认导出所有API函数
export default {
  // 认证相关
  postAuthLocal,
  postAuthLogout,
  postAuthRefresh,
  // 学生相关
  getStudentsMe,
  getStudentsById,
  getStudentsProfile,
  getStudentsStatistics,
  // 课程相关
  getCourses,
  getCoursesById,
  postCourse,
  putCourse,
  deleteCourse,
  // 作业相关
  getAssignments,
  getAssignmentsById,
  postAssignmentsSubmit,
  // 咨询相关
  getConsultants,
  getConsultantsById,
  postConsultationsBook,
  getConsultTeachers,
  getConsultTeacherById,
  getConsultTeachersByType,
  getOnlineConsultTeachers,
  postConsultTeacher,
  putConsultTeacher,
  deleteConsultTeacher,
  // 荣誉相关
  getAchievements,
  getAchievementById,
  // 反馈相关
  postFeedback,
  // 简历相关
  getResume,
  putResume,
  // 教师相关
  getTeachers,
  getTeachersById,
  // 新闻相关
  getNews,
  getNewsById,
  getNewsByCategory,
  postNews,
  putNews,
  deleteNews,
  // 人才市场相关
  getCompanies,
  getCompanyById,
  getPositions,
  getPositionById,
  postContactCompany,
  postApplyPosition,
  getMarketStats,
  // 活动相关
  getActivities,
  getActivityById,
  postActivity,
  putActivity,
  deleteActivity
}