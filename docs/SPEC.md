# AI Model Comparison - 产品规格书

## 1. Concept & Vision

**定位**：做一个简单、干净、无广告的AI模型价格对比工具站，帮助用户快速找到最适合自己的AI模型。

**slogan**：让AI模型选择更简单

**目标用户**：
- 开发者：选型参考
- 企业：成本预算
- 普通用户：AI工具入门

**设计理念**：
- 干净清爽，无广告
- 数据真实，及时更新
- 操作简单，3秒上手

---

## 2. Design Language

### 色彩系统
```
Primary:    #3b82f6 (蓝色 - 主要操作)
Success:    #22c55e (绿色 - 免费/开源)
Warning:     #f97316 (橙色 - 热门/订阅)
Danger:      #ef4444 (红色 - 警告)
Background: #ffffff (白色 - 主背景)
Text:       #1f2937 (深灰 - 主要文字)
Text-Light: #6b7280 (浅灰 - 次要文字)
```

### 字体
- 主字体：Inter, system-ui, sans-serif
- 数字：JetBrains Mono（等宽）
- 中文：PingFang SC, Microsoft YaHei

### 布局
- 最大宽度：1600px
- 内边距：16px (mobile) / 24px (tablet) / 32px (desktop)
- 卡片圆角：12px
- 按钮圆角：8px

### 动效
- 过渡时长：200ms
- 缓动函数：ease-out
- hover 上移：translateY(-2px)

---

## 3. Layout & Structure

### 页面结构
```
┌─────────────────────────────────────────┐
│ Header                                   │
│ Logo | 标题 | 更新日期                    │
├─────────────────────────────────────────┤
│ Stats Bar (5个统计卡片)                   │
│ 模型数 | 订阅数 | API数 | 开源数 | 筛选数  │
├─────────────────────────────────────────┤
│ Search & Sort Bar                        │
│ [🔍 搜索...] [排序: 按厂商▼]             │
├─────────────────────────────────────────┤
│ Filter Tags                              │
│ [国内] [全球] [订阅] [API] [开源]        │
│ 能力标签: [文本] [多模态] [代码] ...     │
├─────────────────────────────────────────┤
│ Tip Banner                               │
│ 📋 订阅制=包月 | 💰 API=按量 | 🆓 开源... │
├─────────────────────────────────────────┤
│ Table Header                             │
│ 平台 | 模型 | 计费 | 评分 | 上下文 | ...  │
├─────────────────────────────────────────┤
│ Table Body                               │
│ 可展开的模型行                            │
│ 展开后显示全部套餐                         │
├─────────────────────────────────────────┤
│ Footer                                   │
│ 免责声明 | 版权声明                       │
└─────────────────────────────────────────┘
```

### 响应式断点
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 4. Features & Interactions

### 4.1 筛选功能

| 筛选维度 | 选项 | 行为 |
|---------|------|------|
| 平台 | 全部 + 17个平台 | 多选 |
| 场景 | 全部/国内/全球/订阅/API/开源 | 多选 |
| 能力 | 文本/多模态/代码/推理等 | 多选 |

### 4.2 排序功能

| 排序方式 | 说明 |
|---------|------|
| 按厂商（默认） | 厂商字母序 |
| 按评分 | 5分到1分 |
| 按API输入价 | 低到高 |
| 按月价 | 低到高 |
| 按首月价 | 低到高 |
| 按上下文 | 长到短 |

### 4.3 套餐展开

- 点击模型行 → 展开/收起套餐详情
- 展开后显示：该模型全部套餐
- 每个套餐显示：首月/月/季/年价格、5h请求数
- 提供官网链接和购买按钮

### 4.4 搜索

- 实时搜索
- 支持模型名、平台名
- 空结果显示友好提示

---

## 5. Component Inventory

### 5.1 StatsCard
- 显示统计数据
- 4列/5列网格布局
- 数字使用强调色

### 5.2 SearchBar
- 带搜索图标的输入框
- 支持清空
- focus 状态蓝色边框

### 5.3 FilterTag
- 可点击切换状态
- 选中：主题色背景
- 未选中：灰色背景

### 5.4 ModelTable
- 固定表头
- 斑马纹行
- 可选中行展开

### 5.5 ModelRow
- 显示基本信息
- 计费方式标签
- 展开箭头（可展开时）

### 5.6 PlanModal
- 套餐卡片网格
- 热门套餐突出显示
- 购买按钮

---

## 6. Technical Approach

### 前端
- React 18 (hooks)
- Vite 5
- Tailwind CSS 3

### 状态管理
- React useState/useMemo
- 无需 Redux（数据简单）

### 路由
- 单页面，无需路由

### 数据
- 静态 JSON 文件
- 无后端依赖

### 部署
- Vercel（自动部署）
- Cloudflare（域名代理/加速）

---

## 7. Data Model

```typescript
interface Model {
  id: string
  name: string
  provider: string
  providerKey: string
  logo: string
  contextLength: string
  inputPrice: number
  outputPrice: number
  rating: number
  capabilities: string[]
  tags: string[]
  color: string
  region: 'cn' | 'global'
  billingType: 'subscription' | 'api' | 'free'
  purchaseUrl: string
  pricingUrl: string
  plans: Plan[]
}

interface Plan {
  name: string
  firstMonth: number
  monthly: number
  quarterly: number
  yearly: number
  requestsPer5h: number | null
  hot?: boolean
  speed?: string
}
```

---

## 8. TODO

### P0 - 必须
- [x] 基础页面结构
- [x] 模型数据展示
- [x] 筛选功能
- [x] 排序功能
- [x] 套餐展开

### P1 - 重要
- [ ] API 用量计算器
- [ ] 模型对比功能
- [ ] 价格变动历史图表

### P2 - 优化
- [ ] 用户评分功能
- [ ] 暗黑模式
- [ ] 多语言支持

---

## 9. Metrics

| 指标 | 目标 |
|------|------|
| 页面加载速度 | < 2s |
| Lighthouse Score | > 90 |
| 模型数据准确率 | > 99% |
| 月访问量 | 10000+ |
