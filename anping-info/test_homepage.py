from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)

    # 截图
    page.screenshot(path='/tmp/homepage.png', full_page=True)
    print("截图已保存到 /tmp/homepage.png")

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

    # 检查分类导航
    categories = ['招聘', '房产', '二手车', '二手闲置']
    for cat in categories:
        cat_elem = page.locator(f'text={cat}').first
        if cat_elem.is_visible():
            print(f"✓ {cat}分类可见")

    # 获取页面标题和内容
    print("\n页面主要内容:")
    content = page.inner_text('body')
    print(content[:500])

    browser.close()
