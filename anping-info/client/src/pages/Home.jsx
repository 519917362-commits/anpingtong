import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FUNCTION_ICONS = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', color: 'bg-red-500' },
  { slug: 'house', name: '房屋租售', icon: '🏠', color: 'bg-orange-500' },
  { slug: 'vehicle', name: '新车二手', icon: '🚗', color: 'bg-amber-500' },
  { slug: 'life', name: '家政保洁', icon: '🧹', color: 'bg-yellow-500' },
  { slug: 'shop-transfer', name: '生意转让', icon: '🏪', color: 'bg-lime-500' },
  { slug: 'secondhand', name: '二手交易', icon: '🔄', color: 'bg-green-500' },
  { slug: 'education', name: '教育培训', icon: '📚', color: 'bg-emerald-500' },
  { slug: 'electronics', name: '家电数码', icon: '📱', color: 'bg-teal-500' },
  { slug: 'discounts', name: '优惠促销', icon: '🎁', color: 'bg-cyan-500' },
  { slug: 'carpool', name: '拼车出行', icon: '🚙', color: 'bg-blue-500' },
]

const SERVICE_CARDS = [
  { title: '求职招聘', desc: '抓住机遇 创造未来', icon: '💼', color: 'from-blue-500 to-cyan-500', tag: '🔥 热门' },
  { title: '精选二手房', desc: '精选房源 户型好', icon: '🏠', color: 'from-orange-500 to-amber-500', tag: '✨ 推荐' },
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
  const [companies, setCompanies] = useState([])
  const [notices, setNotices] = useState([])
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showCityModal, setShowCityModal] = useState(false)
  const [currentCity, setCurrentCity] = useState('安平县')
  const navigate = useNavigate()

  const cities = ['安平县', '衡水市', '石家庄市', '北京市', '天津市']

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?pageSize=10').then(r => r.json()),
      fetch('/api/companies?pageSize=4').then(r => r.json()),
      fetch('/api/notices?pageSize=1').then(r => r.json()),
      fetch('/api/banners').then(r => r.json()),
    ]).then(([postData, companyData, noticeData, bannerData]) => {
      if (postData.code === 200) setPosts(postData.data.list)
      if (companyData.code === 200) setCompanies(companyData.data.list)
      if (noticeData.code === 200) setNotices(noticeData.data.list)
      if (bannerData.code === 200 && bannerData.data.length > 0) {
        setBanners(bannerData.data)
      }
    })
  }, [])

  useEffect(() => {
    const len = banners.length || 3
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % len)
    }, 4000)
    return () => clearInterval(timer)
  }, [banners.length])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`)
    }
  }

  const handleBannerClick = (banner) => {
    if (banner.link_url && banner.link_type !== 'none') {
      if (banner.link_type === 'post') navigate(`/post/${banner.link_url}`)
      else if (banner.link_type === 'category') navigate(`/category/${banner.link_url}`)
      else if (banner.link_type === 'url') window.open(banner.link_url, '_blank')
      else navigate(banner.link_url)
    }
  }

  const DEFAULT_BANNERS = [
    { title: '安平同城网', sub: '本地分类信息平台', gradient: 'from-blue-600 via-blue-500 to-cyan-500' },
    { title: '免费发布信息', sub: '房屋租售 · 招聘求职 · 二手交易', gradient: 'from-orange-500 via-amber-500 to-yellow-500' },
    { title: '便民服务', sub: '物流查询 · 丝网报价 · 拼车出行', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* City Selector */}
            <button 
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1 text-gray-700 font-medium"
            >
              <span className="text-lg">📍</span>
              <span>{currentCity}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="请输入服务名称..."
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Banner Carousel */}
        <div className="relative rounded-2xl overflow-hidden">
          {banners.length > 0 && banners[currentBanner].image_url ? (
            <img 
              src={banners[currentBanner].image_url} 
              alt={banners[currentBanner].title}
              className="w-full h-32 sm:h-40 object-cover"
            />
          ) : (
            <div className={`bg-gradient-to-r ${DEFAULT_BANNERS[currentBanner].gradient} px-6 py-6`}>
              <div>
                <h2 className="text-xl font-bold text-white">{DEFAULT_BANNERS[currentBanner].title}</h2>
                <p className="text-white/80 text-sm mt-1">{DEFAULT_BANNERS[currentBanner].sub}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            {(banners.length > 0 ? banners : DEFAULT_BANNERS).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentBanner === i ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Function Icons Grid */}
        <div className="bg-white rounded-2xl p-4">
          <div className="grid grid-cols-5 gap-3">
            {FUNCTION_ICONS.map(item => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`${item.color} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Notice Bar */}
        {notices.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 flex items-center gap-2">
            <span className="text-amber-500 text-lg">📢</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-gray-700 truncate">{notices[0].title}</p>
            </div>
            <Link to={`/notice/${notices[0].id}`} className="text-amber-500 text-xs">查看详情 →</Link>
          </div>
        )}

        {/* Service Cards */}
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_CARDS.map((card, idx) => (
            <Link
              key={idx}
              to={card.title === '求职招聘' ? '/category/jobs-recruit' : '/category/house'}
              className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white relative overflow-hidden`}
            >
              {card.tag && (
                <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                  {card.tag}
                </span>
              )}
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-bold">{card.title}</h3>
              <p className="text-white/80 text-xs mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Local Businesses */}
        {companies.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">🏢 本地好商家</h3>
              <Link to="/companies" className="text-xs text-gray-400">更多 →</Link>
            </div>
            <div className="space-y-3">
              {companies.slice(0, 3).map(company => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-xl shrink-0">🏭</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800">{company.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{company.address || '安平县'}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">{company.view_count || 0}浏览</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">🆕 最新信息</h3>
            <Link to="/posts" className="text-xs text-gray-400">更多 →</Link>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 5).map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                  {CATEGORY_ICONS[post.category_slug] || CATEGORY_ICONS.other}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-800 line-clamp-2">{post.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{post.category_name}</span>
                    <span className="text-blue-500 font-bold text-xs">{formatPrice(post.price)}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(post.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 py-2">
        <div className="flex items-center justify-around">
          {[
            { path: '/', icon: '🏠', label: '首页' },
            { path: '/companies', icon: '🏪', label: '好店' },
            { path: '/post-create', icon: '+', label: '', special: true },
            { path: '/notices', icon: '🔔', label: '消息' },
            { path: '/profile', icon: '👤', label: '我的' },
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 ${
                item.special 
                  ? 'w-14 h-14 bg-blue-500 rounded-full text-white flex items-center justify-center shadow-lg -mt-4' 
                  : 'text-gray-400 hover:text-blue-500 transition'
              }`}
            >
              <span className={`text-xl ${item.special ? 'text-2xl font-bold' : ''}`}>{item.icon}</span>
              {item.label && <span className="text-xs mt-0.5">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* City Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCityModal(false)}>
          <div className="bg-white w-full rounded-t-3xl p-4 pb-8 max-h-[70vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">选择城市</h3>
              <button onClick={() => setShowCityModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => { setCurrentCity(city); setShowCityModal(false) }}
                  className={`py-3 rounded-xl text-center transition ${
                    currentCity === city 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
