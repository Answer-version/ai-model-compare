const fs = require('fs');
let content = fs.readFileSync('C:/Users/answer/.openclaw/workspace/ai-model-compare/src/data/models.js', 'utf8');

const pricingUrls = {
  'minimax': 'https://platform.minimaxi.com/document/price',
  'doubao': 'https://console.volcengine.com/ark/region:ark+cn-beijing/price',
  'kimi': 'https://platform.moonshot.cn/docs/guide/price',
  'glm': 'https://open.bigmodel.cn/pricing',
  'qwen': 'https://dashscope.console.aliyun.com/billing',
  'deepseek': 'https://platform.deepseek.com/docs/guide/pricing',
  'yi': 'https://platform.lingyiwanwu.com/pricing',
  'baichuan': 'https://www.baichuan-ai.com/#/price',
  'openai': 'https://openai.com/api/pricing',
  'anthropic': 'https://console.anthropic.com/settings/plans',
  'google': 'https://ai.google.dev/pricing',
  'meta': 'https://ai.meta.com/llm-pricing',
  'mistral': 'https://console.mistral.ai/pricing',
  'cohere': 'https://dashboard.cohere.com/api-keys',
  'xai': 'https://console.x.ai/pricing',
  'amazon': 'https://aws.amazon.com/bedrock/pricing/',
  'ai21': 'https://www.ai21.com/pricing'
};

for (const [provider, url] of Object.entries(pricingUrls)) {
  const regex = new RegExp(`(providerKey: '${provider}',[\\s\\S]*?region: '[a-z]+',)`, 'g');
  content = content.replace(regex, `$1\n    pricingUrl: '${url}',`);
}

fs.writeFileSync('C:/Users/answer/.openclaw/workspace/ai-model-compare/src/data/models.js', content);
console.log('Done');
