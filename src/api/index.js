/**
 * API 接口层（第一批使用模拟数据，第四章替换为云函数）
 */
import cloud from '@/utils/cloud.js'
import { withApiGuard } from '@/utils/apiHelper.js'
import * as mockApi from './mock.js'

/** true=模拟接口，false=云函数（第四章对接时切换） */
export const USE_MOCK = true

export const getRandomPoints = (count = 10, excludeIds = [], topicId = null, options = {}) => {
  if (!USE_MOCK) {
    return cloud.callFunction('getRandomPoints', { count, excludeIds, topicId }, options.showLoading !== false)
  }
  return withApiGuard(() => mockApi.getRandomPoints(count, excludeIds, topicId), options)
}

export const getAllTopics = (options = {}) => {
  if (!USE_MOCK) {
    return cloud.callFunction('getAllTopics', {}, options.showLoading !== false)
  }
  return withApiGuard(() => mockApi.getAllTopics(), options)
}

/**
 * 统一习题生成接口
 * @param {object} params { mode, random_order, questions }
 */
export const getExercises = (params, options = {}) => {
  if (!USE_MOCK) {
    const { questions, random_order, variant_count } = params
    const data = { questions, random_order }
    if (variant_count !== undefined) data.variant_count = variant_count
    return cloud.callFunction(
      'getExercisesByPoints',
      data,
      options.showLoading !== false
    )
  }
  return withApiGuard(() => mockApi.getExercises(params), {
    loadingText: '生成习题中...',
    ...options
  })
}

/** 第四章兼容别名 */
export const getExercisesByPoints = (questions, randomOrder = true) =>
  getExercises({ questions, random_order: randomOrder })
