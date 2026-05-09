import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const SALARY_TYPE_LABELS = { month: '元/月', hour: '元/小时', day: '元/天', negotiable: '面议' }

function formatSalary(min, max, type) {
  if (!min && !max) return '面议'
  if (min && max) return `${Number(min).toLocaleString()}-${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
  if (min) return `${Number(min).toLocaleString()}+${SALARY_TYPE_LABELS[type] || '元/月'}`
  return `${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
}

export default function CompanyDetail() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/companies/${id}`).then(r => r.json()).then(data => {
      if (data.code === 200) setCompany(data.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>
  if (!company) return <div className="text-center py-20 text-gray-400">企业不存在</div>

  const contactNumber = company.phone?.replace(/-/g, '').trim()

  return (
    <div className="space-y-5">
      {/* 面包屑 */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span className="mx-2">/</span>
        <Link to="/companies" className="hover:text-primary">企业黄页</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{company.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左侧：公司信息 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 公司基本信息卡 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center text-4xl shrink-0">
                🏭
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {company.industry && (
                    <div>🏢 行业：<span className="text-gray-800">{company.industry}</span></div>
                  )}
                  {company.scale && (
                    <div>👥 规模：<span className="text-gray-800">{company.scale}</span></div>
                  )}
                  {company.address && (
                    <div className="col-span-2">📍 地址：<span className="text-gray-800">{company.address}</span></div>
                  )}
                  {company.phone && (
                    <div>📞 电话：<a href={`tel:${contactNumber}`} className="text-primary">{company.phone}</a></div>
                  )}
                  {company.website && (
                    <div>🌐 网站：<a href={company.website} target="_blank" className="text-primary">{company.website}</a></div>
                  )}
                </div>
                {company.jobCount > 0 && (
                  <Link
                    to={`/jobs?company=${company.id}`}
                    className="inline-flex items-center gap-1 mt-3 bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    查看在招职位 ({company.jobCount})
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 公司简介 */}
          {company.description && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-4">公司简介</h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {company.description}
              </div>
            </div>
          )}

          {/* 在招职位 */}
          {company.jobs && company.jobs.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 border-l-4 border-green-500 pl-3">在招职位</h2>
                <Link to="/jobs" className="text-xs text-primary hover:underline">查看更多 →</Link>
              </div>
              <div className="space-y-2">
                {company.jobs.map(job => (
                  <Link
                    key={job.id}
                    to={`/job/${job.id}`}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.location}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-orange-500 font-bold text-sm">{formatSalary(job.salary_min, job.salary_max, job.salary_type)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：联系卡片 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-indigo-500 to-purple-500 rounded-xl p-5 text-white sticky top-20">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-sm opacity-90">联系企业HR</div>
            </div>
            {company.phone ? (
              <>
                <a
                  href={`tel:${contactNumber}`}
                  className="block w-full bg-white text-indigo-600 text-center py-3 rounded-xl font-bold hover:bg-gray-100 transition"
                >
                  📞 {company.phone}
                </a>
                <div className="text-center text-xs opacity-75 mt-3">
                  联系时请说明在"安平同城网"看到
                </div>
              </>
            ) : (
              <div className="text-center text-sm opacity-75">
                暂无联系电话，请查看公司详情页
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-xs text-gray-600">
            <div className="font-bold text-gray-800 mb-2">💡 温馨提示</div>
            <ul className="space-y-1.5">
              <li>• 面试前先核实公司信息</li>
              <li>• 了解清楚薪资福利待遇</li>
              <li>• 拒绝缴纳任何押金费用</li>
              <li>• 签订正规劳动合同</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
