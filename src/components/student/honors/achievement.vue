<template>
  <div class="achievements_page">
    <!-- 页面顶部说明区域 -->
    <n-card class="header_card">
      <div class="header_area">
        <div class="title_info">
          <div class="title_row">
            <School :size="24" />
            <h2>成果展示</h2>
          </div>
          <p class="desc_text">记录我的成长足迹，展示个人成就</p>
        </div>
        <div class="action_btns">
          <n-button type="primary" @click="collect_achievement" class="collect_btn">
            <template #icon>
              <Plus :size="24" />
            </template>
            成果收集
          </n-button>
          <n-button quaternary @click="go_to_settings" class="settings_btn">
            <template #icon>
              <Settings :size="24" />
            </template>
            规则设置
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- 统计展示区域 - 实时统计系统 -->
    <div class="stats_area">
      <!-- 总成果数量统计卡片 -->
      <n-card 
        class="stat_card total_card"
        :class="{ 'active': !type_filter }"
        @click="type_filter = null"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.total_count }}</div>
          <div class="stat_name">全部成果</div>
        </div>
      </n-card>
      
      <!-- 竞赛类成果统计 -->
      <n-card 
        class="stat_card competition_card"
        :class="{ 'active': type_filter === '1' }"
        @click="type_filter = type_filter === '1' ? null : '1'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.competition_count }}</div>
          <div class="stat_name">竞赛类</div>
        </div>
      </n-card>
      
      <!-- 科研类成果统计 -->
      <n-card 
        class="stat_card research_card"
        :class="{ 'active': type_filter === '2' }"
        @click="type_filter = type_filter === '2' ? null : '2'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.research_count }}</div>
          <div class="stat_name">科研类</div>
        </div>
      </n-card>
      
      <!-- 项目类成果统计 -->
      <n-card 
        class="stat_card project_card"
        :class="{ 'active': type_filter === '3' }"
        @click="type_filter = type_filter === '3' ? null : '3'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.project_count }}</div>
          <div class="stat_name">项目类</div>
        </div>
      </n-card>
      
      <!-- 论文类成果统计 -->
      <n-card 
        class="stat_card paper_card"
        :class="{ 'active': type_filter === '4' }"
        @click="type_filter = type_filter === '4' ? null : '4'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.paper_count }}</div>
          <div class="stat_name">论文类</div>
        </div>
      </n-card>
      
      <!-- 专利类成果统计 -->
      <n-card 
        class="stat_card patent_card"
        :class="{ 'active': type_filter === '5' }"
        @click="type_filter = type_filter === '5' ? null : '5'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.patent_count }}</div>
          <div class="stat_name">专利类</div>
        </div>
      </n-card>
      
      <!-- 证书类成果统计 -->
      <n-card 
        class="stat_card certificate_card"
        :class="{ 'active': type_filter === '6' }"
        @click="type_filter = type_filter === '6' ? null : '6'"
      >
        <div class="stat_content">
          <div class="stat_num">{{ allStats.certificate_count }}</div>
          <div class="stat_name">证书类</div>
        </div>
      </n-card>
    </div>

    <!-- 筛选区域 -->
    <div class="filter_area">
      <n-input v-model:value="search_key" placeholder="搜索成果标题" class="search_input">
        <template #prefix>
          <HelpCircle :size="18" />
        </template>
      </n-input>
      <n-select v-model:value="year_filter" :options="year_options" placeholder="选择年份" clearable class="filter_select" />
      <n-select v-model:value="level_filter" :options="level_options" placeholder="选择级别" clearable class="filter_select" />
      <n-select v-model:value="type_filter" :options="type_options" placeholder="选择类型" clearable class="filter_select" />
    </div>

    <!-- 成果展示区域 -->
    <n-grid :cols="3" :x-gap="16" :y-gap="16" class="achievement_cards">
      <n-grid-item v-for="achievement in filtered_achievements" :key="achievement.id || 'unknown'">
        <n-card class="achievement_card" v-if="achievement && achievement.id">
          <div class="card_header">
            <div :class="['card_type', 'type_' + (achievement.type_id || '1')]">
              <component :is="get_type_ic(achievement) || FileText" :size="16" />
                {{ get_type_nm(achievement) }}
            </div>
            <n-tag :type="achievement.status === 1 ? 'success' : 'warning'">
              {{ achievement.status === 1 ? '已认证' : '审核中' }}
            </n-tag>
          </div>
          <div class="card_title">{{ achievement.title || '未知标题' }}</div>
          <div class="card_info">
            <div class="info_item">
              <Medal :size="16" />
              {{ get_level_nm(achievement.level) }}
            </div>
            <div class="info_item" v-if="achievement.prize">
              <Award :size="16" />
              {{ get_prize_nm(achievement.prize) }}
            </div>
            <div class="info_item" v-if="achievement.date || achievement.awardedAt">
              <Calendar :size="16" />
              获奖时间：{{ formatDate(achievement.date || achievement.awardedAt) }}
            </div>
          </div>
          <div class="card_footer">
            <n-button quaternary size="small" @click="view_achievement_detail(achievement.id)">
              <template #icon>
                <Eye :size="16" />
              </template>
              查看详情
            </n-button>
            <div>
              <n-button quaternary size="small" @click="edit_achievement(achievement.id)">
                <template #icon>
                  <Edit :size="16" />
                </template>
              </n-button>
              <n-button quaternary size="small" @click="delete_achievement(achievement.id)">
                <template #icon>
                  <Trash :size="16" />
                </template>
              </n-button>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 空状态 -->
    <n-empty v-if="filtered_achievements.length === 0" description="暂无成果数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { Component } from 'vue'
