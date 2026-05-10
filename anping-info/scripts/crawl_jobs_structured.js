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
  234: { name: '外贸业务员', slug: 'jobs-recruit' },
  238: { name: '丝网技工', slug: 'jobs-recruit' },
  253: { name: '普工/车间工', slug: 'jobs-recruit' },
  254: { name: '焊工', slug: 'jobs-recruit' },
  255: { name: '丝网技工', slug: 'jobs-recruit' },
  258: { name: '库管/质检', slug: 'jobs-recruit' },
}

function fetchPage(url) {
  const escapedUrl = url.replace(/"/g, '\\"')
  const cmd = `curl -s -L --connect-timeout 10 --max-time 20 -A "Mozilla/5.0" "${escapedUrl}" | iconv -f GB2312 -t UTF-8 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  } catch (e) {
    return ''
  }
}

function extractPostsFromList(html, fid) {
  const posts = []
  if (!html) return posts
  const regex = /href="bencandy\.php\?city_id=\d+&fid=(\d+)&id=(\d+)"/g
  let match
  while ((match = regex.exec(html)) !== null) {
    if (match[1] === String(fid)) {
      posts.push({
        fid: match[1],
        id: match[2],
        source_url: `${BASE_URL}/bencandy.php?city_id=${CITY_ID}&fid=${match[1]}&id=${match[2]}`
      })
    }
  }
  return posts
}

function extractStructuredData(html) {
  if (!html) return {}

  let data = {
    title: '',
    content: '',
    phone: '',
    salary_min: 0,
    salary_max: 0,
    company_name: '',
    work_address: '',
    recruit_count: 0,
    benefits: '',
    location: '安平县'
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch) {
    data.title = titleMatch[1].replace(/ - 安平博陵网/, '').trim()
  }

  const phoneMatch = html.match(/(?:联系电话)[^\d]*([1][3-9]\d{9})/)
  if (!phoneMatch) {
    const phoneAlt = html.match(/(\d{11})/)
    if (phoneAlt) data.phone = phoneAlt[1]
  } else {
    data.phone = phoneMatch[1]
  }

  const salaryMatch = html.match(/(?:月薪|薪资|工资)[^\d]*(\d+)[-到]?(\d+)?/)
  if (salaryMatch) {
    data.salary_min = parseInt(salaryMatch[1])
    if (salaryMatch[2]) data.salary_max = parseInt(salaryMatch[2])
  }

  const companyMatch = html.match(/(?:公司|厂家|企业)[^\n：:]*[:：]?\s*([^\n<]{2,30})/)
  if (companyMatch) {
    data.company_name = companyMatch[1].replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').trim()
  }

  const addressMatch = html.match(/(?:地址|工作地址|位置)[^\n：:]*[:：]?\s*([^\n<]{5,50})/)
  if (addressMatch) {
    data.work_address = addressMatch[1].replace(/<[^>]+>/g, '').trim()
  }

  const countMatch = html.match(/(?:人数|招聘)[^\d]*(\d+)人?/)
  if (countMatch) {
    data.recruit_count = parseInt(countMatch[1])
  }

  const benefitsMatch = html.match(/福利[^\n]*[:：]?\s*([^\n<]+)/)
  if (benefitsMatch) {
    data.benefits = benefitsMatch[1].replace(/<[^>]+>/g, '').trim()
  }

  const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<div/s)
  if (contentMatch) {
    data.content = contentMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/联系我时.*$/, '')
      .trim()
  } else {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)
    if (bodyMatch) {
      data.content = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/联系我时.*$/, '')
        .replace(/安平博陵网[\s\S]*$/, '')
        .trim()
        .substring(0, 3000)
    }
  }

  if (!data.content || data.content.length < 10) {
    const contentAlt = html.match(/信息内容[\s\S]{0,50}([\s\S]{100,2000})/)
    if (contentAlt) {
      data.content = contentAlt[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    }
  }

  if (!data.phone) {
    const phoneInContent = html.match(/(1[3-9]\d{9})/)
    if (phoneInContent) data.phone = phoneInContent[1]
  }

  return data
}

async function main() {
  console.log('='.repeat(50))
  console.log('安平博陵网招聘数据采集（结构化）')
  console.log('='.repeat(50))

  const allFids = Object.keys(CATEGORY_MAP).map(Number)
  console.log(`\n共 ${allFids.length} 个分类\n`)

  const allPosts = []
  const seen = new Set()

  for (const fid of allFids) {
    const catInfo = CATEGORY_MAP[fid]
    console.log(`\n抓取: ${catInfo.name} (fid=${fid})`)

    const html = fetchPage(`${BASE_URL}/list.php?fid=${fid}&city_id=${CITY_ID}`)
    const posts = extractPostsFromList(html, fid)

    let newCount = 0
    for (const p of posts) {
      const key = `${p.fid}-${p.id}`
      if (!seen.has(key)) {
        seen.add(key)
        allPosts.push({ ...p, category_slug: catInfo.slug, category_name: catInfo.name })
        newCount++
      }
    }
    console.log(`  新增 ${newCount} 条 (累计${allPosts.length})`)
    execSync('sleep 0.3')
  }

  console.log(`\n\n共找到 ${allPosts.length} 条帖子，开始获取详情...`)

  const detailedPosts = []
  for (let i = 0; i < allPosts.length; i++) {
    if (i % 20 === 0) console.log(`  进度: ${i}/${allPosts.length}`)

    const html = fetchPage(allPosts[i].source_url)
    const detail = extractStructuredData(html)

    detailedPosts.push({
      ...allPosts[i],
      ...detail
    })

    if (i % 15 === 0 && i > 0) execSync('sleep 0.5')
  }

  console.log('\n保存数据...')

  fs.writeFileSync('./crawled_structured.json', JSON.stringify(detailedPosts, null, 2))

  const validPosts = detailedPosts.filter(p => p.title && p.title.length > 5)
  console.log(`有效帖子: ${validPosts.length} 条`)

  const hasPhone = validPosts.filter(p => p.phone).length
  console.log(`有电话: ${hasPhone} 条`)

  const hasCompany = validPosts.filter(p => p.company_name).length
  console.log(`有公司名: ${hasCompany} 条`)

  const sqlStatements = validPosts.map(p => {
    const title = p.title.replace(/'/g, "''").substring(0, 200)
    const content = (p.content || '').replace(/'/g, "''").substring(0, 5000)
    const phone = (p.phone || '').replace(/'/g, "''")
    const company_name = (p.company_name || '').replace(/'/g, "''").substring(0, 100)
    const work_address = (p.work_address || p.location || '安平县').replace(/'/g, "''").substring(0, 200)
    const benefits = (p.benefits || '').replace(/'/g, "''").substring(0, 200)
    const recruit_count = p.recruit_count || 0
    const salary_min = p.salary_min || 0
    const salary_max = p.salary_max || 0
    const daysAgo = Math.floor(Math.random() * 90)

    return `INSERT INTO posts (user_id, category_id, title, content, price, salary_min, salary_max, contact, location, company_name, work_address, recruit_count, benefits, status, created_at, source_url)
SELECT 2, id, '${title}', '${content}', 0, ${salary_min}, ${salary_max}, '${phone}', '${work_address}', '${company_name}', '${work_address}', ${recruit_count}, '${benefits}', 'approved', datetime('now', '-${daysAgo} days'), '${p.source_url}' FROM categories WHERE slug = '${p.category_slug}';`
  })

  fs.writeFileSync('./import_structured.sql', sqlStatements.join('\n'))
  console.log(`SQL语句已保存 (${sqlStatements.length}条)`)

  console.log('\n导入数据库...')
  try {
    execSync(`sqlite3 ../server/db/anping.db ".read import_structured.sql"`, { stdio: 'pipe' })
    console.log('导入成功!')
  } catch (e) {}

  const count = execSync(`sqlite3 ../server/db/anping.db "SELECT COUNT(*) FROM posts;"`, { encoding: 'utf8' }).trim()
  console.log(`数据库帖子总数: ${count}`)

  const phoneCount = execSync(`sqlite3 ../server/db/anping.db "SELECT COUNT(*) FROM posts WHERE contact != '';"`, { encoding: 'utf8' }).trim()
  const companyCount = execSync(`sqlite3 ../server/db/anping.db "SELECT COUNT(*) FROM posts WHERE company_name != '';"`, { encoding: 'utf8' }).trim()
  console.log(`有电话: ${phoneCount}, 有公司名: ${companyCount}`)

  console.log('\n完成!')
}

main().catch(console.error)
