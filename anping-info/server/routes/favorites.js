import { Router } from 'express'
import db from '../db/schema.js'

const router = Router()

// 获取用户收藏列表
router.get('/', (req, res) => {
  try {
    const { user_id } = req.query
    if (!user_id) {
      return res.json({ code: 400, message: '请先登录' })
    }

    const favorites = db.prepare(`
      SELECT f.id, f.created_at, 
             p.id as post_id, p.title, p.contact, p.location, p.salary_min, p.salary_max, p.price, p.created_at as post_created_at,
             c.name as category_name, c.slug as category_slug
      FROM favorites f
      LEFT JOIN posts p ON f.post_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE f.user_id = ? AND p.status = 'approved'
      ORDER BY f.created_at DESC
    `).all(user_id)

    res.json({ code: 200, data: favorites })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 添加收藏
router.post('/', (req, res) => {
  try {
    const { user_id, post_id } = req.body
    if (!user_id) {
      return res.json({ code: 401, message: '请先登录' })
    }

    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND post_id = ?').get(user_id, post_id)
    if (existing) {
      return res.json({ code: 200, message: '已收藏', data: { favorited: true } })
    }

    db.prepare('INSERT INTO favorites (user_id, post_id) VALUES (?, ?)').run(user_id, post_id)
    res.json({ code: 200, message: '收藏成功', data: { favorited: true } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 取消收藏
router.delete('/:post_id', (req, res) => {
  try {
    const { user_id } = req.query
    const { post_id } = req.params

    if (!user_id) {
      return res.json({ code: 401, message: '请先登录' })
    }

    db.prepare('DELETE FROM favorites WHERE user_id = ? AND post_id = ?').run(user_id, post_id)
    res.json({ code: 200, message: '已取消收藏', data: { favorited: false } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 检查是否已收藏
router.get('/check/:post_id', (req, res) => {
  try {
    const { user_id } = req.query
    const { post_id } = req.params

    if (!user_id) {
      return res.json({ code: 200, data: { favorited: false } })
    }

    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND post_id = ?').get(user_id, post_id)
    res.json({ code: 200, data: { favorited: !!existing } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
