from playwright.sync_api import sync_playwright

def test_mobile():
    print("测试移动端视图...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 375, 'height': 667})
        page.goto('http://127.0.0.1:3001/', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        
        # 截图移动端
        page.screenshot(path='/workspace/anping-info/mobile_new_nav.png', full_page=False)
        print("移动端截图已保存: /workspace/anping-info/mobile_new_nav.png")
        
        # 检查底部导航
        bottom_nav = page.locator('nav.fixed.bottom-0')
        if bottom_nav.count() > 0:
            print("✅ 移动端底部导航已显示")
        else:
            print("❌ 移动端底部导航未显示")
        
        browser.close()
        print("移动端测试完成!")

if __name__ == '__main__':
    test_mobile()