import { 
  IconSchool as School, 
  IconPlus as Plus, 
  IconSearch as Search, 
  IconFileText as FileText, 
  IconBook as BookOpen, 
  IconCode as Code, 
  IconUsers as Users, 
  IconAward as Award, 
  IconMusic as Music, 
  IconCalendar as Calendar, 
  IconEye as Eye, 
  IconEdit as Edit, 
  IconTrash as Trash,
  IconSettings as Settings,
  IconBulb as Bulb,
  IconCertificate as Certificate,
  IconHelpCircle as HelpCircle,
  IconMedal as Medal
} from '@tabler/icons-vue'
import { 
  fetchAchievements, 
  fetchAchievementById, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement, 
  viewAchievementDetail as apiViewAchievementDetail
} from '@/server/api/api'
import { runFullAPITest } from '@/utils/api-test'

// 定义成果数据类型
interface AchievementItem {
  id: string
  title: string
  type_id: string
  category?: string  // 后端成果类型分类字段
  year: string
  level: string
  prize?: string
  status: number
  awardedAt?: string
  date?: string  // 后端获奖时间字段
  [key: string]: any
}

// 定义API响应类型
interface ApiResponse {
  data: AchievementItem[]
  [key: string]: any
}

// 定义选择器选项类型
interface SelectOption {
  label: string
  value: string
}

const router = useRouter()
const message = useMessage()

// 加载状态
const loading = ref<boolean>(false)

// 成果数据 - 明确指定类型
const achievements = ref<AchievementItem[]>([])

// 统计数据对象 - 实时计算
const stats = ref({
  total_count: 0,
  competition_count: 0,
  research_count: 0,
  project_count: 0,
  paper_count: 0,
  patent_count: 0,
  certificate_count: 0
})

// 计算成果统计数据 - 基于全部数据进行统计
const calculateStats = (achievementList: AchievementItem[]): void => {
  stats.value.total_count = achievementList.length
  stats.value.competition_count = achievementList.filter(a => a.type_id === '1').length
  stats.value.research_count = achievementList.filter(a => a.type_id === '2').length
  stats.value.project_count = achievementList.filter(a => a.type_id === '3').length
  stats.value.paper_count = achievementList.filter(a => a.type_id === '4').length
  stats.value.patent_count = achievementList.filter(a => a.type_id === '5').length
  stats.value.certificate_count = achievementList.filter(a => a.type_id === '6').length
}

// 获取成果的实际类型字段值 - 支持多种字段名，增强安全性
const getAchievementType = (achievement: any): string => {
  // 安全检查：确保参数存在且为对象
  if (!achievement || typeof achievement !== 'object') {
    console.warn('getAchievementType: achievement参数无效，返回默认类型')
    return '1'
  }
  
  try {
    // 优先使用 category 字段（后端主要字段）
    if (achievement.category && typeof achievement.category === 'string') {
      return achievement.category
    }
    // 其次使用 type_id 字段
    if (achievement.type_id && typeof achievement.type_id === 'string') {
      return achievement.type_id
    }
    // 最后使用其他可能的字段
    const fallbackType = achievement.typeId || achievement.type || '1'
    
    if (typeof fallbackType === 'string') {
      return fallbackType
    }
    
    console.warn('getAchievementType: 所有类型字段都无效，返回默认类型')
    return '1'
  } catch (error) {
    console.error('getAchievementType: 获取类型时发生错误:', error)
    return '1'
  }
}

