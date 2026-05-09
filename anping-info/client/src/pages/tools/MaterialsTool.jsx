import { useState } from 'react'

const MATERIALS = [
  {
    name: 'Q235盘条',
    specs: ['Φ6.5mm', 'Φ8mm', 'Φ10mm'],
    unit: '元/吨',
    trend: '+120',
    trendUp: true,
    color: 'blue',
    history: [4200, 4180, 4220, 4250, 4280, 4300, 4320],
  },
  {
    name: '304不锈钢丝',
    specs: ['Φ1.0mm', 'Φ2.0mm', 'Φ3.0mm'],
    unit: '元/吨',
    trend: '-80',
    trendUp: false,
    color: 'green',
    history: [18500, 18400, 18350, 18400, 18500, 18450, 18420],
  },
  {
    name: '热镀锌丝',
    specs: ['Φ2.0mm', 'Φ3.0mm', 'Φ4.0mm'],
    unit: '元/吨',
    trend: '+60',
    trendUp: true,
    color: 'orange',
    history: [6800, 6820, 6810, 6830, 6850, 6870, 6860],
  },
  {
    name: 'PVC包塑丝',
    specs: ['Φ2.0mm', 'Φ3.0mm'],
    unit: '元/吨',
    trend: '+200',
    trendUp: true,
    color: 'purple',
    history: [9200, 9150, 9200, 9250, 9300, 9350, 9400],
  },
  {
    name: '黑铁丝',
    specs: ['Φ0.7mm', 'Φ1.0mm', 'Φ1.5mm'],
    unit: '元/吨',
    trend: '+50',
    trendUp: true,
    color: 'gray',
    history: [5100, 5120, 5130, 5140, 5150, 5150, 5150],
  },
  {
    name: '316不锈钢丝',
    specs: ['Φ1.0mm', 'Φ2.0mm'],
    unit: '元/吨',
    trend: '-150',
    trendUp: false,
    color: 'teal',
    history: [24000, 24100, 24200, 24100, 24000, 23950, 23850],
  },
]

const colorMap = {
  blue:   { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', bar: 'bg-blue-400' },
  green:  { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600', bar: 'bg-green-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'text-orange-600', bar: 'bg-orange-400' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600', bar: 'bg-purple-400' },
  gray:   { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600', bar: 'bg-gray-400' },
  teal:   { bg: 'bg-teal-50', border: 'border-teal-200', accent: 'text-teal-600', bar: 'bg-teal-400' },
}

function MiniChart({ history, up }) {
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * 100
    const y = 100 - ((v - min) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 40" className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#34d399' : '#f87171'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={up ? '#34d399' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,40 ${pts} 100,40`}
        fill={`url(#grad-${up})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={up ? '#34d399' : '#f87171'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function MaterialsTool() {
  const [selected, setSelected] = useState(MATERIALS[0])

  return (
    <div>
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-5 text-white mb-6">
        <h1 className="text-lg font-bold mb-1">📊 原材料行情</h1>
        <p className="text-sm opacity-90">安平丝网行业常用原材料参考价格，每日更新</p>
      </div>

      {/* 价格卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {MATERIALS.map(m => {
          const c = colorMap[m.color]
          const latest = m.history[m.history.length - 1]
          return (
            <div
              key={m.name}
              onClick={() => setSelected(m)}
              className={`cursor-pointer rounded-xl border p-4 transition ${
                selected.name === m.name
                  ? `${c.bg} ${c.border} border-2`
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-bold text-sm ${selected.name === m.name ? c.accent : 'text-gray-800'}`}>{m.name}</h3>
                  <p className="text-xs text-gray-400">{m.specs[0]}</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  m.trendUp ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {m.trendUp ? '↑' : '↓'} {Math.abs(parseInt(m.trend))}
                </span>
              </div>
              <div className={`text-xl font-bold ${selected.name === m.name ? c.accent : 'text-gray-900'}`}>
                {latest.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mb-2">{m.unit}</div>
              <MiniChart history={m.history} up={m.trendUp} />
            </div>
          )
        })}
      </div>

      {/* 详情面板 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{selected.name}</h2>
            <p className="text-sm text-gray-400">参考价：{selected.history[selected.history.length - 1].toLocaleString()} {selected.unit}（最新）</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            selected.trendUp ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            较昨日 {selected.trendUp ? '+' : ''}{selected.trend} 元/吨
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">常用规格</p>
          <div className="flex gap-2">
            {selected.specs.map(s => (
              <span key={s} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">近7日价格走势</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs">
                  <th className="text-left pb-2">日期</th>
                  <th className="text-right pb-2">价格 ({selected.unit})</th>
                  <th className="text-right pb-2">涨跌</th>
                </tr>
              </thead>
              <tbody>
                {['周一','周二','周三','周四','周五','周六','周日'].map((day, i) => {
                  const price = selected.history[i]
                  const prev = i > 0 ? selected.history[i-1] : price
                  const diff = price - prev
                  return (
                    <tr key={day} className="border-t border-gray-50">
                      <td className="py-2 text-gray-500">{day}</td>
                      <td className="py-2 text-right font-medium">{price.toLocaleString()}</td>
                      <td className={`py-2 text-right text-xs ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                        {i === 0 ? '—' : (diff > 0 ? '+' : '') + diff}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
          ⚠️ 本价格仅供参考，实际成交价受品质、品牌、付款方式、市场供需等因素影响。建议联系供应商获取实时报价。
        </div>
      </div>
    </div>
  )
}
