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
    { name: '安平黄页', path: '/yellow-pages', icon: '📖' },
    { name: '我的', path: user ? '/my-posts' : '/login', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-blue-600 text-2xl font-bold">logo</span>
              <span className="font-bold text-xl text-gray-900">安平同城</span>
            </Link>

            {/* 定位 */}
            <div className="hidden sm:flex items-center gap-1 text-gray-600 text-sm shrink-0">
              <span>📍</span>
              <span>安平县</span>
              <span className="text-gray-400">▼</span>
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex border border-gray-200 rounded-full overflow-hidden">
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="搜职位、找房、找二手..."
                className="flex-1 px-4 py-2.5 text-sm outline-none min-w-0"
              />
              <button type="submit" className="bg-gray-100 px-4 text-gray-500 hover:bg-gray-200 transition shrink-0">
                <span className="text-lg">🔍</span>
              </button>
            </form>

            {/* 免费发布按钮 */}
            <Link
              to={user ? '/post-create' : '/login'}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition shrink-0 shadow-md flex items-center gap-1"
            >
              <span>+</span>
              <span>免费发布</span>
            </Link>

            {/* 登录 */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <span>👤</span>
              </div>
              {!user ? (
                <Link to="/login" className="text-gray-600 text-sm hover:text-blue-600 transition hidden sm:block">登录</Link>
              ) : (
                <button onClick={handleLogout} className="text-gray-600 text-sm hover:text-blue-600 transition">退出</button>
              )}
            </div>
          </div>
        </div>

        {/* 导航分类 - 桌面端顶部导航 */}
        <nav className="border-t border-gray-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
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

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-4 mb-16 md:mb-0">
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
        <div className="max-w-7xl mx-auto px-4 py-6">
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