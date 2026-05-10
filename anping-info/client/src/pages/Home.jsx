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
  { name: '招聘', slug: 'jobs', icon: '💼', color: 'from-red-500 to-pink-500' },
  { name: '房产', slug: 'real-estate', icon: '🏠', color: 'from-orange-500 to-red-500', highlight: true },
  { name: '二手车', slug: 'vehicle', icon: '🚗', color: 'from-blue-500 to-cyan-500' },
  { name: '二手闲置', slug: 'secondhand', icon: '🔄', color: 'from-green-500 to-teal-500' },
  { name: '二手回收', slug: 'recycle', icon: '♻️', color: 'from-emerald-500 to-green-500' },
  { name: '家政服务', slug: 'home-service', icon: '🧹', color: 'from-purple-500 to-pink-500' },
  { name: '商务服务', slug: 'business', icon: '💼', color: 'from-indigo-500 to-purple-500' },
]

const SECTION_CONFIG = [
  { key: 'jobs', icon: '💼', title: '招聘求职', link: '/category/jobs-recruit', color: 'from-red-500 to-pink-500' },
  { key: 'house', icon: '🏠', title: '房屋租售', link: '/real-estate', color: 'from-orange-500 to-red-500' },
  { key: 'shop', icon: '🏪', title: '招商转让', link: '/category/shop-transfer', color: 'from-green-500 to-teal-500' },
  { key: 'vehicle', icon: '🚗', title: '二手车', link: '/category/vehicle', color: 'from-blue-500 to-cyan-500' },
  { key: 'secondhand', icon: '🔄', title: '二手闲置', link: '/category/secondhand', color: 'from-green-500 to-teal-500' },
  { key: 'news', icon: '📰', title: '本地资讯', link: '/category/news', color: 'from-purple-500 to-pink-500' },
  { key: 'companies', icon: '🏢', title: '同城商家', link: '/category/companies', color: 'from-indigo-500 to-purple-500' },
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
  const [categoryPosts, setCategoryPosts] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?type=top&pageSize=20').then(r => r.json()),
      fetch('/api/posts?category=jobs-recruit&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=house&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=shop-transfer&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=vehicle&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=secondhand&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=news&pageSize=5').then(r => r.json()),
      fetch('/api/posts?category=companies&pageSize=5').then(r => r.json()),
    ]).then(([topData, jobsData, houseData, shopData, vehicleData, secondhandData, newsData, companiesData]) => {
      if (topData.code === 200) setTopPosts(topData.data.list)
      setCategoryPosts({
        jobs: jobsData.code === 200 ? jobsData.data.list : [],
        house: houseData.code === 200 ? houseData.data.list : [],
        shop: shopData.code === 200 ? shopData.data.list : [],
        vehicle: vehicleData.code === 200 ? vehicleData.data.list : [],
        secondhand: secondhandData.code === 200 ? secondhandData.data.list : [],
        news: newsData.code === 200 ? newsData.data.list : [],
        companies: companiesData.code === 200 ? companiesData.data.list : [],
      })
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
      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
    >
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm shrink-0">
        {CATEGORY_ICONS[post.category_slug] || '📌'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-gray-800 line-clamp-2 group-hover:text-blue-500 transition">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{post.category_name}</span>
          {showPrice && post.price > 0 && (
            <span className="text-xs text-red-500 font-medium">{formatPrice(post.price)}</span>
          )}
          <span className="text-xs text-gray-300 ml-auto">{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </Link>
  )

  const JobItem = ({ post, index }) => (
    <Link
      key={post.id}
      to={`/post/${post.id}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition group"
    >
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        index < 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs text-gray-800 line-clamp-1 group-hover:text-red-500 transition">
          {post.title}
        </h4>
      </div>
      <span className="text-xs text-red-500 font-medium shrink-0">
        {post.salary_min > 0 ? `${post.salary_min}元` : '面议'}
      </span>
    </Link>
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
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-white/80 text-sm">热门:</span>
              {['招聘', '租房', '二手房', '转让', '服务'].map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/search?keyword=${tag}`)}
                  className="bg-white/20 text-white text-xs px-3 py-1 rounded-full hover:bg-white/30 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 分类导航 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {QUICK_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={cat.slug === 'real-estate' ? '/real-estate' : `/category/${cat.slug}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition group ${
                    cat.highlight ? 'ring-2 ring-red-300 ring-offset-2' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className={`text-xs font-medium ${cat.highlight ? 'text-red-500' : 'text-gray-700'}`}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 全站置顶资讯 */}
          {topPosts.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-xl">🔝</span>
                    <span className="font-bold">全站置顶</span>
                  </div>
                  <Link to="/category/top" className="text-white/80 text-xs hover:text-white">
                    查看全部 →
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {topPosts.map(post => (
                  <div key={post.id}>
                    <PostItem post={post} showPrice={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 各板块资讯 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 招聘求职 */}
            {categoryPosts.jobs?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">💼</span>
                      <span className="font-bold">招聘求职</span>
                    </div>
                    <Link to="/category/jobs-recruit" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.jobs.map((post, index) => (
                    <JobItem key={post.id} post={post} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* 房屋租售 */}
            {categoryPosts.house?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">🏠</span>
                      <span className="font-bold">房屋租售</span>
                    </div>
                    <Link to="/real-estate" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.house.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 招商转让 */}
            {categoryPosts.shop?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">🏪</span>
                      <span className="font-bold">招商转让</span>
                    </div>
                    <Link to="/category/shop-transfer" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.shop.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 二手车 */}
            {categoryPosts.vehicle?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">🚗</span>
                      <span className="font-bold">二手车</span>
                    </div>
                    <Link to="/category/vehicle" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.vehicle.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 二手闲置 */}
            {categoryPosts.secondhand?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">🔄</span>
                      <span className="font-bold">二手闲置</span>
                    </div>
                    <Link to="/category/secondhand" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.secondhand.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 本地资讯 */}
            {categoryPosts.news?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">📰</span>
                      <span className="font-bold">本地资讯</span>
                    </div>
                    <Link to="/category/news" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.news.map(post => (
                    <PostItem key={post.id} post={post} showPrice={false} />
                  ))}
                </div>
              </div>
            )}

            {/* 同城商家 */}
            {categoryPosts.companies?.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-xl">🏢</span>
                      <span className="font-bold">同城商家</span>
                    </div>
                    <Link to="/category/companies" className="text-white/80 text-xs hover:text-white">
                      更多 →
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryPosts.companies.map(post => (
                    <PostItem key={post.id} post={post} showPrice={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 空状态 */}
          {topPosts.length === 0 && Object.values(categoryPosts).every(arr => arr.length === 0) && (
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