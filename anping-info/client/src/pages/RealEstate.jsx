import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HOUSE_CATEGORIES = [
  {
    id: 'zufang',
    name: '租房',
    icon: '🔑',
    color: 'from-blue-500 to-cyan-500',
    subCategories: [
      { name: '住宅出租', slug: 'house-rent', fid: 14 },
      { name: '厂房出租', slug: 'factory-rent', fid: 11 },
      { name: '商铺出租', slug: 'shop-rent', fid: 16 },
      { name: '土地出租', slug: 'land-rent', fid: 15 },
      { name: '厂房求租', slug: 'factory-wanted', fid: 13 },
    ]
  },
  {
    id: 'ershoufang',
    name: '二手房',
    icon: '🏡',
    color: 'from-green-500 to-emerald-500',
    subCategories: [
      { name: '住宅出售', slug: 'house-sale', fid: 12 },
      { name: '个人房源', slug: 'personal' },
      { name: '急售房源', slug: 'urgent' },
      { name: '学区房', slug: 'school' },
    ]
  },
  {
    id: 'shangpu',
    name: '商铺门店',
    icon: '🏪',
    color: 'from-orange-500 to-amber-500',
    subCategories: [
      { name: '商铺出售', slug: 'shop-sale', fid: 16 },
      { name: '商铺转让', slug: 'shop-transfer', fid: 17 },
      { name: '商铺求租', slug: 'shop-wanted' },
      { name: '生意转让', slug: 'business' },
    ]
  },
  {
    id: 'changfang',
    name: '厂房',
    icon: '🏭',
    color: 'from-purple-500 to-pink-500',
    subCategories: [
      { name: '厂房出租', slug: 'factory-rent', fid: 11 },
      { name: '厂房出售', slug: 'factory-sale' },
      { name: '厂房转让', slug: 'factory-transfer' },
      { name: '厂房求租', slug: 'factory-wanted', fid: 13 },
      { name: '库房出租', slug: 'warehouse' },
    ]
  },
  {
    id: 'tudi',
    name: '土地',
    icon: '🌍',
    color: 'from-lime-500 to-green-500',
    subCategories: [
      { name: '土地转让', slug: 'land-transfer', fid: 15 },
      { name: '土地出租', slug: 'land-rent' },
      { name: '厂房用地', slug: 'factory-land' },
    ]
  },
  {
    id: 'chewei',
    name: '车位',
    icon: '🚗',
    color: 'from-gray-500 to-slate-500',
    subCategories: [
      { name: '车位出售', slug: 'parking-sale' },
      { name: '车位出租', slug: 'parking-rent' },
      { name: '车库出售', slug: 'garage-sale' },
    ]
  },
]

export default function RealEstate() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/posts?category=house&pageSize=20')
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) setPosts(data.data.list)
        setLoading(false)
      })
  }, [])

  const formatPrice = (price, title) => {
    if (!price || price === 0) return '面议'
    if (title?.includes('租')) {
      return `${Number(price).toLocaleString()}/月`
    }
    return `${Number(price).toLocaleString()}万`
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 1) return '今天'
    if (days < 7) return `${days}天前`
    return dateStr.slice(5, 10)
  }

  return (
    <div className="space-y-4">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>🏠</span> 安平房产
            </h1>
            <p className="text-sm opacity-80 mt-1">安平县本地房产信息平台</p>
          </div>
          <Link
            to="/post-create"
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
          >
            免费发布
          </Link>
        </div>
      </div>

      {/* 六大分类 - 2行3列网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {HOUSE_CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={`/real-estate/${cat.id}`}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="font-bold text-gray-800 text-lg">{cat.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.subCategories.slice(0, 4).map(sub => (
                <span
                  key={sub.slug}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* 最新房源列表 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-gray-400 mb-4">暂无房产信息</p>
          <Link
            to="/post-create"
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            发布房源
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="font-bold text-gray-800">最新房源</span>
                <span className="text-xs text-gray-400">({posts.length}条)</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {post.house_type === '厂房' ? '🏭' : post.house_type === '住宅' ? '🏠' : '🏪'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">{post.house_type || '房产'}</span>
                    {post.house_area > 0 && <span>{post.house_area}㎡</span>}
                    <span>{post.location || '安平县'}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-red-500 font-bold">
                    {formatPrice(post.price, post.title)}
                  </div>
                  <div className="text-xs text-gray-400">{timeAgo(post.created_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
