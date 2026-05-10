import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATEGORY_ICONS = {
  'jobs-recruit': '💼', 'job-seeker': '📋', house: '🏠', 'door-service': '🔧',
  'shop-transfer': '🏪', secondhand: '🔄', news: '📰', companies: '🏢',
  vehicle: '🚗', 'wiremesh-machine': '⚙️', 'wiremesh-material': '🔩',
  'wiremesh-product': '🕸️', 'wiremesh-price': '📊', discounts: '🎁',
  'wechat-group': '💬', other: '📌'
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
  const [topPosts, setTopPosts] = useState([])
  const [jobsPosts, setJobsPosts] = useState([])
  const [housePosts, setHousePosts] = useState([])
  const [shopPosts, setShopPosts] = useState([])
  const [newsPosts, setNewsPosts] = useState([])
  const [loading, setLoading] = useState(true)

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
