const { execSync } = require('child_process')
const fs = require('fs')

const BASE_URL = 'https://www.cnboling.cn'
const CITY_ID = 1

const CATEGORIES = [
  // === 房屋租售 ===
  { fid: 1, name: '厂房出租', slug: 'house', subName: '厂房/库房出租' },
  { fid: 12, name: '住宅出售', slug: 'house', subName: '住宅楼出售' },
  { fid: 14, name: '住宅出租', slug: 'house', subName: '住宅楼出租' },
  { fid: 13, name: '厂房求租', slug: 'house', subName: '厂房求租' },
  { fid: 15, name: '土地出售', slug: 'house', subName: '土地出售' },
  { fid: 16, name: '求购住房', slug: 'house', subName: '二手房求购' },
  { fid: 17, name: '门店转让', slug: 'house', subName: '门店出租/转让' },
  { fid: 18, name: '写字楼出租', slug: 'house', subName: '写字楼出租' },

  // === 车辆服务 ===
  { fid: 63, name: '车辆服务', slug: 'vehicle', subName: '车辆服务' },
  { fid: 70, name: '二手车买卖', slug: 'vehicle', subName: '二手车辆买卖' },
  { fid: 71, name: '租车/代驾', slug: 'vehicle', subName: '租车/代驾' },
  { fid: 72, name: '物流配货', slug: 'vehicle', subName: '物流配货' },
  { fid: 73, name: '摩托/电动车', slug: 'vehicle', subName: '摩托车/电车' },
  { fid: 74, name: '驾校/陪练', slug: 'vehicle', subName: '驾校/陪练' },
  { fid: 75, name: '汽修/保养', slug: 'vehicle', subName: '汽修/保养' },
  { fid: 76, name: '汽车配件', slug: 'vehicle', subName: '汽车配件' },
  { fid: 77, name: '农用车', slug: 'vehicle', subName: '农用车' },
  { fid: 78, name: '过户/检车', slug: 'vehicle', subName: '过户/检车' },

  // === 招聘求职 ===
  { fid: 59, name: '招聘求职', slug: 'jobs-recruit', subName: '招工招聘' },
  { fid: 55, name: '普工/车间', slug: 'jobs-recruit', subName: '普工/车间工' },
  { fid: 80, name: '丝网报价员', slug: 'jobs-recruit', subName: '丝网报价员' },
  { fid: 81, name: '内贸业务员', slug: 'jobs-recruit', subName: '内贸业务员' },
  { fid: 82, name: '外贸业务员', slug: 'jobs-recruit', subName: '外贸业务员' },
  { fid: 83, name: '丝网技工', slug: 'jobs-recruit', subName: '丝网技工' },
  { fid: 84, name: '拔丝/退火', slug: 'jobs-recruit', subName: '拔丝/退火/看炉工' },
  { fid: 85, name: '焊工', slug: 'jobs-recruit', subName: '电焊/二保/氩弧焊' },
  { fid: 86, name: '管理', slug: 'jobs-recruit', subName: '店长/厂长/经理' },
  { fid: 87, name: '会计/财务', slug: 'jobs-recruit', subName: '会计/财务' },
  { fid: 88, name: '设计/运营', slug: 'jobs-recruit', subName: '设计/网络运营' },
  { fid: 89, name: '销售/营业', slug: 'jobs-recruit', subName: '销售/营业员' },
  { fid: 90, name: '美容美发', slug: 'jobs-recruit', subName: '化妆/美发' },
  { fid: 91, name: '司机/保安', slug: 'jobs-recruit', subName: '司机/保安' },
  { fid: 92, name: '维修工', slug: 'jobs-recruit', subName: '维修工人' },
  { fid: 93, name: '零工/学徒', slug: 'jobs-recruit', subName: '零工/计件/学徒' },
  { fid: 94, name: '洗车工', slug: 'jobs-recruit', subName: '洗车美容工' },
  { fid: 95, name: '教师/护士', slug: 'jobs-recruit', subName: '教师/护士' },
  { fid: 96, name: '织网工', slug: 'jobs-recruit', subName: '织网/整经工' },
  { fid: 97, name: '库管/质检', slug: 'jobs-recruit', subName: '库管/质检' },
  { fid: 98, name: '快递员', slug: 'jobs-recruit', subName: '快递员/送货员' },
  { fid: 99, name: '客服/文员', slug: 'jobs-recruit', subName: '客服/文员' },
  { fid: 100, name: '其他职位', slug: 'jobs-recruit', subName: '其他职位' },
  { fid: 101, name: '收银/服务', slug: 'jobs-recruit', subName: '收银/服务员' },
  { fid: 102, name: '厨师', slug: 'jobs-recruit', subName: '做饭/厨师' },
  { fid: 103, name: '保洁/门卫', slug: 'jobs-recruit', subName: '保洁/门卫' },
  { fid: 104, name: '抻网工', slug: 'jobs-recruit', subName: '抻网工' },
  { fid: 105, name: '主播', slug: 'jobs-recruit', subName: '抖音快手主播' },

  // === 丝网出售 ===
  { fid: 106, name: '丝网设备出售', slug: 'wiremesh-equipment', subName: '丝网设备出售' },
  { fid: 107, name: '丝网放加工', slug: 'wiremesh-processing', subName: '丝网放加工' },
  { fid: 108, name: '丝网设备求购', slug: 'wiremesh-equipment', subName: '丝网设备求购' },
  { fid: 109, name: '丝网产品供应', slug: 'wiremesh-product', subName: '丝网产品供应' },
  { fid: 110, name: '护栏网现货', slug: 'wiremesh-product', subName: '护栏网现货' },
  { fid: 111, name: '石笼网现货', slug: 'wiremesh-product', subName: '石笼网现货' },

  // === 求职简历 ===
  { fid: 112, name: '求职简历', slug: 'job-seeker', subName: '求职简历' },

  // === 教育培训 ===
  { fid: 64, name: '教育培训', slug: 'education', subName: '教育培训' },
  { fid: 120, name: 'SEO培训', slug: 'education', subName: '网站优化SEO' },
  { fid: 121, name: '外语培训', slug: 'education', subName: '外语培训' },
  { fid: 122, name: '职业培训', slug: 'education', subName: '职业培训' },
  { fid: 123, name: '继续教育', slug: 'education', subName: '继续教育' },
  { fid: 124, name: '文艺/体育', slug: 'education', subName: '文艺/体育' },
  { fid: 125, name: '外贸培训', slug: 'education', subName: '外贸/内贸培训' },
  { fid: 126, name: '电脑/网络', slug: 'education', subName: '电脑/网络' },
  { fid: 127, name: '中小学教育', slug: 'education', subName: '中小学教育' },

  // === 商务服务 ===
  { fid: 130, name: '快递服务', slug: 'business', subName: '快递' },
  { fid: 131, name: '设计/网站建设', slug: 'business', subName: '设计/网站建设' },
  { fid: 132, name: '印刷服务', slug: 'business', subName: '印刷' },
  { fid: 133, name: '喷绘招牌', slug: 'business', subName: '喷绘招牌' },
  { fid: 134, name: '公司注册', slug: 'business', subName: '公司注册/年检' },
  { fid: 135, name: '会计/审计', slug: 'business', subName: '会计/审计/评估' },
  { fid: 136, name: '物流/货运', slug: 'business', subName: '物流/货运' },
  { fid: 137, name: '翻译/律师', slug: 'business', subName: '翻译/律师' },
  { fid: 138, name: '其他服务', slug: 'business', subName: '其他服务' },

  // === 二手物品 ===
  { fid: 62, name: '闲置物品', slug: 'secondhand', subName: '二手物品' },
  { fid: 140, name: '二手电脑', slug: 'secondhand', subName: '二手电脑' },
  { fid: 141, name: '二手手机', slug: 'secondhand', subName: '二手手机' },
  { fid: 142, name: '二手家居', slug: 'secondhand', subName: '二手家居' },
  { fid: 143, name: '二手家电', slug: 'secondhand', subName: '二手家电' },
  { fid: 144, name: '母婴用品', slug: 'secondhand', subName: '母婴用品' },
  { fid: 145, name: '办公用品', slug: 'secondhand', subName: '办公用品' },
  { fid: 146, name: '其他物品', slug: 'secondhand', subName: '其他物品交易' },

  // === 生活服务 ===
  { fid: 150, name: '管道疏通', slug: 'life', subName: '管道疏通' },
  { fid: 151, name: '建材/装修', slug: 'life', subName: '建材/装修' },
  { fid: 152, name: '搬家保洁', slug: 'life', subName: '搬家保洁' },
  { fid: 153, name: '家电维修', slug: 'life', subName: '家电维修' },
  { fid: 154, name: '设备维修', slug: 'life', subName: '设备维修' },
  { fid: 155, name: '空调移机', slug: 'life', subName: '空调移机' },
  { fid: 156, name: '送水/送气', slug: 'life', subName: '送水/送气' },
  { fid: 157, name: '写真/婚庆', slug: 'life', subName: '写真/婚庆' },
  { fid: 158, name: '电脑维修', slug: 'life', subName: '电脑维修' },
  { fid: 159, name: '拼车服务', slug: 'life', subName: '拼车服务' },
  { fid: 160, name: '改水改电', slug: 'life', subName: '改水改电' },
  { fid: 161, name: '开锁换锁', slug: 'life', subName: '开锁换锁' },
  { fid: 162, name: '出售闲置', slug: 'life', subName: '出售闲置' },
  { fid: 163, name: '监控摄像头', slug: 'life', subName: '监控摄像头' },
  { fid: 164, name: '专修漏房', slug: 'life', subName: '专修漏房' },
  { fid: 165, name: '保姆家政', slug: 'life', subName: '保姆家政' },
]

