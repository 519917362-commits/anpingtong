import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

const HOUSE_CATEGORIES = {
  zufang: {
    name: '租房',
    icon: '🔑',
    bgColor: 'bg-blue-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['出租', '租'] },
      { name: '整租', slug: 'zhengzu', keywords: ['整租'] },
      { name: '合租', slug: 'hezu', keywords: ['合租'] },
      { name: '公寓', slug: 'gongyu', keywords: ['公寓'] },
      { name: '个人房源', slug: 'geren', keywords: ['个人'] },
    ],
  },
  ershoufang: {
    name: '二手房',
    icon: '🏡',
    bgColor: 'bg-green-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['出售', '售'] },
      { name: '小户型', slug: 'xiaohu', keywords: ['小户型', '小两居'] },
      { name: '精装', slug: 'jingzhuang', keywords: ['精装'] },
      { name: '南北通透', slug: 'nanbei', keywords: ['南北通透', '南北'] },
      { name: '电梯房', slug: 'dianti', keywords: ['电梯'] },
    ],
  },
  shangpu: {
    name: '商铺门店',
    icon: '🏪',
    bgColor: 'bg-orange-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['商铺', '门店'] },
      { name: '商铺出租', slug: 'shop-rent', keywords: ['商铺出租'] },
      { name: '商铺出售', slug: 'shop-sale', keywords: ['商铺出售'] },
      { name: '生意转让', slug: 'transfer', keywords: ['转让'] },
      { name: '写字楼', slug: 'office', keywords: ['写字楼'] },
    ],
  },
  changfang: {
    name: '厂房土地',
    icon: '🏭',
    bgColor: 'bg-lime-600',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['厂房', '库房'] },
      { name: '厂房出租', slug: 'factory-rent', keywords: ['厂房出租'] },
      { name: '厂房出售', slug: 'factory-sale', keywords: ['厂房出售'] },
      { name: '库房出租', slug: 'kufang', keywords: ['库房出租'] },
      { name: '厂房求租', slug: 'factory-wanted', keywords: ['求租'] },
    ],
  },
}

const HOME_CATEGORIES = [
  {
    id: 'zufang',
    name: '租房',
    icon: '🔑',
    bgColor: 'bg-blue-500',
    subCategories: [
      { name: '整租', slug: 'zhengzu' },
      { name: '合租', slug: 'hezu' },
      { name: '公寓', slug: 'gongyu' },
      { name: '个人房源', slug: 'geren' },
      { name: '押一付一', slug: 'yayi' },
      { name: '临近小区', slug: 'linjin' },
    ],
  },
  {
    id: 'ershoufang',
    name: '二手房',
    icon: '🏡',
    bgColor: 'bg-green-500',
    subCategories: [
      { name: '小户型', slug: 'xiaohu' },
      { name: '精装两居', slug: 'jingzhuang' },
      { name: '小三居', slug: 'xiaosan' },
      { name: '准新房', slug: 'zhunxin' },
      { name: '精装修', slug: 'jingzhuang2' },
      { name: '南北通透', slug: 'nanbei' },
    ],
  },
  {
    id: 'shangpu',
    name: '商铺门店',
    icon: '🏪',
    bgColor: 'bg-orange-500',
    subCategories: [
      { name: '商铺出租', slug: 'shop-rent' },
      { name: '商铺出售', slug: 'shop-sale' },
      { name: '生意转让', slug: 'transfer' },
      { name: '写字楼出租', slug: 'office' },
      { name: '厂房仓库', slug: 'changfang' },
    ],
  },
  {
    id: 'changfang',
    name: '厂房土地',
    icon: '🏭',
    bgColor: 'bg-lime-600',
    subCategories: [
      { name: '厂房出租', slug: 'factory-rent' },
      { name: '厂房出售', slug: 'factory-sale' },
      { name: '土地出租', slug: 'land-rent' },
      { name: '土地出售', slug: 'land-sale' },
      { name: '厂房求租', slug: 'factory-wanted' },
    ],
  },
]

