import os

DOCS_DIR = "lalitpur-financial-consultancy/docs"
os.makedirs(DOCS_DIR, exist_ok=True)

content = """# Information Architecture & User Journey Specification

## 1. Global Navigation Hierarchy

The website follows a 3-tier semantic crawl architecture:

```
[Tier 0: Root]
    Homepage (/)
        |-- [Tier 1: Hubs & Core Money Pages]
        |   |-- Services Hub (/services/)
        |   |   |-- 1. Financial Consultancy Services (/financial-consultancy-services-nepal/)
        |   |   |-- 2. Personal Financial Planning (/personal-financial-planning-nepal/)
        |   |   |-- 3. Business Financial Consulting (/business-financial-consulting-nepal/)
        |   |   |-- 4. Accounting & Bookkeeping Services (/accounting-bookkeeping-services-nepal/)
        |   |   |-- 5. Tax Planning & Compliance Support (/tax-planning-compliance-nepal/)
        |   |   `-- 6. Business Registration & Licensing (/business-registration-licensing-nepal/)
        |   |-- Knowledge & Articles Hub (/blog/)
        |   `-- Primary Trust Hub (/about-us/, /contact-us/)
        |
        |-- [Tier 2: Supporting Topical Clusters (30 Articles)]
        |   |-- Cluster 1: 5 Financial Advisory Articles
        |   |-- Cluster 2: 5 Personal Financial Planning Articles
        |   |-- Cluster 3: 5 Business Financial Consulting Articles
        |   |-- Cluster 4: 5 Accounting & Bookkeeping Articles
        |   |-- Cluster 5: 5 Tax Planning & Compliance Articles
        |   `-- Cluster 6: 5 Business Registration & Licensing Articles
        |
        `-- [Tier 3: Trust, Credibility, and Legal Compliance Pages]
            |-- /office-location/
            |-- /frequently-asked-questions/
            |-- /consultation/
            |-- /privacy-policy/
            |-- /terms-and-conditions/
            |-- /disclaimer/
            |-- /editorial-policy/
            `-- /cookie-policy/
```

## 2. User Journey Funnels

### Funnel A: B2B Business Client (Startup / SME / Enterprise)
1. **Entry Point:** Organic search query on "how to create cash flow forecast small business nepal" or "pan vs vat nepal".
2. **First Interaction:** Direct answer, operational guidelines, and interactive preview widget.
3. **Internal Transition:** Contextual CTA bridge to `/business-financial-consulting-nepal/` or `/tax-planning-compliance-nepal/`.
4. **Commercial Landing:** Lands on the money page and interacts with the Cash-Flow Planning Tool or Tax Readiness Checklist.
5. **Conversion:** Fills out the validated consultation booking form requesting a 30-minute discovery call.

### Funnel B: Individual / Household Wealth Management
1. **Entry Point:** Search query for "how to create a monthly budget in nepal" or "emergency fund savings guide nepal".
2. **First Interaction:** 50/30/20 budget framework adapted for Kathmandu/Lalitpur cost of living.
3. **Interactive Step:** Clicks link to the **Interactive NPR Monthly Budget Calculator** on `/personal-financial-planning-nepal/`.
4. **Validation:** Checks debt payoff timelines and emergency fund adequacy in NPR.
5. **Conversion:** Requests a personal financial review to organize family cash flow and debt reduction.

## 3. URL Structure & Canonical Guidelines
- All URLs use clean lowercase slugs with hyphen separators and standard trailing slashes.
- Canonical self-referencing tags present on every page.
- SPA History API handles seamless transitions while preserving deep-linking crawlability.
"""

with open(f"{DOCS_DIR}/information-architecture.md", "w", encoding="utf-8") as f:
    f.write(content.strip())

print("information-architecture.md written successfully!")
