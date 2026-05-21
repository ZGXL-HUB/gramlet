/**
 * 校验豆包/ GPT 导出的题目 JSON（在项目根目录执行）
 * 用法：node scripts/validate-questions.js path/to/questions.json
 */
const fs = require('fs')

const file = process.argv[2]
if (!file) {
  console.error('请传入 JSON 文件路径')
  process.exit(1)
}

const raw = fs.readFileSync(file, 'utf8')
let data
try {
  data = JSON.parse(raw)
} catch (e) {
  console.error('JSON 解析失败:', e.message)
  process.exit(1)
}

if (!Array.isArray(data)) {
  console.error('根节点必须是数组')
  process.exit(1)
}

const required = ['point_id', 'point_name', 'question', 'answer', 'analysis']
let ok = true
data.forEach((item, i) => {
  required.forEach((key) => {
    if (item[key] === undefined || item[key] === '') {
      console.error(`第 ${i + 1} 条缺少字段: ${key}`)
      ok = false
    }
  })
})

if (ok) {
  console.log(`校验通过，共 ${data.length} 道题`)
} else {
  process.exit(1)
}
