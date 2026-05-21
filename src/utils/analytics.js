/**
 * 埋点工具类（第四章对接云函数 reportAnalytics）
 */
import cloud from './cloud'

const report = async (eventName, data = {}) => {
  try {
    cloud.callFunction(
      'reportAnalytics',
      {
        event_name: eventName,
        data,
        time: Date.now()
      },
      false
    )
  } catch (err) {
    console.error('埋点上报失败：', err)
  }
}

export const reportPageView = (pageName) => {
  report('page_view', { page_name: pageName })
}

export const reportModeSelect = (mode) => {
  report('mode_select', { mode })
}

export const reportPointSelect = (pointId, pointName, count) => {
  report('point_select', { point_id: pointId, point_name: pointName, count })
}

export const reportWorksheetGenerate = (mode, totalCount, hasVariant) => {
  report('worksheet_generate', { mode, total_count: totalCount, has_variant: hasVariant })
}

export const reportWorksheetCopy = (mode, version) => {
  report('worksheet_copy', { mode, version })
}

export const reportError = (functionName, errorMessage) => {
  report('error', { function_name: functionName, error_message: errorMessage })
}
