from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)

    # 检查全站置顶区域的详细内容
    top_section = page.locator('text=全站置顶').first
    if top_section.is_visible():
        # 找到包含全站置顶的父容器
        parent_container = top_section.locator('xpath=ancestor::div[contains(@class, "rounded-2xl")]').first
        if parent_container.count() > 0:
            print("✓ 全站置顶卡片容器已找到")
            # 检查内部链接数量
            links = parent_container.locator('a').all()
            print(f"  卡片内链接数量: {len(links)}")

            # 检查是否有图片
            imgs = parent_container.locator('img').all()
            print(f"  卡片内图片数量: {len(imgs)}")

            # 获取卡片部分的内容
            card_html = parent_container.inner_html()
            print(f"\n卡片HTML长度: {len(card_html)}")

            # 如果图片数量少，打印链接文本
            if len(links) > 0:
                print("\n前3个链接的文本:")
                for i, link in enumerate(links[:3]):
                    try:
                        text = link.inner_text()
                        print(f"  {i+1}. {text[:50]}")
                    except:
                        print(f"  {i+1}. (无法获取文本)")

    # 截图显示区域
    page.screenshot(path='/tmp/top_section.png', full_page=False)

    print("\n✓ 已保存顶部截图到 /tmp/top_section.png")

    browser.close()
