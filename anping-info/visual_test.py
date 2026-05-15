from playwright.sync_api import sync_playwright

def visual_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 测试桌面端
        print("\n📸 桌面端截图...")
        desktop = browser.new_page(viewport={'width': 1280, 'height': 800})
        desktop.goto('http://127.0.0.1:3001/', timeout=15000)
        desktop.wait_for_load_state('networkidle')
        desktop.wait_for_timeout(1000)
        desktop.screenshot(path='/workspace/anping-info/desktop_final.png', full_page=False)
        print("桌面端截图: /workspace/anping-info/desktop_final.png")
        
        # 测试移动端
        print("\n📸 移动端截图...")
        mobile = browser.new_page(viewport={'width': 375, 'height': 667})
        mobile.goto('http://127.0.0.1:3001/', timeout=15000)
        mobile.wait_for_load_state('networkidle')
        mobile.wait_for_timeout(1000)
        mobile.screenshot(path='/workspace/anping-info/mobile_final.png', full_page=False)
        print("移动端截图: /workspace/anping-info/mobile_final.png")
        
        browser.close()
        print("\n✅ 截图完成!")

if __name__ == '__main__':
    visual_test()
