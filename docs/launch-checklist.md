# Production Launch & Regulatory Compliance Checklist

Prior to production domain deployment, verify each checklist item:

## 1. Centralized Business Information Verification
- [ ] Verify legal trade registration name at Office of Company Registrar or Lalitpur Metropolitan City Ward Office.
- [ ] Confirm official permanent business address, room/floor, and commercial complex name in Pulchowk/Kumaripati.
- [ ] Replace placeholder telephone number (`+977-1-554XXXX`) with active PSTN landline.
- [ ] Replace placeholder WhatsApp mobile number (`+977-98XXXXXXXX`) with verified business WhatsApp line.
- [ ] Verify corporate domain email (`info@lalitpurfinancial.com.np`) MX and SPF/DKIM records.
- [ ] Confirm working hours (standard Sun-Fri 9:00 AM - 6:00 PM NPT).

## 2. Professional Credentials & Regulatory Boundaries
- [ ] Verify individual founder / consultant academic and professional credentials (e.g. MBA, CFA, ICAN registration if applicable).
- [ ] Review Statutory Disclaimer on `/disclaimer/` to confirm strict compliance with Institute of Chartered Accountants of Nepal (ICAN) regulations prohibiting non-licensed firms from holding themselves out as statutory auditors.
- [ ] Confirm no claims guarantee investment returns, stock market (NEPSE) gains, or tax eradication.
- [ ] Review all references to the Inland Revenue Department (IRD) to ensure ongoing alignment with latest Finance Act provisions.

## 3. Technical & SEO Verification
- [ ] Confirm XML Sitemap at `/sitemap.xml` contains all 48+ URLs with status 200 OK.
- [ ] Check `robots.txt` directives permit indexing across major search engines.
- [ ] Verify Schema.org JSON-LD structured data via Google Rich Results Test for Organization, Service, Article, and Breadcrumbs.
- [ ] Verify canonical URLs match final production HTTPS host.
- [ ] Test form submission endpoint with live SMTP/Email webhook service.
- [ ] Verify cross-browser rendering in Google Chrome, Microsoft Edge, Safari, and mobile viewports.
- [ ] Audit accessibility: ensure keyboard navigation tab orders, visible focus states, and aria-labels on interactive calculators.