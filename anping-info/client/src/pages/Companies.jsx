import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const INDUSTRY_OPTIONS = ['全部', '制造业', '建筑', '服务', '教育', '医疗', '物流', '商贸', '其他']

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('全部')
  const [total, setTotal] = useState(0)

  const fetchCompanies = () => {
    setLoading(true)
    const params = new URLSearchParams({ pageSize: 50 })
    if (keyword) params.set('keyword', keyword)
    if (industry !== '全部') params.set('industry', industry)
    fetch(`/api/companies?${params}`).then(r => r.json()).then(data => {
      if (data.code === 200) {
        setCompanies(data.data.list)
        setTotal(data.data.total)
      }
      setLoading(false)
    })
  }

  useEffect(() => { fetchCompanies() }, [])
  useEffect(() => { fetchCompanies() }, [industry])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCompanies()
  }

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🏢 安平企业黄页</h1>
        <p className="opacity-80 text-sm">汇集安平县知名企业，了解企业信息，找到好工作</p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex gap-3 items-center">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索公司名称..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            搜索
          </button>
          <span className="text-sm text-gray-500">共 <strong className="text-primary">{total}</strong> 家企业</span>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {INDUSTRY_OPTIONS.map(ind => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                industry === ind
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* 公司列表 */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">加载中...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl">
          <div className="text-5xl mb-3">🏢</div>
          <p>暂无符合条件的企业</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map(c => (
            <Link
              key={c.id}
              to={`/company/${c.id}`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-transparent hover:border-indigo-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  🏭
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{c.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                    {c.industry && <span className="bg-gray-100 px-2 py-0.5 rounded">{c.industry}</span>}
                    {c.scale && <span className="bg-gray-100 px-2 py-0.5 rounded">{c.scale}</span>}
                  </div>
                  {c.address && (
                    <div className="mt-1 text-xs text-gray-400 truncate">📍 {c.address}</div>
                  )}
                  {c.phone && (
                    <div className="mt-0.5 text-xs text-gray-400">📞 {c.phone}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
