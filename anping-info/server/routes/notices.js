import { Router } from 'express'
import db from '../db/schema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// 公开接口

// 获取公告列表
router.get('/', (req, res) => {
  try {
    const { type, page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    let sql = `SELECT id, title, type, views, created_at FROM notices WHERE status = 'published'`
    const params = []

    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), Number(offset))

    const notices = db.prepare(sql).all(...params)
    res.json({ code: 200, data: { list: notices, total: total.cnt, page: Number(page), pageSize: Number(pageSize) } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取公告详情
router.get('/:id', (req, res) => {
  try {
    const notice = db.prepare(`
      SELECT * FROM notices WHERE id = ? AND status = 'published'
    `).get(req.params.id)

    if (!notice) return res.json({ code: 404, message: '公告不存在' })

    // 浏览量+1
    db.prepare('UPDATE notices SET views = views + 1 WHERE id = ?').run(req.params.id)
    notice.views += 1

    res.json({ code: 200, data: notice })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员接口（需JWT验证）
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

// 管理员：创建公告
router.post('/', adminAuth, (req, res) => {
  try {
    const { title, content, type = 'notice' } = req.body
    if (!title || !content) return res.json({ code: 400, message: '标题和内容不能为空' })
    const result = db.prepare(`
      INSERT INTO notices (title, content, type) VALUES (?, ?, ?)
    `).run(title, content, type)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '发布成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：更新公告
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { title, content, type } = req.body
    const existing = db.prepare('SELECT id FROM notices WHERE id = ?').get(req.params.id)
    if (!existing) return res.json({ code: 404, message: '公告不存在' })
    db.prepare('UPDATE notices SET title = COALESCE(?, title), content = COALESCE(?, content), type = COALESCE(?, type) WHERE id = ?')
      .run(title || null, content || null, type || null, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：删除公告
router.delete('/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
