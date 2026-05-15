from playwright.sync_api import sync_playwright

def test_search_and_nav():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        print("测试首页搜索栏...")
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://127.0.0.1:3001/', timeout=15000)
        page.wait_for_load_state('networkidle')
        
        # 检查搜索框
        search_input = page.locator('input[placeholder="搜索信息..."]')
        if search_input.count() > 0:
            print("✅ 首页搜索框已显示")
        else:
            print("❌ 首页搜索框未显示")
        
        # 检查发布按钮
        post_btn = page.locator('a:has-text("发布信息")')
        if post_btn.count() > 0:
            print("✅ 发布按钮已显示")
        else:
            print("❌ 发布按钮未显示")
        
        page.screenshot(path='/workspace/anping-info/home_with_search.png', full_page=False)
        print("首页截图: /workspace/anping-info/home_with_search.png")
        
        browser.close()
        print("\n✅ 测试完成!")

if __name__ == '__main__':
    test_search_and_nav()
