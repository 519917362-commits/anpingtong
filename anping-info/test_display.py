from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 访问首页
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    
    # 截图
    page.screenshot(path='/tmp/homepage.png', full_page=True)
    print("首页截图已保存: /tmp/homepage.png")
    
    # 检查页面标题
    title = page.title()
    print(f"页面标题: {title}")
    
    # 检查招聘求职分类
    job_section = page.locator('text=招聘求职').first
    if job_section:
        print("✓ 找到招聘求职分类")
    
    # 截图招聘求职分类下的数据
    print("\n等待数据加载...")
    page.wait_for_timeout(2000)
    page.screenshot(path='/tmp/homepage_with_data.png', full_page=True)
    
    browser.close()
    print("\n完成!")