// 检查成果是否属于指定类型 - 支持多种匹配方式
const isAchievementOfType = (achievement: any, targetTypes: string[]): boolean => {
  const actualType = getAchievementType(achievement)
  return targetTypes.includes(actualType)
}

// 计算全部成果的统计数据 - 响应式计算，支持category字段
const allStats = computed(() => {
  const allAchievements = achievements.value
  return {
    total_count: allAchievements.length,
    // 竞赛类：支持 '1', 'competition', 'contest', '竞赛类'
    competition_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['1', 'competition', 'contest', '竞赛类'])
    ).length,
    // 科研类：支持 '2', 'research', '科研类'
    research_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['2', 'research', '科研类'])
    ).length,
    // 项目类：支持 '3', 'project', '项目类'
    project_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['3', 'project', '项目类'])
    ).length,
    // 论文类：支持 '4', 'paper', '论文类'
    paper_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['4', 'paper', '论文类'])
    ).length,
    // 专利类：支持 '5', 'patent', '专利类'
    patent_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['5', 'patent', '专利类'])
    ).length,
    // 证书类：支持 '6', 'certificate', '证书类'
    certificate_count: allAchievements.filter(a => 
      isAchievementOfType(a, ['6', 'certificate', '证书类'])
    ).length
  }
})

// 🎯 类型映射配置 - 支持动态扩展
const typeMap: Record<string, string> = {
  // 数字ID映射
  '1': '竞赛类',
  '2': '科研类', 
  '3': '项目类',
  '4': '论文类',
  '5': '专利类',
  '6': '证书类',
  // 英文category映射
  'competition': '竞赛类',
  'contest': '竞赛类',
  'research': '科研类',
  'project': '项目类',
  'paper': '论文类',
  'patent': '专利类',
  'certificate': '证书类',
  // 中文category映射
  '竞赛类': '竞赛类',
  '科研类': '科研类',
  '项目类': '项目类', 
  '论文类': '论文类',
  '专利类': '专利类',
  '证书类': '证书类'
}


// 筛选条件 - 明确指定类型
const search_key = ref<string>('')
const year_filter = ref<string | null>(null)
const level_filter = ref<string | null>(null)
const type_filter = ref<string | null>(null)

// 筛选选项 - 明确指定类型
const year_options: SelectOption[] = [
  { label: '2024年', value: '2024' },
  { label: '2023年', value: '2023' },
  { label: '2022年', value: '2022' },
  { label: '2021年', value: '2021' }
]

const level_options: SelectOption[] = [
  { label: '国家级', value: 'international' },
  { label: '省部级', value: 'provincial' },
  { label: '校级', value: 'university' },
  { label: '院级', value: 'college' }
]

const type_options: SelectOption[] = [
  { label: '竞赛类', value: '1' },
  { label: '科研类', value: '2' },
  { label: '项目类', value: '3' },
  { label: '论文类', value: '4' },
  { label: '专利类', value: '5' },
  { label: '证书类', value: '6' }
]

