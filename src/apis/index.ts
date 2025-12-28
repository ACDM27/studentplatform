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
  // 拦截器已返回 data
  return await http.post('/auth/local', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const postAuthLogout = async (): Promise<IPostAuthLogoutResp> => {
  return await http.post('/auth/logout')
}

export const postAuthRefresh = async (): Promise<IPostAuthRefreshResp> => {
  return await http.post('/auth/refresh')
}

// 学生相关 API
export const getStudentsMe = async (): Promise<IGetStudentsMeResp> => {
  return await http.get('/users/me')
}

export const getStudentsById = async ({ id }: IGetStudentsByIdParams): Promise<IGetStudentsByIdResp> => {
  return await http.get(`/students/${id}`)
}

export const getStudentsProfile = async (): Promise<IGetStudentsProfileResp> => {
  return await http.get('/students/profile')
}

export const getStudentsStatistics = async (): Promise<IGetStudentsStatisticsResp> => {
  return await http.get('/students/statistics')
}

// 课程相关 API
export const getCourses = async (): Promise<IGetCoursesResp> => {
  return await http.get('/courses')
}

export const getCoursesById = async ({ id }: IGetCoursesByIdParams): Promise<IGetCoursesByIdResp> => {
  return await http.get(`/courses/${id}`)
}

export const postCourse = async (data: IPostCourseReq): Promise<IPostCourseResp> => {
  return await http.post('/courses', data)
}

export const putCourse = async (id: ID, data: IPutCourseReq): Promise<IPutCourseResp> => {
  return await http.put(`/courses/${id}`, data)
}

export const deleteCourse = async ({ id }: IDeleteCourseParams): Promise<IDeleteCourseResp> => {
  return await http.delete(`/courses/${id}`)
}

// 作业相关 API
export const getAssignments = async (): Promise<IGetAssignmentsResp> => {
  return await http.get('/assignments')
}

export const getAssignmentsById = async ({ id }: IGetAssignmentsByIdParams): Promise<IGetAssignmentsByIdResp> => {
  return await http.get(`/assignments/${id}`)
}

export const postAssignmentsSubmit = async (data: IPostAssignmentsSubmitReq): Promise<IPostAssignmentsSubmitResp> => {
  return await http.post('/assignments/submit', data)
}

// 咨询相关 API
export const getConsultants = async (): Promise<IGetConsultantsResp> => {
  return await http.get('/consultants')
}

export const getConsultantsById = async ({ id }: IGetConsultantsByIdParams): Promise<IGetConsultantsByIdResp> => {
  return await http.get(`/consultants/${id}`)
}

export const postConsultationsBook = async (data: IPostConsultationsBookReq): Promise<IPostConsultationsBookResp> => {
  return await http.post('/consultations/book', data)
}

// 荣誉相关 API
export const getAchievements = async (): Promise<IGetAchievementsResp> => {
  return await http.get('/achievements')
}

export const getAchievementById = async ({ id, includeDeleted = false }: IGetAchievementByIdParams & { includeDeleted?: boolean }): Promise<IGetAchievementByIdResp> => {
  console.log('getAchievementById 调用，参数:', { id, includeDeleted })
  console.log('请求URL:', `/achievements/${id}`)
  
  try {
    const params = includeDeleted ? { includeDeleted: true } : {}
    // 拦截器已经返回 data，这里直接使用
    const data = await http.get(`/achievements/${id}`, { params })
    console.log('getAchievementById 响应数据:', data)
    
    return data
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
  return await http.get(`/feedbacks?${queryString}`)
}

export const getFeedbackById = async ({ id }: IGetFeedbackByIdParams): Promise<IGetFeedbackByIdResp> => {
  return await http.get(`/feedbacks/${id}`)
}

export const postFeedback = async (data: IPostFeedbackReq): Promise<IPostFeedbackResp> => {
  return await http.post('/feedbacks', data)
}

export const putFeedback = async (id: ID, data: IPutFeedbackReq): Promise<IPutFeedbackResp> => {
  return await http.put(`/feedbacks/${id}`, { data })
}

export const deleteFeedback = async ({ id }: IDeleteFeedbackParams): Promise<IDeleteFeedbackResp> => {
  return await http.delete(`/feedbacks/${id}`)
}

// 简历相关 API
export const getResume = async (): Promise<IGetResumeResp> => {
  return await http.get('/resume')
}

export const putResume = async (data: IPutResumeReq): Promise<IPutResumeResp> => {
  return await http.put('/resume', data)
}

// 教师相关 API
export const getTeachers = async (): Promise<IGetTeachersResp> => {
  return await http.get('/teachers')
}

export const getTeachersById = async ({ id }: IGetTeachersByIdParams): Promise<IGetTeachersByIdResp> => {
  return await http.get(`/teachers/${id}`)
}

// 新闻相关 API
export const getNews = async (): Promise<IGetNewsResp> => {
  return await http.get('/news')
}

export const getNewsById = async ({ id }: IGetNewsByIdParams): Promise<IGetNewsByIdResp> => {
  return await http.get(`/news/${id}`)
}

export const getNewsByCategory = async (category: string): Promise<IGetNewsResp> => {
  return await http.get(`/news?category=${category}`)
}

export const postNews = async (data: IPostNewsReq): Promise<IPostNewsResp> => {
  return await http.post('/news', data)
}

export const putNews = async (id: ID, data: IPutNewsReq): Promise<IPutNewsResp> => {
  return await http.put(`/news/${id}`, data)
}

export const deleteNews = async (id: ID): Promise<IDeleteNewsResp> => {
  return await http.delete(`/news/${id}`)
}

// 人才市场相关 API
export const getCompanies = async (): Promise<IGetCompaniesResp> => {
  return await http.get('/companies')
}

export const getCompanyById = async ({ id }: IGetCompanyByIdParams): Promise<IGetCompanyByIdResp> => {
  return await http.get(`/companies/${id}`)
}

export const getPositions = async (): Promise<IGetPositionsResp> => {
  return await http.get('/positions')
}

export const getPositionById = async ({ id }: IGetPositionByIdParams): Promise<IGetPositionByIdResp> => {
  return await http.get(`/positions/${id}`)
}

export const postContactCompany = async (data: IPostContactCompanyReq): Promise<IPostContactCompanyResp> => {
  return await http.post('/companies/contact', data)
}

export const postApplyPosition = async (data: IPostApplyPositionReq): Promise<IPostApplyPositionResp> => {
  return await http.post('/positions/apply', data)
}

export const getMarketStats = async (): Promise<IGetMarketStatsResp> => {
  return await http.get('/market/stats')
}

// 活动相关 API
export const getActivities = async (): Promise<IGetActivitiesResp> => {
  return await http.get('/activities')
}

export const getActivityById = async ({ id }: IGetActivityByIdParams): Promise<IGetActivityByIdResp> => {
  return await http.get(`/activities/${id}`)
}

export const postActivity = async (data: IPostActivityReq): Promise<IPostActivityResp> => {
  return await http.post('/activities', data)
}

export const putActivity = async (id: ID, data: IPutActivityReq): Promise<IPutActivityResp> => {
  return await http.put(`/activities/${id}`, data)
}

export const deleteActivity = async ({ id }: IDeleteActivityParams): Promise<IDeleteActivityResp> => {
  return await http.delete(`/activities/${id}`)
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
  return await http.post('/consult-teachsers', data)
}

export const putConsultTeacher = async (id: ID, data: IPutConsultTeacherReq): Promise<IPutConsultTeacherResp> => {
  return await http.put(`/consult-teachsers/${id}`, data)
}

export const deleteConsultTeacher = async ({ id }: IDeleteConsultTeacherParams): Promise<IDeleteConsultTeacherResp> => {
  return await http.delete(`/consult-teachsers/${id}`)
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