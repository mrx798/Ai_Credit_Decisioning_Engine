import React, { useState, useMemo, useEffect } from "react";
import { ShieldCheck, AlertTriangle, ChevronRight, Activity, DollarSign, Briefcase, FileText, CheckCircle, Search, BarChart2, Check, Download, XCircle, Upload, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SECTOR_DB = {
    Textiles: { risk: "HIGH", hw: "Chinese yarn dumping; Power costs", tw: "PLI scheme; China+1", rp: 1.75 },
    Steel: { risk: "MEDIUM-HIGH", hw: "Global overcapacity; Iron ore volatility", tw: "Infra push; Anti-dumping", rp: 1.50 },
    "Real Estate": { risk: "HIGH", hw: "RERA compliance; Inventory overhang", tw: "Affordable housing", rp: 2.00 },
    NBFC: { risk: "VERY HIGH", hw: "RBI tightening; Co-lending changes", tw: "Financial inclusion", rp: 2.25 },
    Pharma: { risk: "MEDIUM", hw: "US FDA alerts; Price control", tw: "Generic boom", rp: 1.00 },
    IT: { risk: "LOW", hw: "US slowdown; AI disruption", tw: "Digital transformation", rp: 0.75 },
    Trading: { risk: "HIGH", hw: "Thin margins; GST scrutiny", tw: "E-commerce growth", rp: 1.75 },
    Construction: { risk: "HIGH", hw: "Payment delays; Cost inflation", tw: "Smart Cities", rp: 1.90 }
};

const FIELDS = {
    inc: [
        { k: "revenue", l: "Revenue (Yr 2)" },
        { k: "revenueY1", l: "Revenue (Yr 1)" },
        { k: "otherInc", l: "Other Income" },
        { k: "ebitda", l: "EBITDA" },
        { k: "dep", l: "Depreciation" },
        { k: "intExp", l: "Interest Expense" },
        { k: "tax", l: "Tax" }
    ],
    bs: [
        { k: "shareCap", l: "Share Capital" },
        { k: "reserves", l: "Reserves" },
        { k: "ltDebt", l: "Long Term Debt" },
        { k: "stDebt", l: "Short Term Debt" },
        { k: "fa", l: "Fixed Assets (Net)" },
        { k: "ca", l: "Current Assets" },
        { k: "cl", l: "Current Liab" }
    ],
    gst: [
        { k: "gst3b", l: "GSTR-3B Turnover" },
        { k: "gst2a", l: "GSTR-2A Purchases" },
        { k: "bankTx", l: "Bank Turnover" },
        { k: "gst1", l: "GSTR-1 Filed" }
    ],
    loan: [
        { k: "loanAmt", l: "Loan Amount (Cr)" },
        { k: "tenure", l: "Tenure (m)" },
        { k: "col", l: "Collateral Val" }
    ]
};

const DEMO = {
    revenue: 485, revenueY1: 445, otherInc: 7, ebitda: 52, dep: 12, intExp: 28, tax: 3.5,
    shareCap: 25, reserves: 70, ltDebt: 180, stDebt: 130, fa: 220, ca: 185, cl: 145,
    gst3b: 510, gst2a: 495, bankTx: 420, gst1: 508, loanAmt: 80, tenure: 12, col: 120,
    cmp: 'Bharat Textile Mills Pvt Ltd', prom: 'Ramesh Agarwal', sec: 'Textiles', state: 'Gujarat',
    age: 15, cu: 42, pCond: -8, pt: 2, lc: 0, mc: -15, rec: -10, rpt: -18,
    notes: "Factory operating at 40% capacity. Management evaded related party transaction questions regarding Bharat Trading Co. Collateral has a mild dispute."
};

const ZEROS = Object.keys(DEMO).reduce((acc, k) => ({ ...acc, [k]: typeof DEMO[k] === 'string' ? '' : 0 }), {});

export default function App() {
    const [step, setStep] = useState(0);
    const [d, setD] = useState(ZEROS);
    const [rOut, setROut] = useState(null);
    const [isRes, setIsRes] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsExtracting(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:8000/auto_fill_preview", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            let updates = {};
            if (data.revenue_yr2) updates.revenue = data.revenue_yr2;
            if (data.revenue_yr1) updates.revenueY1 = data.revenue_yr1;
            if (data.other_income) updates.otherInc = data.other_income;
            if (data.ebitda) updates.ebitda = data.ebitda;
            if (data.depreciation) updates.dep = data.depreciation;
            if (data.interest_expense) updates.intExp = data.interest_expense;
            if (data.tax) updates.tax = data.tax;

            if (data.share_capital) updates.shareCap = data.share_capital;
            if (data.reserves) updates.reserves = data.reserves;
            if (data.total_debt) updates.ltDebt = data.total_debt;
            if (data.short_term_debt) updates.stDebt = data.short_term_debt;
            if (data.fixed_assets) updates.fa = data.fixed_assets;
            if (data.current_assets) updates.ca = data.current_assets;
            if (data.current_liabilities) updates.cl = data.current_liabilities;

            if (data.loan_amount_requested) updates.loanAmt = data.loan_amount_requested;
            if (data.tenure_months) updates.tenure = data.tenure_months;
            if (data.collateral_value) updates.col = data.collateral_value;

            if (data.gstr_3b_turnover) updates.gst3b = data.gstr_3b_turnover;
            if (data.gst_2a_purchases) updates.gst2a = data.gst_2a_purchases;
            if (data.bank_turnover) updates.bankTx = data.bank_turnover;
            if (data.gstr_1_filed) updates.gst1 = data.gstr_1_filed;

            if (data.monthly_bank_credits && data.monthly_bank_credits.length > 0 && !updates.bankTx) {
                updates.bankTx = data.monthly_bank_credits.reduce((sum, m) => sum + m.credit_sum, 0);
            }

            setD(prev => ({ ...prev, ...updates }));

        } catch (err) {
            console.error(err);
            alert("Extraction Failed: Make sure Python Backend is running at http://localhost:8000");
        }
        setIsExtracting(false);
        e.target.value = null; // reset input
    };

    const fmt = (v) => Number(v.toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // WhatIf Config
    const [wiRev, setWiRev] = useState(0);
    const [wiEbitda, setWiEbitda] = useState(0);
    const [wiLoan, setWiLoan] = useState(100);

    const loadDemo = () => { setD(DEMO); setStep(1); };

    // Derivations & Calculations
    const calc = useMemo(() => {
        // Apply WhatIf
        const mRev = d.revenue * (1 + wiRev / 100);
        const mEbitda = d.ebitda + (mRev * wiEbitda / 100);
        const mLoan = d.loanAmt * (wiLoan / 100);

        const nw = d.shareCap + d.reserves;
        const td = d.ltDebt + d.stDebt;
        const ebit = mEbitda - d.dep;
        const pbt = ebit - d.intExp;
        const pat = pbt - d.tax;
        const wc = d.ca - d.cl;
        const assets = d.fa + d.ca;

        const cr = d.cl ? d.ca / d.cl : 0;
        const qr = d.cl ? (d.ca * 0.7) / d.cl : 0;
        const de = nw ? td / nw : 0;
        const icr = d.intExp ? ebit / d.intExp : 0;
        const dp = mLoan / (d.tenure / 12 || 1);
        const dscr = (dp + d.intExp) ? (pat + d.dep + d.intExp) / (dp + d.intExp) : 0;
        const ebm = mRev ? (mEbitda / mRev) * 100 : 0;
        const patm = mRev ? (pat / mRev) * 100 : 0;
        const roe = nw ? (pat / nw) * 100 : 0;
        const roce = (nw + td) ? (ebit / (nw + td)) * 100 : 0;
        const dbDays = mRev ? (d.ca * 0.4 / mRev) * 365 : 0;
        const crDays = mRev ? (d.cl * 0.5 / mRev) * 365 : 0;

        // Flags
        const gbm = d.bankTx ? Math.max(0, ((d.gst3b - d.bankTx) / d.bankTx) * 100) : 0;
        const g2m = d.gst3b ? Math.max(0, ((d.gst2a - d.gst3b) / d.gst3b) * 100) : 0;
        const circScore = Math.min(100, gbm * 3 + g2m * 2);

        // Scoring
        const sDscr = dscr > 1.5 ? 8 : dscr >= 1.25 ? 6 : dscr >= 1.0 ? 3 : 0;
        const sIcr = icr > 3 ? 6 : icr >= 2 ? 4 : icr >= 1.5 ? 2 : 0;
        const sCr = cr > 2 ? 5 : cr >= 1.5 ? 4 : cr >= 1 ? 2 : 0;
        const sDe = de < 1 ? 5 : de <= 2 ? 3 : de <= 3 ? 1 : 0;
        const sPat = patm > 10 ? 4 : patm >= 5 ? 3 : patm >= 2 ? 2 : 0;
        const sRoce = roce > 15 ? 2 : roce >= 10 ? 1 : 0;
        const fhScore = sDscr + sIcr + sCr + sDe + sPat + sRoce;

        const sgst = gbm < 10 ? 10 : gbm <= 15 ? 6 : gbm <= 25 ? 3 : 0;
        const scirc = circScore < 30 ? 10 : circScore <= 60 ? 5 : 0;
        const gstScore = sgst + scirc;

        const resScore = Math.max(0, 25 - (rOut?.penalties || 0));

        // Keywords
        const notes = d.notes?.toLowerCase() || "";
        let kPen = 0;
        if (notes.match(/fraud|money laundering|fir|criminal|shell|defaulter/)) kPen -= 15;
        if (notes.match(/evasive|dispute|litigation|penalty/)) kPen -= 8;
        if (notes.match(/expansion|profitable|award/)) kPen += 5;

        const primAdj = (d.cu < 40 ? -20 : d.cu < 60 ? -10 : d.cu > 75 ? 5 : 0) + d.pCond + d.pt + d.lc + d.mc + d.rec + d.rpt + kPen;
        const primScore = Math.min(15, Math.max(0, 15 + primAdj));

        const ltv = d.col ? (mLoan / d.col) * 100 : 0;
        const colScore = ltv < 50 ? 10 : ltv <= 65 ? 7 : ltv <= 75 ? 5 : ltv <= 90 ? 2 : 0;

        const total = fhScore + gstScore + resScore + primScore + colScore;

        // Decision Logic
        let dec = "APPROVED";
        let rejs = [];
        if (dscr < 1.0) rejs.push("DSCR < 1.0 indicates inability to service debt");
        if (icr < 1.5) rejs.push("ICR critically low, high NPA risk");
        if (gbm > 30) rejs.push("GST vs Bank mismatch > 30% indicates severe circular trading risk");
        if (mLoan > d.col) rejs.push("Loan amount exceeds collateral value (unsecured)");
        if (de > 4) rejs.push("D/E > 4x breaches RBI prudential leverage limits");

        if (rejs.length > 0) dec = "REJECTED";
        else if (total < 75) dec = "CONDITIONAL APPROVAL";

        const mpbf = 0.75 * wc;
        const snc = Math.min(mpbf, mLoan, d.col * 0.75);

        const baseR = 9.5;
        const rPrem = total >= 76 ? 0 : total >= 61 ? 0.75 : 1.50;
        const sPrem = SECTOR_DB[d.sec || 'Textiles']?.rp || 1.0;
        const cPrem = ltv < 50 ? -0.25 : ltv > 75 ? 0.50 : 0;
        const rate = baseR + rPrem + sPrem + cPrem;

        const P = mLoan * 10000000;
        const r = (rate / 100) / 12;
        const n = d.tenure || 12;
        const emiLakhs = (P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)) / 100000;

        return {
            mRev, nw, td, ebit, pat, cr, qr, de, icr, dscr, ebm, patm, roe, roce, wc, dbDays, crDays, gbm, g2m, circScore,
            fhScore, gstScore, resScore, primScore, colScore, total, rejs, dec, snc, rate, ltv, mpbf, primAdj, mLoan, emiLakhs
        };
    }, [d, rOut, wiRev, wiEbitda, wiLoan]);

    const runResearch = () => {
        setIsRes(true);
        setTimeout(() => {
            const db = SECTOR_DB[d.sec] || SECTOR_DB.Textiles;
            let pen = 0;
            let f = [];
            if (d.age < 5) { f.push("Recent incorporation — limited track record"); pen += 5; }
            if (d.sec === 'NBFC') { f.push("RBI show-cause notices high in sector"); pen += 10; }
            if (d.sec === 'Real Estate' && d.state === 'Maharashtra') { f.push("High RERA dispute density in MH"); pen += 12; }

            let laws = [];
            if (db.risk.includes("HIGH")) { laws.push("High Court case pending (₹12 Cr)"); pen += 15; }
            else laws.push("Routine commercial disputes < ₹1 Cr");

            setROut({
                db, flags: f, laws, penalties: pen,
                news: [
                    { hd: `${d.sec} exporters face headwinds`, r: "MEDIUM", sc: -5 },
                    { hd: `GST department monitors circular networks in ${d.state}`, r: "HIGH", sc: -10 }
                ]
            });
            setIsRes(false);
        }, 1500);
    };

    const nav = (s) => setStep(s);

    if (step === 0) {
        return (
            <div className="min-h-screen bg-[#0B1426] text-white flex flex-col items-center justify-center">
                <style>{`.font-serif { font-family: 'Playfair Display', serif; }`}</style>
                <ShieldCheck className="w-24 h-24 text-[#F59E0B] mb-6 animate-pulse" />
                <h1 className="text-6xl font-serif font-bold mb-4 tracking-tight">Intelli-Credit<span className="text-[#F59E0B]">.</span></h1>
                <p className="text-xl text-slate-400 mb-12">AI-Powered Corporate Credit Appraisal Engine</p>
                <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-8 py-4 bg-[#1E293B] hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 border border-slate-600 transition-colors">Start Fresh Appraisal</button>
                    <button onClick={loadDemo} className="px-8 py-4 bg-[#F59E0B] hover:bg-yellow-500 text-[#0B1426] rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"><Activity /> Load Bharat Textiles Demo</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1426] text-slate-200 pb-20">
            <style>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        @media print {
          body * { visibility: hidden; }
          #cam, #cam * { visibility: visible; }
          #cam { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; margin: 0; }
        }
      `}</style>

            {/* Header & Stepper */}
            <header className="border-b border-slate-800 bg-[#0B1426]/80 p-4 sticky top-0 z-50 backdrop-blur print-hidden">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex font-serif text-2xl font-bold"><ShieldCheck className="text-[#F59E0B] mr-2" /> Intelli-Credit</div>
                    <div className="flex items-center gap-8">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-[#F59E0B]' : 'text-slate-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === s ? 'border-[#F59E0B] bg-[#F59E0B]/20' : step > s ? 'bg-[#F59E0B] text-[#0B1426]' : 'border-slate-700 bg-slate-800'}`}>
                                    {step > s ? <Check size={16} /> : s}
                                </div>
                                <span className="text-sm font-semibold hidden md:block">{['Ingestor', 'Research', 'Decision', 'CAM Docs'][s - 1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto mt-8 px-4">
                {/* SCREEN 1: INGESTOR */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Intelligent PDF Upload Banner */}
                        <div className="bg-gradient-to-r from-[#1E293B] to-[#0B1426] p-6 rounded-2xl border border-[#F59E0B]/50 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-black/50 gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <FileText className="text-[#F59E0B]" /> Intelligent PDF Extraction
                                </h2>
                                <p className="text-sm text-slate-400">Upload Indian Corporate Annual Reports, GST Returns, or Bank Statements. Our local AI engine will auto-extract and standardize values to Crores.</p>
                            </div>
                            <div className="relative group min-w-[250px]">
                                <input type="file" onChange={handleUpload} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isExtracting} />
                                <button className={`w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isExtracting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-[#F59E0B] hover:bg-yellow-500 text-[#0B1426] group-hover:scale-105 shadow-xl shadow-[#F59E0B]/20'}`}>
                                    {isExtracting ? <Loader2 className="animate-spin" /> : <Upload />}
                                    {isExtracting ? 'Analyzing PDF...' : 'Upload & Auto-Fill'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2 flex items-center gap-2"><DollarSign className="text-emerald-400" /> Financial Inputs (₹ Crores)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-[#F59E0B] mb-4">Income Statement</h3>
                                    <div className="space-y-3">
                                        {FIELDS.inc.map(f => (
                                            <div key={f.k} className="flex justify-between items-center">
                                                <label className="text-xs text-slate-400 font-medium">{f.l}</label>
                                                <input type="number" value={d[f.k]} onChange={e => setD({ ...d, [f.k]: Number(e.target.value) })} className="w-1/2 bg-[#0B1426] border border-slate-600 rounded px-3 py-1.5 focus:border-[#F59E0B] outline-none text-right" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#F59E0B] mb-4">Balance Sheet & Assets</h3>
                                    <div className="space-y-3">
                                        {FIELDS.bs.map(f => (
                                            <div key={f.k} className="flex justify-between items-center">
                                                <label className="text-xs text-slate-400 font-medium">{f.l}</label>
                                                <input type="number" value={d[f.k]} onChange={e => setD({ ...d, [f.k]: Number(e.target.value) })} className="w-1/2 bg-[#0B1426] border border-slate-600 rounded px-3 py-1.5 focus:border-[#F59E0B] outline-none text-right" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#F59E0B] mb-4">Requested Limits & GST Returns</h3>
                                    <div className="space-y-3 mb-6">
                                        {FIELDS.loan.map(f => (
                                            <div key={f.k} className="flex justify-between items-center">
                                                <label className="text-xs text-slate-400 font-medium">{f.l}</label>
                                                <input type="number" value={d[f.k]} onChange={e => setD({ ...d, [f.k]: Number(e.target.value) })} className="w-1/2 bg-[#0B1426] border border-slate-600 rounded px-3 py-1.5 focus:border-[#F59E0B] outline-none text-right" />
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="text-sm font-bold text-blue-400 mb-4 border-t border-slate-700 pt-4">GST Recon Data</h3>
                                    <div className="space-y-3">
                                        {FIELDS.gst.map(f => (
                                            <div key={f.k} className="flex justify-between items-center">
                                                <label className="text-xs text-slate-400 font-medium">{f.l}</label>
                                                <input type="number" value={d[f.k]} onChange={e => setD({ ...d, [f.k]: Number(e.target.value) })} className="w-1/2 bg-[#0B1426] border border-slate-600 rounded px-3 py-1.5 focus:border-[#F59E0B] outline-none text-right font-mono" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2 flex items-center gap-2"><Activity className="text-rose-400" /> Fraud Detection & Computed Ratios</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                                {/* Flags panel */}
                                <div className="col-span-1 lg:col-span-1 border-r border-slate-700 pr-6 space-y-4">
                                    <div className={`p-4 rounded-xl border ${calc.gbm > 15 ? 'border-rose-500 bg-rose-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
                                        <h4 className="font-bold mb-1 flex items-center gap-2">{calc.gbm > 15 ? <AlertTriangle size={16} className="text-rose-500" /> : <CheckCircle size={16} className="text-emerald-500" />} GST Mismatch</h4>
                                        <div className="text-2xl font-bold">{calc.gbm.toFixed(1)}%</div>
                                        <p className="text-xs mt-1 text-slate-400">{calc.gbm > 15 ? "RED FLAG: Revenue Inflation / Circular Trading risk" : "Within 15% tolerance"}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0B1426] border border-slate-700">
                                        <h4 className="font-bold text-slate-300">Circular AI Score</h4>
                                        <div className="text-3xl font-mono text-[#F59E0B]">{calc.circScore.toFixed(0)}<span className="text-sm text-slate-500">/100</span></div>
                                    </div>
                                </div>

                                {/* Ratios Grid */}
                                <div className="col-span-1 lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { l: "Current Ratio", v: calc.cr, b: "Aim > 1.3", w: calc.cr < 1 },
                                        { l: "D/E Ratio", v: calc.de, b: "Limit 3.0", w: calc.de > 3 },
                                        { l: "DSCR", v: calc.dscr, b: "Min 1.25", w: calc.dscr < 1 },
                                        { l: "ICR", v: calc.icr, b: "Min 2.0", w: calc.icr < 1.5 },
                                        { l: "EBITDA Margin", v: calc.ebm, b: "%", w: calc.ebm < 5 },
                                        { l: "PAT Margin", v: calc.patm, b: "%", w: calc.patm < 2 },
                                        { l: "ROCE", v: calc.roce, b: "%", w: calc.roce < 10 },
                                        { l: "Debtor Days", v: calc.dbDays, b: "Days", w: calc.dbDays > 120 }
                                    ].map((r, i) => (
                                        <div key={i} className={`p-3 rounded-xl border ${r.w ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700 bg-[#0B1426]'}`}>
                                            <p className="text-xs text-slate-400 font-medium tracking-wide">{r.l}</p>
                                            <p className={`text-xl font-bold font-mono ${r.w ? 'text-rose-400' : 'text-slate-100'}`}>{r.v.toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">{r.b}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end"><button onClick={() => nav(2)} className="px-8 py-4 bg-[#F59E0B] text-navy-900 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 text-black">Run AI Analytics <ChevronRight /></button></div>
                    </div>
                )}

                {/* SCREEN 2: RESEARCH */}
                {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 flex flex-col h-full">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2"><Search className="text-[#F59E0B]" /> Digital Credit Agent</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-slate-400">Company Name</label><input className="w-full bg-[#0B1426] border border-slate-600 rounded px-3 py-2 text-white outline-none" value={d.cmp} onChange={e => setD({ ...d, cmp: e.target.value })} /></div>
                                        <div>
                                            <label className="text-xs text-slate-400">Sector</label>
                                            <select className="w-full bg-[#0B1426] border border-slate-600 rounded px-3 py-2 text-white outline-none" value={d.sec} onChange={e => setD({ ...d, sec: e.target.value })}>
                                                {Object.keys(SECTOR_DB).map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={runResearch} disabled={isRes} className="w-full py-4 bg-[#0B1426] border border-[#F59E0B] text-[#F59E0B] rounded-xl font-bold hover:bg-[#F59E0B] hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isRes ? "Crawling MCA, E-Courts & News..." : "Generate Deterministic Analysis"}
                                </button>

                                {rOut && (
                                    <div className="mt-6 flex-1 bg-[#0B1426] rounded-xl border border-slate-700 p-4 overflow-auto space-y-4 shadow-inner">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">Sector Headwinds ({d.sec})</span>
                                            <ul className="list-square pl-4 text-sm text-amber-400 mt-1 space-y-1">{rOut.db.hw.split(";").map((h, i) => <li key={i}>{h}</li>)}</ul>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">E-Courts & Legal</span>
                                            <p className="text-sm text-rose-400 mt-1">{rOut.laws[0]}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">Detected News Risks</span>
                                            <div className="mt-2 space-y-2">
                                                {rOut.news.map((nw, i) => (
                                                    <div key={i} className="p-2 bg-[#1E293B] border border-rose-500/30 rounded text-xs">
                                                        <span className="bg-rose-500 text-white px-1 mr-2 rounded">{nw.r}</span>
                                                        <span className="text-slate-200">{nw.hd}</span>
                                                        <span className="font-mono text-rose-400 float-right">{nw.sc} pts</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 flex flex-col h-full">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2"><Briefcase className="text-blue-400" /> Due Diligence & Site Visit</h2>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Capacity Utilization</label>
                                        <input type="number" value={d.cu} onChange={e => setD({ ...d, cu: Number(e.target.value) })} className="w-full bg-[#0B1426] border border-slate-600 rounded px-3 py-2 text-white outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Plant Condition (-15 to +5 obj)</label>
                                        <select value={d.pCond} onChange={e => setD({ ...d, pCond: Number(e.target.value) })} className="w-full bg-[#0B1426] border border-slate-600 rounded px-3 py-2 text-white outline-none">
                                            <option value={5}>Excellent</option><option value={0}>Average</option><option value={-8}>Poor</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="text-xs text-slate-400 block mb-2">Credit Officer Notes (Keyword Evaluated)</label>
                                    <textarea value={d.notes} onChange={e => setD({ ...d, notes: e.target.value })} className="w-full flex-1 bg-[#0B1426] border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-[#F59E0B] resize-none" placeholder="Enter findings..." />
                                </div>

                                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                                    <div className="text-sm text-indigo-300">Net Form Impact:</div>
                                    <div className="text-lg font-bold font-mono text-indigo-400">{calc.primAdj > 0 ? '+' : ''}{calc.primAdj} points</div>
                                </div>

                            </div>

                        </div>
                        <div className="flex justify-between items-center"><button onClick={() => nav(1)} className="px-6 py-3 text-slate-400 hover:text-white font-bold">Back</button><button onClick={() => nav(3)} disabled={!rOut} className="px-8 py-4 bg-[#F59E0B] text-black rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50">Generate Recommendation Engine <ChevronRight /></button></div>
                    </div>
                )}

                {/* SCREEN 3: DECISION ENGINES */}
                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                            {/* Scorecard */}
                            <div className="col-span-1 lg:col-span-1 border border-slate-700 bg-[#1E293B] rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden flex flex-col justify-center">
                                <div className={`absolute top-0 left-0 w-full h-2 ${calc.total >= 75 ? 'bg-emerald-500' : calc.total >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-6">Composite Score</h3>
                                <div className="relative inline-block mx-auto mb-6">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" fill="none" stroke="#0B1426" strokeWidth="16" />
                                        <circle cx="96" cy="96" r="88" fill="none" stroke={calc.total >= 75 ? '#10B981' : calc.total >= 60 ? '#F59E0B' : '#EF4444'} strokeWidth="16" strokeDasharray="553" strokeDashoffset={553 - (553 * calc.total) / 100} className="transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <span className="text-5xl font-mono font-bold text-white">{calc.total.toFixed(0)}</span>
                                        <span className="text-sm text-slate-500">/ 100</span>
                                    </div>
                                </div>

                                <div className={`mb-6 p-3 rounded-lg border-2 text-xl font-bold uppercase tracking-wider ${calc.dec === 'APPROVED' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : calc.dec.includes('CONDITIONAL') ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-rose-500 text-rose-500 bg-rose-500/10'}`}>
                                    {calc.dec}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-left bg-[#0B1426] p-4 rounded-xl border border-slate-700">
                                    <div className="text-xs text-slate-400">Sanction Limit</div>
                                    <div className="text-sm font-bold text-white text-right">₹{fmt(calc.snc)} Cr</div>
                                    <div className="text-xs text-slate-400">Int. Rate</div>
                                    <div className="text-sm font-bold text-white text-right">{calc.rate.toFixed(2)}%</div>
                                </div>
                            </div>

                            {/* Analytics & Rules */}
                            <div className="col-span-1 lg:col-span-3 grid grid-rows-2 gap-8">

                                <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-md font-bold text-white mb-4">Calculational Triggers & Auto-Rejects</h3>
                                    <div className="space-y-3">
                                        {calc.rejs.length > 0 ? calc.rejs.map((r, i) => (
                                            <div key={i} className="flex gap-3 text-sm bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl item-center">
                                                <XCircle className="text-rose-500 shrink-0" /> <span className="text-rose-200">{r}</span>
                                            </div>
                                        )) : (
                                            <div className="flex gap-3 text-sm bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl items-center">
                                                <CheckCircle className="text-emerald-500 shrink-0" /> <span className="text-emerald-200">No hard reject bounds breached. DSCR, Leverage, and Collateral cover are within minimums.</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-md font-bold text-white mt-6 mb-4">Lineage Audit Trail</h3>
                                    <div className="h-32 overflow-y-auto pr-2 space-y-2 font-mono text-xs text-slate-400">
                                        <p>&gt; Engine compiled DSCR={calc.dscr.toFixed(2)} (Score: {calc.fhScore}/30) </p>
                                        <p>&gt; GST-Bank diff={calc.gbm.toFixed(1)}% yields Penalty. Comp2={calc.gstScore}/20</p>
                                        <p>&gt; Sector={d.sec} dictates {SECTOR_DB[d.sec || 'Textiles']?.rp} bps premium load</p>
                                        <p>&gt; Web Agent scraped MCA/Courts. Research deduct. Comp3={calc.resScore}/25</p>
                                        <p>&gt; Officer NLP scan parsed {calc.primAdj} bias points. Comp4={calc.primScore}/15</p>
                                    </div>
                                </div>

                                {/* Score Breakdown Chart */}
                                <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 flex flex-col">
                                    <h3 className="text-md font-bold text-white mb-4">Component Contribution</h3>
                                    <div className="flex-1 w-full min-h-[150px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart layout="vertical" data={[
                                                { name: 'Financial Model', max: 30, score: calc.fhScore },
                                                { name: 'GST Audit', max: 20, score: calc.gstScore },
                                                { name: 'Web Risk', max: 25, score: calc.resScore },
                                                { name: 'Site Visit', max: 15, score: calc.primScore },
                                                { name: 'Collateral', max: 10, score: calc.colScore }
                                            ]} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1C2E4A" horizontal={false} />
                                                <XAxis type="number" domain={[0, 30]} stroke="#64748B" fontSize={10} />
                                                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={80} />
                                                <Tooltip cursor={{ fill: '#0B1426' }} contentStyle={{ backgroundColor: '#0B1426', borderColor: '#1E293B' }} />
                                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                                <Bar dataKey="max" fill="#1C2E4A" name="Max Possible" radius={[0, 4, 4, 0]} barSize={16} />
                                                <Bar dataKey="score" fill="#F59E0B" name="Calculated" radius={[0, 4, 4, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1C2E4A] to-[#0B1426] border border-blue-900/50 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-blue-900/50 pb-2 flex items-center gap-2">Interactive Sensitivity Simulator</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-blue-400 mb-2 block">Revenue Shock: {wiRev}%</label>
                                    <input type="range" min="-30" max="30" value={wiRev} onChange={e => setWiRev(Number(e.target.value))} className="w-full h-2 bg-[#0B1426] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-400 mb-2 block">EBITDA Margin Shock: {wiEbitda}%</label>
                                    <input type="range" min="-10" max="10" step="1" value={wiEbitda} onChange={e => setWiEbitda(Number(e.target.value))} className="w-full h-2 bg-[#0B1426] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-400 mb-2 block">Loan Drawdown: {wiLoan}%</label>
                                    <input type="range" min="50" max="150" value={wiLoan} onChange={e => setWiLoan(Number(e.target.value))} className="w-full h-2 bg-[#0B1426] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-300">
                                Moving sliders instantly triggers recalculation across the entire financial engine! Currently rendering DSCR at <span className="font-mono text-[#F59E0B] font-bold">{calc.dscr.toFixed(2)}x</span> based on shock states.
                            </div>
                        </div>

                        <div className="flex justify-between items-center"><button onClick={() => nav(2)} className="px-6 py-3 text-slate-400 hover:text-white font-bold">Back</button><button onClick={() => nav(4)} className="px-8 py-4 bg-[#F59E0B] text-black rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400">Generate CAM Document <ChevronRight /></button></div>
                    </div>
                )}

                {/* SCREEN 4: CAM REPORT */}
                {step === 4 && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-between items-center mb-6 print-hidden">
                            <button onClick={() => nav(3)} className="px-6 py-3 text-slate-400 hover:text-white font-bold border border-slate-700 rounded-lg">Back to Simulator</button>
                            <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"><Download size={18} /> Print Formal CAM PDF</button>
                        </div>

                        <div id="cam" className="cam-print-only bg-white text-black p-12 shadow-2xl mx-auto rounded lg:w-3/4 mb-20 text-sm">

                            <div className="border-b-4 border-black pb-4 mb-6 text-center">
                                <h1 className="text-3xl font-serif font-bold uppercase tracking-widest">Credit Appraisal Memorandum</h1>
                                <p className="mt-2 font-bold text-slate-700">INTELLI-CREDIT SANCTIONING ENGINE</p>
                            </div>

                            <div className="flex justify-between font-bold mb-8 text-xs border border-gray-300 p-2 bg-gray-50">
                                <div>Date: {new Date().toLocaleDateString()}</div>
                                <div>Ref: CAM/{new Date().getFullYear()}/{Math.floor(Math.random() * 9000) + 1000}</div>
                                <div>Sys Version: Offline v3.0</div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-bold border-b-2 border-slate-400 pb-1 mb-2 bg-slate-100 p-1">1. EXECUTIVE SUMMARY</h2>
                                <p className="leading-relaxed text-justify">
                                    Proposal for limits structuring of <b>₹{fmt(calc.mLoan)} Cr</b> for <b>{d.cmp || 'Applicant'}</b>. The company operates in the {d.sec} sector with an established track record yielding recent revenues of ₹{fmt(calc.mRev)} Cr.
                                    Based on algorithmic derivation processing exhaustive financial, GST, primary, and secondary vectors, the application is unequivocally designated as <b>{calc.dec}</b>, achieving a composite systemic integrity score of <b>{calc.total.toFixed(0)}/100</b>.
                                    The sanctionable limit is capped at ₹{fmt(calc.snc)} Cr bounded inherently by regulatory/statutory constraints, priced efficiently at {calc.rate.toFixed(2)}% p.a. representing adequate risk compensation.
                                </p>
                            </div>

                            {/* 5Cs Structure */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold border-b-2 border-slate-400 pb-1 mb-4 bg-slate-100 p-1">2. THE 5 Cs OF CREDIT</h2>
                                <table className="w-full border-collapse border border-gray-400 text-sm">
                                    <tbody>
                                        <tr><td className="border border-gray-400 p-2 font-bold w-1/4 bg-gray-50">CHARACTER</td><td className="border border-gray-400 p-2">Mgmt Score: {calc.primScore}/15. Promoted by {d.prom}. Litigation flags parsed autonomously via logic models note significant anomalies: {rOut?.laws[0]}.</td></tr>
                                        <tr><td className="border border-gray-400 p-2 font-bold bg-gray-50">CAPACITY</td><td className="border border-gray-400 p-2">Repayment capability evaluated stringently. Current DSCR at <b>{calc.dscr.toFixed(2)}x</b> vs threshold of 1.25x. GST vs Bank mismatch explicitly quantified at {calc.gbm.toFixed(1)}% {calc.gbm > 15 && <span className="text-red-600 font-bold">(EXCEEDS NORMALIZED VARIANCE).</span>}</td></tr>
                                        <tr><td className="border border-gray-400 p-2 font-bold bg-gray-50">CAPITAL</td><td className="border border-gray-400 p-2">Adjusted Net Worth stands validated at ₹{fmt(calc.nw)} Cr backing a total debt outlay spanning ₹{fmt(calc.td)} Cr. Resultant leverage measured accurately at {calc.de.toFixed(2)}x.</td></tr>
                                        <tr><td className="border border-gray-400 p-2 font-bold bg-gray-50">COLLATERAL</td><td className="border border-gray-400 p-2">Secured physically by {d.collateralType} conservatively flagged at ₹{fmt(d.col)} Cr rendering an LTV exposure of {calc.ltv.toFixed(1)}%. SARFAESI Act 2002 deemed actively enforceable.</td></tr>
                                        <tr><td className="border border-gray-400 p-2 font-bold bg-gray-50">CONDITIONS</td><td className="border border-gray-400 p-2">Operating entirely in {d.sec} yielding systemic headwinds natively tracked: {SECTOR_DB[d.sec || 'Textiles']?.hw}. RBI provisioning frameworks actively factored.</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-lg font-bold border-b-2 border-slate-400 pb-1 mb-2 bg-slate-100 p-1">3. SANCTION RECOMMENDATION & COVENANTS</h2>
                                <div className="p-4 border-2 border-black bg-gray-50 font-serif">
                                    <p>DECISION: <b>{calc.dec}</b></p>
                                    <p className="mt-2">Amount: <b>₹{fmt(calc.snc)} Crores</b></p>
                                    <p>Pricing: <b>{calc.rate.toFixed(2)}% p.a.</b></p>
                                    <p>Tenure: <b>{d.tenure} months</b></p>
                                    <p>EMI Repayment: <b>₹{fmt(calc.emiLakhs)} Lakhs / month</b></p>
                                    <p className="mt-4 font-sans font-bold text-xs uppercase text-gray-500">Automated Financial Covenants Executed:</p>
                                    <ul className="list-disc pl-5 mt-1 font-sans text-sm">
                                        {calc.de > 2 && <li>Restrictive covenant applied: Debt/Equity ratio ceiling fixed under 2.5x</li>}
                                        {calc.cr < 1.33 && <li>Statutory covenant: Immediate liquidity infusion required to elevate Current Ratio &gt; 1.33</li>}
                                        {calc.gbm > 10 && <li>Audit mandate: Forensic reconciliation required tracking {calc.gbm.toFixed(1)}% GST deviance.</li>}
                                        <li>Standard security perfection protocols alongside continuous operational assessment mapping.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-16 pt-8 border-t-2 border-black flex justify-between text-center font-bold">
                                <div className="pt-8 border-t border-black w-48">Originating Officer</div>
                                <div className="pt-8 border-t border-black w-48">Sanctioning Authority</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
