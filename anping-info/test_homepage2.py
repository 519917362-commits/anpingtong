from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')

    # 等待图片加载
    page.wait_for_timeout(5000)

    # 截图
    page.screenshot(path='/tmp/homepage_full.png', full_page=True)
    print("完整截图已保存到 /tmp/homepage_full.png")

    # 检查关键元素
    # 1. 检查是否只有顶部搜索栏
    search_forms = page.locator('form').all()
    print(f"找到 {len(search_forms)} 个搜索表单")

    # 2. 检查"免费发布"按钮
    free_post_btn = page.locator('text=免费发布').all()
    print(f"找到 {len(free_post_btn)} 个'免费发布'按钮")

    # 3. 检查全站置顶区域
    top_section = page.locator('text=全站置顶').first
    if top_section.is_visible():
        print("✓ 全站置顶区域可见")

    # 检查置顶内容是否包含图片元素
    images = page.locator('img').all()
    print(f"页面中有 {len(images)} 个图片元素")

    # 检查全站置顶区域内的图片
    top_area = page.locator('text=全站置顶').first
    if top_area.is_visible():
        # 查找最近的父容器
        parent = top_area.locator('xpath=ancestor::div[contains(@class, "overflow-hidden")]')
        if parent.count() > 0:
            imgs_in_top = parent.locator('img').all()
            print(f"全站置顶区域有 {len(imgs_in_top)} 个图片")

    # 截图上半部分（header区域）
    page.screenshot(path='/tmp/homepage_top.png', full_page=False)
    print("顶部截图已保存")

    browser.close()
