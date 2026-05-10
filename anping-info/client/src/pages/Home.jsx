import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MAIN_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', color: 'bg-red-500', desc: '企业招人·个人求职' },
  { slug: 'job-seeker', name: '求职简历', icon: '📋', color: 'bg-rose-500', desc: '个人简历·找工作' },
  { slug: 'house', name: '房屋租售', icon: '🏠', color: 'bg-orange-500', desc: '租房·买房·商铺' },
  { slug: 'door-service', name: '上门服务', icon: '🔧', color: 'bg-amber-500', desc: '保洁·搬家·维修' },
  { slug: 'shop-transfer', name: '招商转让', icon: '🏪', color: 'bg-lime-500', desc: '旺铺转让·合伙创业' },
  { slug: 'secondhand', name: '闲置物品', icon: '🔄', color: 'bg-green-500', desc: '二手买卖·以物换物' },
  { slug: 'news', name: '新鲜事', icon: '📰', color: 'bg-emerald-500', desc: '本地资讯·热门话题' },
  { slug: 'companies', name: '同城商家', icon: '🏢', color: 'bg-cyan-500', desc: '本地商家·企业黄页' },
]

const WIREMESH_CATEGORIES = [
  { slug: 'wiremesh-machine', name: '丝网机械', icon: '⚙️' },
  { slug: 'wiremesh-material', name: '原材料', icon: '🔩' },
  { slug: 'wiremesh-product', name: '丝网制品', icon: '🕸️' },
  { slug: 'wiremesh-price', name: '今日报价', icon: '📊' },
]

const BANNER_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop',
    title: '安平同城网',
    sub: '本地分类信息平台',
    gradient: 'from-blue-600 to-cyan-500'
  },
  {
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop',
    title: '免费发布信息',
    sub: '房屋租售 · 招聘求职 · 二手交易',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
    title: '便民服务',
    sub: '物流查询 · 丝网报价 · 拼车出行',
    gradient: 'from-emerald-500 to-teal-500'
  },
]