const SPECIAL_SERVICES = [
  { name: '安选验真', desc: '保真保看，真实在售', icon: '✓', bgColor: 'bg-green-500' },
  { name: 'VR看房', desc: '在线看房，身临其境', icon: '👓', bgColor: 'bg-purple-500' },
  { name: '急售房源', desc: '价格优惠，快速成交', icon: '🔥', bgColor: 'bg-red-500' },
]

function formatPrice(price, title) {
  if (!price || price === 0) return '面议'
  if (title?.includes('租')) {
    return `${Number(price).toLocaleString()}元/月`
  }
  return `${Number(price).toLocaleString()}万`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return '今天'
  if (days < 7) return `${days}天前`
  return dateStr.slice(5, 10)
}

function RealEstateCategory({ type: urlType }) {
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const currentType = urlType || 'zufang'
  const currentSub = searchParams.get('sub') || 'all'

  const typeInfo = HOUSE_CATEGORIES[currentType] || HOUSE_CATEGORIES.zufang

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentSub])

  const fetchPosts = () => {
    setLoading(true)
    fetch('/api/posts?category=house&pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          let filtered = data.data.list

          const typeKeywords = typeInfo.subCategories[0].keywords
          filtered = filtered.filter(post => {
            const title = (post.title || '').toLowerCase()
            return typeKeywords.some(k => title.includes(k))
          })

          if (currentSub !== 'all') {
            const subInfo = typeInfo.subCategories.find(s => s.slug === currentSub)
            if (subInfo) {
              filtered = filtered.filter(post => {
                const title = (post.title || '').toLowerCase()
                return subInfo.keywords.some(k => title.includes(k))
              })
            }
          }

          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          setPosts(filtered)
        }
        setLoading(false)
      })
  }

  return (
    <div className="space-y-4">
      <div className={`${typeInfo.bgColor} rounded-2xl p-4 shadow-sm text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>{typeInfo.icon}</span> {typeInfo.name}
            </h1>
            <p className="text-sm opacity-80 mt-1">安平县{typeInfo.name}信息</p>
          </div>
          <Link
            to="/post-create"
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
          >
            免费发布
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.entries(HOUSE_CATEGORIES).map(([id, info]) => (
            <Link
              key={id}
              to={`/real-estate/${id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition text-sm ${
                currentType === id
                  ? `${info.bgColor} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {typeInfo.subCategories.map(sub => (
            <Link
              key={sub.slug}
              to={sub.slug === 'all' ? `/real-estate/${currentType}` : `/real-estate/${currentType}?sub=${sub.slug}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition text-sm ${
                currentSub === sub.slug
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 px-1">
        共 <span className="text-orange-500 font-medium">{posts.length}</span> 条{typeInfo.name}信息
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
          加载中...
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400 mb-4">暂无符合条件的房源</p>
          <Link
            to="/post-create"
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            发布房源
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="flex gap-3 p-3 hover:bg-gray-50 transition"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl shrink-0">
                {post.house_type === '厂房' ? '🏭' : post.house_type === '住宅' ? '🏠' : '🏪'}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  {post.house_area > 0 && <span>{post.house_area}㎡</span>}
                  <span>{post.location || '安平县'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">{formatPrice(post.price, post.title)}</span>
                  <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RealEstate() {
  const { type } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  if (type && HOUSE_CATEGORIES[type]) {
    return <RealEstateCategory type={type} />
  }

  useEffect(() => {
    fetch('/api/posts?category=house&pageSize=30')
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) setPosts(data.data.list)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOME_CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className={`${cat.bgColor} p-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">{cat.icon}</span>
                <Link
                  to={`/real-estate/${cat.id}`}
                  className="font-bold text-lg hover:underline"
                >
                  {cat.name}
                </Link>
              </div>
              <Link
                to={`/real-estate/${cat.id}`}
                className="text-white/80 text-xs hover:text-white"
              >
                查看全部 →
              </Link>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {cat.subCategories.map(sub => (
                  <Link
                    key={sub.slug}
                    to={`/real-estate/${cat.id}?sub=${sub.slug}`}
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
