// js/calculators.js - Interactive Financial Tools, Calculators & Checklists
// Pure client-side calculations in Nepalese Rupees (NPR). Zero external server data transmission.

window.FINANCIAL_TOOLS = {
  // Helper: Format NPR Currency according to standard South Asian / Nepali numeric system
  formatNPR: function(amount) {
    if (isNaN(amount) || amount === null) return "NPR 0";
    var isNegative = amount < 0;
    var absVal = Math.round(Math.abs(amount));
    var str = absVal.toString();
    var lastThree = str.substring(str.length - 3);
    var otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return (isNegative ? "-NPR " : "NPR ") + res;
  },

  // TOOL 1: Personal Monthly Budget Calculator (NPR)
  calculatePersonalBudget: function(inputs) {
    var salary = parseFloat(inputs.salary) || 0;
    var sideIncome = parseFloat(inputs.sideIncome) || 0;
    var otherIncome = parseFloat(inputs.otherIncome) || 0;
    var totalIncome = salary + sideIncome + otherIncome;

    var housing = parseFloat(inputs.housing) || 0;
    var groceries = parseFloat(inputs.groceries) || 0;
    var utilities = parseFloat(inputs.utilities) || 0;
    var transport = parseFloat(inputs.transport) || 0;
    var health = parseFloat(inputs.health) || 0;
    var education = parseFloat(inputs.education) || 0;
    var essentialExpenses = housing + groceries + utilities + transport + health + education;

    var dining = parseFloat(inputs.dining) || 0;
    var shopping = parseFloat(inputs.shopping) || 0;
    var leisure = parseFloat(inputs.leisure) || 0;
    var discretionaryExpenses = dining + shopping + leisure;

    var loanEmi = parseFloat(inputs.loanEmi) || 0;
    var savingsAlloc = parseFloat(inputs.savingsAlloc) || 0;
    var totalCommittedOutflows = essentialExpenses + discretionaryExpenses + loanEmi;

    var netBalance = totalIncome - totalCommittedOutflows;
    var savingsRate = totalIncome > 0 ? ((netBalance + savingsAlloc) / totalIncome) * 100 : 0;
    var emergencyFund3M = essentialExpenses * 3;
    var emergencyFund6M = essentialExpenses * 6;

    var status = netBalance >= 0 ? "Surplus" : "Deficit";
    var guidance = "";
    if (netBalance >= 0) {
      guidance = "Your monthly cash flow demonstrates a healthy surplus of " + this.formatNPR(netBalance) + ". Prioritize building your " + this.formatNPR(emergencyFund3M) + " 3-month liquid reserve in a high-yield savings account before speculative investments.";
    } else {
      guidance = "Your monthly outflows exceed income by " + this.formatNPR(Math.abs(netBalance)) + ". Review discretionary spending (" + this.formatNPR(discretionaryExpenses) + ") and high-interest debt EMIs to restore positive monthly cash flow.";
    }

    return {
      totalIncome: totalIncome,
      essentialExpenses: essentialExpenses,
      discretionaryExpenses: discretionaryExpenses,
      loanEmi: loanEmi,
      totalExpenses: totalCommittedOutflows,
      netBalance: netBalance,
      savingsRate: Math.max(0, Math.min(100, Math.round(savingsRate))),
      emergencyFund3M: emergencyFund3M,
      emergencyFund6M: emergencyFund6M,
      status: status,
      guidance: guidance
    };
  },

  // TOOL 2: Business Cash-Flow Planning Tool (NPR)
  calculateBusinessCashFlow: function(inputs) {
    var openingCash = parseFloat(inputs.openingCash) || 0;
    var cashSales = parseFloat(inputs.cashSales) || 0;
    var arCollections = parseFloat(inputs.arCollections) || 0;
    var otherInflows = parseFloat(inputs.otherInflows) || 0;
    var totalInflows = cashSales + arCollections + otherInflows;

    var inventoryCogs = parseFloat(inputs.inventoryCogs) || 0;
    var payroll = parseFloat(inputs.payroll) || 0;
    var rentUtilities = parseFloat(inputs.rentUtilities) || 0;
    var taxesStatutory = parseFloat(inputs.taxesStatutory) || 0;
    var loanDebt = parseFloat(inputs.loanDebt) || 0;
    var otherOperating = parseFloat(inputs.otherOperating) || 0;
    var totalOutflows = inventoryCogs + payroll + rentUtilities + taxesStatutory + loanDebt + otherOperating;

    var netCashFlow = totalInflows - totalOutflows;
    var closingBalance = openingCash + netCashFlow;
    var burnRate = netCashFlow < 0 ? Math.abs(netCashFlow) : 0;
    var runwayMonths = burnRate > 0 ? (openingCash > 0 ? (openingCash / burnRate).toFixed(1) : 0) : "Sustainable";

    var healthIndicator = closingBalance > (payroll * 2) ? "Healthy" : (closingBalance >= 0 ? "Caution" : "Critical Deficit");
    var advice = "";
    if (healthIndicator === "Healthy") {
      advice = "Working capital is stable with closing liquidity exceeding 2 months of payroll commitments.";
    } else if (healthIndicator === "Caution") {
      advice = "Liquidity is tight. Accelerate debtor collections (A/R) and negotiate vendor payment terms to protect payroll.";
    } else {
      advice = "Immediate cash shortfall detected. Formulate an emergency working capital bridge or credit facility.";
    }

    return {
      openingCash: openingCash,
      totalInflows: totalInflows,
      totalOutflows: totalOutflows,
      netCashFlow: netCashFlow,
      closingBalance: closingBalance,
      burnRate: burnRate,
      runwayMonths: runwayMonths,
      healthIndicator: healthIndicator,
      advice: advice
    };
  },

  // TOOL 3: Bookkeeping Readiness Score Calculator
  calculateBookkeepingReadiness: function(checkedItemIds, totalItemsCount) {
    var count = checkedItemIds ? checkedItemIds.length : 0;
    var total = totalItemsCount || 8;
    var score = Math.round((count / total) * 100);
    var status = "Immediate Attention Required";
    var badgeClass = "bg-rose-50 text-rose-800 border-rose-200";
    var recommendation = "High risk of audit delays and VAT scrutiny. Establish daily voucher filing and software reconciliation immediately.";

    if (score >= 80) {
      status = "Audit & Filing Ready";
      badgeClass = "bg-[#FAF7F2] text-forest border-stone";
      recommendation = "Excellent records organization. Your ledgers and supporting documents meet standard audit preparation benchmarks.";
    } else if (score >= 50) {
      status = "Action Recommended";
      badgeClass = "bg-terracotta-light text-terracotta-dark border-terracotta/40";
      recommendation = "Basic records exist, but missing monthly bank reconciliations or aged debtor tracking may slow statutory audits.";
    }

    return {
      checkedCount: count,
      totalCount: total,
      score: score,
      status: status,
      badgeClass: badgeClass,
      recommendation: recommendation
    };
  },

  // TOOL 4: Tax Document Readiness Score Calculator
  calculateTaxDocumentReadiness: function(checkedItemIds, totalItemsCount) {
    var count = checkedItemIds ? checkedItemIds.length : 0;
    var total = totalItemsCount || 6;
    var score = Math.round((count / total) * 100);
    var status = "High Compliance Risk";
    var badgeClass = "bg-rose-50 text-rose-800 border-rose-200";
    var advice = "Critical tax filings or tax bills are missing. Risk of IRD fines, late fee interest, or blocked tax clearance.";

    if (score >= 80) {
      status = "Compliant & Filing Ready";
      badgeClass = "bg-[#FAF7F2] text-forest border-stone";
      advice = "Your documentation aligns with IRD verification standards. Ready for advance tax submissions and annual returns.";
    } else if (score >= 50) {
      status = "Review Recommended";
      badgeClass = "bg-terracotta-light text-terracotta-dark border-terracotta/40";
      advice = "Review pending e-TDS deposits and obtain missing vendor tax invoices prior to tax year-end closing.";
    }

    return {
      checkedCount: count,
      totalCount: total,
      score: score,
      status: status,
      badgeClass: badgeClass,
      advice: advice
    };
  },

  // TOOL 5: Business Registration Pathway Resolver
  resolveRegistrationPathway: function(structure) {
    var pathway = {
      authority: "Office of Company Registrar (OCR) / कम्पनी रजिस्ट्रारको कार्यालय",
      structureName: "Private Limited Company (Pvt. Ltd.)",
      steps: [
        "1. Online Corporate Name Reservation via OCR Portal (ocr.gov.np)",
        "2. Drafting of Memorandum & Articles of Association (प्रबन्धपत्र तथा नियमावली)",
        "3. Digital Submission of Promoter Identity Documents & Verification",
        "4. Issuance of Formal Company Incorporation Certificate by OCR",
        "5. Local Municipal Ward Office Permitting (within 30 days of registration)",
        "6. Permanent Account Number (PAN) / 13% VAT Setup at Inland Revenue Department (IRD)",
        "7. Corporate Bank Account Opening & Share Lagat Certification at OCR"
      ],
      documents: [
        "Citizenship certificates of all shareholders / directors",
        "Recent passport-sized photographs of promoters",
        "Drafted Memorandum of Association (MOA) & Articles of Association (AOA)",
        "Registered office lease agreement with House Rent Tax receipt",
        "Ward recommendation or property title documentation"
      ],
      estimatedTime: "5 – 9 Business Days",
      statutoryAuthorityLinks: [
        { name: "Office of Company Registrar (OCR)", url: "https://ocr.gov.np" },
        { name: "Inland Revenue Department (IRD)", url: "https://ird.gov.np" }
      ]
    };

    if (structure === "sole_proprietorship") {
      pathway.structureName = "Sole Proprietorship / Individual Firm (एकलौटी फर्म)";
      pathway.authority = "Department of Commerce, Supplies & Consumer Protection / Local Municipal Ward Office";
      pathway.steps = [
        "1. Application submission to local Municipal Ward Office or Department of Commerce",
        "2. Physical site inspection and lease verification by municipal authorities",
        "3. Issuance of Local Business Permitting Certificate",
        "4. Personal/Business PAN registration at designated Inland Revenue Office (IRO)",
        "5. Commercial business bank account activation"
      ];
      pathway.estimatedTime = "2 – 4 Business Days";
    } else if (structure === "partnership") {
      pathway.structureName = "Partnership Firm (साझेदारी फर्म)";
      pathway.authority = "Department of Commerce, Supplies and Consumer Protection";
      pathway.steps = [
        "1. Formal Partnership Agreement drafting detailing profit/loss ratios and capital",
        "2. Firm registration at Department of Commerce or District Cottage Industry Office",
        "3. Ward Office commercial registration within municipal jurisdiction",
        "4. Entity PAN registration at Inland Revenue Department",
        "5. Joint commercial banking authorization"
      ];
      pathway.estimatedTime = "4 – 7 Business Days";
    } else if (structure === "fdi") {
      pathway.structureName = "Foreign Direct Investment (FDI) Company";
      pathway.authority = "Department of Industry (DOI) / Nepal Rastra Bank (NRB) / OCR";
      pathway.steps = [
        "1. Foreign Investment Approval via Department of Industry under FITTA 2019",
        "2. OCR Company Incorporation following preliminary DOI clearance",
        "3. Nepal Rastra Bank (NRB) capital inflow approval and foreign currency clearance",
        "4. Local Ward commercial permitting and IRD PAN/VAT registration",
        "5. Final foreign investment recording certification at NRB Foreign Exchange Dept"
      ];
      pathway.estimatedTime = "15 – 30 Business Days";
    }

    return pathway;
  },

  // TOOL 6: Nepal Income Tax Calculator (FY 2081/82)
  calculateIncomeTax: function(annualIncome, isMarried, hasSSF, citAmount, insuranceAmount) {
    var income = parseFloat(annualIncome) || 0;
    var cit = Math.min(parseFloat(citAmount) || 0, 300000, income / 3);
    var insurance = Math.min(parseFloat(insuranceAmount) || 0, 40000);
    var taxableIncome = Math.max(0, income - cit - insurance);

    var baseSlab = isMarried ? 600000 : 500000;
    var tax = 0;
    var breakdown = [];

    // 1st Slab
    var s1 = Math.min(taxableIncome, baseSlab);
    var r1 = hasSSF ? 0 : 0.01;
    var t1 = s1 * r1;
    tax += t1;
    breakdown.push({ slab: "Base Slab (" + (isMarried ? "Married NPR 6L" : "Single NPR 5L") + ")", amount: s1, rate: (r1 * 100) + "%", tax: t1 });

    // 2nd Slab: Next 200,000 @ 10%
    if (taxableIncome > baseSlab) {
      var s2 = Math.min(taxableIncome - baseSlab, 200000);
      var t2 = s2 * 0.10;
      tax += t2;
      breakdown.push({ slab: "Next NPR 2 Lakhs", amount: s2, rate: "10%", tax: t2 });
    }

    // 3rd Slab: Next 300,000 @ 20%
    var l2 = baseSlab + 200000;
    if (taxableIncome > l2) {
      var s3 = Math.min(taxableIncome - l2, 300000);
      var t3 = s3 * 0.20;
      tax += t3;
      breakdown.push({ slab: "Next NPR 3 Lakhs", amount: s3, rate: "20%", tax: t3 });
    }

    // 4th Slab: Next 10L (Single) or 9L (Married) up to 20L @ 30%
    var l3 = l2 + 300000; // 10L for single, 11L for married
    if (taxableIncome > l3) {
      var slabLimit = 2000000 - l3;
      var s4 = Math.min(taxableIncome - l3, slabLimit);
      var t4 = s4 * 0.30;
      tax += t4;
      breakdown.push({ slab: "Next NPR " + (slabLimit / 100000) + " Lakhs (Up to 20L)", amount: s4, rate: "30%", tax: t4 });
    }

    // 5th Slab: 20L to 50L (30L) @ 36%
    if (taxableIncome > 2000000) {
      var s5 = Math.min(taxableIncome - 2000000, 3000000);
      var t5 = s5 * 0.36;
      tax += t5;
      breakdown.push({ slab: "NPR 20L to 50L", amount: s5, rate: "36%", tax: t5 });
    }

    // Top Slab: Above 50L @ 39%
    if (taxableIncome > 5000000) {
      var s6 = taxableIncome - 5000000;
      var t6 = s6 * 0.39;
      tax += t6;
      breakdown.push({ slab: "Above NPR 50 Lakhs", amount: s6, rate: "39%", tax: t6 });
    }

    return {
      grossIncome: income,
      deductions: cit + insurance,
      taxableIncome: taxableIncome,
      annualTax: Math.round(tax),
      monthlyTax: Math.round(tax / 12),
      monthlyTakeHome: Math.round((income - tax) / 12),
      breakdown: breakdown
    };
  },

  // TOOL 7: SSF 31% Split Calculator
  calculateSSF: function(monthlySalary) {
    var salary = parseFloat(monthlySalary) || 0;
    var empPf = salary * 0.10;
    var empGratuity = salary * 0.0833;
    var empAccident = salary * 0.0167;
    var totalEmployer = salary * 0.20;

    var staffPf = salary * 0.10;
    var staffSsf = salary * 0.01;
    var totalEmployee = salary * 0.11;

    var grandTotalMonthly = totalEmployer + totalEmployee;
    var grandTotalAnnual = grandTotalMonthly * 12;

    return {
      monthlySalary: salary,
      employer: { pf: empPf, gratuity: empGratuity, accident: empAccident, total: totalEmployer },
      employee: { pf: staffPf, ssf: staffSsf, total: totalEmployee },
      grandTotalMonthly: grandTotalMonthly,
      grandTotalAnnual: grandTotalAnnual
    };
  },

  // TOOL 8: OCR Registration Fee Estimator
  calculateOCRRegistration: function(capitalStr) {
    var cap = parseFloat(capitalStr) || 100000;
    var ocrFee = 1000;
    var wardFee = 2000;

    if (cap <= 100000) { ocrFee = 1000; wardFee = 2500; }
    else if (cap <= 500000) { ocrFee = 4500; wardFee = 5000; }
    else if (cap <= 2500000) { ocrFee = 9500; wardFee = 10000; }
    else if (cap <= 10000000) { ocrFee = 16000; wardFee = 15000; }
    else if (cap <= 20000000) { ocrFee = 19000; wardFee = 20000; }
    else if (cap <= 100000000) { ocrFee = 31000; wardFee = 25000; }
    else {
      var excess = cap - 100000000;
      ocrFee = 31000 + Math.ceil(excess / 100000) * 30;
      wardFee = 30000;
    }

    var documentationAndStamps = 3500;
    var total = ocrFee + wardFee + documentationAndStamps;

    return {
      capital: cap,
      ocrFee: ocrFee,
      wardFee: wardFee,
      documentationAndStamps: documentationAndStamps,
      totalEstimated: total
    };
  },

  // TOOL 9: DPR Debt Service Coverage Ratio (DSCR) Calculator
  calculateDPR: function(loanAmount, annualInterestRate, tenureYears, annualNOI) {
    var P = parseFloat(loanAmount) || 0;
    var r = (parseFloat(annualInterestRate) || 0) / 100 / 12;
    var n = (parseFloat(tenureYears) || 0) * 12;
    var noi = parseFloat(annualNOI) || 0;

    var emi = 0;
    if (P > 0 && r > 0 && n > 0) {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    var annualDebtService = emi * 12;
    var dscr = annualDebtService > 0 ? (noi / annualDebtService).toFixed(2) : "N/A";
    var creditStatus = "Insufficient Data";
    var statusColor = "text-slate-500";

    if (!isNaN(parseFloat(dscr))) {
      var dscrNum = parseFloat(dscr);
      if (dscrNum >= 1.30) {
        creditStatus = "Strong / Bankable (Target DSCR >= 1.30 achieved)";
        statusColor = "text-emerald-700";
      } else if (dscrNum >= 1.15) {
        creditStatus = "Acceptable / Review Required (1.15 - 1.29)";
        statusColor = "text-amber-700";
      } else {
        creditStatus = "High Credit Risk / Refinancing Needed (< 1.15)";
        statusColor = "text-rose-700";
      }
    }

    return {
      monthlyEMI: Math.round(emi),
      annualDebtService: Math.round(annualDebtService),
      dscr: dscr,
      creditStatus: creditStatus,
      statusColor: statusColor
    };
  }
};

// Aliases for seamless integration across all templates
window.LFA_CALCULATORS = window.FINANCIAL_TOOLS;