// 获取成果数据
async function fetchAchievementData() {
  loading.value = true
  try {
    console.log('开始获取成果数据...')
    const response = await fetchAchievements()
    console.log('API完整响应:', response)
    console.log('响应状态:', response.status)
    console.log('响应数据:', response.data)
    
    // 检查响应状态
    if (response.status === 200) {
      // 处理不同的数据结构
      let data = null
      
      if (response.data && typeof response.data === 'object') {
        // 检查是否是Strapi格式 {data: [...], meta: {...}}
        if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data
        }
        // 检查是否直接是数组
        else if (Array.isArray(response.data)) {
          data = response.data
        }
        // 检查是否有其他包装格式
        else if (response.data.achievements && Array.isArray(response.data.achievements)) {
          data = response.data.achievements
        }
        // 检查是否有results字段
        else if (response.data.results && Array.isArray(response.data.results)) {
          data = response.data.results
        }
      }
      
      if (data && Array.isArray(data)) {
        // 数据标准化处理 - 保留原始字段，支持多种类型字段
        const normalizedData = data.map((item: any) => {
          const normalized = {
            id: item.id || item._id || String(Math.random()),
            title: item.title || item.name || '未知标题',
            // 保留原始的category字段（优先）
            category: item.category,
            // 保留type_id字段作为备用
            type_id: item.type_id || item.typeId || item.type || '1',
            year: item.year || item.awardYear || new Date().getFullYear().toString(),
            level: item.level || item.grade || item.rank || 'university',
            // 修复奖项字段映射，支持后端的award字段
            prize: item.prize || item.award || item.prizeLevel || item.award_level || '',
            status: item.status !== undefined ? item.status : 1,
            // 修复获奖时间字段映射，优先使用后端的date字段
            awardedAt: item.date || item.awardedAt || item.awardDate || item.award_date || item.createdAt || new Date().toISOString(),
            // 保留原始的date字段
            date: item.date || item.awardedAt || item.awardDate || item.award_date || item.createdAt || new Date().toISOString()
          }
          
          // 调试信息 - 显示类型字段的映射情况
          console.log(`成果数据标准化:`, {
            原始: item,
            标准化: normalized,
            类型字段检测: {
              category: item.category,
              type_id: item.type_id,
              typeId: item.typeId,
              type: item.type,
              最终使用: getAchievementType(normalized)
            }
          })
          
          return normalized
        })
        
        achievements.value = normalizedData
        console.log('成功获取成果数据，数量:', normalizedData.length)
        console.log('标准化后的数据:', normalizedData)
        
        // 🎯 缓存获取到的数据
        cache_achievements_data()
        
        // 初始化统计数据
        calculateStats(normalizedData)
      } else {
        console.warn('API返回的数据格式不正确，数据结构:', response.data)
        console.warn('使用模拟数据')
        achievements.value = mockAchievements
        calculateStats(mockAchievements)
      }
    } else {
        console.error('API响应状态异常:', response.status)
        achievements.value = mockAchievements
        calculateStats(mockAchievements)
      }
    } catch (error: unknown) {
      console.error('获取成果数据失败:', error)
      
      // 类型安全的错误处理
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: any }; message?: string }
        console.error('错误详情:', axiosError.response?.data || axiosError.message)
      } else if (error instanceof Error) {
        console.error('错误详情:', error.message)
      } else {
        console.error('错误详情:', String(error))
      }
      
      // 使用模拟数据
      achievements.value = mockAchievements
      calculateStats(mockAchievements)
      
      // 🎯 缓存模拟数据
      cache_achievements_data()
  } finally {
    loading.value = false
  }
}

// 筛选后的成果列表 - 仅进行筛选，不更新统计
const filtered_achievements = computed((): AchievementItem[] => {
  // 确保 achievements.value 是数组
  if (!Array.isArray(achievements.value)) {
    return []
  }
  
  const result = achievements.value.filter((achievement: AchievementItem) => {
    // 关键词筛选
    if (search_key.value && !achievement.title?.includes(search_key.value)) {
      return false
    }
    
    // 年份筛选
    if (year_filter.value && achievement.year !== year_filter.value) {
      return false
    }
    
    // 级别筛选
    if (level_filter.value) {
      // 直接使用后端值进行比较
      if (achievement.level !== level_filter.value) {
        return false
      }
    }
    
    // 类型筛选 - 使用isAchievementOfType函数支持多种类型值匹配
    if (type_filter.value) {
      let typeMatches = false
      
      // 根据筛选器值确定匹配的类型数组
      switch (type_filter.value) {
        case '1':
          typeMatches = isAchievementOfType(achievement, ['1', 'competition', 'contest', '竞赛类'])
          break
        case '2':
          typeMatches = isAchievementOfType(achievement, ['2', 'research', '科研类'])
          break
        case '3':
          typeMatches = isAchievementOfType(achievement, ['3', 'project', '项目类'])
          break
        case '4':
          typeMatches = isAchievementOfType(achievement, ['4', 'paper', '论文类'])
          break
        case '5':
          typeMatches = isAchievementOfType(achievement, ['5', 'patent', '专利类'])
          break
        case '6':
          typeMatches = isAchievementOfType(achievement, ['6', 'certificate', '证书类'])
          break
        default:
          typeMatches = false
      }
      
      if (!typeMatches) {
        return false
      }
    }
    
    return true
  })
  
  // 移除这里的统计更新，统计数据应该基于全部数据
  // calculateStats(result)
  
  return result
})

