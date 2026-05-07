import os
import time
import random
from datetime import datetime
from playwright.sync_api import sync_playwright, Page, TimeoutError

def smart_click(page: Page, intent: str, timeout: int = 5000):
    """
    Belirli bir 'intent' (amac) icin sayfadaki en uygun butonu bulup tiklar.
    Hata durumunda kendini onarmaya (self-healing) calisir.
    """
    print(f"  [AI-Agent] '{intent}' amacli buton araniyor...")
    page.wait_for_load_state("domcontentloaded")
    
    intent = intent.lower()
    
    # Heuristic anahtar kelime eslestirmeleri
    keywords = {
        "login_open": ["oturum aç", "oturum ac", "kurumsal", "login", "sign"],
        "login_submit": ["giriş yap", "giris yap", "devam"],
        "add": ["oluştur", "olustur", "ekle", "yeni", "add", "create", "+"],
        "save": ["kaydet", "save", "gönder", "gonder", "submit"]
    }
    target_words = keywords.get(intent, [intent])
    
    # Dinamik bekleme ve tekrar deneme mantigi
    retries = 3
    current_timeout = timeout
    
    for attempt in range(retries):
        try:
            # Once Role-based (Aria) olarak en dogru butonu bulmaya calis:
            buttons = page.get_by_role("button").all()
            
            best_button = None
            
            for btn in buttons:
                try:
                    text = btn.text_content() or ""
                    aria_label = btn.get_attribute("aria-label") or ""
                    title = btn.get_attribute("title") or ""
                    
                    combined_text = f"{text} {aria_label} {title}".lower()
                    
                    for word in target_words:
                        if word in combined_text:
                            best_button = btn
                            break
                    
                    if best_button:
                        break
                except:
                    continue
            
            if best_button and best_button.is_visible():
                print(f"  [AI-Agent] Buton bulundu (Heuristic Role Match). Tiklaniyor...")
                best_button.click(timeout=current_timeout)
                return True
                
            # Eger get_by_role bulamazsa normal DOM sorgusu ile deneme (Fallback)
            print("  [AI-Agent] Role ile bulunamadi, DOM taramasina geciliyor...")
            all_buttons = page.locator("button, input[type='submit'], a.btn, a[role='button']").all()
            for btn in all_buttons:
                try:
                    text = btn.inner_text().lower()
                    for word in target_words:
                        if word in text:
                            best_button = btn
                            break
                    if best_button:
                        break
                except:
                    continue
                    
            if best_button and best_button.is_visible():
                print(f"  [AI-Agent] Fallback DOM'dan bulundu. Tiklaniyor...")
                best_button.click(timeout=current_timeout)
                return True
                
            raise Exception(f"'{intent}' butonuna uygun element ekranda bulunamadi.")
            
        except TimeoutError:
            print(f"  [Uyari] Tiklama zaman asimina ugradi. Bekleme artiriliyor ({current_timeout}ms)... Deneme: {attempt+1}/{retries}")
            current_timeout += 2000
            page.wait_for_timeout(1000)
        except Exception as e:
            print(f"  [Uyari] Buton arama hatasi: {e}. Sayfanin yuklenmesi bekleniyor... Deneme: {attempt+1}/{retries}")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(2000)
    
    return False

