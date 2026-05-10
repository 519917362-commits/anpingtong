#!/usr/bin/env python3
import urllib.request
import json
import re
import time
import sqlite3
import os

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req, timeout=15)
        html = response.read().decode('gb2312', errors='ignore')
        return html
    except Exception as e:
        print(f"Error: {e}")
        return ""

def parse_detail(html, fid):
    info = {
        'contact': '', 'price': 0, 'area': 0, 'layout': '',
        'floor': '', 'decoration': '', 'support': '', 'title': '', 'content': ''
    }

    title_match = re.search(r'<title>([^<]+)</title>', html)
    if title_match:
        info['title'] = title_match.group(1).replace(' - 安平博陵网', '').strip()

    contact_match = re.search(r'联系电话[：:]\s*(\d[\d-]+)', html)
    if contact_match:
        info['contact'] = re.sub(r'[^\d]', '', contact_match.group(1))

    price_match = re.search(r'房屋价格[：:]\s*(\d+(?:\.\d+)?)\s*元', html)
    if price_match:
        info['price'] = float(price_match.group(1))

    area_match = re.search(r'室内面积[：:]\s*(\d+(?:\.\d+)?)', html)
    if area_match:
        info['area'] = float(area_match.group(1))

    layout_match = re.search(r'室内布局[：:]\s*([^\s<]+)', html)
    if layout_match:
        info['layout'] = layout_match.group(1).strip()

    floor_match = re.search(r'所在楼层[：:]\s*(\d+)\s*(?:层|楼)', html)
    if floor_match:
        info['floor'] = floor_match.group(1) + '楼'

    decor_match = re.search(r'装修情况[：:]\s*([^\s<]+)', html)
    if decor_match:
        d = decor_match.group(1).strip()
        if '精装' in d: info['decoration'] = '精装修'
        elif '简装' in d: info['decoration'] = '普通装修'
        elif '毛坯' in d: info['decoration'] = '毛坯'

    support_match = re.search(r'配套设施[：:]\s*([\u4e00-\u9fa5\d，、]+)', html)
    if support_match:
        info['support'] = support_match.group(1).strip()

    content_match = re.search(r'<p>\s*([^<]+?)<br', html)
    if content_match:
        info['content'] = content_match.group(1).strip()

    return info

def crawl_one_post(fid, post_id):
    detail_url = f'https://www.cnboling.cn/bencandy.php?city_id=1&fid={fid}&id={post_id}'
    html = fetch(detail_url)
    if not html:
        return None
    return parse_detail(html, fid)

def main():
    db_path = 'server/db/anping.db'
    if not os.path.exists(db_path):
        db_path = os.path.join(os.path.dirname(__file__), 'server/db/anping.db')

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute('SELECT id FROM categories WHERE slug = ?', ('house',))
    result = cur.fetchone()
    if not result:
        print("分类不存在")
        return
    cat_id = result[0]

    house_types = {11: '厂房', 12: '住宅', 13: '厂房', 14: '住宅'}
    category_names = {11: '厂房出租', 12: '住宅出售', 13: '厂房求租', 14: '住宅出租'}

    total = 0

    for fid in [11, 12, 13, 14]:
        cat_name = category_names[fid]
        house_type = house_types[fid]

        print(f"\n=== 爬取 {cat_name} ===")

        list_url = f"https://www.cnboling.cn/list.php?fid={fid}&city_id=1"
        html = fetch(list_url)

        pattern = rf'bencandy\.php\?city_id=1&fid={fid}&id=(\d+)'
        ids = re.findall(pattern, html)
        ids = list(set(ids))
        print(f"找到 {len(ids)} 个帖子")

        six_months_ago = time.time() - 180 * 24 * 3600
        count = 0

        for i, post_id in enumerate(ids[:50]):
            print(f"  [{i+1}/{min(50, len(ids))}] 爬取 {post_id}...")

            info = crawl_one_post(fid, post_id)
            if info and info.get('title'):
                post_date = time.strftime('%Y-%m-%d %H:%M:%S')

                content = f"【来源】https://www.cnboling.cn/bencandy.php?city_id=1&fid={fid}&id={post_id}\n"
                if info.get('content'):
                    content += f"【内容】{info['content']}\n"
                if info.get('support'):
                    content += f"【配套设施】{info['support']}"

                try:
                    cur.execute('''
                        INSERT OR IGNORE INTO posts (
                            user_id, category_id, title, content, price, contact, location,
                            status, source_url, type, house_type, house_area, house_layout,
                            house_floor, house_decoration, house_support, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', ?, 'normal', ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        2, cat_id, info.get('title', f'房产{post_id}'), content,
                        info.get('price', 0), info.get('contact', ''), '安平县',
                        f'https://www.cnboling.cn/bencandy.php?city_id=1&fid={fid}&id={post_id}',
                        house_type, info.get('area', 0), info.get('layout', ''),
                        info.get('floor', ''), info.get('decoration', ''),
                        info.get('support', ''), post_date
                    ))
                    conn.commit()
                    count += 1
                    print(f"    ✓ 导入: {info['title'][:30]}...")
                except Exception as e:
                    print(f"    ✗ 错误: {e}")

            time.sleep(0.3)

        print(f"  {cat_name} 导入 {count} 条")
        total += count

    conn.close()
    print(f"\n\n共导入 {total} 条房产数据")

if __name__ == '__main__':
    main()
