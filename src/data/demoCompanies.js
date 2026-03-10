// Curated mock dataset for the IIT Hyderabad Hackathon live presentation
// Simulates the full output payload from the backend ML & Risk engines

export const DEMO_COMPANIES = [
    {
        id: "tata_steel",
        name: "Tata Steel Ltd",
        sector: "Steel",
        description: "Large cap, moderate risk traditional manufacturing.",
        financials: {
            revenue: "₹2,43,353 Cr",
            revenue_growth: "4.5%",
            ebitda_margin: "18.2%",
            debt_equity: "0.9x",
            current_ratio: "1.1x",
            interest_coverage: "4.2x",
        },
        credit_score: 820,
        risk_grade: "AAA",
        probability_of_default: 0.12,
        shap_values: [
            { feature: "Interest Coverage Ratio (4.2x)", impact: 45.3, is_positive: true },
            { feature: "EBITDA Margin (18.2%)", impact: 35.1, is_positive: true },
            { feature: "Debt / Equity Ratio (0.9x)", impact: 15.2, is_positive: true },
            { feature: "Sector Risk (Anti-dumping)", impact: -12.4, is_positive: false },
            { feature: "Current Ratio (1.1x)", impact: 8.5, is_positive: true },
            { feature: "Revenue Growth (YoY)", impact: -5.2, is_positive: false }
        ],
        india_risk: {
            score: 88,
            sector_flags: [
                "Anti-dumping duty volatility affecting domestic margins",
                "Global overcapacity risk driven by Chinese surplus exports"
            ],
            regulatory_alerts: [
                { agency: "GSTIN portal", alert: "GST Filings reconciled successfully with Audited figures", status: "CLEARED" },
                { agency: "RBI CRILC Database", alert: "Entity and Promoters cleared against active Defaulter lists", status: "CLEARED" }
            ]
        },
        fraud: {
            score: 12,
            alerts: [],
            radar: [
                { subject: "Growth Anomaly", A: 10, fullMark: 100 },
                { subject: "Network Risk", A: 15, fullMark: 100 },
                { subject: "Cash Manipulation", A: 5, fullMark: 100 },
                { subject: "Promoter Risk", A: 10, fullMark: 100 },
                { subject: "Tax Compliance", A: 20, fullMark: 100 },
                { subject: "Legal Scrutiny", A: 15, fullMark: 100 }
            ]
        },
        history: [
            { year: "FY22", score: 790 },
            { year: "FY23", score: 805 },
            { year: "FY24", score: 820 }
        ]
    },
    {
        id: "adani_green",
        name: "Adani Green Energy",
        sector: "Power & Renewables",
        description: "High leverage, extreme growth infrastructure play.",
        financials: {
            revenue: "₹7,735 Cr",
            revenue_growth: "52.4%",
            ebitda_margin: "92.1%",
            debt_equity: "4.5x",
            current_ratio: "0.8x",
            interest_coverage: "1.8x",
        },
        credit_score: 680,
        risk_grade: "BBB",
        probability_of_default: 2.45,
        shap_values: [
            { feature: "Debt / Equity Ratio (4.5x)", impact: -68.4, is_positive: false },
            { feature: "Revenue Growth (52.4%)", impact: 55.2, is_positive: true },
            { feature: "EBITDA Margin (92.1%)", impact: 42.1, is_positive: true },
            { feature: "Current Ratio (0.8x)", impact: -25.5, is_positive: false },
            { feature: "Interest Coverage Ratio (1.8x)", impact: -18.2, is_positive: false },
            { feature: "Sector Risk (Govt CapEx)", impact: 15.0, is_positive: true }
        ],
        india_risk: {
            score: 75,
            sector_flags: [
                "Heavy reliance on deterministic SECI/NTPC PPA execution",
                "Interest rate sensitivity due to capital intensive nature"
            ],
            regulatory_alerts: [
                { agency: "SEBI / Directives", alert: "Elevated promoter pledge monitoring active", status: "WARNING" },
                { agency: "RBI CRILC Database", alert: "Entity and Promoters cleared against active Defaulter lists", status: "CLEARED" }
            ]
        },
        fraud: {
            score: 35,
            alerts: [
                { id: "F1", dimension: "Network Risk", severity: "MEDIUM", title: "Complex Top-Co structures", evidence: "High volume of related party transactions tracking to ultimate holding company.", points: 25 }
            ],
            radar: [
                { subject: "Growth Anomaly", A: 45, fullMark: 100 },
                { subject: "Network Risk", A: 65, fullMark: 100 },
                { subject: "Cash Manipulation", A: 15, fullMark: 100 },
                { subject: "Promoter Risk", A: 50, fullMark: 100 },
                { subject: "Tax Compliance", A: 10, fullMark: 100 },
                { subject: "Legal Scrutiny", A: 40, fullMark: 100 }
            ]
        },
        history: [
            { year: "FY22", score: 620 },
            { year: "FY23", score: 645 },
            { year: "FY24", score: 680 }
        ]
    },
    {
        id: "zomato",
        name: "Zomato Ltd",
        sector: "Consumer Tech",
        description: "High growth, improving unit economics startup.",
        financials: {
            revenue: "₹12,114 Cr",
            revenue_growth: "71.0%",
            ebitda_margin: "3.5%",
            debt_equity: "0.0x",
            current_ratio: "5.2x",
            interest_coverage: "99.0x",
        },
        credit_score: 750,
        risk_grade: "AA",
        probability_of_default: 0.85,
        shap_values: [
            { feature: "Debt / Equity Ratio (0.0x)", impact: 65.4, is_positive: true },
            { feature: "Revenue Growth (71.0%)", impact: 58.2, is_positive: true },
            { feature: "Current Ratio (5.2x)", impact: 45.5, is_positive: true },
            { feature: "EBITDA Margin (3.5%)", impact: -38.1, is_positive: false },
            { feature: "Sector Risk (Consumer Tech)", impact: -22.0, is_positive: false },
            { feature: "Interest Coverage Ratio", impact: 15.2, is_positive: true }
        ],
        india_risk: {
            score: 92,
            sector_flags: [
                "Gig-worker regulatory risk / Social welfare cess exposure",
                "High competitive intensity in quick-commerce (Blinkit) segment"
            ],
            regulatory_alerts: [
                { agency: "GSTIN portal", alert: "Platform GST remittance reconciled successfully", status: "CLEARED" }
            ]
        },
        fraud: {
            score: 5,
            alerts: [],
            radar: [
                { subject: "Growth Anomaly", A: 25, fullMark: 100 },
                { subject: "Network Risk", A: 5, fullMark: 100 },
                { subject: "Cash Manipulation", A: 2, fullMark: 100 },
                { subject: "Promoter Risk", A: 10, fullMark: 100 },
                { subject: "Tax Compliance", A: 5, fullMark: 100 },
                { subject: "Legal Scrutiny", A: 15, fullMark: 100 }
            ]
        },
        history: [
            { year: "FY22", score: 510 },
            { year: "FY23", score: 650 },
            { year: "FY24", score: 750 }
        ]
    },
    {
        id: "stressed_nbfc",
        name: "Sahara Finvest (Mock India)",
        sector: "NBFC",
        description: "A fictional stressed NBFC tripping multiple AI risk flags.",
        financials: {
            revenue: "₹450 Cr",
            revenue_growth: "-12.4%",
            ebitda_margin: "-8.5%",
            debt_equity: "8.2x",
            current_ratio: "0.6x",
            interest_coverage: "0.4x",
        },
        credit_score: 410,
        risk_grade: "D",
        probability_of_default: 48.2,
        shap_values: [
            { feature: "Interest Coverage Ratio (0.4x)", impact: -85.2, is_positive: false },
            { feature: "Debt / Equity Ratio (8.2x)", impact: -75.4, is_positive: false },
            { feature: "EBITDA Margin (-8.5%)", impact: -58.1, is_positive: false },
            { feature: "Current Ratio (0.6x)", impact: -45.5, is_positive: false },
            { feature: "Revenue Growth (-12.4%)", impact: -35.2, is_positive: false },
            { feature: "Sector Risk (Unsecured NBFC)", impact: -25.0, is_positive: false }
        ],
        india_risk: {
            score: 22,
            sector_flags: [
                "Intensified RBI regulatory scrutiny on unsecured lending",
                "Severe Asset Liability Management (ALM) mismatch vulnerabilities"
            ],
            regulatory_alerts: [
                { agency: "RBI CRILC Database", alert: "Entity flagged as SMA-2 (Special Mention Account). Default imminent.", status: "CRITICAL" },
                { agency: "E-Courts API", alert: "Pending NCLT insolvency petition filed by Financial Creditor.", status: "CRITICAL" },
                { agency: "MCA Registry", alert: "Statutory Auditor resignation filed mid-year without clean exit.", status: "WARNING"}
            ]
        },
        fraud: {
            score: 85,
            alerts: [
                { id: "F1", dimension: "Network Risk", severity: "HIGH", title: "Promoter Fund Divergence (42%)", evidence: "Audited schedule indicates ₹125Cr funneled to subsidiary shell entities without operational backing.", points: 45 },
                { id: "F2", dimension: "Cash Manipulation", severity: "HIGH", title: "Bank vs P&L Mismatch (38%)", evidence: "GSTR-3B / Bank aggregate turnovers severely under-report against Audited P&L Revenue.", points: 30 },
                { id: "F3", dimension: "Promoter Risk", severity: "MEDIUM", title: "Director in 8 defunct entities", evidence: "MCA Registry cross-reference shows Director holding board seats in multiple struck-off entities.", points: 15 }
            ],
            radar: [
                { subject: "Growth Anomaly", A: 85, fullMark: 100 },
                { subject: "Network Risk", A: 95, fullMark: 100 },
                { subject: "Cash Manipulation", A: 90, fullMark: 100 },
                { subject: "Promoter Risk", A: 85, fullMark: 100 },
                { subject: "Tax Compliance", A: 70, fullMark: 100 },
                { subject: "Legal Scrutiny", A: 100, fullMark: 100 }
            ]
        },
        history: [
            { year: "FY22", score: 650 },
            { year: "FY23", score: 580 },
            { year: "FY24", score: 410 }
        ]
    }
];
