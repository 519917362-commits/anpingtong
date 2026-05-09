import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 首页展示的10个重要分类（按截图顺序）
const IMPORTANT_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', color: 'from-orange-50 to-orange-100 border-orange-200' },
  { slug: 'house', name: '房屋租售', icon: '🏠', color: 'from-blue-50 to-blue-100 border-blue-200' },
  { slug: 'secondhand', name: '二手买卖', icon: '🔄', color: 'from-yellow-50 to-yellow-100 border-yellow-200' },
  { slug: 'shop-transfer', name: '旺铺转让', icon: '🏪', color: 'from-pink-50 to-pink-100 border-pink-200' },
  { slug: 'vehicle', name: '车辆交易', icon: '🚗', color: 'from-green-50 to-green-100 border-green-200' },
  { slug: 'discounts', name: '优惠信息', icon: '🎁', color: 'from-rose-50 to-rose-100 border-rose-200' },
  { slug: 'education', name: '教育培训', icon: '📚', color: 'from-indigo-50 to-indigo-100 border-indigo-200' },
  { slug: 'electronics', name: '家电数码', icon: '📱', color: 'from-cyan-50 to-cyan-100 border-cyan-200' },
  { slug: 'qa', name: '全城知道', icon: '🔮', color: 'from-violet-50 to-violet-100 border-violet-200' },
  { slug: 'tools', name: '便民查询', icon: '🔎', color: 'from-sky-50 to-sky-100 border-sky-200' },
]

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', house: '🏠', vehicle: '🚗', secondhand: '🔄',
  business: '🛠️', shop: '🏪', life: '☕', edu: '📚',
  missing: '🔍', electronics: '📱', 'home-materials': '🏗️',
  discounts: '🎁', carpool: '🚙', promotions: '🏷️',
  tools: '🔎', qa: '🔮', other: '📌'
}

