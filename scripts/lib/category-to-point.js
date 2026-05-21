/**
 * 旧库 category / grammarPoint → V2.0 point_id (p001–p060)
 * 未命中项在迁移报告中列出，可在此表追加后重跑 migrate-legacy-export.js
 */
const CATEGORY_MAP = {
  // 名词
  名词: 'p001',
  名词综合: 'p001',
  名词复数书写综合: 'p001',
  's/sh/ch/x结尾': 'p001',
  以o结尾: 'p001',
  以y结尾: 'p001',
  分类: 'p001',

  // 代词
  代词: 'p007',
  代词综合: 'p007',
  人称代词: 'p007',
  反身代词: 'p010',
  it相关: 'p012',

  // 冠词
  冠词: 'p013',
  冠词综合: 'p014',
  a和an: 'p013',
  泛指与特指: 'p014',
  the的特殊用法: 'p015',

  // 介词 / 连词
  介词: 'p017',
  连词: 'p023',
  并列连词综合: 'p023',
  从属连词综合: 'p025',
  连词与动词: 'p023',
  连词与名词: 'p023',
  连词与形容词: 'p023',
  '连词与名/动/形/副综合': 'p023',

  // 形容词 / 副词
  形容词综合: 'p027',
  '形容词与副词': 'p027',
  比较级: 'p029',
  最高级: 'p030',
  副词: 'p028',
  副词综合: 'p028',
  副词修饰动词: 'p028',
  '副词修饰形容词/副词': 'p028',

  // 动词 / 非谓语
  动词: 'p033',
  动词综合: 'p033',
  插入语与动词: 'p033',
  不定式综合: 'p034',
  现在分词综合: 'p036',
  过去分词综合: 'p036',
  非谓语综合: 'p034',

  // 谓语 / 时态（旧体系，近似映射到主谓一致与并列句时态）
  谓语: 'p038',
  谓语综合: 'p038',
  '谓语(8)': 'p038',
  '谓语(9)': 'p039',
  主谓一致: 'p038',
  主从句与动词: 'p049',
  时态综合: 'p042',
  现在时: 'p042',
  过去时: 'p042',
  进行时: 'p042',
  完成时: 'p042',
  动词时态: 'p042',
  并列句与动词: 'p042',

  // 从句
  关系代词: 'p044',
  定语从句综合: 'p044',
  who和which选哪个: 'p043',
  whose: 'p043',
  that能填吗: 'p044',
  'which和when/where混淆': 'p044',
  when: 'p052',
  where: 'p052',
  why: 'p055',
  how: 'p048',
  复合句: 'p048',
  状语从句综合: 'p052',

  // 特殊句式
  特殊句式: 'p060',

  // 无 V2 对应（迁移时跳过，写入报告）
  综合练习: null,
  被动语态: null,
  被动写be吗: null
}

const GRAMMAR_POINT_MAP = {
  副词综合: 'p028'
}

/**
 * @param {string} [category]
 * @param {string} [grammarPoint]
 * @returns {string|null}
 */
function resolvePointId(category, grammarPoint) {
  if (grammarPoint && GRAMMAR_POINT_MAP[grammarPoint]) {
    return GRAMMAR_POINT_MAP[grammarPoint]
  }
  if (category && Object.prototype.hasOwnProperty.call(CATEGORY_MAP, category)) {
    return CATEGORY_MAP[category]
  }
  return null
}

module.exports = { CATEGORY_MAP, GRAMMAR_POINT_MAP, resolvePointId }
