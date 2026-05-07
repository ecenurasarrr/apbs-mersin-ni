import os
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        screenshots_dir = "screenshots"
        os.makedirs(screenshots_dir, exist_ok=True)
        
        print(">> Navigating to /giris")
        page.goto("http://localhost:3000/giris")
        page.wait_for_load_state("networkidle")
        
        print(">> Logging in...")
        try:
            # Click Kurumsal Giriş or similar
            page.click("button:has-text('Kurumsal Giriş'), button:has-text('Kurumsal')")
            page.wait_for_timeout(1000)
            
            # Fill form
            page.fill("input[type='email'], input[type='text'], input[name='username']", "test@test.com")
            page.fill("input[type='password']", "password")
            page.click("button:has-text('Oturum Aç'), button:has-text('Giriş Yap'), button:has-text('Devam')")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(2000)
        except Exception as e:
            print("Login step skipped or failed:", e)
            
        print(">> Navigating to /akademik-calismalar/tezlerim")
        page.goto("http://localhost:3000/akademik-calismalar/tezlerim")
        page.wait_for_load_state("networkidle")
        
        page.screenshot(path=f"{screenshots_dir}/tezlerim_before.png")
        
        print(">> Clicking Add/Ekle")
        try:
            page.evaluate("""() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const btn = btns.find(b => b.textContent.includes('Ekle') || b.textContent.includes('+') || b.textContent.includes('Yeni'));
                if(btn) btn.click();
            }""")
        except Exception as e:
            print("Add button error:", e)
        
        page.wait_for_timeout(2000)
        
        print(">> Filling form")
        try:
            # Type random values into all inputs
            page.evaluate("""() => {
                const textInputs = document.querySelectorAll('input[type="text"]');
                textInputs.forEach((input, i) => {
                    input.value = 'AI Test ' + i;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }""")
        except Exception as e:
            print("Form filling error:", e)
            
        page.wait_for_timeout(1000)
        print(">> Clicking Save/Kaydet")
        try:
            page.evaluate("""() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const btn = btns.find(b => b.textContent.includes('Kaydet') || b.textContent.includes('Save'));
                if(btn) btn.click();
            }""")
        except Exception as e:
            print("Save button error:", e)
            
        print(">> Waiting for response...")
        # Wait until network is idle (API response completes)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)
        
        print(">> Taking post-add screenshot")
        page.screenshot(path=f"{screenshots_dir}/tezlerim_after.png")
        print(">> Process completed successfully.")
        
        browser.close()

if __name__ == "__main__":
    run()
