import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  house: '🏠', car: '🚗', job: '💼', business: '🛠️',
  used: '🔄', life: '☕', edu: '📚', other: '📌'
}

const CATEGORY_COLORS = {
  house: 'from-blue-50 to-blue-100 border-blue-200',
  car:   'from-green-50 to-green-100 border-green-200',
  job:   'from-orange-50 to-orange-100 border-orange-200',
  business: 'from-purple-50 to-purple-100 border-purple-200',
  used:  'from-yellow-50 to-yellow-100 border-yellow-200',
  life:  'from-pink-50 to-pink-100 border-pink-200',
  edu:   'from-indigo-50 to-indigo-100 border-indigo-200',
  other: 'from-gray-50 to-gray-100 border-gray-200',
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
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts/categories').then(r => r.json()),
      fetch('/api/posts?pageSize=20').then(r => r.json()),
    ]).then(([catData, postData]) => {
      if (catData.code === 200) setCategories(catData.data)
      if (postData.code === 200) setPosts(postData.data.list)
    }).finally(() => setLoading(false))
  }, [])

  const tools = [
    { icon: '🚚', title: '物流查询', desc: '快递/物流实时追踪', path: '/tools/logistics', color: 'from-blue-50 to-blue-100', accent: 'text-blue-600', tag: '实用工具' },
    { icon: '🛠️', title: '丝网报价', desc: '根据规格快速计算价格', path: '/tools/wiremesh', color: 'from-purple-50 to-purple-100', accent: 'text-purple-600', tag: '行业工具' },
    { icon: '📊', title: '原材料行情', desc: '钢丝/盘条实时价格', path: '/tools/materials', color: 'from-green-50 to-green-100', accent: 'text-green-600', tag: '市场行情' },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">🏠 安平同城网</h1>
        <p className="opacity-90 text-sm">安平县本地便民分类信息平台 · 免费发布 · 快速传播</p>
        <div className="flex gap-4 mt-4 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">🏠 房屋租售</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">💼 招聘求职</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">🚗 二手车</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">🔄 二手物品</span>
        </div>
      </div>

      {/* 分类导航 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-lg">📂 信息分类</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`card-hover bg-gradient-to-br ${CATEGORY_COLORS[cat.slug] || 'from-gray-50 to-gray-100 border-gray-200'} border rounded-xl p-3 flex flex-col items-center gap-1 text-center`}
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat.slug] || '📌'}</span>
                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 便民工具 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-lg">🛠️ 便民工具</h2>
          <Link to="/tools" className="text-xs text-primary hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {tools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`card-hover bg-gradient-to-br ${tool.color} border border-gray-200 rounded-xl p-5 flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{tool.icon}</span>
                <span className={`text-xs font-medium ${tool.accent} bg-white/70 px-2 py-0.5 rounded-full`}>{tool.tag}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{tool.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新信息 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-lg">🆕 最新信息</h2>
          <span className="text-xs text-gray-400">实时更新 · 快速联系</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 h-24 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>暂无信息，<Link to="/post-create" className="text-primary">成为第一个发布者</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="card-hover bg-white rounded-lg p-4 flex gap-4 border border-gray-100"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {CATEGORY_ICONS[post.category_id] || CATEGORY_ICONS.other}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-1">{post.title}</h3>
                    <span className="text-accent font-bold text-sm shrink-0">{formatPrice(post.price)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
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
