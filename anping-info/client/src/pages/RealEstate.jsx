import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HOUSE_CATEGORIES = [
  {
    id: 'rent',
    name: '租房',
    icon: '🔑',
    color: 'from-blue-500 to-cyan-500',
    desc: '公寓、整租、合租',
    subCategories: [
      { name: '公寓', slug: 'apartment' },
      { name: '临近地铁', slug: 'subway' },
      { name: '整租', slug: 'whole-rent' },
      { name: '合租', slug: 'share-rent' },
      { name: '个人房源', slug: 'personal' },
      { name: '押一付一', slug: 'pay1' },
    ]
  },
  {
    id: 'sale',
    name: '二手房',
    icon: '🏡',
    color: 'from-green-500 to-emerald-500',
    desc: '小户型、精装、学区房',
    subCategories: [
      { name: '小户型', slug: 'small' },
      { name: '精装两居', slug: 'jingzhuang' },
      { name: '小三居', slug: 'small3' },
      { name: '准新房', slug: 'new' },
      { name: '精装修', slug: 'decoration' },
      { name: '南北通透', slug: 'north-south' },
      { name: '低总价', slug: 'low-price' },
      { name: '带电梯', slug: 'elevator' },
    ]
  },
  {
    id: 'shop',
    name: '商业地产',
    icon: '🏪',
    color: 'from-orange-500 to-amber-500',
    desc: '商铺、写字楼、厂房',
    subCategories: [
      { name: '商铺出租', slug: 'shop-rent' },
      { name: '商铺出售', slug: 'shop-sale' },
      { name: '生意转让', slug: 'transfer' },
      { name: '写字楼出租', slug: 'office-rent' },
      { name: '厂房仓库', slug: 'factory' },
    ]
  },
  {
    id: 'land',
    name: '土地转让',
    icon: '🌍',
    color: 'from-lime-500 to-green-500',
    desc: '土地出售、厂房用地',
    subCategories: [
      { name: '土地出售', slug: 'land-sale' },
      { name: '厂房用地', slug: 'factory-land' },
    ]
  },
]

const FEATURED_TAGS = [
  { name: '安选验真', desc: '保真保看，真实在售', icon: '✓', color: 'bg-green-500' },
  { name: 'VR看房', desc: '在线看房，身临其境', icon: '👓', color: 'bg-purple-500' },
  { name: '急售房源', desc: '价格优惠，快速成交', icon: '🔥', color: 'bg-red-500' },
]

export default function RealEstate() {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?category=house&pageSize=6').then(r => r.json()),
      fetch('/api/posts?category=house&pageSize=12').then(r => r.json()),
    ]).then(([featuredData, latestData]) => {
      if (featuredData.code === 200) setFeaturedPosts(featuredData.data.list)
      if (latestData.code === 200) setLatestPosts(latestData.data.list)
      setLoading(false)
    })
  }, [])

  const formatPrice = (price, houseType) => {
    if (!price || price === 0) return '面议'
    if (houseType?.includes('租')) {
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

      {/* 分类入口 */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {HOUSE_CATEGORIES.map((cat, index) => (
          <div key={cat.id} className={`p-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shrink-0`}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Link to={`/real-estate/${cat.id}`} className="font-bold text-gray-800 hover:text-orange-500">
                    {cat.name}
                  </Link>
                  <Link to={`/real-estate/${cat.id}`} className="text-xs text-gray-400 hover:text-orange-500">
                    查看全部 →
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mb-2">{cat.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.subCategories.slice(0, 6).map(sub => (
                    <Link
                      key={sub.slug}
                      to={`/real-estate/${cat.id}?sub=${sub.slug}`}
                      className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-orange-100 hover:text-orange-600 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 特色服务 */}
      <div className="grid grid-cols-3 gap-3">
        {FEATURED_TAGS.map(tag => (
          <div key={tag.name} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className={`w-8 h-8 ${tag.color} rounded-full flex items-center justify-center text-white mx-auto mb-1`}>
              {tag.icon}
            </div>
            <div className="font-medium text-sm text-gray-800">{tag.name}</div>
            <div className="text-xs text-gray-400">{tag.desc}</div>
          </div>
        ))}
      </div>

      {/* 推荐房源 */}
      {featuredPosts.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">⭐</span>
                <span className="font-bold">推荐房源</span>
              </div>
              <Link to="/real-estate/all" className="text-white/80 text-xs hover:text-white">
                更多 →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {featuredPosts.slice(0, 6).map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex gap-3 p-3 hover:bg-gray-50 transition"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                  {post.images ? (
                    <img src={post.images.split(',')[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    '🏠'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span>{post.house_layout || post.location || '安平县'}</span>
                    {post.house_area > 0 && <span>{post.house_area}㎡</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 font-bold text-sm">
                      {formatPrice(post.price, post.house_type)}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 最新房源 */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-bold text-gray-800">最新房源</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {latestPosts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-800 line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>{post.location || '安平县'}</span>
                    {post.house_area > 0 && <span>· {post.house_area}㎡</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-red-500 font-bold text-sm">
                    {formatPrice(post.price, post.house_type)}
                  </div>
                  <div className="text-xs text-gray-400">{timeAgo(post.created_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && latestPosts.length === 0 && (
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
      )}
    </div>
  )
}
