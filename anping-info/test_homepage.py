from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})

    try:
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        # 截图
        page.screenshot(path='/tmp/homepage.png', full_page=True)
        print("✓ 截图已保存到 /tmp/homepage.png")

        # 检查页面内容
        content = page.inner_text('body')

        # 检查关键元素
        if '安平同城' in content or '房产' in content:
            print("✓ 页面内容正常加载")

        if '加载中' in content:
            print("⚠ 页面仍在加载中...")
        else:
            print("✓ 页面加载完成")

        # 检查控制台错误
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.wait_for_timeout(1000)

        if errors:
            print(f"⚠ 控制台错误: {errors[:3]}")
        else:
            print("✓ 无控制台错误")

    except Exception as e:
        print(f"✗ 错误: {e}")

    browser.close()
