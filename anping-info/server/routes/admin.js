import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/schema.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// Admin JWT 验证
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

// 管理员登录
router.post('/login', (req, res) => {
  const { username, password } = req.body
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username)
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.json({ code: 401, message: '用户名或密码错误' })
  }
  const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ code: 200, data: { token } })
})

// 统计概览
router.get('/stats', adminAuth, (req, res) => {
  try {
    const posts = db.prepare('SELECT COUNT(*) as cnt FROM posts').get()
    const users = db.prepare('SELECT COUNT(*) as cnt FROM users').get()
    const pending = db.prepare("SELECT COUNT(*) as cnt FROM posts WHERE status = 'pending'").get()
    const approved = db.prepare("SELECT COUNT(*) as cnt FROM posts WHERE status = 'approved'").get()
    res.json({ code: 200, data: { posts: posts.cnt, users: users.cnt, pending: pending.cnt, approved: approved.cnt } })
  } catch {
    res.json({ code: 500 })
  }
})

// 管理帖子列表
router.get('/posts', adminAuth, (req, res) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    let sql = `
      SELECT p.*, u.username, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const params = []
    if (status) { sql += ' AND p.status = ?'; params.push(status) }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), Number(offset))
    const posts = db.prepare(sql).all(...params)
    res.json({ code: 200, data: { list: posts, total: total.cnt, page: Number(page), pageSize: Number(pageSize) } })
  } catch (err) {
    res.json({ code: 500 })
  }
})

// 审核帖子
router.patch('/posts/:id', adminAuth, (req, res) => {
  try {
    const { status } = req.body
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.json({ code: 400, message: '状态无效' })
    }
    db.prepare('UPDATE posts SET status = ? WHERE id = ?').run(status, req.params.id)
    res.json({ code: 200, message: '操作成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 删除帖子
router.delete('/posts/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 管理分类
router.get('/categories', adminAuth, (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all()
    res.json({ code: 200, data: cats })
  } catch {
    res.json({ code: 500 })
  }
})

router.post('/categories', adminAuth, (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body
    db.prepare('INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)').run(name, slug, icon || '', sort_order || 0)
    res.json({ code: 200, message: '添加成功' })
  } catch {
    res.json({ code: 500, message: 'slug可能已存在' })
  }
})

router.put('/categories/:id', adminAuth, (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body
    db.prepare('UPDATE categories SET name=?, slug=?, icon=?, sort_order=? WHERE id=?').run(name, slug, icon||'', sort_order||0, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch {
    res.json({ code: 500 })
  }
})

router.delete('/categories/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 用户列表
router.get('/users', adminAuth, (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, phone, role, created_at FROM users ORDER BY created_at DESC').all()
    res.json({ code: 200, data: users })
  } catch {
    res.json({ code: 500 })
  }
})

// 公告列表（管理员用）
router.get('/notices', adminAuth, (req, res) => {
  try {
    const notices = db.prepare('SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC').all()
    res.json({ code: 200, data: notices })
  } catch {
    res.json({ code: 500 })
  }
})

// 创建公告
router.post('/notices', adminAuth, (req, res) => {
  try {
    const { title, content, type = 'notice', is_pinned = 0 } = req.body
    if (!title || !content) return res.json({ code: 400, message: '标题和内容不能为空' })
    if (is_pinned) {
      const cnt = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (cnt.cnt >= 3) return res.json({ code: 400, message: '置顶最多3条' })
    }
    const result = db.prepare('INSERT INTO notices (title, content, type, is_pinned) VALUES (?, ?, ?, ?)').run(title, content, type, is_pinned ? 1 : 0)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '发布成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 更新公告
router.put('/notices/:id', adminAuth, (req, res) => {
  try {
    const { title, content, type, is_pinned, status } = req.body
    const existing = db.prepare('SELECT is_pinned FROM notices WHERE id = ?').get(req.params.id)
    if (!existing) return res.json({ code: 404, message: '公告不存在' })
    if (is_pinned === 1 && !existing.is_pinned) {
      const cnt = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (cnt.cnt >= 3) return res.json({ code: 400, message: '置顶最多3条' })
    }
    db.prepare('UPDATE notices SET title=COALESCE(?,title), content=COALESCE(?,content), type=COALESCE(?,type), is_pinned=COALESCE(?,is_pinned), status=COALESCE(?,status) WHERE id=?').run(
      title||null, content||null, type||null,
      is_pinned !== undefined ? (is_pinned ? 1 : 0) : null,
      status||null, req.params.id
    )
    res.json({ code: 200, message: '更新成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 删除公告
router.delete('/notices/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 切换置顶
router.post('/notices/toggle-pin/:id', adminAuth, (req, res) => {
  try {
    const existing = db.prepare('SELECT is_pinned FROM notices WHERE id = ?').get(req.params.id)
    if (!existing) return res.json({ code: 404, message: '公告不存在' })
    if (!existing.is_pinned) {
      const cnt = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (cnt.cnt >= 3) return res.json({ code: 400, message: '置顶最多3条' })
    }
    db.prepare('UPDATE notices SET is_pinned = NOT is_pinned WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: existing.is_pinned ? '已取消置顶' : '已设为置顶' })
  } catch {
    res.json({ code: 500 })
  }
})

// 公司黄页列表（管理员用，显示所有状态）
router.get('/companies', adminAuth, (req, res) => {
  try {
    const { keyword } = req.query
    let sql = 'SELECT * FROM companies WHERE 1=1'
    const params = []
    if (keyword) { sql += ' AND (name LIKE ? OR industry LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`) }
    sql += ' ORDER BY created_at DESC'
    const companies = db.prepare(sql).all(...params)
    res.json({ code: 200, data: companies })
  } catch {
    res.json({ code: 500 })
  }
})

