const { execSync } = require('child_process')
const fs = require('fs')

const BASE_URL = 'https://www.cnboling.cn'
const CITY_ID = 1

const CATEGORY_MAP = {
  55: { name: '内贸业务员', slug: 'jobs-recruit' },
  57: { name: '客服/文员', slug: 'jobs-recruit' },
  58: { name: '内贸业务员', slug: 'jobs-recruit' },
  59: { name: '外贸业务员', slug: 'jobs-recruit' },
  66: { name: '销售/营业员', slug: 'jobs-recruit' },
  67: { name: '丝网技工', slug: 'jobs-recruit' },
  69: { name: '其他职位', slug: 'jobs-recruit' },
  233: { name: '内贸业务员', slug: 'jobs-recruit' },
  234: { name: '外贸业务员', slug: 'jobs-recruit' },
  235: { name: '设计/网络运营', slug: 'jobs-recruit' },
  238: { name: '丝网技工', slug: 'jobs-recruit' },
  253: { name: '普工/车间工', slug: 'jobs-recruit' },
  254: { name: '焊工', slug: 'jobs-recruit' },
  255: { name: '丝网技工', slug: 'jobs-recruit' },
  256: { name: '普工/车间工', slug: 'jobs-recruit' },
  257: { name: '司机/保安', slug: 'jobs-recruit' },
  258: { name: '库管/质检', slug: 'jobs-recruit' },
  263: { name: '丝网技工', slug: 'jobs-recruit' },
  273: { name: '其他职位', slug: 'jobs-recruit' },
  1: { name: '厂房出租', slug: 'house' },
  10: { name: '房屋租售', slug: 'house' },
  150: { name: '土地出售', slug: 'house' },
  165: { name: '门店出租', slug: 'house' },
  2: { name: '土地出售', slug: 'house' },
  4: { name: '住宅楼出租', slug: 'house' },
}

