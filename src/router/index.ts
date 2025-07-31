import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../components/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/student/login',
    name: 'studentLogin',
    component: () => import('../components/student/login/LoginPage.vue')
  },
  {
    path: '/student/register',
    name: 'studentRegister',
    component: () => import('../components/student/register/RegisterPage.vue')
  },
  {
    path: '/student',
    component: () => import('../layout/StudentLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'studentDashboard',
        component: () => import('../components/student/dashboard/DashboardPage.vue')
      },
      {
        path: 'stastic',
        name: 'studentStastic',
        component: () => import('../components/student/stastic/data-screen.vue')
      },
      {
        path: 'data-screen',
        name: 'studentDataScreen',
        component: () => import('../components/student/stastic/data-screen.vue')
      },
      {
        path: 'homework',
        name: 'studentHomework',
        component: () => import('../components/student/assignments/assignments.vue')
      },
      {
        path: 'courses',
        name: 'studentCourses',
        component: () => import('../components/student/courses/CoursesPage.vue')
      },
      {
        path: 'course-schedule',
        name: 'courseSchedule',
        component: () => import('../components/student/courses/CoursesPage.vue')
      },
      {
        path: 'achievement',
        name: 'studentAchievement',
        component: () => import('../components/student/honors/achievement.vue')
      },
      {
        path: 'achievement-collect',
        name: 'achievementCollect',
        component: () => import('../components/student/honors/achievement-collect.vue')
      },
      {
        path: 'achievement-detail/:id',
        name: 'achievementDetail',
        component: () => import('../components/student/honors/AchievementDetail.vue')
      },
      {
        path: 'achievement-settings',
        name: 'achievementSettings',
        component: () => import('../components/student/honors/AchievementSettings.vue')
      },
      {
        path: 'teachers',
        name: 'studentTeachers',
        component: () => import('../components/student/teachers/teachers.vue')
      },
      {
        path: 'teacher-info',
        name: 'teacherInfo',
        component: () => import('../components/student/teachers/teachers.vue')
      },
      {
        path: 'teacher-detail/:id',
        name: 'teacherDetail',
        component: () => import('../components/student/teachers/TeacherDetail.vue')
      },
      {
        path: 'teacher-favorites',
        name: 'teacherFavorites',
        component: () => import('../components/student/teachers/teachers.vue')
      },
      {
        path: 'consult',
        name: 'studentConsult',
        component: () => import('../components/student/consulting/consulting.vue')
      },
      {
        path: 'resume',
        name: 'studentResume',
        component: () => import('../components/student/resume/resume.vue')
      },
      {
        path: 'feedback',
        name: 'studentFeedback',
        component: () => import('../components/student/feedback/feedback.vue')
      },
      {
        path: 'survey',
        name: 'studentSurvey',
        component: () => import('../components/student/vote-survey/vote-survey.vue')
      },
      {
        path: 'consultant-detail/:id',
        name: 'consultantDetail',
        component: () => import('../components/student/consulting/consulting.vue')
      },
      {
        path: 'book-consultation/:id',
        name: 'bookConsultation',
        component: () => import('../components/student/consulting/consulting.vue')
      },
      {
        path: 'job-recommendation',
        name: 'jobRecommendation',
        component: () => import('../components/student/job/jobpage.vue')
      },
      {
        path: 'api-test',
        name: 'apiTest',
        component: () => import('../components/test/ApiTest.vue')
      },
      {
        path: 'activities',
        name: 'studentActivities',
        component: () => import('../components/student/activities/college-activity.vue')
      },
      {
        path: 'talent-market',
        name: 'talentMarket',
        component: () => import('../components/student/talent-market/talent-market.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫，检查是否需要登录
router.beforeEach((to, from, next) => {
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 检查是否有token
    const token = localStorage.getItem('token')
    if (!token) {
      // 没有token，重定向到登录页
      next({ name: 'studentLogin' })
    } else {
      // 有token，继续导航
      next()
    }
  } else {
    // 不需要认证的路由，直接通过
    next()
  }
})

export default router
