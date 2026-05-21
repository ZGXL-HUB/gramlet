const fs = require('fs')
const path = require('path')

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function writeJson(filePath, data) {
  ensureDir(filePath)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 0), 'utf8')
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readNdjson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').trim()
  if (!text) return []
  return text.split(/\r?\n/).map((line, i) => {
    try {
      return JSON.parse(line)
    } catch (e) {
      throw new Error(`${filePath} 第 ${i + 1} 行 JSON 无效: ${e.message}`)
    }
  })
}

function normalizeExercise(raw, metaByPointId, sourceTag) {
  const point_id = raw.point_id
  if (!point_id || !metaByPointId.has(point_id)) {
    return { ok: false, reason: 'invalid_point_id', raw }
  }
  const meta = metaByPointId.get(point_id)
  const question = (raw.question || raw.text || '').trim()
  const answer = (raw.answer || '').trim()
  const analysis = (raw.analysis || '').trim()
  if (!question || !answer) {
    return { ok: false, reason: 'empty_question_or_answer', raw }
  }
  return {
    ok: true,
    exercise: {
      _id: raw._id || `${sourceTag}_${point_id}_${hash(question)}`,
      point_id,
      point_name: raw.point_name || meta.point_name,
      question,
      answer,
      analysis: analysis || '暂无解析',
      difficulty: raw.difficulty ?? meta.difficulty,
      source: sourceTag,
      legacy_category: raw.legacy_category || undefined
    }
  }
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h.toString(16)
}

function dedupeByQuestion(exercises) {
  const seen = new Set()
  const out = []
  for (const ex of exercises) {
    const key = `${ex.point_id}\n${ex.question}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(ex)
  }
  return out
}

module.exports = {
  writeJson,
  readJsonIfExists,
  readNdjson,
  normalizeExercise,
  dedupeByQuestion,
  projectRoot: path.join(__dirname, '../..')
}
