import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

const STATUS_MAP = {
  pending: { label: '待审核', class: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已通过', class: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', class: 'bg-red-100 text-red-700' },
}

export default function MyPosts() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetch('/api/user/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.code === 200) setPosts(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条信息吗？')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/user/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.code === 200) setPosts(prev => prev.filter(p => p.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">我的发布</h2>
          <Link to="/post-create" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm hover:bg-primary-dark transition">
            + 发布信息
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse bg-gray-100 rounded-lg" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>你还没有发布任何信息</p>
            <Link to="/post-create" className="text-primary mt-2 inline-block">去发布第一条</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => {
              const status = STATUS_MAP[post.status] || STATUS_MAP.pending
              return (
                <div key={post.id} className="border border-gray-100 rounded-lg p-4 flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/post/${post.id}`} className="font-medium text-gray-900 hover:text-primary line-clamp-1">
                        {post.title}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${status.class}`}>{status.label}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{post.category_name}</span>
                      <span>📞 {post.contact}</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-red-400 hover:text-red-600 text-xs shrink-0 px-2 py-1"
                  >
                    {deleting === post.id ? '删除中...' : '删除'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
