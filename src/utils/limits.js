/** 全局边界常量（与第一章、第四章一致） */
export const LIMITS = {
  PER_POINT_MAX: 10,
  RECOMMEND_POINT_COUNT: 10,
  RECOMMEND_MAX_TOTAL: 40,
  TOPIC_MAX_TOTAL: 100,
  CUSTOM_MAX_TOTAL: 100,
  VARIANT_MAX: 3,
  VIRTUAL_SCROLL_THRESHOLD: 50,
  PREVIEW_LAZY_BATCH: 20
}

/**
 * 当前模式下的总题数上限
 * @param {string} mode
 */
export function getModeMaxTotal(mode) {
  if (mode === 'recommend') return LIMITS.RECOMMEND_MAX_TOTAL
  if (mode === 'topic') return LIMITS.TOPIC_MAX_TOTAL
  if (mode === 'custom') return LIMITS.CUSTOM_MAX_TOTAL
  return LIMITS.CUSTOM_MAX_TOTAL
}

/**
 * 推荐模式单知识点题量（含变式）
 * @param {number} variantCount
 */
export function getRecommendPerPointCount(variantCount) {
  return 1 + Math.min(LIMITS.VARIANT_MAX, Math.max(0, variantCount || 0))
}

/**
 * 题量输入框上限（按模式）
 * @param {string} mode
 */
export function getCountInputMax(mode) {
  return getModeMaxTotal(mode)
}

/**
 * 是否可点击「我选好了」
 * @param {object} state store 快照
 */
export function canConfirmByMode(state) {
  if (state.mode === 'topic') return !!state.selectedTopic
  if (state.mode === 'recommend' || state.mode === 'custom') {
    return state.totalCount > 0 && state.selectedPoints.length > 0
  }
  return false
}
