import os

CONFIG_DIR = "lalitpur-financial-consultancy/config"
os.makedirs(CONFIG_DIR, exist_ok=True)

config_content = """// config/business-config.js - Centralized Configuration for Lalitpur Financial Advisory
// Note: Clearly identifiable placeholders are used for unconfirmed business details.
// Update these variables prior to production deployment.

window.BUSINESS_CONFIG = {
  // Brand & Identity
  name: "Lalitpur Financial Advisory",
  shortName: "LFA",
  nepaliName: "ललितपुर फाइनान्सियल एड्भाइजरी",
  tagline: "Strategic Financial & Business Advisory for Nepal",
  description: "Specialized financial consultancy, budgeting, bookkeeping coordination, and business setup advisory serving businesses and individuals across all 7 provinces of Nepal.",

  // Contact Details (Placeholders for unconfirmed items)
  contact: {
    address: {
      line1: "Apex Commercial Complex, 3rd Floor",
      line2: "Pulchowk-Kumaripati Commercial Corridor",
      city: "Lalitpur",
      province: "Bagmati Province",
      country: "Nepal",
      postalCode: "44700",
      fullAddress: "Apex Commercial Complex, 3rd Floor, Pulchowk-Kumaripati Commercial Corridor, Lalitpur Metropolitan City, Nepal",
      coordinates: {
        lat: 27.6715,
        lng: 85.3134
      }
    },
    phone: "+977-1-554XXXX",          // Placeholder: Update with official PSTN landline
    mobile: "+977-98510XXXXX",         // Placeholder: Update with official hotline
    whatsapp: "+97798510XXXXX",        // Placeholder: Update with official WhatsApp number
    whatsappUrl: "https://wa.me/97798510XXXXX",
    email: "info@lalitpurfinancial.com.np", // Placeholder: Corporate email
    hours: "Sunday - Friday: 9:00 AM - 6:00 PM (NPT)",
    weekend: "Saturday: Closed (Emergency consultations by appointment)",
    serviceArea: "Nationwide (All 7 Provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim)",
    headquarters: "Lalitpur Metropolitan City, Nepal"
  },

  // Social & Online Profiles (Placeholders)
  social: {
    linkedin: "https://www.linkedin.com/company/lalitpur-financial-advisory-placeholder",
    facebook: "https://www.facebook.com/lalitpurfinancialadvisory-placeholder",
    twitter: "https://twitter.com/LalitpurFinAdv",
    googleMaps: "https://maps.google.com/?q=Kumaripati+Lalitpur+Nepal"
  },

  // Advisory & Regulatory Disclaimers (Strict Truth-in-Advertising Compliance)
  legal: {
    companyRegPlaceholder: "OCR Reg. No. [Pending Verification]",
    panNumberPlaceholder: "PAN: [Pending Verification]",
    disclaimerSummary: "Lalitpur Financial Advisory provides strategic financial consulting, bookkeeping workflow coordination, and management decision support. We do not provide statutory audits under the Nepal Chartered Accountants Act 2053 (which are performed exclusively by licensed ICAN members) nor court legal advocacy. All financial calculators provide illustrative estimations and do not constitute guaranteed investment or tax outcomes."
  },

  // Seed SEO Keywords
  seo: {
    seedKeyword: "Financial Consultancy Services",
    geoTarget: "Nepal, Lalitpur, Kathmandu Valley",
    canonicalDomain: "https://lalitpurfinancial.com.np"
  }
};
"""

with open(f"{CONFIG_DIR}/business-config.js", "w", encoding="utf-8") as f:
    f.write(config_content.strip())

print("business-config.js created successfully!")
