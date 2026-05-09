import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PostCreate() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    category_id: '', title: '', content: '', price: '', contact: user?.phone || '', location: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetch('/api/posts/categories')
      .then(r => r.json())
      .then(d => { if (d.code === 200) setCategories(d.data) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.category_id) return setError('请选择分类')
    if (!form.title.trim()) return setError('请输入标题')
    if (!form.content.trim()) return setError('请输入详细信息')
    if (!form.contact.trim()) return setError('请输入联系方式')

    setLoading(true)
    try {
      const res = await fetch('/api/user/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.code === 200) {
        navigate('/my-posts')
      } else {
        setError(data.message || '发布失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-1">发布信息</h2>
        <p className="text-gray-400 text-sm mb-6">免费发布分类信息，快速触达安平本地用户</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              信息分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={set('category_id')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            >
              <option value="">请选择分类</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              信息标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={form.title} onChange={set('title')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="例如：出租县城中心两室一厅" maxLength={50} required />
            <div className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/50</div>
          </div>

          {/* 价格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">价格（元）</label>
            <input type="number" value={form.price} onChange={set('price')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="填写价格，0或空表示面议" min="0" />
          </div>

          {/* 详细信息 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              详细信息 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content} onChange={set('content')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="详细描述您的信息，让对方更了解..." rows={5} maxLength={1000} required />
            <div className="text-xs text-gray-400 mt-1 text-right">{form.content.length}/1000</div>
          </div>

          {/* 联系方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              联系电话 <span className="text-red-500">*</span>
            </label>
            <input type="tel" value={form.contact} onChange={set('contact')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="请输入手机号" required />
          </div>

          {/* 位置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">位置/地址</label>
            <input type="text" value={form.location} onChange={set('location')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="例如：县城中心、xx小区、xx路" />
          </div>

          {/* 提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-600">
            💡 提示：发布后需管理员审核，审核通过后即可展示。请确保信息真实有效。
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent-dark transition disabled:opacity-50">
            {loading ? '提交中...' : '发布信息'}
          </button>
        </form>
      </div>
    </div>
  )
}
