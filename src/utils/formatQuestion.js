/** 预览/复制用：统一填空横线长度，提示词保留在横线后（语法填空惯例） */
export const BLANK_DISPLAY = '__________'

function normalizeSpaces(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/([(\[])\s+/g, '$1')
    .replace(/\s+([)\]])/g, '$1')
    .trim()
}

/**
 * 将 ______ / ___ 等统一为固定横线；若有 (word) 则紧跟横线，不挪到句末
 * @param {string} rawQuestion
 * @returns {string}
 */
export function formatQuestionForDisplay(rawQuestion) {
  let q = normalizeSpaces(rawQuestion)

  q = q.replace(/_{2,}\s*(\([^)]{1,40}\))?/g, (_, hint) => {
    if (hint) return `${BLANK_DISPLAY} ${hint}`
    return BLANK_DISPLAY
  })

  q = q.replace(/_{2,}/g, BLANK_DISPLAY)

  return normalizeSpaces(q)
}
