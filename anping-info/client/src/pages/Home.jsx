import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const IMPORTANT_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', gradient: 'from-orange-500 to-orange-600' },
  { slug: 'house', name: '房屋租售', icon: '🏠', gradient: 'from-blue-500 to-blue-600' },
  { slug: 'secondhand', name: '二手买卖', icon: '🔄', gradient: 'from-amber-500 to-amber-600' },
  { slug: 'shop-transfer', name: '旺铺转让', icon: '🏪', gradient: 'from-pink-500 to-pink-600' },
  { slug: 'vehicle', name: '车辆服务', icon: '🚗', gradient: 'from-emerald-500 to-emerald-600' },
  { slug: 'education', name: '教育培训', icon: '📚', gradient: 'from-indigo-500 to-indigo-600' },
  { slug: 'electronics', name: '家电数码', icon: '📱', gradient: 'from-cyan-500 to-cyan-600' },
  { slug: 'discounts', name: '优惠促销', icon: '🎁', gradient: 'from-rose-500 to-rose-600' },
  { slug: 'carpool', name: '拼车出行', icon: '🚙', gradient: 'from-teal-500 to-teal-600' },
  { slug: 'qa', name: '全城知道', icon: '🔮', gradient: 'from-violet-500 to-violet-600' },
  { slug: 'tools', name: '便民查询', icon: '🔎', gradient: 'from-sky-500 to-sky-600' },
  { slug: 'home-materials', name: '家居建材', icon: '🏗️', gradient: 'from-stone-500 to-stone-600' },
]

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', house: '🏠', vehicle: '🚗', secondhand: '🔄',
  business: '🛠️', shop: '🏪', life: '☕', edu: '📚',
  missing: '🔍', electronics: '📱', 'home-materials': '🏗️',
  discounts: '🎁', carpool: '🚙', promotions: '🏷️',
  tools: '🔎', qa: '🔮', other: '📌'
}

