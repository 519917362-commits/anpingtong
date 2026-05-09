import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  return `${Math.floor(mins / 60)}小时前`
}

function formatPrice(price) {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const k = searchParams.get('keyword')
    if (k) {
      setKeyword(k)
      doSearch(k)
    }
  }, [searchParams])

  const doSearch = async (kw) => {
    if (!kw?.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?keyword=${encodeURIComponent(kw.trim())}&pageSize=20`)
      const data = await res.json()
      if (data.code === 200) {
        setPosts(data.data.list)
        setTotal(data.data.total)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    setSearchParams({ keyword: keyword.trim() })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <h2 className="text-lg font-bold mb-3">搜索信息</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="输入关键词搜索..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            搜索
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white h-20 animate-pulse rounded-lg" />)}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="text-sm text-gray-500 mb-3">找到 {total} 条与「{keyword}」相关的信息</div>
          <div className="space-y-3">
            {posts.map(post => (
              <Link key={post.id} to={`/post/${post.id}`}
                className="card-hover bg-white rounded-lg p-4 flex gap-4 border border-gray-100 block">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {post.category_icon || '📌'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
                    <span className="text-accent font-bold shrink-0">{formatPrice(post.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{post.category_name}</span>
                    <span>👁 {post.views}</span>
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : keyword ? (
        <div className="bg-white rounded-lg p-12 text-center text-gray-400">
          <p className="text-4xl mb-2">🔍</p>
          <p>没有找到与「{keyword}」相关的信息</p>
          <p className="text-xs mt-1">试试其他关键词</p>
        </div>
      ) : null}
    </div>
  )
}
