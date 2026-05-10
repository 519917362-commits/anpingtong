import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', 'job-seeker': '📋', house: '🏠', 'door-service': '🔧',
  'shop-transfer': '🏪', secondhand: '🔄', news: '📰', companies: '🏢',
  vehicle: '🚗', 'wiremesh-machine': '⚙️', 'wiremesh-material': '🔩',
  'wiremesh-product': '🕸️', 'wiremesh-price': '📊', discounts: '🎁',
  'wechat-group': '💬', other: '📌'
}

const QUICK_CATEGORIES = [
  { name: '招聘求职', slug: 'jobs-recruit', icon: '💼', color: 'from-red-500 to-orange-500' },
  { name: '房屋租售', slug: 'house', icon: '🏠', color: 'from-orange-500 to-yellow-500' },
  { name: '二手市场', slug: 'secondhand', icon: '🔄', color: 'from-yellow-500 to-green-500' },
  { name: '招商转让', slug: 'shop-transfer', icon: '🏪', color: 'from-green-500 to-teal-500' },
  { name: '本地服务', slug: 'door-service', icon: '🔧', color: 'from-teal-500 to-cyan-500' },
  { name: '车辆买卖', slug: 'vehicle', icon: '🚗', color: 'from-cyan-500 to-blue-500' },
  { name: '丝网产业', slug: 'wiremesh-product', icon: '🕸️', color: 'from-blue-500 to-purple-500' },
  { name: '最新资讯', slug: 'news', icon: '📰', color: 'from-purple-500 to-pink-500' },
]

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
  const [topPosts, setTopPosts] = useState([])
  const [jobsPosts, setJobsPosts] = useState([])
  const [housePosts, setHousePosts] = useState([])
  const [shopPosts, setShopPosts] = useState([])
  const [newsPosts, setNewsPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?type=top&pageSize=10').then(r => r.json()),
      fetch('/api/posts?category=jobs-recruit&pageSize=10').then(r => r.json()),
      fetch('/api/posts?category=house&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=shop-transfer&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=news&pageSize=10').then(r => r.json()),
    ]).then(([topData, jobsData, houseData, shopData, newsData]) => {
      if (topData.code === 200) setTopPosts(topData.data.list)
      if (jobsData.code === 200) setJobsPosts(jobsData.data.list)
      if (houseData.code === 200) setHousePosts(houseData.data.list)
      if (shopData.code === 200) setShopPosts(shopData.data.list)
      if (newsData.code === 200) setNewsPosts(newsData.data.list)
      setLoading(false)
    }).catch(err => {
      console.error('数据加载失败:', err)
      setLoading(false)
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`)
    }
  }

  const PostItem = ({ post, showPrice = true }) => (
    <Link
      to={`/post/${post.id}`}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
        {CATEGORY_ICONS[post.category_slug] || '📌'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-gray-800 line-clamp-2 group-hover:text-blue-500 transition">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{post.category_name}</span>
          {showPrice && post.price > 0 && (
            <span className="text-xs text-red-500 font-medium">{formatPrice(post.price)}</span>
          )}
          <span className="text-xs text-gray-300 ml-auto">{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </Link>
  )

  const SectionHeader = ({ icon, title, link, linkText = '更多' }) => (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </h3>
      <Link to={link} className="text-xs text-gray-400 hover:text-blue-500 transition">
        {linkText} →
      </Link>
    </div>
  )

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : (
        <>
          {/* 搜索栏 */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 shadow-sm">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-gray-400 text-lg">🔍</span>
                  <input
                    type="text"
                    placeholder="找工作、找房子、二手物品..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition"
                >
                  搜索
                </button>
              </div>
            </form>
            
            {/* 快捷搜索标签 */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-white/80 text-sm">热门搜索:</span>
              {['招聘', '租房', '二手房', '转让', '服务'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setSearchKeyword(tag); navigate(`/search?keyword=${tag}`) }}
                  className="bg-white/20 text-white text-xs px-3 py-1 rounded-full hover:bg-white/30 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 分类导航 - 58风格 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {QUICK_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 轮播Banner区域 */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">📢 安平同城网</h2>
                <p className="opacity-90 text-sm">本地生活服务平台</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/post-create"
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  免费发布
                </Link>
              </div>
            </div>
          </div>

          {/* 全站置顶资讯 */}
          {topPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <SectionHeader icon="🔝" title="全站置顶" link="/category/top" />
              <div className="space-y-1">
                {topPosts.map(post => (
                  <PostItem key={post.id} post={post} showPrice={false} />
                ))}
              </div>
            </div>
          )}

          {/* 招聘Top10 */}
          {jobsPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <SectionHeader icon="💼" title="招聘求职" link="/category/jobs-recruit" />
              <div className="space-y-1">
                {jobsPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      index < 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-800 line-clamp-1 group-hover:text-blue-500 transition">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-400">{post.location || '安平县'}</p>
                    </div>
                    <span className="text-xs text-red-500 font-medium shrink-0">
                      {post.salary_min > 0 ? `${post.salary_min}-${post.salary_max}元` : '面议'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 房屋租售Top5 + 招商转让Top5 并排 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 房屋租售Top5 */}
            {housePosts.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionHeader icon="🏠" title="房屋租售" link="/category/house" />
                <div className="space-y-1">
                  {housePosts.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 招商转让Top5 */}
            {shopPosts.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <SectionHeader icon="🏪" title="招商转让" link="/category/shop-transfer" />
                <div className="space-y-1">
                  {shopPosts.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 最新资讯Top10 */}
          {newsPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <SectionHeader icon="📰" title="最新资讯" link="/category/news" />
              <div className="space-y-1">
                {newsPosts.map(post => (
                  <PostItem key={post.id} post={post} showPrice={false} />
                ))}
              </div>
            </div>
          )}

          {/* 空状态提示 */}
          {topPosts.length === 0 && jobsPosts.length === 0 && housePosts.length === 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-gray-400 mb-4">暂无信息</p>
              <Link
                to="/post-create"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                立即发布信息
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}