const CATEGORY_COLORS = {
  'jobs-recruit': 'from-orange-50 to-orange-100 border-orange-200',
  house:          'from-blue-50 to-blue-100 border-blue-200',
  vehicle:        'from-green-50 to-green-100 border-green-200',
  secondhand:     'from-yellow-50 to-yellow-100 border-yellow-200',
  business:       'from-purple-50 to-purple-100 border-purple-200',
  shop:           'from-pink-50 to-pink-100 border-pink-200',
  life:           'from-red-50 to-red-100 border-red-200',
  edu:            'from-indigo-50 to-indigo-100 border-indigo-200',
  missing:        'from-gray-50 to-gray-100 border-gray-200',
  electronics:    'from-cyan-50 to-cyan-100 border-cyan-200',
  'home-materials':'from-amber-50 to-amber-100 border-amber-200',
  discounts:      'from-rose-50 to-rose-100 border-rose-200',
  carpool:        'from-teal-50 to-teal-100 border-teal-200',
  promotions:     'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200',
  tools:          'from-sky-50 to-sky-100 border-sky-200',
  qa:             'from-violet-50 to-violet-100 border-violet-200',
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

function formatPrice(price) {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [notices, setNotices] = useState([])
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?pageSize=20').then(r => r.json()),
      fetch('/api/posts?category=jobs-recruit&status=approved&pageSize=6').then(r => r.json()),
      fetch('/api/companies?pageSize=6').then(r => r.json()),
      fetch('/api/notices?pageSize=3').then(r => r.json()),
      fetch('/api/posts?category=promotions&status=approved&pageSize=4').then(r => r.json()),
    ]).then(([postData, jobData, companyData, noticeData, promoData]) => {
      if (postData.code === 200) setPosts(postData.data.list)
      if (jobData.code === 200) setJobs(jobData.data.list)
      if (companyData.code === 200) setCompanies(companyData.data.list)
      if (noticeData.code === 200) setNotices(noticeData.data.list)
      if (promoData.code === 200) setPromotions(promoData.data.list)
    }).finally(() => setLoading(false))
  }, [])

  const tools = [
    { icon: '🚚', title: '物流查询', desc: '快递/物流实时追踪', path: '/tools/logistics', color: 'from-blue-50 to-blue-100', accent: 'text-blue-600', tag: '实用工具' },
    { icon: '🛠️', title: '丝网报价', desc: '根据规格快速计算价格', path: '/tools/wiremesh', color: 'from-purple-50 to-purple-100', accent: 'text-purple-600', tag: '行业工具' },
    { icon: '📊', title: '原材料行情', desc: '钢丝/盘条实时价格', path: '/tools/materials', color: 'from-green-50 to-green-100', accent: 'text-green-600', tag: '市场行情' },
  ]

  const quickTools = [
    { icon: '📍', title: '电话查询', desc: '安平本地电话黄页', path: '/tools/phone', color: 'from-blue-50 to-blue-100', accent: 'text-blue-600' },
    { icon: '🧾', title: '快递追踪', desc: '主流快递实时查询', path: '/tools/express', color: 'from-orange-50 to-orange-100', accent: 'text-orange-600' },
    { icon: '🔢', title: '区号邮编', desc: '安平区号/邮政编码', path: '/tools/postcode', color: 'from-teal-50 to-teal-100', accent: 'text-teal-600' },
    { icon: '🏥', title: '医院挂号', desc: '安平各大医院预约', path: '/tools/hospital', color: 'from-red-50 to-red-100', accent: 'text-red-600' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">🏠 安平同城网</h1>
        <p className="opacity-90 text-xs sm:text-sm">安平县本地便民分类信息平台 · 免费发布 · 快速传播</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs">
          <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">🏠 房屋租售</span>
          <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">💼 招聘求职</span>
          <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">🚗 二手车</span>
          <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">🔄 二手物品</span>
        </div>
      </div>

      {/* 热门公告 */}
      {notices.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800 text-sm">📢 最新公告</h2>
            <Link to="/notices" className="text-xs text-primary hover:underline">查看全部 →</Link>
          </div>
          <div className="space-y-2">
            {notices.map(n => (
              <Link key={n.id} to={`/notice/${n.id}`} className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded-lg transition">
                <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded shrink-0">公告</span>
                <span className="text-gray-700 truncate flex-1">{n.title}</span>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(n.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 分类导航 - 10个重要分类 */}
      <div className="bg-white rounded-xl p-3 sm:p-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {IMPORTANT_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`flex flex-col items-center gap-1 text-center py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition`}
            >
              <span className="text-xl sm:text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
          {/* 查看全部 */}
          <Link
            to="/all-categories"
            className="flex flex-col items-center gap-1 text-center py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition text-gray-500"
          >
            <span className="text-xl sm:text-2xl">📁</span>
            <span className="text-xs font-medium">全部分类</span>
          </Link>
        </div>
      </div>

      {/* 便民工具 */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">🛠️ 便民工具</h2>
          <Link to="/tools" className="text-xs text-primary hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`card-hover bg-gradient-to-br ${tool.color} border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl">{tool.icon}</span>
                <span className={`text-xs font-medium ${tool.accent} bg-white/70 px-2 py-0.5 rounded-full`}>{tool.tag}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">{tool.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 便民查询快捷入口 */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">🔎 便民查询</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {quickTools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`card-hover bg-gradient-to-br ${tool.color} border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}
            >
              <span className="text-xl sm:text-2xl">{tool.icon}</span>
              <div>
                <h3 className="font-medium text-gray-800 text-sm">{tool.title}</h3>
                <p className="text-xs text-gray-500 hidden sm:block">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 促销打折 */}
      {promotions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">🏷️ 促销打折</h2>
            <Link to="/category/promotions" className="text-xs text-primary hover:underline">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {promotions.map(promo => (
              <Link
                key={promo.id}
                to={`/post/${promo.id}`}
                className="card-hover bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="h-24 sm:h-28 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 flex items-center justify-center text-3xl sm:text-4xl">🏷️</div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{promo.title}</h3>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    {promo.original_price > 0 && promo.price < promo.original_price && (
                      <span className="text-xs text-gray-400 line-through">¥{promo.original_price}</span>
                    )}
                    <span className="text-accent font-bold text-sm">{promo.price > 0 ? `¥${promo.price}` : '免费'}</span>
                  </div>
                  {promo.valid_until && (
                    <p className="text-xs text-gray-400 mt-1">有效期：{promo.valid_until}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 热门招聘 */}
      {jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">💼 热门招聘</h2>
            <Link to="/jobs" className="text-xs text-primary hover:underline">更多职位 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {jobs.slice(0, 6).map(job => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="card-hover bg-white rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3 border border-gray-100 hover:border-orange-200"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center text-lg sm:text-xl shrink-0">💼</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{job.title}</h3>
                    <span className="text-orange-500 font-bold text-sm shrink-0">
                      {job.salary_min ? `${Number(job.salary_min).toLocaleString()}+` : '面议'}/月
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>📍 {job.location || '安平县'}</span>
                    <span>{timeAgo(job.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 知名企业 */}
      {companies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">🏢 知名企业</h2>
            <Link to="/companies" className="text-xs text-primary hover:underline">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {companies.slice(0, 6).map(c => (
              <Link
                key={c.id}
                to={`/company/${c.id}`}
                className="card-hover bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-indigo-200 text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-2">🏭</div>
                <div className="text-sm font-medium text-gray-800 truncate">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.industry || '综合企业'}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 最新信息 */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">🆕 最新信息</h2>
          <span className="text-xs text-gray-400">实时更新 · 快速联系</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-3 sm:p-4 h-20 sm:h-24 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center text-gray-400">
            <p className="text-3xl sm:text-4xl mb-2">📋</p>
            <p>暂无信息，<Link to="/post-create" className="text-primary">成为第一个发布者</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="card-hover bg-white rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4 border border-gray-100"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl shrink-0">
                  {CATEGORY_ICONS[post.category_slug] || CATEGORY_ICONS.other}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-1">{post.title}</h3>
                    <span className="text-accent font-bold text-sm shrink-0">{formatPrice(post.price)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 text-xs text-gray-400">
                    <span>{post.category_name}</span>
                    <span>📍 {post.location || '安平县'}</span>
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
