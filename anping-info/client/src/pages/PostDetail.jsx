import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

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

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [topPosts, setTopPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${id}`).then(r => r.json()),
      fetch(`/api/posts?category=${'jobs-recruit'}&type=top&pageSize=5`).then(r => r.json()).catch(() => ({ code: 200, data: { list: [] } }))
    ]).then(([postData, topData]) => {
      if (postData.code === 200) {
        setPost(postData.data)
        if (topData.code === 200) {
          setTopPosts(topData.data.list.filter(p => p.id !== postData.data.id).slice(0, 4))
        }
      } else {
        navigate('/')
      }
      setLoading(false)
    }).catch(() => {
      navigate('/')
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg h-96 animate-pulse" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部置顶广告/推荐 */}
      {topPosts.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topPosts.map(p => (
              <Link
                key={p.id}
                to={`/post/${p.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="bg-gradient-to-br from-orange-400 to-red-500 h-20 flex items-center justify-center text-white text-2xl">
                  📢
                </div>
                <div className="p-2">
                  <h4 className="text-xs text-gray-700 line-clamp-2 group-hover:text-red-500">{p.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 面包屑导航 */}
      <div className="bg-white rounded-lg px-4 py-3 mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-red-500">首页</Link>
        <span className="mx-2">→</span>
        <Link to={`/category/${post.category_slug}`} className="hover:text-red-500">{post.category_name}</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-700 line-clamp-1">{post.title}</span>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        {/* 标题区域 */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>{new Date(post.created_at).toLocaleString('zh-CN')}</span>
            <span>浏览 {post.views} 次</span>
          </div>
        </div>

        {/* 联系信息卡片 - 参考博陵网风格 */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.contact && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
                    📞
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">联系电话</div>
                    <div className="text-xl font-bold text-gray-900">{post.contact.split(',')[0].trim()}</div>
                  </div>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                    📍
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">工作地区</div>
                    <div className="text-lg font-medium text-gray-700">{post.location}</div>
                  </div>
                </div>
              )}
              {post.username && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                    👤
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">发布者</div>
                    <div className="text-lg font-medium text-gray-700">{post.username}</div>
                  </div>
                </div>
              )}
              {post.salary_min > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                    💰
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">月薪待遇</div>
                    <div className="text-lg font-bold text-red-500">
                      {post.salary_min > 0 && post.salary_max > 0 
                        ? `${post.salary_min}-${post.salary_max}元` 
                        : `${post.salary_min}元/月`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 正文内容 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">📝 信息内容</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content || '暂无详细信息'}
          </div>
        </div>

        {/* 安全提示 */}
        <div className="mx-6 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <span className="font-bold">⚠️ 安全提示：</span>
            请当面验证信息真实性，谨慎汇款。平台仅提供信息展示，不对交易安全负责。
          </p>
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-red-500 text-sm transition"
        >
          ← 返回上一页
        </button>
      </div>
    </div>
  )
}
