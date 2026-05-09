const { execSync } = require('child_process')
const fs = require('fs')

const BASE_URL = 'https://www.cnboling.cn'
const CITY_ID = 1

const CATEGORIES = [
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
  { fid: 60, name: '房屋租售', slug: 'house' },
  { fid: 61, name: '房屋租售', slug: 'house' },
  { fid: 62, name: '闲置物品', slug: 'secondhand' },
  { fid: 63, name: '车辆服务', slug: 'vehicle' },
  { fid: 64, name: '教育培训', slug: 'education' },
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

async function main() {
  console.log('开始抓取安平博陵网数据...\n')

  const allPosts = []
  const seen = new Set()

  for (const cat of CATEGORIES) {
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
  
  fs.writeFileSync('./crawled_data.json', JSON.stringify(allPosts, null, 2))
  console.log('JSON数据已保存到 crawled_data.json')

  const sqlStatements = allPosts.map((p) => {
    const title = p.title.replace(/'/g, "''").substring(0, 200)
    const content = `【来源】${p.source_url}\n【原文标题】${p.title}`
    const daysAgo = Math.floor(Math.random() * 90)
    return `INSERT INTO posts (user_id, category_id, title, content, price, contact, location, status, created_at, source_url) 
SELECT 2, id, '${title}', '${content}', 0, '', '安平县', 'approved', datetime('now', '-${daysAgo} days'), '${p.source_url}' FROM categories WHERE slug = '${p.category_slug}';`
  })

  fs.writeFileSync('./import_posts.sql', sqlStatements.join('\n'))
  console.log('SQL语句已保存到 import_posts.sql')
  console.log(`包含 ${sqlStatements.length} 条INSERT语句`)
  
  if (sqlStatements.length > 0) {
    console.log('\n开始导入数据到数据库...')
    const dbPath = './server/db/anping.db'
    const importCmd = `sqlite3 "${dbPath}" ".read import_posts.sql"`
    try {
      execSync(importCmd)
      console.log('数据导入成功!')
    } catch (e) {
      console.log('导入失败，可能需要手动执行SQL文件')
    }
  }
}

main().catch(console.error)
