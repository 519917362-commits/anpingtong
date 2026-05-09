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
    company_id  INTEGER DEFAULT NULL,
    title       TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    price       REAL    DEFAULT 0,
    salary_min  REAL    DEFAULT 0,
    salary_max  REAL    DEFAULT 0,
    salary_type TEXT    DEFAULT 'month',
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

  CREATE TABLE IF NOT EXISTS companies (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    logo        TEXT    DEFAULT '',
    industry    TEXT    DEFAULT '',
    scale       TEXT    DEFAULT '',
    description TEXT    DEFAULT '',
    address     TEXT    DEFAULT '',
    phone       TEXT    DEFAULT '',
    website     TEXT    DEFAULT '',
    status      TEXT    DEFAULT 'active',
    user_id     INTEGER DEFAULT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notices (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    type       TEXT    DEFAULT 'notice',
    views      INTEGER DEFAULT 0,
    status     TEXT    DEFAULT 'published',
    is_pinned  INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS static_pages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    slug      TEXT    UNIQUE NOT NULL,
    title     TEXT    NOT NULL,
    content   TEXT    NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// 迁移：posts 表添加新列（处理 CREATE TABLE IF NOT EXISTS 不更新现有表的情况）
const cols = db.prepare('PRAGMA table_info(posts)').all().map(c => c.name)
const newCols = [
  ['company_id', 'INTEGER DEFAULT NULL'],
  ['salary_min', 'REAL DEFAULT 0'],
  ['salary_max', 'REAL DEFAULT 0'],
  ['salary_type', "TEXT DEFAULT 'month'"],
  ['type', "TEXT DEFAULT 'normal'"],        // normal | article | carpool | deal | qa
  ['departure_location', 'TEXT DEFAULT ""'],  // 拼车出发地
  ['destination', 'TEXT DEFAULT ""'],         // 拼车目的地
  ['departure_time', 'TEXT DEFAULT ""'],      // 拼车出发时间
  ['seats_total', 'INTEGER DEFAULT 0'],        // 拼车总座位
  ['seats_available', 'INTEGER DEFAULT 0'],   // 拼车剩余座位
  ['original_price', 'REAL DEFAULT 0'],        // 促销原价
  ['valid_until', 'TEXT DEFAULT ""'],          // 促销有效期
]
for (const [name, def] of newCols) {
  if (!cols.includes(name)) {
    try { db.exec(`ALTER TABLE posts ADD COLUMN ${name} ${def}`) } catch {}
  }
}

// 创建同城资讯表
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    summary    TEXT    DEFAULT '',
    content    TEXT    NOT NULL,
    author     TEXT    DEFAULT '同城编辑',
    source     TEXT    DEFAULT '',
    cover_img  TEXT    DEFAULT '',
    views      INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    status     TEXT    DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 创建品牌商家表
db.exec(`
  CREATE TABLE IF NOT EXISTS merchants (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER,
    name         TEXT    NOT NULL,
    logo         TEXT    DEFAULT '',
    banner       TEXT    DEFAULT '',
    industry     TEXT    DEFAULT '',
    scale        TEXT    DEFAULT '',
    description  TEXT    DEFAULT '',
    address      TEXT    DEFAULT '',
    phone        TEXT    DEFAULT '',
    wechat       TEXT    DEFAULT '',
    website      TEXT    DEFAULT '',
    brand_story  TEXT    DEFAULT '',
    tags         TEXT    DEFAULT '',
    is_featured  INTEGER DEFAULT 0,
    is_verified  INTEGER DEFAULT 0,
    status       TEXT    DEFAULT 'pending',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// 创建首页Banner表
db.exec(`
  CREATE TABLE IF NOT EXISTS banners (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    image_url  TEXT    NOT NULL,
    link_url   TEXT    DEFAULT '',
    link_type  TEXT    DEFAULT 'none',
    sort_order INTEGER DEFAULT 0,
    start_date DATETIME DEFAULT NULL,
    end_date   DATETIME DEFAULT NULL,
    status     TEXT    DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 创建默认管理员（密码: admin123）
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin')
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash)
  console.log('默认管理员已创建: admin / admin123')
}

// 种子分类数据
// 14个板块分类（主要8个 + 丝网4个 + 其他2个）
const categories = [
  // === 主要分类（8个）===
  { name: '招聘求职',   slug: 'jobs-recruit',    icon: '💼', sort: 1  },
  { name: '房屋租售',   slug: 'house',           icon: '🏠', sort: 2  },
  { name: '家政保洁',   slug: 'life',             icon: '🧹', sort: 3  },
  { name: '招商转让',   slug: 'shop-transfer',    icon: '🏪', sort: 4  },
  { name: '闲置物品',   slug: 'secondhand',       icon: '🔄', sort: 5  },
  { name: '教育培训',   slug: 'education',        icon: '📚', sort: 6  },
  { name: '本地微信群', slug: 'wechat-group',     icon: '💬', sort: 7  },
  { name: '同城商家',   slug: 'companies',        icon: '🏢', sort: 8  },
  // === 丝网产业链（4个）===
  { name: '丝网机械',   slug: 'wiremesh-machine',  icon: '⚙️', sort: 21 },
  { name: '原材料供应', slug: 'wiremesh-material', icon: '🔩', sort: 22 },
  { name: '丝网制品',   slug: 'wiremesh-product', icon: '🕸️', sort: 23 },
  { name: '丝网报价',   slug: 'wiremesh-price',   icon: '📊', sort: 24 },
  // === 其他分类（2个）===
  { name: '车辆服务',   slug: 'vehicle',          icon: '🚗', sort: 31 },
  { name: '优惠促销',   slug: 'discounts',         icon: '🎁', sort: 32 },
]

// 安全地更新分类数据：先将posts的category_id设为NULL（避免外键约束），再替换分类
db.pragma('foreign_keys = OFF')
db.exec('DELETE FROM categories')
db.exec('DELETE FROM posts')  // 清空posts避免孤儿外键
const insertCat = db.prepare(`
  INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)
`)
for (const c of categories) {
  insertCat.run(c.name, c.slug, c.icon, c.sort)
}
db.pragma('foreign_keys = ON')
console.log('分类数据已更新')

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

// 种子公司数据
const insertCompany = db.prepare(`
  INSERT OR IGNORE INTO companies (id, name, industry, scale, description, address, phone, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
`)
const companyData = [
  [1, '安平县金辉丝网制品有限公司', '制造业/丝网', '50-100人',
    '安平县金辉丝网制品有限公司成立于2010年，是一家专业生产各类金属丝网产品的企业。公司主要产品包括：电焊网、勾花网、荷兰网、冲孔网、轧花网、石笼网等。产品远销全国各地，并出口至欧美、东南亚等国际市场。公司拥有先进的生产设备和完善的检测体系，产品质量稳定可靠。',
    '安平县工业园区新兴路88号', '0318-7826888'],
  [2, '河北盈昌钢格板有限公司', '制造业/钢格板', '100-200人',
    '河北盈昌钢格板有限公司是安平县知名企业，专业生产钢格板、格栅板、楼梯踏步板等金属制品。公司拥有自营进出口权，产品广泛应用于建筑、化工、电力、石油、市政工程等领域。公司秉承"质量第一、诚信经营"的理念，热忱欢迎各界朋友洽谈合作。',
    '安平县经济开发区纬二路168号', '0318-7558999'],
  [3, '安平县博达丝网机械厂', '制造业/机械设备', '20-50人',
    '专业生产丝网编织机、焊接机、冲孔机等丝网机械设备，也可定做非标设备，提供设备维修和配件服务。',
    '安平县城东工业区', '0318-7681234'],
  [4, '安平县金友建设工程有限公司', '建筑/工程', '50-100人',
    '安平县金友建设工程有限公司是一家集建筑工程施工、钢结构工程、装饰装修工程于一体的综合性建筑企业。具有建筑工程施工总承包资质。',
    '安平县新盈街168号', '0318-7716888'],
  [5, '衡水复明眼科医院', '医疗/健康', '100-200人',
    '衡水复明眼科医院是衡水市专业眼科医院，开设白内障、青光眼、眼底病、斜弱视、准分子激光等专科，现因业务发展需要，诚聘各类医疗人才。',
    '衡水市桃城区人民路288号', '0318-2108888'],
  [6, '安平县启航教育培训学校', '教育/培训', '20-50人',
    '安平县启航教育培训学校是一家专业从事中小学课外辅导的教育机构，开设中小学英语、数学、语文、物理、化学等课程，小班教学，因材施教。',
    '安平县城中心小学斜对面', '0318-7568899'],
]
for (const c of companyData) {
  insertCompany.run(...c)
}
console.log('公司数据已创建')

// 种子公告数据
const insertNotice = db.prepare(`
  INSERT OR IGNORE INTO notices (id, title, content, type, views, status)
  VALUES (?, ?, ?, ?, ?, 'published')
`)
const noticeData = [
  [1, '🏠 安平同城网正式上线，欢迎使用！',
    '安平同城网（安平便民网）正式上线运营！\n\n我们致力于为安平县本地居民提供最便捷的分类信息服务，涵盖房屋租售、招聘求职、二手物品、生活服务等各个方面的信息发布与查询。\n\n📌 服务特色：\n• 免费发布信息（注册即可发布）\n• 信息审核后24小时内上线\n• 覆盖安平县全境\n• 支持电话快速联系\n\n欢迎安平父老乡亲们使用，有任何建议欢迎反馈！',
    'notice', 0],
  [2, '📢 关于规范信息发布的通知',
    '为维护平台信息质量，保障用户权益，现将信息发布规范公告如下：\n\n1️⃣ 信息必须真实有效，禁止发布虚假、夸大信息\n2️⃣ 禁止发布违法、违规内容\n3️⃣ 禁止发布涉及金钱诈骗、传销等内容\n4️⃣ 招聘类信息不得收取求职者任何费用\n5️⃣ 联系方式必须真实有效\n\n违反以上规范的信息将被删除，严重者将封禁账号。\n\n如有疑问请联系客服。',
    'notice', 0],
  [3, '💼 安平县2024年春季招聘会公告',
    '安平县人力资源和社会保障局联合安平同城网，将于2024年4月举办春季大型招聘会，届时将有100+家企业参会，提供3000+个就业岗位，涵盖丝网制造、建筑工程、服务业、医疗教育等多个行业。\n\n📍 地址：安平县人民广场\n📅 时间：2024年4月15日-16日 9:00-17:00\n🎫 费用：免费入场\n\n欢迎求职者前来应聘！',
    'event', 0],
  [4, '🔍 如何在安平同城网快速找到你需要的信息',
    '安平同城网使用小技巧：\n\n1️⃣ 首页分类导航\n直接点击顶部分类图标，快速进入对应板块。\n\n2️⃣ 搜索功能\n在顶部搜索框输入关键词（地名、公司名、商品名），可搜索全站信息。\n\n3️⃣ 区域筛选\n发布信息时可选择具体区域，查看信息时也可按区域筛选。\n\n4️⃣ 发布信息\n注册登录后，点击"发布信息"即可免费发布各类信息。\n\n5️⃣ 联系对方\n点击信息详情页的"联系TA"按钮，一键拨打发布者电话。',
    'guide', 0],
  [5, '⚠️ 求职防骗提示',
    '安平同城网提醒广大求职者注意以下骗局：\n\n🚨 常见骗术：\n• 收取押金、保证金、服装费\n• 扣押身份证、银行卡\n• 高薪诱惑，要求先汇款\n• 传销拉人\n\n✅ 正确做法：\n• 正规招聘不收任何费用\n• 不随意交出身份证件\n• 核实公司信息（可在国家企业信用信息公示系统查询）\n• 签订正式劳动合同\n\n遇到可疑情况请立即报警并联系我们举报。',
    'warning', 0],
]
for (const n of noticeData) {
  insertNotice.run(...n)
}
console.log('公告数据已创建')

// 种子静态页面数据
const insertPage = db.prepare(`
  INSERT OR IGNORE INTO static_pages (slug, title, content) VALUES (?, ?, ?)
`)
const staticPages = [
  ['about', '关于我们',
    `安平同城网（安平便民网）是安平县本地权威分类信息平台，致力于为安平父老乡亲提供便捷、高效的信息服务。\n\n## 我们的使命\n让安平人找信息更简单，让安平人发布信息更方便。\n\n## 服务范围\n- 房屋租售（租房、买房、商铺、厂房）\n- 招聘求职（全职、兼职、临时工）\n- 车辆服务（买卖、租车、维修）\n- 二手物品（家具、家电、电子产品）\n- 商务服务（丝网加工、物流运输）\n- 生活服务（家政、维修、教育培训）\n\n## 联系方式\n📞 客服热线：400-888-8888\n📱 客服微信：anping tongcheng\n📧 邮箱：service@anping.cn\n📍 地址：安平县城\n\n## 营业执照\n安平同城网由安平县博陵网络科技有限公司运营，工商注册号：131125000000000。`],
  ['agreement', '用户协议',
    `安平同城网用户协议\n\n欢迎您使用安平同城网服务！\n\n## 一、服务说明\n安平同城网是一个本地分类信息平台，用户可以在平台上免费发布和浏览房屋租售、招聘求职、二手物品、生活服务等信息。\n\n## 二、用户注册\n1. 用户注册时应提供真实、准确的个人信息\n2. 用户不得冒用他人名义注册账号\n3. 用户需妥善保管自己的账号密码\n\n## 三、信息发布规范\n1. 发布的信息必须真实、合法\n2. 禁止发布违法、违规、虚假信息\n3. 禁止发布涉及传销、诈骗等内容\n4. 招聘类信息不得向求职者收取任何费用\n5. 联系方式必须真实有效\n\n## 四、免责声明\n1. 本平台仅提供信息存储空间，信息内容由用户自行发布\n2. 本平台不对信息真实性负责，请用户自行核实\n3. 因信息交易产生的纠纷与本平台无关\n4. 本平台有权删除违规信息而不另行通知\n\n## 五、知识产权\n本平台所有内容（文字、图片、软件等）均受法律保护，未经授权不得转载。\n\n## 六、协议修改\n本协议如有修改，将通过网站公告通知用户，继续使用服务视为同意新协议。`],
  ['privacy', '隐私政策',
    `安平同城网隐私政策\n\n安平同城网非常重视用户的隐私保护。本隐私政策说明了我们如何收集、使用和保护您的个人信息。\n\n## 信息收集\n1. 注册信息：用户名、手机号（用于账号验证和联系）\n2. 发布内容：您主动发布的信息（标题、内容、联系方式等）\n3. 浏览记录：访问时间、浏览页面等（用于统计和服务优化）\n4. 设备信息：设备型号、IP地址等（用于安全风控）\n\n## 信息使用\n1. 手机号用于账号验证和联系\n2. 联系信息在您同意的情况下展示给其他用户\n3. 浏览记录用于统计分析，不对外公开\n\n## 信息保护\n1. 我们采取加密存储和传输保护用户数据\n2. 严格限制内部人员访问用户信息\n3. 不向第三方出售或转让用户个人信息\n\n## Cookie政策\n我们使用Cookie技术提升用户体验，包括记住登录状态、优化页面加载等。您可在浏览器中禁用Cookie（部分功能可能受影响）。\n\n## 信息删除\n用户可联系我们申请删除个人账号及关联信息，我们将在30个工作日内处理。`],
  ['contact', '联系我们',
    `联系我们\n\n安平同城网客服中心\n\n## 联系方式\n\n📞 **客服热线**：400-888-8888\n⏰ **服务时间**：周一至周六 9:00-18:00\n📱 **客服微信**：anping_tongcheng\n📧 **商务邮箱**：bd@anping.cn\n\n## 合作洽谈\n如果您是企业用户，希望在平台投放广告或合作推广，请联系：\n📧 商务合作：bd@anping.cn\n📞 商务电话：0318-8888888\n\n## 地址\n📍 河北省衡水市安平县XXXX\n\n## 快速反馈\n您也可以通过以下方式联系我们：\n1. 在网站"关于我们"页面留言\n2. 关注微信公众号"安平同城网"留言\n3. 发送邮件至 service@anping.cn`],
]
for (const p of staticPages) {
  insertPage.run(...p)
}
console.log('静态页面数据已创建')

// 种子示例帖子
const existingPosts = db.prepare('SELECT COUNT(*) as cnt FROM posts').get()
if (existingPosts.cnt === 0) {
  const catIds = db.prepare('SELECT id, slug FROM categories').all()
  const catMap = Object.fromEntries(catIds.map(c => [c.slug, c.id]))

  const samplePosts = [
    { userId: 2, cat: 'house', title: '🏠 出租：安平县城中心两室一厅', content: '🎯 位置：县城中心地带，周边配套完善\n\n✅ 房屋情况：两室一厅，80平米，南北通透，采光充足\n✅ 家电配置：空调、热水器、洗衣机、冰箱等家电齐全\n✅ 拎包入住：被褥自带即可，省心省力\n\n📍 地址：县城中心，公交便利\n💰 价格：1200元/月（含物业费）\n📞 联系：138-0000-1111', price: 1200, contact: '13800001111', location: '县城中心' },
    { userId: 3, cat: 'house', title: '🏠 出售：盛世名门精装三室两厅', content: '🎯 小区：盛世名门（安平知名小区）\n\n✅ 户型：三室两厅一卫，120平米\n✅ 楼层：中高层，电梯直达\n✅ 装修：精装修，南北通透，采光好\n✅ 学区：临近重点学校，学区名额可用\n\n📍 地址：盛世名门小区\n💰 价格：58万元（可议）\n📞 联系：139-0000-2222', price: 580000, contact: '13900002222', location: '盛世名门' },
    { userId: 4, cat: 'car', title: '🚗 转让：2019年大众朗逸自动挡', content: '🚘 车辆信息：\n• 车型：2019款大众朗逸 1.5L 自动舒适版\n• 表显里程：5.2万公里\n• 车辆户籍：安平本地牌照\n• 保险到期：2025年12月\n\n✅ 车况说明：一手车，无重大事故，发动机变速箱正常，定期保养，内外饰整洁\n\n💰 报价：6.8万元（可小刀）\n📞 联系：137-0000-3333\n📍 看车地点：安平县城', price: 68000, contact: '13700003333', location: '安平县' },
    { userId: 2, cat: 'job', companyId: 1, title: '💼 招聘：丝网编织工10名（月薪6000+包吃住）', content: '🏭 安平县金辉丝网制品有限公司\n\n📋 岗位：丝网编织工\n👥 人数：10名\n\n💰 薪资待遇：\n• 月薪：6000-9000元（熟练工可达9000+）\n• 食宿：包吃包住（宿舍有空调）\n• 全勤奖：200元/月\n• 工龄奖：每年涨100元\n• 节日福利：中秋、春节礼品\n\n📋 岗位要求：\n• 年龄：18-50周岁\n• 性别：不限\n• 经验：有无经验均可，有师傅带\n• 身体：健康，吃苦耐劳\n\n📍 地址：安平县工业园区新兴路88号\n📞 联系：0318-7826888（王经理）', price: 0, salary_min: 6000, salary_max: 9000, salary_type: 'month', contact: '0318-7826888', location: '工业园区' },
    { userId: 3, cat: 'job', companyId: 2, title: '💼 招聘：钢格板销售经理（底薪5000+高提成）', content: '🏢 河北盈昌钢格板有限公司\n\n📋 岗位：销售经理\n👥 人数：5名\n\n💰 薪资待遇：\n• 底薪：5000元/月\n• 提成：高额提成，综合月薪10000-30000\n• 社保：五险\n• 月休：4天\n• 其他：定期团建、年终奖金\n\n📋 岗位要求：\n• 学历：大专及以上\n• 经验：有建材/丝网销售经验优先\n• 能力：善于沟通，能适应短期出差\n\n📍 地址：安平县经济开发区纬二路168号\n📞 联系：0318-7558999（李总）', price: 0, salary_min: 5000, salary_max: 30000, salary_type: 'month', contact: '0318-7558999', location: '经济开发区' },
    { userId: 4, cat: 'job', companyId: 4, title: '🏗️ 招聘：建筑工程施工员3名', content: '🏢 安平县金友建设工程有限公司\n\n📋 岗位：施工员\n👥 人数：3名\n\n💰 薪资待遇：\n• 月薪：6000-12000元（面议）\n• 社保：五险\n• 食宿：包吃住\n• 其他：绩效奖金\n\n📋 岗位要求：\n• 学历：建筑相关专业大专及以上\n• 证书：持有施工员证优先\n• 经验：2年以上施工现场经验\n• 其他：熟悉工程图纸和施工规范\n\n📍 地址：安平县新盈街168号\n📞 联系：0318-7716888', price: 0, salary_min: 6000, salary_max: 12000, salary_type: 'month', contact: '0318-7716888', location: '县城' },
    { userId: 2, cat: 'used', title: '🔄 转让：格力变频空调1.5匹', content: '📦 商品详情：\n• 品牌型号：格力变频空调 KFR-35GW\n• 匹数：1.5匹（适合15-22平米房间）\n• 购买时间：2022年5月（使用约2年）\n• 新机价格：当时购买价约2800元\n\n✅ 商品现状：\n• 制冷/制热效果正常\n• 运行噪音低，省电\n• 外观整洁，无损坏\n• 包含原机遥控器\n\n💰 转让价：600元（上门自提可小议）\n📞 联系：135-0000-5555\n📍 地址：安平县城', price: 600, contact: '13500005555', location: '安平县城' },
    { userId: 3, cat: 'business', title: '🛠️ 安平丝网加工·来料批发', content: '🏭 公司业务：\n• 丝网编织加工\n• 冲孔网、轧花网定制\n• 护栏网、防护网生产\n• 石笼网、格宾网加工\n\n✅ 我们的优势：\n• 厂家直销，价格实惠\n• 规格齐全，支持定制\n• 量大从优，代发全国\n• 质量保障，售后无忧\n\n📦 常备现货：\n• 勾花网、电焊网、荷兰网\n• 不锈钢丝网、铜丝网\n• 网格布、钢丝网\n\n📞 洽谈合作：137-0000-8888\n📍 工厂地址：安平县工业园区', price: 0, contact: '13700008888', location: '工业园区' },
    { userId: 4, cat: 'life', title: '🔧 24小时专业开锁·换锁·修锁服务', content: '🔐 服务项目：\n• 开锁：门锁、防盗门、保险柜、汽车锁\n• 换锁：C级锁芯、防盗锁、指纹锁\n• 修锁：锁具维修、门锁调整\n\n✅ 服务优势：\n• 公安备案，专业资质\n• 24小时随叫随到，快速上门\n• 价格公道，诚信经营\n\n💰 收费参考：\n• 普通门开锁：80元起\n• 防盗门开锁：100元起\n• 换锁芯：150元起\n\n📞 热线：134-0000-6666\n📍 服务范围：安平县全县域', price: 0, contact: '13400006666', location: '全县域' },
  ]

  const insertPost = db.prepare(`
    INSERT INTO posts (user_id, category_id, company_id, title, content, price, salary_min, salary_max, salary_type, contact, location, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')
  `)
  let count = 0
  for (const p of samplePosts) {
    if (catMap[p.cat]) {
      insertPost.run(p.userId, catMap[p.cat], p.companyId || null, p.title, p.content, p.price, p.salary_min || 0, p.salary_max || 0, p.salary_type || 'month', p.contact, p.location)
      count++
    }
  }
  console.log(`示例帖子已创建: ${count} 条`)
}

console.log('数据库初始化完成 ✓')
export default db
