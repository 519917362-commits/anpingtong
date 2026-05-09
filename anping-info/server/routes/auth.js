import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/schema.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'anping-secret-key-2024'

// 注册
router.post('/register', (req, res) => {
  const { username, phone, password } = req.body
  if (!username || !phone || !password) {
    return res.json({ code: 400, message: '请填写所有必填字段' })
  }
  if (password.length < 6) {
    return res.json({ code: 400, message: '密码至少6位' })
  }

  try {
    const exist = db.prepare('SELECT id FROM users WHERE username = ? OR phone = ?').get(username, phone)
    if (exist) return res.json({ code: 400, message: '用户名或手机号已存在' })

    const hash = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (username, phone, password) VALUES (?, ?, ?)').run(username, phone, hash)
    const user = db.prepare('SELECT id, username, phone, role FROM users WHERE id = ?').get(result.lastInsertRowid)
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' })

    res.json({ code: 200, message: '注册成功', data: { user, token } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.json({ code: 400, message: '请填写用户名和密码' })

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR phone = ?').get(username, username)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.json({ code: 401, message: '用户名或密码错误' })
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' })
  const { password: _, ...safeUser } = user
  res.json({ code: 200, message: '登录成功', data: { user: safeUser, token } })
})

// 获取当前用户
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.json({ code: 401, message: '未登录' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db.prepare('SELECT id, username, phone, role, created_at FROM users WHERE id = ?').get(payload.id)
    if (!user) return res.json({ code: 404, message: '用户不存在' })
    res.json({ code: 200, data: user })
  } catch {
    res.json({ code: 401, message: 'token无效' })
  }
})

export default router
