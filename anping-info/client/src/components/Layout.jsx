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
    // 获取最新一条公告
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
    { name: '首页', path: '/' },
    { name: '房屋租售', path: '/category/house' },
    { name: '车辆服务', path: '/category/vehicle' },
    { name: '招聘求职', path: '/jobs' },
    { name: '企业黄页', path: '/companies' },
    { name: '拼车出行', path: '/category/carpool' },
    { name: '促销打折', path: '/category/promotions' },
    { name: '便民工具', path: '/tools' },
    { name: '公告', path: '/notices' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部公告栏 */}
      {notice && (
        <Link
          to={`/notice/${notice.id}`}
          className="block bg-blue-600 text-white text-xs py-1.5 hover:bg-blue-700 transition"
        >
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-2">
            <span className="bg-white text-blue-600 font-bold text-xs px-1.5 py-0.5 rounded shrink-0">公告</span>
            <span className="truncate">{notice.title}</span>
            <span className="text-blue-200 shrink-0 ml-2">查看 →</span>
          </div>
        </Link>
      )}

      {/* 顶部栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* 顶部小栏 */}
        <div className="bg-gray-900 text-white text-xs">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex justify-between items-center">
            <span>欢迎访问安平同城网，安平县本地便民信息平台</span>
            <div className="flex items-center gap-4">
              <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">冀ICP备14020733号</a>
              {!user ? (
                <>
                  <Link to="/login" className="hover:text-gray-300">登录</Link>
                  <Link to="/register" className="hover:text-gray-300">注册</Link>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-gray-300">👤 {user.username}</span>
                  <Link to="/my-posts" className="hover:text-gray-300">我的发布</Link>
                  <button onClick={handleLogout} className="hover:text-gray-300">退出</button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Logo + 搜索 + 发布按钮 */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-3xl">🏠</span>
              <div>
                <div className="font-bold text-lg text-gray-900 leading-tight">安平同城网</div>
                <div className="text-xs text-gray-400">安平县便民信息</div>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl flex border border-gray-200 rounded-full overflow-hidden">
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="搜索房屋、招聘、二手..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-primary px-5 text-white text-sm hover:bg-primary-dark transition">
                搜索
              </button>
            </form>

            <Link
              to={user ? '/post-create' : '/login'}
              className="bg-accent text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent-dark transition shrink-0"
            >
              + 发布信息
            </Link>
          </div>
        </div>

        {/* 导航分类 */}
        <nav className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto text-sm">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2.5 whitespace-nowrap border-b-2 transition ${
                    location.pathname === item.path
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-gray-600 hover:text-primary'
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
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-400 text-xs mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div>
              <div className="text-white text-sm font-medium mb-2">安平同城网</div>
              <p className="leading-relaxed">安平县本地分类信息平台，免费发布房屋租售、招聘求职、二手物品等信息。</p>
              <div className="mt-2 text-gray-500">
                <p>📞 客服热线：400-888-8888</p>
                <p>📱 微信：anping_tongcheng</p>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">信息分类</div>
              <div className="space-y-1">
                <Link to="/category/house" className="block hover:text-white">🏠 房屋租售</Link>
                <Link to="/jobs" className="block hover:text-white">💼 招聘求职</Link>
                <Link to="/category/vehicle" className="block hover:text-white">🚗 车辆服务</Link>
                <Link to="/category/secondhand" className="block hover:text-white">🔄 二手物品</Link>
                <Link to="/category/carpool" className="block hover:text-white">🚙 拼车出行</Link>
                <Link to="/category/promotions" className="block hover:text-white">🏷️ 促销打折</Link>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">企业服务</div>
              <div className="space-y-1">
                <Link to="/companies" className="block hover:text-white">🏢 企业黄页</Link>
                <Link to="/notices" className="block hover:text-white">📢 平台公告</Link>
                <Link to="/page/about" className="block hover:text-white">ℹ️ 关于我们</Link>
                <Link to="/page/contact" className="block hover:text-white">📞 联系我们</Link>
              </div>
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-2">便民工具</div>
              <div className="space-y-1">
                <Link to="/tools/logistics" className="block hover:text-white">🚚 物流查询</Link>
                <Link to="/tools/wiremesh" className="block hover:text-white">🛠️ 丝网报价</Link>
                <Link to="/tools/materials" className="block hover:text-white">📊 原材料行情</Link>
              </div>
              <div className="mt-3">
                <div className="text-white text-sm font-medium mb-2">法律声明</div>
                <div className="space-y-1">
                  <Link to="/page/agreement" className="block hover:text-white">📄 用户协议</Link>
                  <Link to="/page/privacy" className="block hover:text-white">🔒 隐私政策</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center">
            <p>© 2025 安平同城网 · 冀ICP备14020733号 · 冀公网安备13112500000000号</p>
            <p className="mt-1">安平同城网仅提供信息存储空间，平台信息由用户自行发布，因信息交易产生的一切后果由发布者自行承担。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
