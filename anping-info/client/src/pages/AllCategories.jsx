import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ALL_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', color: 'from-red-50 to-red-100 border-red-200', desc: '企业招人·个人求职' },
  { slug: 'house', name: '房屋租售', icon: '🏠', color: 'from-orange-50 to-orange-100 border-orange-200', desc: '租房·买房·商铺' },
  { slug: 'life', name: '家政保洁', icon: '🧹', color: 'from-amber-50 to-amber-100 border-amber-200', desc: '保洁·搬家·维修' },
  { slug: 'shop-transfer', name: '招商转让', icon: '🏪', color: 'from-lime-50 to-lime-100 border-lime-200', desc: '旺铺转让·合伙创业' },
  { slug: 'secondhand', name: '闲置物品', icon: '🔄', color: 'from-green-50 to-green-100 border-green-200', desc: '二手买卖·以物换物' },
  { slug: 'education', name: '教育培训', icon: '📚', color: 'from-emerald-50 to-emerald-100 border-emerald-200', desc: '培训·家教·课程' },
  { slug: 'wechat-group', name: '本地微信群', icon: '💬', color: 'from-teal-50 to-teal-100 border-teal-200', desc: '微信群·社区交流' },
  { slug: 'companies', name: '同城商家', icon: '🏢', color: 'from-cyan-50 to-cyan-100 border-cyan-200', desc: '本地商家·企业黄页' },
  { slug: 'wiremesh-machine', name: '丝网机械', icon: '⚙️', color: 'from-slate-100 to-slate-200 border-slate-300', desc: '机械设备供应' },
  { slug: 'wiremesh-material', name: '原材料供应', icon: '🔩', color: 'from-zinc-100 to-zinc-200 border-zinc-300', desc: '钢丝·钢材·原材料' },
  { slug: 'wiremesh-product', name: '丝网制品', icon: '🕸️', color: 'from-gray-100 to-gray-200 border-gray-300', desc: '勾花网·电焊网·冲孔网' },
  { slug: 'wiremesh-price', name: '丝网报价', icon: '📊', color: 'from-stone-100 to-stone-200 border-stone-300', desc: '每日行情报价' },
  { slug: 'vehicle', name: '车辆服务', icon: '🚗', color: 'from-yellow-50 to-yellow-100 border-yellow-200', desc: '汽车·电动车' },
  { slug: 'discounts', name: '优惠促销', icon: '🎁', color: 'from-pink-50 to-pink-100 border-pink-200', desc: '商家促销·打折' },
]

export default function AllCategories() {
  const [posts, setPosts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {}
      await Promise.all(
        ALL_CATEGORIES.map(async (cat) => {
          try {
            const res = await fetch(`/api/posts?category=${cat.slug}&status=approved&pageSize=1`)
            const data = await res.json()
            if (data.code === 200) {
              counts[cat.slug] = data.data.total || 0
            }
          } catch (e) {
            counts[cat.slug] = 0
          }
        })
      )
      setPosts(counts)
      setLoading(false)
    }
    fetchCounts()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white mb-4">
        <h1 className="text-xl font-bold mb-1">📂 全部分类</h1>
        <p className="opacity-90 text-sm">浏览所有信息分类</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ALL_CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className={`bg-gradient-to-br ${cat.color} border rounded-xl p-4 flex flex-col items-center gap-2 text-center`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-sm font-medium text-gray-800">{cat.name}</span>
            <span className="text-xs text-gray-500">{cat.desc}</span>
            {!loading && posts[cat.slug] > 0 && (
              <span className="text-xs bg-white/70 px-2 py-0.5 rounded-full text-gray-600">
                {posts[cat.slug]}条
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>没有找到想要的？试试搜索 🔍</p>
        <Link to="/search" className="text-blue-500 hover:underline mt-1 inline-block">
          进入搜索页面 →
        </Link>
      </div>
    </div>
  )
}