const AD_BANNERS = [
  { 
    title: '🏠 精装二手房推荐',
    sub: '户型好·采光佳·配套完善',
    bg: 'from-orange-500 to-red-500',
    link: '/category/house'
  },
  { 
    title: '💼 名企高薪急招',
    sub: '五险一金·年终奖金·福利多多',
    bg: 'from-blue-500 to-indigo-500',
    link: '/jobs'
  },
  { 
    title: '🚗 新车特惠专场',
    sub: '厂家直销·限时优惠·可分期',
    bg: 'from-gray-700 to-gray-900',
    link: '/category/vehicle'
  },
]

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', house: '🏠', vehicle: '🚗', secondhand: '🔄',
  business: '🛠️', shop: '🏪', life: '🔧', edu: '📰',
  missing: '🔍', electronics: '📱', 'home-materials': '🏗️',
  discounts: '🎁', carpool: '🚙', promotions: '🏷️',
  tools: '🔎', qa: '🔮', other: '📌',
  'wechat-group': '💬', 'wiremesh-machine': '⚙️',
  'wiremesh-material': '🔩', 'wiremesh-product': '🕸️',
  'wiremesh-price': '📊'
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
    const len = banners.length > 0 ? banners.length : BANNER_SLIDES.length
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

  const displaySlides = banners.length > 0 
    ? banners.map(b => ({
        image: b.image_url,
        title: b.title,
        sub: b.link_type === 'none' ? '' : `点击查看详情`,
        gradient: 'from-gray-800 to-gray-900'
      }))
    : BANNER_SLIDES

  const currentSlide = displaySlides[currentBanner]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Banner Carousel */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="relative cursor-pointer" onClick={() => banners.length > 0 ? handleBannerClick(banners[currentBanner]) : null}>
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title}
              className="w-full h-36 sm:h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-bold">{currentSlide.title}</h2>
              <p className="text-white/80 text-sm">{currentSlide.sub}</p>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentBanner === i ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Main Categories - 8 Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-3">
            {MAIN_CATEGORIES.slice(0, 8).map(item => (
              <Link
                key={item.slug}
                to={item.slug === 'companies' ? '/companies' : `/category/${item.slug}`}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-xs text-gray-700 font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Notice Bar */}
        {notices.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 flex items-center gap-2 shadow-sm">
            <span className="text-amber-500 text-lg">📢</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-gray-700 truncate">{notices[0].title}</p>
            </div>
            <Link to={`/notice/${notices[0].id}`} className="text-amber-500 text-xs">详情 →</Link>
          </div>
        )}

        {/* Wiremesh Industry Section */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕸️</span>
              <div>
                <h3 className="font-bold text-white">丝网产业链</h3>
                <p className="text-white/60 text-xs">安平特色产业</p>
              </div>
            </div>
            <Link to="/tools/wiremesh" className="text-white/80 text-xs">更多 →</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {WIREMESH_CATEGORIES.map(item => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                className="bg-white/10 rounded-xl p-3 text-center hover:bg-white/20 transition"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white text-xs mt-1">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Ad Banner 1 */}
        <Link to="/category/house" className={`block bg-gradient-to-r ${AD_BANNERS[0].bg} rounded-xl p-4 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="font-bold text-lg">{AD_BANNERS[0].title}</p>
          <p className="text-white/80 text-sm mt-1">{AD_BANNERS[0].sub}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">立即查看 →</span>
        </Link>

        {/* Local Businesses */}
        {companies.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">🏢 本地好商家</h3>
              <Link to="/companies" className="text-xs text-gray-400">更多 →</Link>
            </div>
            <div className="space-y-2">
              {companies.slice(0, 3).map(company => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl shrink-0">🏭</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800">{company.name}</h4>
                    <p className="text-xs text-gray-400">{company.address || '安平县'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ad Banner 2 */}
        <Link to="/jobs" className={`block bg-gradient-to-r ${AD_BANNERS[1].bg} rounded-xl p-4 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="font-bold text-lg">{AD_BANNERS[1].title}</p>
          <p className="text-white/80 text-sm mt-1">{AD_BANNERS[1].sub}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">立即查看 →</span>
        </Link>

        {/* Latest Posts */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">🆕 最新信息</h3>
            <Link to="/posts" className="text-xs text-gray-400">更多 →</Link>
          </div>
          <div className="space-y-2">
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
                  <h4 className="text-sm text-gray-800 line-clamp-1">{post.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{post.category_name}</span>
                    <span className="text-blue-500 font-bold text-xs">{formatPrice(post.price)}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(post.created_at)}</span>
              </Link>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <p>暂无信息，<Link to="/post-create" className="text-blue-500">成为第一个发布者</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Ad Banner 3 */}
        <Link to="/category/vehicle" className={`block bg-gradient-to-r ${AD_BANNERS[2].bg} rounded-xl p-4 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="font-bold text-lg">{AD_BANNERS[2].title}</p>
          <p className="text-white/80 text-sm mt-1">{AD_BANNERS[2].sub}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">立即查看 →</span>
        </Link>

        {/* Tools Quick Access */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">🛠️ 便民工具</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🚚', name: '物流查询', path: '/tools/logistics', color: 'bg-blue-50 text-blue-600' },
              { icon: '🛠️', name: '丝网报价', path: '/tools/wiremesh', color: 'bg-orange-50 text-orange-600' },
              { icon: '📊', name: '行情资讯', path: '/tools/materials', color: 'bg-green-50 text-green-600' },
            ].map(tool => (
              <Link
                key={tool.name}
                to={tool.path}
                className={`${tool.color} rounded-xl p-3 text-center`}
              >
                <span className="text-2xl">{tool.icon}</span>
                <p className="text-sm font-medium mt-1">{tool.name}</p>
              </Link>
            ))}
          </div>
        </div>

      </main>

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
                      ? 'bg-orange-500 text-white' 
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
