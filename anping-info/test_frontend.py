from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("访问 http://localhost:3001 ...")
    page.goto('http://localhost:3001')
    page.wait_for_load_state('networkidle')
    
    print(f"页面标题: {page.title()}")
    
    content = page.content()
    if '安平同城' in content:
        print("✓ 页面内容正常")
    
    page.screenshot(path='/tmp/frontend_test.png', full_page=True)
    print("截图已保存: /tmp/frontend_test.png")
    
    browser.close()
    print("测试完成!")