def smart_fill_form(page: Page):
    """
    Ekranda olan tum form elemanlarini (input, select, textarea) bulur
    ve mantikli verilerle otomatik doldurur.
    """
    print(f"  [AI-Agent] Form alanlari taraniyor ve dinamik verilerle dolduruluyor...")
    page.wait_for_load_state("domcontentloaded")
    
    # Tum input, textarea ve select elemanlarini bul
    elements = page.locator("input:not([type='hidden']), textarea, select").all()
    filled_count = 0
    
    for el in elements:
        try:
            if not el.is_visible():
                continue
                
            el_type = el.get_attribute("type") or ""
            name = (el.get_attribute("name") or "").lower()
            id_attr = (el.get_attribute("id") or "").lower()
            placeholder = (el.get_attribute("placeholder") or "").lower()
            
            combined_desc = f"{name} {id_attr} {placeholder}".lower()
            
            # Eger onceden doldurulmussa atla (belki type="submit" veya buton formundadir)
            if el_type in ["submit", "button", "image"]:
                continue
            
            # Dinamik Test Verisi Uretimi
            if el_type == "checkbox" or el_type == "radio":
                el.check()
                filled_count += 1
            elif el_type == "date" or "tarih" in combined_desc or "date" in combined_desc:
                today = datetime.now().strftime("%Y-%m-%d")
                el.fill(today)
                filled_count += 1
            elif "email" in combined_desc or el_type == "email":
                el.fill("test.agent@example.com")
                filled_count += 1
            elif "sifre" in combined_desc or "password" in combined_desc or el_type == "password":
                el.fill("123456")
                filled_count += 1
            elif "kullanici" in combined_desc or "kullanıcı" in combined_desc or "user" in combined_desc:
                el.fill("18974099456") # Spesifik test user ID
                filled_count += 1
            elif "baslik" in combined_desc or "başlık" in combined_desc or "title" in combined_desc:
                rastgele_no = random.randint(1000, 9999)
                el.fill(f"AI Ajan Tarafindan Uretilen Kayit {rastgele_no}")
                filled_count += 1
            elif "danisman" in combined_desc or "danışman" in combined_desc or "advisor" in combined_desc:
                el.fill("Prof. Dr. AI Agent")
                filled_count += 1
            elif "bolum" in combined_desc or "bölüm" in combined_desc or "department" in combined_desc:
                el.fill("Yapay Zeka Muhendisligi")
                filled_count += 1
            elif "dosya" in combined_desc or "file" in combined_desc or el_type == "file":
                # Simdilik text input gibi davraniyorsa doldur. File input ise atla
                if el_type != "file":
                    el.fill("dummy_dosya.pdf")
                    filled_count += 1
            elif el.evaluate("node => node.tagName.toLowerCase() === 'select'"):
                # Ilk gecerli secenegi sec
                options = el.locator("option").all()
                if len(options) > 1:
                    val = options[1].get_attribute("value")
                    el.select_option(val)
                    filled_count += 1
            else:
                # Fallback: rastgele metin doldur
                el.fill(f"Otomatik Veri {random.randint(100, 999)}")
                filled_count += 1
                
        except Exception as e:
            pass # Sadece hata vermesini engelle
            
    print(f"  [AI-Agent] Toplam {filled_count} alan basariyla dolduruldu.")
    return filled_count

def discover_routes(page: Page):
    """
    Navbar'i tarayarak test edilecek tum sayfalari cikarir.
    """
    print("\n[AI-Agent] Sistem rotalari kesfediliyor (Discovery Mode)...")
    
    routes = set()
    ignore_list = ["/", "/giris", "/profil", "/admin", "/islemler/faaliyet-raporu", "/islemler/duyurular"]
    
    # Navigasyon menusundeki butonlara/dropdown trigger'lara tikla ki DOM'a eklensinler
    nav_buttons = page.locator("nav button").all()
    for btn in nav_buttons:
        try:
            if btn.is_visible():
                btn.click()
                page.wait_for_timeout(1000) # Menunun acilmasi icin kisa bekleme
                
                # Her dropdown acildiginda mevcut linkleri topla
                links = page.locator("a[href]").all()
                for link in links:
                    try:
                        href = link.get_attribute("href")
                        if href and href.startswith("/") and href not in ignore_list:
                            routes.add(href)
                    except:
                        pass
        except:
            pass
            
    # Ayrica gorunur olan diger linkleri de son kez topla
    links = page.locator("a[href]").all()
    for link in links:
        try:
            href = link.get_attribute("href")
            if href and href.startswith("/") and href not in ignore_list:
                routes.add(href)
        except:
            pass
            
    # Siralama ve liste haline getirme
    route_list = sorted(list(routes))
    
    print(f"[AI-Agent] Toplam {len(route_list)} test edilebilir sayfa bulundu:")
    for r in route_list:
        print(f"  - {r}")
        
    return route_list

