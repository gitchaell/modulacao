import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 3000})
        await page.goto('http://localhost:4321', wait_until='networkidle')
        await page.wait_for_timeout(2000) # Wait for images/animations
        await page.screenshot(path='/tmp/home_current.png', full_page=True)
        await browser.close()

asyncio.run(main())
