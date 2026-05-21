/**
 * 微信云开发工具类（与第四章一致，第四章对接时替换云环境 ID）
 */
import { showToast, showLoading, hideLoading } from './toast'

let cloudInited = false

const initCloud = () => {
  // #ifdef MP-WEIXIN
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    return false
  }
  if (!cloudInited) {
    wx.cloud.init({
      env: '你的云环境ID',
      traceUser: true
    })
    cloudInited = true
  }
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

/**
 * 调用云函数
 * @param {string} name 云函数名
 * @param {object} data 入参
 * @param {boolean} showLoadingFlag 是否显示加载
 * @returns {Promise<{code: number, message?: string, data?: *}>}
 */
const callFunction = async (name, data = {}, showLoadingFlag = true) => {
  if (!initCloud()) {
    showToast('微信版本过低，请升级')
    return { code: -1, message: '微信版本过低' }
  }

  try {
    if (showLoadingFlag) showLoading('加载中...')

    const res = await wx.cloud.callFunction({ name, data })

    if (showLoadingFlag) hideLoading()

    const result = res.result || {}
    if (result.code !== 0) {
      showToast('网络异常，请重试')
      return { code: -1, message: result.message || '网络异常' }
    }

    if (result.data?.hasSupplement) {
      showToast('部分知识点题量不足，已为您补充同类型题目')
    }

    return result
  } catch (err) {
    if (showLoadingFlag) hideLoading()
    console.error(`云函数${name}调用失败：`, err)
    showToast('网络异常，请重试')
    return { code: -1, message: '网络异常，请重试' }
  }
}

export default {
  initCloud,
  callFunction
}
