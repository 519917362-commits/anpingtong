const { execSync } = require('child_process')
const fs = require('fs')

const BASE_URL = 'https://www.cnboling.cn'
const CITY_ID = 1

// 扩展分类映射
const CATEGORIES = [
  // 招聘求职相关
  { fid: 59, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 55, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 57, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 58, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 66, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 67, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 69, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 238, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 253, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 254, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 255, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 256, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 257, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 258, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 263, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 273, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 234, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 233, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 235, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 60, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 61, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 62, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 63, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 64, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 65, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 68, name: '招聘求职', slug: 'jobs-recruit' },
  { fid: 70, name: '招聘求职', slug: 'jobs-recruit' },
  // 房屋租售
  { fid: 60, name: '房屋租售', slug: 'house' },
  { fid: 61, name: '房屋租售', slug: 'house' },
  { fid: 11, name: '房屋租售', slug: 'house' },
  { fid: 12, name: '房屋租售', slug: 'house' },
  { fid: 13, name: '房屋租售', slug: 'house' },
  { fid: 14, name: '房屋租售', slug: 'house' },
  { fid: 15, name: '房屋租售', slug: 'house' },
  { fid: 16, name: '房屋租售', slug: 'house' },
  { fid: 17, name: '房屋租售', slug: 'house' },
  { fid: 18, name: '房屋租售', slug: 'house' },
  { fid: 19, name: '房屋租售', slug: 'house' },
  { fid: 271, name: '房屋租售', slug: 'house' },
  // 闲置物品
  { fid: 62, name: '闲置物品', slug: 'secondhand' },
  // 车辆服务
  { fid: 63, name: '车辆服务', slug: 'vehicle' },
  { fid: 44, name: '车辆服务', slug: 'vehicle' },
  { fid: 45, name: '车辆服务', slug: 'vehicle' },
  { fid: 47, name: '车辆服务', slug: 'vehicle' },
  { fid: 48, name: '车辆服务', slug: 'vehicle' },
  { fid: 50, name: '车辆服务', slug: 'vehicle' },
  { fid: 52, name: '车辆服务', slug: 'vehicle' },
  { fid: 53, name: '车辆服务', slug: 'vehicle' },
  { fid: 250, name: '车辆服务', slug: 'vehicle' },
  { fid: 270, name: '车辆服务', slug: 'vehicle' },
  // 教育培训
  { fid: 64, name: '教育培训', slug: 'education' },
  { fid: 119, name: '教育培训', slug: 'education' },
  { fid: 121, name: '教育培训', slug: 'education' },
  { fid: 122, name: '教育培训', slug: 'education' },
  { fid: 123, name: '教育培训', slug: 'education' },
  { fid: 124, name: '教育培训', slug: 'education' },
  { fid: 125, name: '教育培训', slug: 'education' },
  // 丝网机械
  { fid: 162, name: '丝网机械', slug: 'wiremesh-machine' },
  { fid: 161, name: '丝网机械', slug: 'wiremesh-machine' },
  { fid: 158, name: '丝网机械', slug: 'wiremesh-machine' },
  // 丝网制品/现货
  { fid: 163, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 246, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 249, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 168, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 169, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 172, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 264, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 265, name: '丝网制品', slug: 'wiremesh-product' },
  { fid: 266, name: '丝网制品', slug: 'wiremesh-product' },
  // 招商转让
  { fid: 17, name: '招商转让', slug: 'shop-transfer' },
  // 商务服务 -> 同城商家
  { fid: 103, name: '同城商家', slug: 'companies' },
  { fid: 104, name: '同城商家', slug: 'companies' },
  { fid: 105, name: '同城商家', slug: 'companies' },
  { fid: 106, name: '同城商家', slug: 'companies' },
  { fid: 108, name: '同城商家', slug: 'companies' },
  { fid: 109, name: '同城商家', slug: 'companies' },
  { fid: 116, name: '同城商家', slug: 'companies' },
  { fid: 183, name: '同城商家', slug: 'companies' },
  { fid: 262, name: '同城商家', slug: 'companies' },
]

