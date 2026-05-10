from playwright.sync_api import sync_playwright
import sys

def capture_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问页面
        print("正在访问 http://127.0.0.1:3001...")
        try:
            response = page.goto("http://127.0.0.1:3001", timeout=30000)
            print(f"状态码: {response.status}")
            
            # 等待页面加载
            page.wait_for_load_state('networkidle', timeout=10000)
            page.wait_for_timeout(3000)
            
            # 获取页面信息
            title = page.title()
            print(f"页面标题: {title}")
            
            # 截图
            screenshot_path = "/workspace/anping-info/final_screenshot.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"截图已保存: {screenshot_path}")
            
            # 获取页面内容预览
            content = page.content()
            print(f"\n页面内容长度: {len(content)} bytes")
            
            return True
            
        except Exception as e:
            print(f"错误: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            browser.close()

if __name__ == "__main__":
    success = capture_screenshot()
    sys.exit(0 if success else 1)
