# Technical SEO & Structured Data Implementation Guide

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