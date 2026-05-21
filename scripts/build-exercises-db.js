/**
 * 合并 exercises.json（600）+ exercises-legacy.json（可选）→ exercises.json
 * 600 题优先；同 point_id + question 去重
 *
 * 用法：
 *   node scripts/build-exercises-db.js
 *   node scripts/build-exercises-db.js --legacy-only
 */
const path = require('path')
const {
  readJsonIfExists,
  writeJson,
  dedupeByQuestion,
  projectRoot
} = require('./lib/exercise-io')

const PRIMARY = path.join(projectRoot, 'src/data/exercises.json')
const LEGACY = path.join(projectRoot, 'src/data/exercises-legacy.json')
const BACKUP = path.join(projectRoot, 'src/data/exercises-600-backup.json')

function main() {
  const legacyOnly = process.argv.includes('--legacy-only')
  const primary = readJsonIfExists(PRIMARY) || []
  const legacy = readJsonIfExists(LEGACY) || []

  if (legacyOnly) {
    if (!legacy.length) {
      console.error('exercises-legacy.json 不存在或为空，请先运行 migrate-legacy-export.js')
      process.exit(1)
    }
    writeJson(PRIMARY, dedupeByQuestion(legacy))
    console.log(`已仅用旧库 ${legacy.length} 条覆盖 ${PRIMARY}`)
    return
  }

  if (!primary.length && !legacy.length) {
    console.error('请先运行 merge-doubao-600.js 生成 600 题')
    process.exit(1)
  }

  if (primary.length && legacy.length) {
    writeJson(BACKUP, primary)
    console.log(`已备份 600 题 → ${BACKUP}`)
  }

  const merged = dedupeByQuestion([...primary, ...legacy])
  writeJson(PRIMARY, merged)
  console.log(`合并完成: 600=${primary.length} legacy=${legacy.length} → 合计 ${merged.length}`)
  console.log(`  输出: ${PRIMARY}`)
}

main()