const HOT_KEYWORDS = ['丝网厂招聘', '安平租房', '二手电动车', '拼车北京', '旺铺转让']

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
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0)
  const bannerRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?pageSize=20').then(r => r.json()),
      fetch('/api/posts?category=jobs-recruit&status=approved&pageSize=6').then(r => r.json()),
      fetch('/api/companies?pageSize=6').then(r => r.json()),
      fetch('/api/notices?pageSize=3').then(r => r.json()),
      fetch('/api/posts?category=promotions&status=approved&pageSize=4').then(r => r.json()),
      fetch('/api/banners').then(r => r.json()),
    ]).then(([postData, jobData, companyData, noticeData, promoData, bannerData]) => {
      if (postData.code === 200) setPosts(postData.data.list)
      if (jobData.code === 200) setJobs(jobData.data.list)
      if (companyData.code === 200) setCompanies(companyData.data.list)
      if (noticeData.code === 200) setNotices(noticeData.data.list)
      if (promoData.code === 200) setPromotions(promoData.data.list)
      if (bannerData.code === 200 && bannerData.data.length > 0) {
        setBanners(bannerData.data)
      }
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (banners.length === 0) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % 3)
      }, 5000)
      return () => clearInterval(timer)
    } else {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length])

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`)
    }
  }

  const handleKeywordClick = (kw) => {
    navigate(`/search?keyword=${encodeURIComponent(kw)}`)
  }

  const handleBannerClick = (banner) => {
    if (banner.link_url && banner.link_type !== 'none') {
      if (banner.link_type === 'post') {
        navigate(`/post/${banner.link_url}`)
      } else if (banner.link_type === 'category') {
        navigate(`/category/${banner.link_url}`)
      } else if (banner.link_type === 'url') {
        window.open(banner.link_url, '_blank')
      } else {
        navigate(banner.link_url)
      }
    }
  }

  const DEFAULT_BANNERS = [
    { title: '安平同城网', sub: '安平县本地分类信息平台', gradient: 'from-blue-600 via-blue-500 to-cyan-500', icon: '🏠' },
    { title: '免费发布信息', sub: '房屋租售 · 招聘求职 · 二手交易', gradient: 'from-orange-500 via-amber-500 to-yellow-500', icon: '📢' },
    { title: '便民服务', sub: '物流查询 · 丝网报价 · 拼车出行', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', icon: '🛠️' },
  ]

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS
  const currentBannerData = displayBanners[currentBanner]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Banner with Search */}
      <div 
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => banners.length > 0 ? handleBannerClick(banners[currentBanner]) : null}
      >
        {banners.length > 0 && banners[currentBanner].image_url ? (
          <img 
            src={banners[currentBanner].image_url} 
            alt={banners[currentBanner].title}
            className="w-full h-48 sm:h-64 object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-r ${currentBannerData.gradient} transition-all duration-700`} />
        )}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-6 sm:px-10 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-4">
                <span className="text-xl">{currentBannerData.icon}</span>
                <span>{currentBannerData.sub}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {currentBannerData.title}
              </h1>
              <p className="text-white/80 text-base sm:text-lg">
                快速传播 · 免费发布 · 真实可靠
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex gap-2">
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="搜索你感兴趣的内容..."
                    className="flex-1 px-4 py-3 rounded-xl outline-none text-gray-700 bg-gray-50"
                  />
                  <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition">
                    搜索
                  </button>
                </div>
              </form>
              
              {/* Hot keywords */}
              <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                <span className="text-white/80 text-xs">热门：</span>
                {HOT_KEYWORDS.map(kw => (
                  <button
                    key={kw}
                    onClick={() => handleKeywordClick(kw)}
                    className="text-white/90 text-xs hover:text-white hover:bg-white/20 px-2 py-1 rounded-full transition"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentBanner(i) }}
              className={`w-2 h-2 rounded-full transition-all ${currentBanner === i ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: '实时信息', value: posts.length + '0+', icon: '📋' },
          { label: '入驻企业', value: companies.length + '0+', icon: '🏢' },
          { label: '成功匹配', value: '10万+', icon: '✅' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-2xl sm:text-3xl mb-1">{stat.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">📦 信息分类</h2>
          <Link to="/all-categories" className="text-sm text-blue-500 hover:text-blue-600 transition flex items-center gap-1">
            全部分类
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {IMPORTANT_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gray-100 group-hover:bg-white/50 rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition">
                  {cat.icon}
                </div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-white transition">
                  {cat.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad Banner Slot 1 - Between Categories and Main Content */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-1">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center">
          <p className="text-sm text-purple-600 font-medium mb-1">📢 广告位招商中</p>
          <p className="text-xs text-purple-400">首页Banner广告位出租，精准触达安平本地用户</p>
          <p className="text-xs text-purple-500 mt-2">咨询热线：400-888-8888</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Jobs & Promotions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hot Jobs */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2 className="font-bold text-lg text-gray-800">💼 热门职位</h2>
                </div>
                <Link to="/jobs" className="text-sm text-gray-400 hover:text-orange-500 transition">
                  查看更多 →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jobs.slice(0, 4).map(job => (
                  <Link
                    key={job.id}
                    to={`/job/${job.id}`}
                    className="group flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      💼
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition line-clamp-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-orange-500 font-bold text-sm">
                          {job.salary_min ? `${Number(job.salary_min).toLocaleString()}+` : '面议'}
                        </span>
                        <span className="text-xs text-gray-400">/月</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>📍 {job.location || '安平县'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ad Banner Slot 2 - After Jobs */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-1">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700 font-medium">🎯 招聘置顶服务</p>
                <p className="text-xs text-cyan-500 mt-1">让您的招聘信息获得更多曝光</p>
              </div>
              <Link to="/post-create" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium">
                立即发布
              </Link>
            </div>
          </div>

          {/* Latest Posts */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full" />
                <h2 className="font-bold text-lg text-gray-800">🆕 最新信息</h2>
              </div>
              <span className="text-xs text-gray-400">实时更新</span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📋</p>
                <p>暂无信息，<Link to="/post-create" className="text-blue-500">成为第一个发布者</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {posts.slice(0, 8).map(post => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                      {CATEGORY_ICONS[post.category_slug] || CATEGORY_ICONS.other}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition line-clamp-1 text-sm">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{post.category_name}</span>
                        <span className="text-blue-500 font-bold text-sm">{formatPrice(post.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Tools & Companies */}
        <div className="space-y-6">
          {/* Quick Tools */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              便民工具
            </h3>
            <div className="space-y-2">
              {[
                { icon: '🚚', name: '物流查询', desc: '实时追踪快递' },
                { icon: '🛠️', name: '丝网报价', desc: '快速计算价格' },
                { icon: '📊', name: '行情资讯', desc: '原材料价格' },
              ].map(tool => (
                <Link
                  key={tool.name}
                  to={`/tools/${tool.name === '物流查询' ? 'logistics' : tool.name === '丝网报价' ? 'wiremesh' : 'materials'}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-white/70">{tool.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Ad Banner Slot 3 - Sidebar Tools Below */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl overflow-hidden">
            <div className="p-4">
              <p className="text-sm font-bold text-white mb-1">🏪 商家入驻</p>
              <p className="text-xs text-white/80 mb-3">免费入驻企业黄页，获取更多商机</p>
              <Link to="/post-create" className="inline-block bg-white text-orange-500 px-4 py-1.5 rounded-lg text-xs font-medium">
                立即入驻 →
              </Link>
            </div>
          </div>

          {/* Promotions */}
          {promotions.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-rose-500 rounded-full" />
                  促销优惠
                </h3>
                <Link to="/category/promotions" className="text-xs text-gray-400 hover:text-rose-500">
                  更多 →
                </Link>
              </div>
              <div className="space-y-3">
                {promotions.slice(0, 3).map(promo => (
                  <Link
                    key={promo.id}
                    to={`/post/${promo.id}`}
                    className="block group"
                  >
                    <div className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                        🎫
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-1 group-hover:text-rose-600 transition">
                          {promo.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{promo.content}</p>
                        <div className="text-rose-500 font-bold text-sm mt-1">
                          {promo.price > 0 ? `¥${promo.price}` : '免费'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notice */}
          {notices.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-amber-500 rounded-full" />
                平台公告
              </h3>
              <div className="space-y-3">
                {notices.slice(0, 3).map(n => (
                  <Link
                    key={n.id}
                    to={`/notice/${n.id}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-700 group-hover:text-amber-600 line-clamp-2 transition">
                          {n.title}
                        </h4>
                        <span className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                  知名企业
                </h3>
                <Link to="/companies" className="text-xs text-gray-400 hover:text-emerald-500">
                  更多 →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {companies.slice(0, 4).map(c => (
                  <Link
                    key={c.id}
                    to={`/company/${c.id}`}
                    className="group text-center p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                      🏭
                    </div>
                    <div className="text-xs font-medium text-gray-700 group-hover:text-emerald-600 line-clamp-2 transition">
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{c.industry || '综合'}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* App Download */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2">安平同城网</h3>
              <p className="text-sm text-gray-300 mb-4">随时随地，发现安平</p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                  iOS
                </button>
                <button className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Button Float */}
      <Link
        to="/post-create"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-2xl z-40"
        style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}
      >
        +
      </Link>
    </div>
  )
}
