import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const SALARY_TYPE_LABELS = { month: '元/月', hour: '元/小时', day: '元/天', negotiable: '面议' }

function formatSalary(min, max, type) {
  if (!min && !max) return '薪资面议'
  if (min && max) return `${Number(min).toLocaleString()}-${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
  if (min) return `${Number(min).toLocaleString()}+${SALARY_TYPE_LABELS[type] || '元/月'}`
  return `${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
}

export default function JobDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [company, setCompany] = useState(null)
  const [relatedJobs, setRelatedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/posts/${id}`).then(r => r.json()),
      fetch(`/api/companies?pageSize=20`).then(r => r.json()),
    ]).then(([postData, companyData]) => {
      if (postData.code === 200) {
        setPost(postData.data)
        if (postData.data.company_id) {
          fetch(`/api/companies/${postData.data.company_id}`).then(r => r.json()).then(c => {
            if (c.code === 200) setCompany(c.data)
          })
        }
        // 获取同公司其他职位
        if (postData.data.company_id) {
          fetch(`/api/posts?category=job&status=approved&pageSize=5`).then(r => r.json()).then(j => {
            if (j.code === 200) {
              setRelatedJobs(j.data.list.filter(p => p.id !== Number(id) && p.company_id === postData.data.company_id).slice(0, 3))
            }
          })
        }
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>
  if (!post) return <div className="text-center py-20 text-gray-400">职位不存在或已下架</div>

  const contactNumber = post.contact?.replace(/-/g, '').trim()

  return (
    <div className="space-y-5">
      {/* 面包屑 */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span className="mx-2">/</span>
        <Link to="/jobs" className="hover:text-primary">招聘求职</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">职位详情</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左侧：职位详情 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 职位标题卡片 */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded">急招</span>
                  <span className="text-gray-400 text-xs">浏览 {post.views}次</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <div className="flex flex-wrap gap-3 text-sm">
                  {post.location && (
                    <span className="text-gray-500">📍 {post.location}</span>
                  )}
                  {post.category_name && (
                    <span className="text-gray-500">🏷️ {post.category_name}</span>
                  )}
                  <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('zh-CN')} 发布</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-orange-500">{formatSalary(post.salary_min, post.salary_max, post.salary_type)}</div>
              </div>
            </div>

            {/* 联系方式按钮 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${contactNumber}`}
                  className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-bold text-base hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  📞 立即联系 HR
                </a>
                <a
                  href={`tel:${contactNumber}`}
                  className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center text-xl hover:bg-green-600 transition"
                  title="拨打电话"
                >
                  📱
                </a>
              </div>
              {post.contact && (
                <div className="text-center mt-2 text-sm text-gray-500">
                  <span>联系电话：</span>
                  <a href={`tel:${contactNumber}`} className="text-primary font-medium">{post.contact}</a>
                  <span className="text-xs text-gray-400 ml-2">（联系时请说明在安平同城网看到）</span>
                </div>
              )}
            </div>
          </div>

          {/* 职位描述 */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 border-l-4 border-primary pl-3 mb-4">职位详情</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 公司信息卡 */}
          {company && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 border-l-4 border-blue-500 pl-3 mb-4">招聘企业</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  🏭
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/company/${company.id}`} className="font-bold text-gray-900 hover:text-primary transition">
                    {company.name}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    {company.industry && <div>🏢 {company.industry}</div>}
                    {company.scale && <div>👥 {company.scale}</div>}
                    {company.address && <div>📍 {company.address}</div>}
                    {company.phone && <div>📞 {company.phone}</div>}
                  </div>
                  <div className="mt-2">
                    <Link to={`/company/${company.id}`} className="text-xs text-primary hover:underline">
                      查看公司主页 →
                    </Link>
                  </div>
                </div>
              </div>
              {company.description && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                  {company.description.slice(0, 150)}{company.description.length > 150 ? '...' : ''}
                </div>
              )}
            </div>
          )}

          {/* 同公司其他职位 */}
          {relatedJobs.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 border-l-4 border-green-500 pl-3 mb-4">该企业其他职位</h2>
              <div className="space-y-2">
                {relatedJobs.map(j => (
                  <Link key={j.id} to={`/job/${j.id}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-sm font-medium text-gray-700">{j.title}</span>
                    <span className="text-orange-500 text-sm font-bold shrink-0 ml-3">
                      {formatSalary(j.salary_min, j.salary_max, j.salary_type)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 安全提示 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
            <div className="font-bold mb-1">⚠️ 求职安全提示</div>
            <ul className="space-y-0.5">
              <li>• 正规用人单位不会向求职者收取任何费用</li>
              <li>• 警惕"高薪资"、"轻松赚钱"等诱惑，谨防诈骗</li>
              <li>• 如遇可疑情况，请立即停止联系并向平台举报</li>
              <li>• 本平台对信息内容不承担法律责任，请自行核实</li>
            </ul>
          </div>
        </div>

        {/* 右侧：侧边栏 */}
        <div className="space-y-4">
          {/* 快速联系卡片 */}
          <div className="bg-gradient-to-b from-orange-500 to-orange-600 rounded-xl p-5 text-white sticky top-20">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📞</div>
              <div className="text-sm opacity-90">点击下方按钮直接致电</div>
            </div>
            <a
              href={`tel:${contactNumber}`}
              className="block w-full bg-white text-orange-500 text-center py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
            >
              {post.contact || '立即拨打'}
            </a>
            <div className="text-center text-xs opacity-75 mt-3">
              工作日 9:00-18:00 咨询效果更佳
            </div>
            <div className="mt-4 text-xs opacity-80 text-center">
              <p>📱 联系时说明在"安平同城网"看到</p>
              <p className="mt-1">本平台建议优先选择有实名认证的企业</p>
            </div>
          </div>

          {/* 温馨提示 */}
          <div className="bg-white rounded-xl shadow-sm p-4 text-xs text-gray-600">
            <div className="font-bold text-gray-800 mb-2">💡 温馨提示</div>
            <ul className="space-y-1.5">
              <li>• 打电话前先了解公司背景</li>
              <li>• 询问清楚薪资构成和发放时间</li>
              <li>• 了解工作地点和环境</li>
              <li>• 确认食宿、保险等福利</li>
              <li>• 最好白天去面试，注意安全</li>
            </ul>
          </div>

          {/* 安全警示 */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-xs text-gray-600">
              <div className="font-bold text-red-500 mb-2">🚨 免责声明</div>
              <p className="leading-relaxed">本平台仅为信息发布渠道，所有招聘信息均由企业自行发布。求职者应自行核实信息真实性，因招聘产生的一切纠纷与本平台无关。遇到收取费用的情况，请立即拒绝并举报。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
