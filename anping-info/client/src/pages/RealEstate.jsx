import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HOUSE_CATEGORIES = [
  {
    id: 'zufang',
    name: '租房',
    icon: '🔑',
    color: 'blue',
    bgColor: 'bg-blue-500',
    keywords: ['出租', '租'],
    subCategories: [
      { name: '整租', slug: 'zhengzu' },
      { name: '合租', slug: 'hezu' },
      { name: '公寓', slug: 'gongyu' },
      { name: '个人房源', slug: 'geren' },
      { name: '押一付一', slug: 'yayi' },
      { name: '临近小区', slug: 'linjin' },
    ],
    viewAll: '/real-estate?type=zufang',
  },
  {
    id: 'ershoufang',
    name: '二手房',
    icon: '🏡',
    color: 'green',
    bgColor: 'bg-green-500',
    keywords: ['出售', '售'],
    subCategories: [
      { name: '小户型', slug: 'xiaohu' },
      { name: '精装两居', slug: 'jingzhuang' },
      { name: '小三居', slug: 'xiaosan' },
      { name: '准新房', slug: 'zhunxin' },
      { name: '精装修', slug: 'jingzhuang2' },
      { name: '南北通透', slug: 'nanbei' },
    ],
    viewAll: '/real-estate?type=ershoufang',
  },
  {
    id: 'shangpu',
    name: '商铺门店',
    icon: '🏪',
    color: 'orange',
    bgColor: 'bg-orange-500',
    keywords: ['商铺', '门店'],
    subCategories: [
      { name: '商铺出租', slug: 'shop-rent' },
      { name: '商铺出售', slug: 'shop-sale' },
      { name: '生意转让', slug: 'transfer' },
      { name: '写字楼出租', slug: 'office' },
      { name: '厂房仓库', slug: 'changfang' },
    ],
    viewAll: '/real-estate?type=shangpu',
  },
  {
    id: 'tudi',
    name: '土地厂房',
    icon: '🌍',
    color: 'lime',
    bgColor: 'bg-lime-500',
    keywords: ['土地', '厂房'],
    subCategories: [
      { name: '厂房出租', slug: 'factory-rent' },
      { name: '厂房出售', slug: 'factory-sale' },
      { name: '土地出租', slug: 'land-rent' },
      { name: '土地出售', slug: 'land-sale' },
      { name: '厂房求租', slug: 'factory-wanted' },
    ],
    viewAll: '/real-estate?type=changfang',
  },
]

const SPECIAL_SERVICES = [
  {
    name: '安选验真',
    desc: '保真保看，真实在售',
    icon: '✓',
    bgColor: 'bg-green-500',
  },
  {
    name: 'VR看房',
    desc: '在线看房，身临其境',
    icon: '👓',
    bgColor: 'bg-purple-500',
  },
  {
    name: '急售房源',
    desc: '价格优惠，快速成交',
    icon: '🔥',
    bgColor: 'bg-red-500',
  },
]

export default function RealEstate() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?category=house&pageSize=30')
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) setPosts(data.data.list)
        setLoading(false)
      })
  }, [])

  const formatPrice = (price, title) => {
    if (!price || price === 0) return '面议'
    if (title?.includes('租')) {
      return `${Number(price).toLocaleString()}元/月`
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

      {/* 四大分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOUSE_CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* 分类标题 */}
            <div className={`${cat.bgColor} p-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">{cat.icon}</span>
                <Link
                  to={cat.viewAll}
                  className="font-bold text-lg hover:underline"
                >
                  {cat.name}
                </Link>
              </div>
              <Link
                to={cat.viewAll}
                className="text-white/80 text-xs hover:text-white"
              >
                查看全部 →
              </Link>
            </div>

            {/* 子分类 */}
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {cat.subCategories.map(sub => (
                  <Link
                    key={sub.slug}
                    to={`/real-estate?type=${cat.id}&sub=${sub.slug}`}
                    className="text-sm text-gray-600 hover:text-orange-500 py-1 px-2 rounded hover:bg-orange-50 transition text-center"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 特色服务 */}
      <div className="grid grid-cols-3 gap-3">
        {SPECIAL_SERVICES.map(service => (
          <div key={service.name} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className={`w-12 h-12 ${service.bgColor} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2`}>
              {service.icon}
            </div>
            <div className="font-medium text-gray-800">{service.name}</div>
            <div className="text-xs text-gray-400 mt-1">{service.desc}</div>
          </div>
        ))}
      </div>

      {/* 最新房源 */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-bold text-gray-800">最新房源</span>
              <span className="text-xs text-gray-400">({posts.length}条)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
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
          <div className="divide-y divide-gray-100">
            {posts.slice(0, 15).map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {post.house_type === '厂房' ? '🏭' : post.house_type === '住宅' ? '🏠' : '🏪'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
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
        )}
      </div>
    </div>
  )
}
