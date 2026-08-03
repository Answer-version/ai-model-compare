# 🤖 AI 模型对比 - 项目介绍

> 专注于AI大模型订阅套餐与API价格对比的工具站

**本地运行**：见 [README 快速开始](../README.md#-快速开始)

---

## 📖 项目简介

AI 模型对比是一个帮助用户**快速了解全球主流AI大模型价格和套餐**的工具网站。

### 🎯 解决什么问题？

1. **比价困难** - 各平台定价差异大，用户难以比较
2. **信息分散** - 需要在多个平台官网来回切换
3. **套餐复杂** - 订阅制、API按量、开源免费，模式多样

### 💡 我们的优势

- **一站式对比**：32+ 模型一个页面全搞定
- **实时更新**：数据定期更新，保持最新
- **简单易用**：无需注册，打开即用
- **国内可访问**：通过 Cloudflare 优化访问速度

---

## 📊 功能特性

### 1. 多维度筛选
- **计费模式**：只看订阅制 / API按量 / 开源免费
- **区域**：只看国内 / 全球模型
- **能力**：按多模态、代码、长文本等筛选

### 2. 排序灵活
- 按厂商排序（默认）
- 按评分排序
- 按价格排序（API输入价、月价、首月价）
- 按上下文长度排序

### 3. 套餐详情
- 点击模型行展开全部套餐
- 显示首月价、月价、季价、年价
- 显示5小时请求数限制
- 直链跳转到官网购买

### 4. 数据完整
- 订阅套餐价格
- API 定价（$/千tokens）
- 模型评分
- 上下文长度
- 能力标签

---

## 🗺️ 功能路线图

### 已完成 ✅
- [x] 32+ 模型数据收录
- [x] 订阅套餐展示
- [x] API 价格展示
- [x] 多维度筛选
- [x] 多种排序
- [x] 响应式设计
- [x] 国内可访问

### 计划中 🚧
- [ ] API 用量计算器 - 输入用量，自动算费用
- [ ] 模型对比功能 - 选2-3个模型横向对比
- [ ] 价格变动提醒 - 订阅后，价格变动通知
- [ ] 模型评分投票 - 用户可给模型打分
- [ ] 移动端 App

---

## 🏗️ 技术架构

```
前端：React 18 + Vite + Tailwind CSS
样式：自定义 CSS + Tailwind
部署：Vercel
域名：Cloudflare DNS 代理
SSL：自动（Vercel/Cloudflare）
```

### 目录结构

```
src/
├── App.jsx          # 主组件
├── main.jsx         # 入口
├── index.css        # 全局样式
└── data/
    └── models.js    # 模型数据

docs/                # 文档
public/              # 静态资源
dist/                # 构建输出
```

---

## 🚀 快速部署

### 方式一：Vercel（推荐）

```bash
# 1. 克隆
git clone https://github.com/Answer-version/ai-model-compare.git
cd ai-model-compare

# 2. 安装
npm install

# 3. 开发
npm run dev

# 4. 构建
npm run build

# 5. 部署
vercel --prod
```

### 方式二：Cloudflare Pages

1. Fork 本仓库
2. 连接 Cloudflare Pages
3. 构建命令：`npm run build`
4. 输出目录：`dist`

---

## 📝 数据格式

模型数据格式 (`src/data/models.js`)：

```javascript
{
  id: 'unique-model-id',
  name: '模型名称',
  provider: '平台名称',
  providerKey: 'platform',
  logo: '🤖', // 平台emoji
  contextLength: '128K',
  inputPrice: 0.001,  // API输入价格（美元/千tokens）
  outputPrice: 0.001,   // API输出价格
  rating: 4.5,         // 1-5评分
  capabilities: ['文本', '代码'],  // 能力标签
  tags: ['通用', '低价'],          // 分类标签
  color: 'blue',                   // 主题色
  region: 'cn',                   // 区域：cn/global
  billingType: 'subscription',   // 计费模式：subscription/api/free
  purchaseUrl: 'https://...',     // 购买链接
  pricingUrl: 'https://...',     // 价格页链接
  plans: [                       // 订阅套餐
    {
      name: '套餐名',
      firstMonth: 29,            // 首月价格
      monthly: 29,               // 月价
      quarterly: 87,             // 季价
      yearly: 290,              // 年价
      requestsPer5h: 600,       // 5小时请求数
      hot: true,               // 是否热门
      speed: '极速'             // 特殊标注
    }
  ]
}
```

---

## 🤝 贡献指南

### 提交数据更新

1. Fork 本仓库
2. 修改 `src/data/models.js`
3. 提交 PR

### 提交代码

1. Fork 本仓库
2. 创建新分支
3. 开发完成后提交 PR

### 报告问题

- 🐛 Bug：[GitHub Issues](https://github.com/Answer-version/ai-model-compare/issues)
- 💡 功能建议：[GitHub Issues](https://github.com/Answer-version/ai-model-compare/issues)

---

## ⚠️ 免责声明

1. 本网站所有价格数据均来自公开信息，仅供参考
2. 价格可能随时变动，请以各平台官方最新公告为准
3. 本网站不对任何因使用本信息导致的直接或间接损失负责

---

## 📜 许可证

MIT License - 可自由使用，但请保留署名

---

## 📬 联系方式

- GitHub Issues: [点击提交](https://github.com/Answer-version/ai-model-compare/issues)
- 项目地址: https://github.com/Answer-version/ai-model-compare

---

<p align="center">
  💡 如果对你有帮助，请给个 ⭐
</p>
