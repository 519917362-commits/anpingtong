# 安平同城网 (anping-info) Code Wiki

> 衡水市安平县本地分类信息平台。类似 58同城 / 百姓网风格的城市门户。

## 目录

- [项目架构概览](#项目架构概览)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [后端模块 (Server)](#后端模块-server)
  - [数据库设计 (schema.js)](#数据库设计-schemajs)
  - [API 路由](#api-路由)
  - [关键函数说明](#关键函数说明)
- [前端模块 (Client)](#前端模块-client)
  - [页面组件](#页面组件)
  - [核心组件](#核心组件)
- [管理后台 (Admin)](#管理后台-admin)
- [依赖关系](#依赖关系)
- [项目运行方式](#项目运行方式)
- [API 接口文档](#api-接口文档)
- [默认数据](#默认数据)

---

## 项目架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      安平同城网系统架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│   │   Client    │    │   Server    │    │   Admin     │   │
│   │  (前台)      │◄──►│  (API)      │◄──►│  (后台)      │   │
│   │  :5173      │    │  :3001      │    │  /admin     │   │
│   └─────────────┘    └──────┬──────┘    └─────────────┘   │
│                             │                               │
│                    ┌────────▼────────┐                     │
│                    │     SQLite      │                     │
│                    │   (anping.db)   │                     │
│                    └─────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端 | Node.js + Express | ^18.x |
| 数据库 | better-sqlite3 | ^11.5.0 |
| 认证 | JWT (jsonwebtoken) | ^9.0.2 |
| 密码加密 | bcryptjs | ^2.4.3 |
| 前端框架 | React | ^18.3.1 |
| 前端路由 | react-router-dom | ^6.28.0 |
| 构建工具 | Vite | ^6.0.3 |
| CSS框架 | TailwindCSS | ^3.4.17 |
| 文件上传 | multer | ^1.4.5-lts.1 |

---

## 目录结构

```
anping-info/
├── server/                         # 后端服务
│   ├── index.js                    # Express 入口，路由注册
│   ├── package.json                # 后端依赖配置
│   ├── db/
│   │   ├── schema.js               # 数据库建表、迁移
│   │   ├── seed.js                 # 种子数据初始化
│   │   └── anping.db               # SQLite 数据库文件
│   └── routes/                     # API 路由模块
│       ├── auth.js                 # 用户认证（注册/登录）
│       ├── posts.js                # 帖子 CRUD（公开）
│       ├── user.js                # 用户发布（需认证）
│       ├── admin.js               # 管理后台 API
│       ├── notices.js             # 公告系统
│       ├── companies.js           # 企业黄页
│       └── static.js             # 静态页面
│
├── client/                        # 前台用户端
│   ├── package.json
│   ├── vite.config.js             # Vite 配置（含 API 代理）
│   ├── src/
│   │   ├── main.jsx               # React 入口
│   │   ├── App.jsx                # 路由配置
│   │   ├── index.css              # TailwindCSS 入口
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # 认证上下文
│   │   ├── components/
│   │   │   └── Layout.jsx         # 页面布局组件
│   │   └── pages/                 # 页面组件
│   │       ├── Home.jsx           # 首页
│   │       ├── Category.jsx       # 分类列表
│   │       ├── PostDetail.jsx     # 帖子详情
│   │       ├── PostCreate.jsx     # 发布帖子
│   │       ├── Login.jsx          # 登录
│   │       ├── Register.jsx        # 注册
│   │       ├── MyPosts.jsx        # 我的发布
│   │       ├── Search.jsx         # 搜索
│   │       ├── Jobs.jsx           # 招聘专区
│   │       ├── JobDetail.jsx      # 职位详情
│   │       ├── Companies.jsx       # 企业黄页
│   │       ├── CompanyDetail.jsx  # 企业详情
│   │       ├── Notices.jsx         # 公告列表
│   │       ├── NoticeDetail.jsx   # 公告详情
│   │       ├── StaticPage.jsx     # 静态页面
│   │       ├── AllCategories.jsx  # 全部分类
│   │       └── tools/             # 便民工具
│   │           ├── ToolsHome.jsx
│   │           ├── LogisticsTool.jsx
│   │           ├── WiremeshTool.jsx
│   │           └── MaterialsTool.jsx
│   └── dist/                      # 构建产物
│
└── admin/                         # 管理后台
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx               # React 入口
        ├── App.jsx                # 管理后台全部组件
        └── index.css             # TailwindCSS 入口
```

---

## 后端模块 (Server)

### 数据库设计 (schema.js)

数据库使用 SQLite，通过 `better-sqlite3` 驱动操作。

#### 核心数据表

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `users` | 用户表 | id, username, phone, password, nickname, role, status, created_at |
| `categories` | 分类表 | id, name, slug, icon, sort_order, created_at |
| `posts` | 帖子表 | id, user_id, category_id, company_id, title, content, price, salary_min, salary_max, salary_type, contact, location, views, status, type, created_at |
| `admins` | 管理员表 | id, username, password, created_at |
| `companies` | 企业表 | id, name, logo, industry, scale, description, address, phone, website, status, user_id |
| `notices` | 公告表 | id, title, content, type, views, status, is_pinned, created_at |
| `static_pages` | 静态页面表 | id, slug, title, content, updated_at |
| `news` | 同城资讯表 | id, title, summary, content, author, source, cover_img, views, is_featured, status |
| `merchants` | 品牌商家表 | id, user_id, name, logo, banner, industry, description, address, phone, wechat, is_featured, is_verified, status |
| `banners` | 首页Banner表 | id, title, image_url, link_url, link_type, sort_order, start_date, end_date, status |

#### 帖子类型 (posts.type)

| 类型值 | 说明 |
|--------|------|
| `normal` | 普通信息 |
| `article` | 文章 |
| `carpool` | 拼车 |
| `deal` | 促销/优惠 |
| `qa` | 问答 |

#### 帖子状态 (posts.status)

| 状态值 | 说明 |
|--------|------|
| `pending` | 待审核 |
| `approved` | 已通过 |
| `rejected` | 已拒绝 |

#### 默认分类 (14个)

```
1. 招聘求职    (jobs-recruit)    💼
2. 二手买卖    (secondhand)      🔄
3. 房屋租售    (house)          🏠
4. 旺铺转让    (shop-transfer)  🏪
5. 车辆交易    (vehicle)        🚗
6. 寻人寻物    (missing)        🔍
7. 家电数码    (electronics)    📱
8. 教育培训    (education)       📚
9. 家居建材    (home-materials) 🏗️
10. 优惠信息    (discounts)      🎁
11. 拼车出行    (carpool)        🚙
12. 促销打折    (promotions)     🏷️
13. 便民查询    (tools)          🔎
14. 全城知道    (qa)             🔮
```

---

### API 路由

#### 路由注册 (server/index.js)

```javascript
app.use('/api/auth', authRoutes)          // 用户认证
app.use('/api/posts', postsRoutes)        // 帖子公开接口
app.use('/api/user/posts', userRoutes)    // 用户发布（需登录）
app.use('/api/admin', adminRoutes)        // 管理后台 API
app.use('/api/notices', noticesRoutes)    // 公告接口
app.use('/api/companies', companiesRoutes) // 企业黄页
app.use('/api/static', staticRoutes)       // 静态页面
```

#### 路由模块详解

| 文件 | 路径前缀 | 说明 |
|------|----------|------|
| `routes/auth.js` | `/api/auth` | 用户注册、登录、获取当前用户 |
| `routes/posts.js` | `/api/posts` | 帖子列表、详情、分类列表 |
| `routes/user.js` | `/api/user/posts` | 用户发布、我的帖子、删除帖子 |
| `routes/admin.js` | `/api/admin` | 管理后台所有功能 |
| `routes/notices.js` | `/api/notices` | 公告列表、详情 |
| `routes/companies.js` | `/api/companies` | 企业列表、详情 |
| `routes/static.js` | `/api/static` | 静态页面获取 |

---

### 关键函数说明

#### 数据库连接 (db/schema.js)

```javascript
import Database from 'better-sqlite3'
const db = new Database(path.join(__dirname, 'anping.db'))
db.pragma('foreign_keys = ON')
```

**功能说明**：创建 SQLite 数据库连接并启用外键约束。

#### JWT 验证中间件

**用户端中间件** (`routes/user.js`):
```javascript
function authMiddleware(req, res, next) {
  // 验证用户 JWT Token
  // 设置 req.userId 和 req.userRole
}
```

**管理端中间件** (`routes/admin.js`):
```javascript
function adminAuth(req, res, next) {
  // 验证管理员 JWT Token
  // 检查 role === 'admin'
}
```

#### 密码加密

使用 `bcryptjs` 进行密码哈希：
```javascript
const hash = bcrypt.hashSync(password, 10)  // 加密
bcrypt.compareSync(password, hash)           // 验证
```

#### JWT 签名

```javascript
const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' })
```

---

## 前端模块 (Client)

### 页面组件

| 组件 | 路由 | 说明 |
|------|------|------|
| `Home.jsx` | `/` | 首页，展示分类导航、最新信息、招聘、企业、公告等 |
| `AllCategories.jsx` | `/all-categories` | 全部分类页面 |
| `Category.jsx` | `/category/:slug` | 分类信息列表 |
| `PostDetail.jsx` | `/post/:id` | 帖子详情页 |
| `PostCreate.jsx` | `/post-create` | 发布信息页 |
| `Login.jsx` | `/login` | 用户登录页 |
| `Register.jsx` | `/register` | 用户注册页 |
| `MyPosts.jsx` | `/my-posts` | 我的发布列表 |
| `Search.jsx` | `/search` | 搜索结果页 |
| `Jobs.jsx` | `/jobs` | 招聘专区 |
| `JobDetail.jsx` | `/job/:id` | 职位详情 |
| `Companies.jsx` | `/companies` | 企业黄页列表 |
| `CompanyDetail.jsx` | `/company/:id` | 企业详情 |
| `Notices.jsx` | `/notices` | 公告列表 |
| `NoticeDetail.jsx` | `/notice/:id` | 公告详情 |
| `StaticPage.jsx` | `/page/:slug` | 静态页面（关于我们、用户协议等） |

### 核心组件

#### AuthContext.jsx - 认证上下文

```javascript
// 状态
user        // 当前用户信息
token       // JWT Token
loading     // 加载状态

// 方法
login(userData, token)  // 登录
logout()                 // 登出
```

**使用方式**：
```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, token, login, logout } = useAuth()
  // ...
}
```

#### Layout.jsx - 页面布局

包含：
- 顶部公告栏
- Logo + 搜索框 + 发布按钮
- 导航菜单
- 主内容区域 (`<Outlet />`)
- 页脚

---

## 管理后台 (Admin)

管理后台是一个单文件 React 应用（`App.jsx`），包含以下功能模块：

### 功能模块

| 组件 | 路由 | 说明 |
|------|------|------|
| `LoginPage` | `/login` | 管理员登录 |
| `Dashboard` | `/` | 数据概览（帖子数、用户数、待审核数等） |
| `PostsPage` | `/posts` | 信息管理（审核、删除） |
| `CategoriesPage` | `/categories` | 分类管理（增删改） |
| `NoticesPage` | `/notices` | 公告管理（发布、编辑、置顶） |
| `CompaniesPage` | `/companies` | 公司黄页管理 |
| `StaticPagesPage` | `/static-pages` | 静态页面管理 |
| `UsersPage` | `/users` | 用户列表 |

### 默认管理员

- **用户名**: `admin`
- **密码**: `admin123`

---

## 依赖关系

```
package.json (server)
├── express              # Web 框架
├── better-sqlite3       # SQLite 驱动
├── bcryptjs            # 密码加密
├── jsonwebtoken        # JWT 认证
├── cors                # 跨域资源共享
├── multer              # 文件上传
└── uuid                # UUID 生成

package.json (client/admin)
├── react               # UI 框架
├── react-dom           # React DOM
├── react-router-dom    # 路由
├── vite                # 构建工具
├── tailwindcss         # CSS 框架
├── autoprefixer        # CSS 前缀
└── postcss             # CSS 处理器
```

---

## 项目运行方式

### 环境要求

- Node.js >= 18.x
- npm 或 yarn

### 启动步骤

#### 1. 后端服务

```bash
cd server
npm install           # 安装依赖
npm run seed          # 初始化数据库
npm run dev           # 启动后端（端口 3001）
```

#### 2. 前台客户端

```bash
cd client
npm install           # 安装依赖
npm run dev           # 启动开发服务器（端口 5173）
```

#### 3. 管理后台

```bash
cd admin
npm install           # 安装依赖
npm run dev           # 启动开发服务器
```

> **注意**：在生产环境中，前台和管理后台都会通过 Express 服务提供静态文件，无需单独启动。

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `3001` | 后端服务端口 |
| `JWT_SECRET` | `anping-secret-key-2024` | JWT 签名密钥 |

---

## API 接口文档

### 认证接口 `/api/auth`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| POST | `/register` | 用户注册 | username, phone, password |
| POST | `/login` | 用户登录 | username, password |
| GET | `/me` | 获取当前用户 | Authorization Header |

### 帖子接口 `/api/posts`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/` | 获取帖子列表 | category, keyword, page, pageSize, status |
| GET | `/categories` | 获取分类列表 | - |
| GET | `/:id` | 获取帖子详情 | - |

### 用户接口 `/api/user/posts`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/` | 发布帖子 | ✅ |
| GET | `/my` | 我的帖子 | ✅ |
| DELETE | `/:id` | 删除帖子 | ✅ |

### 公告接口 `/api/notices`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/` | 获取公告列表 | type, page, pageSize |
| GET | `/:id` | 获取公告详情 | - |

### 企业黄页 `/api/companies`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/` | 获取企业列表 | keyword, industry, page, pageSize |
| GET | `/:id` | 获取企业详情 | - |

### 管理后台 `/api/admin`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/login` | 管理员登录 | - |
| GET | `/stats` | 数据统计 | ✅ |
| GET | `/posts` | 管理帖子列表 | ✅ |
| PATCH | `/posts/:id` | 审核帖子 | ✅ |
| DELETE | `/posts/:id` | 删除帖子 | ✅ |
| GET/POST/PUT/DELETE | `/categories*` | 分类管理 | ✅ |
| GET/POST/PUT/DELETE | `/notices*` | 公告管理 | ✅ |
| GET/POST/PUT/DELETE | `/companies*` | 公司管理 | ✅ |
| GET/POST/PUT/DELETE | `/static-pages*` | 页面管理 | ✅ |
| GET | `/users` | 用户列表 | ✅ |

### 静态页面 `/api/static`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/:slug` | 获取静态页面 | - |

### 响应格式

```javascript
// 成功
{ code: 200, data: {...}, message: 'success' }

// 失败
{ code: 400/401/403/500, message: '错误信息' }

// 列表数据
{ code: 200, data: { list: [], total: 0, page: 1, pageSize: 20 } }
```

---

## 默认数据

### 管理员账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | admin123 | 默认管理员 |

### 测试用户

| 用户名 | 密码 | 昵称 |
|--------|------|------|
| test001 | 123456 | 安平李师傅 |
| test002 | 123456 | 安平张女士 |
| test003 | 123456 | 安平王先生 |

### 默认公司（6家）

1. 安平县金辉丝网制品有限公司
2. 河北盈昌钢格板有限公司
3. 安平县博达丝网机械厂
4. 安平县金友建设工程有限公司
5. 衡水复明眼科医院
6. 安平县启航教育培训学校

### 默认公告（5条）

1. 安平同城网正式上线
2. 关于规范信息发布的通知
3. 安平县2024年春季招聘会公告
4. 如何在安平同城网快速找到你需要的信息
5. 求职防骗提示

### 默认静态页面

- 关于我们 (about)
- 用户协议 (agreement)
- 隐私政策 (privacy)
- 联系我们 (contact)

---

## 扩展方向

- [ ] 图片上传（需接 OSS 或本地存储）
- [ ] 短信验证码登录
- [ ] 微信小程序
- [ ] 地理定位 / 附近信息
- [ ] 付费置顶 / 精华
