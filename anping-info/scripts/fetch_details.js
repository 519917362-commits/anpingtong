const { execSync } = require('child_process')
const fs = require('fs')

const BASE_URL = 'https://www.cnboling.cn'

function fetchPage(url) {
  const escapedUrl = url.replace(/"/g, '\\"')
  const cmd = `curl -s -L --connect-timeout 10 --max-time 15 -A "Mozilla/5.0" "${escapedUrl}" | iconv -f GB2312 -t UTF-8 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 })
  } catch (e) {
    return ''
  }
}

function extractDetail(html) {
  if (!html) return { content: '', contact: '', price: '' }

  let content = ''
  let contact = ''
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

  const priceMatch = html.match(/(?:价格|报价|售价|租金)[\s:：]*(\d+\.?\d*)\s*(?:万|元|块)?/)
  if (priceMatch) {
    price = priceMatch[1]
  }

  return { content, contact, price }
}

async function main() {
  console.log('开始获取帖子详情...\n')

  const posts = JSON.parse(fs.readFileSync('./crawled_data.json', 'utf8'))
  console.log(`共 ${posts.length} 条帖子需要处理`)

  const updatedPosts = []
  let successCount = 0

  for (let i = 0; i < posts.length; i++) {
    if (i % 20 === 0) {
      console.log(`进度: ${i}/${posts.length}`)
    }

    try {
      const html = fetchPage(posts[i].source_url)
      const detail = extractDetail(html)

      if (detail.content || detail.contact) {
        successCount++
      }

      updatedPosts.push({ ...posts[i], ...detail })

      if (i % 10 === 0) {
        execSync('sleep 0.5')
      }
    } catch (e) {
      updatedPosts.push(posts[i])
    }
  }

  console.log(`\n成功获取 ${successCount} 条详情`)

  fs.writeFileSync('./crawled_data_with_detail.json', JSON.stringify(updatedPosts, null, 2))
  console.log('详细数据已保存到 crawled_data_with_detail.json')

  const sqlStatements = updatedPosts
    .filter(p => p.content || p.contact)
    .map((p) => {
      const title = p.title.replace(/'/g, "''").substring(0, 200)
      const content = (p.content || `【来源】${p.source_url}\n【原文标题】${p.title}`).replace(/'/g, "''").substring(0, 5000)
      const contact = (p.contact || '').replace(/'/g, "''")
      const price = p.price || 0

      return `UPDATE posts SET content = '${content}', contact = '${contact}', price = ${price} WHERE source_url = '${p.source_url}';`
    })

  if (sqlStatements.length > 0) {
    fs.writeFileSync('./update_posts_detail.sql', sqlStatements.join('\n'))
    console.log(`SQL更新语句已保存到 update_posts_detail.sql (${sqlStatements.length}条)`)

    console.log('\n执行更新...')
    execSync(`sqlite3 ../server/db/anping.db ".read update_posts_detail.sql"`, { stdio: 'inherit' })
    console.log('更新完成!')
  }

  console.log('\n完成!')
}

main().catch(console.error)
