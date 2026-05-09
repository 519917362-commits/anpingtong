# 安平同城网 (anping-info)

> 衡水市安平县本地分类信息平台。类似 58同城 / 百姓网风格的城市门户。

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Node.js + Express + better-sqlite3 |
| 前端 | React + Vite + TailwindCSS |
| 管理后台 | React + Vite + TailwindCSS |
| 数据库 | SQLite（文件型，开箱即用） |
| 认证 | JWT |

## 快速启动

```bash
# 安装后端依赖
cd server
npm install

# 初始化数据库（建表 + 默认数据）
npm run seed

# 启动后端（端口 3001）
npm run dev

# 新开终端，安装前端依赖
cd ../client
npm install

# 启动前端（端口 5173，代理 /api 到 3001）
npm run dev
```

打开 http://localhost:5173

## 管理后台

访问 http://localhost:5173/admin

默认账号：`admin`
默认密码：`admin123`

## 功能列表

### 用户端
- [x] 首页（分类导航 + 最新信息）
- [x] 分类列表页
- [x] 帖子详情页
- [x] 搜索
- [x] 用户注册 / 登录（JWT）
- [x] 发布信息（需登录，审核制）
- [x] 我的发布（查看 + 删除）

### 管理后台
- [x] 数据概览
- [x] 信息管理（审核通过/拒绝/删除）
- [x] 分类管理（增删改）
- [x] 用户列表

## 目录结构

```
anping-info/
├── server/
│   ├── index.js          # Express 入口
│   ├── db/
│   │   ├── schema.js     # 建表 + 默认管理员
│   │   └── seed.js       # 种子数据
│   └── routes/
│       ├── auth.js       # 登录/注册
│       ├── posts.js      # 帖子 CRUD（公开）
│       ├── user.js       # 用户发布（需认证）
│       └── admin.js      # 管理后台 API
├── client/               # 前台 React
│   └── src/
│       ├── pages/        # Home, Category, PostDetail, PostCreate, Login, Register, MyPosts, Search
│       └── components/   # Layout
└── admin/                # 管理后台 React
```

## 分类

默认分类：房屋租售、车辆服务、招聘求职、商务服务、二手物品、生活服务、教育培训、其他信息

## 扩展方向

- 图片上传（需接 OSS 或本地存储）
- 短信验证码登录
- 微信小程序
- 地理定位 / 附近信息
- 付费置顶 / 精华
