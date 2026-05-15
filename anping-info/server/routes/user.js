import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/schema.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// JWT 验证中间件（用户端）
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.json({ code: 401, message: '请先登录' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.id
    req.userRole = payload.role
    next()
  } catch {
    res.json({ code: 401, message: '登录已过期' })
  }
}

// 发布帖子（需登录）
router.post('/', authMiddleware, (req, res) => {
  const { category_id, title, content, price, contact, location, salary_min, salary_max, salary_type, job_type } = req.body
  if (!category_id || !title || !content || !contact) {
    return res.json({ code: 400, message: '请填写所有必填字段' })
  }

  try {
    const result = db.prepare(`
      INSERT INTO posts (user_id, category_id, title, content, price, contact, location, salary_min, salary_max, salary_type, job_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(req.userId, category_id, title, content, Number(price) || 0, contact, location || '', Number(salary_min) || 0, Number(salary_max) || 0, salary_type || 'month', job_type || '')

    res.json({ code: 200, message: '发布成功，等待审核', data: { id: result.lastInsertRowid } })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取我的帖子
router.get('/my', authMiddleware, (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, c.name as category_name, c.icon as category_icon
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.userId)
    res.json({ code: 200, data: posts })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 编辑我的帖子
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
    if (!post) return res.json({ code: 404, message: '帖子不存在或无权编辑' })

    const { category_id, title, content, price, contact, location, salary_min, salary_max, salary_type, job_type } = req.body
    if (!category_id || !title || !content || !contact) {
      return res.json({ code: 400, message: '请填写所有必填字段' })
    }

    db.prepare(`
      UPDATE posts 
      SET category_id = ?, title = ?, content = ?, price = ?, contact = ?, location = ?, salary_min = ?, salary_max = ?, salary_type = ?, job_type = ?, status = 'pending', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(category_id, title, content, Number(price) || 0, contact, location || '', Number(salary_min) || 0, Number(salary_max) || 0, salary_type || 'month', job_type || '', req.params.id)

    res.json({ code: 200, message: '修改成功，等待重新审核' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 删除我的帖子
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
    if (!post) return res.json({ code: 404, message: '帖子不存在或无权删除' })

    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
