from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 1600})

    print("正在访问首页...")
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(5000)

    # 截图
    page.screenshot(path='/tmp/homepage_full.png', full_page=True)
    print("✓ 完整截图已保存: /tmp/homepage_full.png")

    # 截图上半部分
    page.screenshot(path='/tmp/homepage_top.png', full_page=False)
    print("✓ 顶部截图已保存: /tmp/homepage_top.png")

    # 获取页面结构
    print("\n=== 页面结构 ===")

    # 检查分类导航
    nav_items = page.locator('a[href*="real-estate"], a[href*="category"]').all()
    print(f"分类链接数量: {len(nav_items)}")

    # 检查板块标题
    sections = ['招聘求职', '房屋租售', '招商转让', '二手车', '二手闲置', '本地资讯', '同城商家']
    for section in sections:
        if page.locator(f'text={section}').count() > 0:
            print(f"✓ {section}")

    # 检查全站置顶
    if page.locator('text=全站置顶').count() > 0:
        print("✓ 全站置顶区域")

    print("\n页面加载完成!")

    browser.close()
