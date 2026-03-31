import { useState, useMemo } from 'react'
import { models, providers, capabilities, scenarios, colorMap } from './data/models'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviders, setSelectedProviders] = useState([])
  const [selectedScenarios, setSelectedScenarios] = useState(['all'])
  const [selectedCapabilities, setSelectedCapabilities] = useState([])
  const [sortBy, setSortBy] = useState('rating')

  const toggleProvider = (key) => {
    setSelectedProviders(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    )
  }

  const toggleScenario = (key) => {
    if (key === 'all') {
      setSelectedScenarios(['all'])
      return
    }
    setSelectedScenarios(prev => {
      const filtered = prev.filter(s => s !== 'all')
      return filtered.includes(key) ? filtered.filter(s => s !== key) : [...filtered, key]
    })
  }

  const toggleCapability = (key) => {
    setSelectedCapabilities(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      // Search
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !model.provider.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Provider filter
      if (selectedProviders.length > 0 && !selectedProviders.includes(model.providerKey)) {
        return false
      }

      // Region filter
      if (!selectedScenarios.includes('all')) {
        const hasRegionFilter = selectedScenarios.includes('cn') || selectedScenarios.includes('global')
        const hasTagFilter = selectedScenarios.some(s => s !== 'cn' && s !== 'global')

        if (hasRegionFilter && !hasTagFilter) {
          if (selectedScenarios.includes('cn') && model.region !== 'cn') return false
          if (selectedScenarios.includes('global') && model.region !== 'global') return false
        } else if (hasTagFilter && !hasRegionFilter) {
          if (!selectedScenarios.some(s => model.tags.includes(s))) return false
        } else if (hasTagFilter && hasRegionFilter) {
          const regionMatch = (selectedScenarios.includes('cn') && model.region === 'cn') ||
                            (selectedScenarios.includes('global') && model.region === 'global')
          const tagMatch = selectedScenarios.filter(s => s !== 'cn' && s !== 'global').some(s => model.tags.includes(s))
          if (!regionMatch || !tagMatch) return false
        }
      }

      // Capability filter
      if (selectedCapabilities.length > 0 && !selectedCapabilities.some(c => model.capabilities.includes(c))) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedProviders, selectedScenarios, selectedCapabilities])

  // Sort models
  const sortedModels = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'inputPrice') return a.inputPrice - b.inputPrice
      if (sortBy === 'context') {
        const aLen = parseInt(a.contextLength) || 0
        const bLen = parseInt(b.contextLength) || 0
        return bLen - aLen
      }
      return 0
    })
  }, [filteredModels, sortBy])

  // Stats
  const stats = useMemo(() => {
    const hotPlans = models.reduce((sum, m) => sum + (m.plans?.filter(p => p.hot).length || 0), 0)
    return {
      totalModels: models.length,
      totalProviders: providers.length,
      filteredCount: filteredModels.length,
      hotPlans
    }
  }, [])

  const formatPrice = (price, currency = '$') => {
    if (price === 0) return '免费'
    return currency === '$' ? `$${price}` : `¥${price}`
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <span>🤖</span>
                AI 模型对比
              </h1>
              <p className="text-gray-400 text-sm mt-1">全球头部平台价格聚合 · 每日更新</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">更新日期：2026-03-31</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">收录模型</div>
            <div className="text-2xl font-bold text-white">{stats.totalModels}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">平台数量</div>
            <div className="text-2xl font-bold text-white">{stats.totalProviders}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">当前筛选</div>
            <div className="text-2xl font-bold text-blue-400">{stats.filteredCount}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">热门套餐</div>
            <div className="text-2xl font-bold text-orange-400">{stats.hotPlans}</div>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="搜索模型名称或厂商..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="rating">评分排序</option>
              <option value="inputPrice">价格排序</option>
              <option value="context">上下文排序</option>
            </select>
          </div>
        </div>

        {/* Provider Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProviders([])}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedProviders.length === 0
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              全部平台
            </button>
            {providers.filter(p => p.region === 'cn').map(provider => (
              <button
                key={provider.key}
                onClick={() => toggleProvider(provider.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedProviders.includes(provider.key)
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {provider.logo} {provider.name}
              </button>
            ))}
            <span className="text-gray-600 self-center">|</span>
            {providers.filter(p => p.region === 'global').map(provider => (
              <button
                key={provider.key}
                onClick={() => toggleProvider(provider.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedProviders.includes(provider.key)
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {provider.logo} {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario & Capability Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {scenarios.map(scenario => (
              <button
                key={scenario.key}
                onClick={() => toggleScenario(scenario.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedScenarios.includes(scenario.key)
                    ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
          <div className="border-l border-gray-700 pl-4 flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm self-center">能力:</span>
            {capabilities.map(cap => (
              <button
                key={cap.key}
                onClick={() => toggleCapability(cap.key)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  selectedCapabilities.includes(cap.key)
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {cap.icon} {cap.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="px-4 py-3 font-medium">平台</th>
                  <th className="px-4 py-3 font-medium">模型</th>
                  <th className="px-4 py-3 font-medium">评分</th>
                  <th className="px-4 py-3 font-medium">上下文</th>
                  <th className="px-4 py-3 font-medium">输入价</th>
                  <th className="px-4 py-3 font-medium">输出价</th>
                  <th className="px-4 py-3 font-medium">能力</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model, index) => (
                  <ModelRow key={model.id} model={model} index={index} formatPrice={formatPrice} />
                ))}
              </tbody>
            </table>
          </div>

          {sortedModels.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <div>没有找到匹配的模型</div>
            </div>
          )}
        </div>

        <div className="text-center text-gray-500 text-sm mt-4">
          显示 {sortedModels.length} / {models.length} 个模型
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>数据仅供参考，实际价格以各平台官方为准</p>
            <p className="mt-2">© 2026 AI 模型对比 · 仅供学习参考</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ModelRow({ model, index, formatPrice }) {
  const colors = colorMap[model.color] || colorMap.blue
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{model.logo}</span>
            <span className="text-white font-medium text-sm">{model.provider}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${model.region === 'cn' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {model.region === 'cn' ? '🇨🇳' : '🌎'}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="font-medium text-white">{model.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {model.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className={`${colors.text}`}>✨ {h}</span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-white font-medium">{model.rating}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-white font-mono text-sm">{model.contextLength}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`font-mono text-sm ${model.region === 'cn' ? 'text-green-400' : 'text-orange-400'}`}>
            {formatPrice(model.inputPrice, model.region === 'cn' ? '¥' : '$')}
          </span>
          <span className="text-gray-500 text-xs">/千tokens</span>
        </td>
        <td className="px-4 py-3">
          <span className={`font-mono text-sm ${model.region === 'cn' ? 'text-green-400' : 'text-orange-400'}`}>
            {formatPrice(model.outputPrice, model.region === 'cn' ? '¥' : '$')}
          </span>
          <span className="text-gray-500 text-xs">/千tokens</span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {model.capabilities.slice(0, 3).map((cap, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                {cap}
              </span>
            ))}
            {model.capabilities.length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                +{model.capabilities.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <a
              href={model.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-gray-600 hover:text-white transition-all"
            >
              👁️ 套餐
            </a>
            <a
              href={model.pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${colors.button}`}
            >
              🛒 购买
            </a>
          </div>
        </td>
      </tr>
      {/* Expanded Plans Row */}
      {model.plans && model.plans.length > 0 && (
        <tr className="border-b border-gray-800">
          <td colSpan={8} className="px-4 py-3 bg-gray-950/50">
            <div className="flex flex-wrap gap-3">
              {model.plans.map((plan, i) => (
                <div key={i} className={`flex-1 min-w-[180px] max-w-[240px] p-3 rounded-lg border ${plan.hot ? 'border-orange-500/40 bg-orange-500/5' : 'border-gray-700 bg-gray-900/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white text-sm">{plan.name}</span>
                    {plan.hot && <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">热门</span>}
                    {plan.speed && <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{plan.speed}</span>}
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>首月</span>
                      <span className="text-white font-mono">¥{plan.firstMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>月费</span>
                      <span className="text-white font-mono">¥{plan.monthly}/月</span>
                    </div>
                    <div className="flex justify-between">
                      <span>季费</span>
                      <span className="text-white font-mono">¥{plan.quarterly}/季</span>
                    </div>
                    <div className="flex justify-between">
                      <span>年费</span>
                      <span className="text-white font-mono">¥{plan.yearly}/年</span>
                    </div>
                    <div className="flex justify-between">
                      <span>请求限制</span>
                      <span className="text-white font-mono">{plan.requestsPer5h ? `${plan.requestsPer5h}/5h` : '未公开'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default App
