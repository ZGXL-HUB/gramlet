/**
 * 选题全局状态（与第四章兼容，mode 枚举为 recommend|topic|custom）
 */
import { defineStore } from 'pinia'
import {
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  STORAGE_KEY
} from '@/utils/storage.js'
import { getPointNameById, getTopicById } from '@/config/points.js'
import {
  LIMITS,
  getModeMaxTotal,
  getRecommendPerPointCount,
  canConfirmByMode
} from '@/utils/limits.js'
import { getRandomPoints } from '@/api/index.js'

export const useSelectionStore = defineStore('selection', {
  state: () => ({
    mode: '',
    selectedPoints: [],
    totalCount: 0,
    variantCount: 0,
    selectedTopic: null,
    exercises: [],
    currentVersion: 'student',
    randomOrder: true
  }),

  getters: {
    hasSelection: (state) => state.selectedPoints.length > 0,
    isPointSelected: (state) => (pointId) =>
      state.selectedPoints.some((p) => p.id === pointId),
    canConfirm: (state) => canConfirmByMode(state),
    modeMaxTotal: (state) => getModeMaxTotal(state.mode),
    isPerPointMax: (state) => (pointId) => {
      const p = state.selectedPoints.find((item) => item.id === pointId)
      return p ? p.count >= LIMITS.PER_POINT_MAX : false
    },
    wouldExceedTotal: (state) => (addCount = 1) =>
      state.totalCount + addCount > getModeMaxTotal(state.mode)
  },

  actions: {
    setMode(mode) {
      this.mode = mode
      this.clearSelection(false)
      this.syncToStorage()
    },

    addPoint(point) {
      if (!point?.id) return false

      const addCount = point.count ?? 1
      if (this.wouldExceedTotal(addCount)) return false

      const existing = this.selectedPoints.find((p) => p.id === point.id)
      if (existing) {
        return this.updatePointCount(point.id, existing.count + addCount)
      }

      const count = addCount
      const topic = point.topicId ? getTopicById(point.topicId) : null

      this.selectedPoints.push({
        id: point.id,
        name: point.name || getPointNameById(point.id),
        count,
        topicId: point.topicId || '',
        topicName: point.topicName || topic?.name || '',
        difficulty: point.difficulty ?? 2
      })
      this.totalCount += count
      this.syncToStorage()
      return true
    },

    removePoint(pointId) {
      const index = this.selectedPoints.findIndex((p) => p.id === pointId)
      if (index === -1) return

      this.totalCount -= this.selectedPoints[index].count
      this.selectedPoints.splice(index, 1)
      this.syncToStorage()
    },

    updatePointCount(pointId, count) {
      const point = this.selectedPoints.find((p) => p.id === pointId)
      if (!point) return false

      const safeCount = Math.max(0, Math.min(LIMITS.PER_POINT_MAX, Number(count) || 0))
      const diff = safeCount - point.count

      if (safeCount === 0) {
        this.removePoint(pointId)
        return true
      }

      if (diff > 0 && this.totalCount + diff > getModeMaxTotal(this.mode)) {
        return false
      }

      point.count = safeCount
      this.totalCount += diff
      this.syncToStorage()
      return true
    },

    /** 推荐模式：应用变式后校验总题数 ≤40 */
    applyRecommendVariantCounts(variantCount) {
      const perPoint = getRecommendPerPointCount(variantCount)
      const total = this.selectedPoints.length * perPoint
      if (total > LIMITS.RECOMMEND_MAX_TOTAL) return false
      this.selectedPoints.forEach((p) => {
        p.count = perPoint
      })
      this.totalCount = total
      this.variantCount = Math.min(LIMITS.VARIANT_MAX, variantCount)
      this.syncToStorage()
      return true
    },

    clearSelection(clearMode = true) {
      this.selectedPoints = []
      this.totalCount = 0
      this.exercises = []
      this.variantCount = 0
      this.selectedTopic = null
      if (clearMode) {
        this.mode = ''
      }
      removeStorageSync(STORAGE_KEY)
    },

    setVariantCount(count) {
      this.variantCount = Math.max(0, Math.min(3, Number(count) || 0))
      this.syncToStorage()
    },

    setSelectedTopic(topic) {
      this.selectedTopic = topic
      this.syncToStorage()
    },

    setExercises(exercises) {
      this.exercises = exercises || []
      this.syncToStorage()
    },

    setCurrentVersion(version) {
      this.currentVersion = version === 'teacher' ? 'teacher' : 'student'
      this.syncToStorage()
    },

    setRandomOrder(value) {
      this.randomOrder = !!value
      this.syncToStorage()
    },

    /** 系统推荐：初始化 10 个知识点 */
    async initRecommendPoints() {
      const res = await getRandomPoints(10)
      if (res.code === 0) {
        this.selectedPoints = res.data.map((p) => ({ ...p, count: 1 }))
        this.totalCount = 10
        this.syncToStorage()
      }
      return res
    },

    /** 系统推荐：补抽 1 个（先同专题，失败则跨专题） */
    async supplementPoint(preferTopicId) {
      const excludeIds = this.selectedPoints.map((p) => p.id)
      let res = await getRandomPoints(1, excludeIds, preferTopicId)
      if (res.code !== 0) {
        res = await getRandomPoints(1, excludeIds, null)
      }
      if (res.code === 0 && res.data[0]) {
        this.addPoint({ ...res.data[0], count: 1 })
        return res.data[0]
      }
      return null
    },

    /** 取消选中并补抽，保持推荐模式 10 题 */
    async deselectAndSupplement(pointId) {
      const point = this.selectedPoints.find((p) => p.id === pointId)
      if (!point) return
      const topicId = point.topicId
      this.removePoint(pointId)
      await this.supplementPoint(topicId)
    },

    restoreFromStorage() {
      const data = getStorageSync(STORAGE_KEY)
      if (!data) return

      this.mode = data.mode ?? ''
      this.selectedPoints = data.selectedPoints ?? []
      this.totalCount = data.totalCount ?? 0
      this.variantCount = data.variantCount ?? 0
      this.selectedTopic = data.selectedTopic ?? null
      this.exercises = data.exercises ?? []
      this.currentVersion = data.currentVersion ?? 'student'
      this.randomOrder = data.randomOrder !== false
    },

    syncToStorage() {
      setStorageSync(STORAGE_KEY, {
        mode: this.mode,
        selectedPoints: this.selectedPoints,
        totalCount: this.totalCount,
        variantCount: this.variantCount,
        selectedTopic: this.selectedTopic,
        exercises: this.exercises,
        currentVersion: this.currentVersion,
        randomOrder: this.randomOrder
      })
    }
  }
})
