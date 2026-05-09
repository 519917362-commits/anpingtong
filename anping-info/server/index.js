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

// 健康检查
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// 前端静态文件（生产环境）
const distPath = path.join(__dirname, '../client/dist')
app.use(express.static(distPath))

// 管理后台静态文件
const adminDistPath = path.join(__dirname, '../admin/dist')
app.use('/admin', express.static(adminDistPath))

// 所有未知路由 → 前端 SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n🏠 安平同城网 服务端已启动`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🌐 前台: http://localhost:${PORT}`)
  console.log(`🔧 后台: http://localhost:${PORT}/admin\n`)
})
