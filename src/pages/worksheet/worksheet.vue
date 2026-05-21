<template>
  <view class="ws-page">
    <NavBar title="学案生成" :showBack="true" @back="onBack" />
    <view class="ws-page__guide">
      <text class="ws-page__guide-text">{{ usageBlock }}</text>
    </view>
    <view class="ws-page__tabs">
      <view class="ws-page__tab" :class="studentTabCls" @click="onStudentVersion">
        学生版（无解析）
      </view>
      <view class="ws-page__tab" :class="teacherTabCls" @click="onTeacherVersion">
        教师版（带解析）
      </view>
    </view>
    <scroll-view
      class="ws-page__body"
      scroll-y
      lower-threshold="80"
      @scrolltolower="onPreviewScrollLower"
    >
      <text class="ws-page__content">{{ sheetContent }}</text>
      <text v-if="hasMorePreview" class="ws-page__more">上拉加载更多…</text>
    </scroll-view>
    <view class="ws-page__actions">
      <view class="ws-page__btn ws-page__btn--outline" :class="btnDisabledCls" @click="onReturnSelect">
        返回重新选择
      </view>
      <view class="ws-page__btn ws-page__btn--green" :class="btnDisabledCls" @click="onCopy">
        复制当前预览内容
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '../../components/NavBar/NavBar.vue'
import { useSelectionStore } from '@/store/selection.js'
import { showToast } from '@/utils/toast.js'
import { LIMITS } from '@/utils/limits.js'
import { formatQuestionForDisplay } from '@/utils/formatQuestion.js'

const store = useSelectionStore()
const btnDisabled = ref(false)
const previewRenderCount = ref(LIMITS.PREVIEW_LAZY_BATCH)

const usageBlock = computed(() => {
  const q = '"'
  return (
    '使用方式：\n' +
    '1. 点击上方' +
    q +
    '学生版（无解析）' +
    q +
    '或' +
    q +
    '教师版（带解析）' +
    q +
    '切换不同版本的学案；\n' +
    '2. 下滑预览对应版本的内容，若不满意点击下方的' +
    q +
    '返回重新选择' +
    q +
    '；\n' +
    '3. 若满意则点击最下方的' +
    q +
    '复制当前预览内容' +
    q +
    '；\n' +
    '4. 打开Word或其他文档应用进行粘贴使用。'
  )
})

function buildExerciseBlock(ex, index, isTeacher) {
  const head = '练习' + (index + 1) + '：' + ex.point_name + '\n'
  const questionLine = formatQuestionForDisplay(ex.question)
  if (isTeacher) {
    return (
      head +
      '题目：' +
      questionLine +
      '\n答案：' +
      ex.answer +
      '\n解析：' +
      (ex.analysis || '') +
      '\n\n'
    )
  }
  return head + questionLine + '\n\n'
}

const visibleExercises = computed(() => {
  const list = store.exercises || []
  return list.slice(0, previewRenderCount.value)
})

const hasMorePreview = computed(
  () => (store.exercises?.length || 0) > previewRenderCount.value
)

const sheetContent = computed(() => {
  const list = visibleExercises.value
  if (!store.exercises?.length) return '暂无习题，请返回重新选择'
  const isTeacher = store.currentVersion === 'teacher'
  return list.map((ex, i) => buildExerciseBlock(ex, i, isTeacher)).join('')
})

const onPreviewScrollLower = () => {
  if (!hasMorePreview.value) return
  previewRenderCount.value += LIMITS.PREVIEW_LAZY_BATCH
}

const studentTabCls = computed(() =>
  store.currentVersion === 'student' ? 'ws-page__tab--active' : ''
)
const teacherTabCls = computed(() =>
  store.currentVersion === 'teacher' ? 'ws-page__tab--active' : ''
)
const btnDisabledCls = computed(() => (btnDisabled.value ? 'ws-page__btn--disabled' : ''))

const onStudentVersion = () => {
  store.setCurrentVersion('student')
  previewRenderCount.value = LIMITS.PREVIEW_LAZY_BATCH
}
const onTeacherVersion = () => {
  store.setCurrentVersion('teacher')
  previewRenderCount.value = LIMITS.PREVIEW_LAZY_BATCH
}

onMounted(() => {
  if (!store.exercises?.length) {
    showToast('请先生成习题')
    setTimeout(() => uni.navigateBack(), 1500)
  }
})

const modeRouteMap = {
  recommend: '/pages/recommend/recommend',
  topic: '/pages/topic/topic',
  custom: '/pages/custom/custom'
}

const onBack = () => uni.navigateBack()

const guard = (fn) => {
  if (btnDisabled.value) return
  btnDisabled.value = true
  fn()
  setTimeout(() => {
    btnDisabled.value = false
  }, 1500)
}

const onReturnSelect = () => {
  guard(() => {
    const url = modeRouteMap[store.mode] || '/pages/index/index'
    store.restoreFromStorage()
    uni.redirectTo({ url })
  })
}

const buildFullSheet = () => {
  const list = store.exercises || []
  const isTeacher = store.currentVersion === 'teacher'
  return list.map((ex, i) => buildExerciseBlock(ex, i, isTeacher)).join('')
}

const onCopy = () => {
  guard(() => {
    uni.setClipboardData({
      data: buildFullSheet(),
      success: () => showToast('内容已复制到剪贴板')
    })
  })
}
</script>

<style lang="scss" scoped>
.ws-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
}

.ws-page__guide {
  margin: 12px 16px;
  background: #fff;
  border-radius: var(--card-radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card);
}

.ws-page__guide-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
}

.ws-page__tabs {
  display: flex;
  margin: 0 16px 12px;
  background: #fff;
  border-radius: var(--card-radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.ws-page__tab {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  font-size: 14px;
  color: #666;
}

.ws-page__tab--active {
  color: var(--primary);
  font-weight: 600;
  background: rgba(22, 119, 255, 0.08);
}

.ws-page__body {
  flex: 1;
  margin: 0 16px;
  background: #fff;
  border-radius: var(--card-radius-lg);
  padding: 16px;
  min-height: 300px;
  max-height: 50vh;
  box-shadow: var(--shadow-card);
}

.ws-page__content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}

.ws-page__more {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 12px 0;
}

.ws-page__actions {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ws-page__btn {
  text-align: center;
  padding: 14px;
  border-radius: var(--card-radius-sm);
  font-size: 15px;
}

.ws-page__btn--outline {
  background: #fff;
  border: 1px solid #ddd;
  color: #333;
}

.ws-page__btn--green {
  background: var(--green);
  color: #fff;
}

.ws-page__btn--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
