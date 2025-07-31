<template>
  <div class="stastic-container">
    <!-- 顶部横向容器 -->
    <div class="header-container">
      <div class="title-section">
        <h1 class="main-title">学业数据分析大屏</h1>
        <p class="sub-title">实时监控您的学习进度和成果</p>
      </div>
      <div class="info-section">
        <div class="semester-info">{{ currentSemester }}</div>
        <div class="time-info">{{ currentDateTime }}</div>
      </div>
    </div>

    <!-- 四个统计方块 -->
    <div class="stats-grid">
      <div class="stat-card blue-card">
        <div class="stat-icon">
          <component :is="bookIcon" />
        </div>
        <div class="stat-content">
          <div class="stat-title">总学时进度</div>
          <div class="stat-value">{{ studyProgress.current }}/{{ studyProgress.total }}</div>
          <div class="stat-desc">已完成 {{ studyProgress.percent }}%</div>
        </div>
      </div>

      <div class="stat-card green-card">
        <div class="stat-icon">
          <component :is="chartIcon" />
        </div>
        <div class="stat-content">
          <div class="stat-title">平均绩点</div>
          <div class="stat-value">{{ gpa.value }}</div>
          <div class="stat-desc">平均成绩 {{ gpa.percent }}%</div>
        </div>
      </div>

      <div class="stat-card orange-card">
        <div class="stat-icon">
          <component :is="targetIcon" />
        </div>
        <div class="stat-content">
          <div class="stat-title">项目完成率</div>
          <div class="stat-value">{{ projectRate.value }}%</div>
          <div class="stat-desc">共{{ projectRate.total }}个项目已完成</div>
        </div>
      </div>

      <div class="stat-card purple-card">
        <div class="stat-icon">
          <component :is="clockIcon" />
        </div>
        <div class="stat-content">
          <div class="stat-title">本周学习时长</div>
          <div class="stat-value">{{ weeklyStudyTime.value }}</div>
          <div class="stat-desc">总计{{ weeklyStudyTime.total }}小时</div>
        </div>
      </div>
    </div>

    <!-- 三个统计图表 -->
    <div class="charts-container">
      <!-- 学期课程学时进度 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <component :is="clockHour4Icon" />
            学期课程学时进度
          </h3>
          <div class="chart-subtitle">已完成各学期课程学时百分比</div>
        </div>
        <div class="chart-content course-progress-chart">
          <!-- 这里将放置课程学时进度图表 -->
        </div>
      </div>

      <!-- 课程作业进度 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <component :is="fileTextIcon" />
            课程作业进度
          </h3>
          <div class="chart-subtitle">已完成各课程作业百分比</div>
        </div>
        <div class="chart-content assignment-progress-chart">
          <!-- 这里将放置课程作业进度图表 -->
        </div>
      </div>

      <!-- 学习时长统计 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <component :is="chartHistogramIcon" />
            学习时长统计
          </h3>
          <div class="chart-subtitle">各学科学习时长分布</div>
        </div>
        <div class="chart-content study-time-chart">
          <!-- 这里将放置学习时长统计图表 -->
        </div>
      </div>
    </div>

    <!-- 底部统计图表 -->
    <div class="bottom-charts-container">
      <!-- 个人项目进度 -->
      <div class="chart-card project-progress-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <component :is="briefcaseIcon" />
            个人项目进度
          </h3>
          <div class="chart-subtitle">当前进行中的项目完成情况</div>
        </div>
        <div class="chart-content project-progress-chart">
          <!-- 这里将放置个人项目进度图表 -->
        </div>
      </div>

      <!-- 成绩趋势分析 -->
      <div class="chart-card grade-trend-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <component :is="trendingUpIcon" />
            成绩趋势分析
          </h3>
          <div class="chart-subtitle">各学期成绩变化趋势</div>
        </div>
        <div class="chart-content grade-trend-chart">
          <!-- 这里将放置成绩趋势分析图表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue';
import { 
  IconBook, 
  IconChartBar, 
  IconTarget, 
  IconClock,
  IconClockHour4,
  IconFileText,
  IconChartHistogram,
  IconBriefcase,
  IconTrendingUp
} from '@tabler/icons-vue';

// 图标渲染函数
const bookIcon = () => h(IconBook, { size: 24 });
const chartIcon = () => h(IconChartBar, { size: 24 });
const targetIcon = () => h(IconTarget, { size: 24 });
const clockIcon = () => h(IconClock, { size: 24 });
const clockHour4Icon = () => h(IconClockHour4, { size: 24 });
const fileTextIcon = () => h(IconFileText, { size: 24 });
const chartHistogramIcon = () => h(IconChartHistogram, { size: 24 });
const briefcaseIcon = () => h(IconBriefcase, { size: 24 });
const trendingUpIcon = () => h(IconTrendingUp, { size: 24 });

// 当前学期信息
const currentSemester = ref('2023-2024学年第二学期');

// 当前日期时间
const currentDateTime = ref('');
const timer = ref<number | null>(null);

// 更新当前时间
const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  currentDateTime.value = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

// 学时进度数据
const studyProgress = ref({
  current: 240,
  total: 320,
  percent: 75
});

// 平均绩点数据
const gpa = ref({
  value: 3.8,
  percent: 95
});

// 项目完成率数据
const projectRate = ref({
  value: 75,
  total: 8
});

// 本周学习时长数据
const weeklyStudyTime = ref({
  value: '42.7h',
  total: 168
});

// 生命周期钩子
onMounted(() => {
  // 初始化时间显示
  updateDateTime();
  // 设置定时器，每秒更新一次时间
  timer.value = window.setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  // 组件卸载时清除定时器，避免内存泄漏
  if (timer.value !== null) {
    window.clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<style scoped>
.stastic-container {
  width: 100%;
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

/* 顶部容器样式 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin: 0;
}

.sub-title {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.info-section {
  text-align: right;
}

.semester-info {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.time-info {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  color: white;
}

.blue-card {
  background-color: #1890ff;
}

.green-card {
  background-color: #52c41a;
}

.orange-card {
  background-color: #fa8c16;
}

.purple-card {
  background-color: #722ed1;
}

.stat-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 12px;
  opacity: 0.8;
}

/* 图表容器样式 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.bottom-charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.chart-title :deep(svg) {
  margin-right: 8px;
  color: #1890ff;
}

.chart-subtitle {
  font-size: 12px;
  color: #666;
}

.chart-content {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container,
  .bottom-charts-container {
    grid-template-columns: 1fr;
  }
  
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-section {
    text-align: left;
    margin-top: 12px;
  }
}
</style>