import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LOCATION_OPTIONS = ['全部', '县城', '工业园区', '经济开发区', '城东', '城西', '马店镇', '南王庄镇', '大子文镇', '东黄城镇', '全县域']
const SALARY_OPTIONS = [
  { label: '不限', value: 'all' },
  { label: '3000以下', value: '0-3000' },
  { label: '3000-5000', value: '3000-5000' },
  { label: '5000-8000', value: '5000-8000' },
  { label: '8000-15000', value: '8000-15000' },
  { label: '15000以上', value: '15000-999999' },
]
const JOB_TYPE_OPTIONS = [
  '普工/车间工', '丝网报价员', '内贸业务员', '外贸业务员', '丝网技工/技工',
  '拔丝/退火/看炉工', '电焊/二保/氩弧焊', '店长/厂长/经理', '会计/财务',
  '设计/网络运营', '销售/营业员', '化妆/美发', '司机/保安', '维修工人',
  '零工/计件/学徒', '洗车美容工', '教师/护士', '织网/整经工', '库管/质检',
  '快递员/送货员', '客服/文员', '其他职位', '收银/服务员', '做饭/厨师',
  '保洁/门卫', '抻网工', '抖音快手主播'
]
const SALARY_TYPE_LABELS = { month: '元/月', hour: '元/小时', day: '元/天', negotiable: '面议' }

function formatSalary(min, max, type) {
  if (!min && !max) return '薪资面议'
  if (min && max) return `${Number(min).toLocaleString()}-${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
  if (min) return `${Number(min).toLocaleString()}+${SALARY_TYPE_LABELS[type] || '元/月'}`
  return `${Number(max).toLocaleString()}${SALARY_TYPE_LABELS[type] || '元/月'}`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return dateStr.slice(0, 10)
}

export default function Jobs() {
  const [posts, setPosts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('全部')
  const [salaryRange, setSalaryRange] = useState('all')
  const [jobType, setJobType] = useState('')
  const [showAllJobTypes, setShowAllJobTypes] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchJobs = () => {
    setLoading(true)
    const params = new URLSearchParams({ category: 'jobs-recruit', pageSize: 50, status: 'approved' })
    if (keyword) params.set('keyword', keyword)

    Promise.all([
      fetch(`/api/posts?${params}`).then(r => r.json()),
      fetch('/api/companies?pageSize=20').then(r => r.json()),
    ]).then(([postData, companyData]) => {
      if (postData.code === 200) {
        let jobs = postData.data.list
        if (location !== '全部') {
          jobs = jobs.filter(j => j.location.includes(location))
        }
        if (salaryRange !== 'all') {
          const [min, max] = salaryRange.split('-').map(Number)
          jobs = jobs.filter(j => {
            const jMin = j.salary_min || 0
            const jMax = j.salary_max || 0
            if (min === 0) return jMax <= max
            return jMin >= min
          })
        }
        if (jobType) {
          jobs = jobs.filter(j => j.job_type === jobType)
        }
        setPosts(jobs)
        setTotal(postData.data.total)
      }
      if (companyData.code === 200) {
        setCompanies(companyData.data.list.slice(0, 12))
      }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])
  useEffect(() => { fetchJobs() }, [location, salaryRange, jobType])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">💼 招聘求职</h1>
        <p className="opacity-80 text-sm">安平县本地招聘信息，找工作、招人才，就来安平同城网</p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex gap-3 items-center flex-wrap">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索职位、公司名称..."
            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            搜索职位
          </button>
          <span className="text-sm text-gray-500">共找到 <strong className="text-primary">{total}</strong> 个职位</span>
        </form>

        {/* 区域筛选 */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">区域：</span>
          {LOCATION_OPTIONS.map(loc => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                location === loc
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* 薪资筛选 */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">薪资：</span>
          {SALARY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSalaryRange(opt.value)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                salaryRange === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 岗位类型筛选 */}
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 self-center shrink-0">岗位：</span>
            {showAllJobTypes ? (
              <>
                {JOB_TYPE_OPTIONS.map(type => (
                  <button
                    key={type}
                    onClick={() => setJobType(jobType === type ? '' : type)}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      jobType === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllJobTypes(false)}
                  className="px-3 py-1 text-xs text-orange-500 hover:text-orange-600"
                >
                  收起 ↑
                </button>
              </>
            ) : (
              <>
                {JOB_TYPE_OPTIONS.slice(0, 10).map(type => (
                  <button
                    key={type}
                    onClick={() => setJobType(jobType === type ? '' : type)}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      jobType === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllJobTypes(true)}
                  className="px-3 py-1 text-xs text-orange-500 hover:text-orange-600"
                >
                  更多岗位 ↓
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 职位列表 */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
              <div className="text-4xl mb-2">💼</div>
              <p>暂无符合条件的职位</p>
              <button onClick={() => { setKeyword(''); setLocation('全部'); setSalaryRange('all'); setJobType(''); }} className="mt-3 text-primary text-sm hover:underline">清除筛选</button>
            </div>
          ) : posts.map(post => (
            <Link
              key={post.id}
              to={`/job/${post.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-transparent hover:border-orange-200"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-500 font-bold text-sm">【急招】</span>
                    <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  </div>
                  {post.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>📍</span> {post.location}
                      <span className="mx-1">·</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-orange-500 font-bold whitespace-nowrap">
                    {formatSalary(post.salary_min, post.salary_max, post.salary_type)}
                  </div>
                  <div className="text-xs text-gray-400">{post.views}次浏览</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 侧边栏：公司黄页 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">🏢 知名企业</h3>
              <Link to="/companies" className="text-xs text-primary hover:underline">查看全部 →</Link>
            </div>
            <div className="space-y-3">
              {companies.map(c => (
                <Link key={c.id} to={`/company/${c.id}`} className="flex items-center gap-2 group">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                    🏭
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition truncate">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.industry}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 热门岗位分类 */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">热门岗位</h3>
            <div className="flex flex-wrap gap-2">
              {['操作工', '丝网编织', '销售', '焊工', '叉车司机', '司机', '文员', '厨师', '服务员', '会计', '钳工'].map(tag => (
                <Link
                  key={tag}
                  to={`/search?keyword=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 text-xs bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 找工作提示 */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-xs text-gray-600">
            <div className="font-bold text-orange-700 mb-2">💡 求职提示</div>
            <ul className="space-y-1">
              <li>• 正规招聘不收任何费用</li>
              <li>• 勿随意交出身份证件</li>
              <li>• 签订正式劳动合同</li>
              <li>• 核实公司工商信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