function fetchPage(url) {
  const escapedUrl = url.replace(/"/g, '\\"')
  const cmd = `curl -s -L --connect-timeout 10 --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${escapedUrl}" | iconv -f GB2312 -t UTF-8 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  } catch (e) {
    console.log(`  抓取失败`)
    return ''
  }
}

function extractPostsFromList(html, fid) {
  const posts = []
  if (!html) return posts

  const regex = /href="bencandy\.php\?city_id=\d+&fid=(\d+)&id=(\d+)"/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const postFid = match[1]
    const id = match[2]
    if (postFid === String(fid)) {
      const sourceUrl = `${BASE_URL}/bencandy.php?city_id=${CITY_ID}&fid=${postFid}&id=${id}`
      posts.push({
        fid: postFid,
        id,
        source_url: sourceUrl
      })
    }
  }
  return posts
}

function extractPostDetail(html) {
  if (!html) return {}

  let content = ''
  let phone = ''
  let salary = ''

  const phoneMatch = html.match(/<span>联系电话[：:]*<\/span>\s*([0-9-]{7,15})/)
  if (phoneMatch) {
    phone = phoneMatch[1].trim()
  }

  const salaryMatch = html.match(/<span>月薪待遇[：:]*<\/span>\s*([^\s<]+)/)
  if (salaryMatch) {
    salary = salaryMatch[1].trim()
  }

  const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>\s*<div/s)
  if (contentMatch) {
    content = contentMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/联系我时.*$/, '')
      .trim()
  }

  const priceMatch = salary.match(/(\d+)/)
  const price = priceMatch ? parseInt(priceMatch[1]) * 100 : 0

  return { content, phone, salary, price }
}

async function main() {
  console.log('=' .repeat(50))
  console.log('安平博陵网数据采集')
  console.log('=' .repeat(50))

  const allFids = Object.keys(CATEGORY_MAP).map(Number)
  console.log(`\n共 ${allFids.length} 个分类\n`)

  const allPosts = []
  const seen = new Set()

  for (const fid of allFids) {
    const catInfo = CATEGORY_MAP[fid]
    console.log(`\n抓取: ${catInfo.name} (fid=${fid})`)

    for (let page = 1; page <= 10; page++) {
      const url = `${BASE_URL}/list.php?fid=${fid}&city_id=${CITY_ID}&page=${page}`
      const html = fetchPage(url)

      const posts = extractPostsFromList(html, fid)

      if (posts.length === 0 && page > 1) break

      let newCount = 0
      for (const p of posts) {
        const key = `${p.fid}-${p.id}`
        if (!seen.has(key)) {
          seen.add(key)
          allPosts.push({ ...p, category_slug: catInfo.slug, category_name: catInfo.name })
          newCount++
        }
      }

      console.log(`  第${page}页: +${newCount} 条 (累计${allPosts.length})`)

      if (posts.length < 5) break
      execSync('sleep 0.2')
    }
  }

  console.log(`\n\n共找到 ${allPosts.length} 条帖子，开始获取详情...`)

  const detailedPosts = []
  for (let i = 0; i < allPosts.length; i++) {
    if (i % 50 === 0) {
      console.log(`  详情进度: ${i}/${allPosts.length}`)
    }

    const html = fetchPage(allPosts[i].source_url)
    const detail = extractPostDetail(html)

    detailedPosts.push({
      ...allPosts[i],
      ...detail,
      title: ''
    })

    if (i % 20 === 0 && i > 0) {
      execSync('sleep 0.5')
    }
  }

  console.log('\n正在提取标题...')
  for (let i = 0; i < detailedPosts.length; i++) {
    const html = fetchPage(detailedPosts[i].source_url)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    if (titleMatch) {
      detailedPosts[i].title = titleMatch[1].replace(/ - 安平博陵网/, '').trim()
    }
    if (i % 50 === 0) console.log(`  标题进度: ${i}/${detailedPosts.length}`)
  }

  console.log('\n保存数据...')

  const validPosts = detailedPosts.filter(p => p.title && p.title.length > 5)
  console.log(`有效帖子: ${validPosts.length} 条`)

  fs.writeFileSync('./crawled_jobs.json', JSON.stringify(validPosts, null, 2))

  const sqlStatements = validPosts.map(p => {
    const title = p.title.replace(/'/g, "''").substring(0, 200)
    const content = (p.content || '').replace(/'/g, "''").substring(0, 5000)
    const phone = (p.phone || '').replace(/'/g, "''")
    const location = '安平县'
    const salaryText = (p.salary || '').replace(/'/g, "''")
    const daysAgo = Math.floor(Math.random() * 90)

    return `INSERT INTO posts (user_id, category_id, title, content, price, contact, location, status, created_at, source_url)
SELECT 2, id, '${title}', '${content}', ${p.price}, '${phone}', '${location}', 'approved', datetime('now', '-${daysAgo} days'), '${p.source_url}' FROM categories WHERE slug = '${p.category_slug}';`
  })

  fs.writeFileSync('./import_jobs.sql', sqlStatements.join('\n'))
  console.log(`SQL语句已保存 (${sqlStatements.length}条)`)

  console.log('\n导入数据库...')
  try {
    execSync(`sqlite3 ../server/db/anping.db ".read import_jobs.sql"`, { stdio: 'pipe' })
    console.log('导入成功!')
  } catch (e) {}

  const count = execSync(`sqlite3 ../server/db/anping.db "SELECT COUNT(*) FROM posts;"`, { encoding: 'utf8' }).trim()
  console.log(`数据库帖子总数: ${count}`)

  const phoneCount = execSync(`sqlite3 ../server/db/anping.db "SELECT COUNT(*) FROM posts WHERE contact != '';"`, { encoding: 'utf8' }).trim()
  console.log(`有电话的帖子: ${phoneCount}`)

  console.log('\n完成!')
}

main().catch(console.error)
