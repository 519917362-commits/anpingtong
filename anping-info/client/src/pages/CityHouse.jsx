import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const PROPERTY_TYPES = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'rent', name: '租房', icon: '🔑' },
  { id: 'sale', name: '二手房', icon: '🏡' },
  { id: 'new', name: '新房', icon: '🌟' },
  { id: 'shop', name: '商铺', icon: '🏪' },
  { id: 'business', name: '生意转让', icon: '💼' },
  { id: 'office', name: '写字楼', icon: '🏢' },
  { id: 'factory', name: '厂房', icon: '🏭' },
  { id: 'warehouse', name: '仓库', icon: '📦' },
  { id: 'land', name: '土地', icon: '🌍' },
  { id: 'parking', name: '车位', icon: '🅿️' },
]

const AREAS = [
  { id: 'all', name: '全部区域' },
  { id: 'chengguan', name: '县城' },
  { id: 'gyyq', name: '工业园区' },
  { id: 'jjkfq', name: '经济开发区' },
  { id: 'sjs', name: '孙遥城' },
  { id: 'wx', name: '王胡林' },
  { id: 'dq', name: '东黄城' },
  { id: 'md', name: '马店' },
  { id: 'nw', name: '南王庄' },
]

const PRICE_RANGES = [
  { id: 'all', name: '不限' },
  { id: '0-1000', name: '1000元以下' },
  { id: '1000-2000', name: '1000-2000' },
  { id: '2000-3000', name: '2000-3000' },
  { id: '3000-5000', name: '3000-5000' },
  { id: '5000-10000', name: '5000-10000' },
  { id: '10000+', name: '10000以上' },
]

const SORT_OPTIONS = [
  { id: 'default', name: '默认排序' },
  { id: 'price-asc', name: '价格从低到高' },
  { id: 'price-desc', name: '价格从高到低' },
  { id: 'time', name: '最新发布' },
]

function formatPrice(price, type = 'rent') {
  if (!price || price === 0) return '面议'
  if (type === 'rent' || type === 'shop-rent' || type === 'factory-rent') {
    return `${Number(price).toLocaleString()}/月`
  }
  return `¥${Number(price).toLocaleString()}`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return dateStr.slice(0, 10)
}

