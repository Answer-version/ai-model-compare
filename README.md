# 🤖 AI Models Comparison - AI模型对比

> 专注于AI大模型订阅套餐与API价格对比的工具站 | 收录全球32+主流AI模型

[![Stars](https://img.shields.io/github/stars/Answer-version/ai-model-compare?style=social)](https://github.com/Answer-version/ai-model-compare)
[![License](https://img.shields.io/github/license/Answer-version/ai-model-compare)](https://github.com/Answer-version/ai-model-compare)
[![Last Commit](https://img.shields.io/github/last-commit/Answer-version/ai-model-compare)](https://github.com/Answer-version/ai-model-compare)

[📖 中文文档](./docs/README_zh.md) | [🚀 本地运行](#-快速开始)

---

## ✨ 特性

### 🌍 全球覆盖
- **32+ 主流AI模型**收录
- **17+ AI平台**涵盖
- **三大计费模式**：订阅制、API按量、开源免费

### 📊 数据全面
- 订阅套餐：首月价、月价、季价、年价
- API定价：输入/输出价格（$/千tokens）
- 上下文长度、评分、能力标签

### 🔍 智能筛选
- 按计费模式筛选（订阅/API/开源）
- 按区域筛选（国内/全球）
- 按能力筛选（多模态/代码/长文本等）
- 多种排序方式

### 🎨 界面友好
- 白色清爽风格，护眼舒适
- 响应式设计，手机电脑都能用
- 套餐详情一键展开/收起

---

## 📋 支持的模型

### 🇨🇳 国内模型

| 平台 | 模型 | 计费模式 |
|------|------|----------|
| MiniMax | M2.7、M2.5 | 订阅/API |
| 字节跳动 | Doubao-Seed | 订阅 |
| 月之暗面 | Kimi-K2.5 | 订阅 |
| 智谱AI | GLM-4.7、GLM-5 | 订阅/API |
| 阿里云 | Qwen-3.5、Qwen2.5-Coder | 订阅/开源 |
| 深度求索 | DeepSeek-V3.2 | API |
| 百川AI | HY-2.0、HY-T1 | 订阅/API |
| 零一万物 | Yi-2.5 | API |

### 🌎 全球模型

| 平台 | 模型 | 计费模式 |
|------|------|----------|
| OpenAI | GPT-4o、GPT-4o Mini、o1 | 订阅 |
| Anthropic | Claude 3.5 Sonnet、Claude 3 Opus | 订阅 |
| Google | Gemini 2.0 Flash、1.5 Pro/Flash | 订阅/API |
| Meta | Llama 3.1 70B/8B | 开源免费 |
| Mistral | Mistral Large、Small | 订阅/API |
| Cohere | Command R+、Command R | API |
| xAI | Grok-2、Grok-1 | 订阅/开源 |
| Amazon | Titan Text Premier | API |
| AI21 | Jurassic-2 Ultra | API |

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Answer-version/ai-model-compare.git
cd ai-model-compare

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署

#### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### Cloudflare Pages

1. Fork 此仓库
2. 连接到 Cloudflare Pages
3. 构建命令：`npm run build`
4. 输出目录：`dist`

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite |
| 样式 | Tailwind CSS |
| 部署 | Vercel / Cloudflare Pages |
| 域名 | Cloudflare DNS |
| HTTPS | 自动（Vercel/Cloudflare）|

---

## 📁 项目结构

```
ai-model-compare/
├── src/
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   ├── index.css            # 全局样式
│   └── data/
│       └── models.js         # 模型数据配置
├── public/
├── dist/                    # 构建输出
├── docs/                    # 文档
├── SPEC.md                  # 产品规格书
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🤝 如何贡献

欢迎提交 Issue 和 Pull Request！

### 数据更新

模型价格数据位于 `src/data/models.js`，更新时注意：

```javascript
{
  id: 'model-id',
  name: '模型名称',
  provider: '平台名称',
  billingType: 'subscription' | 'api' | 'free',
  plans: [
    { name: '套餐名', firstMonth: 0, monthly: 0, quarterly: 0, yearly: 0, requestsPer5h: null }
  ],
  // ... 其他字段
}
```

### 功能建议

- 🐛 发现 Bug？提交 [Issue](https://github.com/Answer-version/ai-model-compare/issues)
- 💡 有新功能想法？提交 [Feature Request](https://github.com/Answer-version/ai-model-compare/issues)
- 📝 改善文档？提交 PR

---

## 📄 许可证

本项目仅供学习参考，数据来源于各平台官网，实际价格以官方为准。

---

## ⚠️ 免责声明

- 本网站所有价格数据均来自公开信息，仅供参考
- 价格可能随时变动，请以各平台官方最新公告为准
- 本网站不对任何因使用本信息导致的直接或间接损失负责

---

## 🙏 致谢

- [Vercel](https://vercel.com) - 托管服务
- [Tailwind CSS](https://tailwindcss.com) - 样式框架
- [React](https://react.dev) - UI 框架
- 各AI平台官方文档

---

## 📬 联系

- GitHub Issues: [提交问题](https://github.com/Answer-version/ai-model-compare/issues)
- 项目地址: https://github.com/Answer-version/ai-model-compare

---

<p align="center">
  <strong>如果对你有帮助，请给个 ⭐ </strong>
</p>
