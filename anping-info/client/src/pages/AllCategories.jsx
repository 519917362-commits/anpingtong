import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 所有分类配置（14个）
const ALL_CATEGORIES = [
  { slug: 'jobs-recruit', name: '招聘求职', icon: '💼', color: 'from-orange-50 to-orange-100 border-orange-200', desc: '找工作/招人才' },
  { slug: 'house', name: '房屋租售', icon: '🏠', color: 'from-blue-50 to-blue-100 border-blue-200', desc: '租房/买房/商铺' },
  { slug: 'secondhand', name: '二手买卖', icon: '🔄', color: 'from-yellow-50 to-yellow-100 border-yellow-200', desc: '闲置物品交易' },
  { slug: 'shop-transfer', name: '旺铺转让', icon: '🏪', color: 'from-pink-50 to-pink-100 border-pink-200', desc: '店铺转让/出租' },
  { slug: 'vehicle', name: '车辆交易', icon: '🚗', color: 'from-green-50 to-green-100 border-green-200', desc: '汽车/电动车' },
  { slug: 'discounts', name: '优惠信息', icon: '🎁', color: 'from-rose-50 to-rose-100 border-rose-200', desc: '商家促销/打折' },
  { slug: 'education', name: '教育培训', icon: '📚', color: 'from-indigo-50 to-indigo-100 border-indigo-200', desc: '培训/家教/课程' },
  { slug: 'electronics', name: '家电数码', icon: '📱', color: 'from-cyan-50 to-cyan-100 border-cyan-200', desc: '手机/电脑/家电' },
  { slug: 'qa', name: '全城知道', icon: '🔮', color: 'from-violet-50 to-violet-100 border-violet-200', desc: '问答/求助/打听' },
  { slug: 'tools', name: '便民查询', icon: '🔎', color: 'from-sky-50 to-sky-100 border-sky-200', desc: '电话/快递/区号' },
  { slug: 'business', name: '商业服务', icon: '🛠️', color: 'from-purple-50 to-purple-100 border-purple-200', desc: '工商财税/广告' },
  { slug: 'life', name: '生活服务', icon: '☕', color: 'from-red-50 to-red-100 border-red-200', desc: '家政/维修/美容' },
  { slug: 'home-materials', name: '家居建材', icon: '🏗️', color: 'from-amber-50 to-amber-100 border-amber-200', desc: '建材/家具/装饰' },
  { slug: 'other', name: '其他信息', icon: '📌', color: 'from-gray-50 to-gray-100 border-gray-200', desc: '寻人/寻物/打听' },
]

export default function AllCategories() {
  const [posts, setPosts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取每个分类的最新帖子数量
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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl p-6 text-white mb-4">
        <h1 className="text-xl font-bold mb-1">📂 全部分类</h1>
        <p className="opacity-90 text-sm">浏览所有信息分类</p>
      </div>

      {/* 分类网格 */}
      <div className="grid grid-cols-3 gap-3">
        {ALL_CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className={`card-hover bg-gradient-to-br ${cat.color} border rounded-xl p-4 flex flex-col items-center gap-2 text-center`}
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

      {/* 底部导航提示 */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>没有找到想要的？试试搜索 🔍</p>
        <Link to="/search" className="text-primary hover:underline mt-1 inline-block">
          进入搜索页面 →
        </Link>
      </div>
    </div>
  )
}
