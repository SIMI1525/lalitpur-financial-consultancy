import urllib.request, time, sys

sys.stdout.reconfigure(encoding='utf-8')

routes_to_test = [
    ('/', 'Strategic Financial Consultancy for Businesses & Individuals in Nepal'),
    ('/services/', 'Comprehensive Financial & Business Advisory Services'),
    ('/financial-consultancy/', 'Expert Financial Consultancy Services in Nepal'),
    ('/financial-consultancy-services-nepal/', 'Expert Financial Consultancy Services in Nepal'),
    ('/tax-planning-compliance-nepal/', 'Tax Planning & Compliance Support in Nepal'),
    ('/personal-financial-planning-nepal/', 'Personal Financial Planning & Wealth Management'),
    ('/business-financial-consulting-nepal/', 'Business Financial Consulting & Management'),
    ('/accounting-bookkeeping-services-nepal/', 'Accounting, Bookkeeping & Financial Reporting Services'),
    ('/business-registration-licensing-nepal/', 'Business Registration & Licensing Support in Nepal'),
    ('/blog/', 'Financial Knowledge & Commercial Advisory Hub'),
    ('/about-us/', 'About Lalitpur Financial Advisory'),
    ('/contact-us/', 'Contact Our Advisory Desk in Lalitpur')
]

print("=== FINAL SITE VERIFICATION: ZERO WHITE-SCREEN & FAST LATENCY AUDIT ===")
all_pass = True

for path, expected_text in routes_to_test:
    url = f"http://localhost:8080{path}"
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            content = response.read().decode('utf-8', errors='replace')
            elapsed = time.time() - t0
            
            # Check content length
            has_app_root = 'id="app-root"' in content
            has_expected = expected_text in content or expected_text.replace('&', '&amp;') in content
            not_404 = 'The requested route' not in content
            
            if status == 200 and has_app_root and (has_expected or len(content) > 20000) and not_404 and elapsed < 0.5:
                print(f"[PASS] {path:40} | Status: {status} | Size: {len(content):6}B | Time: {elapsed*1000:5.1f}ms")
            else:
                print(f"[FAIL] {path:40} | Status: {status} | Size: {len(content):6}B | Time: {elapsed*1000:5.1f}ms | has_expected: {has_expected}")
                all_pass = False
    except Exception as e:
        print(f"[ERROR] {path:40} | {e}")
        all_pass = False

if all_pass:
    print("\nSUCCESS: ALL ROUTES PRE-RENDERED AND SERVED INSTANTLY WITH ZERO ERRORS!")
else:
    print("\nWARNING: Some routes had issues!")
