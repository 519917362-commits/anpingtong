import { Router } from 'express'
import db from '../db/schema.js'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// 公开接口

// 获取公告列表
router.get('/', (req, res) => {
  try {
    const { type, page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    let sql = `SELECT id, title, type, views, is_pinned, created_at FROM notices WHERE status = 'published'`
    const params = []

    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${sql})`).get(...params)
    sql += ' ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
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

    db.prepare('UPDATE notices SET views = views + 1 WHERE id = ?').run(req.params.id)
    notice.views += 1

    res.json({ code: 200, data: notice })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// ── 管理员接口 ──────────────────────────────────────────

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

// 管理员：获取所有公告（包含未发布的）
router.get('/admin/list', adminAuth, (req, res) => {
  try {
    const { status } = req.query
    let sql = 'SELECT * FROM notices'
    const params = []
    if (status) {
      sql += ' WHERE status = ?'
      params.push(status)
    }
    sql += ' ORDER BY is_pinned DESC, created_at DESC'
    const notices = db.prepare(sql).all(...params)
    res.json({ code: 200, data: notices })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：创建公告
router.post('/', adminAuth, (req, res) => {
  try {
    const { title, content, type = 'notice', is_pinned = 0 } = req.body
    if (!title || !content) return res.json({ code: 400, message: '标题和内容不能为空' })
    // 最多置顶3条
    if (is_pinned) {
      const pinnedCount = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (pinnedCount.cnt >= 3) {
        return res.json({ code: 400, message: '置顶公告最多3条，请先取消其他置顶' })
      }
    }
    const result = db.prepare(`
      INSERT INTO notices (title, content, type, is_pinned) VALUES (?, ?, ?, ?)
    `).run(title, content, type, is_pinned ? 1 : 0)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, message: '发布成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：更新公告
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { title, content, type, is_pinned, status } = req.body
    const existing = db.prepare('SELECT * FROM notices WHERE id = ?').get(req.params.id)
    if (!existing) return res.json({ code: 404, message: '公告不存在' })

    // 如果要置顶，检查是否超过3条
    if (is_pinned === 1 && !existing.is_pinned) {
      const pinnedCount = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (pinnedCount.cnt >= 3) {
        return res.json({ code: 400, message: '置顶公告最多3条，请先取消其他置顶' })
      }
    }

    db.prepare(`
      UPDATE notices SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        type = COALESCE(?, type),
        is_pinned = COALESCE(?, is_pinned),
        status = COALESCE(?, status)
      WHERE id = ?
    `).run(
      title || null,
      content || null,
      type || null,
      is_pinned !== undefined ? (is_pinned ? 1 : 0) : null,
      status || null,
      req.params.id
    )
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

// 管理员：切换置顶
router.post('/toggle-pin/:id', adminAuth, (req, res) => {
  try {
    const existing = db.prepare('SELECT is_pinned FROM notices WHERE id = ?').get(req.params.id)
    if (!existing) return res.json({ code: 404, message: '公告不存在' })

    if (!existing.is_pinned) {
      const pinnedCount = db.prepare('SELECT COUNT(*) as cnt FROM notices WHERE is_pinned = 1').get()
      if (pinnedCount.cnt >= 3) {
        return res.json({ code: 400, message: '置顶公告最多3条' })
      }
    }

    db.prepare('UPDATE notices SET is_pinned = NOT is_pinned WHERE id = ?').run(req.params.id)
    res.json({ code: 200, message: existing.is_pinned ? '已取消置顶' : '已设为置顶' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

export default router
