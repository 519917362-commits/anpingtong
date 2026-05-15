from playwright.sync_api import sync_playwright
import sys

def comprehensive_test():
    results = {
        'passed': [],
        'failed': [],
        'warnings': []
    }

    def log_pass(msg):
        print(f"✅ {msg}")
        results['passed'].append(msg)

    def log_fail(msg):
        print(f"❌ {msg}")
        results['failed'].append(msg)

    def log_warn(msg):
        print(f"⚠️ {msg}")
        results['warnings'].append(msg)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ===== 桌面端测试 =====
        print("\n" + "="*60)
        print("📱 桌面端测试 (1280x800)")
        print("="*60)
        
        desktop_page = browser.new_page(viewport={'width': 1280, 'height': 800})
        
        # 1. 测试首页加载
        print("\n1️⃣ 首页加载测试")
        try:
            response = desktop_page.goto('http://127.0.0.1:3001/', timeout=15000)
            desktop_page.wait_for_load_state('networkidle')
            
            if response.status == 200:
                log_pass(f"首页加载成功 (状态码: {response.status})")
            else:
                log_fail(f"首页加载失败 (状态码: {response.status})")
            
            # 检查页面标题
            title = desktop_page.title()
            if "安平同城" in title:
                log_pass(f"页面标题正确: {title}")
            else:
                log_fail(f"页面标题异常: {title}")
            
            # 检查顶部条幅广告
            banner = desktop_page.locator('.bg-gradient-to-r.from-blue-600')
            if banner.count() > 0:
                log_pass("桌面端顶部蓝色条幅广告已显示")
            else:
                log_fail("桌面端顶部蓝色条幅广告未显示")
            
            # 检查顶部导航
            nav = desktop_page.locator('nav.hidden.md\\:block').first
            if nav.count() > 0:
                log_pass("桌面端顶部导航已显示")
            else:
                log_fail("桌面端顶部导航未显示")
                
        except Exception as e:
            log_fail(f"首页加载异常: {e}")
        
        # 2. 测试分类资讯页面
        print("\n2️⃣ 分类资讯页面测试")
        try:
            desktop_page.goto('http://127.0.0.1:3001/categories', timeout=15000)
            desktop_page.wait_for_load_state('networkidle')
            
            # 检查分类列表
            category_links = desktop_page.locator('a[href^="/category/"]')
            count = category_links.count()
            if count > 10:
                log_pass(f"分类列表显示正常 ({count}个分类)")
            else:
                log_warn(f"分类数量较少 ({count}个)")
            
            # 检查页面标题
            h1 = desktop_page.locator('h1').first
            if h1.count() > 0 and "分类" in h1.text_content():
                log_pass("分类页面标题正确")
            else:
                log_fail("分类页面标题异常")
                
        except Exception as e:
            log_fail(f"分类页面异常: {e}")
        
        # 3. 测试丝网产业页面
        print("\n3️⃣ 丝网产业页面测试")
        try:
            desktop_page.goto('http://127.0.0.1:3001/tools/wiremesh', timeout=15000)
            desktop_page.wait_for_load_state('networkidle')
            
            # 检查页面是否加载
            content = desktop_page.content()
            if len(content) > 1000:
                log_pass("丝网产业页面加载正常")
            else:
                log_fail("丝网产业页面内容异常")
                
        except Exception as e:
            log_fail(f"丝网产业页面异常: {e}")
        
        # 4. 测试同城商家页面
        print("\n4️⃣ 同城商家页面测试")
        try:
            desktop_page.goto('http://127.0.0.1:3001/companies', timeout=15000)
            desktop_page.wait_for_load_state('networkidle')
            
            content = desktop_page.content()
            if len(content) > 1000:
                log_pass("同城商家页面加载正常")
            else:
                log_fail("同城商家页面内容异常")
                
        except Exception as e:
            log_fail(f"同城商家页面异常: {e}")
        
        # 5. 测试登录页面
        print("\n5️⃣ 登录页面测试")
        try:
            desktop_page.goto('http://127.0.0.1:3001/login', timeout=15000)
            desktop_page.wait_for_load_state('networkidle')
            
            # 检查登录表单
            username_input = desktop_page.locator('input[type="text"], input[placeholder*="用户"], input[placeholder*="账号"]')
            password_input = desktop_page.locator('input[type="password"]')
            
            if username_input.count() > 0 and password_input.count() > 0:
                log_pass("登录表单元素完整")
            else:
                log_fail("登录表单元素缺失")
                
        except Exception as e:
            log_fail(f"登录页面异常: {e}")
        
        # 6. 测试底部导航在桌面端隐藏
        print("\n6️⃣ 桌面端底部导航隐藏测试")
        try:
            # 使用更精确的选择器
            bottom_nav = desktop_page.locator('nav[class*="bottom-0"]')
            count = bottom_nav.count()
            if count == 0:
                log_pass("桌面端底部导航已正确隐藏")
            else:
                log_fail("桌面端底部导航未隐藏（应该只在移动端显示）")
        except Exception as e:
            log_fail(f"桌面端导航检测异常: {e}")
        
        desktop_page.close()
        
        # ===== 移动端测试 =====
        print("\n" + "="*60)
        print("📱 移动端测试 (375x667)")
        print("="*60)
        
        mobile_page = browser.new_page(viewport={'width': 375, 'height': 667})
        
        # 1. 测试移动端首页
        print("\n1️⃣ 移动端首页加载测试")
        try:
            response = mobile_page.goto('http://127.0.0.1:3001/', timeout=15000)
            mobile_page.wait_for_load_state('networkidle')
            
            if response.status == 200:
                log_pass(f"移动端首页加载成功")
            else:
                log_fail(f"移动端首页加载失败")
            
            # 检查顶部条幅广告是否隐藏
            banner = mobile_page.locator('.bg-gradient-to-r.from-blue-600')
            if banner.count() == 0:
                log_pass("移动端顶部条幅广告已正确隐藏")
            else:
                log_fail("移动端顶部条幅广告未隐藏")
            
            # 检查底部导航
            bottom_nav = mobile_page.locator('nav.fixed.bottom-0')
            if bottom_nav.count() > 0:
                log_pass("移动端底部导航已显示")
            else:
                log_fail("移动端底部导航未显示")
                
        except Exception as e:
            log_fail(f"移动端首页异常: {e}")
        
        # 2. 测试移动端分类页面
        print("\n2️⃣ 移动端分类页面测试")
        try:
            mobile_page.goto('http://127.0.0.1:3001/categories', timeout=15000)
            mobile_page.wait_for_load_state('networkidle')
            
            category_links = mobile_page.locator('a[href^="/category/"]')
            count = category_links.count()
            if count > 10:
                log_pass(f"移动端分类列表正常 ({count}个)")
            else:
                log_warn(f"移动端分类数量较少 ({count}个)")
                
        except Exception as e:
            log_fail(f"移动端分类页面异常: {e}")
        
        # 3. 测试移动端登录页面
        print("\n3️⃣ 移动端登录页面测试")
        try:
            mobile_page.goto('http://127.0.0.1:3001/login', timeout=15000)
            mobile_page.wait_for_load_state('networkidle')
            
            # 检查登录按钮
            login_btn = mobile_page.locator('button[type="submit"]')
            if login_btn.count() > 0:
                log_pass("移动端登录按钮存在")
            else:
                log_fail("移动端登录按钮缺失")
                
        except Exception as e:
            log_fail(f"移动端登录页面异常: {e}")
        
        # 4. 测试移动端底部导航项
        print("\n4️⃣ 移动端底部导航项测试")
        try:
            nav_items = mobile_page.locator('nav.fixed.bottom-0 a')
            item_count = nav_items.count()
            if item_count >= 4:
                log_pass(f"移动端底部导航项完整 ({item_count}个)")
            else:
                log_warn(f"移动端底部导航项较少 ({item_count}个)")
            
            # 检查导航项文字
            nav_texts = [item.text_content() for item in nav_items]
            expected = ['首页', '丝网产业', '分类资讯', '我的']
            for exp in expected:
                if any(exp in text for text in nav_texts):
                    log_pass(f"导航项 '{exp}' 存在")
                else:
                    log_warn(f"导航项 '{exp}' 未找到")
                    
        except Exception as e:
            log_fail(f"移动端导航检测异常: {e}")
        
        mobile_page.close()
        
        # ===== API接口测试 =====
        print("\n" + "="*60)
        print("🔌 API接口测试")
        print("="*60)
        
        api_page = browser.new_page()
        
        # 1. 测试帖子列表API
        print("\n1️⃣ 帖子列表API测试")
        try:
            response = api_page.goto('http://127.0.0.1:3001/api/posts?pageSize=5', timeout=10000)
            if response.status == 200:
                data = response.json()
                if data.get('code') == 200:
                    posts = data.get('data', {}).get('list', [])
                    total = data.get('data', {}).get('total', 0)
                    log_pass(f"帖子API正常 (总数: {total}, 返回: {len(posts)}条)")
                else:
                    log_fail(f"帖子API返回异常: {data}")
            else:
                log_fail(f"帖子API失败 (状态码: {response.status})")
        except Exception as e:
            log_fail(f"帖子API异常: {e}")
        
        # 2. 测试分类API
        print("\n2️⃣ 分类API测试")
        try:
            response = api_page.goto('http://127.0.0.1:3001/api/posts?category=house&pageSize=1', timeout=10000)
            if response.status == 200:
                data = response.json()
                if data.get('code') == 200:
                    log_pass("分类API正常")
                else:
                    log_fail(f"分类API返回异常")
        except Exception as e:
            log_fail(f"分类API异常: {e}")
        
        # 3. 测试Banner API
        print("\n3️⃣ Banner API测试")
        try:
            response = api_page.goto('http://127.0.0.1:3001/api/banners', timeout=10000)
            if response.status == 200:
                data = response.json()
                if data.get('code') == 200:
                    banners = data.get('data', [])
                    log_pass(f"Banner API正常 ({len(banners)}个Banner)")
                else:
                    log_warn("Banner API返回格式异常")
        except Exception as e:
            log_fail(f"Banner API异常: {e}")
        
        # 4. 测试公告API
        print("\n4️⃣ 公告API测试")
        try:
            response = api_page.goto('http://127.0.0.1:3001/api/notices?pageSize=1', timeout=10000)
            if response.status == 200:
                log_pass("公告API正常")
        except Exception as e:
            log_fail(f"公告API异常: {e}")
        
        api_page.close()
        browser.close()
        
        # ===== 测试总结 =====
        print("\n" + "="*60)
        print("📊 测试总结")
        print("="*60)
        print(f"\n✅ 通过: {len(results['passed'])} 项")
        print(f"❌ 失败: {len(results['failed'])} 项")
        print(f"⚠️ 警告: {len(results['warnings'])} 项")
        
        if results['warnings']:
            print("\n⚠️ 警告详情:")
            for warn in results['warnings']:
                print(f"  - {warn}")
        
        if results['failed']:
            print("\n❌ 失败详情:")
            for fail in results['failed']:
                print(f"  - {fail}")
            return False
        
        return True

if __name__ == '__main__':
    success = comprehensive_test()
    sys.exit(0 if success else 1)
