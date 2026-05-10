import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const HOUSE_TYPE_MAP = {
  zufang: { name: '租房', icon: '🔑', color: 'blue', keywords: ['出租', '租'] },
  ershoufang: { name: '二手房', icon: '🏡', color: 'green', keywords: ['出售', '售'] },
  shangpu: { name: '商铺门店', icon: '🏪', color: 'orange', keywords: ['商铺', '门店'] },
  changfang: { name: '厂房', icon: '🏭', color: 'purple', keywords: ['厂房', '车间', '库房'] },
  tandi: { name: '土地', icon: '🌍', color: 'lime', keywords: ['土地', '地块'] },
  chewei: { name: '车位', icon: '🚗', color: 'gray', keywords: ['车位', '车库'] },
}

const AREAS = [
  { id: 'all', name: '全部区域' },
  { id: '城东', name: '城东' },
  { id: '城西', name: '城西' },
  { id: '县城', name: '县城' },
  { id: '工业园', name: '工业园区' },
  { id: '凯旋城', name: '凯旋城' },
  { id: '五洲国际', name: '五洲国际' },
]

const RENT_PRICE_OPTIONS = [
  { id: 'all', name: '价格不限' },
  { id: '0-500', name: '500元以下' },
  { id: '500-1000', name: '500-1000元' },
  { id: '1000-2000', name: '1000-2000元' },
  { id: '2000-3000', name: '2000-3000元' },
  { id: '3000-5000', name: '3000-5000元' },
  { id: '5000+', name: '5000元以上' },
]

const SALE_PRICE_OPTIONS = [
  { id: 'all', name: '价格不限' },
  { id: '0-30', name: '30万以下' },
  { id: '30-50', name: '30-50万' },
  { id: '50-80', name: '50-80万' },
  { id: '80-100', name: '80-100万' },
  { id: '100-150', name: '100-150万' },
  { id: '150+', name: '150万以上' },
]

const AREA_OPTIONS = [
  { id: 'all', name: '面积不限' },
  { id: '0-50', name: '50㎡以下' },
  { id: '50-100', name: '50-100㎡' },
  { id: '100-200', name: '100-200㎡' },
  { id: '200-500', name: '200-500㎡' },
  { id: '500+', name: '500㎡以上' },
]

const SORT_OPTIONS = [
  { id: 'latest', name: '最新' },
  { id: 'price-asc', name: '价格从低到高' },
  { id: 'price-desc', name: '价格从高到低' },
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
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return dateStr.slice(0, 10)
}

export default function RealEstateList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const currentType = searchParams.get('type') || 'zufang'
  const currentArea = searchParams.get('area') || 'all'
  const currentPrice = searchParams.get('price') || 'all'
  const currentSize = searchParams.get('size') || 'all'
  const currentSort = searchParams.get('sort') || 'latest'
  const keyword = searchParams.get('keyword') || ''

  const [searchKeyword, setSearchKeyword] = useState(keyword)

  const typeInfo = HOUSE_TYPE_MAP[currentType] || HOUSE_TYPE_MAP.zufang
  const priceOptions = currentType === 'zufang' ? RENT_PRICE_OPTIONS : SALE_PRICE_OPTIONS

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentArea, currentPrice, currentSize, currentSort, keyword])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('category', 'house')
      params.set('pageSize', '50')
      if (keyword) params.set('keyword', keyword)

      const res = await fetch(`/api/posts?${params.toString()}`)
      const data = await res.json()
      let allPosts = data.code === 200 ? data.data.list : []

      // 根据类型筛选
      const kw = typeInfo.keywords
      allPosts = allPosts.filter(post => {
        const title = (post.title || '').toLowerCase()
        const houseType = (post.house_type || '').toLowerCase()
        return kw.some(k => title.includes(k) || houseType.includes(k))
      })

      // 区域筛选
      if (currentArea !== 'all') {
        allPosts = allPosts.filter(post => {
          const text = (post.title || '') + (post.location || '')
          return text.includes(currentArea)
        })
      }

      // 价格筛选
      if (currentPrice !== 'all') {
        const [min, max] = currentPrice.replace('+', '-999999999').split('-').map(Number)
        allPosts = allPosts.filter(post => {
          const price = post.price || 0
          if (currentPrice.includes('+')) return price >= min
          return price >= min && price <= max
        })
      }

      // 面积筛选
      if (currentSize !== 'all') {
        const [min, max] = currentSize.replace('+', '-999999999').split('-').map(Number)
        allPosts = allPosts.filter(post => {
          const area = post.house_area || 0
          if (currentSize.includes('+')) return area >= min
          return area >= min && area <= max
        })
      }

      // 排序
      switch (currentSort) {
        case 'price-asc': allPosts.sort((a, b) => (a.price || 0) - (b.price || 0)); break
        case 'price-desc': allPosts.sort((a, b) => (b.price || 0) - (a.price || 0)); break
        default: allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      setPosts(allPosts)
    } catch (err) {
      console.error('获取数据失败:', err)
    }
    setLoading(false)
  }

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      if (value === 'all') prev.delete(key)
      else prev.set(key, value)
      return prev
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      setSearchParams(prev => {
        prev.set('keyword', searchKeyword.trim())
        return prev
      })
    }
  }

  return (
    <div className="space-y-3">
      {/* 顶部标题 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeInfo.icon}</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{typeInfo.name}</h1>
              <p className="text-xs text-gray-400">安平县{typeInfo.name}信息</p>
            </div>
          </div>
          <Link
            to="/post-create"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            免费发布
          </Link>
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder={`搜索${typeInfo.name}...`}
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 类型切换 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.entries(HOUSE_TYPE_MAP).map(([id, info]) => (
            <button
              key={id}
              onClick={() => updateFilter('type', id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition text-sm ${
                currentType === id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-500 text-xs shrink-0">区域:</span>
          {AREAS.map(area => (
            <button
              key={area.id}
              onClick={() => updateFilter('area', area.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentArea === area.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-500 text-xs shrink-0">价格:</span>
          {priceOptions.map(option => (
            <button
              key={option.id}
              onClick={() => updateFilter('price', option.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentPrice === option.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-500 text-xs shrink-0">面积:</span>
          {AREA_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => updateFilter('size', option.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentSize === option.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">排序:</span>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => updateFilter('sort', option.id)}
                className={`px-2 py-1 rounded text-xs transition ${
                  currentSort === option.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          {(currentArea !== 'all' || currentPrice !== 'all' || currentSize !== 'all') && (
            <button
              onClick={() => setSearchParams({ type: currentType })}
              className="text-xs text-red-500"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* 结果统计 */}
      <div className="text-sm text-gray-500 px-1">
        共 <span className="text-orange-500 font-medium">{posts.length}</span> 条结果
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400 mb-4">暂无符合条件的房源</p>
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
                  <span>{post.house_type || '房产'}</span>
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
