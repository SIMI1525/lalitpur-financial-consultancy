import os

JS_DIR = "lalitpur-financial-consultancy/js"
os.makedirs(JS_DIR, exist_ok=True)

calc_content = """// js/calculators.js - Interactive Financial Tools, Calculators & Checklists
// Pure client-side calculations in Nepalese Rupees (NPR), compliant with visual semantics.

window.FINANCIAL_TOOLS = {
  // Helper: Format NPR Currency
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
    var res = otherNumbers.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ",") + lastThree;
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
      status: netBalance >= 0 ? "Surplus" : "Deficit"
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

    return {
      openingCash: openingCash,
      totalInflows: totalInflows,
      totalOutflows: totalOutflows,
      netCashFlow: netCashFlow,
      closingBalance: closingBalance,
      burnRate: burnRate,
      runwayMonths: runwayMonths,
      healthIndicator: closingBalance > (payroll * 2) ? "Healthy" : (closingBalance >= 0 ? "Caution" : "Critical Deficit")
    };
  },

  // TOOL 3: Bookkeeping Readiness Score Calculator
  calculateBookkeepingReadiness: function(checkedItemIds, totalItemsCount) {
    var count = checkedItemIds ? checkedItemIds.length : 0;
    var total = totalItemsCount || 10;
    var score = Math.round((count / total) * 100);
    var status = "Immediate Attention Required";
    var badgeClass = "bg-rose-100 text-rose-800 border-rose-200";

    if (score >= 80) {
      status = "Audit & Filing Ready";
      badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (score >= 50) {
      status = "Moderately Organized (Needs Catch-up)";
      badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
    }

    return {
      checkedCount: count,
      totalCount: total,
      score: score,
      status: status,
      badgeClass: badgeClass
    };
  },

  // TOOL 4: Tax Document Readiness Score Calculator
  calculateTaxDocumentReadiness: function(checkedItemIds, totalItemsCount) {
    var count = checkedItemIds ? checkedItemIds.length : 0;
    var total = totalItemsCount || 8;
    var score = Math.round((count / total) * 100);
    var status = "High Compliance Risk (Missing Critical Records)";
    var badgeClass = "bg-rose-100 text-rose-800 border-rose-200";

    if (score >= 85) {
      status = "Complete Filing Readiness";
      badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (score >= 60) {
      status = "Partially Prepared (Requires Documentation Review)";
      badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
    }

    return {
      checkedCount: count,
      totalCount: total,
      score: score,
      status: status,
      badgeClass: badgeClass
    };
  },

  // TOOL 5: Business Registration Pathway Resolver
  resolveRegistrationPathway: function(structure, nature, capitalRange) {
    var pathway = {
      authority: "Office of Company Registrar (OCR) / कम्पनी रजिस्ट्रारको कार्यालय",
      structureName: "Private Limited Company (Pvt. Ltd.)",
      steps: [
        "1. Online Name Reservation via OCR Portal (ocr.gov.np)",
        "2. Drafting of Memorandum & Articles of Association (प्रबन्धपत्र तथा नियमावली)",
        "3. Digital Submission of Promoter Identity Documents & Verification",
        "4. Issuance of Company Incorporation Certificate by OCR",
        "5. Local Ward Office Business Permitting (within 30 days of setup)",
        "6. Permanent Account Number (PAN) / VAT Registration at Inland Revenue Department (IRD)",
        "7. Corporate Bank Account Opening & Share Lagat Submission to OCR"
      ],
      documents: [
        "Citizenship certificates of all shareholders / directors",
        "Passport size photographs (recent) of promoters",
        "Drafted Memorandum of Association (MOA) and Articles of Association (AOA)",
        "Lease / Rental agreement for official registered office address in Nepal",
        "Ward House Rent Tax payment receipt or property ownership paper"
      ],
      estimatedTime: "5 - 9 Business Days",
      statutoryAuthorityLinks: [
        { name: "Office of Company Registrar (OCR)", url: "https://ocr.gov.np" },
        { name: "Inland Revenue Department (IRD)", url: "https://ird.gov.np" }
      ]
    };

    if (structure === "sole_proprietorship") {
      pathway.structureName = "Sole Proprietorship / Individual Firm (एकलौटी फर्म)";
      pathway.authority = "Department of Commerce, Supplies & Consumer Protection / Local Municipal Ward Office";
      pathway.steps = [
        "1. Submit firm registration application to local Municipal Ward Office or Department of Commerce",
        "2. Rent agreement verification and citizenship verification",
        "3. Obtain Ward Business License Certificate",
        "4. Obtain Personal/Business PAN at Inland Revenue Department (IRD)",
        "5. Open commercial business bank account"
      ];
      pathway.estimatedTime = "2 - 4 Business Days";
    } else if (structure === "partnership") {
      pathway.structureName = "Partnership Firm (साझेदारी फर्म)";
      pathway.authority = "Department of Commerce, Supplies and Consumer Protection";
      pathway.steps = [
        "1. Draft formalized Partnership Agreement specifying profit/loss shares and capital",
        "2. Register at Department of Commerce or cottage industry office",
        "3. Local Ward Office registration in municipality",
        "4. Obtain Partnership PAN at IRD",
        "5. Execute partnership bank operations"
      ];
      pathway.estimatedTime = "4 - 7 Business Days";
    } else if (structure === "fdi") {
      pathway.structureName = "Foreign Direct Investment (FDI) Company";
      pathway.authority = "Department of Industry (DOI) / Nepal Rastra Bank (NRB) / OCR";
      pathway.steps = [
        "1. Foreign Investment Approval via Department of Industry (DOI) under FITTA 2019",
        "2. OCR Company Registration after preliminary approval",
        "3. Nepal Rastra Bank (NRB) capital inflow approval and foreign currency account clearance",
        "4. Ward and IRD PAN/VAT registration",
        "5. Final foreign investment recording at NRB"
      ];
      pathway.estimatedTime = "15 - 30 Business Days";
    }

    return pathway;
  }
};
"""

with open(f"{JS_DIR}/calculators.js", "w", encoding="utf-8") as f:
    f.write(calc_content.strip())

print("js/calculators.js generated successfully!")
