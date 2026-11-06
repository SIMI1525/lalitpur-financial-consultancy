// js/app.js - SPA Router, Dynamic Page Renderer & UI-UX Pro Max Swiss Minimalist Engine
// Supporting all 49 canonical routes across 6 page types with complete content & interactive centerpieces.

(function() {
  const data = window.SITE_DATA;
  const calcs = window.FINANCIAL_TOOLS || window.LFA_CALCULATORS;
  const root = document.getElementById('app-root');
  
  if (!data || !calcs) {
    console.error('Critical Error: SITE_DATA or FINANCIAL_TOOLS missing.');
    return;
  }

  // Route normalization helper: handles trailing slashes, hash fallback, and clean URLs
  function normalizeRoute(p) {
    if (!p) return '/';
    let path = p.trim();
    if (path.startsWith('#/')) path = path.substring(1);
    if (path.startsWith('#')) path = path.substring(1);
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && !path.endsWith('/')) path = path + '/';
    return path;
  }

  function getCleanPath() {
    let path = window.location.pathname;
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      path = window.location.hash.substring(1);
    }
    return normalizeRoute(path);
  }

  // Dynamic HTML Meta Tags & Titles
  function updateMeta(page) {
    document.title = page.title || (page.h1 + ' | ' + data.agency.name);
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', page.metaDescription || (page.directAnswer ? page.directAnswer.slice(0, 155) : ''));
    updateBreadcrumbs(page);
  }

  // Dynamic Breadcrumb Navigation
  function updateBreadcrumbs(page) {
    const bar = document.getElementById('breadcrumb-bar');
    const list = document.getElementById('breadcrumb-list');
    if (!bar || !list) return;

    if (page.url === '/') {
      bar.classList.add('hidden');
      return;
    }

    bar.classList.remove('hidden');
    let html = '<a href="/" class="nav-link hover:text-forest transition"><i class="fa-solid fa-house text-slate-400"></i> Home</a> <span class="text-slate-300">/</span> ';

    if (page.type === 'Services Hub') {
      html += '<span class="text-forest font-bold">Services Directory</span>';
    } else if (page.type === 'money') {
      html += '<a href="/services/" class="nav-link hover:text-forest transition">Services Hub</a> <span class="text-slate-300">/</span> ';
      html += `<span class="text-forest font-bold truncate max-w-xs">${page.h1}</span>`;
    } else if (page.type === 'Blog Hub') {
      html += '<span class="text-forest font-bold">Knowledge Hub</span>';
    } else if (page.type === 'article') {
      html += '<a href="/blog/" class="nav-link hover:text-forest transition">Knowledge Hub</a> <span class="text-slate-300">/</span> ';
      if (page.primaryMoneyPageLink) {
        html += `<a href="${page.primaryMoneyPageLink}" class="nav-link hover:text-forest transition">${page.clusterName || 'Practice'}</a> <span class="text-slate-300">/</span> `;
      }
      html += `<span class="text-forest font-bold truncate max-w-xs">${page.h1}</span>`;
    } else {
      html += `<span class="text-forest font-bold truncate max-w-xs">${page.h1}</span>`;
    }
    list.innerHTML = html;
  }

  // Toast Notification System
  window.showToast = function(msg, icon = 'fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-slate-900 text-slate-100 text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 border border-slate-700 animate-fade-in';
    toast.innerHTML = `<i class="fa-solid ${icon} text-terracotta"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Helper: Format Currency in NPR
  function formatNPR(val) {
    if (calcs && calcs.formatNPR) return calcs.formatNPR(val);
    return 'NPR ' + Number(val || 0).toLocaleString();
  }

  // ==========================================
  // PAGE RENDERERS
  // ==========================================

  // 1. HOME PAGE RENDERER
  function renderHome(page) {
    const moneyPages = data.pages.filter(p => p.type === 'money');
    const articles = data.pages.filter(p => p.type === 'article');

    return `
      <!-- HERO SECTION (Swiss Minimalism: High Contrast, Content First) -->
      <section class="bg-white border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            
            <div class="inline-flex items-center gap-2 bg-[#FAF7F2] border border-stone text-forest text-xs px-3.5 py-1.5 rounded-full font-medium">
              <i class="fa-solid fa-landmark text-terracotta"></i> Lalitpur Commercial Hub &bull; Serving All 7 Provinces Nationwide
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-forest leading-tight">
              ${page.h1}
            </h1>

            <div class="p-4 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-lg text-slate-700 text-sm sm:text-base leading-relaxed font-light">
              ${page.directAnswer || page.summary}
            </div>
            
            <div class="flex flex-wrap gap-4 pt-2">
              <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs sm:text-sm">
                <i class="fa-solid fa-calendar-check"></i> Book Free Consultation
              </button>
              <a href="/services/" class="nav-link btn-secondary text-xs sm:text-sm">
                Explore 6 Practice Verticals &rarr;
              </a>
            </div>

            <!-- PROOF & CREDIBILITY STATS -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
              ${(data.agency.stats || []).map(s => `
                <div>
                  <div class="text-2xl sm:text-3xl font-serif font-bold text-forest">${s.num}</div>
                  <div class="text-xs text-slate-500 font-medium">${s.label}</div>
                </div>
              `).join('')}
            </div>

          </div>

          <!-- QUICK SERVICE FINDER CARD -->
          <div class="lg:col-span-5 bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-stone shadow-sm">
            <div class="pb-4 border-b border-stone flex items-center justify-between">
              <div>
                <h3 class="font-serif font-bold text-lg text-forest">Quick Service Finder</h3>
                <p class="text-xs text-slate-500">Select what you need done in Nepal</p>
              </div>
              <span class="text-xs bg-white text-forest font-bold px-2.5 py-1 rounded border border-stone">
                LFA Desk
              </span>
            </div>

            <div class="space-y-2.5 pt-4 text-xs">
              <a href="/business-registration-licensing-nepal/" class="nav-link flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#FAF7F2] text-forest flex items-center justify-center font-bold">
                    <i class="fa-solid fa-building text-terracotta"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 group-hover:text-forest block">Business Registration</span>
                    <span class="text-slate-500 text-[11px]">OCR incorporation, MOA/AOA, Ward &amp; PAN/VAT</span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-forest text-xs"></i>
              </a>

              <a href="/tax-planning-compliance-nepal/" class="nav-link flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#FAF7F2] text-forest flex items-center justify-center font-bold">
                    <i class="fa-solid fa-file-invoice-dollar text-terracotta"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 group-hover:text-forest block">Tax &amp; VAT Compliance</span>
                    <span class="text-slate-500 text-[11px]">Form 13 returns, e-TDS, advance corporate tax</span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-forest text-xs"></i>
              </a>

              <a href="/accounting-bookkeeping-services-nepal/" class="nav-link flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#FAF7F2] text-forest flex items-center justify-center font-bold">
                    <i class="fa-solid fa-book-journal-whills text-terracotta"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 group-hover:text-forest block">Accounting &amp; Bookkeeping</span>
                    <span class="text-slate-500 text-[11px]">Monthly management accounts &amp; pre-audit reconciliations</span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-forest text-xs"></i>
              </a>

              <a href="/personal-financial-planning-nepal/" class="nav-link flex items-center justify-between p-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-[#FAF7F2] text-forest flex items-center justify-center font-bold">
                    <i class="fa-solid fa-wallet text-terracotta"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 group-hover:text-forest block">Personal Wealth &amp; Budgeting</span>
                    <span class="text-slate-500 text-[11px]">NPR cash allocation, CIT/SSF tax shields &amp; emergency funds</span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-forest text-xs"></i>
              </a>
            </div>

            <div class="pt-4 mt-3 border-t border-stone text-center">
              <a href="/services/" class="nav-link text-xs font-bold text-terracotta hover:text-forest">
                Explore Full Directory of All 6 Practices &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- SIX CORE ADVISORY PRACTICES (Swiss Minimalist Grid) -->
      <section class="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div class="max-w-2xl mb-12">
          <div class="text-xs font-bold text-terracotta uppercase tracking-wider mb-1">Our Core Advisory Verticals</div>
          <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest">Institutional Financial &amp; Business Solutions</h2>
          <p class="text-slate-600 text-sm mt-2">Comprehensive financial management, statutory accounting, and entity lifecycle solutions across Nepal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${moneyPages.map((mp, idx) => `
            <div class="swiss-card p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="w-8 h-8 rounded-full bg-[#FAF7F2] text-forest flex items-center justify-center font-bold text-xs border border-stone">
                    0${idx + 1}
                  </span>
                  <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    ${mp.clusterName}
                  </span>
                </div>
                <h3 class="font-serif font-bold text-xl text-forest mb-2">
                  <a href="${mp.url}" class="nav-link hover:text-terracotta transition">${mp.h1}</a>
                </h3>
                <p class="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                  ${mp.directAnswer || mp.metaDescription}
                </p>
                <div class="space-y-1.5 text-xs text-slate-700 font-medium mb-6">
                  ${(mp.secondaryKeywords || []).slice(0, 3).map(k => `
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-check text-terracotta text-[10px]"></i>
                      <span class="capitalize">${k}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <a href="${mp.url}" class="nav-link text-xs font-bold text-terracotta hover:text-forest pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>View Practice Scope</span>
                <i class="fa-solid fa-arrow-right text-[11px]"></i>
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- NEPAL TAX SLABS 2026 OVERVIEW TABLE -->
      <section class="bg-white border-y border-slate-200 py-16 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Nepal Fiscal Regulations (2026)</span>
            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-forest">Personal Income Tax Slabs &amp; Compliance</h2>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              Under the latest Inland Revenue Department (IRD) directives for FY 2081/82, individual taxpayers can optimize deductions through Citizen Investment Trust (CIT), SSF contributions, and health insurance tax shields.
            </p>
            <div class="pt-2">
              <a href="/personal-financial-planning-nepal/" class="nav-link btn-primary text-xs">
                Launch Interactive NPR Tax Calculator &rarr;
              </a>
            </div>
          </div>

          <div class="lg:col-span-7 bg-[#FAF7F2] p-6 rounded-xl border border-stone">
            <h4 class="font-serif font-bold text-base text-forest mb-3 flex items-center justify-between">
              <span>Personal Income Tax Slabs (FY 2081/82)</span>
              <span class="text-[11px] bg-white text-forest px-2.5 py-0.5 rounded border border-stone font-sans font-medium">IRD Official</span>
            </h4>
            <div class="overflow-x-auto text-xs">
              <table class="w-full text-left">
                <thead class="text-slate-500 border-b border-stone font-semibold">
                  <tr>
                    <th class="py-2">Bracket</th>
                    <th class="py-2">Unmarried (Single)</th>
                    <th class="py-2">Married (Couple)</th>
                    <th class="py-2">Tax Rate</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-slate-800">
                  <tr><td class="py-2 font-bold">1st Slab</td><td>Up to NPR 5 Lakhs</td><td>Up to NPR 6 Lakhs</td><td class="font-bold text-emerald-700">1% SST (0% if SSF)</td></tr>
                  <tr><td class="py-2 font-bold">2nd Slab</td><td>Next NPR 2 Lakhs</td><td>Next NPR 2 Lakhs</td><td class="font-bold text-slate-900">10%</td></tr>
                  <tr><td class="py-2 font-bold">3rd Slab</td><td>Next NPR 3 Lakhs</td><td>Next NPR 3 Lakhs</td><td class="font-bold text-slate-900">20%</td></tr>
                  <tr><td class="py-2 font-bold">4th Slab</td><td>Next NPR 10 Lakhs</td><td>Next NPR 9 Lakhs</td><td class="font-bold text-slate-900">30%</td></tr>
                  <tr><td class="py-2 font-bold">5th Slab</td><td>NPR 20L to 50 Lakhs</td><td>NPR 20L to 50 Lakhs</td><td class="font-bold text-rose-700">36%</td></tr>
                  <tr><td class="py-2 font-bold">Top Slab</td><td>Above NPR 50 Lakhs</td><td>Above NPR 50 Lakhs</td><td class="font-bold text-rose-700">39%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- VERIFIED CLIENT TESTIMONIALS -->
      <section class="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div class="max-w-2xl mb-12">
          <div class="text-xs font-bold text-terracotta uppercase tracking-wider mb-1">Institutional Proof</div>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-forest">What Our Commercial Clients Say</h2>
          <p class="text-slate-600 text-sm mt-2">Verified feedback from business founders, executives, and individuals partnering with our Lalitpur practice.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${(data.testimonials || []).map(t => `
            <div class="swiss-card p-5 flex flex-col justify-between">
              <div>
                <div class="flex text-amber-500 text-xs mb-3">
                  ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating || 5)}
                </div>
                <p class="text-slate-700 text-xs leading-relaxed mb-4 font-light">"${t.text}"</p>
              </div>
              <div class="pt-3 border-t border-slate-100">
                <div class="font-bold text-slate-900 text-xs">${t.client}</div>
                <div class="text-[11px] text-slate-500">${t.company}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- LALITPUR OFFICE & LOCAL SEO -->
      <section id="lalitpur-office" class="py-16 px-4 sm:px-6 bg-[#FAF7F2] border-t border-stone">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div class="lg:col-span-5 space-y-4">
            <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Physical Presence in Lalitpur</span>
            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-forest">Lalitpur Office &amp; Advisory Desk</h2>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              Centrally located in the Pulchowk-Kumaripati commercial center of Lalitpur Metropolitan City. Accessible from Kathmandu, Bhaktapur, and Patan with private client consultation rooms.
            </p>

            <div class="space-y-2.5 text-xs text-slate-700 bg-white p-5 rounded-lg border border-slate-200">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-location-dot text-terracotta mt-0.5"></i>
                <div>
                  <strong>Address:</strong> Level 3, Apex Commercial Complex, Pulchowk-Kumaripati Commercial Corridor, Lalitpur, Nepal
                </div>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-phone text-terracotta"></i>
                <div><strong>Telephone:</strong> +977-1-5542100 | +977-9851082345</div>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-envelope text-terracotta"></i>
                <div><strong>Corporate Email:</strong> info@lalitpurfinancial.com.np</div>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-clock text-terracotta"></i>
                <div><strong>Consultation Hours:</strong> Sun - Fri: 9:00 AM – 6:00 PM (NPT)</div>
              </div>
            </div>

            <div class="pt-2">
              <a href="/office-location/" class="nav-link btn-secondary text-xs">
                View Office Directions &amp; Transit Info &rarr;
              </a>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden h-80">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14133.042858102434!2d85.31342!3d27.67138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19cd619f79b7%3A0xc3b09228d6c770c8!2sPulchowk%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade" 
              title="Lalitpur Financial Advisory Office Location" 
              class="w-full h-full rounded-lg">
            </iframe>
          </div>

        </div>
      </section>
    `;
  }

  // 2. SERVICES HUB RENDERER
  function renderServicesHub(page) {
    const moneyPages = data.pages.filter(p => p.type === 'money');
    return `
      <section class="bg-white border-b border-slate-200 py-14 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto space-y-3">
          <div class="inline-flex items-center gap-2 bg-[#FAF7F2] border border-stone text-forest text-xs px-3 py-1 rounded-full font-medium">
            <i class="fa-solid fa-briefcase text-terracotta"></i> Institutional Practice Directory &bull; 6 Core Verticals
          </div>
          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-forest">${page.h1}</h1>
          <div class="p-4 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-lg text-slate-700 text-sm leading-relaxed font-light">
            ${page.directAnswer || page.summary}
          </div>
          <div class="pt-2 flex flex-wrap gap-3">
            <button onclick="window.print()" class="btn-secondary text-xs py-2 px-3">
              <i class="fa-solid fa-download mr-1"></i> Print / Save Corporate Overview
            </button>
            <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs py-2 px-4">
              <i class="fa-solid fa-calendar-check mr-1"></i> Book Discovery Session
            </button>
          </div>
        </div>
      </section>

      <section class="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${moneyPages.map((mp, idx) => `
            <div class="swiss-card p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="w-8 h-8 rounded-full bg-[#FAF7F2] text-forest flex items-center justify-center font-bold text-xs border border-stone">
                    0${idx + 1}
                  </span>
                  <span class="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-medium">
                    ${mp.clusterName}
                  </span>
                </div>
                <h2 class="font-serif font-bold text-xl text-forest mb-2">
                  <a href="${mp.url}" class="nav-link hover:text-terracotta transition">${mp.h1}</a>
                </h2>
                <p class="text-slate-600 text-xs leading-relaxed mb-4">
                  ${mp.directAnswer || mp.metaDescription}
                </p>
                <div class="bg-[#FAF7F2] p-3 rounded border border-stone text-xs text-slate-700 space-y-1 mb-4">
                  <div class="font-bold text-forest">Interactive Centerpiece:</div>
                  <div class="text-terracotta font-medium flex items-center gap-1.5">
                    <i class="fa-solid fa-calculator text-[10px]"></i> ${mp.centerpieceTitle}
                  </div>
                </div>
              </div>
              <a href="${mp.url}" class="nav-link btn-secondary text-xs text-center w-full py-2">
                Open Practice &amp; Interactive Tool &rarr;
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section class="py-12 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-200">
        <h2 class="font-serif font-bold text-2xl text-forest mb-6">Frequently Asked Questions: Our Services</h2>
        <div class="space-y-4">
          ${(page.faqs || []).map((faq, i) => `
            <div class="bg-white p-5 rounded-lg border border-slate-200">
              <h3 class="font-bold text-sm text-forest mb-2">${faq.question}</h3>
              <p class="text-xs text-slate-600 leading-relaxed font-light">${faq.answer}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // 3. CORE MONEY PAGE RENDERER (With Centerpiece Interactive Tool)
  function renderMoneyPage(page) {
    if (page.url === '/financial-consultancy-services-nepal/' || page.url === '/financial-consultancy/') {
      return renderFinancialConsultancyLanding();
    }
    let toolHtml = '';

    // Centerpiece Dispatch
    if (page.centerpieceType === 'budget_calculator') {
      toolHtml = renderBudgetCalculatorWidget();
    } else if (page.centerpieceType === 'cash_flow_tool') {
      toolHtml = renderCashFlowPlannerWidget();
    } else if (page.centerpieceType === 'bookkeeping_checklist') {
      toolHtml = renderBookkeepingScoreWidget();
    } else if (page.centerpieceType === 'tax_checklist') {
      toolHtml = renderTaxReadinessWidget();
    } else if (page.centerpieceType === 'registration_selector') {
      toolHtml = renderRegistrationPathwayWidget();
    } else {
      toolHtml = renderServiceMatrixWidget();
    }

    return `
      <article class="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
        <!-- ABOVE-THE-FOLD HEADER -->
        <header class="space-y-4 pb-8 border-b border-slate-200">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-stone text-forest text-xs px-3 py-1 rounded-full font-medium">
              <i class="fa-solid fa-shield-halved text-terracotta"></i> ${page.clusterName || 'Core Practice'}
            </span>
            <span class="text-xs text-slate-400">&bull;</span>
            <span class="text-xs text-slate-500">${page.searchIntent || 'Commercial Advisory'}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-forest leading-tight">${page.h1}</h1>
          
          <!-- DIRECT ANSWER SNIPPET -->
          <div class="p-4 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-lg text-slate-800 text-sm leading-relaxed">
            <span class="font-bold text-forest block mb-1">Direct Advisory Guidance:</span>
            ${page.directAnswer}
          </div>

          <div class="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
            <span class="font-bold text-slate-700">Keywords:</span>
            ${(page.secondaryKeywords || []).map(k => `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 capitalize">${k}</span>`).join('')}
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs py-2 px-4">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> Schedule Discovery Session
            </button>
            <a href="#centerpiece-tool" class="btn-secondary text-xs py-2 px-3">
              <i class="fa-solid fa-calculator mr-1.5"></i> Open ${page.centerpieceTitle || 'Tool'}
            </a>
          </div>
        </header>

        <!-- INTERACTIVE CENTERPIECE TOOL -->
        <section id="centerpiece-tool" aria-label="Interactive Financial Tool" class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
          <div class="border-b border-slate-200 pb-3 mb-6">
            <div class="text-xs font-bold text-terracotta uppercase tracking-wider mb-1">Interactive Centerpiece</div>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-forest">${page.centerpieceTitle || 'Practice Diagnostic Tool'}</h2>
            <p class="text-xs text-slate-500 mt-1">${page.centerpieceSubtitle || 'Real-time calculation in NPR. No external data transmission.'}</p>
          </div>
          ${toolHtml}
        </section>

        <!-- SECTIONS CONTENT -->
        <section class="space-y-8 text-sm text-slate-700 leading-relaxed font-light">
          ${(page.sections || []).map(sec => `
            <div class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-3">
              <h2 class="font-serif font-bold text-xl sm:text-2xl text-forest">${sec.h2}</h2>
              <div class="space-y-3 font-normal text-slate-700">
                ${sec.contentHtml}
              </div>
            </div>
          `).join('')}
        </section>

        <!-- FREQUENTLY ASKED QUESTIONS (ACCORDION) -->
        ${page.faqs && page.faqs.length ? `
          <section class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-4">
            <h2 class="font-serif font-bold text-xl sm:text-2xl text-forest">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${page.faqs.map((faq, i) => `
                <details class="group border border-slate-200 rounded-lg p-4 bg-slate-50 [&_summary::-webkit-details-marker]:hidden" ${i === 0 ? 'open' : ''}>
                  <summary class="flex items-center justify-between cursor-pointer font-bold text-sm text-forest">
                    <span>${faq.question}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition"></i>
                  </summary>
                  <p class="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-light">
                    ${faq.answer}
                  </p>
                </details>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- SUPPORTING CLUSTER ARTICLES (Koray-Style Internal Linking) -->
        ${page.relatedArticles && page.relatedArticles.length ? `
          <section class="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-stone space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-serif font-bold text-lg text-forest">Supporting Statutory Guides &amp; Insights</h3>
                <p class="text-xs text-slate-500">Essential reading for ${page.primaryKeyword}</p>
              </div>
              <a href="/blog/" class="text-xs font-bold text-terracotta hover:underline">All Guides &rarr;</a>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              ${page.relatedArticles.map(art => `
                <a href="${art.url}" class="nav-link block p-3.5 bg-white rounded-lg border border-stone hover:border-forest transition group">
                  <div class="font-bold text-forest group-hover:text-terracotta transition">${art.title}</div>
                  <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Read statutory guide</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                  </div>
                </a>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- ICAN COMPLIANCE STATEMENT -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed">
          <strong>Regulatory Compliance Notice:</strong> Lalitpur Financial Advisory provides strategic financial consultancy, internal bookkeeping, and tax planning services. In accordance with the Nepal Chartered Accountants Act 2053, statutory independent external audits are conducted exclusively by licensed audit firms registered with the Institute of Chartered Accountants of Nepal (ICAN).
        </div>

        <!-- CALL TO ACTION -->
        <section class="bg-slate-900 text-white p-8 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="space-y-1">
            <h3 class="font-serif font-bold text-xl text-white">${page.cta ? page.cta.headline : 'Ready to Structure Your Financial Management?'}</h3>
            <p class="text-xs text-slate-300 font-light">${page.cta ? page.cta.subtext : 'Schedule an initial discovery consultation with our senior advisory team in Lalitpur.'}</p>
          </div>
          <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs whitespace-nowrap">
            ${page.cta ? page.cta.buttonText : 'Book Consultation'}
          </button>
        </section>
      </article>
    `;
  }

  // 4. CLUSTER ARTICLE RENDERER (With Koray-Style Reciprocal Linking)
  function renderArticle(page) {
    return `
      <article class="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
        <!-- HEADER -->
        <header class="space-y-4 pb-8 border-b border-slate-200">
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            ${page.primaryMoneyPageLink ? `
              <a href="${page.primaryMoneyPageLink}" class="nav-link font-bold text-terracotta hover:underline">
                <i class="fa-solid fa-arrow-left text-[10px] mr-1"></i> ${page.clusterName || 'Practice'}
              </a>
              <span>&bull;</span>
            ` : ''}
            <span>${page.readTime || '5 min read'}</span>
            <span>&bull;</span>
            <span>By ${page.author || 'LFA Research Desk'}</span>
            <span>&bull;</span>
            <span>Updated ${page.lastReviewed || '2026'}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-forest leading-tight">${page.h1}</h1>

          <!-- DIRECT ANSWER SNIPPET -->
          <div class="p-4 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-lg text-slate-800 text-sm leading-relaxed">
            <span class="font-bold text-forest block mb-1">Direct Answer / Overview:</span>
            ${page.directAnswer}
          </div>

          <div class="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
            <span class="font-bold text-slate-700">Keywords:</span>
            ${(page.secondaryKeywords || []).map(k => `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 capitalize">${k}</span>`).join('')}
          </div>
        </header>

        <!-- TABLE OF CONTENTS -->
        ${page.sections && page.sections.length > 1 ? `
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <div class="font-bold text-forest uppercase tracking-wider text-[11px]">Table of Contents</div>
            <ul class="space-y-1 text-slate-700">
              ${page.sections.map((s, idx) => `
                <li><a href="#sec-${idx}" class="hover:text-terracotta transition">${s.h2}</a></li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- ARTICLE SECTIONS -->
        <section class="space-y-8 text-sm text-slate-700 leading-relaxed font-light">
          ${(page.sections || []).map((sec, idx) => `
            <div id="sec-${idx}" class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-3">
              <h2 class="font-serif font-bold text-xl sm:text-2xl text-forest">${sec.h2}</h2>
              <div class="space-y-3 font-normal text-slate-700">
                ${sec.contentHtml}
              </div>
            </div>
          `).join('')}
        </section>

        <!-- FREQUENTLY ASKED QUESTIONS -->
        ${page.faqs && page.faqs.length ? `
          <section class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-4">
            <h2 class="font-serif font-bold text-xl sm:text-2xl text-forest">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${page.faqs.map((faq, i) => `
                <details class="group border border-slate-200 rounded-lg p-4 bg-slate-50" ${i === 0 ? 'open' : ''}>
                  <summary class="flex items-center justify-between cursor-pointer font-bold text-sm text-forest">
                    <span>${faq.question}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition"></i>
                  </summary>
                  <p class="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-light">
                    ${faq.answer}
                  </p>
                </details>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- KORAY-STYLE RECIPROCAL INTERNAL LINKING SECTION -->
        <section class="bg-[#FAF7F2] p-6 sm:p-8 rounded-xl border border-stone space-y-4">
          <div class="text-xs font-bold text-terracotta uppercase tracking-wider">Strategic Advisory Handoff</div>
          <h2 class="font-serif font-bold text-xl text-forest">
            Expert Advisory Support for ${page.clusterName || 'Your Business'}
          </h2>
          <p class="text-xs text-slate-600 leading-relaxed">
            Managing commercial and personal finance in Nepal requires institutional discipline. For dedicated consultation, explore our core 
            <a href="${page.primaryMoneyPageLink || '/services/'}" class="text-terracotta font-semibold hover:underline">${page.primaryMoneyPageAnchor || page.clusterName || 'financial consultancy services in Nepal'}</a>,
            headquartered in Lalitpur and serving all 7 provinces nationwide.
          </p>

          ${page.relatedArticles && page.relatedArticles.length ? `
            <div class="pt-2 border-t border-stone">
              <div class="text-xs font-bold text-forest mb-2">Related Nepal Statutory Guides:</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                ${page.relatedArticles.map(ra => `
                  <a href="${ra.url}" class="nav-link block p-2.5 bg-white rounded border border-stone hover:border-forest text-forest hover:text-terracotta transition font-medium">
                    ${ra.title} &rarr;
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        <!-- OFFICIAL REFERENCES -->
        ${page.officialReferences && page.officialReferences.length ? `
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 text-slate-500">
            <span class="font-bold text-slate-700">Official Regulatory Sources:</span>
            <div class="flex flex-wrap gap-4 pt-1">
              ${page.officialReferences.map(ref => `
                <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="hover:text-forest underline flex items-center gap-1">
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> ${ref.name} (${ref.authority})
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- CTA -->
        <section class="bg-slate-900 text-white p-8 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="space-y-1">
            <h3 class="font-serif font-bold text-xl text-white">${page.cta ? page.cta.headline : 'Need Direct Guidance on This Matter?'}</h3>
            <p class="text-xs text-slate-300 font-light">${page.cta ? page.cta.subtext : 'Schedule a private consultation with our Lalitpur advisory desk.'}</p>
          </div>
          <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs whitespace-nowrap">
            ${page.cta ? page.cta.buttonText : 'Book Consultation'}
          </button>
        </section>
      </article>
    `;
  }

  // 5. BLOG HUB RENDERER
  function renderBlogHub(page) {
    const articles = data.pages.filter(p => p.type === 'article');
    const clusters = data.clusters || [];

    return `
      <section class="bg-white border-b border-slate-200 py-14 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto space-y-3">
          <div class="inline-flex items-center gap-2 bg-[#FAF7F2] border border-stone text-forest text-xs px-3 py-1 rounded-full font-medium">
            <i class="fa-solid fa-graduation-cap text-terracotta"></i> 30 Nepal Statutory Guides &bull; Updated for FY 2081/82 (2026)
          </div>
          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-forest">${page.h1}</h1>
          <p class="text-slate-600 text-sm leading-relaxed font-light">${page.directAnswer || page.summary}</p>
          
          <!-- SEARCH IN HUB -->
          <div class="pt-3 max-w-md">
            <div class="relative">
              <input type="text" id="blog-search-input" placeholder="Search guides by topic, law, or keyword (e.g. VAT, DPR, SSF)..." class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:border-forest outline-none">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            </div>
          </div>
        </div>
      </section>

      <section class="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <!-- ARTICLES GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-articles-grid">
          ${articles.map(art => `
            <article class="swiss-card p-5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span class="bg-[#FAF7F2] text-forest font-bold px-2 py-0.5 rounded border border-stone">${art.clusterName}</span>
                  <span>${art.readTime || '5 min'}</span>
                </div>
                <h2 class="font-serif font-bold text-base text-forest mb-2 leading-snug">
                  <a href="${art.url}" class="nav-link hover:text-terracotta transition">${art.h1}</a>
                </h2>
                <p class="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                  ${art.directAnswer || art.metaDescription}
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="text-slate-400 text-[11px]">${art.publishedDate || '2026'}</span>
                <a href="${art.url}" class="nav-link text-terracotta font-bold hover:text-forest flex items-center gap-1">
                  <span>Read Guide</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  // 6. TRUST PAGE RENDERER
  function renderTrustPage(page) {
    return `
      <article class="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
        <!-- HEADER -->
        <header class="space-y-3 pb-8 border-b border-slate-200">
          <div class="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-stone text-forest text-xs px-3 py-1 rounded-full font-medium">
            <i class="fa-solid fa-scale-balanced text-terracotta"></i> Trust &amp; Governance
          </div>
          <h1 class="text-3xl sm:text-5xl font-serif font-bold text-forest leading-tight">${page.h1}</h1>
          <div class="p-4 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-lg text-slate-800 text-sm leading-relaxed">
            ${page.directAnswer || page.metaDescription}
          </div>
        </header>

        <!-- SECTIONS -->
        <section class="space-y-8 text-sm text-slate-700 leading-relaxed font-light">
          ${(page.sections || []).map(sec => `
            <div class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-3">
              <h2 class="font-serif font-bold text-xl sm:text-2xl text-forest">${sec.h2}</h2>
              <div class="space-y-3 font-normal text-slate-700">
                ${sec.contentHtml}
              </div>
            </div>
          `).join('')}
        </section>

        <!-- FAQS -->
        ${page.faqs && page.faqs.length ? `
          <section class="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-4">
            <h2 class="font-serif font-bold text-xl text-forest">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${page.faqs.map((faq, i) => `
                <details class="group border border-slate-200 rounded-lg p-4 bg-slate-50" ${i === 0 ? 'open' : ''}>
                  <summary class="flex items-center justify-between cursor-pointer font-bold text-sm text-forest">
                    <span>${faq.question}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-slate-400 group-open:rotate-180 transition"></i>
                  </summary>
                  <p class="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-light">
                    ${faq.answer}
                  </p>
                </details>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- CTA -->
        <section class="bg-slate-900 text-white p-8 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="space-y-1">
            <h3 class="font-serif font-bold text-xl text-white">Have Specific Questions for Our Practice?</h3>
            <p class="text-xs text-slate-300 font-light">Connect directly with our Lalitpur corporate advisory team.</p>
          </div>
          <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs whitespace-nowrap">
            Schedule Appointment
          </button>
        </section>
      </article>
    `;
  }

  // ==========================================
  // INTERACTIVE CENTERPIECE WIDGETS
  // ==========================================

  // WIDGET 1: Monthly Budget & Emergency Reserve Calculator (NPR)
  function renderBudgetCalculatorWidget() {
    return `
      <div class="space-y-6 text-xs text-slate-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- INFLOWS -->
          <div class="space-y-3 bg-[#FAF7F2] p-4 rounded-lg border border-stone">
            <h4 class="font-bold text-sm text-forest mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-down text-emerald-600"></i> Monthly Net Inflows (NPR)
            </h4>
            <div>
              <label class="block font-medium mb-1">Primary Take-Home Salary *</label>
              <input type="number" id="budget-salary" value="100000" class="w-full p-2 rounded border border-slate-300">
            </div>
            <div>
              <label class="block font-medium mb-1">Side Business / Freelance</label>
              <input type="number" id="budget-side" value="20000" class="w-full p-2 rounded border border-slate-300">
            </div>
            <div>
              <label class="block font-medium mb-1">Rental / Dividend Income</label>
              <input type="number" id="budget-other" value="0" class="w-full p-2 rounded border border-slate-300">
            </div>
          </div>

          <!-- ESSENTIAL OUTFLOWS -->
          <div class="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
            <h4 class="font-bold text-sm text-forest mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-house text-slate-700"></i> Essential Monthly Expenses (NPR)
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-medium mb-1">Housing &amp; Rent</label>
                <input type="number" id="budget-rent" value="25000" class="w-full p-2 rounded border border-slate-300">
              </div>
              <div>
                <label class="block font-medium mb-1">Groceries &amp; Food</label>
                <input type="number" id="budget-food" value="20000" class="w-full p-2 rounded border border-slate-300">
              </div>
              <div>
                <label class="block font-medium mb-1">Utilities &amp; Wi-Fi</label>
                <input type="number" id="budget-utilities" value="5000" class="w-full p-2 rounded border border-slate-300">
              </div>
              <div>
                <label class="block font-medium mb-1">Loan EMI / Debts</label>
                <input type="number" id="budget-emi" value="15000" class="w-full p-2 rounded border border-slate-300">
              </div>
            </div>
            <div>
              <label class="block font-medium mb-1">Discretionary / Leisure</label>
              <input type="number" id="budget-leisure" value="15000" class="w-full p-2 rounded border border-slate-300">
            </div>
          </div>
        </div>

        <!-- RESULTS CARD -->
        <div id="budget-results-box" class="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // WIDGET 2: Business Cash-Flow Planning Tool (NPR)
  function renderCashFlowPlannerWidget() {
    return `
      <div class="space-y-6 text-xs text-slate-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#FAF7F2] p-4 rounded-lg border border-stone space-y-2.5">
            <h4 class="font-bold text-forest">1. Opening Liquidity</h4>
            <div>
              <label class="block font-medium mb-1">Bank Cash Balance (NPR)</label>
              <input type="number" id="cf-opening" value="500000" class="w-full p-2 rounded border border-slate-300">
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-slate-200 space-y-2.5">
            <h4 class="font-bold text-emerald-700">2. Projected Monthly Inflows</h4>
            <div>
              <label class="block font-medium mb-1">Cash Sales</label>
              <input type="number" id="cf-sales" value="600000" class="w-full p-2 rounded border border-slate-300">
            </div>
            <div>
              <label class="block font-medium mb-1">Debtor Receivables (A/R)</label>
              <input type="number" id="cf-ar" value="200000" class="w-full p-2 rounded border border-slate-300">
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-slate-200 space-y-2.5">
            <h4 class="font-bold text-rose-700">3. Committed Outflows</h4>
            <div>
              <label class="block font-medium mb-1">Staff Payroll &amp; SSF</label>
              <input type="number" id="cf-payroll" value="350000" class="w-full p-2 rounded border border-slate-300">
            </div>
            <div>
              <label class="block font-medium mb-1">Inventory / Raw Materials</label>
              <input type="number" id="cf-cogs" value="300000" class="w-full p-2 rounded border border-slate-300">
            </div>
            <div>
              <label class="block font-medium mb-1">Rent, Tax &amp; Debt EMIs</label>
              <input type="number" id="cf-overhead" value="100000" class="w-full p-2 rounded border border-slate-300">
            </div>
          </div>
        </div>

        <div id="cf-results-box" class="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // WIDGET 3: Bookkeeping Readiness Checklist
  function renderBookkeepingScoreWidget() {
    const questions = [
        "1. All commercial sales are backed by sequential serialized bills / tax invoices.",
        "2. Monthly bank reconciliations are completed and matched against software ledgers.",
        "3. Vendor purchase bills are filed alongside proof of payment and TDS deduction slips.",
        "4. Accounts receivable (debtors) ledger is aged and reviewed every 30 days.",
        "5. Fixed assets register is maintained with depreciation schedules under Income Tax Act.",
        "6. Petty cash vouchers are verified with physical receipts and signed by manager.",
        "7. Payroll records detail 31% SSF splits and monthly tax withholdings.",
        "8. Inventory stock is physically counted and reconciled against software at least quarterly."
    ];

    return `
      <div class="space-y-6 text-xs text-slate-700">
        <p class="text-xs text-slate-600">Select the compliance practices currently active in your organization to calculate your audit readiness score:</p>
        <div class="space-y-2.5" id="bookkeeping-checklist-items">
          ${questions.map((q, i) => `
            <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="bk-item mt-0.5" value="${i}" ${i < 5 ? 'checked' : ''}>
              <span class="text-xs text-slate-800 font-medium">${q}</span>
            </label>
          `).join('')}
        </div>
        <div id="bk-score-box" class="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // WIDGET 4: Tax Document Readiness Checklist
  function renderTaxReadinessWidget() {
    const taxQuestions = [
        "1. Permanent Account Number (PAN) and 13% VAT registration certificates displayed at premises.",
        "2. Form 13 monthly purchase and sales registers uploaded to IRD portal before 25th.",
        "3. Advance corporate tax installments computed and deposited on schedule (Poush/Chaitra/Ashad).",
        "4. Electronic TDS (e-TDS) vouchers generated and issued to all service vendors.",
        "5. Prior fiscal year tax clearance certificate obtained and archived.",
        "6. Board of Directors / Partner PAN numbers documented in corporate tax files."
    ];

    return `
      <div class="space-y-6 text-xs text-slate-700">
        <p class="text-xs text-slate-600">Check off the statutory tax records your enterprise maintains:</p>
        <div class="space-y-2.5" id="tax-checklist-items">
          ${taxQuestions.map((q, i) => `
            <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" class="tax-item mt-0.5" value="${i}" ${i < 4 ? 'checked' : ''}>
              <span class="text-xs text-slate-800 font-medium">${q}</span>
            </label>
          `).join('')}
        </div>
        <div id="tax-score-box" class="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // WIDGET 5: Business Registration Pathway Selector
  function renderRegistrationPathwayWidget() {
    return `
      <div class="space-y-6 text-xs text-slate-700">
        <div class="flex flex-wrap gap-2" id="reg-pathway-tabs">
          <button data-type="pvt_ltd" class="reg-tab active bg-forest text-white px-3.5 py-2 rounded-lg font-bold">Private Limited (Pvt Ltd)</button>
          <button data-type="sole_proprietorship" class="reg-tab bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg font-bold">Sole Proprietorship</button>
          <button data-type="partnership" class="reg-tab bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg font-bold">Partnership Firm</button>
          <button data-type="fdi" class="reg-tab bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg font-bold">Foreign Investment (FDI)</button>
        </div>
        <div id="reg-pathway-box" class="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // WIDGET 6: Service Scope Matrix
  function renderServiceMatrixWidget() {
    return `
      <div class="space-y-4 text-xs text-slate-700">
        <p class="text-slate-600">Select your entity type to review recommended financial advisory disciplines:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" id="scope-selector-buttons">
          <button data-scale="startup" class="scope-btn active p-3 rounded-lg border-2 border-forest bg-[#FAF7F2] text-left">
            <div class="font-bold text-forest">Startup / New Venture</div>
            <div class="text-[11px] text-slate-500">Pre-revenue to 50 Lakhs</div>
          </button>
          <button data-scale="sme" class="scope-btn p-3 rounded-lg border border-slate-200 bg-white text-left hover:bg-slate-50">
            <div class="font-bold text-slate-800">Growing SME</div>
            <div class="text-[11px] text-slate-500">50 Lakhs to 5 Crores</div>
          </button>
          <button data-scale="enterprise" class="scope-btn p-3 rounded-lg border border-slate-200 bg-white text-left hover:bg-slate-50">
            <div class="font-bold text-slate-800">Commercial Enterprise</div>
            <div class="text-[11px] text-slate-500">5 Crores+ turnover</div>
          </button>
          <button data-scale="individual" class="scope-btn p-3 rounded-lg border border-slate-200 bg-white text-left hover:bg-slate-50">
            <div class="font-bold text-slate-800">HNW Individual</div>
            <div class="text-[11px] text-slate-500">Private Wealth &amp; Tax</div>
          </button>
        </div>
        <div id="scope-results-box" class="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <!-- Dynamically populated -->
        </div>
      </div>
    `;
  }

  // ==========================================

  // ==========================================
  // DEDICATED FINANCIAL CONSULTANCY LANDING RENDERER
  // ==========================================
  function renderFinancialConsultancyLanding() {
    return `
<article class="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-16">

  <!-- ============================================================
       HERO SECTION: H1 & KEY INTENT
  ============================================================ -->
  <header class="space-y-6 pb-12 border-b border-slate-200">
    <div class="flex flex-wrap items-center gap-2">
      <span class="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-stone text-forest text-xs px-3 py-1 rounded-full font-medium">
        <i class="fa-solid fa-shield-halved text-terracotta"></i> Core Practice Vertical &bull; Financial Consulting
      </span>
      <span class="text-xs text-slate-400">&bull;</span>
      <span class="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
        <i class="fa-solid fa-circle-check text-[10px]"></i> Pulchowk, Lalitpur &bull; Serving All 7 Provinces
      </span>
    </div>

    <!-- Approved H1 -->
    <h1 class="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-forest leading-[1.15]">
      Expert Financial Consultancy Services in Nepal
    </h1>

    <!-- Direct Answer Advisory Snippet -->
    <div class="p-5 bg-[#FAF7F2] border-l-4 border-terracotta rounded-r-xl text-slate-800 text-sm md:text-base leading-relaxed shadow-sm">
      <div class="flex items-center gap-2 font-bold text-forest text-sm uppercase tracking-wider mb-1.5">
        <i class="fa-solid fa-circle-info text-terracotta"></i> Direct Practice Advisory:
      </div>
      <p>
        <strong>Financial consultancy</strong> is the structured professional discipline of diagnosing an organization's or individual's capital structure, cash flow architecture, and statutory exposure to craft actionable tax planning, accounting controls, and growth strategies. In Nepal—governed under the <em>Inland Revenue Department (IRD)</em>, <em>Office of the Company Registrar (OCR)</em>, <em>Nepal Rastra Bank (NRB)</em>, and <em>Social Security Fund (SSF)</em>—our Lalitpur advisory delivers end-to-end guidance ensuring corporate longevity, tax compliance, and investor readiness nationwide.
      </p>
    </div>

    <!-- Action Bar -->
    <div class="flex flex-wrap items-center gap-3 pt-2">
      <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm">
        <i class="fa-solid fa-calendar-check mr-1.5"></i> Book Free Consultation Session
      </button>
      <a href="https://wa.me/9779851082345" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded transition shadow-sm">
        <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp: +977-9851082345
      </a>
      <a href="tel:+97715542100" class="btn-secondary text-xs sm:text-sm py-2.5 px-4">
        <i class="fa-solid fa-phone mr-1.5 text-sky-600"></i> +977-1-5542100
      </a>
    </div>

    <!-- Credibility Stats Strip -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 text-left">
      <div class="p-4 bg-white rounded-lg border border-slate-200">
        <div class="text-2xl sm:text-3xl font-serif font-bold text-forest">15+ Yrs</div>
        <div class="text-xs text-slate-500 mt-1 font-medium">Combined Advisory Experience</div>
      </div>
      <div class="p-4 bg-white rounded-lg border border-slate-200">
        <div class="text-2xl sm:text-3xl font-serif font-bold text-terracotta">500+</div>
        <div class="text-xs text-slate-500 mt-1 font-medium">Nepali Businesses Advised</div>
      </div>
      <div class="p-4 bg-white rounded-lg border border-slate-200">
        <div class="text-2xl sm:text-3xl font-serif font-bold text-forest">100%</div>
        <div class="text-xs text-slate-500 mt-1 font-medium">IRD, OCR, NRB & ICAN Aligned</div>
      </div>
      <div class="p-4 bg-white rounded-lg border border-slate-200">
        <div class="text-2xl sm:text-3xl font-serif font-bold text-terracotta">7 Provinces</div>
        <div class="text-xs text-slate-500 mt-1 font-medium">In-Person & Remote Support</div>
      </div>
    </div>
  </header>

  <!-- ============================================================
       H2-1: WHAT IS FINANCIAL CONSULTANCY & WHY IT MATTERS
  ============================================================ -->
  <section id="what-is-financial-consultancy" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Definitional Overview</span>
      <!-- Approved H2-1 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        What Is Financial Consultancy and Why Does It Matter for Your Business?
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        Financial consultancy extends substantially beyond periodic ledger entry or retrospective tax calculations. A certified financial consulting practice conducts comprehensive diagnostic evaluations of organizational assets, current liabilities, operational margins, and compliance posture under Nepal’s statutory codes. By formulating forward-looking models, we empower business owners to protect operational liquidity, reduce tax liabilities, and ensure seamless audits.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- H3-1a -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-lg mb-4 border border-stone">
            <i class="fa-solid fa-compass"></i>
          </div>
          <h3 class="text-lg font-bold text-forest mb-2">
            The Role of a Financial Consultant in Nepal
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A financial consultant acts as a strategic navigator for Nepali enterprises. While traditional bookkeepers document past transactions, a financial consultant shapes future performance: building cash runway models, aligning pricing with VAT thresholds, planning quarterly advance tax obligations, and representing client interests before municipal ward and federal authorities.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-forest flex items-center gap-1.5">
          <i class="fa-solid fa-check text-emerald-600"></i> Proactive Forecasting & Planning
        </div>
      </div>

      <!-- H3-1b -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-lg mb-4 border border-stone">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <h3 class="text-lg font-bold text-forest mb-2">
            Financial Consultant vs. Chartered Accountant: Key Differences
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Under the <em>Nepal Chartered Accountants Act 2053</em>, only ICAN-licensed CAs can execute statutory independent audits and issue legal audit opinions. A financial consultant serves as internal management advisor, tax strategist, and financial architect. We collaborate with licensed CAs so your statutory annual audit is completely frictionless.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-forest flex items-center gap-1.5">
          <i class="fa-solid fa-check text-emerald-600"></i> Synergistic Compliance & Growth
        </div>
      </div>

      <!-- H3-1c -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-10 h-10 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-lg mb-4 border border-stone">
            <i class="fa-solid fa-business-time"></i>
          </div>
          <h3 class="text-lg font-bold text-forest mb-2">
            When Should You Hire a Financial Consultancy Firm?
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The ideal time to engage a financial advisory firm is before complications emerge: when establishing a private limited entity at the OCR, prior to registering for VAT with the IRD, when preparing loan applications for commercial banks, during revenue scaling beyond NPR 2 crore, or when structuring foreign investment equity under FITTA.
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-forest flex items-center gap-1.5">
          <i class="fa-solid fa-check text-emerald-600"></i> Risk Mitigation from Inception
        </div>
      </div>
    </div>

    <!-- Comparative Table: Featured Snippet Target -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="bg-forest px-6 py-4 text-white">
        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-300">Nepal Statutory Distinction (Featured Guide)</h4>
        <div class="text-lg font-serif font-bold text-ivory">Financial Consultant vs. Statutory Chartered Accountant (CA)</div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-[#FAF7F2] border-b border-slate-200 font-bold text-forest">
            <tr>
              <th class="py-3 px-5">Comparison Parameter</th>
              <th class="py-3 px-5 text-terracotta">Financial Consultant (Lalitpur Advisory)</th>
              <th class="py-3 px-5 text-slate-800">Statutory Chartered Accountant (CA)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-3 px-5 font-semibold text-forest">Primary Objective</td>
              <td class="py-3 px-5">Forward-looking strategy, tax optimization, and cash planning</td>
              <td class="py-3 px-5">Historical verification, audit certification, and ICAN compliance</td>
            </tr>
            <tr>
              <td class="py-3 px-5 font-semibold text-forest">Legal Mandate</td>
              <td class="py-3 px-5">Continuous operational advisory, outsourced CFO, and bookkeeping</td>
              <td class="py-3 px-5">Mandatory annual statutory audit under Companies Act 2063</td>
            </tr>
            <tr>
              <td class="py-3 px-5 font-semibold text-forest">Statutory Acts</td>
              <td class="py-3 px-5">Companies Act 2063, Income Tax Act 2058, VAT Act 2052</td>
              <td class="py-3 px-5">Nepal Chartered Accountants Act 2053 (ICAN regulation)</td>
            </tr>
            <tr>
              <td class="py-3 px-5 font-semibold text-forest">Engagement Cadence</td>
              <td class="py-3 px-5">Continuous year-round partnership and operational guidance</td>
              <td class="py-3 px-5">Independent retrospective review at fiscal year-end (Ashadh/Ashwin)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-2: COMMON FINANCIAL CHALLENGES
  ============================================================ -->
  <section id="financial-challenges-nepal" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Nepal Market Realities</span>
      <!-- Approved H2-2 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Common Financial Challenges Businesses Face in Nepal
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        Operating across the Kathmandu Valley and Nepal's commercial hubs presents distinctive hurdles requiring localized regulatory navigation.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- H3-2a -->
      <div class="p-6 bg-white rounded-xl border-l-4 border-l-terracotta border-t border-r border-b border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2">
          Navigating Nepal's Complex Tax and Regulatory Environment
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Nepal's tax legislation undergoes extensive annual amendments via the government's Finance Act. Withholding tax (TDS) schedules, mandatory VAT Annexure e-filings, and strict quarterly advance tax dates (Poush 15, Chaitra 15, Ashadh 15) carry immediate 15% interest penalties and late fines if missed by even one business day.
        </p>
      </div>

      <!-- H3-2b -->
      <div class="p-6 bg-white rounded-xl border-l-4 border-l-terracotta border-t border-r border-b border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2">
          Cash Flow Problems and Poor Financial Planning in SMEs
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Over 70% of Nepali private enterprises struggle with prolonged debtor collection cycles (averaging 75–120 days) and seasonal revenue fluctuations. Without structured cash forecasting and working capital buffers, profitable paper balance sheets frequently suffer devastating liquidity freezes during festival bonus or tax installment cycles.
        </p>
      </div>

      <!-- H3-2c -->
      <div class="p-6 bg-white rounded-xl border-l-4 border-l-terracotta border-t border-r border-b border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2">
          The Cost of Getting Business Registration Wrong in Nepal
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Inappropriate corporate structuring—such as registering a sole proprietorship when equity expansion is needed, miscalculating authorized share capital at the OCR, or ignoring mandatory local ward municipality certifications—incurs substantial legal fees and operational halts during subsequent corporate restructuring.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-3: CORE FINANCIAL CONSULTING SERVICES
  ============================================================ -->
  <section id="our-services" class="space-y-8">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Practice Verticals</span>
      <!-- Approved H2-3 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Our Financial Consultancy Services in Lalitpur, Nepal
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        We deliver end-to-end financial consultancy for businesses and high-net-worth individuals across Nepal, aligning operations with the Inland Revenue Department (IRD), Office of Company Registrar (OCR), and Nepal Rastra Bank (NRB).
      </p>
    </div>

    <div class="space-y-6">

      <!-- 3a: Tax Planning -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">1</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Tax Planning and IRD Compliance Advisory
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          Proactive tax strategies that legally minimize liabilities while maintaining immaculate standing with Inland Revenue Offices (IROs) across Nepal.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">VAT Registration, Filing and Reconciliation</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Timely Form 13 monthly filings on the IRD portal, purchase/sales register reconciliations under Section 16 of the VAT Act, credit adjustments, and handling departmental audit notices.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Corporate Income Tax and Advance Tax Planning</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Structuring corporate tax liabilities (standard 25%, manufacturing 20%), modeling quarterly installments (40% Poush, 70% Chaitra, 100% Ashadh), and optimizing allowable deductible expenses under Sections 13-21 of the Income Tax Act.
            </p>
          </div>
        </div>
      </div>

      <!-- 3b: Accounting & Bookkeeping -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">2</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Accounting and Bookkeeping Services
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          Systematic, cloud-supported record-keeping giving management granular clarity on operational metrics and margins.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Monthly Management Accounts and Ledger Maintenance</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Standardized journalizing, bank reconciliations, aging analysis of accounts receivable, monthly Profit & Loss, and Balance Sheet reporting delivered within the first week of every month.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Nepal Financial Reporting Standards (NFRS) Compliance</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Full alignment with NFRS and NAS standards mandated by the Accounting Standards Board (ASB) of Nepal, preparing statutory schedules for audit certification.
            </p>
          </div>
        </div>
      </div>

      <!-- 3c: Business Registration -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">3</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Business Registration and Licensing
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          End-to-end statutory entity formation and industry licensing across the Kathmandu Valley and provincial capitals.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Private Limited Company Registration at OCR</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              OCR name clearance, preparation of Articles of Association (AoA) and Memorandum of Association (MoA), digital token submission, and company incorporation certificate issuance.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Industry-Specific Licensing and Ward-Level Permits</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Securing municipal ward registration, Department of Industry (DOI) manufacturing permits, Department of Tourism licenses, and Cottage and Small Industry permits.
            </p>
          </div>
        </div>
      </div>

      <!-- 3d: Personal Finance -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">4</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Personal Financial Planning and Wealth Management
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          Holistic wealth accumulation, emergency hedging, and tax minimization for salaried professionals, tech freelancers, and entrepreneurs.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Budget Planning and Emergency Fund Strategy</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Constructing tailored cash allocations (50/30/20 principle adapted for Nepal's living costs), emergency liquid reserves in high-yield savings instruments, and liability reduction schedules.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Retirement and Long-Term Savings Planning for Nepalis</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Evaluating Citizen Investment Trust (CIT), Provident Fund (EPF), mutual fund portfolios, and life insurance tax deductions (up to NPR 40,000 allowance under Section 63).
            </p>
          </div>
        </div>
      </div>

      <!-- 3e: Business Consulting & CFO -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">5</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Business Financial Consulting and CFO Advisory
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          Executive-level financial leadership for scaling enterprises without the payroll burden of an in-house full-time CFO.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Cash Flow Forecasting for Growing Businesses</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Detailed rolling cash-flow models assessing burn rate, runway, debtor collection efficiency, and strategic capital expenditure thresholds.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Financial Feasibility Studies and Project Valuation</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Comprehensive Detailed Project Reports (DPR), discounted cash flow (DCF) valuations, and financial viability studies required for bank consortium financing or venture equity raising.
            </p>
          </div>
        </div>
      </div>

      <!-- 3f: Legal Compliance -->
      <div class="p-6 sm:p-8 bg-[#FAF7F2] rounded-xl border border-stone">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-sm">6</span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-forest">
            Legal Compliance and Regulatory Support
          </h3>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5">
          Total institutional security ensuring absolute conformity with labor, investment, and central bank directives.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Labour Act 2074 and Social Security Fund (SSF) Compliance</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Statutory 31% SSF payroll administration (20% employer + 11% employee contribution), employment contracts, and labor inspection preparedness.
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <h4 class="text-xs sm:text-sm font-bold text-terracotta mb-1.5">Foreign Direct Investment (FDI) Advisory and NRB Approvals</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Foreign investment approvals under FITTA 2019, Department of Industry clearance, Nepal Rastra Bank foreign exchange account setups, and profit repatriation structuring.
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ============================================================
       H2-4: WHO BENEFITS FROM FINANCIAL CONSULTANCY
  ============================================================ -->
  <section id="who-we-serve" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Client Profiles</span>
      <!-- Approved H2-4 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Who Benefits from Financial Consultancy in Nepal?
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        Our services are calibrated for exact lifecycle stages, whether you are bootstrapping an agile software firm or navigating capital repatriation for an overseas parent entity.
      </p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- H3-4a -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
            <i class="fa-solid fa-rocket"></i>
          </div>
          <h3 class="text-base font-bold text-forest mb-2">Small and Medium Enterprises (SMEs) and Startups</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Eliminate costly administrative errors, streamline tax filings, and establish professional financial reporting essential for securing bank debt or angel investment.
          </p>
        </div>
        <span class="text-terracotta text-xs font-bold mt-4 block">Scalable CFO Support &rarr;</span>
      </div>

      <!-- H3-4b -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <h3 class="text-base font-bold text-forest mb-2">Individual Professionals and Salaried Employees</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Optimize income tax allowances, structure remote tech consulting income (foreign inward remittance tax rates), and execute personalized wealth-building plans.
          </p>
        </div>
        <span class="text-terracotta text-xs font-bold mt-4 block">Personal Tax Strategy &rarr;</span>
      </div>

      <!-- H3-4c -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
            <i class="fa-solid fa-globe"></i>
          </div>
          <h3 class="text-base font-bold text-forest mb-2">Foreign Investors and FDI Companies Entering Nepal</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Gain bilingual, reliable navigation through the Department of Industry (DOI), NRB exchange regulations, and Double Taxation Avoidance Agreements (DTAA).
          </p>
        </div>
        <span class="text-terracotta text-xs font-bold mt-4 block">Cross-Border Ease &rarr;</span>
      </div>

      <!-- H3-4d -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
            <i class="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h3 class="text-base font-bold text-forest mb-2">NGOs, INGOs and Non-Profit Organisations Operating in Nepal</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Ensure strict Social Welfare Council (SWC) compliance, project fund accounting, withholding tax exemptions, and immaculate audit trails for international donors.
          </p>
        </div>
        <span class="text-terracotta text-xs font-bold mt-4 block">Institutional Rigor &rarr;</span>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-5: NEPAL FINANCIAL LANDSCAPE
  ============================================================ -->
  <section id="nepal-financial-landscape" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Nepal Regulatory Framework</span>
      <!-- Approved H2-5 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Understanding the Financial Landscape in Nepal
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        A grounded understanding of Nepal's unique statutory framework is indispensable for sound financial leadership.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- H3-5a -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2 flex items-center gap-2">
          <i class="fa-solid fa-calendar-days text-terracotta"></i>
          Nepal's Fiscal Year: Shrawan to Ashad and Key Compliance Deadlines
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
          Nepal follows the Bikram Sambat calendar. The financial year commences on <strong>1st Shrawan</strong> and concludes on <strong>31st Ashadh</strong> (approx. July 16 to July 15). Key statutory milestones:
        </p>
        <ul class="text-xs text-slate-700 space-y-1.5 border-l-2 border-terracotta pl-3">
          <li><strong>25th of Every Month:</strong> Monthly VAT-13 submission & TDS deposit at the IRD.</li>
          <li><strong>Poush-End (mid-Jan):</strong> 1st Advance Tax Installment (40%) & Annual Financial Statements filing.</li>
          <li><strong>Chaitra-End (mid-April):</strong> 2nd Advance Tax Installment (cumulative 70%).</li>
          <li><strong>Ashadh-End (mid-July):</strong> Final Advance Tax Installment (100%) & Fiscal Year-End closure.</li>
        </ul>
      </div>

      <!-- H3-5b -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2 flex items-center gap-2">
          <i class="fa-solid fa-landmark text-terracotta"></i>
          Key Regulatory Bodies: IRD, OCR, NRB, ICAN and Their Roles
        </h3>
        <div class="text-xs sm:text-sm text-slate-600 space-y-2">
          <p><strong>• IRD (Inland Revenue Department):</strong> Enforces the Income Tax Act 2058 and Value Added Tax Act 2052 across 84+ IROs.</p>
          <p><strong>• OCR (Office of the Company Registrar):</strong> Governs corporate governance, shareholder registries, and Section 80 annual returns under the Companies Act 2063.</p>
          <p><strong>• NRB (Nepal Rastra Bank):</strong> Oversees macroeconomic stability, foreign currency loans, and FDI equity inflows.</p>
          <p><strong>• ICAN (Institute of Chartered Accountants):</strong> Accredits auditing professionals and mandates accounting standards via ASB Nepal.</p>
        </div>
      </div>

      <!-- H3-5c -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2 flex items-center gap-2">
          <i class="fa-solid fa-receipt text-terracotta"></i>
          PAN vs. VAT in Nepal: Which Does Your Business Need?
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
          Every commercial entity must possess a <strong>Permanent Account Number (PAN)</strong>. However, mandatory <strong>Value Added Tax (VAT)</strong> registration triggers when annual transactions surpass specific statutory thresholds:
        </p>
        <div class="bg-[#FAF7F2] p-3 rounded border border-stone text-xs space-y-1 text-slate-800">
          <div class="flex justify-between"><span>Sale of Goods:</span> <span class="font-bold text-terracotta">Exceeding NPR 50 Lakhs</span></div>
          <div class="flex justify-between"><span>Provision of Services:</span> <span class="font-bold text-terracotta">Exceeding NPR 20 Lakhs</span></div>
          <div class="flex justify-between"><span>Mixed (Goods & Services):</span> <span class="font-bold text-terracotta">Exceeding NPR 20 Lakhs</span></div>
        </div>
      </div>

      <!-- H3-5d -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-bold text-forest mb-2 flex items-center gap-2">
          <i class="fa-solid fa-gavel text-terracotta"></i>
          Nepal Companies Act 2063 and Financial Reporting Obligations
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pursuant to <em>Section 109 of the Companies Act 2063</em>, every registered private limited company must maintain accurate books of accounts at its registered office on an accrual basis. Companies must submit an audited balance sheet, profit and loss account, cash flow statement, and director's report to the OCR within <strong>6 months of the close of each fiscal year (Poush-end)</strong> to avoid steep compounding fines and administrative freeze.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-6: INDUSTRY-SPECIFIC CONSULTING
  ============================================================ -->
  <section id="industry-consultancy" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Industry Verticals</span>
      <!-- Approved H2-6 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Financial Consultancy for Key Industries in Nepal
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        Different sectors face markedly different tax rules, reporting covenants, and cash dynamics under Nepali commercial jurisprudence.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- H3-6a -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
          <i class="fa-solid fa-mountain-sun"></i>
        </div>
        <h3 class="text-base font-bold text-forest mb-2">Tourism, Trekking and Hospitality Business Finance</h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Managing high seasonal liquidity variations, foreign convertible currency accounting, Nepal Tourism Board (NTB) fees, trekking permit royalties, and input VAT recovery on hospitality infrastructure investments.
        </p>
      </div>

      <!-- H3-6b -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
          <i class="fa-solid fa-ship"></i>
        </div>
        <h3 class="text-base font-bold text-forest mb-2">Trading, Import-Export and Customs Duty Advisory</h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Navigating Birgunj/Dry Port customs valuation benchmarks, Advance Income Tax (AIT) credits, letter of credit (LC) hedging with commercial banks, and multi-tier wholesale inventory costing under FIFO models.
        </p>
      </div>

      <!-- H3-6c -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
          <i class="fa-solid fa-laptop-code"></i>
        </div>
        <h3 class="text-base font-bold text-forest mb-2">IT Companies and Digital Business Tax Structuring in Nepal</h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Leveraging concessional income tax incentives for software exporters, navigating 10% foreign inward remittance tax limits, intellectual property (IP) structuring, and compliant transfer pricing frameworks.
        </p>
      </div>

      <!-- H3-6d -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div class="w-9 h-9 rounded bg-[#FAF7F2] text-terracotta flex items-center justify-center text-sm mb-3 border border-stone font-bold">
          <i class="fa-solid fa-trowel-bricks"></i>
        </div>
        <h3 class="text-base font-bold text-forest mb-2">Construction and Real Estate Financial Planning</h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Managing Percentage of Completion Method (PoCM) under NAS 11, joint-venture tax implications, retention money accounting, and high-capital real estate capital gains tax strategies.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-7: LOCAL AUTHORITY & NATIONWIDE REACH
  ============================================================ -->
  <section id="lalitpur-nepal-service" class="p-8 bg-[#FAF7F2] rounded-xl border border-stone space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Geography & Accessibility</span>
      <!-- Approved H2-7 -->
      <h2 class="text-2xl sm:text-3xl font-serif font-bold text-forest mt-1 mb-2">
        Financial Consultancy in Lalitpur: Serving All of Nepal
      </h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed">
        While our headquarters anchor Lalitpur's premier financial corridor, our client relationships and service infrastructure encompass every province of Nepal.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- H3-7a -->
      <div class="p-5 bg-white rounded-lg border border-slate-200">
        <h3 class="text-sm font-bold text-forest mb-2">
          Why Lalitpur is Nepal's Hub for Professional Financial Services
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          The Pulchowk-Kumaripati commercial stretch hosts leading commercial banks, international development organisations, engineering institutions, and progressive startups—placing us right alongside Nepal's corporate decision-makers.
        </p>
      </div>

      <!-- H3-7b -->
      <div class="p-5 bg-white rounded-lg border border-slate-200">
        <h3 class="text-sm font-bold text-forest mb-2">
          Serving Clients Across Kathmandu Valley, Province 1, Gandaki, Lumbini and Beyond
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          From tea producers in Koshi and hospitality operators in Pokhara to trading businesses in Birgunj and industrial manufacturers in Butwal/Bhairahawa, our advisory network is truly national.
        </p>
      </div>

      <!-- H3-7c -->
      <div class="p-5 bg-white rounded-lg border border-slate-200">
        <h3 class="text-sm font-bold text-forest mb-2">
          Remote and Online Financial Consulting Available Nationwide
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Through secure cloud bookkeeping systems, virtual advisory sessions, and digital portal integrations, entrepreneurs from Dhangadhi to Ilam receive instantaneous financial advisory without travel overhead.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-8: TRUST, CREDENTIALS & E-E-A-T
  ============================================================ -->
  <section id="why-choose-us" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Institutional Trust</span>
      <!-- Approved H2-8 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        Why Choose Financial Consultancy Lalitpur?
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        We bridge the gap between abstract academic accounting and the practical ground realities of building a profitable, legally unassailable business in Nepal.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- H3-8a -->
      <div class="p-5 bg-white rounded-xl border border-slate-200 flex gap-4">
        <div class="text-xl text-terracotta"><i class="fa-solid fa-graduation-cap"></i></div>
        <div>
          <h3 class="text-sm font-bold text-forest mb-1">Our Team: Qualified Financial Experts and Management Consultants</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Our advisors hold premier qualifications in commerce, finance, and corporate taxation. We pair technical tax expertise with operational business consulting.
          </p>
        </div>
      </div>

      <!-- H3-8b -->
      <div class="p-5 bg-white rounded-xl border border-slate-200 flex gap-4">
        <div class="text-xl text-terracotta"><i class="fa-solid fa-tags"></i></div>
        <div>
          <h3 class="text-sm font-bold text-forest mb-1">Transparent Pricing with No Hidden Fees</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            We provide clear, scope-locked written engagements. You will never encounter unexpected invoice add-ons for routine queries or phone consultations.
          </p>
        </div>
      </div>

      <!-- H3-8c -->
      <div class="p-5 bg-white rounded-xl border border-slate-200 flex gap-4">
        <div class="text-xl text-terracotta"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
          <h3 class="text-sm font-bold text-forest mb-1">100% Compliance &mdash; Aligned with ICAN, IRD and OCR Standards</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Strict adherence to professional ethics and statutory limits. We maintain zero-tolerance for non-compliant shortcuts that expose directors to liability.
          </p>
        </div>
      </div>

      <!-- H3-8d -->
      <div class="p-5 bg-white rounded-xl border border-slate-200 flex gap-4">
        <div class="text-xl text-terracotta"><i class="fa-solid fa-comments"></i></div>
        <div>
          <h3 class="text-sm font-bold text-forest mb-1">What Our Clients Say: Testimonials from Nepal Businesses</h3>
          <p class="text-xs text-slate-600 leading-relaxed italic">
            "Lalitpur Financial Advisory structured our company registration and IRD filings flawlessly. Their monthly cash forecasts prevented critical capital pinches during our peak festive season." &mdash; Tech Founder, Patan.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-9: ENGAGEMENT PROCESS
  ============================================================ -->
  <section id="our-process" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Client Journey</span>
      <!-- Approved H2-9 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-3">
        How Our Financial Consultancy Engagement Works
      </h2>
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        A structured, predictable 4-stage pathway into organized, high-performing financial governance.
      </p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Step 1 / H3-9a -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative">
        <div class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-xs mb-3">1</div>
        <h3 class="text-sm font-bold text-forest mb-1.5">Step 1: Free Initial Consultation</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          A confidential 30-minute diagnostic session to assess your business model, current bookkeeping state, and immediate compliance bottlenecks.
        </p>
      </div>

      <!-- Step 2 / H3-9b -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative">
        <div class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-xs mb-3">2</div>
        <h3 class="text-sm font-bold text-forest mb-1.5">Step 2: Financial Audit and Diagnosis</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Comprehensive review of historical tax returns, IRD ledger statements, OCR compliance records, and debt schedules to isolate concealed liabilities.
        </p>
      </div>

      <!-- Step 3 / H3-9c -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative">
        <div class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-xs mb-3">3</div>
        <h3 class="text-sm font-bold text-forest mb-1.5">Step 3: Custom Strategy & Implementation</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Tailored accounting systems, cloud bookkeeping setup, standard tax checklists, and calibrated cash flow forecasting tools.
        </p>
      </div>

      <!-- Step 4 / H3-9d -->
      <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative">
        <div class="w-8 h-8 rounded bg-forest text-ivory flex items-center justify-center font-bold text-xs mb-3">4</div>
        <h3 class="text-sm font-bold text-forest mb-1.5">Step 4: Ongoing Advisory & Support</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Continuous monthly management accounts, proactive tax deadline alerts, year-round CFO advice, and seamless audit coordination with statutory CAs.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-10: CTA SECTION
  ============================================================ -->
  <section id="book-consultation" class="p-8 sm:p-12 bg-forest text-white rounded-2xl shadow-xl space-y-8">
    <div class="max-w-3xl">
      <span class="inline-flex items-center gap-1.5 bg-white/10 text-ivory text-xs px-3 py-1 rounded-full font-medium mb-3 border border-white/20">
        <i class="fa-solid fa-bolt text-terracotta"></i> Direct Advisory Engagement
      </span>
      <!-- Approved H2-10 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
        Book Your Free Financial Consultancy Session Today
      </h2>
      <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
        Gain immediate clarity on your taxes, bookkeeping, and business structure. Speak directly with a qualified financial advisor at our Pulchowk office or via video conference.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-center pt-2">
      <!-- H3-10a -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-ivory">
          Talk to a Financial Expert &mdash; No Commitment Required
        </h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          Schedule a zero-obligation consultation. We'll identify your three highest tax or compliance exposure risks in under 30 minutes.
        </p>
        <div class="space-y-2 text-xs text-slate-200 pt-2">
          <p class="flex items-center gap-2"><i class="fa-solid fa-phone text-sky-400"></i> Landline: +977-1-5542100</p>
          <p class="flex items-center gap-2"><i class="fa-brands fa-whatsapp text-emerald-400"></i> WhatsApp: +977-9851082345</p>
          <p class="flex items-center gap-2"><i class="fa-solid fa-location-dot text-sky-400"></i> Apex Commercial Complex, Pulchowk-Kumaripati, Lalitpur</p>
        </div>
        <div class="pt-2">
          <button onclick="document.getElementById('consultation-modal').classList.remove('hidden')" class="btn-primary text-xs py-2.5 px-5">
            <i class="fa-solid fa-calendar-check mr-1.5"></i> Open Booking Modal
          </button>
        </div>
      </div>

      <!-- H3-10b -->
      <div class="bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-md">
        <h3 class="text-base font-bold text-forest mb-1">
          Request a Custom Quote for Your Business
        </h3>
        <p class="text-xs text-slate-500 mb-4">Complete this quick brief and our practice director will respond promptly.</p>
        
        <form onsubmit="event.preventDefault(); alert('Thank you! Your inquiry has been submitted. Our practice team will contact you within 2 business hours.');" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Your Full Name *</label>
            <input type="text" required placeholder="e.g. Ramesh Shrestha" class="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-forest outline-none">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
              <input type="tel" required placeholder="98510..." class="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-forest outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Service Required *</label>
              <select class="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-forest outline-none bg-white">
                <option>Tax Planning & IRD</option>
                <option>Accounting & Bookkeeping</option>
                <option>Company Registration (OCR)</option>
                <option>Outsourced CFO Advisory</option>
                <option>Personal Financial Planning</option>
              </select>
            </div>
          </div>
          <button type="submit" class="w-full btn-primary py-2.5 font-bold uppercase tracking-wide text-xs mt-2">
            Submit Request for Free Advisory &rarr;
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- ============================================================
       H2-11: COMPREHENSIVE FAQ SECTION
  ============================================================ -->
  <section id="faq" class="space-y-6">
    <div>
      <span class="text-xs font-bold text-terracotta uppercase tracking-wider">Frequently Asked Questions</span>
      <!-- Approved H2-11 -->
      <h2 class="text-2xl sm:text-4xl font-serif font-bold text-forest mt-1 mb-2">
        Frequently Asked Questions About Financial Consultancy in Nepal
      </h2>
      <p class="text-slate-700 text-xs sm:text-sm">
        Direct answers to common questions regarding fees, statutory audits, company incorporation, and legal requirements.
      </p>
    </div>

    <div class="space-y-3">
      <!-- H3-11a -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group" open>
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">What Does a Financial Consultancy Firm Do in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          A financial consultancy firm in Nepal provides comprehensive advisory covering taxation, corporate registrations, internal bookkeeping controls, and strategic investment planning. Unlike historical auditors who inspect the past once a year, a financial consultancy acts as a continuous operational partner—monitoring rolling cash flow, filing monthly VAT and TDS returns to the IRD, preparing OCR annual reports, and preventing statutory penalties before they occur.
        </p>
      </details>

      <!-- H3-11b -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">How Much Does Financial Consultancy Cost in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Financial consultancy costs in Nepal depend on the scope and size of your operation. Routine monthly bookkeeping and tax compliance for small businesses typically ranges from <strong>NPR 3,000 to NPR 10,000 per month</strong>. Comprehensive outsourced CFO services and cash modeling range from <strong>NPR 20,000 to NPR 60,000 monthly</strong>. Company incorporation at the OCR is quoted on fixed project packages starting from <strong>NPR 15,000</strong> plus statutory government registry fees.
        </p>
      </details>

      <!-- H3-11c -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">Is Financial Consultancy Different from an Audit in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Yes. Under the <em>Nepal Chartered Accountants Act 2053</em>, only Chartered Accountants registered with ICAN can perform statutory external audits and issue legal audit opinions. A financial consultancy provides management consulting, tax strategy, and book preparation. We ensure your ledgers, invoices, and tax credits are fully compliant so that your independent statutory CA audit passes smoothly without qualification or adverse findings.
        </p>
      </details>

      <!-- H3-11d -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">Can a Financial Consultancy Help Me Register a Company in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Yes. Lalitpur Financial Advisory coordinates the entire corporate lifecycle at the Office of the Company Registrar (OCR). This includes digital name clearance, drafting Articles of Association (AoA) and Memorandum of Association (MoA), securing municipal ward business certificates, acquiring business PAN/VAT at the Inland Revenue Office, and opening corporate bank accounts.
        </p>
      </details>

      <!-- H3-11e -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">Do I Need a Financial Consultant If I'm a Freelancer or Sole Trader?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Yes. In Nepal, individuals earning above NPR 5 lakhs annually are legally mandated to register for PAN and declare their income. Freelancers receiving overseas remittances benefit significantly from advisory on foreign inward remittance tax rates (10% final withholding tax where applicable), allowable expense deductions, and personal retirement tax shields under the Income Tax Act.
        </p>
      </details>

      <!-- H3-11f -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">How Do I Choose the Right Financial Consultancy Firm in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Prioritize firms with: (1) Verified experience with local regulatory authorities (IRD, OCR, NRB, ICAN); (2) Transparent, written fixed-fee billing agreements; (3) Transparent operational methodologies without promises of illegal tax evasion; and (4) Multidisciplinary capabilities spanning accounting, corporate law, and growth cash modeling.
        </p>
      </details>

      <!-- H3-11g -->
      <details class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group">
        <summary class="font-bold text-forest cursor-pointer flex justify-between items-center text-sm sm:text-base list-none">
          <h3 class="text-sm sm:text-base font-bold text-forest">Can Foreign Nationals Get Financial Consultancy Services in Nepal?</h3>
          <span class="text-terracotta text-lg font-bold group-open:rotate-45 transition-transform duration-200">+</span>
        </summary>
        <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          Absolutely. We routinely counsel foreign individual investors, international NGOs, and multinational branch offices entering Nepal under the <em>Foreign Investment and Technology Transfer Act (FITTA 2019)</em>. We assist with Department of Industry (DOI) approvals, Nepal Rastra Bank foreign currency permissions, and dividend repatriation structuring.
        </p>
      </details>
    </div>
  </section>

</article>
`;
  }

  // ROUTING CONTROLLER
  // ==========================================

  function handleRoute() {
    const currentPath = getCleanPath();

    // Dedicated Financial Consultancy Landing Route (covers all alias routes)
    if (
      currentPath === '/financial-consultancy/' || 
      currentPath === '/financial-consultancy' ||
      currentPath === '/financial-consultancy-services-nepal/' ||
      currentPath === '/financial-consultancy-services-nepal'
    ) {
      root.innerHTML = renderFinancialConsultancyLanding();
      document.title = 'Expert Financial Consultancy Services in Nepal | Lalitpur Financial Advisory';
      const bar = document.getElementById('breadcrumb-bar');
      const list = document.getElementById('breadcrumb-list');
      if (bar && list) {
        bar.classList.remove('hidden');
        list.innerHTML = `
          <a href="/" class="nav-link hover:text-forest transition"><i class="fa-solid fa-house text-slate-400"></i> Home</a> 
          <span class="text-slate-300">/</span> 
          <a href="/services/" class="nav-link hover:text-forest transition">Services Hub</a> 
          <span class="text-slate-300">/</span> 
          <span class="text-slate-700 font-semibold">Financial Consultancy</span>
        `;
      }
      window.scrollTo(0, 0);
      return;
    }

    const page = data.pages.find(p => normalizeRoute(p.url) === currentPath);

if (!page) {
      root.innerHTML = `
        <div class="py-24 px-4 text-center space-y-4">
          <h1 class="text-4xl font-serif font-bold text-forest">Page Not Found</h1>
          <p class="text-slate-500 text-xs sm:text-sm">The requested route '${currentPath}' could not be located in our directory.</p>
          <div class="pt-2">
            <a href="/" class="nav-link inline-block btn-primary text-xs px-5 py-2.5">Return to Home Directory</a>
          </div>
        </div>
      `;
      document.title = 'Page Not Found | ' + data.agency.name;
      return;
    }

    updateMeta(page);

    // Dynamic Render Dispatch
    if (page.type === 'Home Page') {
      root.innerHTML = renderHome(page);
    } else if (page.type === 'Services Hub') {
      root.innerHTML = renderServicesHub(page);
    } else if (page.type === 'money') {
      root.innerHTML = renderMoneyPage(page);
    } else if (page.type === 'article') {
      root.innerHTML = renderArticle(page);
    } else if (page.type === 'Blog Hub') {
      root.innerHTML = renderBlogHub(page);
    } else if (page.type === 'Trust Page') {
      root.innerHTML = renderTrustPage(page);
    } else {
      root.innerHTML = renderTrustPage(page);
    }

    window.scrollTo(0, 0);
    bindPageEvents(page);
  }

  // Bind interactive widgets on the rendered page
  function bindPageEvents(page) {
    // 1. Budget Calculator Event Binding
    const bSalary = document.getElementById('budget-salary');
    if (bSalary) {
      function updateBudget() {
        const inputs = {
          salary: document.getElementById('budget-salary').value,
          sideIncome: document.getElementById('budget-side').value,
          otherIncome: document.getElementById('budget-other').value,
          housing: document.getElementById('budget-rent').value,
          groceries: document.getElementById('budget-food').value,
          utilities: document.getElementById('budget-utilities').value,
          loanEmi: document.getElementById('budget-emi').value,
          dining: document.getElementById('budget-leisure').value,
          shopping: 0,
          leisure: 0,
          transport: 0,
          health: 0,
          education: 0
        };
        const res = calcs.calculatePersonalBudget(inputs);
        const box = document.getElementById('budget-results-box');
        if (!box) return;

        const isSurplus = res.netBalance >= 0;
        box.innerHTML = `
          <div class="flex flex-wrap justify-between items-center pb-3 border-b border-slate-200">
            <div>
              <span class="text-xs text-slate-500 block">Monthly Net Balance:</span>
              <strong class="text-xl sm:text-2xl font-serif ${isSurplus ? 'text-emerald-700' : 'text-rose-700'}">${formatNPR(res.netBalance)} (${res.status})</strong>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 block">Savings Rate:</span>
              <strong class="text-lg font-bold text-forest">${res.savingsRate}%</strong>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs pt-1">
            <div class="p-2.5 bg-[#FAF7F2] rounded border border-stone">
              <span class="text-slate-500 block text-[11px]">3-Month Emergency Reserve Target:</span>
              <strong class="text-forest">${formatNPR(res.emergencyFund3M)}</strong>
            </div>
            <div class="p-2.5 bg-[#FAF7F2] rounded border border-stone">
              <span class="text-slate-500 block text-[11px]">6-Month Prudent Reserve Target:</span>
              <strong class="text-forest">${formatNPR(res.emergencyFund6M)}</strong>
            </div>
          </div>
          <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed font-light">
            <i class="fa-solid fa-lightbulb text-terracotta mr-1"></i> ${res.guidance}
          </p>
        `;
      }

      ['budget-salary', 'budget-side', 'budget-other', 'budget-rent', 'budget-food', 'budget-utilities', 'budget-emi', 'budget-leisure'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateBudget);
      });
      updateBudget();
    }

    // 2. Business Cash Flow Event Binding
    const cfOpening = document.getElementById('cf-opening');
    if (cfOpening) {
      function updateCashFlow() {
        const inputs = {
          openingCash: document.getElementById('cf-opening').value,
          cashSales: document.getElementById('cf-sales').value,
          arCollections: document.getElementById('cf-ar').value,
          payroll: document.getElementById('cf-payroll').value,
          inventoryCogs: document.getElementById('cf-cogs').value,
          rentUtilities: document.getElementById('cf-overhead').value,
          taxesStatutory: 0,
          loanDebt: 0,
          otherOperating: 0,
          otherInflows: 0
        };
        const res = calcs.calculateBusinessCashFlow(inputs);
        const box = document.getElementById('cf-results-box');
        if (!box) return;

        const isPositive = res.netCashFlow >= 0;
        box.innerHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-200">
            <div>
              <span class="text-[11px] text-slate-500 block">Monthly Net Cash Flow:</span>
              <strong class="text-lg font-serif ${isPositive ? 'text-emerald-700' : 'text-rose-700'}">${formatNPR(res.netCashFlow)}</strong>
            </div>
            <div>
              <span class="text-[11px] text-slate-500 block">Projected Closing Liquidity:</span>
              <strong class="text-lg font-serif text-forest">${formatNPR(res.closingBalance)}</strong>
            </div>
            <div>
              <span class="text-[11px] text-slate-500 block">Estimated Cash Runway:</span>
              <strong class="text-lg font-bold text-terracotta">${res.runwayMonths} ${typeof res.runwayMonths === 'number' || !isNaN(res.runwayMonths) ? 'Months' : ''}</strong>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1 text-xs">
            <span class="font-bold text-slate-700">Liquidity Status:</span>
            <span class="px-2 py-0.5 rounded font-bold text-xs ${res.healthIndicator === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : (res.healthIndicator === 'Caution' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')}">
              ${res.healthIndicator}
            </span>
          </div>
          <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed font-light">
            <i class="fa-solid fa-circle-info text-terracotta mr-1"></i> ${res.advice}
          </p>
        `;
      }

      ['cf-opening', 'cf-sales', 'cf-ar', 'cf-payroll', 'cf-cogs', 'cf-overhead'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCashFlow);
      });
      updateCashFlow();
    }

    // 3. Bookkeeping Checklist Event Binding
    const bkContainer = document.getElementById('bookkeeping-checklist-items');
    if (bkContainer) {
      function updateBKScore() {
        const checked = Array.from(document.querySelectorAll('.bk-item:checked')).map(el => el.value);
        const res = calcs.calculateBookkeepingReadiness(checked, 8);
        const box = document.getElementById('bk-score-box');
        if (!box) return;

        box.innerHTML = `
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span class="text-xs text-slate-500 block">Audit Readiness Benchmark:</span>
              <strong class="text-2xl font-serif text-forest">${res.score}% Readiness (${res.checkedCount}/8)</strong>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${res.badgeClass}">
              ${res.status}
            </span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-forest h-full transition-all duration-300" style="width: ${res.score}%"></div>
          </div>
          <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed font-light">
            <i class="fa-solid fa-clipboard-check text-terracotta mr-1"></i> ${res.recommendation}
          </p>
        `;
      }

      document.querySelectorAll('.bk-item').forEach(cb => cb.addEventListener('change', updateBKScore));
      updateBKScore();
    }

    // 4. Tax Readiness Checklist Event Binding
    const taxContainer = document.getElementById('tax-checklist-items');
    if (taxContainer) {
      function updateTaxScore() {
        const checked = Array.from(document.querySelectorAll('.tax-item:checked')).map(el => el.value);
        const res = calcs.calculateTaxDocumentReadiness(checked, 6);
        const box = document.getElementById('tax-score-box');
        if (!box) return;

        box.innerHTML = `
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span class="text-xs text-slate-500 block">IRD Compliance Score:</span>
              <strong class="text-2xl font-serif text-forest">${res.score}% (${res.checkedCount}/6 Items Verified)</strong>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${res.badgeClass}">
              ${res.status}
            </span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-terracotta h-full transition-all duration-300" style="width: ${res.score}%"></div>
          </div>
          <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed font-light">
            <i class="fa-solid fa-file-invoice text-terracotta mr-1"></i> ${res.advice}
          </p>
        `;
      }

      document.querySelectorAll('.tax-item').forEach(cb => cb.addEventListener('change', updateTaxScore));
      updateTaxScore();
    }

    // 5. Registration Pathway Selector Event Binding
    const regTabs = document.getElementById('reg-pathway-tabs');
    if (regTabs) {
      function updatePathway(type) {
        const p = calcs.resolveRegistrationPathway(type);
        const box = document.getElementById('reg-pathway-box');
        if (!box) return;

        box.innerHTML = `
          <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h4 class="font-serif font-bold text-base text-forest">${p.structureName}</h4>
              <span class="text-slate-500 text-xs">Primary Authority: ${p.authority}</span>
            </div>
            <span class="text-xs bg-[#FAF7F2] text-forest font-bold px-2.5 py-1 rounded border border-stone">
              Estimated: ${p.estimatedTime}
            </span>
          </div>
          <div>
            <div class="font-bold text-forest mb-2">Step-by-Step Registration Workflow:</div>
            <div class="space-y-1.5">
              ${p.steps.map(step => `
                <div class="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <i class="fa-solid fa-circle-check text-terracotta mt-0.5 text-[11px]"></i>
                  <span>${step}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <div class="font-bold text-forest mb-1.5">Mandatory Filing Documents:</div>
            <ul class="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              ${p.documents.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      document.querySelectorAll('.reg-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.reg-tab').forEach(b => {
            b.classList.remove('active', 'bg-forest', 'text-white');
            b.classList.add('bg-white', 'text-slate-700');
          });
          btn.classList.add('active', 'bg-forest', 'text-white');
          btn.classList.remove('bg-white', 'text-slate-700');
          updatePathway(btn.dataset.type);
        });
      });
      updatePathway('pvt_ltd');
    }

    // 6. Scope Selector Event Binding
    const scopeButtons = document.getElementById('scope-selector-buttons');
    if (scopeButtons) {
      const scopeData = {
        startup: {
          title: "Early-Stage Startup Financial Protocol",
          desc: "Designed for pre-seed founders and early ventures launching in Nepal.",
          disciplines: ["OCR Company Incorporation & Charter Drafting", "Ward Permitting & 13% VAT Setup", "Basic Chart of Accounts Setup", "12-Month Runway Modeling"],
          timeline: "2 – 3 Weeks Setup",
          feeModel: "Fixed Project-Based Fee"
        },
        sme: {
          title: "Growing SME Commercial Retainer",
          desc: "Tailored for operating companies scaling past NPR 50 Lakhs in annual revenue.",
          disciplines: ["Monthly Bookkeeping & Management Accounts", "Form 13 Monthly VAT Return Submissions", "Rolling 13-Week Cash Flow Projections", "Statutory Pre-Audit Ledgers File Prep"],
          timeline: "Monthly Ongoing Oversight",
          feeModel: "Retained Monthly Advisory Package"
        },
        enterprise: {
          title: "Enterprise Corporate Advisory & Governance",
          desc: "Comprehensive controllership for multi-branch and high-volume commercial enterprises.",
          disciplines: ["Working Capital Optimization & Credit Line Sizing", "Department of Industry FDI / EXIM Customs Clearances", "Bankable Detailed Project Reports (DPR)", "Internal Fraud Controls & Forensic Ledgers Review"],
          timeline: "Dedicated Advisory Steering Committee",
          feeModel: "Custom Corporate Retainer"
        },
        individual: {
          title: "Private Wealth & Tax Advisory",
          desc: "Individual tax optimization and household liquidity architecture.",
          disciplines: ["CIT & Social Security Fund (SSF) Tax Shields", "Section 63 Insurance Deduction Maximization", "NEPSE Asset Allocation & Demat Portfolio Structuring", "Estate & Debt Service Restructuring"],
          timeline: "Quarterly Wealth Review",
          feeModel: "Annual Advisory Retainer"
        }
      };

      function updateScope(key) {
        const item = scopeData[key] || scopeData.startup;
        const box = document.getElementById('scope-results-box');
        if (!box) return;

        box.innerHTML = `
          <div class="flex flex-wrap items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h4 class="font-serif font-bold text-base text-forest">${item.title}</h4>
              <p class="text-slate-500 text-xs">${item.desc}</p>
            </div>
            <span class="text-xs bg-[#FAF7F2] text-forest font-bold px-2 py-1 rounded border border-stone">
              ${item.feeModel}
            </span>
          </div>
          <div>
            <div class="font-bold text-forest mb-2">Recommended Advisory Disciplines:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${item.disciplines.map(d => `
                <div class="p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                  <i class="fa-solid fa-check text-terracotta text-[10px]"></i>
                  <span>${d}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      document.querySelectorAll('.scope-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.scope-btn').forEach(b => {
            b.classList.remove('active', 'border-2', 'border-forest', 'bg-[#FAF7F2]');
            b.classList.add('border', 'border-slate-200', 'bg-white');
          });
          btn.classList.add('active', 'border-2', 'border-forest', 'bg-[#FAF7F2]');
          btn.classList.remove('border-slate-200', 'bg-white');
          updateScope(btn.dataset.scale);
        });
      });
      updateScope('startup');
    }

    // 7. Blog Hub Live Search Filter
    const blogSearch = document.getElementById('blog-search-input');
    if (blogSearch) {
      blogSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('#blog-articles-grid article');
        cards.forEach(c => {
          const text = c.innerText.toLowerCase();
          c.style.display = text.includes(term) ? 'flex' : 'none';
        });
      });
    }

    // 8. Contact Page Form Binding
    const contactForm = document.getElementById('contact-page-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.showToast('Thank you! Your consultation request has been received. Our advisory team will contact you within 4 hours.');
        contactForm.reset();
      });
    }
  }

  // ==========================================
  // GLOBAL SEARCH ENGINE (Ctrl + K)
  // ==========================================

  function setupSearch() {
    const trigger = document.getElementById('search-trigger-btn');
    const modal = document.getElementById('search-modal');
    const closeBtn = document.getElementById('search-close-btn');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    if (!modal || !input || !results) return;

    function openSearch() {
      modal.classList.remove('hidden');
      input.value = '';
      renderSearchResults('');
      setTimeout(() => input.focus(), 50);
    }

    function closeSearch() {
      modal.classList.add('hidden');
    }

    if (trigger) trigger.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeSearch();
      }
    });

    input.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });

    function renderSearchResults(q) {
      if (!q) {
        results.innerHTML = `
          <div class="p-6 text-center text-slate-400 space-y-2">
            <i class="fa-solid fa-magnifying-glass text-2xl text-slate-300"></i>
            <p class="text-xs">Search across all 49 pages, statutory tax guides, and interactive tools...</p>
          </div>
        `;
        return;
      }

      const qLow = q.toLowerCase();
      const hits = data.pages.filter(p => {
        return (
          (p.h1 && p.h1.toLowerCase().includes(qLow)) ||
          (p.title && p.title.toLowerCase().includes(qLow)) ||
          (p.directAnswer && p.directAnswer.toLowerCase().includes(qLow)) ||
          (p.primaryKeyword && p.primaryKeyword.toLowerCase().includes(qLow)) ||
          ((p.secondaryKeywords || []).some(k => k.toLowerCase().includes(qLow)))
        );
      }).slice(0, 10);

      if (!hits.length) {
        results.innerHTML = `
          <div class="p-6 text-center text-slate-400">
            <p class="text-xs">No matching guides or practices found for '<span class="font-bold text-slate-700">${q}</span>'.</p>
          </div>
        `;
        return;
      }

      results.innerHTML = hits.map(hit => `
        <a href="${hit.url}" class="nav-link block p-3 rounded hover:bg-slate-50 transition group">
          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span class="font-bold text-forest bg-[#FAF7F2] px-2 py-0.5 rounded border border-stone">${hit.type}</span>
            <span>${hit.url}</span>
          </div>
          <div class="font-bold text-forest group-hover:text-terracotta text-sm">${hit.h1}</div>
          <div class="text-slate-500 text-xs line-clamp-1 mt-0.5">${hit.directAnswer || hit.metaDescription}</div>
        </a>
      `).join('');
    }
  }

  // ==========================================
  // CONSULTATION BOOKING MODAL
  // ==========================================

  function setupModals() {
    const modal = document.getElementById('consultation-modal');
    const closeBtn = document.getElementById('consultation-close-btn');
    const form = document.getElementById('consultation-form');
    const bookBtn = document.getElementById('book-consultation-btn');
    const mobileBookBtn = document.getElementById('mobile-book-btn');

    if (!modal) return;

    function openModal() {
      modal.classList.remove('hidden');
    }

    function closeModal() {
      modal.classList.add('hidden');
    }

    if (bookBtn) bookBtn.addEventListener('click', openModal);
    if (mobileBookBtn) mobileBookBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        window.showToast('Thank you! Your consultation appointment has been scheduled. Our Lalitpur desk will contact you with video/office details.');
        form.reset();
      });
    }
  }

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================

  function setupMobileDrawer() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('mobile-close-btn');

    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.add('hidden');
      });
    }

    // Close drawer when clicking a navigation link
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        drawer.classList.add('hidden');
      }
    });
  }

  // ==========================================
  // SPA CLIENT-SIDE CLICK INTERCEPTOR
  // ==========================================

  function setupLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a.nav-link');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle clean internal routes
      if (href.startsWith('/') && !href.startsWith('//')) {


        e.preventDefault();
        window.history.pushState({}, '', href);
        handleRoute();

        // Close search modal if open
        const sModal = document.getElementById('search-modal');
        if (sModal && !sModal.classList.contains('hidden')) {
          sModal.classList.add('hidden');
        }
      }
    });

    window.addEventListener('popstate', handleRoute);
  }

  // ==========================================
  // APPLICATION BOOTSTRAP
  // ==========================================

  function init() {
    setupLinks();
    setupSearch();
    setupModals();
    setupMobileDrawer();
    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