// 页面初始化
onMounted(async () => {
  console.log('🚀 页面初始化开始...')
  
  try {
    // 运行API连接测试
    const testResults = await runFullAPITest()
    
    // 根据测试结果决定数据获取策略
    if (testResults.achievementsAPI.success) {
      console.log('✅ API连接正常，从后端获取数据')
      await fetchAchievementData()
    } else {
      console.warn('⚠️ API连接异常，使用模拟数据')
      achievements.value = mockAchievements
      calculateStats(mockAchievements)
      
      // 🎯 缓存模拟数据
      cache_achievements_data()
      
      console.log('📊 模拟数据已加载:', achievements.value)
      
      // 测试映射函数
      achievements.value.forEach(achievement => {
        console.log(`成果: ${achievement.title}`)
        console.log(`- 类型ID: ${achievement.type_id} -> ${get_type_nm(achievement)}`)
        console.log(`- 等级: ${achievement.level} -> ${get_level_nm(achievement.level)}`)
        if (achievement.prize) {
          console.log(`- 奖项: ${achievement.prize} -> ${get_prize_nm(achievement.prize)}`)
        }
      })
    }
    
    // 统计API已删除，使用响应式统计系统，无需额外API调用
    console.log('📊 使用响应式统计系统，无需额外API调用')
  } catch (error: unknown) {
    console.error('❌ 页面初始化过程中发生错误:', error)
    // 确保即使测试失败也能显示模拟数据
    achievements.value = mockAchievements
    calculateStats(mockAchievements)
    
    // 🎯 缓存模拟数据
    cache_achievements_data()
    
    console.log('📊 备用模拟数据已加载:', achievements.value)
  }
  
  console.log('✅ 页面初始化完成')
  
  // 延迟执行调试，确保数据已加载
  setTimeout(() => {
    debug_data_mapping()
    // 在数据加载完成后添加奖项映射调试
    debug_prize_mapping()
  }, 1500)
  
  // 暴露调试函数到全局，方便在控制台调用
  if (typeof window !== 'undefined') {
    // 扩展 Window 接口以支持调试函数
    interface WindowWithDebug extends Window {
      debugAchievements?: () => void
      debugPrizeMapping?: () => void
      testConnection?: () => Promise<void>
    }
    
    const windowWithDebug = window as WindowWithDebug
    windowWithDebug.debugAchievements = debug_data_mapping
    windowWithDebug.debugPrizeMapping = debug_prize_mapping
    windowWithDebug.testConnection = testConnection
  }
})

// 调试数据映射情况
const debug_data_mapping = () => {
  console.log('=== 🎯 实时统计系统调试信息 ===')
  console.log('当前成果数据数量:', achievements.value.length)
  console.log('筛选后数据数量:', filtered_achievements.value.length)
  
  // 📊 新的实时统计信息
  console.log('📊 allStats (全部数据统计):', allStats.value)
  
  // 📈 统计信息
  console.log('📈 统计信息:', {
    总数: allStats.value.total_count,
    竞赛类: allStats.value.competition_count,
    科研类: allStats.value.research_count,
    项目类: allStats.value.project_count,
    论文类: allStats.value.paper_count,
    专利类: allStats.value.patent_count,
    证书类: allStats.value.certificate_count
  })
  
  achievements.value.forEach((achievement, index) => {
    console.log(`成果 ${index + 1}:`, {
      id: achievement.id,
      title: achievement.title,
      原始type_id: achievement.type_id,
      映射后类型: get_type_nm(achievement),
      原始level: achievement.level,
      映射后等级: get_level_nm(achievement.level),
      原始prize: achievement.prize,
      映射后奖项: get_prize_nm(achievement.prize),
      完整数据: achievement
    })
  })
  
  console.log('类型映射表:', typeMap)
  console.log('等级映射表:', levelMap)
  console.log('奖项映射表:', prizeMap)
  console.log('当前筛选条件:', {
    search_key: search_key.value,
    year_filter: year_filter.value,
    level_filter: level_filter.value,
    type_filter: type_filter.value
  })
  console.log('=== 调试信息结束 ===')
}

// 手动重新测试连接（用于调试）
const testConnection = async () => {
  console.log('手动重新测试API连接...')
  try {
    const testResults = await runFullAPITest()
    
    if (testResults.baseConnection.success && testResults.achievementsAPI.success) {
      console.log('连接测试通过，重新获取数据')
      await fetchAchievementData()
      
      // 调试数据映射
      setTimeout(() => {
        debug_data_mapping()
      }, 1000)
      
      message.success('API连接测试成功，数据已重新加载')
    } else {
      console.error('连接测试失败，请检查后端服务')
      message.error('API连接测试失败，请检查后端服务')
    }
  } catch (error: unknown) {
    console.error('测试连接时发生错误:', error)
    message.error('测试连接时发生错误')
  }
}

