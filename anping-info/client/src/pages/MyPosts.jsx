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
  pending: { label: '待审核', class: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  approved: { label: '已通过', class: 'bg-green-100 text-green-700', icon: '✅' },
  rejected: { label: '已拒绝', class: 'bg-red-100 text-red-700', icon: '❌' },
}

function EditModal({ post, categories, onClose, onSuccess }) {
  const { token } = useAuth()
  const [form, setForm] = useState({
    category_id: post.category_id,
    title: post.title,
    content: post.content,
    price: post.price || '',
    contact: post.contact,
    location: post.location || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/user/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.code === 200) {
        onSuccess()
        onClose()
      } else {
        alert(data.message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">编辑信息</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类 <span className="text-red-500">*</span></label>
            <select
              value={form.category_id}
              onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">选择分类</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="请输入信息标题"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">详细信息 <span className="text-red-500">*</span></label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="请详细描述您的信息"
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="面议填0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系手机 <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                placeholder="手机号"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在地区</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="如：县城中心、工业园区"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">
            💡 编辑后信息需要重新审核才能显示
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MyPosts() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    Promise.all([
      fetch('/api/user/posts', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/posts/categories').then(r => r.json()),
    ]).then(([postData, catData]) => {
      if (postData.code === 200) setPosts(postData.data)
      if (catData.code === 200) setCategories(catData.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条信息吗？删除后无法恢复！')) return
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

  const handleEditSuccess = () => {
    fetch('/api/user/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.code === 200) setPosts(d.data) })
  }

  const stats = {
    total: posts.length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      {editingPost && categories.length > 0 && (
        <EditModal
          post={editingPost}
          categories={categories}
          onClose={() => setEditingPost(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">我的发布</h2>
          <Link to="/post-create" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg transition">
            + 发布信息
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">全部信息</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-yellow-600">待审核</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-green-600">已通过</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-red-600">已拒绝</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse bg-gray-100 rounded-xl" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 mb-4">你还没有发布任何信息</p>
          <Link to="/post-create" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition">
            <span>去发布第一条</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const status = STATUS_MAP[post.status] || STATUS_MAP.pending
            return (
              <div key={post.id} className={`bg-white rounded-xl border p-4 transition ${
                post.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
                post.status === 'rejected' ? 'border-red-200 bg-red-50/30' :
                'border-gray-100 hover:border-blue-200'
              }`}>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Link to={post.status === 'approved' ? `/post/${post.id}` : '#'} 
                         className={`font-bold text-gray-900 hover:text-blue-600 line-clamp-1 ${
                           post.status === 'approved' ? '' : 'cursor-default'
                         }`}>
                        {post.title}
                      </Link>
                      <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${status.class}`}>
                        <span>{status.icon}</span>
                        <span>{status.label}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <span>{post.category_icon || '📌'}</span>
                        <span>{post.category_name}</span>
                      </span>
                      <span>📞 {post.contact}</span>
                      {post.location && <span>📍 {post.location}</span>}
                      <span>{timeAgo(post.created_at)}</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>

                    {post.status === 'rejected' && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-2">
                        ⚠️ 您的信息未通过审核，可能包含违规内容或信息不完整，请修改后重新提交
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="text-blue-500 hover:text-blue-700 text-xs px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition flex items-center gap-1"
                    >
                      <span>✏️</span>
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="text-red-500 hover:text-red-700 text-xs px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition flex items-center gap-1"
                    >
                      <span>{deleting === post.id ? '⏳' : '🗑️'}</span>
                      <span>{deleting === post.id ? '删除中...' : '删除'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
