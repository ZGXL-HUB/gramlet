/** 全局 Toast / Loading 控制器（由 App.vue 注册） */

let toastHandler = null
let loadingHandler = null

export const registerToast = (handler) => {
  toastHandler = handler
}

export const registerLoading = (handler) => {
  loadingHandler = handler
}

/**
 * 显示全局 Toast，时长 2000ms
 * @param {string} message
 */
export const showToast = (message) => {
  if (toastHandler) {
    toastHandler(message)
    return
  }
  uni.showToast({ title: message, icon: 'none', duration: 2000 })
}

/**
 * 显示全局 Loading
 * @param {string} text
 */
export const showLoading = (text = '加载中...') => {
  if (loadingHandler) {
    loadingHandler(true, text)
    return
  }
  uni.showLoading({ title: text, mask: true })
}

/**
 * 隐藏全局 Loading
 */
export const hideLoading = () => {
  if (loadingHandler) {
    loadingHandler(false)
    return
  }
  uni.hideLoading()
}
