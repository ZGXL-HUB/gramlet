/**
 * 模拟接口（返回格式与第三章云函数完全一致）
 */
import { pointTree } from '@/config/points.js'
import { mockPointsDb, mockExercisesDb, formatExercise } from './mockData.js'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

/**
 * 随机抽取知识点（不同专题最多 1 个）
 * @param {number} count
 * @param {string[]} excludeIds
 * @param {string|null} topicId
 */
const toPointDto = (p) => ({
  id: p._id,
  name: p.name,
  topicId: p.topic_id,
  topicName: p.topic_name,
  difficulty: p.difficulty
})

/**
 * 单条随机补抽（优先同专题，不足则跨专题）
 */
const pickOnePoint = (excludeIds, topicId = null) => {
  let pool = mockPointsDb.filter((p) => !excludeIds.includes(p._id))
  if (topicId) {
    const topicPool = pool.filter((p) => p.topic_id === topicId)
    if (topicPool.length > 0) pool = topicPool
  }
  if (pool.length === 0) return null
  return toPointDto(pool[Math.floor(Math.random() * pool.length)])
}

export const getRandomPoints = async (count = 10, excludeIds = [], topicId = null) => {
  await delay()

  // 补抽单条：优先同专题，无则跨专题
  if (count === 1) {
    const picked = pickOnePoint(excludeIds, topicId)
    if (!picked) {
      return { code: -1, message: '题库知识点不足，仅剩0个' }
    }
    return { code: 0, message: 'success', data: [picked] }
  }

  let pool = mockPointsDb.filter((p) => !excludeIds.includes(p._id))
  if (topicId) {
    pool = pool.filter((p) => p.topic_id === topicId)
  }

  if (pool.length < count) {
    return {
      code: -1,
      message: `题库知识点不足，仅剩${pool.length}个`
    }
  }

  const topicGroups = {}
  pool.forEach((point) => {
    if (!topicGroups[point.topic_id]) topicGroups[point.topic_id] = []
    topicGroups[point.topic_id].push(point)
  })

  const topicIds = Object.keys(topicGroups)
  const selectedPoints = []
  const usedTopics = new Set()

  while (selectedPoints.length < count && usedTopics.size < topicIds.length) {
    const randomTopicIndex = Math.floor(Math.random() * topicIds.length)
    const tid = topicIds[randomTopicIndex]
    if (usedTopics.has(tid)) continue
    usedTopics.add(tid)

    const topicPoints = topicGroups[tid]
    const selectedPoint = topicPoints[Math.floor(Math.random() * topicPoints.length)]
    selectedPoints.push(toPointDto(selectedPoint))
  }

  if (selectedPoints.length < count) {
    return {
      code: -1,
      message: `题库知识点不足，仅剩${selectedPoints.length}个`
    }
  }

  return {
    code: 0,
    message: 'success',
    data: selectedPoints
  }
}

/**
 * 获取所有专题及下属知识点
 */
export const getAllTopics = async () => {
  await delay(100)
  const data = pointTree.map((topic) => ({
    id: topic.id,
    name: topic.name,
    frequency: topic.frequency,
    children: topic.children.map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: p.difficulty,
      frequency: p.frequency,
      topicId: topic.id,
      topicName: topic.name
    }))
  }))
  return { code: 0, message: 'success', data }
}

/**
 * 根据选题参数获取习题（与 getExercisesByPoints 云函数返回一致）
 * @param {object} params { mode, random_order, questions: [{ point_id, count }] }
 */
export const getExercises = async (params = {}) => {
  await delay(300)

  const { questions = [], random_order = true } = params
  const allExercises = []
  let hasSupplement = false

  for (const item of questions) {
    const { point_id, count } = item
    if (!point_id || count <= 0) continue

    let pointExercises = mockExercisesDb.filter((ex) => ex.point_id === point_id)

    if (pointExercises.length < count) {
      hasSupplement = true
      const pointMeta = mockPointsDb.find((p) => p._id === point_id)
      if (pointMeta) {
        const sameTopicIds = mockPointsDb
          .filter(
            (p) =>
              p.topic_id === pointMeta.topic_id &&
              p.difficulty === pointMeta.difficulty &&
              p._id !== point_id
          )
          .map((p) => p._id)

        const supplement = mockExercisesDb.filter((ex) =>
          sameTopicIds.includes(ex.point_id)
        )
        pointExercises = pointExercises.concat(supplement)
      }
    }

    const shuffled = shuffle(pointExercises)
    const selected = shuffled.slice(0, count).map(formatExercise)
    allExercises.push(...selected)
  }

  const finalList = random_order ? shuffle(allExercises) : allExercises

  return {
    code: 0,
    message: hasSupplement
      ? '部分知识点题量不足，已为您补充同类型题目'
      : 'success',
    data: {
      exercises: finalList,
      hasSupplement
    }
  }
}
