import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const TYPE_COLORS = {
  notice:  { bg: 'bg-blue-100', text: 'text-blue-600', label: '公告' },
  event:   { bg: 'bg-purple-100', text: 'text-purple-600', label: '活动' },
  guide:   { bg: 'bg-green-100', text: 'text-green-600', label: '指南' },
  warning: { bg: 'bg-red-100', text: 'text-red-600', label: '警示' },
}

export default function NoticeDetail() {
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/notices/${id}`).then(r => r.json()).then(data => {
      if (data.code === 200) setNotice(data.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>
  if (!notice) return <div className="text-center py-20 text-gray-400">公告不存在</div>

  const style = TYPE_COLORS[notice.type] || TYPE_COLORS.notice

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 面包屑 */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span className="mx-2">/</span>
        <Link to="/notices" className="hover:text-primary">平台公告</Link>
      </div>

      {/* 公告内容 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${style.bg} ${style.text} text-xs font-bold px-3 py-1 rounded-full`}>{style.label}</span>
          <span className="text-xs text-gray-400">{notice.views}次阅读</span>
          <span className="text-xs text-gray-400">{new Date(notice.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-6">{notice.title}</h1>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed border-t pt-4">
          {notice.content}
        </div>
      </div>

      {/* 返回 */}
      <Link to="/notices" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition">
        ← 返回公告列表
      </Link>
    </div>
  )
}
