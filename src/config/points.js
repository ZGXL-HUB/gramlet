// 英语语法知识点树 V2.0（14专题×60知识点，严格对齐新课标+高考考点）
// 修改规则：仅修改name字段、增删children数组项，id字段保持唯一且与云数据库points集合一致
export const pointTree = [
  // ==================== 词法模块 ====================
  // 专题1：名词（6个知识点）
  {
    id: "t001",
    name: "名词",
    frequency: "M",
    children: [
      { id: "p001", name: "可数名词复数规则变化", difficulty: 1, frequency: "M", ai_tag: "写出下列名词的复数形式" },
      { id: "p002", name: "可数名词复数不规则变化", difficulty: 2, frequency: "H", ai_tag: "写出下列名词的复数形式" },
      { id: "p003", name: "单复数同形的名词", difficulty: 1, frequency: "M", ai_tag: "用所给名词的正确形式填空" },
      { id: "p004", name: "不可数名词的量化表达", difficulty: 2, frequency: "M", ai_tag: "填入适当的量词" },
      { id: "p005", name: "名词所有格（'s/of）", difficulty: 2, frequency: "H", ai_tag: "用所给名词的所有格形式填空" },
      { id: "p006", name: "名词作定语", difficulty: 1, frequency: "L", ai_tag: "用所给名词的正确形式填空" }
    ]
  },
  // 专题2：代词（6个知识点）
  {
    id: "t002",
    name: "代词",
    frequency: "M",
    children: [
      { id: "p007", name: "人称代词主格与宾格", difficulty: 1, frequency: "M", ai_tag: "填入适当的人称代词" },
      { id: "p008", name: "形容词性物主代词", difficulty: 1, frequency: "M", ai_tag: "填入适当的物主代词" },
      { id: "p009", name: "名词性物主代词", difficulty: 2, frequency: "H", ai_tag: "填入适当的物主代词" },
      { id: "p010", name: "反身代词", difficulty: 2, frequency: "H", ai_tag: "填入适当的反身代词" },
      { id: "p011", name: "不定代词（some/any/many等）", difficulty: 3, frequency: "H", ai_tag: "填入适当的不定代词" },
      { id: "p012", name: "it的特殊用法（形式主语/宾语）", difficulty: 3, frequency: "H", ai_tag: "填入适当的代词it" }
    ]
  },
  // 专题3：冠词（4个知识点）
  {
    id: "t003",
    name: "冠词",
    frequency: "H",
    children: [
      { id: "p013", name: "不定冠词a/an的用法", difficulty: 1, frequency: "H", ai_tag: "填入a/an或不填" },
      { id: "p014", name: "定冠词the的基本用法", difficulty: 2, frequency: "H", ai_tag: "填入the或不填" },
      { id: "p015", name: "定冠词the的特殊用法", difficulty: 3, frequency: "M", ai_tag: "填入适当的冠词或不填" },
      { id: "p016", name: "零冠词的用法", difficulty: 2, frequency: "H", ai_tag: "填入适当的冠词或不填" }
    ]
  },
  // 专题4：介词（6个知识点）
  {
    id: "t004",
    name: "介词",
    frequency: "H",
    children: [
      { id: "p017", name: "时间介词（in/on/at）", difficulty: 1, frequency: "H", ai_tag: "填入适当的时间介词" },
      { id: "p018", name: "地点介词（in/on/at/by）", difficulty: 2, frequency: "H", ai_tag: "填入适当的地点介词" },
      { id: "p019", name: "方式介词（by/with/in）", difficulty: 2, frequency: "M", ai_tag: "填入适当的方式介词" },
      { id: "p020", name: "方位介词（above/below等）", difficulty: 2, frequency: "M", ai_tag: "填入适当的方位介词" },
      { id: "p021", name: "常见介词固定搭配（动词+介词）", difficulty: 3, frequency: "H", ai_tag: "填入适当的介词" },
      { id: "p022", name: "常见介词固定搭配（形容词+介词）", difficulty: 3, frequency: "H", ai_tag: "填入适当的介词" }
    ]
  },
  // 专题5：连词（4个知识点）
  {
    id: "t005",
    name: "连词",
    frequency: "H",
    children: [
      { id: "p023", name: "并列连词（and/but/or/so）", difficulty: 1, frequency: "H", ai_tag: "填入适当的并列连词" },
      { id: "p024", name: "转折连词（however/while等）", difficulty: 2, frequency: "H", ai_tag: "填入适当的转折连词" },
      { id: "p025", name: "因果连词（because/since/for）", difficulty: 2, frequency: "H", ai_tag: "填入适当的因果连词" },
      { id: "p026", name: "让步连词（though/although/even if）", difficulty: 3, frequency: "H", ai_tag: "填入适当的让步连词" }
    ]
  },
  // 专题6：形容词与副词（5个知识点）
  {
    id: "t006",
    name: "形容词与副词",
    frequency: "H",
    children: [
      { id: "p027", name: "形容词作定语与表语", difficulty: 1, frequency: "M", ai_tag: "用所给词的正确形式填空" },
      { id: "p028", name: "副词的基本用法", difficulty: 1, frequency: "M", ai_tag: "用所给词的正确形式填空" },
      { id: "p029", name: "形容词与副词的比较级规则变化", difficulty: 2, frequency: "H", ai_tag: "用所给词的比较级形式填空" },
      { id: "p030", name: "形容词与副词的最高级规则变化", difficulty: 2, frequency: "H", ai_tag: "用所给词的最高级形式填空" },
      { id: "p031", name: "比较级与最高级的特殊用法", difficulty: 3, frequency: "H", ai_tag: "用所给词的正确形式填空" }
    ]
  },
  // 专题7：动词与非谓语（5个知识点）
  {
    id: "t007",
    name: "动词与非谓语",
    frequency: "H",
    children: [
      { id: "p032", name: "系动词的用法", difficulty: 1, frequency: "M", ai_tag: "填入适当的系动词" },
      { id: "p033", name: "及物动词与不及物动词", difficulty: 2, frequency: "M", ai_tag: "用所给动词的正确形式填空" },
      { id: "p034", name: "不定式（to do）的基本用法", difficulty: 2, frequency: "H", ai_tag: "用所给动词的不定式形式填空" },
      { id: "p035", name: "动名词（doing）的基本用法", difficulty: 2, frequency: "H", ai_tag: "用所给动词的动名词形式填空" },
      { id: "p036", name: "分词（doing/done）的基本用法", difficulty: 3, frequency: "H", ai_tag: "用所给动词的分词形式填空" }
    ]
  },
  // ==================== 句法模块 ====================
  // 专题8：简单句与主谓一致（4个知识点）
  {
    id: "t008",
    name: "简单句与主谓一致",
    frequency: "M",
    children: [
      { id: "p037", name: "简单句的五种基本句型", difficulty: 1, frequency: "L", ai_tag: "判断下列句子的句型" },
      { id: "p038", name: "语法一致原则", difficulty: 2, frequency: "H", ai_tag: "用所给动词的正确形式填空" },
      { id: "p039", name: "意义一致原则", difficulty: 3, frequency: "H", ai_tag: "用所给动词的正确形式填空" },
      { id: "p040", name: "就近一致原则", difficulty: 3, frequency: "H", ai_tag: "用所给动词的正确形式填空" }
    ]
  },
  // 专题9：并列句（2个知识点）
  {
    id: "t009",
    name: "并列句",
    frequency: "M",
    children: [
      { id: "p041", name: "并列句的基本结构", difficulty: 1, frequency: "L", ai_tag: "用适当的连词连接两个句子" },
      { id: "p042", name: "并列句的时态一致", difficulty: 2, frequency: "M", ai_tag: "用所给动词的正确形式填空" }
    ]
  },
  // 专题10：定语从句（5个知识点）
  {
    id: "t010",
    name: "定语从句",
    frequency: "H",
    children: [
      { id: "p043", name: "关系代词who/whom/whose的用法", difficulty: 2, frequency: "H", ai_tag: "填入适当的关系代词" },
      { id: "p044", name: "关系代词which/that的用法", difficulty: 2, frequency: "H", ai_tag: "填入适当的关系代词" },
      { id: "p045", name: "关系副词when/where/why的用法", difficulty: 3, frequency: "H", ai_tag: "填入适当的关系副词" },
      { id: "p046", name: "限制性与非限制性定语从句", difficulty: 3, frequency: "M", ai_tag: "判断下列定语从句的类型" },
      { id: "p047", name: "介词+关系代词的用法", difficulty: 3, frequency: "H", ai_tag: "填入适当的介词+关系代词" }
    ]
  },
  // 专题11：名词性从句（4个知识点）
  {
    id: "t011",
    name: "名词性从句",
    frequency: "H",
    children: [
      { id: "p048", name: "宾语从句的引导词与语序", difficulty: 2, frequency: "H", ai_tag: "填入适当的引导词" },
      { id: "p049", name: "宾语从句的时态一致", difficulty: 2, frequency: "H", ai_tag: "用所给动词的正确形式填空" },
      { id: "p050", name: "主语从句的基本用法", difficulty: 3, frequency: "M", ai_tag: "填入适当的引导词" },
      { id: "p051", name: "表语从句的基本用法", difficulty: 3, frequency: "L", ai_tag: "填入适当的引导词" }
    ]
  },
  // 专题12：状语从句（4个知识点）
  {
    id: "t012",
    name: "状语从句",
    frequency: "H",
    children: [
      { id: "p052", name: "时间状语从句", difficulty: 2, frequency: "H", ai_tag: "填入适当的连词" },
      { id: "p053", name: "条件状语从句", difficulty: 2, frequency: "H", ai_tag: "填入适当的连词" },
      { id: "p054", name: "让步状语从句", difficulty: 3, frequency: "H", ai_tag: "填入适当的连词" },
      { id: "p055", name: "原因状语从句", difficulty: 2, frequency: "M", ai_tag: "填入适当的连词" }
    ]
  },
  // 专题13：虚拟语气（3个知识点）
  {
    id: "t013",
    name: "虚拟语气",
    frequency: "M",
    children: [
      { id: "p056", name: "if条件句的虚拟语气", difficulty: 3, frequency: "H", ai_tag: "用所给动词的正确形式填空" },
      { id: "p057", name: "wish后的宾语从句虚拟语气", difficulty: 3, frequency: "M", ai_tag: "用所给动词的正确形式填空" },
      { id: "p058", name: "suggest/order等后的宾语从句虚拟语气", difficulty: 3, frequency: "M", ai_tag: "用所给动词的正确形式填空" }
    ]
  },
  // 专题14：特殊句式（2个知识点）
  {
    id: "t014",
    name: "特殊句式",
    frequency: "L",
    children: [
      { id: "p059", name: "倒装句的基本用法", difficulty: 3, frequency: "L", ai_tag: "将下列句子改为倒装句" },
      { id: "p060", name: "强调句的基本用法", difficulty: 3, frequency: "L", ai_tag: "将下列句子改为强调句" }
    ]
  }
]

// 工具函数：根据知识点ID获取名称（全局通用）
export const getPointNameById = (pointId) => {
  for (const topic of pointTree) {
    const point = topic.children.find(p => p.id === pointId)
    if (point) return point.name
  }
  return "未知知识点"
}

// 工具函数：根据专题ID获取专题信息
export const getTopicById = (topicId) => {
  return pointTree.find(t => t.id === topicId) || { id: "", name: "未知专题", children: [] }
}

// 工具函数：根据知识点ID获取难度和考频
export const getPointMetaById = (pointId) => {
  for (const topic of pointTree) {
    const point = topic.children.find(p => p.id === pointId)
    if (point) return { difficulty: point.difficulty, frequency: point.frequency }
  }
  return { difficulty: 2, frequency: "M" }
}
