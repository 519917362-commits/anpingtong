import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.code === 200) {
          setPost(d.data)
          const categorySlug = d.data.category_slug || 'jobs-recruit'
          Promise.all([
            fetch(`/api/posts?category=${categorySlug}&pageSize=24`).then(r => r.json()),
            fetch(`/api/posts/user/${d.data.user_id}?exclude=${d.data.id}&pageSize=10`).then(r => r.json()).catch(() => ({ code: 200, data: { list: [] } }))
          ]).then(([relatedData, userData]) => {
            if (relatedData.code === 200) {
              setRelatedPosts(relatedData.data.list.filter(p => p.id !== d.data.id).slice(0, 10))
            }
            if (userData.code === 200) {
              setUserPosts(userData.data.list)
            }
          })
        } else {
          navigate('/')
        }
        setLoading(false)
      })
      .catch(() => {
        navigate('/')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg h-96 animate-pulse" />
      </div>
    )
  }

  if (!post) return null

  const topPosts = relatedPosts.slice(0, 4)
  const bottomPosts = relatedPosts.slice(4, 10)

  const hasStructuredInfo = post.salary_min > 0 || post.salary_max > 0 || post.company_name || post.work_address || post.recruit_count || post.benefits

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 顶部置顶广告 */}
      {topPosts.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">置顶</span>
            <span className="text-gray-700 font-medium text-sm">优选推荐</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topPosts.map(p => (
              <Link
                key={p.id}
                to={`/post/${p.id}`}
                className="block bg-gradient-to-br from-orange-400 to-red-500 rounded-lg overflow-hidden hover:shadow-lg transition group"
              >
                <div className="h-16 flex items-center justify-center text-white text-2xl">
                  📢
                </div>
                <div className="bg-white p-2">
                  <h4 className="text-xs text-gray-700 line-clamp-2 group-hover:text-red-500 transition">
                    {p.title}
                  </h4>
                  {p.contact && (
                    <p className="text-xs text-red-500 mt-1">📞 {p.contact.split(',')[0]}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 面包屑导航 */}
      <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-500">
        <Link to="/" className="hover:text-red-500">首页</Link>
        <span className="mx-2">→</span>
        <Link to={`/category/${post.category_slug}`} className="hover:text-red-500">{post.category_name}</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-700 line-clamp-1">{post.title}</span>
      </div>

      {/* 主内容区 */}
      <div className="bg-white rounded-lg overflow-hidden">
        {/* 标题区域 */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>📅 {new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
            <span>👁 浏览 {post.views} 次</span>
            {post.source_url && (
              <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-red-500">
                来源:安平博陵网 ↗
              </a>
            )}
          </div>
        </div>

        {/* 招聘结构化信息卡片 */}
        {post.category_slug === 'jobs-recruit' && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>📋</span> 职位信息
              </h3>

              {/* 薪资 - 大字突出 */}
              {(post.salary_min > 0 || post.salary_max > 0) && (
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl">
                    💰
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">月薪待遇</div>
                    <div className="text-2xl font-bold text-red-500">
                      {post.salary_min > 0 && post.salary_max > 0 
                        ? `${post.salary_min}-${post.salary_max}元/月` 
                        : post.salary_min > 0 
                          ? `${post.salary_min}元/月`
                          : post.salary_max > 0 
                            ? `${post.salary_max}元/月`
                            : '面议'}
                    </div>
                  </div>
                </div>
              )}

              {/* 结构化信息网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.work_address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 shrink-0">
                      📍
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">工作地区</div>
                      <div className="text-sm font-medium text-gray-700">{post.work_address}</div>
                    </div>
                  </div>
                )}
                
                {post.company_name && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">公司名称</div>
                      <div className="text-sm font-medium text-gray-700">{post.company_name}</div>
                    </div>
                  </div>
                )}
                
                {post.recruit_count && post.recruit_count > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                      👥
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">招聘人数</div>
                      <div className="text-sm font-medium text-gray-700">{post.recruit_count}人</div>
                    </div>
                  </div>
                )}
                
                {post.job_nature && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-500 shrink-0">
                      💼
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">工作性质</div>
                      <div className="text-sm font-medium text-gray-700">{post.job_nature}</div>
                    </div>
                  </div>
                )}

                {post.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                      🗺
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">所属区域</div>
                      <div className="text-sm font-medium text-gray-700">{post.location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 公司福利标签 */}
              {post.benefits && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-2">公司福利</div>
                  <div className="flex flex-wrap gap-2">
                    {post.benefits.split(/[,，、]/).filter(b => b.trim()).map((benefit, i) => (
                      <span key={i} className="bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full text-sm">
                        ✓ {benefit.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 房产结构化信息卡片 */}
        {post.category_slug === 'house' && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>🏠</span> 房源信息
              </h3>

              {/* 价格 - 大字突出 */}
              {post.price > 0 && (
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl">
                    💰
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">
                      {post.title?.includes('租') ? '月租金' : '售价'}
                    </div>
                    <div className="text-2xl font-bold text-red-500">
                      {post.title?.includes('租') 
                        ? `${Number(post.price).toLocaleString()}元/月`
                        : `${Number(post.price).toLocaleString()}万元`}
                    </div>
                    {post.house_area > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        约 {Math.round(post.price * 10000 / post.house_area)}元/㎡
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 结构化信息网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.house_area > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                      📐
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">建筑面积</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_area}㎡</div>
                    </div>
                  </div>
                )}

                {post.house_layout && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 shrink-0">
                      🏠
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">户型结构</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_layout}</div>
                    </div>
                  </div>
                )}

                {post.house_floor && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">所在楼层</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_floor}</div>
                    </div>
                  </div>
                )}

                {post.house_direction && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                      🧭
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">房屋朝向</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_direction}</div>
                    </div>
                  </div>
                )}

                {post.house_decoration && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                      ✨
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">装修情况</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_decoration}</div>
                    </div>
                  </div>
                )}

                {post.house_age && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-500 shrink-0">
                      📅
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">建造年份</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_age}年</div>
                    </div>
                  </div>
                )}

                {post.house_nature && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                      🏷️
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">房屋性质</div>
                      <div className="text-sm font-medium text-gray-700">{post.house_nature}</div>
                    </div>
                  </div>
                )}

                {post.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                      📍
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">所在区域</div>
                      <div className="text-sm font-medium text-gray-700">{post.location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 配套设施标签 */}
              {post.house_support && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-2">配套设施</div>
                  <div className="flex flex-wrap gap-2">
                    {post.house_support.split(/[,，、]/).filter(s => s.trim()).map((support, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-sm">
                        ✓ {support.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 联系信息 */}
        {post.contact && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>📞</span> 联系方式
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-400">联系电话</div>
                  <div className="text-xl font-bold text-gray-900">{post.contact.split(',')[0].trim()}</div>
                </div>
                <a 
                  href={`tel:${post.contact.split(',')[0].trim()}`}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
                >
                  📞 立即拨打
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 发布人信息 */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>👤</span> 发布人信息
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl overflow-hidden">
                {post.user_avatar ? (
                  <img src={post.user_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{post.username || '平台用户'}</div>
                <div className="text-sm text-gray-500 mt-1">
                  发布于 {new Date(post.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
              {userPosts.length > 0 && (
                <div className="text-sm text-blue-500">
                  共发布 {userPosts.length} 条信息
                </div>
              )}
            </div>

            {/* 发布人的其他帖子 */}
            {userPosts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">该发布人其他信息：</div>
                <div className="space-y-2">
                  {userPosts.slice(0, 5).map(p => (
                    <Link
                      key={p.id}
                      to={`/post/${p.id}`}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                        📋
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 line-clamp-1">{p.title}</div>
                        <div className="text-xs text-gray-400">{p.category_name} · {new Date(p.created_at).toLocaleDateString('zh-CN')}</div>
                      </div>
                      {(p.salary_min > 0 || p.salary_max > 0) && (
                        <div className="text-red-500 text-sm font-bold shrink-0">
                          {p.salary_min > 0 ? `${p.salary_min}元/月` : ''}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 正文内容 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>📝</span> 信息内容
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content || '暂无详细信息'}
          </div>
        </div>

        {/* 安全提示 */}
        <div className="mx-6 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <span className="font-bold">⚠️ 安全提示：</span>
            请当面验证信息真实性，谨慎汇款。平台仅提供信息展示，不对交易安全负责。
          </p>
        </div>
      </div>

      {/* 底部最新信息 */}
      {bottomPosts.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">最新</span>
            <span className="text-gray-700 font-medium text-sm">同板块最新信息</span>
          </div>
          <div className="space-y-2">
            {bottomPosts.map(p => (
              <Link
                key={p.id}
                to={`/post/${p.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-700 line-clamp-1 group-hover:text-red-500 transition">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>{p.location || '安平县'}</span>
                    {p.contact && <span>📞 {p.contact.split(',')[0]}</span>}
                  </div>
                </div>
                {(p.salary_min > 0 || p.salary_max > 0) && (
                  <div className="text-red-500 font-bold text-sm shrink-0">
                    {p.salary_min > 0 && p.salary_max > 0 
                      ? `${p.salary_min}-${p.salary_max}` 
                      : p.salary_min > 0 ? `${p.salary_min}` : `${p.salary_max}`}元
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to={`/category/${post.category_slug}`}
              className="inline-block text-sm text-blue-500 hover:text-red-500 transition"
            >
              查看更多 {post.category_name} →
            </Link>
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <div className="text-center py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-red-500 text-sm transition"
        >
          ← 返回上一页
        </button>
      </div>
    </div>
  )
}
