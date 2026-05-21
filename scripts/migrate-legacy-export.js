/**
 * 旧云库 NDJSON 导出 → V2.0 格式 exercises-legacy.json + 未匹配报告
 *
 * 用法：
 *   node scripts/migrate-legacy-export.js
 *   node scripts/migrate-legacy-export.js "C:\Users\19772\Desktop\database_export-xxx.json"
 */
const fs = require('fs')
const path = require('path')
const { resolvePointId } = require('./lib/category-to-point')
const { loadPointTree, buildPointIndex, getPointNameById } = require('./lib/points-meta')
const {
  writeJson,
  readNdjson,
  normalizeExercise,
  dedupeByQuestion,
  projectRoot
} = require('./lib/exercise-io')

const DEFAULT_INPUT = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'database_export-cSSmO40y2S4k.json'
)
const OUT_LEGACY = path.join(projectRoot, 'src/data/exercises-legacy.json')
const OUT_REPORT = path.join(projectRoot, 'src/data/migrate-legacy-report.json')

function main() {
  const inputPath = process.argv[2] || DEFAULT_INPUT
  if (!fs.existsSync(inputPath)) {
    console.error(`找不到导出文件: ${inputPath}`)
    process.exit(1)
  }

  const tree = loadPointTree()
  const { byId: metaByPointId } = buildPointIndex(tree)
  const rows = readNdjson(inputPath)

  const migrated = []
  const skipped = []
  const categoryStats = {}

  for (const row of rows) {
    const category = row.category || ''
    const grammarPoint = row.grammarPoint || ''
    const point_id = resolvePointId(category, grammarPoint)

    categoryStats[category] = categoryStats[category] || { total: 0, mapped: 0, skipped: 0 }
    categoryStats[category].total++

    if (!point_id) {
      categoryStats[category].skipped++
      skipped.push({
        _id: row._id,
        category,
        grammarPoint,
        text: (row.text || '').slice(0, 80)
      })
      continue
    }

    categoryStats[category].mapped++
    const raw = {
      _id: row._id,
      point_id,
      point_name: getPointNameById(tree, point_id),
      question: row.text,
      answer: row.answer,
      analysis: row.analysis,
      legacy_category: category
    }

    const result = normalizeExercise(raw, metaByPointId, 'legacy')
    if (!result.ok) {
      skipped.push({
        _id: row._id,
        category,
        reason: result.reason,
        text: (row.text || '').slice(0, 80)
      })
      continue
    }
    migrated.push(result.exercise)
  }

  const deduped = dedupeByQuestion(migrated)
  const report = {
    input: inputPath,
    totalRows: rows.length,
    migrated: deduped.length,
    skipped: skipped.length,
    categoryStats: Object.entries(categoryStats)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([category, s]) => ({ category, ...s })),
    skippedSample: skipped.slice(0, 50)
  }

  writeJson(OUT_LEGACY, deduped)
  writeJson(OUT_REPORT, report)

  console.log('\n迁移完成')
  console.log(`  输入: ${rows.length} 条`)
  console.log(`  成功: ${deduped.length} 条 → ${OUT_LEGACY}`)
  console.log(`  跳过: ${skipped.length} 条 → 见 ${OUT_REPORT}`)
  console.log(
    `  映射率: ${((deduped.length / rows.length) * 100).toFixed(1)}%`
  )
}

main()