function fetchPage(url) {
  const escapedUrl = url.replace(/"/g, '\\"')
  const cmd = `curl -s -L --connect-timeout 10 --max-time 15 -A "Mozilla/5.0" "${escapedUrl}" | iconv -f GB2312 -t UTF-8 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 })
  } catch (e) {
    return ''
  }
}

function extractPosts(html, fid, categorySlug) {
  const posts = []
  if (!html) return posts
  
  const regex = /href="bencandy\.php\?city_id=\d+&fid=(\d+)&id=(\d+)"[^>]*>([^<]+)/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const postFid = match[1]
    const id = match[2]
    let title = match[3].trim()
    
    if (postFid === String(fid) && title && title.length > 5 && title.length < 200) {
      title = title.replace(/style="[^"]*"/g, '').replace(/'/g, '').replace(/"/g, '')
      if (!title.includes('http') && !title.includes('color:')) {
        posts.push({
          fid: postFid,
          id,
          title,
          category_slug: categorySlug,
          source_url: `${BASE_URL}/bencandy.php?city_id=${CITY_ID}&fid=${postFid}&id=${id}`
        })
      }
    }
  }
  return posts
}

function extractBanners(html) {
  const banners = []
  if (!html) return banners
  
  const regex = /href="([^"]*bencandy\.php[^"]*)"[^>]*>\s*<img src='([^']+)'/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const linkUrl = match[1].replace(/&amp;/g, '&')
    const imageUrl = match[2]
    
    if (imageUrl && imageUrl.includes('upload_files/label/')) {
      const fidMatch = linkUrl.match(/fid=(\d+)/)
      const idMatch = linkUrl.match(/id=(\d+)/)
      
      if (fidMatch && idMatch) {
        banners.push({
          link_url: linkUrl,
          image_url: imageUrl,
          fid: fidMatch[1],
          id: idMatch[1],
          title: `Banner ${fidMatch[1]}_${idMatch[1]}`
        })
      }
    }
  }
  return banners
}

async function main() {
  console.log('=' .repeat(50))
  console.log('开始抓取安平博陵网数据（增强版）...')
  console.log('=' .repeat(50))
  console.log('')

  const allPosts = []
  const seen = new Set()
  const seenFids = new Set()
  
  // 1. 抓取所有分类
  console.log('【1/3】抓取分类信息...\n')
  
  for (const cat of CATEGORIES) {
    if (seenFids.has(cat.fid)) continue
    seenFids.add(cat.fid)
    
    console.log(`抓取分类 fid=${cat.fid} (${cat.name})...`)
    
    for (let page = 1; page <= 5; page++) {
      const url = `${BASE_URL}/list.php?city_id=${CITY_ID}&fid=${cat.fid}&page=${page}`
      const html = fetchPage(url)
      
      const posts = extractPosts(html, cat.fid, cat.slug)
      
      if (posts.length === 0 && page > 1) break
      
      let newCount = 0
      for (const p of posts) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          allPosts.push(p)
          newCount++
        }
      }
      
      console.log(`  第${page}页: 新增 ${newCount} 条`)
      
      if (posts.length < 5) break
      
      execSync('sleep 0.2')
    }
  }

  console.log(`\n共抓取 ${allPosts.length} 条帖子`)

  // 2. 保存帖子数据
  fs.writeFileSync('./crawled_data.json', JSON.stringify(allPosts, null, 2))
  console.log('帖子JSON已保存到 crawled_data.json')

  // 生成SQL并导入
  const sqlStatements = allPosts.map((p) => {
    const title = p.title.replace(/'/g, "''").substring(0, 200)
    const content = `【来源】${p.source_url}\n【原文标题】${p.title}`
    const daysAgo = Math.floor(Math.random() * 90)
    return `INSERT INTO posts (user_id, category_id, title, content, price, contact, location, status, created_at, source_url) 
SELECT 2, id, '${title}', '${content}', 0, '', '安平县', 'approved', datetime('now', '-${daysAgo} days'), '${p.source_url}' FROM categories WHERE slug = '${p.category_slug}';`
  })

  fs.writeFileSync('./import_posts.sql', sqlStatements.join('\n'))
  console.log(`包含 ${sqlStatements.length} 条INSERT语句`)

  // 3. 抓取Banner图片
  console.log('\n【2/3】抓取首页Banner图片...')
  
  const homeHtml = fetchPage(BASE_URL)
  const banners = extractBanners(homeHtml)
  console.log(`找到 ${banners.length} 个Banner图片`)
  
  // 过滤出有效的banner
  const validBanners = banners.filter(b => b.image_url.includes('upload_files/label/'))
  
  if (validBanners.length > 0) {
    // 生成Banner SQL
    const bannerSqls = validBanners.slice(0, 10).map((b, idx) => {
      const imageUrl = b.image_url.replace(/'/g, "''")
      const linkUrl = b.link_url.replace(/'/g, "''")
      return `INSERT INTO banners (title, image_url, link_url, link_type, sort_order, status) VALUES ('Banner ${idx + 1}', '${imageUrl}', '${linkUrl}', 'external', ${idx}, 'active');`
    })
    
    fs.writeFileSync('./import_banners.sql', bannerSqls.join('\n'))
    console.log(`Banner SQL已保存到 import_banners.sql (${bannerSqls.length}条)`)
  }

  // 4. 导入数据
  console.log('\n【3/3】导入数据到数据库...')
  
  if (sqlStatements.length > 0) {
    const dbPath = './server/db/anping.db'
    
    try {
      execSync(`sqlite3 "${dbPath}" ".read import_posts.sql"`, { stdio: 'inherit' })
      console.log('帖子数据导入成功!')
    } catch (e) {
      console.log('帖子导入遇到问题，继续...')
    }
  }
  
  if (validBanners.length > 0) {
    const dbPath = './server/db/anping.db'
    try {
      execSync(`sqlite3 "${dbPath}" ".read import_banners.sql"`, { stdio: 'inherit' })
      console.log('Banner数据导入成功!')
    } catch (e) {
      console.log('Banner导入遇到问题，继续...')
    }
  }

  console.log('\n' + '=' .repeat(50))
  console.log('抓取完成！')
  console.log('=' .repeat(50))
}

main().catch(console.error)