export default function CityHouse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const currentType = searchParams.get('type') || 'all'
  const currentArea = searchParams.get('area') || 'all'
  const currentPrice = searchParams.get('price') || 'all'
  const currentSort = searchParams.get('sort') || 'default'
  const keyword = searchParams.get('keyword') || ''

  const [searchKeyword, setSearchKeyword] = useState(keyword)

  useEffect(() => {
    fetchPosts()
  }, [currentType, currentArea, currentPrice, currentSort, keyword])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('pageSize', '50')
      
      if (keyword) {
        params.set('keyword', keyword)
      }
      
      const categories = ['house', 'shop-transfer']
      const promises = categories.map(cat => 
        fetch(`/api/posts?category=${cat}&${params.toString()}`).then(r => r.json())
      )
      
      const results = await Promise.all(promises)
      let allPosts = results.flatMap(r => r.code === 200 ? r.data.list : [])
      
      if (currentType !== 'all') {
        allPosts = allPosts.filter(post => {
          const title = (post.title || '').toLowerCase()
          switch(currentType) {
            case 'rent': return title.includes('租') || title.includes('出租')
            case 'sale': return title.includes('售') || title.includes('出售') || title.includes('二手房')
            case 'new': return title.includes('新房') || title.includes('开盘')
            case 'shop': return title.includes('商铺') || title.includes('门店')
            case 'business': return title.includes('转让') || title.includes('生意')
            case 'office': return title.includes('写字楼') || title.includes('办公')
            case 'factory': return title.includes('厂房')
            case 'warehouse': return title.includes('仓库')
            case 'land': return title.includes('土地')
            case 'parking': return title.includes('车位') || title.includes('停车')
            default: return true
          }
        })
      }
      
      if (currentArea !== 'all') {
        const areaNames = {
          'chengguan': ['县城', '中心', '城里'],
          'gyyq': ['园区', '工业园'],
          'jjkfq': ['开发区', '经济'],
          'sjs': ['孙遥', '孙姚'],
          'wx': ['王胡', '王护'],
          'dq': ['东黄'],
          'md': ['马店'],
          'nw': ['南王'],
        }
        const searchTerms = areaNames[currentArea] || []
        if (searchTerms.length > 0) {
          allPosts = allPosts.filter(post => {
            const location = ((post.location || '') + (post.title || '')).toLowerCase()
            return searchTerms.some(term => location.includes(term.toLowerCase()))
          })
        }
      }
      
      if (currentPrice !== 'all') {
        const [min, max] = currentPrice.split('-').map(v => v === '+' ? Infinity : Number(v))
        if (currentPrice === '10000+') {
          allPosts = allPosts.filter(p => p.price >= 10000)
        } else {
          allPosts = allPosts.filter(p => p.price >= min && p.price <= max)
        }
      }
      
      switch(currentSort) {
        case 'price-asc': allPosts.sort((a, b) => (a.price || 0) - (b.price || 0)); break
        case 'price-desc': allPosts.sort((a, b) => (b.price || 0) - (a.price || 0)); break
        case 'time': allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break
        default: allPosts.sort((a, b) => b.id - a.id)
      }
      
      setPosts(allPosts)
    } catch (err) {
      console.error('获取数据失败:', err)
    }
    setLoading(false)
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

  const clearFilters = () => {
    setSearchParams({})
    setSearchKeyword('')
  }

  const getPropertyType = (title) => {
    const t = title.toLowerCase()
    if (t.includes('租') || t.includes('出租')) return '租房'
    if (t.includes('商铺') || t.includes('门店')) return '商铺'
    if (t.includes('转让') || t.includes('生意')) return '生意转让'
    if (t.includes('写字楼') || t.includes('办公')) return '写字楼'
    if (t.includes('厂房')) return '厂房'
    if (t.includes('仓库')) return '仓库'
    if (t.includes('土地')) return '土地'
    if (t.includes('车位') || t.includes('停车')) return '车位'
    if (t.includes('售') || t.includes('二手房')) return '二手房'
    return '房屋'
  }

  const getPropertyTypeColor = (type) => {
    const colors = {
      '租房': 'bg-blue-100 text-blue-600',
      '二手房': 'bg-green-100 text-green-600',
      '商铺': 'bg-orange-100 text-orange-600',
      '生意转让': 'bg-purple-100 text-purple-600',
      '写字楼': 'bg-indigo-100 text-indigo-600',
      '厂房': 'bg-gray-100 text-gray-600',
      '仓库': 'bg-amber-100 text-amber-600',
      '土地': 'bg-lime-100 text-lime-600',
      '车位': 'bg-cyan-100 text-cyan-600',
      '房屋': 'bg-pink-100 text-pink-600',
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-4">
      {/* 顶部搜索 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-sm text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="text-xl font-bold">同城房产</h1>
            <p className="text-xs opacity-80">安平县房产信息平台</p>
          </div>
        </div>
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="搜索房产信息..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-orange-500 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition text-sm"
            >
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 分类导航 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => updateFilter('type', type.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition text-sm ${
                currentType === type.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              <span className="font-medium">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">筛选:</span>
            {(currentPrice !== 'all' || currentArea !== 'all' || currentSort !== 'default' || currentType !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:underline"
              >
                清除
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-orange-500 flex items-center gap-1"
          >
            <span>{showFilters ? '收起' : '更多'}</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          <span className="text-gray-400 text-xs shrink-0">区域:</span>
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

        {showFilters && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs w-8 shrink-0">价格:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => updateFilter('price', range.id)}
                    className={`px-2 py-1 rounded text-xs transition ${
                      currentPrice === range.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs w-8 shrink-0">排序:</span>
              <div className="flex gap-1.5">
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
            </div>
          </>
        )}
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 <span className="text-orange-500 font-medium">{posts.length}</span> 条
        </div>
        <Link
          to="/post-create"
          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          发布信息
        </Link>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-gray-400 mb-4">暂无符合条件的房产信息</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl shrink-0">
                🏠
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getPropertyTypeColor(getPropertyType(post.title))}`}>
                    {getPropertyType(post.title)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{post.location || '安平县'}</p>
                <div className="flex items-center justify-between">
                  <div className="text-red-500 font-bold text-sm">
                    {formatPrice(post.price, getPropertyType(post.title).includes('租') ? 'rent' : 'sale')}
                  </div>
                  <div className="text-xs text-gray-400">{timeAgo(post.created_at)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}