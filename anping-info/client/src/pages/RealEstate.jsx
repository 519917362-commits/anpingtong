import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const HOUSE_CATEGORIES = {
  zufang: {
    name: '租房',
    icon: '🔑',
    color: 'from-blue-500 to-cyan-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['租'] },
      { name: '住宅出租', slug: 'house-rent', keywords: ['出租'] },
      { name: '住宅求租', slug: 'house-wanted', keywords: ['求租'] },
    ]
  },
  ershoufang: {
    name: '二手房',
    icon: '🏡',
    color: 'from-green-500 to-emerald-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['售', '出售'] },
      { name: '住宅出售', slug: 'house-sale', keywords: ['出售', '售'] },
      { name: '住宅求购', slug: 'house-wanted', keywords: ['求购', '想购'] },
    ]
  },
  shangpu: {
    name: '商铺门店',
    icon: '🏪',
    color: 'from-orange-500 to-amber-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['商铺', '门店', '生意'] },
      { name: '商铺出租', slug: 'shop-rent', keywords: ['商铺出租', '店铺出租'] },
      { name: '商铺出售', slug: 'shop-sale', keywords: ['商铺出售', '商铺出售', '门店出售'] },
      { name: '商铺求租', slug: 'shop-wanted', keywords: ['商铺求租', '求租商铺'] },
      { name: '生意转让', slug: 'shop-transfer', keywords: ['转让', '生意转让'] },
    ]
  },
  changfang: {
    name: '厂房库房',
    icon: '🏭',
    color: 'from-purple-500 to-pink-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['厂房', '车间', '库房'] },
      { name: '厂房出租', slug: 'factory-rent', keywords: ['厂房出租', '车间出租', '库房出租'] },
      { name: '厂房出售', slug: 'factory-sale', keywords: ['厂房出售', '车间出售'] },
      { name: '厂房转让', slug: 'factory-transfer', keywords: ['厂房转让', '车间转让'] },
      { name: '厂房求租', slug: 'factory-wanted', keywords: ['求租厂房', '求租车间', '求租库房'] },
    ]
  },
  tandi: {
    name: '土地',
    icon: '🌍',
    color: 'from-lime-500 to-green-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['土地', '地块'] },
      { name: '土地出租', slug: 'land-rent', keywords: ['土地出租', '地块出租'] },
      { name: '土地出售', slug: 'land-sale', keywords: ['土地出售', '地块出售', '卖地'] },
      { name: '土地转让', slug: 'land-transfer', keywords: ['土地转让', '地块转让'] },
    ]
  },
  chewei: {
    name: '车位',
    icon: '🚗',
    color: 'from-gray-500 to-slate-500',
    subCategories: [
      { name: '全部', slug: 'all', keywords: ['车位', '车库'] },
      { name: '车位出售', slug: 'parking-sale', keywords: ['车位出售', '车库出售'] },
    ]
  },
}

export default function RealEstate() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const currentType = searchParams.get('type') || 'zufang'
  const currentSub = searchParams.get('sub') || 'all'

  const typeInfo = HOUSE_CATEGORIES[currentType] || HOUSE_CATEGORIES.zufang

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentSub])

  const fetchPosts = () => {
    setLoading(true)
    fetch('/api/posts?category=house&pageSize=50')
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) {
          let filtered = data.data.list

          // 筛选类型
          filtered = filtered.filter(post => {
            const title = (post.title || '').toLowerCase()
            const houseType = (post.house_type || '').toLowerCase()
            const keywords = typeInfo.keywords
            return keywords.some(k => title.includes(k) || houseType.includes(k))
          })

          // 筛选二级分类
          if (currentSub !== 'all') {
            const subInfo = typeInfo.subCategories.find(s => s.slug === currentSub)
            if (subInfo) {
              filtered = filtered.filter(post => {
                const title = (post.title || '').toLowerCase()
                return subInfo.keywords.some(k => title.includes(k))
              })
            }
          }

          setPosts(filtered)
        }
        setLoading(false)
      })
  }

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

      {/* 一级分类切换 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.entries(HOUSE_CATEGORIES).map(([id, info]) => (
            <Link
              key={id}
              to={`/real-estate?type=${id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition text-sm ${
                currentType === id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 二级分类列表 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {typeInfo.subCategories.map(sub => (
            <Link
              key={sub.slug}
              to={sub.slug === 'all' ? `/real-estate?type=${currentType}` : `/real-estate?type=${currentType}&sub=${sub.slug}`}
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

      {/* 结果统计 */}
      <div className="text-sm text-gray-500 px-1">
        共 <span className="text-orange-500 font-medium">{posts.length}</span> 条{typeInfo.name}信息
      </div>

      {/* 房源列表 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-400">加载中...</div>
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
                  <span>{timeAgo(post.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">{formatPrice(post.price, post.title)}</span>
                  {post.source_url && (
                    <span className="text-xs text-blue-500">来源：博陵网</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
