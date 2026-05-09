import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

const API = '/api'

function api(path, opts = {}) {
  const token = localStorage.getItem('admin_token')
  return fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opts.headers
    }
  })
}

// ── 登录页 ──────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: 'admin', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const res = await api('/admin/login', {
      method: 'POST',
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.code === 200) {
      localStorage.setItem('admin_token', data.data.token)
      onLogin()
      navigate('/')
    } else {
      setError(data.message || '登录失败')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white rounded-xl p-8 w-80 shadow-sm">
        <h2 className="text-xl font-bold text-center mb-6">🔧 管理后台</h2>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}
        <div className="space-y-3">
          <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="用户名" />
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="密码" />
          <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium">登录</button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">默认账号: admin / admin123</p>
      </form>
    </div>
  )
}

// ── 侧边栏 ──────────────────────────────────────────────
function Sidebar({ current }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: '📊 数据概览', key: 'dashboard' },
    { path: '/posts', label: '📋 信息管理', key: 'posts' },
    { path: '/categories', label: '📂 分类管理', key: 'categories' },
    { path: '/users', label: '👥 用户管理', key: 'users' },
  ]

  return (
    <div className="w-52 bg-gray-900 text-white min-h-screen p-4 shrink-0">
      <div className="mb-6 text-center">
        <div className="text-lg font-bold">🏠 安平同城</div>
        <div className="text-xs text-gray-400">管理后台</div>
      </div>
      <nav className="space-y-1">
        {navItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`block px-3 py-2 rounded-lg text-sm transition ${
              current === item.key
                ? 'bg-primary font-medium'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 space-y-1">
        <Link to="/" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800">← 返回前台</Link>
        <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800">🚪 退出登录</button>
      </div>
    </div>
  )
}

// ── 概览页 ──────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    api('/admin/stats').then(r => r.json()).then(d => { if (d.code === 200) setStats(d.data) })
  }, [])
  if (!stats) return <div className="p-6 animate-pulse text-gray-400">加载中...</div>
  const cards = [
    { label: '全部信息', value: stats.posts, icon: '📋', color: 'bg-blue-50 text-blue-600' },
    { label: '用户总数', value: stats.users, icon: '👥', color: 'bg-green-50 text-green-600' },
    { label: '待审核', value: stats.pending, icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
    { label: '已通过', value: stats.approved, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
  ]
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">📊 数据概览</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-2xl font-bold">{stats ? c.value : '-'}</div>
            <div className="text-sm opacity-80">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 信息管理页 ───────────────────────────────────────────
function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchPosts = (p = 1, f = filter) => {
    setLoading(true)
    const url = `/admin/posts?page=${p}&pageSize=20${f ? `&status=${f}` : ''}`
    api(url).then(r => r.json()).then(d => {
      if (d.code === 200) { setPosts(d.data.list); setTotal(d.data.total); setPage(p) }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const handleStatus = async (id, status) => {
    const res = await api(`/admin/posts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    const d = await res.json()
    if (d.code === 200) fetchPosts(page, filter)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    const res = await api(`/admin/posts/${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (d.code === 200) fetchPosts(page, filter)
  }

  const STATUS_BTN = {
    pending: [{ label: '通过', action: 'approved', class: 'bg-green-100 text-green-700' }],
    approved: [{ label: '拒绝', action: 'rejected', class: 'bg-red-100 text-red-700' }],
    rejected: [{ label: '通过', action: 'approved', class: 'bg-green-100 text-green-700' }],
  }

  const statusBadge = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📋 信息管理</h2>
        <select value={filter} onChange={e => { setFilter(e.target.value); fetchPosts(1, e.target.value) }}
          className="border rounded-lg px-3 py-1.5 text-sm">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暂无数据</div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-3">共 {total} 条</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2 font-medium text-gray-500">ID</th>
                  <th className="px-3 py-2 font-medium text-gray-500">标题</th>
                  <th className="px-3 py-2 font-medium text-gray-500">分类</th>
                  <th className="px-3 py-2 font-medium text-gray-500">发布者</th>
                  <th className="px-3 py-2 font-medium text-gray-500">状态</th>
                  <th className="px-3 py-2 font-medium text-gray-500">时间</th>
                  <th className="px-3 py-2 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400">{p.id}</td>
                    <td className="px-3 py-2 max-w-xs truncate">{p.title}</td>
                    <td className="px-3 py-2">{p.category_name}</td>
                    <td className="px-3 py-2">{p.username || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge[p.status]}`}>
                        {{ pending: '待审', approved: '通过', rejected: '拒绝' }[p.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-400">{p.created_at?.slice(0, 10)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 flex-wrap">
                        {(STATUS_BTN[p.status] || []).map(btn => (
                          <button key={btn.action}
                            onClick={() => handleStatus(p.id, btn.action)}
                            className={`px-2 py-0.5 rounded text-xs ${btn.class}`}>
                            {btn.label}
                          </button>
                        ))}
                        <button onClick={() => handleDelete(p.id)}
                          className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-600">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => fetchPosts(page - 1)} disabled={page <= 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40">上一页</button>
              <span className="px-3 py-1 text-sm text-gray-400">第 {page} 页</span>
              <button onClick={() => fetchPosts(page + 1)} disabled={posts.length < 20}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40">下一页</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── 分类管理页 ───────────────────────────────────────────
function CategoriesPage() {
  const [cats, setCats] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', icon: '', sort_order: 0 })
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')

  const load = () => api('/admin/categories').then(r => r.json()).then(d => { if (d.code === 200) setCats(d.data) })
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    const res = editingId
      ? await api(`/admin/categories/${editingId}`, { method: 'PUT', body: JSON.stringify(form) })
      : await api('/admin/categories', { method: 'POST', body: JSON.stringify(form) })
    const d = await res.json()
    if (d.code === 200) {
      setMsg(editingId ? '更新成功' : '添加成功')
      setForm({ name: '', slug: '', icon: '', sort_order: 0 })
      setEditingId(null)
      load()
    } else {
      setMsg(d.message || '操作失败')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '', sort_order: cat.sort_order || 0 })
  }

  const del = async (id) => {
    if (!confirm('删除该分类？')) return
    const d = await api(`/admin/categories/${id}`, { method: 'DELETE' }).then(r => r.json())
    if (d.code === 200) load()
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">📂 分类管理</h2>
      <form onSubmit={submit} className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">名称</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-1.5 text-sm w-28" placeholder="名称" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
            className="border rounded-lg px-3 py-1.5 text-sm w-28" placeholder="英文标识" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">图标</label>
          <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
            className="border rounded-lg px-3 py-1.5 text-sm w-16" placeholder="emoji" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">排序</label>
          <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="border rounded-lg px-3 py-1.5 text-sm w-16" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm">
            {editingId ? '更新' : '添加'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', slug: '', icon: '', sort_order: 0 }) }}
              className="border px-4 py-1.5 rounded-lg text-sm">取消</button>
          )}
        </div>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium text-gray-500">排序</th>
              <th className="px-3 py-2 font-medium text-gray-500">图标</th>
              <th className="px-3 py-2 font-medium text-gray-500">名称</th>
              <th className="px-3 py-2 font-medium text-gray-500">slug</th>
              <th className="px-3 py-2 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cats.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-400">{c.sort_order}</td>
                <td className="px-3 py-2 text-lg">{c.icon}</td>
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-gray-400">{c.slug}</td>
                <td className="px-3 py-2">
                  <button onClick={() => startEdit(c)} className="text-primary text-xs mr-2 hover:underline">编辑</button>
                  <button onClick={() => del(c.id)} className="text-red-500 text-xs hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── 用户管理页 ───────────────────────────────────────────
function UsersPage() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    api('/admin/users').then(r => r.json()).then(d => { if (d.code === 200) setUsers(d.data) })
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">👥 用户管理</h2>
      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暂无用户</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2 font-medium text-gray-500">ID</th>
                <th className="px-3 py-2 font-medium text-gray-500">用户名</th>
                <th className="px-3 py-2 font-medium text-gray-500">手机号</th>
                <th className="px-3 py-2 font-medium text-gray-500">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400">{u.id}</td>
                  <td className="px-3 py-2 font-medium">{u.username}</td>
                  <td className="px-3 py-2">{u.phone}</td>
                  <td className="px-3 py-2 text-gray-400">{u.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── 根组件 ──────────────────────────────────────────────
function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('admin_token'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          loggedIn ? <Navigate to="/" /> : <LoginPage onLogin={() => setLoggedIn(true)} />
        } />
        <Route path="/*" element={
          !loggedIn ? <Navigate to="/login" /> : (
            <div className="flex min-h-screen bg-gray-100">
              <SidebarWithRoute />
              <div className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/posts" element={<PostsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Routes>
              </div>
            </div>
          )
        } />
      </Routes>
    </BrowserRouter>
  )
}

function SidebarWithRoute() {
  const { pathname } = window.location
  const current = pathname.replace('/', '') || 'dashboard'
  return <Sidebar current={current} />
}

export default AdminApp