// 创建公司
router.post('/companies', adminAuth, (req, res) => {
  try {
    const { name, logo, industry, scale, description, address, phone, website, status } = req.body
    if (!name) return res.json({ code: 400, message: '公司名称不能为空' })
    const result = db.prepare('INSERT INTO companies (name, logo, industry, scale, description, address, phone, website, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(name, logo||'', industry||'', scale||'', description||'', address||'', phone||'', website||'', status||'active')
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '创建成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 更新公司
router.put('/companies/:id', adminAuth, (req, res) => {
  try {
    const { name, logo, industry, scale, description, address, phone, website, status } = req.body
    db.prepare('UPDATE companies SET name=COALESCE(?,name), logo=COALESCE(?,logo), industry=COALESCE(?,industry), scale=COALESCE(?,scale), description=COALESCE(?,description), address=COALESCE(?,address), phone=COALESCE(?,phone), website=COALESCE(?,website), status=COALESCE(?,status) WHERE id=?').run(name||null, logo||null, industry||null, scale||null, description||null, address||null, phone||null, website||null, status||null, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 删除公司
router.delete('/companies/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM companies WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 静态页面列表（管理员用）
router.get('/static-pages', adminAuth, (req, res) => {
  try {
    const pages = db.prepare('SELECT * FROM static_pages ORDER BY id ASC').all()
    res.json({ code: 200, data: pages })
  } catch {
    res.json({ code: 500 })
  }
})

// 创建静态页面
router.post('/static-pages', adminAuth, (req, res) => {
  try {
    const { slug, title, content } = req.body
    if (!slug || !title || !content) return res.json({ code: 400, message: 'slug、标题、内容不能为空' })
    const result = db.prepare('INSERT INTO static_pages (slug, title, content) VALUES (?, ?, ?)').run(slug, title, content)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '创建成功' })
  } catch {
    res.json({ code: 500, message: 'slug可能已存在' })
  }
})

// 更新静态页面
router.put('/static-pages/:id', adminAuth, (req, res) => {
  try {
    const { title, content } = req.body
    db.prepare('UPDATE static_pages SET title=COALESCE(?,title), content=COALESCE(?,content) WHERE id=?').run(title||null, content||null, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// 删除静态页面
router.delete('/static-pages/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM static_pages WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

// Banner管理
router.get('/banners', adminAuth, (req, res) => {
  try {
    const banners = db.prepare('SELECT * FROM banners ORDER BY sort_order DESC, id ASC').all()
    res.json({ code: 200, data: banners })
  } catch {
    res.json({ code: 500 })
  }
})

router.post('/banners', adminAuth, (req, res) => {
  try {
    const { title, image_url, link_url, link_type, sort_order, start_date, end_date } = req.body
    if (!title || !image_url) return res.json({ code: 400, message: '标题和图片不能为空' })
    const result = db.prepare('INSERT INTO banners (title, image_url, link_url, link_type, sort_order, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(title, image_url, link_url || '', link_type || 'none', sort_order || 0, start_date || null, end_date || null)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '添加成功' })
  } catch {
    res.json({ code: 500 })
  }
})

router.put('/banners/:id', adminAuth, (req, res) => {
  try {
    const { title, image_url, link_url, link_type, sort_order, start_date, end_date, status } = req.body
    db.prepare('UPDATE banners SET title=COALESCE(?,title), image_url=COALESCE(?,image_url), link_url=COALESCE(?,link_url), link_type=COALESCE(?,link_type), sort_order=COALESCE(?,sort_order), start_date=COALESCE(?,start_date), end_date=COALESCE(?,end_date), status=COALESCE(?,status) WHERE id=?').run(title||null, image_url||null, link_url||null, link_type||null, sort_order||null, start_date||null, end_date||null, status||null, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch {
    res.json({ code: 500 })
  }
})

router.delete('/banners/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: '删除成功' })
  } catch {
    res.json({ code: 500 })
  }
})

export default router
