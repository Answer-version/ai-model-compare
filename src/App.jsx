import { useState, useMemo } from 'react'
import { models, providers, capabilities, scenarios, billingTypes, colorMap } from './data/models'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviders, setSelectedProviders] = useState([])
  const [selectedScenarios, setSelectedScenarios] = useState(['all'])
  const [selectedCapabilities, setSelectedCapabilities] = useState([])
  const [sortBy, setSortBy] = useState('provider')

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
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !model.provider.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      if (selectedProviders.length > 0 && !selectedProviders.includes(model.providerKey)) {
        return false
      }

      // Handle billing type scenarios (订阅/API/开源)
      if (!selectedScenarios.includes('all')) {
        const hasBillingFilter = selectedScenarios.includes('订阅') || 
                                selectedScenarios.includes('API') || 
                                selectedScenarios.includes('开源')
        const hasRegionFilter = selectedScenarios.includes('cn') || selectedScenarios.includes('global')
        const hasTagFilter = selectedScenarios.some(s => 
          s !== 'cn' && s !== 'global' && s !== '订阅' && s !== 'API' && s !== '开源')

        // Billing type filter
        if (hasBillingFilter) {
          const billingMatch = 
            (selectedScenarios.includes('订阅') && model.billingType === 'subscription') ||
            (selectedScenarios.includes('API') && model.billingType === 'api') ||
            (selectedScenarios.includes('开源') && model.billingType === 'free')
          if (!billingMatch) return false
        }

        // Region filter
        if (hasRegionFilter && !hasBillingFilter) {
          if (selectedScenarios.includes('cn') && model.region !== 'cn') return false
          if (selectedScenarios.includes('global') && model.region !== 'global') return false
        }

        // Tag filter
        if (hasTagFilter && !hasRegionFilter && !hasBillingFilter) {
          if (!selectedScenarios.some(s => model.tags.includes(s))) return false
        }
        
        // Combined filters (region + tag)
        if (hasTagFilter && hasRegionFilter) {
          const regionMatch = (selectedScenarios.includes('cn') && model.region === 'cn') ||
                            (selectedScenarios.includes('global') && model.region === 'global')
          const tagMatch = selectedScenarios.filter(s => 
            s !== 'cn' && s !== 'global' && s !== '订阅' && s !== 'API' && s !== '开源'
          ).some(s => model.tags.includes(s))
          if (!regionMatch || !tagMatch) return false
        }
      }

      if (selectedCapabilities.length > 0 && !selectedCapabilities.some(c => model.capabilities.includes(c))) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedProviders, selectedScenarios, selectedCapabilities])

  const sortedModels = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      if (sortBy === 'provider') return a.provider.localeCompare(b.provider)
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'inputPrice') return a.inputPrice - b.inputPrice
      if (sortBy === 'monthlyPrice') {
        const aPrice = a.plans?.[0]?.monthly ?? Infinity
        const bPrice = b.plans?.[0]?.monthly ?? Infinity
        return aPrice - bPrice
      }
      if (sortBy === 'firstMonthPrice') {
        const aPrice = a.plans?.[0]?.firstMonth ?? Infinity
        const bPrice = b.plans?.[0]?.firstMonth ?? Infinity
        return aPrice - bPrice
      }
      if (sortBy === 'context') {
        const aLen = parseInt(a.contextLength) || 0
        const bLen = parseInt(b.contextLength) || 0
        return bLen - aLen
      }
      return 0
    })
  }, [filteredModels, sortBy])

  const stats = useMemo(() => {
    const hotPlans = models.reduce((sum, m) => sum + (m.plans?.filter(p => p.hot).length || 0), 0)
    const subModels = models.filter(m => m.billingType === 'subscription').length
    const apiModels = models.filter(m => m.billingType === 'api').length
    const freeModels = models.filter(m => m.billingType === 'free').length
    return {
      totalModels: models.length,
      totalProviders: providers.length,
      filteredCount: filteredModels.length,
      hotPlans,
      subModels,
      apiModels,
      freeModels
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>🤖</span>
                AI 模型对比
              </h1>
              <p className="text-gray-500 text-sm mt-1">全球头部平台价格聚合 · 每日更新</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>更新日期：2026-03-31</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-xs mb-1">收录模型</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalModels}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-xs mb-1">订阅制</div>
            <div className="text-2xl font-bold text-orange-600">{stats.subModels}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-xs mb-1">API按量</div>
            <div className="text-2xl font-bold text-blue-600">{stats.apiModels}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-xs mb-1">开源免费</div>
            <div className="text-2xl font-bold text-green-600">{stats.freeModels}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-xs mb-1">当前筛选</div>
            <div className="text-2xl font-bold text-purple-600">{stats.filteredCount}</div>
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
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="provider">按厂商排序</option>
            <option value="rating">评分排序</option>
            <option value="inputPrice">API输入价排序</option>
            <option value="monthlyPrice">月价排序</option>
            <option value="firstMonthPrice">首月价排序</option>
            <option value="context">上下文排序</option>
          </select>
        </div>

        {/* Provider Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProviders([])}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedProviders.length === 0
                  ? 'bg-blue-100 border border-blue-300 text-blue-700'
                  : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
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
                    ? 'bg-blue-100 border border-blue-300 text-blue-700'
                    : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {provider.logo} {provider.name}
              </button>
            ))}
            <span className="text-gray-300 self-center">|</span>
            {providers.filter(p => p.region === 'global').map(provider => (
              <button
                key={provider.key}
                onClick={() => toggleProvider(provider.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedProviders.includes(provider.key)
                    ? 'bg-blue-100 border border-blue-300 text-blue-700'
                    : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {provider.logo} {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario & Capability Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.key}
                  onClick={() => toggleScenario(scenario.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedScenarios.includes(scenario.key)
                      ? 'bg-purple-100 border border-purple-300 text-purple-700'
                      : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
            <div className="border-l border-gray-200 pl-4 flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm self-center">能力:</span>
              {capabilities.map(cap => (
                <button
                  key={cap.key}
                  onClick={() => toggleCapability(cap.key)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedCapabilities.includes(cap.key)
                      ? 'bg-green-100 border border-green-300 text-green-700'
                      : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cap.icon} {cap.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Tip Banner */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center gap-4 text-sm flex-wrap">
            <span className="flex items-center gap-2 text-orange-700">
              <span className="bg-orange-100 px-2 py-0.5 rounded text-xs font-bold">📋</span>
              <span>订阅制 = 包月/包年套餐</span>
            </span>
            <span className="flex items-center gap-2 text-blue-700">
              <span className="bg-blue-100 px-2 py-0.5 rounded text-xs font-bold">💰</span>
              <span>API按量 = token计费</span>
            </span>
            <span className="flex items-center gap-2 text-green-700">
              <span className="bg-green-100 px-2 py-0.5 rounded text-xs font-bold">🆓</span>
              <span>开源免费 = 本地部署</span>
            </span>
            <span className="flex items-center gap-2 text-purple-700">
              <span className="bg-purple-100 px-2 py-0.5 rounded text-xs font-bold">👆</span>
              <span>点击模型行<strong>展开/收起</strong>套餐</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 text-left text-sm text-gray-600">
                  <th className="px-4 py-3 font-semibold">平台</th>
                  <th className="px-4 py-3 font-semibold">模型</th>
                  <th className="px-4 py-3 font-semibold">计费方式</th>
                  <th className="px-4 py-3 font-semibold">评分</th>
                  <th className="px-4 py-3 font-semibold">上下文</th>
                  <th className="px-4 py-3 font-semibold">首月价</th>
                  <th className="px-4 py-3 font-semibold">月价</th>
                  <th className="px-4 py-3 font-semibold">季价</th>
                  <th className="px-4 py-3 font-semibold">年价</th>
                  <th className="px-4 py-3 font-semibold">5h请求</th>
                  <th className="px-4 py-3 font-semibold">能力</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model, index) => (
                  <ModelRow key={model.id} model={model} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          {sortedModels.length === 0 && (
            <div className="text-center py-16 text-gray-400">
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
      <footer className="border-t border-gray-200 mt-12 bg-white">
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

function ModelRow({ model, index }) {
  const colors = colorMap[model.color] || colorMap.blue
  const [expanded, setExpanded] = useState(false)
  const firstPlan = model.plans?.[0]

  const formatPrice = (price, prefix = '¥') => {
    if (price === null || price === undefined) return '-'
    if (price === 0) return '免费'
    return `${prefix}${price}`
  }

  const hasExpandablePlans = model.plans && model.plans.length > 1
  
  const getBillingBadge = () => {
    switch(model.billingType) {
      case 'subscription':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">📋 订阅</span>
      case 'api':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">💰 API</span>
      case 'free':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">🆓 免费</span>
      default:
        return null
    }
  }

  return (
    <>
      <tr 
        className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${hasExpandablePlans ? 'cursor-pointer' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        onClick={() => hasExpandablePlans && setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{model.logo}</span>
            <span className="font-medium text-gray-900 text-sm">{model.provider}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${model.region === 'cn' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              {model.region === 'cn' ? '国内' : '全球'}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="font-semibold text-gray-900">{model.name}</div>
          <div className="text-xs text-gray-500 mt-0.5 flex gap-1">
            {model.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className={`${colors.text}`}>✨ {h}</span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          {getBillingBadge()}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-gray-900">{model.rating}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="font-mono text-gray-700 text-sm">{model.contextLength}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`font-bold ${firstPlan ? 'text-orange-600' : 'text-gray-400'}`}>
            {firstPlan ? '¥' + firstPlan.firstMonth : '-'}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`font-semibold ${firstPlan ? 'text-gray-900' : 'text-gray-400'}`}>
            {firstPlan ? '¥' + firstPlan.monthly + '/月' : '-'}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-gray-600">
            {firstPlan ? '¥' + firstPlan.quarterly : '-'}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-gray-600">
            {firstPlan ? '¥' + firstPlan.yearly : '-'}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-gray-600 text-sm">
            {firstPlan ? (firstPlan.requestsPer5h ? firstPlan.requestsPer5h.toLocaleString() : '未公开') : '-'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {model.capabilities.slice(0, 3).map((cap, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                {cap}
              </span>
            ))}
            {model.capabilities.length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-xs">
                +{model.capabilities.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={model.pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-200 transition-all"
            >
              官网详情
            </a>
            <a
              href={model.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-500 rounded-lg text-xs text-white font-medium hover:bg-blue-600 transition-all shadow-sm"
            >
              购买
            </a>
          </div>
        </td>
      </tr>
      {/* Expanded Plans Modal */}
      {hasExpandablePlans && expanded && (
        <tr className="border-b border-gray-100">
          <td colSpan={12} className="px-4 py-6 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{model.logo}</span>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{model.name}</div>
                  <div className="text-gray-500 text-sm">{model.provider} - 全部套餐</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                className="px-3 py-1.5 bg-gray-200 rounded-lg text-gray-500 hover:bg-gray-300 text-sm"
              >
                ✕ 关闭
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {model.plans.map((plan, i) => (
                <div key={i} className={`flex-1 min-w-[200px] max-w-[280px] p-5 rounded-2xl border-2 ${plan.hot ? 'border-orange-400 bg-white shadow-lg' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-gray-900 text-lg">{plan.name}</span>
                    {plan.hot && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-bold">🔥 热门</span>}
                    {plan.speed && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">{plan.speed}</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">首月价格</span>
                      <span className="font-bold text-orange-600 text-base">¥{plan.firstMonth}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">包月价格</span>
                      <span className="font-semibold text-gray-900">¥{plan.monthly}/月</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">包季价格</span>
                      <span className="text-gray-700">¥{plan.quarterly}/季</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">包年价格</span>
                      <span className="text-gray-700">¥{plan.yearly}/年</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">5小时请求数</span>
                      <span className="text-gray-700 font-medium">{plan.requestsPer5h ? plan.requestsPer5h.toLocaleString() : '未公开'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={model.pricingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all"
                    >
                      查看官网
                    </a>
                    <a
                      href={model.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-blue-500 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-all"
                    >
                      立即购买
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {hasExpandablePlans && (
              <div className="mt-4 text-center text-gray-400 text-sm">
                💡 点击任意模型行可展开/收起套餐详情
              </div>
            )}
          </td>
        </tr>
      )}
      {/* Show tip for rows with expandable plans */}
      {!expanded && hasExpandablePlans && (
        <tr className="border-b border-gray-100">
          <td colSpan={12} className="px-4 py-1 bg-blue-50/30">
            <div className="flex items-center gap-2 text-blue-500 text-xs">
              <span>👆</span>
              <span>点击上方行查看 {model.name} 的全部套餐详情</span>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default App
