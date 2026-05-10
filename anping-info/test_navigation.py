from playwright.sync_api import sync_playwright

def test_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 375, 'height': 667})  # iPhone SE尺寸
        
        print("测试移动端视图...")
        response = page.goto('http://127.0.0.1:3001/', timeout=15000)
        print(f"状态码: {response.status}")
        page.wait_for_load_state('networkidle')
        
        # 截图移动端
        page.screenshot(path='/workspace/anping-info/mobile_nav.png', full_page=False)
        print("移动端截图已保存: /workspace/anping-info/mobile_nav.png")
        
        # 测试桌面端
        print("\n测试桌面端视图...")
        page.set_viewport_size({'width': 1280, 'height': 800})
        page.goto('http://127.0.0.1:3001/', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/workspace/anping-info/desktop_nav.png', full_page=False)
        print("桌面端截图已保存: /workspace/anping-info/desktop_nav.png")
        
        browser.close()
        print("\n测试完成!")

if __name__ == '__main__':
    test_navigation()
