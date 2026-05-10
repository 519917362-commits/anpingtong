import https from 'https'
import http from 'http'
import fs from 'fs'

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => {
      req.destroy()
      reject(new Error('Timeout'))
    })
  })
}

function parsePrice(text) {
  if (text.includes('万') || text.includes('万元')) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*万/)
    return match ? parseFloat(match[1]) * 10000 : 0
  }
  const match = text.match(/(\d+)\s*元/)
  return match ? parseFloat(match[1]) : 0
}

function parseArea(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:平米|㎡|平|平方米|m²)/)
  return match ? parseFloat(match[1]) : 0
}

function parseLayout(text) {
  const match = text.match(/(\d+)\s*室\s*(\d+)?\s*厅/)
  if (match) return `${match[1]}室${match[2] || '1'}厅`
  const match2 = text.match(/三室两厅|两室一厅|三室一厅|四室两厅/)
  return match2 ? match2[0] : ''
}

function parseFloor(text) {
  const match = text.match(/(\d+)\s*[/\\]\s*(\d+)\s*(?:层|楼)/)
  if (match) return `${match[1]}/${match[2]}层`
  const match2 = text.match(/(?:第|共)?(\d+)\s*(?:层|楼)/)
  return match2 ? `${match2[1]}层` : ''
}

function parseDecoration(text) {
  if (text.includes('精装')) return '精装修'
  if (text.includes('简装') || text.includes('普通装修')) return '普通装修'
  if (text.includes('毛坯')) return '毛坯'
  return ''
}

function parseSupport(text) {
  const items = []
  const keywords = [
    ['电梯', '电梯'], ['暖气', '暖气'], ['空调', '空调'],
    ['冰箱', '冰箱'], ['洗衣机', '洗衣机'], ['热水器', '热水器'],
    ['床', '床'], ['沙发', '沙发'], ['衣柜', '衣柜'],
    ['电视', '电视'], ['宽带', '宽带'], ['车位', '车位'],
    ['防盗门', '防盗门'], ['家具', '家具'], ['家电', '家电'],
    ['地下室', '地下室'], ['储藏间', '储藏间'], ['太阳能', '太阳能']
  ]
  for (const [kw, name] of keywords) {
    if (text.includes(kw)) items.push(name)
  }
  return [...new Set(items)].join('、')
}

function parseLocation(text) {
  const locations = [
    ['城东工业园', '城东工业园区'], ['城东', '城东'], ['工业园', '工业园区'],
    ['开发区', '经济开发区'], ['马店', '马店镇'], ['南王', '南王庄'],
    ['东黄', '东黄城镇'], ['孙遥', '孙遥城乡'], ['五洲国际', '五洲国际'],
    ['凯旋城', '凯旋城'], ['万景城', '万景城'], ['上东', '上东小区'],
    ['盛世', '盛世名门'], ['裕华', '裕华路'], ['中心街', '中心街'],
    ['中心', '县城中心'], ['县城', '县城']
  ]
  for (const [kw, name] of locations) {
    if (text.includes(kw)) return name
  }
  return '安平县'
}

function parseDirection(text) {
  if (text.includes('南北通透')) return '南北通透'
  if (text.includes('南向') || text.includes('朝南')) return '南'
  if (text.includes('东向') || text.includes('朝东')) return '东'
  if (text.includes('西向') || text.includes('朝西')) return '西'
  return ''
}

