import { useState } from 'react'

const CARRIERS = [
  { name: '顺丰速运', code: 'SF', logo: '📦' },
  { name: '中通快递', code: 'ZTO', logo: '📮' },
  { name: '圆通速递', code: 'YTO', logo: '✉️' },
  { name: '韵达快递', code: 'YD', logo: '📨' },
  { name: '申通快递', code: 'STO', logo: '📩' },
  { name: '极兔速递', code: 'JTSD', logo: '🐰' },
  { name: '京东物流', code: 'JD', logo: '🟠' },
  { name: '德邦快递', code: 'DBL', logo: '🚛' },
]

const DEMO_TRACKING = {
  'SF1234567890': {
    company: '顺丰速运',
    status: '在途',
    latest: '包裹已到达【衡水转运中心】，正在分拣中',
    details: [
      { time: '2026-05-09 08:30', desc: '包裹已到达【衡水转运中心】', location: '衡水市' },
      { time: '2026-05-08 22:15', desc: '已离开【石家庄分拨中心】，发往【衡水转运中心】', location: '石家庄市' },
      { time: '2026-05-08 18:40', desc: '已到达【石家庄分拨中心】', location: '石家庄市' },
      { time: '2026-05-08 14:20', desc: '已揽收，正在发出', location: '安平县' },
    ],
  },
  'ZTO9876543210': {
    company: '中通快递',
    status: '已签收',
    latest: '您的包裹已被【前台/门卫】签收，感谢使用中通快递',
    details: [
      { time: '2026-05-09 09:12', desc: '已签收，感谢使用中通快递', location: '安平县' },
      { time: '2026-05-09 08:45', desc: '派送中，您的快递员正在为您派送', location: '安平县' },
      { time: '2026-05-09 06:30', desc: '已到达【安平县网点】，正在分拣', location: '安平县' },
      { time: '2026-05-08 20:10', desc: '已离开【衡水转运中心】', location: '衡水市' },
      { time: '2026-05-08 14:00', desc: '已揽收', location: '外地' },
    ],
  },
}

export default function LogisticsTool() {
  const [trackingNo, setTrackingNo] = useState('')
  const [selectedCarrier, setSelectedCarrier] = useState('SF')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleQuery = async (e) => {
    e.preventDefault()
    if (!trackingNo.trim()) return
    setLoading(true)
    setResult(null)

    // 模拟查询延迟
    await new Promise(r => setTimeout(r, 800))

    const data = DEMO_TRACKING[trackingNo.trim().toUpperCase()]
    if (data) {
      setResult(data)
    } else {
      setResult({ error: true, message: '未查询到物流信息，请核实单号是否正确' })
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white mb-6">
        <h1 className="text-lg font-bold mb-1">🚚 物流查询</h1>
        <p className="text-sm opacity-90">输入快递单号，实时查询物流状态</p>
      </div>

      {/* 查询表单 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <form onSubmit={handleQuery}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择快递公司</label>
            <div className="flex flex-wrap gap-2">
              {CARRIERS.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCarrier(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition flex items-center gap-1.5 ${
                    selectedCarrier === c.code
                      ? 'border-primary bg-blue-50 text-primary font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-primary'
                  }`}
                >
                  <span>{c.logo}</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              value={trackingNo}
              onChange={e => setTrackingNo(e.target.value)}
              placeholder="请输入快递单号"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !trackingNo.trim()}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition"
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
        </form>

        <div className="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
          💡 提示：可输入示例单号 <code className="bg-blue-100 px-1 rounded">SF1234567890</code> 或 <code className="bg-blue-100 px-1 rounded">ZTO9876543210</code> 查看演示效果
        </div>
      </div>

      {/* 查询结果 */}
      {result && (
        result.error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-4xl mb-2">❓</p>
            <p className="text-red-700">{result.message}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{result.company}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    result.status === '已签收' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>{result.status}</span>
                </div>
                <p className="text-sm text-gray-600">{result.latest}</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
            <div className="p-4">
              <div className="space-y-0">
                {result.details.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`} />
                      {i < result.details.length - 1 && <div className="w-0.5 h-12 bg-gray-200" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm text-gray-800">{item.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time} · {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
