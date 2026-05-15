import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import noticesRoutes from './routes/notices.js'
import companiesRoutes from './routes/companies.js'
import staticRoutes from './routes/static.js'
import favoritesRoutes from './routes/favorites.js'

// 初始化数据库（建表 + 默认数据）
import './db/schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/user/posts', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notices', noticesRoutes)
app.use('/api/companies', companiesRoutes)
app.use('/api/static', staticRoutes)
app.use('/api/favorites', favoritesRoutes)

// 健康检查
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// 公开获取Banner列表
app.get('/api/banners', (req, res) => {
  try {
    import('./db/schema.js').then(({ default: db }) => {
      const banners = db.prepare(`
        SELECT * FROM banners 
        WHERE status = 'active' 
          AND (start_date IS NULL OR start_date <= datetime('now'))
          AND (end_date IS NULL OR end_date >= datetime('now'))
        ORDER BY sort_order DESC, id ASC
      `).all()
      res.json({ code: 200, data: banners })
    })
  } catch {
    res.json({ code: 500 })
  }
})

// 管理后台静态文件（必须在 "前端静态文件" 之前注册，否则 /admin/* 会被前台 catch-all 截掉）
const adminDistPath = path.join(__dirname, '../admin/dist')
app.use('/admin', express.static(adminDistPath))

// 前端静态文件（生产环境）
const distPath = path.join(__dirname, '../client/dist')
app.use(express.static(distPath))

// 所有未知路由 → 前端 SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏠 安平同城网 服务端已启动`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🌐 前台: http://localhost:${PORT}`)
  console.log(`🔧 后台: http://localhost:${PORT}/admin\n`)
})
