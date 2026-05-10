import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const HOUSE_TYPES = {
  rent: { name: '租房', icon: '🔑', color: 'blue' },
  sale: { name: '二手房', icon: '🏡', color: 'green' },
  shop: { name: '商业地产', icon: '🏪', color: 'orange' },
  land: { name: '土地转让', icon: '🌍', color: 'lime' },
}

const AREAS = [
  { id: 'all', name: '全部区域' },
  { id: '县城', name: '县城' },
  { id: '工业园区', name: '工业园区' },
  { id: '经济开发区', name: '经济开发区' },
  { id: '孙遥城', name: '孙遥城' },
  { id: '马店', name: '马店' },
  { id: '南王庄', name: '南王庄' },
  { id: '东黄城', name: '东黄城' },
]

const PRICE_OPTIONS = {
  rent: [
    { id: 'all', name: '不限' },
    { id: '0-500', name: '500以下' },
    { id: '500-1000', name: '500-1000' },
    { id: '1000-2000', name: '1000-2000' },
    { id: '2000-3000', name: '2000-3000' },
    { id: '3000-5000', name: '3000-5000' },
    { id: '5000+', name: '5000以上' },
  ],
  sale: [
    { id: 'all', name: '不限' },
    { id: '0-30', name: '30万以下' },
    { id: '30-50', name: '30-50万' },
    { id: '50-80', name: '50-80万' },
    { id: '80-100', name: '80-100万' },
    { id: '100-150', name: '100-150万' },
    { id: '150+', name: '150万以上' },
  ],
  shop: [
    { id: 'all', name: '不限' },
    { id: '0-1000', name: '1000以下' },
    { id: '1000-3000', name: '1000-3000' },
    { id: '3000-5000', name: '3000-5000' },
    { id: '5000+', name: '5000以上' },
  ],
  land: [
    { id: 'all', name: '不限' },
    { id: '0-50', name: '50万以下' },
    { id: '50-100', name: '50-100万' },
    { id: '100-200', name: '100-200万' },
    { id: '200+', name: '200万以上' },
  ],
}

const LAYOUT_OPTIONS = [
  { id: 'all', name: '户型不限' },
  { id: '1室', name: '一室' },
  { id: '2室', name: '两室' },
  { id: '3室', name: '三室' },
  { id: '4室', name: '四室及以上' },
]

const AREA_OPTIONS = [
  { id: 'all', name: '面积不限' },
  { id: '0-50', name: '50㎡以下' },
  { id: '50-80', name: '50-80㎡' },
  { id: '80-120', name: '80-120㎡' },
  { id: '120-150', name: '120-150㎡' },
  { id: '150+', name: '150㎡以上' },
]

const SORT_OPTIONS = [
  { id: 'latest', name: '最新发布' },
  { id: 'price-asc', name: '价格从低到高' },
  { id: 'price-desc', name: '价格从高到低' },
  { id: 'area-desc', name: '面积从大到小' },
]

