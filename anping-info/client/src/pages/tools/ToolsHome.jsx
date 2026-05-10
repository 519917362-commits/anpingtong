import { Link } from 'react-router-dom'

const tools = [
  {
    icon: '🛠️',
    title: '丝网报价工具',
    desc: '根据目数、丝径、材质、尺寸自动计算丝网产品价格',
    path: '/tools/wiremesh',
    color: 'purple',
    features: ['多种规格参数可选', '实时计算报价', '支持批量报价'],
  },
  {
    icon: '🔊',
    title: '声屏障报价计算器',
    desc: '专业声屏障工程报价工具，适用于公路、铁路、小区隔音墙',
    path: '/tools/sound-barrier',
    color: 'blue',
    features: ['多种隔音材料', '立柱规格选择', '基础类型配置'],
  },
  {
    icon: '🚚',
    title: '物流查询',
    desc: '支持主流快递/物流单号查询，实时追踪货物状态',
    path: '/tools/logistics',
    color: 'cyan',
    features: ['支持顺丰/中通/圆通/韵达等', '实时物流状态更新', '历史记录查询'],
    status: '即将上线',
    statusType: 'coming',
  },
  {
    icon: '📊',
    title: '原材料行情',
    desc: '钢丝、盘条、不锈钢丝等原材料每日市场参考价格',
    path: '/tools/materials',
    color: 'green',
    features: ['每日价格更新', '历史价格走势', '多材质对比'],
    status: '即将上线',
    statusType: 'coming',
  },
]

const colorMap = {
  blue:    { from: 'from-blue-50', to: 'to-blue-100', border: 'border-blue-200', accent: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  cyan:    { from: 'from-cyan-50', to: 'to-cyan-100', border: 'border-cyan-200', accent: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
  purple:  { from: 'from-purple-50', to: 'to-purple-100', border: 'border-purple-200', accent: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  green:   { from: 'from-green-50', to: 'to-green-100', border: 'border-green-200', accent: 'text-green-600', badge: 'bg-green-100 text-green-700' },
}

export default function ToolsHome() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl p-6 text-white mb-6">
        <h1 className="text-xl font-bold mb-1">🛠️ 便民工具中心</h1>
        <p className="text-sm opacity-90">专为安平本地居民和企业打造的实用工具集</p>
      </div>

      <div className="space-y-6">
        {tools.map(tool => {
          const c = colorMap[tool.color]
          return (
            <div key={tool.path} className={`bg-gradient-to-br ${c.from} ${c.to} border ${c.border} rounded-xl p-6`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{tool.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-gray-800">{tool.title}</h2>
                    {tool.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{tool.status}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.features.map(f => (
                      <span key={f} className="text-xs bg-white/70 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                  {tool.status ? (
                    <span className={`inline-flex items-center gap-1.5 ${c.accent} text-sm font-medium opacity-60 cursor-not-allowed`}>
                      敬请期待
                    </span>
                  ) : (
                    <Link
                      to={tool.path}
                      className={`inline-flex items-center gap-1.5 ${c.accent} text-sm font-medium hover:underline`}
                    >
                      立即使用 →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
