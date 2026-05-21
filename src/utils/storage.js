/** 本地存储封装，tempSelection 24 小时过期 */
const STORAGE_KEY = 'tempSelection'
const EXPIRE_MS = 24 * 60 * 60 * 1000

/**
 * 写入缓存（tempSelection 自动附带时间戳）
 * @param {string} key
 * @param {*} data
 */
export const setStorageSync = (key, data) => {
  if (key === STORAGE_KEY) {
    uni.setStorageSync(STORAGE_KEY, {
      data,
      timestamp: Date.now()
    })
    return
  }
  uni.setStorageSync(key, data)
}

/**
 * 读取缓存，过期返回 null
 * @param {string} key
 * @returns {*|null}
 */
export const getStorageSync = (key) => {
  if (key !== STORAGE_KEY) {
    return uni.getStorageSync(key) || null
  }

  const raw = uni.getStorageSync(STORAGE_KEY)
  if (!raw || !raw.timestamp) return null

  if (Date.now() - raw.timestamp > EXPIRE_MS) {
    removeStorageSync(STORAGE_KEY)
    return null
  }

  return raw.data || null
}

/**
 * 删除缓存
 * @param {string} key
 */
export const removeStorageSync = (key) => {
  uni.removeStorageSync(key)
}

/**
 * 进入首页时检查：若缓存已过期则清除并返回 true
 */
export const purgeExpiredCacheIfNeeded = () => {
  const raw = uni.getStorageSync(STORAGE_KEY)
  if (!raw || !raw.timestamp) return false
  if (Date.now() - raw.timestamp > EXPIRE_MS) {
    removeStorageSync(STORAGE_KEY)
    return true
  }
  return false
}

export { STORAGE_KEY, EXPIRE_MS }
