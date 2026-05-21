/**
 * 解析豆包导出的单行题目（兼容 analysis： 中文冒号、analysis 内未转义引号）
 */

function fixCommonTypos(line) {
  return line.replace(/"analysis："/g, '"analysis":"')
}

function extractBetween(line, startMarker, endMarker) {
  const start = line.indexOf(startMarker)
  if (start === -1) return null
  const from = start + startMarker.length
  const end = line.indexOf(endMarker, from)
  if (end === -1) return null
  return line.slice(from, end)
}

function parseDoubaoLine(line) {
  let trimmed = line.trim()
  if (!trimmed.startsWith('{')) return null
  trimmed = trimmed.replace(/,\s*$/, '')

  try {
    return JSON.parse(trimmed)
  } catch {
    // continue
  }

  const fixed = fixCommonTypos(trimmed)
  try {
    return JSON.parse(fixed)
  } catch {
    // regex fallback
  }

  const point_id = extractBetween(fixed, '"point_id":"', '"')
  const point_name = extractBetween(fixed, '"point_name":"', '","question":"')
  const question = extractBetween(fixed, '"question":"', '","answer":"')
  const answer = extractBetween(fixed, '"answer":"', '","analysis":"')
  let analysis = extractBetween(fixed, '"analysis":"', '"},')
  if (analysis == null) {
    const aStart = fixed.indexOf('"analysis":"')
    if (aStart === -1) return null
    let rest = fixed.slice(aStart + '"analysis":"'.length)
    if (rest.endsWith('}')) rest = rest.slice(0, -1)
    if (rest.endsWith('"')) rest = rest.slice(0, -1)
    analysis = rest
  }

  if (!point_id || !question || !answer) return null

  return {
    point_id,
    point_name: point_name || '',
    question,
    answer,
    analysis: analysis || ''
  }
}

function extractFromText(text) {
  const items = []
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim().startsWith('{')) continue
    const obj = parseDoubaoLine(line)
    if (obj && obj.point_id) items.push(obj)
  }
  if (items.length > 0) return items

  const markerIdx = text.indexOf('豆包')
  let start = markerIdx >= 0 ? text.indexOf('[', markerIdx) : text.indexOf('[')
  if (start === -1) return []
  const slice = text.slice(start)
  const end = slice.lastIndexOf(']')
  if (end === -1) return []
  try {
    const arr = JSON.parse(slice.slice(0, end + 1))
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

module.exports = { parseDoubaoLine, extractFromText, fixCommonTypos }
