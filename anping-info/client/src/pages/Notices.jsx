import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TYPE_COLORS = {
  notice:  { bg: 'bg-blue-100', text: 'text-blue-600', label: '公告' },
  event:   { bg: 'bg-purple-100', text: 'text-purple-600', label: '活动' },
  guide:   { bg: 'bg-green-100', text: 'text-green-600', label: '指南' },
  warning: { bg: 'bg-red-100', text: 'text-red-600', label: '警示' },
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

export default function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams({ pageSize: 20 })
    if (type !== 'all') params.set('type', type)
    fetch(`/api/notices?${params}`).then(r => r.json()).then(data => {
      if (data.code === 200) setNotices(data.data.list)
    }).finally(() => setLoading(false))
  }, [type])

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">📢 平台公告</h1>
        <p className="opacity-80 text-sm">了解安平同城网最新动态、求职指南和防骗提示</p>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: '全部', value: 'all' },
          { label: '公告', value: 'notice' },
          { label: '活动', value: 'event' },
          { label: '指南', value: 'guide' },
          { label: '警示', value: 'warning' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              type === t.value
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 公告列表 */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">加载中...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl">
          <div className="text-5xl mb-3">📭</div>
          <p>暂无公告</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {notices.map(notice => {
            const style = TYPE_COLORS[notice.type] || TYPE_COLORS.notice
            return (
              <Link
                key={notice.id}
                to={`/notice/${notice.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <span className={`${style.bg} ${style.text} text-xs font-bold px-2 py-1 rounded shrink-0`}>
                  {style.label}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 hover:text-primary transition truncate">{notice.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{timeAgo(notice.created_at)}</span>
                  <span className="text-xs text-gray-300">{notice.views}阅</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
