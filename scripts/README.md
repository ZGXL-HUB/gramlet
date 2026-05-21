# 题库数据处理脚本

不依赖微信云开发控制台，在本地维护 `src/data/exercises.json` 供 Mock API 使用。

## 命令

| 命令 | 说明 |
|------|------|
| `npm run data:merge-600` | 从桌面豆包 txt (13–18) 合并 600 题 → `src/data/exercises.json` |
| `npm run data:migrate-legacy` | 旧库 NDJSON 导出 → `src/data/exercises-legacy.json` + 报告 |
| `npm run data:build` | 合并 600 + legacy 到 `exercises.json`（可选，包体会变大） |
| `npm run data:validate` | 校验 `exercises.json` 字段 |

## 推荐流程

1. `npm run data:merge-600` — 日常开发用 600 题即可  
2. （可选）`npm run data:migrate-legacy` — 映射旧 1997 题  
3. （可选）`npm run data:build` — 需要更大题库时再合并  
4. `npm run dev:mp-weixin` — Mock 自动加载 `exercises.json`

## 自定义路径

```bash
node scripts/merge-doubao-600.js "D:\a.txt" "D:\b.txt"
node scripts/migrate-legacy-export.js "D:\database_export.json"
```

## 映射表

旧库 `category` → `point_id` 见 `scripts/lib/category-to-point.js`，未命中项写入 `src/data/migrate-legacy-report.json`。
