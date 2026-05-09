import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

function formatPrice(price) {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

export default function Category() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    setLoading(true)
    setPage(1)
    Promise.all([
      fetch('/api/posts/categories').then(r => r.json()),
      fetch(`/api/posts?category=${slug}&page=1&pageSize=${pageSize}`).then(r => r.json()),
    ]).then(([catData, postData]) => {
      if (catData.code === 200) {
        setCategories(catData.data)
        const found = catData.data.find(c => c.slug === slug)
        setCategory(found)
      }
      if (postData.code === 200) {
        setPosts(postData.data.list)
        setTotal(postData.data.total)
      }
    }).finally(() => setLoading(false))
  }, [slug])

  const loadMore = () => {
    const nextPage = page + 1
    fetch(`/api/posts?category=${slug}&page=${nextPage}&pageSize=${pageSize}`)
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) {
          setPosts(prev => [...prev, ...d.data.list])
          setPage(nextPage)
        }
      })
  }

  return (
    <div className="flex gap-6">
      {/* 侧边分类栏 */}
      <aside className="hidden md:block w-48 shrink-0">
        <div className="bg-white rounded-lg border border-gray-100 p-3 sticky top-24">
          <h3 className="font-bold text-gray-700 text-sm mb-2">📂 全部分类</h3>
          <div className="space-y-0.5">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`block px-3 py-2 rounded text-sm transition ${
                  cat.slug === slug
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span>/</span>
            <span className="text-primary font-medium">{category?.name || slug}</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-24 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>该分类暂无信息</p>
            <Link to="/post-create" className="text-primary mt-2 inline-block">去发布</Link>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-3">共找到 {total} 条信息</div>
            <div className="space-y-3">
              {posts.map(post => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="card-hover bg-white rounded-lg p-4 flex gap-4 border border-gray-100 block"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl shrink-0">
                    {category?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
                      <span className="text-accent font-bold shrink-0">{formatPrice(post.price)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>👤 {post.username}</span>
                      <span>📍 {post.location || '安平县'}</span>
                      <span>👁 {post.views}</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {posts.length < total && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMore}
                  className="bg-white border border-gray-200 text-gray-600 px-8 py-2 rounded-full text-sm hover:border-primary hover:text-primary transition"
                >
                  加载更多 ({total - posts.length} 条)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
