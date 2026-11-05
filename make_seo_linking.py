import os

DOCS_DIR = "lalitpur-financial-consultancy/docs"
os.makedirs(DOCS_DIR, exist_ok=True)

# 1. SEO Implementation
seo_impl = """# Technical SEO & Structured Data Implementation Guide

## 1. Document Head & Metadata Specification
Every page dynamically generates:
- **Title Tag:** Primary Keyword + Brand Identity (Under 60 chars)
- **Meta Description:** Clear benefit, context, and CTR hook (140-160 chars)
- **Canonical URL:** Exact absolute protocol and host
- **Robots Directives:** index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
- **OpenGraph & Twitter:** og:type, og:title, og:description, og:url, og:image, twitter:card

## 2. Schema.org JSON-LD Topology
The SEO Engine (`js/seo-engine.js`) constructs dynamic JSON-LD graphs according to the active route:

### A. Root & Global Entity Graph
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": "https://lalitpurfinancial.com.np/#organization",
      "name": "Lalitpur Financial Advisory",
      "legalName": "Lalitpur Financial Advisory (LFA)",
      "url": "https://lalitpurfinancial.com.np/",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Apex Commercial Complex, 3rd Floor, Pulchowk-Kumaripati Hub",
        "addressLocality": "Lalitpur",
        "addressRegion": "Bagmati Province",
        "postalCode": "44700",
        "addressCountry": "NP"
      },
      "telephone": "+977-1-554XXXX",
      "email": "info@lalitpurfinancial.com.np",
      "priceRange": "$$",
      "areaServed": {
        "@type": "Country",
        "name": "Nepal"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://lalitpurfinancial.com.np/#website",
      "url": "https://lalitpurfinancial.com.np/",
      "name": "Lalitpur Financial Advisory",
      "publisher": {
        "@id": "https://lalitpurfinancial.com.np/#organization"
      }
    }
  ]
}
```

### B. Service Page Graph (Service + BreadcrumbList + FAQPage)
Injected on all 6 commercial landing pages. Defines provider, serviceType, and full FAQPage entities.

### C. Article Page Graph (Article + BreadcrumbList)
Injected on all 30 cluster articles. Specifies headline, description, author, publisher, and dates.

## 3. Visual Semantics & Centerpiece Principles
1. **DOM Order Alignment:** Semantic `<main id="app-root">` with `<article>` and `<section>` tags.
2. **Above-the-Fold Direct Answers:** Immediate 250-400 character answer blocks directly below H1.
3. **No Decorative Bloat:** Avoid uninformative decorative heroes.
4. **WCAG 2.2 AA Contrast & Focus:** Clean focus-visible rings and high contrast color pairings.
"""

with open(f"{DOCS_DIR}/seo-implementation.md", "w", encoding="utf-8") as f:
    f.write(seo_impl.strip())

# 2. Internal Linking Matrix
matrix_content = """# Internal Linking Matrix

The matrix ensures 0 orphaned pages, seamless topical flow, and strategic PageRank distribution toward commercial money pages.

| Source URL | Target URL | Relationship Type | Recommended Anchor Text | Intent Tier |
|---|---|---|---|---|
| `/` (Homepage) | `/financial-consultancy-services-nepal/` | Pillar Main | Financial Consultancy Services in Nepal | Commercial |
| `/` (Homepage) | `/personal-financial-planning-nepal/` | Pillar Main | Personal Financial Planning | Commercial |
| `/` (Homepage) | `/business-financial-consulting-nepal/` | Pillar Main | Business Financial Consulting | Commercial |
| `/` (Homepage) | `/accounting-bookkeeping-services-nepal/` | Pillar Main | Accounting and Bookkeeping Services | Commercial |
| `/` (Homepage) | `/tax-planning-compliance-nepal/` | Pillar Main | Tax Consultancy Services Nepal | Commercial |
| `/` (Homepage) | `/business-registration-licensing-nepal/` | Pillar Main | Business Registration and Licensing | Commercial |
| `/services/` | All 6 Money Pages | Hub to Pillar | [Service Specific Name] | Commercial |
| `/financial-consultancy-services-nepal/` | All 5 Cluster 1 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| `/personal-financial-planning-nepal/` | All 5 Cluster 2 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| `/business-financial-consulting-nepal/` | All 5 Cluster 3 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| `/accounting-bookkeeping-services-nepal/` | All 5 Cluster 4 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| `/tax-planning-compliance-nepal/` | All 5 Cluster 5 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| `/business-registration-licensing-nepal/` | All 5 Cluster 6 Articles | Money to Cluster Resource | [Article Specific Title] | Informational |
| All Cluster 1 Articles | `/financial-consultancy-services-nepal/` | Cluster to Money Page | financial consultancy services in Nepal | Commercial CTA |
| All Cluster 2 Articles | `/personal-financial-planning-nepal/` | Cluster to Money Page | personal financial planning services | Commercial CTA |
| All Cluster 3 Articles | `/business-financial-consulting-nepal/` | Cluster to Money Page | business financial consulting solutions | Commercial CTA |
| All Cluster 4 Articles | `/accounting-bookkeeping-services-nepal/` | Cluster to Money Page | professional accounting and bookkeeping | Commercial CTA |
| All Cluster 5 Articles | `/tax-planning-compliance-nepal/` | Cluster to Money Page | tax planning and compliance support | Commercial CTA |
| All Cluster 6 Articles | `/business-registration-licensing-nepal/` | Cluster to Money Page | business registration and licensing support | Commercial CTA |
| Cross-Cluster: `/blog/why-separate-personal-and-business-finances/` | `/accounting-bookkeeping-services-nepal/` | Conceptual Cross-Link | small business bookkeeping practices | Commercial |
| Cross-Cluster: `/blog/how-to-create-cash-flow-forecast-small-business/` | `/blog/bookkeeping-checklist-small-businesses-nepal/` | Cluster Cross-Link | monthly bookkeeping checklists | Informational |
| Cross-Cluster: `/blog/pan-vs-vat-nepal-differences/` | `/business-registration-licensing-nepal/` | Cluster Cross-Link | company incorporation and tax registration | Commercial |
| Cross-Cluster: `/blog/how-to-register-private-limited-company-nepal/` | `/tax-planning-compliance-nepal/` | Cluster Cross-Link | post-registration tax compliance | Commercial |
"""

with open(f"{DOCS_DIR}/internal-linking-matrix.md", "w", encoding="utf-8") as f:
    f.write(matrix_content.strip())

# 3. Launch Checklist
checklist_content = """# Production Launch & Regulatory Compliance Checklist

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
"""

with open(f"{DOCS_DIR}/launch-checklist.md", "w", encoding="utf-8") as f:
    f.write(checklist_content.strip())

print("seo-implementation.md, internal-linking-matrix.md, and launch-checklist.md written successfully!")
