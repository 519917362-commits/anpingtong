import { Router } from 'express'
import db from '../db/schema.js'

const router = Router()

// 公开路由

// 获取分类列表
router.get('/categories', (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all()
    res.json({ code: 200, data: cats })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取帖子列表（支持分类筛选、搜索、分页）
router.get('/', (req, res) => {
  try {
    const { category, keyword, page = 1, pageSize = 20, status = 'approved' } = req.query
    const offset = (page - 1) * pageSize

    let sql = `
      SELECT p.*, u.username, c.name as category_name, c.icon as category_icon
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      sql += ' AND p.status = ?'
      params.push(status)
    }

    if (category) {
      sql += ' AND c.slug = ?'
      params.push(category)
    }

    if (keyword) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`, ...params).get(...params)
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), Number(offset))

    const posts = db.prepare(sql).all(...params)

    res.json({
      code: 200,
      data: {
        list: posts,
        total: total.cnt,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取单个帖子详情
router.get('/:id', (req, res) => {
  try {
    const post = db.prepare(`
      SELECT p.*, u.username, c.name as category_name, c.icon as category_icon
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id)

    if (!post) return res.json({ code: 404, message: '帖子不存在' })

    // 浏览量+1
    db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(req.params.id)
    post.views += 1

    res.json({ code: 200, data: post })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