// 等级映射表（后端值 -> 前端显示）- 扩展支持更多字段值
const levelMap: Record<string, string> = {
  // 英文值
  'international': '国家级',
  'national': '国家级',
  'provincial': '省级',
  'province': '省级',
  'university': '校级',
  'school': '校级',
  'college': '院级',
  'department': '院级',
  // 数字值
  '1': '国家级',
  '2': '省级', 
  '3': '校级',
  '4': '院级',
}

// 奖项等级映射表（后端值 -> 前端显示）- 扩展支持更多字段值
const prizeMap: Record<string, string> = {
  // 英文值（无下划线）- 根据需求修正映射
  'honorablemention': '特等奖',
  'firstprize': '一等奖',
  'secondprize': '二等奖',
  'thirdprize': '三等奖',
  'grandprize': '优秀奖',
  'other': '参与奖',
  
  // 英文值（带下划线）- 兼容性支持
  'honorable_mention': '特等奖',
  'first_prize': '一等奖',
  'second_prize': '二等奖',
  'third_prize': '三等奖',
  'grand_prize': '优秀奖',
  
  // 数字值 - 兼容性支持
  '0': '特等奖',
  '1': '一等奖',
  '2': '二等奖',
  '3': '三等奖',
  '4': '优秀奖',
  '5': '参与奖',
  
  // 中文值 - 直接映射
  '特等奖': '特等奖',
  '一等奖': '一等奖',
  '二等奖': '二等奖',
  '三等奖': '三等奖',
  '优秀奖': '优秀奖',
  '参与奖': '参与奖',
}

// 图标映射
const iconMap: Record<string, Component> = {
  '1': Award,
  '2': BookOpen,
  '3': Code,
  '4': FileText,
  '5': Bulb,
  '6': Certificate
}

// 获取类型名称 - 支持achievement对象和category字段
const get_type_nm = (achievement?: AchievementItem | string): string => {
  if (!achievement) return '未知类型'
  
  // 如果传入的是字符串（向后兼容）
  if (typeof achievement === 'string') {
    return typeMap[achievement] || achievement || '未知类型'
  }
  
  // 如果传入的是成果对象，使用getAchievementType获取类型
  const type = getAchievementType(achievement)
  
  // 直接从typeMap中获取映射的中文名称
  if (typeMap[type]) {
    return typeMap[type]
  }
  
  // 如果是中文，直接返回
  if (/[\u4e00-\u9fa5]/.test(type)) {
    return type
  }
  
  // 其他情况返回原值或默认值
  return type || '未知类型'
}

// 获取等级名称 - 改进映射逻辑
const get_level_nm = (level?: string): string => {
  if (!level) return '未知等级'
  
  // 直接匹配映射表
  if (levelMap[level]) {
    return levelMap[level]
  }
  
  // 如果是中文，直接返回
  if (/[\u4e00-\u9fa5]/.test(level)) {
    return level
  }
  
  // 其他情况返回原值或默认值
  return level || '未知等级'
}

// 获取奖项等级名称 - 增强版本（提高容错性）
const get_prize_nm = (prize?: string): string => {
  if (!prize) return ''
  
  // 转换为小写进行匹配（提高容错性）
  const lowerPrize = prize.toLowerCase()
  
  // 直接匹配映射表
  if (prizeMap[prize]) {
    return prizeMap[prize]
  }
  
  // 小写匹配
  if (prizeMap[lowerPrize]) {
    return prizeMap[lowerPrize]
  }
  
  // 如果是中文，直接返回
  if (/[\u4e00-\u9fa5]/.test(prize)) {
    return prize
  }
  
  // 模糊匹配（增强容错性）
  const fuzzyMatch = Object.keys(prizeMap).find(key => 
    key.toLowerCase().includes(lowerPrize) || lowerPrize.includes(key.toLowerCase())
  )
  
  if (fuzzyMatch) {
    return prizeMap[fuzzyMatch]
  }
  
  // 调试信息
  console.warn(`未找到奖项 "${prize}" 的映射，返回原值`)
  
  // 其他情况返回原值
  return prize
}

