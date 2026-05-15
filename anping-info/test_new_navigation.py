from playwright.sync_api import sync_playwright

def test_new_navigation():
    with sync_playwright() as p:
        # 测试桌面端
        print("测试桌面端视图...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        
        response = page.goto('http://127.0.0.1:3001/', timeout=15000)
        print(f"状态码: {response.status}")
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        
        # 截图桌面端
        page.screenshot(path='/workspace/anping-info/desktop_new_nav.png', full_page=False)
        print("桌面端截图已保存: /workspace/anping-info/desktop_new_nav.png")
        
        # 检查顶部条幅
        banner = page.locator('.hidden.md\\:block.bg-gradient-to-r')
        if banner.count() > 0:
            print("✅ Web端顶部条幅广告已显示")
        else:
            print("❌ Web端顶部条幅广告未显示")
        
        # 检查顶部导航
        nav = page.locator('nav.hidden.md\\:block')
        if nav.count() > 0:
            print("✅ 桌面端顶部导航已显示")
        else:
            print("❌ 桌面端顶部导航未显示")
        
        browser.close()
        
        # 测试移动端
        print("\n测试移动端视图...")
        page2 = browser.new_page(viewport={'width': 375, 'height': 667})
        page2.goto('http://127.0.0.1:3001/', timeout=15000)
        page2.wait_for_load_state('networkidle')
        page2.wait_for_timeout(2000)
        
        # 截图移动端
        page2.screenshot(path='/workspace/anping-info/mobile_new_nav.png', full_page=False)
        print("移动端截图已保存: /workspace/anping-info/mobile_new_nav.png")
        
        # 检查底部导航
        bottom_nav = page2.locator('nav.fixed.bottom-0')
        if bottom_nav.count() > 0:
            print("✅ 移动端底部导航已显示")
        else:
            print("❌ 移动端底部导航未显示")
        
        # 检查顶部条幅是否隐藏
        banner_mobile = page2.locator('.hidden.md\\:block')
        if banner_mobile.count() == 0:
            print("✅ Web端顶部条幅在移动端已隐藏")
        else:
            print("❌ Web端顶部条幅在移动端未隐藏")
        
        browser.close()
        print("\n测试完成!")

if __name__ == '__main__':
    test_new_navigation()
