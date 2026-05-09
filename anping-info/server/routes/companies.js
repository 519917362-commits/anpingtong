import { Router } from 'express'
import db from '../db/schema.js'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// 公开接口

// 获取公司列表
router.get('/', (req, res) => {
  try {
    const { keyword, industry, page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize

    let sql = `SELECT * FROM companies WHERE status = 'active'`
    const params = []

    if (keyword) {
      sql += ' AND (name LIKE ? OR industry LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    if (industry) {
      sql += ' AND industry LIKE ?'
      params.push(`%${industry}%`)
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), Number(offset))

    const companies = db.prepare(sql).all(...params)
    res.json({ code: 200, data: { list: companies, total: total.cnt, page: Number(page), pageSize: Number(pageSize) } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 获取单个公司详情（含在招职位数）
router.get('/:id', (req, res) => {
  try {
    const company = db.prepare('SELECT * FROM companies WHERE id = ? AND status = ?').get(req.params.id, 'active')
    if (!company) return res.json({ code: 404, message: '公司不存在' })

    // 统计该公司在招职位数
    const jobCount = db.prepare(`
      SELECT COUNT(*) as cnt FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.company_id = ? AND c.slug = 'job' AND p.status = 'approved'
    `).get(req.params.id)

    // 获取该公司最新招聘信息
    const jobs = db.prepare(`
      SELECT p.id, p.title, p.salary_min, p.salary_max, p.salary_type, p.location, p.created_at
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.company_id = ? AND c.slug = 'job' AND p.status = 'approved'
      ORDER BY p.created_at DESC LIMIT 5
    `).all(req.params.id)

    company.jobCount = jobCount.cnt
    company.jobs = jobs

    res.json({ code: 200, data: company })
  } catch (err) {
    console.error('Company detail route error:', err)
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

// 管理员：创建公司
router.post('/', adminAuth, (req, res) => {
  try {
    const { name, industry, scale, description, address, phone, logo } = req.body
    if (!name) return res.json({ code: 400, message: '公司名称不能为空' })
    const result = db.prepare(`
      INSERT INTO companies (name, industry, scale, description, address, phone, logo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, industry || '', scale || '', description || '', address || '', phone || '', logo || '')
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '添加成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：更新公司
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { name, industry, scale, description, address, phone, logo } = req.body
    db.prepare(`
      UPDATE companies SET
        name = COALESCE(?, name),
        industry = COALESCE(?, industry),
        scale = COALESCE(?, scale),
        description = COALESCE(?, description),
        address = COALESCE(?, address),
        phone = COALESCE(?, phone),
        logo = COALESCE(?, logo)
      WHERE id = ?
    `).run(name || null, industry || null, scale || null, description || null, address || null, phone || null, logo || null, req.params.id)
    res.json({ code: 200, message: '更新成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