// 格式化日期显示
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr // 如果无法解析，返回原字符串
    }
    
    // 格式化为 YYYY-MM-DD
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.warn('日期格式化失败:', dateStr, error)
    return dateStr
  }
}

// 获取类型图标 - 支持achievement对象和category字段，增强安全性
const get_type_ic = (achievement?: AchievementItem | string): Component => {
  // 安全检查：确保参数存在
  if (!achievement) {
    console.warn('get_type_ic: achievement参数为空，返回默认图标')
    return FileText
  }
  
  try {
    // 如果传入的是字符串（向后兼容）
    if (typeof achievement === 'string') {
      const icon = iconMap[achievement]
      if (!icon) {
        console.warn(`get_type_ic: 未找到字符串类型 "${achievement}" 对应的图标，使用默认图标`)
        return FileText
      }
      return icon
    }
    
    // 如果传入的是成果对象，使用getAchievementType获取类型
    const type = getAchievementType(achievement)
    if (!type) {
      console.warn('get_type_ic: 无法获取成果类型，使用默认图标')
      return FileText
    }
    
    // 直接从iconMap中获取图标
    if (iconMap[type]) {
      return iconMap[type]
    }
    
    // 如果直接匹配失败，尝试通过typeMap反向查找对应的数字ID
    for (const [key, value] of Object.entries(typeMap)) {
      if (value === type && iconMap[key]) {
        return iconMap[key]
      }
    }
    
    console.warn(`get_type_ic: 未找到类型 "${type}" 对应的图标，使用默认图标`)
    return FileText
  } catch (error) {
    console.error('get_type_ic: 获取图标时发生错误:', error)
    return FileText
  }
}

// 成果收集方法
const collect_achievement = (): void => {
  router.push('/student/achievement-collect')
}

// 规则设置方法
const go_to_settings = (): void => {
  router.push('/student/achievement-settings')
}

// 查看成果详情
const view_achievement_detail = async (id: string): Promise<void> => {
  try {
    console.log('查看成果详情，ID:', id)
    
    // 🎯 在跳转前缓存当前成果数据到sessionStorage
    cache_achievements_data()
    
    // 跳转到详情页
    router.push(`/student/achievement-detail/${id}`)
  } catch (error: unknown) {
    console.error('查看成果详情失败:', error)
    message.error('查看详情失败，请稍后重试')
  }
}

// 🎯 新增：缓存成果数据到sessionStorage
const cache_achievements_data = (): void => {
  try {
    if (achievements.value && achievements.value.length > 0) {
      sessionStorage.setItem('achievements_cache', JSON.stringify(achievements.value))
      console.log('✅ 成果数据已缓存到sessionStorage')
    }
  } catch (error) {
    console.warn('⚠️ 缓存成果数据失败:', error)
  }
}

// 编辑成果
const edit_achievement = (id: string): void => {
  console.log('编辑成果，ID:', id)
  router.push(`/student/achievement-edit/${id}`)
}

// 调试函数 - 测试奖项映射
const debug_prize_mapping = () => {
  console.log('=== 🏆 奖项映射调试信息 ===')
  
  // 测试模拟数据中的奖项
  const testPrizes = ['firstprize', 'secondprize', 'thirdprize', 'honorablemention', 'grandprize', 'other']
  
  testPrizes.forEach(prize => {
    console.log(`奖项: "${prize}" -> "${get_prize_nm(prize)}"`)
  })
  
  // 测试实际数据中的奖项
  achievements.value.forEach((achievement, index) => {
    if (achievement.prize) {
      console.log(`成果 ${index + 1} (${achievement.title}):`)
      console.log(`  原始奖项: "${achievement.prize}"`)
      console.log(`  映射后奖项: "${get_prize_nm(achievement.prize)}"`)
    }
  })
  
  console.log('奖项映射表:', prizeMap)
  console.log('=== 调试信息结束 ===')
}

