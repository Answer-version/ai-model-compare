import { useState, useMemo } from 'react'
import { models, providers, scenarios, pricingRanges, colorMap } from './data/models'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviders, setSelectedProviders] = useState([])
  const [selectedScenarios, setSelectedScenarios] = useState([])
  const [selectedPricing, setSelectedPricing] = useState('all')

  const toggleProvider = (key) => {
    setSelectedProviders(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    )
  }

  const toggleScenario = (key) => {
    setSelectedScenarios(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
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

      // Scenario/Region filter
      if (selectedScenarios.length > 0) {
        const hasRegionFilter = selectedScenarios.includes('cn') || selectedScenarios.includes('global')
        const hasTagFilter = selectedScenarios.some(s => s !== 'cn' && s !== 'global')
        
        if (hasRegionFilter && !hasTagFilter) {
          // Only region filter selected
          if (selectedScenarios.includes('cn') && model.region !== 'cn') return false
          if (selectedScenarios.includes('global') && model.region !== 'global') return false
        } else if (hasTagFilter && !hasRegionFilter) {
          // Only tag filter selected
          if (!selectedScenarios.some(s => model.tags.includes(s))) return false
        } else if (hasTagFilter && hasRegionFilter) {
          // Both filters selected - AND logic
          const regionMatch = (selectedScenarios.includes('cn') && model.region === 'cn') ||
                            (selectedScenarios.includes('global') && model.region === 'global')
          const tagMatch = selectedScenarios.filter(s => s !== 'cn' && s !== 'global').some(s => model.tags.includes(s))
          if (!regionMatch || !tagMatch) return false
        }
      }

      // Pricing filter
      if (selectedPricing !== 'all') {
        if (selectedPricing === '4' && model.pricingLevel < 4) return false
        if (selectedPricing === '3' && (model.pricingLevel < 3 || model.pricingLevel > 3)) return false
        if (selectedPricing === '2' && (model.pricingLevel < 2 || model.pricingLevel > 2)) return false
        if (selectedPricing === '1' && model.pricingLevel > 1) return false
      }

      return true
    })
  }, [searchQuery, selectedProviders, selectedScenarios, selectedPricing])

  // Stats
  const stats = useMemo(() => {
    const freeModels = models.filter(m => m.pricingLevel === 1).length
    const bestValue = models.reduce((best, m) => m.rating / (m.pricingLevel || 1) > best.rating / (best.pricingLevel || 1) ? m : best)
    return {
      total: models.length,
      free: freeModels,
      bestValue: bestValue.name
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-bg-tertiary bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                AI 模型对比
              </h1>
              <p className="text-text-secondary mt-1">全球头部平台价格聚合 · 每日更新</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-text-secondary">
                数据更新时间：2026-03-31
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-secondary rounded-xl p-6 border border-bg-tertiary">
            <div className="text-text-secondary text-sm mb-1">收录模型总数</div>
            <div className="text-3xl font-bold text-accent-blue font-mono">{stats.total}</div>
          </div>
          <div className="bg-bg-secondary rounded-xl p-6 border border-bg-tertiary">
            <div className="text-text-secondary text-sm mb-1">低价/免费模型</div>
            <div className="text-3xl font-bold text-accent-green font-mono">{stats.free}</div>
          </div>
          <div className="bg-bg-secondary rounded-xl p-6 border border-bg-tertiary">
            <div className="text-text-secondary text-sm mb-1">最高性价比</div>
            <div className="text-xl font-bold text-accent-purple">{stats.bestValue}</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模型名称或厂商..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-secondary border border-bg-tertiary rounded-xl px-4 py-3 pl-12 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Provider Filter */}
          <div>
            <h3 className="text-sm text-text-secondary mb-2">按厂商筛选</h3>
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <button
                  key={provider.key}
                  onClick={() => toggleProvider(provider.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    selectedProviders.includes(provider.key)
                      ? 'bg-accent-blue/20 border-accent-blue text-text-primary'
                      : 'bg-bg-secondary border-bg-tertiary text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {provider.logo} {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Filter */}
          <div>
            <h3 className="text-sm text-text-secondary mb-2">按场景筛选</h3>
            <div className="flex flex-wrap gap-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.key}
                  onClick={() => toggleScenario(scenario.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    selectedScenarios.includes(scenario.key)
                      ? 'bg-accent-purple/20 border-accent-purple text-text-primary'
                      : 'bg-bg-secondary border-bg-tertiary text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Filter */}
          <div>
            <h3 className="text-sm text-text-secondary mb-2">按价格筛选</h3>
            <div className="flex flex-wrap gap-2">
              {pricingRanges.map(pricing => (
                <button
                  key={pricing.key}
                  onClick={() => setSelectedPricing(pricing.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    selectedPricing === pricing.key
                      ? 'bg-accent-green/20 border-accent-green text-text-primary'
                      : 'bg-bg-secondary border-bg-tertiary text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {pricing.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-text-secondary mb-4">
          找到 {filteredModels.length} 个模型
          {(selectedProviders.length > 0 || selectedScenarios.length > 0 || selectedPricing !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedProviders([])
                setSelectedScenarios([])
                setSelectedPricing('all')
                setSearchQuery('')
              }}
              className="ml-3 text-accent-blue hover:underline"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* Model Cards Grid */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model, index) => (
              <ModelCard key={model.id} model={model} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-xl">没有找到匹配的模型</div>
            <div className="text-sm mt-2">尝试调整筛选条件或搜索关键词</div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-bg-tertiary mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-text-secondary text-sm">
            <p>数据仅供参考，实际价格以各平台官方为准</p>
            <p className="mt-2">© 2026 AI 模型对比 · 仅供学习参考</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ModelCard({ model, index }) {
  const colors = colorMap[model.color] || colorMap.blue

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-xl p-5 card-hover animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{model.logo}</span>
          <div>
            <h3 className="font-bold text-text-primary">{model.name}</h3>
            <p className="text-sm text-text-secondary">{model.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={model.rating} />
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${colors.badge}`}>
          💰 {model.priceDetail}
        </span>
      </div>

      {/* Context Length */}
      <div className="text-sm text-text-secondary mb-3">
        📏 上下文长度：<span className="text-text-primary font-mono">{model.contextLength}</span>
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-1 mb-4">
        {model.highlights.map((h, i) => (
          <span key={i} className="px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded text-xs">
            ✨ {h}
          </span>
        ))}
      </div>

      {/* Strengths */}
      <div className="mb-3">
        <div className="text-xs text-text-secondary mb-1">✅ 优势</div>
        <div className="flex flex-wrap gap-1">
          {model.strengths.map((s, i) => (
            <span key={i} className="px-2 py-0.5 bg-accent-green/10 text-accent-green rounded text-xs">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Best For */}
      <div className="mb-3">
        <div className="text-xs text-text-secondary mb-1">🎯 适合</div>
        <div className="flex flex-wrap gap-1">
          {model.bestFor.map((b, i) => (
            <span key={i} className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded text-xs">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Not Suitable For */}
      <div className="mb-4">
        <div className="text-xs text-text-secondary mb-1">⚠️ 不适合</div>
        <div className="flex flex-wrap gap-1">
          {model.notSuitableFor.map((n, i) => (
            <span key={i} className="px-2 py-0.5 bg-accent-red/10 text-accent-red rounded text-xs">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Purchase Button */}
      <a
        href={model.purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full text-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
          model.pricingLevel === 1
            ? 'bg-accent-green/20 border border-accent-green/40 text-accent-green hover:bg-accent-green/30'
            : model.pricingLevel === 2
            ? 'bg-accent-blue/20 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/30'
            : 'bg-accent-purple/20 border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/30'
        }`}
      >
        🛒 前往官网购买套餐
      </a>
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-sm ${star <= Math.round(rating) ? 'text-accent-yellow' : 'text-text-secondary/30'}`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-text-secondary ml-1 font-mono">{rating}</span>
    </div>
  )
}

export default App
