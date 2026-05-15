from playwright.sync_api import sync_playwright

def test_style_consistency():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 测试分类资讯页面
        print("测试分类资讯页面样式...")
        cat_page = browser.new_page(viewport={'width': 1280, 'height': 800})
        cat_page.goto('http://127.0.0.1:3001/categories', timeout=15000)
        cat_page.wait_for_load_state('networkidle')
        cat_page.screenshot(path='/workspace/anping-info/style_categories.png', full_page=False)
        print("分类资讯页面: /workspace/anping-info/style_categories.png")
        
        # 测试分类页面
        print("测试分类页面样式...")
        cat2_page = browser.new_page(viewport={'width': 1280, 'height': 800})
        cat2_page.goto('http://127.0.0.1:3001/category/house', timeout=15000)
        cat2_page.wait_for_load_state('networkidle')
        cat2_page.screenshot(path='/workspace/anping-info/style_category_house.png', full_page=False)
        print("分类页面: /workspace/anping-info/style_category_house.png")
        
        # 测试首页
        print("测试首页样式...")
        home_page = browser.new_page(viewport={'width': 1280, 'height': 800})
        home_page.goto('http://127.0.0.1:3001/', timeout=15000)
        home_page.wait_for_load_state('networkidle')
        home_page.screenshot(path='/workspace/anping-info/style_home.png', full_page=False)
        print("首页: /workspace/anping-info/style_home.png")
        
        browser.close()
        print("\n✅ 样式对比截图完成!")

if __name__ == '__main__':
    test_style_consistency()