function fetchPage(url) {
  const escapedUrl = url.replace(/"/g, '\\"')
  const cmd = `curl -s -L --connect-timeout 10 --max-time 15 -A "Mozilla/5.0" "${escapedUrl}" | iconv -f GB2312 -t UTF-8 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  } catch (e) {
    console.log(`  抓取失败: ${url}`)
    return ''
  }
}

function extractPosts(html, fid, categorySlug, subName) {
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
          sub_name: subName,
          source_url: `${BASE_URL}/bencandy.php?city_id=${CITY_ID}&fid=${postFid}&id=${id}`
        })
      }
    }
  }
  return posts
}

function extractDetail(html) {
  if (!html) return { content: '', contact: '', location: '', price: '' }

  let content = ''
  let contact = ''
  let location = '安平县'
  let price = ''

  const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (contentMatch) {
    content = contentMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000)
  }

  const telMatch = html.match(/(1[3-9]\d{9,10}|0\d{2,3}[-\s]?\d{7,8})/g)
  if (telMatch) {
    contact = [...new Set(telMatch)].slice(0, 3).join(', ')
  }

  const priceMatch = html.match(/(\d+\.?\d*)\s*(?:万|元|块)/)
  if (priceMatch) {
    price = priceMatch[1]
  }

  return { content, contact, location, price }
}

async function fetchPostDetail(post) {
  const html = fetchPage(post.source_url)
  const detail = extractDetail(html)
  return { ...post, ...detail }
}

async function main() {
  console.log('开始抓取安平博陵网数据...\n')
  console.log(`共 ${CATEGORIES.length} 个分类\n`)

  const allPosts = []
  const seen = new Set()

  for (const cat of CATEGORIES) {
    console.log(`\n抓取: ${cat.subName} (fid=${cat.fid})`)

    for (let page = 1; page <= 5; page++) {
      const url = `${BASE_URL}/list.php?city_id=${CITY_ID}&fid=${cat.fid}&page=${page}`
      const html = fetchPage(url)

      const posts = extractPosts(html, cat.fid, cat.slug, cat.subName)

      if (posts.length === 0 && page > 1) break

      let newCount = 0
      for (const p of posts) {
        if (!seen.has(`${p.fid}-${p.id}`)) {
          seen.add(`${p.fid}-${p.id}`)
          allPosts.push(p)
          newCount++
        }
      }

      console.log(`  第${page}页: 新增 ${newCount} 条`)

      if (posts.length < 5) break

      execSync('sleep 0.3')
    }
  }

  console.log(`\n\n共抓取 ${allPosts.length} 条帖子标题`)

  console.log('\n开始获取详情（可能需要几分钟）...')
  const detailedPosts = []
  for (let i = 0; i < allPosts.length; i++) {
    if (i % 20 === 0) {
      console.log(`  进度: ${i}/${allPosts.length}`)
    }
    try {
      const detail = await fetchPostDetail(allPosts[i])
      detailedPosts.push(detail)
      if (i % 10 === 0) execSync('sleep 0.5')
    } catch (e) {
      detailedPosts.push(allPosts[i])
    }
  }

  console.log('\n保存数据...')

  fs.writeFileSync('./crawled_data_detailed.json', JSON.stringify(detailedPosts, null, 2))
  console.log('详细JSON数据已保存')

  const sqlStatements = detailedPosts.map((p) => {
    const title = p.title.replace(/'/g, "''").substring(0, 200)
    const content = (p.content || `【来源】${p.source_url}\n【原文标题】${p.title}`).replace(/'/g, "''").substring(0, 5000)
    const contact = (p.contact || '').replace(/'/g, "''")
    const location = (p.location || '安平县').replace(/'/g, "''")
    const price = p.price || 0
    const daysAgo = Math.floor(Math.random() * 90)

    return `INSERT INTO posts (user_id, category_id, title, content, price, contact, location, status, created_at, source_url)
SELECT 2, id, '${title}', '${content}', ${price}, '${contact}', '${location}', 'approved', datetime('now', '-${daysAgo} days'), '${p.source_url}' FROM categories WHERE slug = '${p.category_slug}';`
  })

  fs.writeFileSync('./import_posts_full.sql', sqlStatements.join('\n'))
  console.log('SQL语句已保存到 import_posts_full.sql')

  if (sqlStatements.length > 0) {
    console.log('\n导入数据到数据库...')
    const dbPath = './server/db/anping.db'

    try {
      execSync(`sqlite3 "${dbPath}" ".read import_posts_full.sql"`, { stdio: 'pipe' })
      console.log('数据导入成功!')
    } catch (e) {
      console.log('导入过程有警告，继续...')
    }

    const countResult = execSync(`sqlite3 "${dbPath}" "SELECT COUNT(*) FROM posts;"`, { encoding: 'utf8' })
    console.log(`当前数据库帖子总数: ${countResult.trim()}`)
  }

  console.log('\n完成!')
}

main().catch(console.error)
