import { Router } from 'express'
import db from '../db/schema.js'

const router = Router()

// 获取分类列表（支持层级）- 必须在 /:id 之前
router.get('/categories', (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all()
    
    const parentCats = cats.filter(c => !c.parent_id || c.parent_id === 0)
    const childCats = cats.filter(c => c.parent_id && c.parent_id > 0)
    
    const tree = parentCats.map(p => ({
      ...p,
      children: childCats.filter(c => c.parent_id === p.id)
    }))
    
    res.json({ code: 200, data: tree })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取地区列表 - 必须在 /:id 之前
router.get('/areas', (req, res) => {
  try {
    const areas = db.prepare('SELECT * FROM areas ORDER BY sort_order ASC').all()
    res.json({ code: 200, data: areas })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取精选/置顶帖子 - 必须在 /:id 之前
router.get('/featured', (req, res) => {
  try {
    const { category, limit = 6 } = req.query
    
    let sql = `
      SELECT p.*, u.username, c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'approved' AND (p.is_featured = 1 OR p.type = 'top')
    `
    const params = []
    
    if (category) {
      sql += ' AND c.slug = ?'
      params.push(category)
    }
    
    sql += ` ORDER BY CASE WHEN p.is_featured = 1 THEN 0 ELSE 1 END, p.created_at DESC LIMIT ?`
    params.push(Number(limit))
    
    const posts = db.prepare(sql).all(...params)
    res.json({ code: 200, data: posts })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取帖子列表（支持分类、地区、搜索、精选筛选）
router.get('/', (req, res) => {
  try {
    const { 
      category, keyword, area, page = 1, pageSize = 20, 
      status = 'approved', featured, sort = 'latest',
      salary_min, salary_max, price_min, price_max
    } = req.query
    const offset = (page - 1) * pageSize

    let sql = `
      SELECT p.*, u.username, c.name as category_name, c.slug as category_slug, c.icon as category_icon,
             a.name as area_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN areas a ON p.area_id = a.id
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

    if (area && area !== 'all') {
      sql += ' AND (a.slug = ? OR p.location LIKE ?)'
      params.push(area, `%${area}%`)
    }

    if (featured === 'true') {
      sql += ' AND (p.is_featured = 1 OR p.type = ?)'
      params.push('top')
    }

    if (keyword) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.company_name LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    // 薪资筛选
    if (salary_min) {
      sql += ' AND p.salary_max >= ?'
      params.push(Number(salary_min))
    }
    if (salary_max) {
      sql += ' AND p.salary_min <= ?'
      params.push(Number(salary_max))
    }

    // 价格筛选
    if (price_min) {
      sql += ' AND p.price >= ?'
      params.push(Number(price_min))
    }
    if (price_max) {
      sql += ' AND p.price <= ?'
      params.push(Number(price_max))
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    
    // 排序
    switch(sort) {
      case 'price_asc': sql += ' ORDER BY p.price ASC'; break
      case 'price_desc': sql += ' ORDER BY p.price DESC'; break
      case 'salary_desc': sql += ' ORDER BY p.salary_max DESC'; break
      default: sql += ' ORDER BY CASE WHEN p.is_featured = 1 THEN 0 WHEN p.type = \'top\' THEN 1 ELSE 2 END, p.created_at DESC'
    }
    
    sql += ' LIMIT ? OFFSET ?'
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
      SELECT p.*, u.username, u.avatar as user_avatar, u.phone as user_phone,
             c.name as category_name, c.slug as category_slug, c.icon as category_icon,
             a.name as area_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN areas a ON p.area_id = a.id
      WHERE p.id = ?
    `).get(req.params.id)

    if (!post) return res.json({ code: 404, message: '帖子不存在' })

    db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(req.params.id)
    post.views += 1

    res.json({ code: 200, data: post })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取用户发布的帖子
router.get('/user/:userId', (req, res) => {
  try {
    const { page = 1, pageSize = 10, exclude } = req.query
    const offset = (page - 1) * pageSize

    let sql = `
      SELECT p.id, p.title, p.contact, p.location, p.salary_min, p.salary_max, p.created_at,
             c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ? AND p.status = 'approved'
    `
    const params = [req.params.userId]

    if (exclude) {
      sql += ' AND p.id != ?'
      params.push(exclude)
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), Number(offset))

    const posts = db.prepare(sql).all(...params)

    res.json({
      code: 200,
      data: {
        list: posts,
        total: total.cnt
      }
    })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