async function getDetail(url) {
  try {
    const html = await fetch(url)
    const info = {}

    const contactMatch = html.match(/联系电话[：:]\s*([^\s<]+)/)
    info.contact = contactMatch ? contactMatch[1].replace(/[^\d,，-]/g, '') : ''

    const priceMatch = html.match(/房屋价格[：:]\s*(\d+(?:\.\d+)?)\s*(?:万|元)/)
    if (priceMatch) info.price = parseFloat(priceMatch[1])
    else info.price = parsePrice(html)

    const areaMatch = html.match(/室内面积[：:]\s*(\d+(?:\.\d+)?)/)
    if (areaMatch) info.area = parseFloat(areaMatch[1])
    else info.area = parseArea(html)

    const layoutMatch = html.match(/室内布局[：:]\s*([^\s<]+)/)
    if (layoutMatch) info.layout = layoutMatch[1].trim()
    else info.layout = parseLayout(html)

    const floorMatch = html.match(/所在楼层[：:]\s*([^\s<]+)/)
    if (floorMatch) info.floor = floorMatch[1].trim()
    else info.floor = parseFloor(html)

    const decorMatch = html.match(/装修情况[：:]\s*([^\s<]+)/)
    if (decorMatch) info.decoration = decorMatch[1].trim()
    else info.decoration = parseDecoration(html)

    const supportMatch = html.match(/配套设施[：:]\s*([^\s<]+)/)
    if (supportMatch) info.support = supportMatch[1].trim()
    else info.support = parseSupport(html)

    info.direction = parseDirection(html)

    return info
  } catch (e) {
    return { contact: '', price: 0, area: 0, layout: '', floor: '', decoration: '', support: '', direction: '' }
  }
}

async function crawlListPage(url, fid) {
  const posts = []
  try {
    const html = await fetch(url)
    const linkRegex = /href="(bencandy\.php\?city_id=\d+&fid=\d+&id=\d+)">([^<]+)<\/a>\s*([\d-]+)/g
    let match

    while ((match = linkRegex.exec(html)) !== null) {
      const detailUrl = 'https://www.cnboling.cn/' + match[1]
      const title = match[2].trim()
      const date = match[3]

      posts.push({ title, url: detailUrl, date, fid })
    }
  } catch (e) {
    console.log(`  获取列表失败: ${e.message}`)
  }
  return posts
}

async function main() {
  console.log('开始爬取博陵网房产数据...\n')

  const categories = [
    { fid: 11, name: '厂房出租', house_type: '厂房' },
    { fid: 12, name: '住宅出售', house_type: '住宅' },
    { fid: 13, name: '厂房求租', house_type: '厂房' },
    { fid: 14, name: '住宅出租', house_type: '住宅' },
  ]

  const allPosts = []
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  for (const cat of categories) {
    console.log(`\n=== 爬取 ${cat.name} ===`)
    let page = 1
    let hasMoreData = true

    while (hasMoreData && page <= 15) {
      const url = page === 1
        ? `https://www.cnboling.cn/list.php?fid=${cat.fid}&city_id=1`
        : `https://www.cnboling.cn/list.php?fid=${cat.fid}&city_id=1&PAGE=${page}`

      console.log(`  第${page}页...`)
      const posts = await crawlListPage(url, cat.fid)

      if (posts.length === 0) {
        hasMoreData = false
        break
      }

      for (const post of posts) {
        const postDate = new Date(post.date)
        if (postDate < sixMonthsAgo) {
          console.log(`  日期过旧，停止: ${post.date}`)
          hasMoreData = false
          break
        }

        console.log(`  ${post.title.substring(0, 25)}...`)

        const detail = await getDetail(post.url)
        post.house_type = cat.house_type
        post.contact = detail.contact
        post.price = detail.price
        post.area = detail.area
        post.layout = detail.layout
        post.floor = detail.floor
        post.decoration = detail.decoration
        post.support = detail.support
        post.direction = detail.direction
        post.location = parseLocation(post.title + ' ' + post.support)

        allPosts.push(post)

        await new Promise(r => setTimeout(r, 300))
      }

      page++
    }

    console.log(`  共 ${allPosts.filter(p => p.fid === cat.fid).length} 条`)
  }

  fs.writeFileSync('house_data.json', JSON.stringify(allPosts, null, 2))
  console.log(`\n\n已保存 ${allPosts.length} 条数据到 house_data.json`)
  console.log('数据格式准备就绪，可以导入数据库')
}

main().catch(console.error)
