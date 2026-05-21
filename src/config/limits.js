/**
 * 兼容层：微信开发者工具热重载仍会追踪 config/limits.js，实际逻辑在 utils/limits.js
 */
export {
  LIMITS,
  getModeMaxTotal,
  getRecommendPerPointCount,
  getCountInputMax,
  canConfirmByMode
} from '../utils/limits.js'
