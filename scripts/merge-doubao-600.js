/**
 * 从豆包对话 txt 合并 600 题 → src/data/exercises.json
 *
 * 用法：
 *   node scripts/merge-doubao-600.js
 *   node scripts/merge-doubao-600.js "C:\path\file1.txt" "C:\path\file2.txt"
 *
 * 默认读取桌面 和豆包的对话_0520(13)–(18).txt
 */
const fs = require('fs')
const path = require('path')
const { loadPointTree, buildPointIndex } = require('./lib/points-meta')
const { writeJson, normalizeExercise, dedupeByQuestion, projectRoot } = require('./lib/exercise-io')
const { extractFromText } = require('./lib/parse-doubao-line')

const DEFAULT_INPUTS = [
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(13).txt'),
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(14).txt'),
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(15).txt'),
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(16).txt'),
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(17).txt'),
  path.join(process.env.USERPROFILE || '', 'Desktop', '和豆包的对话_0520(18).txt')
]

const OUT_FILE = path.join(projectRoot, 'src/data/exercises.json')

function main() {
  const inputPaths = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_INPUTS
  const { byId: metaByPointId, validIds } = buildPointIndex(loadPointTree())

  const rawItems = []
  for (const file of inputPaths) {
    if (!fs.existsSync(file)) {
      console.warn(`跳过（不存在）: ${file}`)
      continue
    }
    const text = fs.readFileSync(file, 'utf8')
    const found = extractFromText(text)
    console.log(`${path.basename(file)}: 解析 ${found.length} 条`)
    rawItems.push(...found)
  }

  if (rawItems.length === 0) {
    console.error('未解析到任何题目，请检查 txt 路径')
    process.exit(1)
  }

  const exercises = []
  const errors = []
  rawItems.forEach((raw, i) => {
    const result = normalizeExercise(raw, metaByPointId, 'doubao600')
    if (!result.ok) {
      errors.push({ index: i + 1, reason: result.reason, raw })
      return
    }
    exercises.push(result.exercise)
  })

  const deduped = dedupeByQuestion(exercises)
  const byPoint = {}
  deduped.forEach((ex) => {
    byPoint[ex.point_id] = (byPoint[ex.point_id] || 0) + 1
  })

  const missingPoints = [...validIds].filter((id) => !byPoint[id])

  writeJson(OUT_FILE, deduped)

  console.log('\n合并完成')
  console.log(`  输出: ${OUT_FILE}`)
  console.log(`  原始: ${rawItems.length}  去重后: ${deduped.length}  失败: ${errors.length}`)
  if (missingPoints.length) {
    console.log(`  缺少题目的知识点 (${missingPoints.length}): ${missingPoints.join(', ')}`)
  }
  if (errors.length) {
    console.log('  前 3 条失败:', errors.slice(0, 3))
    process.exit(1)
  }
}

main()
