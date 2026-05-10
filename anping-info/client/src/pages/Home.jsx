import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { name: '招工招聘', icon: '1', color: 'bg-blue-500', link: '/jobs' },
  { name: '房产租售', icon: '2', color: 'bg-orange-500', link: '/real-estate' },
  { name: '丝网产业', icon: '3', color: 'bg-green-500', link: '/tools/wiremesh' },
  { name: '物流运输', icon: '4', color: 'bg-purple-500', link: '/tools/logistics' },
  { name: '安平黄页', icon: '5', color: 'bg-amber-500', link: '/yellow-pages' },
  { name: '二手车', icon: '6', color: 'bg-red-500', link: '/category/vehicle' },
  { name: '二手闲置', icon: '7', color: 'bg-pink-500', link: '/category/secondhand' },
  { name: '求职应聘', icon: '8', color: 'bg-cyan-500', link: '/jobs' },
  { name: '商务服务', icon: '9', color: 'bg-teal-500', link: '/category/companies' },
  { name: '生活服务', icon: '10', color: 'bg-indigo-500', link: '/category/door-service' },
]

const SLIDES = [
  {
    title: '安平丝网招聘专场',
    desc: '本地100+企业正在招聘，月薪最高8000元',
    button: '查看详情 →',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20skyline%20modern%20buildings%20business%20district%20professional%20photography&image_size=landscape_16_9'
  },
  {
    title: '丝网原材料采购节',
    desc: '厂家直供，质优价廉，采购享优惠',
    button: '立即采购 →',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wire%20mesh%20factory%20industrial%20manufacturing%20materials&image_size=landscape_16_9'
  },
  {
    title: '商铺旺铺招租',
    desc: '黄金地段，人流量大，商机无限',
    button: '了解更多 →',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=commercial%20street%20shops%20business%20district%20city&image_size=landscape_16_9'
  },
]

const NEWS_LIST = [
  '安平丝网博览会5月15日盛大开幕',
  '安平县新增公交线路3条，覆盖工业园区',
  '丝网产业园区招聘会本周六举行',
  '安平镇中心街改造工程即将完工',
  '县医院推出便民服务新举措',
  '本地企业春季招聘火热进行中',
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newsScroll, setNewsScroll] = useState(0)
  const [topPosts, setTopPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const newsTimer = setInterval(() => {
      setNewsScroll(prev => (prev + 1) % NEWS_LIST.length)
    }, 3000)
    return () => clearInterval(newsTimer)
  }, [])

  useEffect(() => {
    fetch('/api/posts?type=top&pageSize=5').then(r => r.json()).then(data => {
      if (data.code === 200) {
        setTopPosts(data.data.list.slice(0, 5))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-0">
      {/* 轮播横幅 */}
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <div className="relative h-48 md:h-64">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                <div className="px-6 md:px-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{slide.title}</h2>
                  <p className="text-white/80 text-sm md:text-base mb-4">{slide.desc}</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                    {slide.button}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 轮播指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 分类导航 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={cat.link}
              className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-xl transition"
            >
              <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                {cat.icon}
              </div>
              <span className="text-xs text-gray-700 font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新资讯滚动 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shrink-0">
            最新资讯
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-scroll">
              {[...NEWS_LIST, ...NEWS_LIST].map((news, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap px-2 text-sm text-gray-700"
                >
                  {news}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 置顶信息 */}
      {!loading && topPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-gray-800">热门信息</span>
            </div>
            <Link to="/category/top" className="text-blue-600 text-xs">更多 →</Link>
          </div>
          <div className="space-y-2">
            {topPosts.map(post => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                  📌
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-gray-400">{post.category_name} | {post.created_at?.slice(0, 10)}</p>
                </div>
                {post.price > 0 && (
                  <span className="text-xs text-red-500 font-bold shrink-0">¥{Number(post.price).toLocaleString()}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 底部广告横幅 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 rounded-2xl p-4 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-bold">广告</span>
          <span className="text-white text-sm font-medium">安平丝网博览会5月15日盛大开幕，点击了解详情 →</span>
        </div>
        <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
          立即查看
        </button>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}