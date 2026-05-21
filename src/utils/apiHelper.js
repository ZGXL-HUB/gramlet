/**
 * 统一接口异常处理：保证 Loading 关闭、失败 Toast、不篡改页面状态
 */
import { showToast, showLoading, hideLoading } from './toast.js'

const NETWORK_MSG = '网络异常，请重试'
const SUPPLEMENT_MSG = '部分知识点题量不足，已为您补充同类型题目'

/**
 * @param {() => Promise<{code: number, message?: string, data?: *}>} requestFn
 * @param {{ showLoading?: boolean, loadingText?: string }} options
 */
export async function withApiGuard(requestFn, options = {}) {
  const { showLoading: useLoading = true, loadingText = '加载中...' } = options

  try {
    if (useLoading) showLoading(loadingText)
    const res = await requestFn()
    if (useLoading) hideLoading()

    if (!res || res.code !== 0) {
      const msg = res?.message
      showToast(msg && !msg.includes('网络异常') ? msg : NETWORK_MSG)
      return res || { code: -1, message: NETWORK_MSG }
    }

    if (res.data?.hasSupplement) {
      showToast(SUPPLEMENT_MSG)
    }

    return res
  } catch (err) {
    if (useLoading) hideLoading()
    console.error('接口调用异常：', err)
    showToast(NETWORK_MSG)
    return { code: -1, message: NETWORK_MSG }
  }
}
