<template>
  <div class="achievement_detail_page">
    <!-- 页面顶部区域 -->
    <div class="header_area">
      <div class="title_info">
        <n-button quaternary @click="go_back">
          <template #icon>
            <IconArrowLeft :size="24" />
          </template>
          返回
        </n-button>
        <h2>成果详情</h2>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading_state">
      <n-spin size="large" />
      <p>加载中...</p>
    </div>

    <template v-else>
      <div v-if="achievement && achievement.id">
        <!-- 成果基本信息卡片 -->
        <n-card class="info_card" title="基本信息">
          <div class="basic_info">
            <div class="achievement_title">
              <h3>{{ achievement.title }}</h3>
              <n-tag type="success" v-if="achievement.status === 1">已审核</n-tag>
              <n-tag type="warning" v-else>审核中</n-tag>
            </div>
            
            <div class="info_grid">
              <div class="info_item">
                <span class="label">获奖时间：</span>
                <span class="value">{{ format_date(achievement.awardedAt) || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">年份：</span>
                <span class="value">{{ achievement.year || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">成果级别：</span>
                <span class="value">{{ achievement.level || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">成果类型：</span>
                <span class="value">{{ get_type_nm(achievement.type_id) }}</span>
              </div>
            </div>
          </div>
        </n-card>

        <!-- 指导教师信息卡片 -->
        <n-card v-if="achievement.teacher" class="info_card" title="指导教师信息">
          <div class="teacher_info">
            <div class="info_grid">
              <div class="info_item">
                <span class="label">教师姓名：</span>
                <span class="value">{{ achievement.teacher.name || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">联系方式：</span>
                <span class="value">{{ achievement.teacher.contactPhone || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">联系邮箱：</span>
                <span class="value">{{ achievement.teacher.contactEmail || '暂无数据' }}</span>
              </div>
              <div class="info_item">
                <span class="label">研究方向：</span>
                <span class="value">{{ achievement.teacher.research_tent || '暂无数据' }}</span>
              </div>
            </div>
          </div>
        </n-card>

        <!-- 详细内容区域 -->
        <div class="detail_content">
          <n-tabs type="line" animated>
            <n-tab-pane name="description" tab="成果描述">
              <n-card>
                <div class="description_content">
                  <p>{{ achievement.description || '暂无成果描述信息' }}</p>
                </div>
              </n-card>
            </n-tab-pane>
            
            <n-tab-pane name="details" tab="详细信息">
              <n-card>
                <div class="details_content">
                  <div class="detail_item">
                    <strong>成果ID：</strong>{{ achievement.id }}
                  </div>
                  <div class="detail_item">
                    <strong>状态：</strong>{{ achievement.status === 1 ? '已审核' : '审核中' }}
                  </div>
                  <div class="detail_item">
                    <strong>创建时间：</strong>{{ format_date(achievement.awardedAt) }}
                  </div>
                </div>
              </n-card>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
      <div v-else-if="!loading && (!achievement || !achievement.id)" class="error_state">
        <n-result status="404" title="未找到成果详情" description="请检查成果ID是否正确或联系管理员">
          <template #footer>
            <n-button @click="go_back">返回</n-button>
          </template>
        </n-result>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  IconArrowLeft
} from '@tabler/icons-vue'
import http from '@/server/api/http'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 获取成果ID
const achievement_id = route.params.id

// 加载状态
const loading = ref(true)

// 定义成果详情接口（与后端API保持一致）
interface AchievementDetail {
  id: number;
  title: string;
  description: string;
  awardedAt: string;
  type_id: string;
  year: string;
  level: string;
  status: number;
  teacher?: {
    contactEmail?: string;
    research_tent?: string;
    contactPhone?: string;
    name?: string;
  };
}

// 成果详情数据
const achievement = ref<AchievementDetail>({
  id: 0,
  title: '',
  description: '',
  awardedAt: '',
  type_id: '',
  year: '',
  level: '',
  status: 0,
  teacher: {
    contactEmail: '',
    research_tent: '',
    contactPhone: '',
    name: ''
  }
})

// 获取类型名称
const get_type_nm = (type_id: string) => {
  const type_map: { [key: string]: string } = {
    '1': '竞赛',
    '2': '科研',
    '3': '项目',
    '4': '论文',
    '5': '专利',
    '6': '证书'
  }
  return type_map[type_id] || '未知类型'
}

// 格式化日期
const format_date = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// 返回上一页
const go_back = () => {
  router.back()
}

// 获取成果详情数据
const fetch_detail = async () => {
  // 检查ID是否存在
  if (!achievement_id) {
    message.error('成果ID不存在')
    loading.value = false
    return
  }
  
  loading.value = true
  
  try {
    // 确保ID是正确的格式
    const id = Array.isArray(achievement_id) ? achievement_id[0] : achievement_id
    console.log('请求成果详情，ID:', id)
    
    // 🎯 策略1: 优先尝试从sessionStorage获取数据（如果从列表页跳转过来）
    const cachedData = get_cached_achievement(id)
    if (cachedData) {
      console.log('✅ 从缓存获取成果详情:', cachedData)
      achievement.value = cachedData
      loading.value = false
      return
    }
    
    // 🎯 策略2: 尝试调用API获取详情
    try {
      console.log('🌐 尝试从API获取成果详情...')
      const response = await http.get(`/achievements/${id}`)
      console.log('成果详情API响应:', response)
      
      // 检查响应数据结构
      if (response.data && (response.data.id || response.data.data?.id)) {
        const data = response.data.data || response.data
        
        // 更新成果详情数据
        achievement.value = {
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          awardedAt: data.awardedAt || data.date || '',
          type_id: data.type_id || data.category || '',
          year: data.year || '',
          level: data.level || '',
          status: data.status !== undefined ? data.status : 1,
          teacher: data.teacher ? {
            contactEmail: data.teacher.contactEmail || '',
            research_tent: data.teacher.research_tent || '',
            contactPhone: data.teacher.contactPhone || '',
            name: data.teacher.name || ''
          } : undefined
        }
        
        console.log('✅ API获取成果详情成功:', achievement.value)
        return
      }
    } catch (apiError: any) {
      console.warn('⚠️ API调用失败，尝试其他方式:', apiError.response?.status)
      
      // 如果是404错误，说明API端点不存在，尝试其他方式
      if (apiError.response?.status === 404) {
        console.log('🔄 API端点不存在，尝试从成果列表API获取数据...')
        
        // 🎯 策略3: 从成果列表API获取所有数据，然后筛选
        try {
          const listResponse = await http.get('/achievements')
          console.log('成果列表API响应:', listResponse)
          
          if (listResponse.data) {
            let achievements = []
            
            // 处理不同的响应格式
            if (Array.isArray(listResponse.data)) {
              achievements = listResponse.data
            } else if (listResponse.data.data && Array.isArray(listResponse.data.data)) {
              achievements = listResponse.data.data
            }
            
            // 查找匹配的成果
            const targetAchievement = achievements.find((item: any) => 
              String(item.id) === String(id)
            )
            
            if (targetAchievement) {
              achievement.value = {
                id: targetAchievement.id,
                title: targetAchievement.title || '',
                description: targetAchievement.description || '',
                awardedAt: targetAchievement.awardedAt || targetAchievement.date || '',
                type_id: targetAchievement.type_id || targetAchievement.category || '',
                year: targetAchievement.year || '',
                level: targetAchievement.level || '',
                status: targetAchievement.status !== undefined ? targetAchievement.status : 1,
                teacher: targetAchievement.teacher ? {
                  contactEmail: targetAchievement.teacher.contactEmail || '',
                  research_tent: targetAchievement.teacher.research_tent || '',
                  contactPhone: targetAchievement.teacher.contactPhone || '',
                  name: targetAchievement.teacher.name || ''
                } : undefined
              }
              
              console.log('✅ 从列表API获取成果详情成功:', achievement.value)
              return
            }
          }
        } catch (listError) {
          console.warn('⚠️ 成果列表API也失败了:', listError)
        }
      }
      
      // 重新抛出错误，让外层catch处理
      throw apiError
    }
    
    // 如果所有API调用都没有返回有效数据
    console.warn('⚠️ 所有API调用都未返回有效数据，使用默认数据')
    message.warning('未找到成果详情，显示示例数据')
    use_default_data()
    
  } catch (error: any) {
    console.error('❌ 获取成果详情失败:', error)
    
    // 详细的错误信息
    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', error.response.data)
      
      // 根据不同的错误状态给出不同的提示
      if (error.response.status === 404) {
        message.warning('成果详情不存在，显示示例数据')
      } else if (error.response.status >= 500) {
        message.error('服务器错误，请稍后重试')
      } else {
        message.error(`获取成果详情失败: ${error.response.status}`)
      }
    } else if (error.request) {
      console.error('请求未收到响应:', error.request)
      message.error('网络请求失败，请检查网络连接')
    } else {
      console.error('请求配置错误:', error.message)
      message.error(`请求失败: ${error.message}`)
    }
    
    // 出错时使用默认数据
    use_default_data()
  } finally {
    // 无论成功失败都关闭加载状态
    loading.value = false
  }
}

// 🎯 新增：从缓存获取成果数据
const get_cached_achievement = (id: string): AchievementDetail | null => {
  try {
    // 尝试从sessionStorage获取缓存的成果列表数据
    const cachedList = sessionStorage.getItem('achievements_cache')
    if (cachedList) {
      const achievements = JSON.parse(cachedList)
      const found = achievements.find((item: any) => String(item.id) === String(id))
      
      if (found) {
        return {
              id: found.id,
              title: found.title || '',
              description: found.description || '',
              awardedAt: found.awardedAt || found.date || '',
              type_id: found.type_id || found.category || '',
              year: found.year || '',
              level: found.level || '',
              status: found.status !== undefined ? found.status : 1,
              teacher: found.teacher ? {
                contactEmail: found.teacher.contactEmail || '',
                research_tent: found.teacher.research_tent || '',
                contactPhone: found.teacher.contactPhone || '',
                name: found.teacher.name || ''
              } : undefined
            }
      }
    }
    
    // 尝试从路由state获取数据
    if (router.currentRoute.value.params.achievementData) {
      const routeData = router.currentRoute.value.params.achievementData as any
      return {
        id: routeData.id,
        title: routeData.title || '',
        description: routeData.description || '',
        awardedAt: routeData.awardedAt || routeData.date || '',
        type_id: routeData.type_id || routeData.category || '',
        year: routeData.year || '',
        level: routeData.level || '',
        status: routeData.status !== undefined ? routeData.status : 1,
        teacher: routeData.teacher ? {
          contactEmail: routeData.teacher.contactEmail || '',
          research_tent: routeData.teacher.research_tent || '',
          contactPhone: routeData.teacher.contactPhone || '',
          name: routeData.teacher.name || ''
        } : undefined
      }
    }
    
    return null
  } catch (error) {
    console.warn('获取缓存数据失败:', error)
    return null
  }
}

// 使用默认数据（当API调用失败或无数据时）
const use_default_data = () => {
  achievement.value = {
    id: parseInt(achievement_id as string) || 1,
    title: '学术优秀奖学金一等奖',
    description: '该奖项授予在学术研究方面表现突出的学生，评选标准包括学术成绩、研究能力和创新思维等多个方面。获得该奖项代表了学生在学术领域的卓越表现和潜力。',
    awardedAt: '2023-06-01T00:00:00.000Z',
    type_id: '1',
    year: '2023',
    level: '校级',
    status: 1,
    teacher: {
      contactEmail: 'teacher@example.com',
      research_tent: '人工智能与机器学习',
      contactPhone: '138-0000-0000',
      name: '张教授'
    }
  }
}

onMounted(() => {
  fetch_detail()
})
</script>

<style scoped>
.achievement_detail_page {
  padding: 20px;
}

.header_area {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  background-color: #f5f7fa;
  padding: 16px 20px;
  border-radius: 8px;
}

.title_info {
  display: flex;
  align-items: center;
}

.title_info h2 {
  margin: 0 0 0 16px;
  font-size: 20px;
}

.loading_state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading_state p {
  margin-top: 16px;
  color: #666;
}

.error_state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  min-height: 400px;
}

.info_card {
  margin-bottom: 24px;
}

.achievement_title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.achievement_title h3 {
  margin: 0;
  margin-right: 12px;
  font-size: 18px;
}

.info_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info_item {
  display: flex;
}

.label {
  color: #666;
  min-width: 80px;
}

.value {
  font-weight: 500;
}

.detail_content {
  margin-top: 24px;
}

.description_content,
.details_content {
  padding: 8px 0;
}

.detail_item {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail_item:last-child {
  border-bottom: none;
}

.detail_item strong {
  margin-right: 8px;
  color: #333;
}
</style>