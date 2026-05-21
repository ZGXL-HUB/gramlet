/**
 * 模拟云数据库数据（格式与第三章云函数返回一致）
 * 习题优先从 src/data/exercises.json 加载（由 scripts/merge-doubao-600.js 生成）
 */
import { pointTree, getPointNameById } from '@/config/points.js'
import exercisesJson from '@/data/exercises.json'

/** 扁平化知识点列表（points 集合格式） */
export const mockPointsDb = []

pointTree.forEach((topic) => {
  topic.children.forEach((point) => {
    mockPointsDb.push({
      _id: point.id,
      name: point.name,
      topic_id: topic.id,
      topic_name: topic.name,
      difficulty: point.difficulty,
      frequency: point.frequency
    })
  })
})

function buildPlaceholderExercises() {
  const list = []
  mockPointsDb.forEach((point) => {
    for (let i = 1; i <= 10; i++) {
      list.push({
        _id: `ex_${point._id}_${i}`,
        point_id: point._id,
        point_name: point.name,
        question: `(${point.name}) Sample question ${i}: The student ___ (fill) the blank correctly.`,
        answer: `answer_${i}`,
        analysis: `考点：${point.name}，注意语法规则。`,
        difficulty: point.difficulty
      })
    }
  })
  return list
}

function normalizeLoadedExercise(ex) {
  return {
    _id: ex._id || `ex_${ex.point_id}_${ex.question.slice(0, 12)}`,
    point_id: ex.point_id,
    point_name: ex.point_name || getPointNameById(ex.point_id),
    question: ex.question,
    answer: ex.answer,
    analysis: ex.analysis || '暂无解析',
    difficulty: ex.difficulty ?? 2
  }
}

const loaded =
  Array.isArray(exercisesJson) && exercisesJson.length > 0
    ? exercisesJson.map(normalizeLoadedExercise)
    : []

/** exercises 集合格式（本地 JSON 或占位题） */
export const mockExercisesDb = loaded.length > 0 ? loaded : buildPlaceholderExercises()

if (loaded.length > 0 && typeof console !== 'undefined') {
  console.log(`[mock] 已加载本地题库 ${loaded.length} 道`)
}

/**
 * 将扁平习题转为接口返回格式
 * @param {object} ex
 */
export const formatExercise = (ex) => ({
  id: ex._id,
  point_id: ex.point_id,
  point_name: ex.point_name || getPointNameById(ex.point_id),
  question: ex.question,
  answer: ex.answer,
  analysis: ex.analysis || '暂无解析'
})