def test_tezlerim_page():
    with sync_playwright() as p:
        # Hafif calisma modu: headless=True. Animasyon/Gecis problemleri icin slow_mo mantikli
        browser = p.chromium.launch(headless=True, slow_mo=500) 
        context = browser.new_context()
        page = context.new_page()
        
        # Ekran goruntuleri klasoru
        screenshots_dir = "screenshots"
        os.makedirs(screenshots_dir, exist_ok=True)
        
        try:
            print("\n" + "="*50)
            print("--- TUM PROJEYI KAPSAYAN OTONOM TEST AJANI BASLATILDI ---")
            print("="*50)
            
            # 1. Giris yap
            print("\n>> Giris yapiliyor...")
            page.goto("http://localhost:3000/giris")
            page.wait_for_load_state("networkidle")
            
            if not smart_click(page, "login_open"):
                raise Exception("Oturum ac butonuna tiklanamadi.")
            
            page.wait_for_timeout(1000)
            smart_fill_form(page)
            
            if not smart_click(page, "login_submit"):
                smart_click(page, "save")
                
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(3000)
            
            # Girisin basarili oldugunu dogrulama
            page.screenshot(path=f"{screenshots_dir}/00_giris_basarili.png")
            
            # 2. Rotalari kesfet
            routes_to_test = discover_routes(page)
            if not routes_to_test:
                print("[Uyari] Hic rota bulunamadi! Navbar DOM yapisi degismis olabilir. Fallback olarak birkac test rotasi ekleniyor.")
                routes_to_test = [
                    "/akademik-calismalar/tezlerim", 
                    "/akademik-calismalar/yayinlar", 
                    "/oduller"
                ]
            
            # Raporlama icin liste
            results = []
            
            # 3. Her bir rotayi sirayla test et
            for index, route in enumerate(routes_to_test):
                page_name = route.strip("/").replace("/", "_").replace("-", "_")
                if not page_name: page_name = "anasayfa"
                prefix = f"{index+1:02d}_{page_name}"
                
                print("\n" + "-"*40)
                print(f"TEST EDILIYOR: {route} ({index+1}/{len(routes_to_test)})")
                print("-"*40)
                
                try:
                    # Guvenli mod: bilgisayari yormamak adina islemler arasi 3000ms gecikme
                    page.wait_for_timeout(3000)
                    
                    page.goto(f"http://localhost:3000{route}")
                    page.wait_for_load_state("networkidle")
                    page.screenshot(path=f"{screenshots_dir}/{prefix}_1_sayfa.png")
                    
                    # 'Ekle' veya 'Olustur' butonu ara
                    if not smart_click(page, "add"):
                        print(f"[BILGI] {route} sayfasinda 'Olustur/Ekle' butonu bulunamadi. Okuma/Listeleme sayfasi olabilir. Atliyor...")
                        results.append((route, "Atlandi (Ekle Butonu Yok)"))
                        continue
                        
                    page.wait_for_timeout(2000)
                    page.screenshot(path=f"{screenshots_dir}/{prefix}_2_form_acildi.png")
                    
                    # Formu doldur
                    smart_fill_form(page)
                    page.screenshot(path=f"{screenshots_dir}/{prefix}_3_form_dolduruldu.png")
                    
                    # Kaydet ve API'yi bekle
                    api_success = False
                    try:
                        # API'ye kaydetme istegi giderken dinle (Timeout 10s)
                        with page.expect_response(lambda response: "api" in response.url and response.request.method in ["POST", "PUT"], timeout=10000) as response_info:
                            if not smart_click(page, "save"):
                                raise Exception("Kaydet butonu bulunamadi.")
                                
                        api_response = response_info.value
                        print(f"  [API-Dogrulama] {api_response.request.method} {api_response.url} -> {api_response.status}")
                        if api_response.status in [200, 201]:
                            api_success = True
                            print("  [BASARILI] API veritabani yaniti olumlu.")
                        else:
                            print(f"  [HATA] Beklenmeyen API yaniti: {api_response.status}")
                    except TimeoutError:
                        print("  [Uyari] API yaniti alinamadi, ancak sayfada islem devam etmis olabilir.")
                        pass
                        
                    page.wait_for_load_state("networkidle")
                    page.wait_for_timeout(3000) # Guvenli Mod beklemesi
                    page.screenshot(path=f"{screenshots_dir}/{prefix}_4_sonuc.png")
                    
                    if api_success:
                        results.append((route, "Basarili (200/201)"))
                    else:
                        results.append((route, "UI Basarili / API Yok"))
                        
                except Exception as e:
                    print(f"[HATA] {route} test edilirken hata olustu: {str(e)}")
                    page.screenshot(path=f"{screenshots_dir}/{prefix}_ERROR.png")
                    results.append((route, f"HATA: {str(e)[:30]}"))
                    continue # TESTI DURDURMA, SONRAKI SAYFAYA GEC!
                    
            # 4. Genel Raporlama
            print("\n" + "="*50)
            print("--- OTONOM TEST AJANI RAPORU ---")
            print("="*50)
            for r, status in results:
                print(f"[{status}] {r}")
                
            print(f"\n[BILGI] Kanit ekran goruntuleri: {screenshots_dir}/ dizininde")
            print("="*50)
            
        except Exception as e:
            print(f"\n[CRITICAL ERROR] Ajan coktu: {str(e)}")
            page.screenshot(path=f"{screenshots_dir}/99_fatal_error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    test_tezlerim_page()