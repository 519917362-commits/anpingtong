import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, 'anping.db'))

// 启用外键
db.pragma('foreign_keys = ON')

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    UNIQUE NOT NULL,
    phone      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    nickname   TEXT    DEFAULT '',
    role       TEXT    DEFAULT 'user',
    status     TEXT    DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    slug       TEXT    UNIQUE NOT NULL,
    icon       TEXT    DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    category_id INTEGER,
    title       TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    price       REAL    DEFAULT 0,
    contact     TEXT    NOT NULL,
    location    TEXT    DEFAULT '',
    views       INTEGER DEFAULT 0,
    status      TEXT    DEFAULT 'pending',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// 创建默认管理员（密码: admin123）
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin')
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash)
  console.log('默认管理员已创建: admin / admin123')
}

// 种子分类数据
const categories = [
  { name: '房屋租售', slug: 'house',     icon: '🏠', sort: 1 },
  { name: '车辆服务', slug: 'car',       icon: '🚗', sort: 2 },
  { name: '招聘求职', slug: 'job',       icon: '💼', sort: 3 },
  { name: '商务服务', slug: 'business',  icon: '🛠️', sort: 4 },
  { name: '二手物品', slug: 'used',      icon: '🔄', sort: 5 },
  { name: '生活服务', slug: 'life',      icon: '☕', sort: 6 },
  { name: '教育培训', slug: 'edu',       icon: '📚', sort: 7 },
  { name: '其他信息', slug: 'other',     icon: '📌', sort: 8 },
]

const insertCat = db.prepare(`
  INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)
`)
for (const c of categories) {
  insertCat.run(c.name, c.slug, c.icon, c.sort)
}
console.log('分类数据已创建')

// 创建种子用户
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, password, nickname, phone, role, status)
  VALUES (?, ?, ?, ?, ?, ?)
