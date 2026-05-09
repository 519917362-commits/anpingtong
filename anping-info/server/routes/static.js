import { Router } from 'express'
import db from '../db/schema.js'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// 公开接口

// 获取单个静态页面
router.get('/:slug', (req, res) => {
  try {
    const page = db.prepare('SELECT * FROM static_pages WHERE slug = ?').get(req.params.slug)
    if (!page) return res.json({ code: 404, message: '页面不存在' })
    res.json({ code: 200, data: page })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员鉴权
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.json({ code: 401, message: '未登录' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') return res.json({ code: 403, message: '权限不足' })
    req.adminId = payload.id
    next()
  } catch {
    res.json({ code: 401, message: 'token无效' })
  }
}

// 管理员：更新静态页面
router.put('/:slug', adminAuth, (req, res) => {
  try {
    const { title, content } = req.body
    const existing = db.prepare('SELECT id FROM static_pages WHERE slug = ?').get(req.params.slug)
    if (!existing) {
      db.prepare('INSERT INTO static_pages (slug, title, content) VALUES (?, ?, ?)')
        .run(req.params.slug, title || '', content || '')
    } else {
      db.prepare('UPDATE static_pages SET title = COALESCE(?, title), content = COALESCE(?, content), updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
        .run(title || null, content || null, req.params.slug)
    }
    res.json({ code: 200, message: '保存成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
