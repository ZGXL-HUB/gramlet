/**
 * 构建后确保 config/limits.js 存在（兼容微信热重载对旧路径的引用）
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '../dist/build/mp-weixin')
const shim = path.join(root, 'config/limits.js')
const utils = path.join(root, 'utils/limits.js')

if (!fs.existsSync(utils)) {
  console.warn('[postbuild] utils/limits.js 不存在，跳过 shim')
  process.exit(0)
}

fs.mkdirSync(path.dirname(shim), { recursive: true })
fs.writeFileSync(
  shim,
  '"use strict";module.exports=require("../utils/limits.js");\n',
  'utf8'
)
console.log('[postbuild] 已写入 config/limits.js shim')