`)
insertUser.run('admin', bcrypt.hashSync('admin123', 10), '管理员', '13800000000', 'admin', 'active')
insertUser.run('test001', bcrypt.hashSync('123456', 10), '安平李师傅', '13900000001', 'user', 'active')
insertUser.run('test002', bcrypt.hashSync('123456', 10), '安平张女士', '13900000002', 'user', 'active')
insertUser.run('test003', bcrypt.hashSync('123456', 10), '安平王先生', '13900000003', 'user', 'active')
console.log('种子用户已创建')

// 种子一些示例帖子
const existingPosts = db.prepare('SELECT COUNT(*) as cnt FROM posts').get()
if (existingPosts.cnt === 0) {
  const catIds = db.prepare('SELECT id, slug FROM categories').all()
  const catMap = Object.fromEntries(catIds.map(c => [c.slug, c.id]))

  const samplePosts = [
    { userId: 2, cat: 'house', title: '🏠 出租：安平县城中心两室一厅', content: '🎯 位置：县城中心地带，周边配套完善\n\n✅ 房屋情况：两室一厅，80平米，南北通透，采光充足\n✅ 家电配置：空调、热水器、洗衣机、冰箱等家电齐全\n✅ 拎包入住：被褥自带即可，省心省力\n\n📍 地址：县城中心，公交便利\n💰 价格：1200元/月（含物业费）\n📞 联系：138-0000-1111', price: 1200, contact: '13800001111', location: '县城中心' },
    { userId: 3, cat: 'house', title: '🏠 出售：盛世名门精装三室两厅', content: '🎯 小区：盛世名门（安平知名小区）\n\n✅ 户型：三室两厅一卫，120平米\n✅ 楼层：中高层，电梯直达\n✅ 装修：精装修，南北通透，采光好\n✅ 学区：临近重点学校，学区名额可用\n\n📍 地址：盛世名门小区\n💰 价格：58万元（可议）\n📞 联系：139-0000-2222', price: 580000, contact: '13900002222', location: '盛世名门' },
    { userId: 4, cat: 'car', title: '🚗 转让：2019年大众朗逸自动挡', content: '🚘 车辆信息：\n• 车型：2019款大众朗逸 1.5L 自动舒适版\n• 表显里程：5.2万公里\n• 车辆户籍：安平本地牌照\n• 保险到期：2025年12月\n\n✅ 车况说明：一手车，无重大事故，发动机变速箱正常，定期保养，内外饰整洁\n\n💰 报价：6.8万元（可小刀）\n📞 联系：137-0000-3333\n📍 看车地点：安平县城', price: 68000, contact: '13700003333', location: '安平县' },
    { userId: 2, cat: 'job', title: '💼 招聘：安平丝网工厂操作工多名', content: '🏭 公司简介：安平县知名丝网生产企业，因扩大生产规模，现招聘操作工若干名\n\n📋 招聘岗位：丝网编织工、数控操作工、质检员\n\n💰 薪资待遇：\n• 月薪：4500-7000元（熟练工可达8000+）\n• 食宿：包吃包住（四人间，空调热水器）\n• 其他：全勤奖、工龄奖、年终奖\n\n📋 岗位要求：\n• 年龄：18-50周岁\n• 学历：初中及以上\n• 身体：健康，吃苦耐劳\n\n📍 地址：安平县工业园区\n📞 联系：136-0000-4444', price: 0, contact: '13600004444', location: '工业园区' },
    { userId: 3, cat: 'used', title: '🔄 转让：格力变频空调1.5匹', content: '📦 商品详情：\n• 品牌型号：格力变频空调 KFR-35GW\n• 匹数：1.5匹（适合15-22平米房间）\n• 购买时间：2022年5月（使用约2年）\n• 新机价格：当时购买价约2800元\n\n✅ 商品现状：\n• 制冷/制热效果正常\n• 运行噪音低，省电\n• 外观整洁，无损坏\n• 包含原机遥控器\n\n💰 转让价：600元（上门自提可小议）\n📞 联系：135-0000-5555\n📍 地址：安平县城', price: 600, contact: '13500005555', location: '安平县城' },
    { userId: 4, cat: 'life', title: '🔧 24小时专业开锁·换锁·修锁服务', content: '🔐 服务项目：\n• 开锁：门锁、防盗门、保险柜、汽车锁\n• 换锁：C级锁芯、防盗锁、指纹锁\n• 修锁：锁具维修、门锁调整\n\n✅ 服务优势：\n• 公安备案，专业资质\n• 24小时随叫随到，快速上门\n• 价格公道，诚信经营\n• 开锁后提供安全建议\n\n💰 收费参考：\n• 普通门开锁：80元起\n• 防盗门开锁：100元起\n• 换锁芯：150元起\n\n📞 热线：134-0000-6666\n📍 服务范围：安平县全县域', price: 0, contact: '13400006666', location: '全县域' },
    { userId: 2, cat: 'edu', title: '📚 安平少儿英语·作文强化班招生', content: '📖 课程介绍：\n\n【少儿英语班】\n• 招生对象：小学1-6年级\n• 课程内容：同步学校教材+口语拓展\n• 小班教学：每班限12人\n• 上课时间：周六/日 上午9:00-11:00\n\n【作文强化班】\n• 招生对象：小学3-6年级\n• 课程内容：阅读理解、写作技巧、真题训练\n• 资深语文教师授课\n• 上课时间：周六/日 下午2:00-4:00\n\n💰 收费标准：每科680元/学期（15次课）\n📞 咨询/报名：139-0000-7777\n📍 地址：安平县城小学附近', price: 680, contact: '13900007777', location: '安平县城' },
    { userId: 3, cat: 'business', title: '🛠️ 安平丝网加工·来料批发', content: '🏭 公司业务：\n• 丝网编织加工\n• 冲孔网、轧花网定制\n• 护栏网、防护网生产\n• 石笼网、格宾网加工\n\n✅ 我们的优势：\n• 厂家直销，价格实惠\n• 规格齐全，支持定制\n• 量大从优，代发全国\n• 质量保障，售后无忧\n\n📦 常备现货：\n• 勾花网、电焊网、荷兰网\n• 不锈钢丝网、铜丝网\n• 网格布、钢丝网\n\n📞 洽谈合作：137-0000-8888\n📍 工厂地址：安平县工业园区', price: 0, contact: '13700008888', location: '工业园区' },
    { userId: 4, cat: 'other', title: '📌 安平县城寻人启事/失物招领', content: '📝 本栏目免费发布寻人启事、失物招领等公益信息\n\n如需发布此类信息，请联系网站客服或拨打热线，提供详细信息，我们会尽快帮您发布。\n\n📞 客服热线：400-888-8888\n💬 在线留言：通过网站「联系我们」表单提交', price: 0, contact: '4008888888', location: '全县域' },
  ]

  const insertPost = db.prepare(`
    INSERT INTO posts (user_id, category_id, title, content, price, contact, location, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'approved')
  `)
  let count = 0
  for (const p of samplePosts) {
    if (catMap[p.cat]) {
      insertPost.run(p.userId, catMap[p.cat], p.title, p.content, p.price, p.contact, p.location)
      count++
    }
  }
  console.log(`示例帖子已创建: ${count} 条`)
}

console.log('数据库初始化完成 ✓')
export default db
