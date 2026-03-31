# AI 模型对比站 - 产品规格书

## 1. Concept & Vision

一个简洁、专业的 AI 大模型对比工具，帮助用户快速了解各模型的优劣和适用场景。视觉风格偏向科技感、数据化，让用户感觉在查看一个"专业评测平台"而非普通博客。整体氛围：冷静、权威、值得信赖。

## 2. Design Language

### 视觉方向
- 科技感 + 数据仪表盘风格
- 深色主题（配合 AI/代码工具的氛围）
- 卡片式布局，清晰分区

### 色彩系统
```
--bg-primary: #0f172a     深蓝黑背景
--bg-secondary: #1e293b  卡片背景
--bg-tertiary: #334155   hover/高亮
--text-primary: #f8fafc   主要文字
--text-secondary: #94a3b8 次要文字
--accent-blue: #3b82f6    主强调色（推荐标签）
--accent-green: #22c55e  优势标记
--accent-yellow: #eab308  注意事项
--accent-red: #ef4444    劣势标记
--accent-purple: #a855f7 亮点标记
```

### 字体
- 主字体: Inter（Google Fonts）
- 代码/数字: JetBrains Mono
- 中文: "PingFang SC", "Microsoft YaHei"

### 动效
- 卡片 hover: translateY(-4px) + box-shadow 增强, 200ms ease-out
- 标签切换: 淡入淡出, 300ms
- 页面加载: 卡片依次淡入, stagger 50ms

## 3. Layout & Structure

### 页面结构
```
Header: Logo + 标题 + 副标题
筛选栏: 按厂商 / 按场景 / 按价格区间
统计概览: 总模型数 | 免费模型 | 最高性价比
模型卡片网格 (响应式)
Footer: 版权 + 数据更新时间 + 免责声明
```

### 响应式策略
- Desktop (>1024px): 3列网格
- Tablet (768-1024px): 2列网格
- Mobile (<768px): 单列堆叠

## 4. Features & Interactions

### 核心功能
1. 模型卡片展示 - 每个模型一张卡片
2. 筛选功能 - 按厂商/场景/价格
3. 搜索 - 实时搜索模型名称

### 交互细节
- 卡片 hover: 上浮 + 阴影加深
- 标签点击: 高亮 + 筛选结果实时更新
- 无结果: 显示空状态提示

## 5. Technical Approach

- 框架: React 18 + Vite
- 样式: Tailwind CSS
- 部署: Vercel（免费）
- 域名: 可选，简陋先上
