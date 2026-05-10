import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [keyword, setKeyword] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    fetch('/api/notices?type=notice&pageSize=1').then(r => r.json()).then(data => {
      if (data.code === 200 && data.data.list.length > 0) {
        setNotice(data.data.list[0])
      }
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`)
      setKeyword('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const NAV_ITEMS = [
    { name: '首页', path: '/', icon: '🏠' },
    { name: '丝网产业', path: '/tools/wiremesh', icon: '🕸️' },
    { name: '分类资讯', path: '/categories', icon: '📑' },
    { name: '我的', path: user ? '/my-posts' : '/login', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Web端顶部条幅广告 - 仅在桌面端显示 */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <div className="font-bold text-sm">安平同城网</div>
              <div className="text-xs text-blue-200">安平县本地分类信息平台</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/tools/wiremesh" className="hover:text-blue-200 transition text-sm flex items-center gap-1">
              <span>🕸️</span>
              <span>丝网产业</span>
            </Link>
            <Link to="/categories" className="hover:text-blue-200 transition text-sm flex items-center gap-1">
              <span>📑</span>
              <span>分类资讯</span>
            </Link>
            <Link to="/companies" className="hover:text-blue-200 transition text-sm flex items-center gap-1">
              <span>🏢</span>
              <span>同城商家</span>
            </Link>
          </div>
          <Link
            to={user ? '/post-create' : '/login'}
            className="bg-white text-blue-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition"
          >
            + 发布信息
          </Link>
        </div>
      </div>

      {/* 顶部公告栏 - 仅在非首页显示 */}
      {location.pathname !== '/' && notice && (
        <Link
          to={`/notice/${notice.id}`}
          className="block bg-blue-600 text-white text-xs py-1.5 hover:bg-blue-700 transition"
        >
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-2">
            <span className="bg-white text-blue-600 font-bold text-xs px-1.5 py-0.5 rounded shrink-0">公告</span>
            <span className="truncate">{notice.title}</span>
          </div>
        </Link>
      )}

      {/* 顶部栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* 顶部小栏 - 移动端简化 */}
        <div className="bg-gray-900 text-white text-xs">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex justify-between items-center">
            <span className="hidden sm:inline">欢迎访问安平同城网</span>
            <span className="sm:hidden">安平同城网</span>
            <div className="flex items-center gap-2 sm:gap-4">
              {!user ? (
                <>
                  <Link to="/login" className="hover:text-gray-300 text-xs">登录</Link>
                  <Link to="/register" className="hover:text-gray-300 text-xs">注册</Link>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs hidden sm:inline">👤 {user.username}</span>
                  <button onClick={handleLogout} className="hover:text-gray-300 text-xs">退出</button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Logo + 搜索 + 发布按钮 - 与分类资讯样式一致 */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl sm:text-3xl">🏠</span>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-gray-900">安平同城网</div>
                <div className="text-xs text-gray-400">便民信息平台</div>
              </div>
            </Link>

            {/* 搜索框 - 非首页显示 */}
            {location.pathname !== '/' && (
              <form onSubmit={handleSearch} className="flex-1 max-w-xl flex border border-gray-200 rounded-full overflow-hidden">
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="搜索..."
                  className="flex-1 px-3 py-2 text-sm outline-none min-w-0"
                />
                <button type="submit" className="bg-blue-500 px-3 sm:px-5 text-white text-sm hover:bg-blue-600 transition shrink-0">
                  <span className="sm:hidden">🔍</span>
                  <span className="hidden sm:inline">搜索</span>
                </button>
              </form>
            )}

            {/* 发布按钮 */}
            <Link
              to={user ? '/post-create' : '/login'}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition shrink-0 shadow-md"
            >
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ 发布信息</span>
            </Link>
          </div>
        </div>

        {/* 导航分类 - 桌面端顶部导航 */}
        <nav className="border-t border-gray-100 hidden md:block">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1 text-sm">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2.5 whitespace-nowrap border-b-2 transition ${
                    location.pathname === item.path
                      ? 'border-blue-500 text-blue-500 font-medium'
                      : 'border-transparent text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* 主内容 - 移动端预留底部导航空间 */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 mb-16 md:mb-0">
        <Outlet />
      </main>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-14">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                location.pathname === item.path
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-400 text-xs mt-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-white text-sm font-medium mb-2">安平同城网</div>
              <p className="text-xs">安平县本地分类信息平台</p>
              <div className="mt-2 text-gray-500">
                <p className="text-xs">📞 客服：400-888-8888</p>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">信息分类</div>
              <div className="space-y-1">
                <Link to="/category/house" className="block hover:text-white text-xs">🏠 房屋</Link>
                <Link to="/jobs" className="block hover:text-white text-xs">💼 招聘</Link>
                <Link to="/category/vehicle" className="block hover:text-white text-xs">🚗 车辆</Link>
                <Link to="/category/secondhand" className="block hover:text-white text-xs">🔄 二手</Link>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">企业服务</div>
              <div className="space-y-1">
                <Link to="/companies" className="block hover:text-white text-xs">🏢 企业黄页</Link>
                <Link to="/notices" className="block hover:text-white text-xs">📢 公告</Link>
                <Link to="/page/about" className="block hover:text-white text-xs">ℹ️ 关于我们</Link>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">便民工具</div>
              <div className="space-y-1">
                <Link to="/tools/logistics" className="block hover:text-white text-xs">🚚 物流查询</Link>
                <Link to="/tools/wiremesh" className="block hover:text-white text-xs">🛠️ 丝网报价</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center">
            <p className="text-xs">© 2025 安平同城网 · 冀ICP备14020733号</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
