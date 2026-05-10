import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function formatPrice(price) {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

export default function PostDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) setPost(d.data)
        else {
          console.error('获取帖子失败:', d.message)
          navigate('/')
        }
      })
      .catch(err => {
        console.error('网络错误:', err)
        navigate('/')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg h-96 animate-pulse" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="max-w-3xl mx-auto">
      {/* 面包屑 */}
      <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${post.category_id}`} className="hover:text-primary">{post.category_name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 line-clamp-1">{post.title}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        {/* 标题区 */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="text-accent text-2xl font-bold">{formatPrice(post.price)}</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{post.category_name}</span>
            <span className="text-gray-400 text-sm">👁 {post.views}次浏览</span>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-700 text-sm mb-3">📞 联系信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
              <span className="text-lg">📱</span>
              <div>
                <div className="text-xs text-gray-400">联系电话</div>
                <div className="font-bold text-gray-800">{post.contact}</div>
              </div>
            </div>
            {post.location && (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                <span className="text-lg">📍</span>
                <div>
                  <div className="text-xs text-gray-400">所在位置</div>
                  <div className="font-medium text-gray-700">{post.location}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
              <span className="text-lg">👤</span>
              <div>
                <div className="text-xs text-gray-400">发布者</div>
                <div className="font-medium text-gray-700">{post.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
              <span className="text-lg">🕐</span>
              <div>
                <div className="text-xs text-gray-400">发布时间</div>
                <div className="font-medium text-gray-700">{new Date(post.created_at).toLocaleString('zh-CN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="p-6">
          <h3 className="font-bold text-gray-700 text-sm mb-3">📝 详细信息</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* 底部安全提示 */}
        <div className="px-6 pb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-700">
            <strong>⚠️ 安全提示：</strong>请当面验证商品/服务信息，谨慎汇款。平台仅提供信息展示，不对交易安全负责。如遇欺诈请报警。
          </div>
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="mt-4 text-center">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary text-sm">
          ← 返回上一页
        </button>
      </div>
    </div>
  )
}
