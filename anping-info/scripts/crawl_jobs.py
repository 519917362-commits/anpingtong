#!/usr/bin/env python3
import urllib.request
import re
import time
import sqlite3

DB_PATH = '/workspace/anping-info/server/db/anping.db'

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req, timeout=15)
        html = response.read().decode('gb2312', errors='ignore')
        return html
    except Exception as e:
        print(f"Error: {e}")
        return ""

def get_db():
    return sqlite3.connect(DB_PATH)

def get_category_id(db):
    cat = db.execute('SELECT id FROM categories WHERE slug = ?', ('jobs-recruit',)).fetchone()
    return cat[0] if cat else None

def get_random_users(db, limit=10):
    users = db.execute('SELECT id FROM users ORDER BY RANDOM() LIMIT ?', (limit,)).fetchall()
    return [u[0] for u in users]

def parse_detail(html, job_type):
    info = {'title': '', 'content': '', 'contact': '', 'location': '安平县'}

    title_match = re.search(r'<title>([^<]+)</title>', html)
    if title_match:
        info['title'] = title_match.group(1).replace(' - 安平博陵网', '').strip()

    phone_match = re.search(r'1[3-9]\d{9}', html)
    if phone_match:
        info['contact'] = phone_match.group()

    addr_match = re.search(r'地\s*址[：:]\s*([^\n<]{5,30})', html)
    if addr_match:
        info['location'] = addr_match.group(1).strip()

    if not info['title']:
        info['title'] = f'招聘{job_type}'

    return info

JOB_CATEGORIES = [
    {'name': '普工/车间工', 'fid': 67},
    {'name': '丝网报价员', 'fid': 253},
    {'name': '内贸业务员', 'fid': 55},
    {'name': '外贸业务员', 'fid': 69},
    {'name': '丝网技工/技工', 'fid': 65},
    {'name': '拔丝/退火/看炉工', 'fid': 70},
    {'name': '电焊/二保/氩弧焊', 'fid': 71},
    {'name': '店长/厂长/经理', 'fid': 68},
    {'name': '会计/财务', 'fid': 56},
    {'name': '设计/网络运营', 'fid': 57},
    {'name': '销售/营业员', 'fid': 58},
    {'name': '化妆/美发', 'fid': 59},
    {'name': '司机/保安', 'fid': 60},
    {'name': '维修工人', 'fid': 61},
    {'name': '零工/计件/学徒', 'fid': 62},
    {'name': '洗车美容工', 'fid': 63},
    {'name': '教师/护士', 'fid': 72},
    {'name': '织网/整经工', 'fid': 73},
    {'name': '库管/质检', 'fid': 74},
    {'name': '快递员/送货员', 'fid': 75},
    {'name': '客服/文员', 'fid': 76},
    {'name': '其他职位', 'fid': 66},
    {'name': '收银/服务员', 'fid': 77},
    {'name': '做饭/厨师', 'fid': 78},
    {'name': '保洁/门卫', 'fid': 79},
    {'name': '抻网工', 'fid': 80},
    {'name': '抖音快手主播', 'fid': 81},
]

def extract_posts_from_html(html, fid):
    """从列表页提取帖子"""
    posts = []

    # 匹配 <a href="bencandy.php?...">标题</a> 模式
    pattern = rf'<a\s+href="(bencandy\.php\?[^"]*fid={fid}[^"]*)"[^>]*>([^<]+)</a>'
    matches = re.findall(pattern, html)

    for link, title in matches:
        title = title.strip()
        if len(title) < 5:
            continue

        match_id = re.search(r'id=(\d+)', link)
        post_id = match_id.group(1) if match_id else '0'

        posts.append({
            'url': f'https://www.cnboling.cn/{link}',
            'title': title,
            'post_id': post_id
        })

    return posts

def main():
    print('='*50)
    print('开始抓取安平博陵网招聘信息')
    print('='*50)

    db = get_db()
    category_id = get_category_id(db)
    if not category_id:
        print('错误：找不到招聘分类')
        return

    deleted = db.execute('DELETE FROM posts WHERE category_id = ?', (category_id,)).rowcount
    db.commit()
    print(f'已清空现有招聘信息: {deleted}条')

    user_ids = get_random_users(db, 10)
    if not user_ids:
        print('错误：没有可用的用户账号')
        return
    print(f'将使用 {len(user_ids)} 个用户账号发布信息\n')

    all_posts = []
    total = 0

    for cat in JOB_CATEGORIES:
        print(f'[{cat["name"]}] fid={cat["fid"]}', end='')

        for page in range(1, 4):
            url = f'https://www.cnboling.cn/list.php?fid={cat["fid"]}&city_id=1&page={page}'
            html = fetch(url)
            if not html:
                print(f' [网络错误]', end='')
                break

            posts = extract_posts_from_html(html, cat['fid'])
            if not posts:
                break

            for post in posts:
                time.sleep(0.2)
                detail_html = fetch(post['url'])
                if not detail_html:
                    continue

                info = parse_detail(detail_html, cat['name'])
                title = info['title'] if info['title'] else post['title']

                all_posts.append({
                    'user_id': user_ids[int(post['post_id']) % len(user_ids)],
                    'category_id': category_id,
                    'title': title,
                    'content': f'岗位类型：{cat["name"]}',
                    'contact': info['contact'] or '暂无',
                    'location': info['location'],
                    'job_type': cat['name'],
                    'source_url': post['url']
                })
                total += 1
                if total % 20 == 0:
                    print(f'\n已获取 {total} 条...', end='')

            time.sleep(0.3)
            print('.', end='', flush=True)

        print(f' (累计{total}条)')

    print(f'\n正在插入 {len(all_posts)} 条招聘信息...')
    inserted = 0
    for post in all_posts:
        try:
            db.execute('''
                INSERT INTO posts (user_id, category_id, title, content, contact, location, job_type, price, salary_min, salary_max, salary_type, source_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 'month', ?, 'approved')
            ''', (
                post['user_id'], post['category_id'], post['title'], post['content'],
                post['contact'], post['location'], post['job_type'], post['source_url']
            ))
            inserted += 1
            if inserted % 50 == 0:
                db.commit()
        except Exception as e:
            pass

    db.commit()
    db.close()

    print(f'\n' + '='*50)
    print(f'抓取完成！共获取 {total} 条，成功插入 {inserted} 条')
    print('='*50)

if __name__ == '__main__':
    main()