// 模拟成果数据（仅用于开发测试）
const mockAchievements: AchievementItem[] = [
  {
    id: '1',
    title: '全国大学生数学建模竞赛一等奖',
    type_id: '1',
    year: '2024',
    level: 'international',
    prize: 'firstprize',
    status: 1,
    awardedAt: '2024-10-15',
    date: '2024-10-15'
  },
  {
    id: '2',
    title: '基于AI的智能推荐系统研究',
    type_id: '2',
    year: '2024',
    level: 'provincial',
    prize: 'secondprize',
    status: 1,
    awardedAt: '2024-09-20',
    date: '2024-09-20'
  },
  {
    id: '3',
    title: '校园智能导航小程序开发',
    type_id: '3',
    year: '2023',
    level: 'university',
    prize: 'thirdprize',
    status: 0,
    awardedAt: '2023-12-10',
    date: '2023-12-10'
  },
  {
    id: '4',
    title: '机器学习在教育领域的应用研究',
    type_id: '4',
    year: '2023',
    level: 'provincial',
    prize: 'honorablemention',
    status: 1,
    awardedAt: '2023-11-05',
    date: '2023-11-05'
  },
  {
    id: '5',
    title: '一种基于深度学习的图像识别方法',
    type_id: '5',
    year: '2024',
    level: 'international',
    prize: 'grandprize',
    status: 0,
    awardedAt: '2024-08-15',
    date: '2024-08-15'
  },
  {
    id: '6',
    title: 'CET-6英语六级证书',
    type_id: '6',
    year: '2023',
    level: 'international',
    status: 1,
    awardedAt: '2023-06-20',
    date: '2023-06-20'
  },
  {
    id: '7',
    title: '创新创业大赛参与奖',
    type_id: '1',
    year: '2023',
    level: 'university',
    prize: 'other',
    status: 1,
    awardedAt: '2023-05-10',
    date: '2023-05-10'
  }
]

// 删除成果
const delete_achievement = async (id: string): Promise<void> => {
  try {
    const response = await deleteAchievement(id)
    console.log('删除成果响应:', response)
    message.success('删除成功')
    // 重新获取数据
    await fetchAchievementData()
    
    // 调试数据更新情况
    setTimeout(() => {
      console.log('删除后数据更新情况:')
      debug_data_mapping()
    }, 500)
  } catch (error: unknown) {
    console.error('删除成果失败:', error)
    message.error('删除失败，请稍后重试')
  }
}
</script>

<style scoped>
.achievements_page {
  padding: 15px;
}

.header_card {
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header_area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.title_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title_row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.title_info h2 {
  margin: 0 0 0 10px;
  font-size: 20px;
}

.desc_text {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.action_btns {
  display: flex;
  gap: 12px;
}

.collect_btn {
  background-color: #18a058;
}

.settings_btn {
  color: #2080f0;
}

.stats_area {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.stat_card {
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat_card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat_card.active {
  border-color: #2080f0;
  background-color: rgba(32, 128, 240, 0.05);
}

.stat_content {
  padding: 8px;
}

.stat_num {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat_name {
  font-size: 14px;
  color: #666;
}

/* 不同类型统计卡片的颜色 */
.total_card .stat_num {
  color: #2080f0;
}

.competition_card .stat_num {
  color: #d03050;
}

.research_card .stat_num {
  color: #18a058;
}

.project_card .stat_num {
  color: #f0a020;
}

.paper_card .stat_num {
  color: #8a2be2;
}

.patent_card .stat_num {
  color: #1e90ff;
}

.certificate_card .stat_num {
  color: #ff6b81;
}

.filter_area {
  display: flex;
  margin-bottom: 16px;
}

.search_input {
  width: 300px;
  margin-right: 16px;
}

.filter_select {
  width: 180px;
  margin-right: 16px;
}

.filter_tags {
  margin-bottom: 24px;
}

.filter_btn {
  display: flex;
  align-items: center;
}

.filter_btn.active {
  color: #2080f0;
  background-color: rgba(32, 128, 240, 0.1);
}

.achievement_cards {
  margin-bottom: 24px;
}

.achievement_card {
  height: 100%;
}

.card_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card_type {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.card_type svg {
  margin-right: 4px;
}

.type_1 {
  color: #d03050;
  background-color: rgba(208, 48, 80, 0.1);
}

.type_2 {
  color: #18a058;
  background-color: rgba(24, 160, 88, 0.1);
}

.type_3 {
  color: #f0a020;
  background-color: rgba(240, 160, 32, 0.1);
}

.type_4 {
  color: #8a2be2;
  background-color: rgba(138, 43, 226, 0.1);
}

.type_5 {
  color: #1e90ff;
  background-color: rgba(30, 144, 255, 0.1);
}

.type_6 {
  color: #ff6b81;
  background-color: rgba(255, 107, 129, 0.1);
}

.card_title {
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;
}

.card_info {
  display: flex;
  margin-bottom: 12px;
}

.info_item {
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

.info_item svg {
  margin-right: 4px;
}

.card_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>