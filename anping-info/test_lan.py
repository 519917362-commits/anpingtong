from playwright.sync_api import sync_playwright

def test_lan():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 测试局域网地址
        lan_url = 'http://10.29.36.109:5173'
        print(f"测试局域网地址: {lan_url}")
        
        try:
            page = browser.new_page()
            page.on('console', lambda msg: print(f"[{msg.type}] {msg.text}"))
            response = page.goto(lan_url, timeout=15000)
            print(f"状态码: {response.status}")
            page.wait_for_load_state('networkidle', timeout=10000)
            title = page.title()
            print(f"页面标题: {title}")
            page.screenshot(path='/workspace/anping-info/lan_test.png')
            print("截图已保存: /workspace/anping-info/lan_test.png")
            page.close()
        except Exception as e:
            print(f"错误: {e}")
        
        browser.close()

if __name__ == '__main__':
    test_lan()
