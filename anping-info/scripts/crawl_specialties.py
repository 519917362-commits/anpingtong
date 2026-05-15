#!/usr/bin/env python3
import urllib.request
import re
import time
import sqlite3
import json

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

def parse_salary(text):
    """解析薪资文本"""
    salary_min = 0
    salary_max = 0
    salary_type = 'month'

    patterns = [
        r'(\d+)元[/ /](天|月|小时)',
        r'(\d{3,5})\s*[-~至到]\s*(\d{3,5})',
        r'(\d+)元',
        r'[\[【](\d+)[-到](\d+)[\]】]',
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            groups = match.groups()
            if len(groups) >= 2:
                try:
                    if groups[1] in ['天', '日']:
                        salary_min = int(groups[0]) * 30
                        salary_max = int(groups[0]) * 30
                    elif groups[1] == '小时':
                        salary_min = int(groups[0])
                        salary_max = int(groups[0])
                    else:
                        salary_min = int(groups[0]) * 1000
                        salary_max = int(groups[1]) * 1000
                    break
                except:
                    pass
            elif len(groups) == 1:
                try:
                    val = int(groups[0])
                    if val > 1000:
                        salary_min = val * 1000
                        salary_max = val * 1000
                    else:
                        salary_min = val * 30
                        salary_max = val * 30
                except:
                    pass

    return salary_min, salary_max, salary_type

def extract_jobs_from_specialty(html, special_name, job_type):
    """从专场页面提取结构化职位信息"""
    jobs = []

    # 匹配 zhuanchang 或 baonian div块
    pattern = r'<div class="(?:zhuanchang|baonian)">(.*?)</div>'
    blocks = re.findall(pattern, html, re.DOTALL)

    for block in blocks:
        # 提取职位名称
        title_match = re.search(r'<p class="p1">[^<]*<span[^>]*>[^<]*</span>\\s*(.+?)<br', block)
        if not title_match:
            title_match = re.search(r'<p class="p1">(.+?)</p>', block)
        title = title_match.group(1).strip() if title_match else ''

        if not title or len(title) < 4:
            continue

        # 清理标题中的HTML标签
        title = re.sub(r'<[^>]+>', '', title).strip()
        if not title:
            continue

        # 提取薪资
        salary_match = re.search(r'工资[：:]\s*(.+?)(?:</p>|<br)', block)
        salary_text = salary_match.group(1).strip() if salary_match else ''
        salary_min, salary_max, salary_type = parse_salary(salary_text)

        # 提取电话
        phone_match = re.search(r'电话[：:]\s*(1[3-9]\d{9})', block)
        if not phone_match:
            phone_match = re.search(r'tel:(1[3-9]\d{9})', block)
        phone = phone_match.group(1) if phone_match else ''

        # 提取地址
        addr_match = re.search(r'地址[：:]\s*(.+?)(?:</p>|<br)', block)
        location = addr_match.group(1).strip() if addr_match else '安平县'
        location = re.sub(r'<[^>]+>', '', location).strip()

        jobs.append({
            'title': title,
            'salary_text': salary_text,
            'salary_min': salary_min,
            'salary_max': salary_max,
            'salary_type': salary_type,
            'contact': phone,
            'location': location,
            'special_name': special_name,
            'job_type': job_type
        })

    return jobs

# 专场分类映射
SPECIAL_CATEGORIES = [
    {'name': '门店招聘', 'id': 4452, 'job_type': '销售/营业员'},
    {'name': '高薪职位', 'id': 4450, 'job_type': '其他职位'},
    {'name': '市场开发', 'id': 4422, 'job_type': '内贸业务员'},
    {'name': '数据优化', 'id': 4415, 'job_type': '设计/网络运营'},
    {'name': '男工专场', 'id': 4424, 'job_type': '普工/车间工'},
    {'name': '女工专场', 'id': 4438, 'job_type': '普工/车间工'},
    {'name': '库管质检', 'id': 4416, 'job_type': '库管/质检'},
    {'name': '会计专场', 'id': 4421, 'job_type': '会计/财务'},
    {'name': '外贸业务员', 'id': 4419, 'job_type': '外贸业务员'},
    {'name': '冲孔网专场', 'id': 4425, 'job_type': '丝网技工/技工'},
    {'name': '丝网技工', 'id': 4435, 'job_type': '丝网技工/技工'},
    {'name': '司机专场', 'id': 4427, 'job_type': '司机/保安'},
    {'name': '拔丝退火', 'id': 4423, 'job_type': '拔丝/退火/看炉工'},
    {'name': '织网工专场', 'id': 4429, 'job_type': '织网/整经工'},
    {'name': '报价员专场', 'id': 4418, 'job_type': '丝网报价员'},
    {'name': '焊工专场', 'id': 4426, 'job_type': '电焊/二保/氩弧焊'},
    {'name': '美工设计', 'id': 4437, 'job_type': '设计/网络运营'},
    {'name': '文员客服', 'id': 4428, 'job_type': '客服/文员'},
    {'name': '学徒工专场', 'id': 4430, 'job_type': '零工/计件/学徒'},
    {'name': '经理厂长', 'id': 4420, 'job_type': '店长/厂长/经理'},
    {'name': '外地工作', 'id': 4431, 'job_type': '其他职位'},
    {'name': '快递/外卖', 'id': 4451, 'job_type': '快递员/送货员'},
    {'name': '马屯专场', 'id': 4447, 'job_type': '其他职位'},
    {'name': '城东专场', 'id': 4448, 'job_type': '其他职位'},
    {'name': '城南专场', 'id': 4432, 'job_type': '其他职位'},
    {'name': '城西专场', 'id': 4436, 'job_type': '其他职位'},
    {'name': '县城专场', 'id': 4449, 'job_type': '其他职位'},
    {'name': '滤材城', 'id': 4453, 'job_type': '其他职位'},
]

def main():
    print('='*60)
    print('开始抓取安平博陵网招聘专场结构化数据')
    print('='*60)

    db = get_db()
    category_id = get_category_id(db)
    if not category_id:
        print('错误：找不到招聘分类')
        return

    user_ids = get_random_users(db, 10)
    if not user_ids:
        print('错误：没有可用的用户账号')
        return
    print(f'将使用 {len(user_ids)} 个用户账号发布信息\n')

    all_jobs = []
    all_specialties = []

    # 抓取每个专场
    for special in SPECIAL_CATEGORIES:
        print(f'[{special["name"]}]', end='')

        url = f'https://www.cnboling.cn/anping/bencandy.php?fid=84&id={special["id"]}'
        html = fetch(url)
        if not html:
            print(' [网络错误]')
            continue

        # 提取结构化职位信息
        jobs = extract_jobs_from_specialty(html, special['name'], special['job_type'])
        print(f' 获取到 {len(jobs)} 个职位', end='')

        for job in jobs:
            all_jobs.append({
                'special_name': job['special_name'],
                'job_type': job['job_type'],
                'title': job['title'],
                'salary_text': job['salary_text'],
                'salary_min': job['salary_min'],
                'salary_max': job['salary_max'],
                'salary_type': job['salary_type'],
                'contact': job['contact'] or '暂无',
                'location': job['location'],
                'url': url
            })

        print(f' (累计{len(all_jobs)}条)')

    # 保存结构化数据到JSON
    structured_data = {
        'source': '安平博陵网招聘专场',
        'total_jobs': len(all_jobs),
        'specialties': list(set([j['special_name'] for j in all_jobs])),
        'jobs': all_jobs
    }

    with open('/workspace/anping-info/scripts/specialties_structured.json', 'w', encoding='utf-8') as f:
        json.dump(structured_data, f, ensure_ascii=False, indent=2)
    print(f'\n结构化数据已保存到 specialties_structured.json')

    # 插入数据库
    print(f'\n正在插入 {len(all_jobs)} 条职位信息到数据库...')
    inserted = 0
    for i, job in enumerate(all_jobs):
        try:
            db.execute('''
                INSERT INTO posts (user_id, category_id, title, content, contact, location, job_type,
                    salary_min, salary_max, salary_type, price, source_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'approved')
            ''', (
                user_ids[i % len(user_ids)],
                category_id,
                job['title'],
                f"专场：{job['special_name']}\n薪资：{job['salary_text']}",
                job['contact'],
                job['location'],
                job['job_type'],
                job['salary_min'],
                job['salary_max'],
                job['salary_type'],
                job['url']
            ))
            inserted += 1
            if inserted % 50 == 0:
                db.commit()
        except Exception as e:
            pass

    db.commit()
    db.close()

    print(f'\n' + '='*60)
    print(f'抓取完成！')
    print(f'  - 专场数量：{len(set([j["special_name"] for j in all_jobs]))}')
    print(f'  - 职位总数：{len(all_jobs)}')
    print(f'  - 成功插入：{inserted} 条')
    print('='*60)

if __name__ == '__main__':
    main()
