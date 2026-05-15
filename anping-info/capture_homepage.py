from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 2000})

    print("正在访问首页...")
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(5000)

    # 截图完整页面
    page.screenshot(path='/tmp/homepage_design.png', full_page=True)
    print("✓ 完整截图已保存: /tmp/homepage_design.png")

    print("\n截图完成!")
    browser.close()
