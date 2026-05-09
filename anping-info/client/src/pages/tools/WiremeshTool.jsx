import { useState } from 'react'

const MATERIALS = [
  { value: 'q235', label: 'Q235低碳钢丝', basePrice: 5.2 },
  { value: '不锈钢304', label: '304不锈钢丝', basePrice: 18.5 },
  { value: '不锈钢316', label: '316不锈钢丝', basePrice: 24.0 },
  { value: '镀锌丝', label: '热镀锌丝', basePrice: 6.8 },
]

const WEAVE_TYPES = [
  { value: '平织', factor: 1.0, desc: '最常见的编织方式' },
  { value: '斜织', factor: 1.15, desc: '斜纹编织，强度更高' },
  { value: '荷兰织', factor: 1.2, desc: '过滤网常用' },
]

function calcPrice(material, meshCount, wireDia, width, length, weave, qty) {
  if (!material || !meshCount || !wireDia || !width || !length) return null
  const mat = MATERIALS.find(m => m.value === material)
  if (!mat) return null
  const weaveF = WEAVE_TYPES.find(w => w.value === weave)?.factor || 1.0
  const area = width * length / 10000 // 平方米
  const weight = area * (1 / meshCount) * wireDia * 0.00698 * 100 * 1.1 // 估算重量 kg
  const materialCost = weight * mat.basePrice
  const processCost = area * 3.5 // 加工费 元/平方米
  const unitPrice = (materialCost + processCost) * weaveF
  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice: Math.round(unitPrice * qty * 100) / 100,
    weight: Math.round(weight * 100) / 100,
    area: Math.round(area * 100) / 100,
  }
}

export default function WiremeshTool() {
  const [material, setMaterial] = useState('q235')
  const [meshCount, setMeshCount] = useState('')
  const [wireDia, setWireDia] = useState('')
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [weave, setWeave] = useState('平织')
  const [qty, setQty] = useState(1)
  const [result, setResult] = useState(null)

  const handleCalc = (e) => {
    e.preventDefault()
    const r = calcPrice(material, parseFloat(meshCount), parseFloat(wireDia), parseFloat(width), parseFloat(length), weave, parseInt(qty) || 1)
    setResult(r)
  }

  const handleReset = () => {
    setMaterial('q235')
    setMeshCount('')
    setWireDia('')
    setWidth('')
    setLength('')
    setWeave('平织')
    setQty(1)
    setResult(null)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white mb-6">
        <h1 className="text-lg font-bold mb-1">🛠️ 丝网报价工具</h1>
        <p className="text-sm opacity-90">根据丝网规格快速计算参考价格，适用于安平本地丝网采购参考</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 参数表单 */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">材质</label>
                <select
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目数 (目/英寸)</label>
                <input
                  type="number"
                  value={meshCount}
                  onChange={e => setMeshCount(e.target.value)}
                  placeholder="如：60"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">丝径 (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={wireDia}
                  onChange={e => setWireDia(e.target.value)}
                  placeholder="如：0.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">幅宽 (mm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  placeholder="如：1000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">长度 (mm)</label>
                <input
                  type="number"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  placeholder="如：30000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数量 (卷/张)</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">编织方式</label>
              <div className="flex gap-3">
                {WEAVE_TYPES.map(w => (
                  <label key={w.value} className={`flex-1 border rounded-lg p-3 cursor-pointer transition text-center ${weave === w.value ? 'border-primary bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    <input type="radio" name="weave" value={w.value} checked={weave === w.value} onChange={() => setWeave(w.value)} className="sr-only" />
                    <div className="text-sm font-medium">{w.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{w.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                计算报价
              </button>
              <button type="button" onClick={handleReset} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                重置
              </button>
            </div>
          </form>

          <div className="mt-3 bg-purple-50 border border-purple-100 rounded-lg p-3 text-xs text-purple-700">
            💡 提示：此报价为参考价格，实际成交价受市场波动、订单量、付款方式等因素影响，请联系供应商确认
          </div>
        </div>

        {/* 结果面板 */}
        <div>
          {result ? (
            <div className="bg-white rounded-xl border border-purple-200 overflow-hidden sticky top-24">
              <div className="bg-purple-50 border-b border-purple-100 p-4 text-center">
                <p className="text-xs text-purple-600 mb-1">参考报价</p>
                <p className="text-3xl font-bold text-purple-700">¥{result.unitPrice}</p>
                <p className="text-sm text-purple-500">元/平方米</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">数量</span>
                  <span className="font-medium">{qty} 卷/张</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">面积</span>
                  <span className="font-medium">{result.area} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">预估重量</span>
                  <span className="font-medium">{result.weight} kg</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-700 font-medium">总价</span>
                  <span className="text-xl font-bold text-purple-600">¥{result.totalPrice}</span>
                </div>
                <button className="w-full mt-2 bg-accent text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dark transition">
                  联系供应商询价
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 sticky top-24">
              <p className="text-4xl mb-3">🧮</p>
              <p className="text-sm">填写参数后点击<br/>"计算报价"即可获取参考价格</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
