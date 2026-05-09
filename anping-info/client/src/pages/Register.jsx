import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username.trim()) return setError('请输入用户名')
    if (!/^1[3-9]\d{9}$/.test(form.phone)) return setError('请输入正确的手机号')
    if (form.password.length < 6) return setError('密码至少6位')
    if (form.password !== form.confirmPassword) return setError('两次密码不一致')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, phone: form.phone, password: form.password })
      })
      const data = await res.json()
      if (data.code === 200) {
        login(data.data.user, data.data.token)
        navigate('/')
      } else {
        setError(data.message || '注册失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-2">免费注册</h2>
        <p className="text-center text-gray-400 text-sm mb-6">加入安平同城网</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input type="text" value={form.username} onChange={set('username')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="设置用户名" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="tel" value={form.phone} onChange={set('phone')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="输入手机号（用于登录）" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" value={form.password} onChange={set('password')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="设置密码（至少6位）" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="再次输入密码" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition disabled:opacity-50">
            {loading ? '注册中...' : '立即注册'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          已有账号？<Link to="/login" className="text-primary font-medium">登录</Link>
        </p>
      </div>
    </div>
  )
}
