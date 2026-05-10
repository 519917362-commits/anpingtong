import { useState } from 'react'

const MATERIAL_TYPES = [
  { value: 'pc', label: 'PC耐力板', price: 280, desc: '透光性好，重量轻' },
  { value: 'glass', label: '钢化玻璃', price: 180, desc: '隔音效果好' },
  { value: 'metal', label: '金属隔音板', price: 350, desc: '强度高，耐用' },
  { value: 'composite', label: '复合隔音板', price: 420, desc: '综合性能最佳' },
]

const COLUMN_TYPES = [
  { value: 'h100', label: 'H100立柱', height: 1.8, price: 85 },
  { value: 'h120', label: 'H120立柱', height: 2.0, price: 98 },
  { value: 'h140', label: 'H140立柱', height: 2.2, price: 115 },
  { value: 'h160', label: 'H160立柱', height: 2.5, price: 135 },
  { value: 'h180', label: 'H180立柱', height: 2.8, price: 158 },
]

const FOUNDATION_TYPES = [
  { value: 'shallow', label: '浅基础', price: 120, desc: '适用于普通路面' },
  { value: 'deep', label: '深基础', price: 180, desc: '适用于桥梁、高架' },
  { value: 'pile', label: '桩基础', price: 250, desc: '适用于软土地基' },
]

function calcSoundBarrier(length, height, material, column, foundation, qty = 1) {
  if (!length || !height || !material || !column || !foundation) return null

  const mat = MATERIAL_TYPES.find(m => m.value === material)
  const col = COLUMN_TYPES.find(c => c.value === column)
  const found = FOUNDATION_TYPES.find(f => f.value === foundation)

  if (!mat || !col || !found) return null

  const area = length * height // 总面积 m²
  const panelCost = area * mat.price // 隔音板费用
  const columnCount = Math.ceil(length / 2) // 立柱数量（每2米一根）
  const columnCost = columnCount * col.price // 立柱费用
  const foundationCost = columnCount * found.price // 基础费用
  const installCost = area * 45 // 安装费用
  const transportCost = area * 8 // 运输费用

  const totalCost = (panelCost + columnCost + foundationCost + installCost + transportCost) * 1.1 // 含10%损耗

  return {
    area: Math.round(area * 100) / 100,
    panelCost: Math.round(panelCost * 100) / 100,
    columnCost: Math.round(columnCost * 100) / 100,
    columnCount,
    foundationCost: Math.round(foundationCost * 100) / 100,
    installCost: Math.round(installCost * 100) / 100,
    transportCost: Math.round(transportCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    unitPrice: Math.round(totalCost / area * 100) / 100,
  }
}

export default function SoundBarrierCalculator() {
  const [length, setLength] = useState('')
  const [height, setHeight] = useState('')
  const [material, setMaterial] = useState('composite')
  const [column, setColumn] = useState('h140')
  const [foundation, setFoundation] = useState('shallow')
  const [result, setResult] = useState(null)

  const handleCalc = (e) => {
    e.preventDefault()
    const r = calcSoundBarrier(
      parseFloat(length) || 0,
      parseFloat(height) || 0,
      material,
      column,
      foundation
    )
    setResult(r)
  }

  const handleReset = () => {
    setLength('')
    setHeight('')
    setMaterial('composite')
    setColumn('h140')
    setFoundation('shallow')
    setResult(null)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold mb-1">🔊 声屏障报价计算器</h1>
            <p className="text-sm opacity-90">专业声屏障工程报价参考，适用于公路、铁路、小区隔音墙</p>
          </div>
          <a
            href="/tools/sound-barrier-pro"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition flex items-center gap-1.5"
          >
            <span>🚀</span>
            <span>高级版</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 参数表单 */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">声屏障长度 (米)</label>
                <input
                  type="number"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  placeholder="如：100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">声屏障高度 (米)</label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="如：3.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 隔音材料选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">隔音材料</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MATERIAL_TYPES.map(m => (
                  <label
                    key={m.value}
                    className={`border rounded-lg p-3 cursor-pointer transition text-center ${
                      material === m.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="material"
                      value={m.value}
                      checked={material === m.value}
                      onChange={() => setMaterial(m.value)}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">¥{m.price}/m²</div>
                    <div className="text-xs text-blue-600 mt-1">{m.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 立柱规格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">立柱规格</label>
              <div className="grid grid-cols-5 gap-2">
                {COLUMN_TYPES.map(c => (
                  <label
                    key={c.value}
                    className={`border rounded-lg p-2 cursor-pointer transition text-center ${
                      column === c.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="column"
                      value={c.value}
                      checked={column === c.value}
                      onChange={() => setColumn(c.value)}
                      className="sr-only"
                    />
                    <div className="text-xs font-medium">{c.label}</div>
                    <div className="text-xs text-gray-500">H{c.height}m</div>
                    <div className="text-xs text-blue-600 mt-1">¥{c.price}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 基础类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">基础类型</label>
              <div className="grid grid-cols-3 gap-3">
                {FOUNDATION_TYPES.map(f => (
                  <label
                    key={f.value}
                    className={`border rounded-lg p-3 cursor-pointer transition ${
                      foundation === f.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="foundation"
                      value={f.value}
                      checked={foundation === f.value}
                      onChange={() => setFoundation(f.value)}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                    <div className="text-xs text-blue-600 mt-1">¥{f.price}/根</div>
                  </label>
                ))}
              </div>
            </div>

            {/* 计算按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                计算报价
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                重置
              </button>
            </div>
          </form>

          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
            💡 提示：声屏障报价受多种因素影响，包括材料品牌、施工难度、地形条件等。此报价为参考价格，实际价格以供应商报价为准。
          </div>
        </div>

        {/* 结果面板 */}
        <div>
          {result ? (
            <div className="bg-white rounded-xl border border-blue-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-center text-white">
                <p className="text-xs opacity-90 mb-1">参考报价</p>
                <p className="text-3xl font-bold">¥{result.totalCost.toLocaleString()}</p>
                <p className="text-sm opacity-90">元</p>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">总面积</span>
                  <span className="font-medium">{result.area} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">立柱数量</span>
                  <span className="font-medium">{result.columnCount} 根</span>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <p className="text-xs text-gray-500 font-medium">费用明细</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">隔音板</span>
                    <span className="font-medium">¥{result.panelCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">立柱</span>
                    <span className="font-medium">¥{result.columnCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">基础</span>
                    <span className="font-medium">¥{result.foundationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">安装</span>
                    <span className="font-medium">¥{result.installCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">运输</span>
                    <span className="font-medium">¥{result.transportCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">综合单价</span>
                    <span className="font-bold text-blue-600">¥{result.unitPrice}/m²</span>
                  </div>
                </div>

                <button className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                  咨询供应商
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center sticky top-24">
              <div className="text-5xl mb-3">🔊</div>
              <p className="text-gray-500 text-sm">填写声屏障参数</p>
              <p className="text-gray-400 text-xs mt-1">即可获取参考报价</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
