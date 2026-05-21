/**
 * Node 端读取知识点树（与 src/config/points.js 保持一致）
 */
const fs = require('fs')
const path = require('path')

const POINTS_FILE = path.join(__dirname, '../../src/config/points.js')

function loadPointTree() {
  const code = fs.readFileSync(POINTS_FILE, 'utf8')
  const match = code.match(/export const pointTree = (\[[\s\S]*\])\s*\n\/\/ 工具函数/)
  if (!match) {
    throw new Error('无法在 points.js 中解析 pointTree')
  }
  // eslint-disable-next-line no-eval
  return eval(`(${match[1]})`)
}

function buildPointIndex(tree) {
  const byId = new Map()
  const validIds = new Set()
  tree.forEach((topic) => {
    topic.children.forEach((point) => {
      validIds.add(point.id)
      byId.set(point.id, {
        point_id: point.id,
        point_name: point.name,
        topic_id: topic.id,
        topic_name: topic.name,
        difficulty: point.difficulty
      })
    })
  })
  return { byId, validIds, tree }
}

function getPointNameById(tree, pointId) {
  for (const topic of tree) {
    const point = topic.children.find((p) => p.id === pointId)
    if (point) return point.name
  }
  return '未知知识点'
}

module.exports = { loadPointTree, buildPointIndex, getPointNameById }
