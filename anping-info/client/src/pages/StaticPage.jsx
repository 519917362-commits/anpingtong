import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function StaticPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/static/${slug}`).then(r => r.json()).then(data => {
      if (data.code === 200) setPage(data.data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>
  if (!page) return <div className="text-center py-20 text-gray-400">页面不存在</div>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 面包屑 */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{page.title}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">{page.title}</h1>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {page.content}
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
