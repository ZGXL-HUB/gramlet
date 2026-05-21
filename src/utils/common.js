/**
 * 题量分配算法（与第四章约定版本一致）
 * @param {number} total 总题数
 * @param {Array<{id: string}>} points 知识点列表
 * @returns {Array<{id: string, count: number}>}
 */
export function distributeQuestions(total, points) {
  if (total <= 0 || points.length === 0) return []
  if (total < points.length) {
    const shuffled = [...points].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, total).map((p) => ({ id: p.id, count: 1 }))
  }
  const base = Math.floor(total / points.length)
  const remainder = total % points.length
  const result = points.map((p) => ({ id: p.id, count: base }))
  const indices = Array.from({ length: points.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, remainder)
  indices.forEach((i) => {
    result[i].count += 1
  })
  return result
}

/**
 * 防重复点击：触发后禁用 1.5 秒
 * @param {Function} fn 点击回调
 * @param {number} delay 禁用时长（毫秒）
 * @returns {Function}
 */
export function useDebouncedClick(fn, delay = 1500) {
  let locked = false
  return (...args) => {
    if (locked) return
    locked = true
    fn(...args)
    setTimeout(() => {
      locked = false
    }, delay)
  }
}

/**
 * 创建可响应的按钮禁用状态（组合式 API 页面内使用）
 * @returns {{ disabled: import('vue').Ref<boolean>, run: Function }}
 */
export function createClickGuard() {
  const disabled = { value: false }
  const run = (fn) => {
    if (disabled.value) return
    disabled.value = true
    fn()
    setTimeout(() => {
      disabled.value = false
    }, 1500)
  }
  return { disabled, run }
}