function formatPrice(price, houseType) {
  if (!price || price === 0) return '面议'
  if (houseType?.includes('租')) {
    return `${Number(price).toLocaleString()}/月`
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
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  const currentType = searchParams.get('type') || 'rent'
  const currentArea = searchParams.get('area') || 'all'
  const currentPrice = searchParams.get('price') || 'all'
  const currentLayout = searchParams.get('layout') || 'all'
  const currentHouseArea = searchParams.get('houseArea') || 'all'
  const currentSort = searchParams.get('sort') || 'latest'
  const keyword = searchParams.get('keyword') || ''

  const [searchKeyword, setSearchKeyword] = useState(keyword)

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentArea, currentPrice, currentLayout, currentHouseArea, currentSort, keyword])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('category', 'house')
      params.set('pageSize', '100')
      if (keyword) params.set('keyword', keyword)

      const res = await fetch(`/api/posts?${params.toString()}`)
      const data = await res.json()
      let allPosts = data.code === 200 ? data.data.list : []

      // 根据类型筛选
      if (currentType !== 'all') {
        allPosts = allPosts.filter(post => {
          const title = (post.title || '').toLowerCase()
          const houseType = (post.house_type || '').toLowerCase()
          switch (currentType) {
            case 'rent':
              return title.includes('出租') || title.includes('租房') || houseType.includes('租')
            case 'sale':
              return title.includes('出售') || title.includes('二手房') || title.includes('转让') || houseType.includes('售')
            case 'shop':
              return title.includes('商铺') || title.includes('店铺') || title.includes('写字楼') || title.includes('厂房') || houseType.includes('商')
            case 'land':
              return title.includes('土地') || title.includes('地块') || houseType.includes('土地')
            default:
              return true
          }
        })
      }

      // 区域筛选
      if (currentArea !== 'all') {
        allPosts = allPosts.filter(post => {
          const location = (post.location || '') + (post.title || '')
          return location.includes(currentArea)
        })
      }

      // 价格筛选
      if (currentPrice !== 'all') {
        const [min, max] = currentPrice.replace('+', '-999999').split('-').map(Number)
        allPosts = allPosts.filter(post => {
          const price = post.price || 0
          if (currentPrice.includes('+')) {
            return price >= min
          }
          return price >= min && price <= max
        })
      }

      // 户型筛选
      if (currentLayout !== 'all') {
        allPosts = allPosts.filter(post => {
          const layout = post.house_layout || post.title || ''
          return layout.includes(currentLayout)
        })
      }

      // 面积筛选
      if (currentHouseArea !== 'all') {
        const [min, max] = currentHouseArea.replace('+', '-999999').split('-').map(Number)
        allPosts = allPosts.filter(post => {
          const area = post.house_area || 0
          if (currentHouseArea.includes('+')) {
            return area >= min
          }
          return area >= min && area <= max
        })
      }

      // 排序
      switch (currentSort) {
        case 'price-asc':
          allPosts.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case 'price-desc':
          allPosts.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case 'area-desc':
          allPosts.sort((a, b) => (b.house_area || 0) - (a.house_area || 0))
          break
        default:
          allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      setPosts(allPosts)
    } catch (err) {
      console.error('获取数据失败:', err)
    }
    setLoading(false)
  }

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      if (value === 'all') {
        prev.delete(key)
      } else {
        prev.set(key, value)
      }
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

  const clearFilters = () => {
    setSearchParams({ type: currentType })
    setSearchKeyword('')
  }

  const typeInfo = HOUSE_TYPES[currentType] || HOUSE_TYPES.rent

  return (
    <div className="space-y-3">
      {/* 顶部标题 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
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
        <form onSubmit={handleSearch} className="mt-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder={`搜索${typeInfo.name}...`}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
            >
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 类型切换 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {Object.entries(HOUSE_TYPES).map(([id, info]) => (
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
        {/* 区域 */}
        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-500 text-xs shrink-0 w-12">区域:</span>
          {AREAS.map(area => (
            <button
              key={area.id}
              onClick={() => updateFilter('area', area.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentArea === area.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* 价格 */}
        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-500 text-xs shrink-0 w-12">价格:</span>
          {(PRICE_OPTIONS[currentType] || PRICE_OPTIONS.rent).map(option => (
            <button
              key={option.id}
              onClick={() => updateFilter('price', option.id)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                currentPrice === option.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        {/* 更多筛选 */}
        {showMoreFilters && (
          <>
            {/* 户型 */}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto">
              <span className="text-gray-500 text-xs shrink-0 w-12">户型:</span>
              {LAYOUT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('layout', option.id)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                    currentLayout === option.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>

            {/* 面积 */}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto">
              <span className="text-gray-500 text-xs shrink-0 w-12">面积:</span>
              {AREA_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('houseArea', option.id)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition ${
                    currentHouseArea === option.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </>
        )}

        {/* 排序和更多 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">排序:</span>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => updateFilter('sort', option.id)}
                className={`px-2 py-1 rounded text-xs transition ${
                  currentSort === option.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-xs text-orange-500"
            >
              {showMoreFilters ? '收起' : '更多筛选'}
            </button>
            {(currentArea !== 'all' || currentPrice !== 'all' || currentLayout !== 'all' || currentHouseArea !== 'all') && (
              <button onClick={clearFilters} className="text-xs text-red-500">
                清除
              </button>
            )}
          </div>
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
          <div className="text-4xl mb-4">🏠</div>
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
              <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                {post.images ? (
                  <img src={post.images.split(',')[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  '🏠'
                )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span>{post.house_layout || ''}</span>
                  {post.house_area > 0 && <span>{post.house_area}㎡</span>}
                  <span>{post.house_floor || ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">
                      {formatPrice(post.price, post.house_type)}
                    </span>
                    {post.house_nature === '个人' && (
                      <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">个人</span>
                    )}
                  </div>
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
