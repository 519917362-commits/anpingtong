from playwright.sync_api import sync_playwright

def test_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 测试后端API
        print("测试后端API: http://localhost:3001/")
        try:
            response = page.goto('http://localhost:3001/', timeout=10000)
            print(f"  状态码: {response.status}")
            print(f"  内容长度: {len(response.body())} bytes")
        except Exception as e:
            print(f"  错误: {e}")

        # 测试前端页面
        print("\n测试前端页面: http://localhost:5173/")
        try:
            page2 = browser.new_page()
            response2 = page2.goto('http://localhost:5173/', timeout=10000)
            print(f"  状态码: {response2.status}")
            page2.wait_for_load_state('networkidle', timeout=10000)
            title = page2.title()
            print(f"  页面标题: {title}")

            # 截图
            page2.screenshot(path='/workspace/anping-info/frontend_test.png', full_page=True)
            print(f"  截图已保存")
            page2.close()
        except Exception as e:
            print(f"  错误: {e}")

        browser.close()
        print("\n测试完成!")

if __name__ == '__main__':
    test_page()
