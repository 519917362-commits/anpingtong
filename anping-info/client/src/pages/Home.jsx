import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const IMPORTANT_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼' },
  { slug: 'house', name: '房屋租售', icon: '🏠' },
  { slug: 'secondhand', name: '二手买卖', icon: '🔄' },
  { slug: 'shop-transfer', name: '旺铺转让', icon: '🏪' },
  { slug: 'vehicle', name: '车辆服务', icon: '🚗' },
  { slug: 'education', name: '教育培训', icon: '📚' },
  { slug: 'electronics', name: '家电数码', icon: '📱' },
  { slug: 'discounts', name: '优惠促销', icon: '🎁' },
  { slug: 'carpool', name: '拼车出行', icon: '🚙' },
  { slug: 'qa', name: '全城知道', icon: '🔮' },
  { slug: 'tools', name: '便民查询', icon: '🔎' },
  { slug: 'home-materials', name: '家居建材', icon: '🏗️' },
]

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', house: '🏠', vehicle: '🚗', secondhand: '🔄',
  business: '🛠️', shop: '🏪', life: '☕', edu: '📚',
  missing: '🔍', electronics: '📱', 'home-materials': '🏗️',
  discounts: '🎁', carpool: '🚙', promotions: '🏷️',
  tools: '🔎', qa: '🔮', other: '📌'
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
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0)

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
    { title: '安平同城网', sub: '本地分类信息平台', gradient: 'from-blue-600 to-cyan-500' },
    { title: '免费发布信息', sub: '房屋租售 · 招聘求职 · 二手交易', gradient: 'from-orange-500 to-amber-500' },
    { title: '便民服务', sub: '物流查询 · 丝网报价 · 拼车出行', gradient: 'from-emerald-500 to-teal-500' },
  ]

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS
  const currentBannerData = displayBanners[currentBanner]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Compact Hero Banner */}
      <div 
        className="relative overflow-hidden rounded-xl cursor-pointer"
        onClick={() => banners.length > 0 ? handleBannerClick(banners[currentBanner]) : null}
      >
        {banners.length > 0 && banners[currentBanner].image_url ? (
          <img 
            src={banners[currentBanner].image_url} 
            alt={banners[currentBanner].title}
            className="w-full h-20 sm:h-28 object-cover"
          />
        ) : (
          <div className={`bg-gradient-to-r ${currentBannerData.gradient} px-4 sm:px-6 py-4 sm:py-6`}>
            <div className="flex items-center gap-3">
              <div className="text-white">
                <h1 className="text-lg sm:text-xl font-bold">{currentBannerData.title}</h1>
                <p className="text-white/80 text-xs sm:text-sm">{currentBannerData.sub}</p>
              </div>
              <Link to="/post-create" className="ml-auto bg-white text-gray-800 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                + 发布信息
              </Link>
            </div>
          </div>
        )}
        {banners.length > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayBanners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentBanner(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${currentBanner === i ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compact Categories - Horizontal Scroll */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {IMPORTANT_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-lg hover:bg-gray-50 transition min-w-[60px]"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Hot Jobs */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">💼 热门职位</h2>
                <Link to="/jobs" className="text-xs text-gray-400 hover:text-orange-500">更多 →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {jobs.slice(0, 4).map(job => (
                  <Link
                    key={job.id}
                    to={`/job/${job.id}`}
                    className="flex gap-2 p-2 rounded-lg border border-gray-100 hover:border-orange-200 transition"
                  >
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-lg shrink-0">💼</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-orange-500 font-bold text-xs">{job.salary_min ? `${Number(job.salary_min).toLocaleString()}+` : '面议'}</span>
                        <span className="text-xs text-gray-400">📍 {job.location || '安平'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Posts */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">🆕 最新信息</h2>
              <span className="text-xs text-gray-400">实时更新</span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">暂无信息，<Link to="/post-create" className="text-blue-500">成为第一个发布者</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {posts.slice(0, 8).map(post => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="flex gap-2 p-2 rounded-lg border border-gray-100 hover:border-blue-200 transition"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                      {CATEGORY_ICONS[post.category_slug] || CATEGORY_ICONS.other}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{post.title}</h3>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-400">{post.category_name}</span>
                        <span className="text-blue-500 font-bold text-xs">{formatPrice(post.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Tools */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <h3 className="font-bold mb-3">🛠️ 便民工具</h3>
            <div className="space-y-2">
              {[
                { icon: '🚚', name: '物流查询', path: '/tools/logistics' },
                { icon: '🛠️', name: '丝网报价', path: '/tools/wiremesh' },
                { icon: '📊', name: '行情资讯', path: '/tools/materials' },
              ].map(tool => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Promotions */}
          {promotions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🏷️ 促销优惠</h3>
              <div className="space-y-2">
                {promotions.slice(0, 3).map(promo => (
                  <Link
                    key={promo.id}
                    to={`/post/${promo.id}`}
                    className="block"
                  >
                    <div className="flex gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-lg shrink-0">🎫</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-800 line-clamp-1">{promo.title}</h4>
                        <span className="text-rose-500 font-bold text-xs">{promo.price > 0 ? `¥${promo.price}` : '免费'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notice */}
          {notices.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">📢 平台公告</h3>
              <div className="space-y-2">
                {notices.slice(0, 3).map(n => (
                  <Link
                    key={n.id}
                    to={`/notice/${n.id}`}
                    className="block"
                  >
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-700 line-clamp-2">{n.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">🏢 知名企业</h3>
                <Link to="/companies" className="text-xs text-gray-400">更多 →</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {companies.slice(0, 4).map(c => (
                  <Link
                    key={c.id}
                    to={`/company/${c.id}`}
                    className="text-center p-2 rounded-lg border border-gray-100 hover:border-emerald-200 transition"
                  >
                    <div className="w-8 h-8 mx-auto mb-1 bg-emerald-50 rounded-lg flex items-center justify-center text-lg">🏭</div>
                    <div className="text-xs text-gray-700 line-clamp-2">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ad Slot */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white">
            <p className="text-sm font-bold mb-1">🏪 商家入驻</p>
            <p className="text-xs text-white/80 mb-2">免费入驻，获取更多商机</p>
            <Link to="/post-create" className="inline-block bg-white text-orange-500 px-3 py-1 rounded-lg text-xs font-medium">
              立即入驻 →
            </Link>
          </div>
        </div>
      </div>

      {/* Post Button Float */}
      <Link
        to="/post-create"
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-xl z-40"
      >
        +
      </Link>
    </div>
  )
}
