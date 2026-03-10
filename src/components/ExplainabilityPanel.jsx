import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, Activity, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function ExplainabilityPanel({ scoreData }) {
    const [animatedData, setAnimatedData] = useState([]);
    const [typedExplanation, setTypedExplanation] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Default mock data if no scoreData is provided (useful for dev/demo)
    const data = scoreData || {
        credit_score: 645,
        risk_grade: "BBB",
        probability_of_default: 12.4,
        shap_values: [
            { feature: "Debt / Equity Ratio", impact: -45.2, is_positive: false },
            { feature: "EBITDA Margin", impact: 32.1, is_positive: true },
            { feature: "Current Ratio", impact: 18.5, is_positive: true },
            { feature: "Revenue Growth (YoY)", impact: -12.4, is_positive: false },
            { feature: "Sector Risk (Macro)", impact: -8.7, is_positive: false },
            { feature: "Interest Coverage Ratio", impact: 4.2, is_positive: true }
        ]
    };

    // Construct the AI-generated explanation string
    const generateExplanation = (data) => {
        const topPositive = data.shap_values.filter(s => s.is_positive).sort((a, b) => b.impact - a.impact)[0];
        const topNegative = data.shap_values.filter(s => !s.is_positive).sort((a, b) => a.impact - b.impact)[0]; // impact is negative, so a-b makes the most negative first
        
        return `The Intelli-Credit ML Engine assigns a score of ${data.credit_score} (${data.risk_grade}), indicating a ${data.probability_of_default}% probability of default. ` +
               `The primary driver elevating risk is the ${topNegative?.feature.toLowerCase()}, which severely negatively impacts serviceability. ` +
               `However, this is partially offset by strong ${topPositive?.feature.toLowerCase()}, anchoring the final rating.`;
    };

    const explanationText = generateExplanation(data);

    useEffect(() => {
        // Bar Chart Animation - sequentially load the SHAP values
        const timer1 = setTimeout(() => {
            let currentData = [];
            data.shap_values.forEach((item, i) => {
                setTimeout(() => {
                    currentData.push({ ...item, displayImpact: item.impact });
                    setAnimatedData([...currentData]);
                }, i * 300); // 300ms stagger
            });
        }, 500);

        // Typewriter Effect for the AI Explanation
        setIsTyping(true);
        let i = 0;
        const typingInterval = setInterval(() => {
            setTypedExplanation(explanationText.substring(0, i));
            i++;
            if (i > explanationText.length) {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 30); // 30ms per character

        return () => {
            clearTimeout(timer1);
            clearInterval(typingInterval);
        };
    }, [data.credit_score]);

    const getGradeColor = (grade) => {
        if (['AAA', 'AA'].includes(grade)) return 'text-[#00FF87] border-[#00FF87] bg-[#00FF87]/10';
        if (['A', 'BBB'].includes(grade)) return 'text-[#4FC3F7] border-[#4FC3F7] bg-[#4FC3F7]/10';
        if (['BB', 'B'].includes(grade)) return 'text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10';
        return 'text-[#FF3A3A] border-[#FF3A3A] bg-[#FF3A3A]/10';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#0A0A0F] border border-slate-700 p-3 rounded-lg shadow-xl shadow-black/80">
                    <p className="font-bold text-white mb-1">{data.feature}</p>
                    <p className={`text-sm font-mono ${data.is_positive ? 'text-[#00FF87]' : 'text-[#FF3A3A]'}`}>
                        SHAP Impact: {data.displayImpact > 0 ? '+' : ''}{data.displayImpact.toFixed(1)} points
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl w-full text-slate-200 font-sans shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF87]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF3A3A]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                        <Activity className="text-[#4FC3F7]" /> ML Explainability Engine
                    </h2>
                    <p className="text-sm text-slate-400 font-mono mt-1 tracking-wider uppercase">SHAP Waterfall Analysis</p>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-mono uppercase">Internal Rating</p>
                        <p className="text-3xl font-bold font-mono text-white tracking-widest">{data.credit_score}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border-2 font-bold text-2xl tracking-widest shadow-lg ${getGradeColor(data.risk_grade)}`}>
                        {data.risk_grade}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* 1. SHAP Tornado Chart */}
                <div className="lg:col-span-2 h-[350px] bg-[#0A0A0F] border border-slate-800 rounded-xl p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={animatedData}
                            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                            barSize={20}
                        >
                            <XAxis type="number" stroke="#475569" hide domain={['dataMin - 10', 'dataMax + 10']} />
                            <YAxis dataKey="feature" type="category" width={160} stroke="#94A3B8" fontSize={11} tick={{fill: '#94A3B8'}} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B', opacity: 0.4 }} />
                            <Bar dataKey="displayImpact" radius={[0, 4, 4, 0]} animationDuration={800} animationEasing="ease-out">
                                {animatedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.is_positive ? '#00FF87' : '#FF3A3A'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. Typewriter AI Explanation */}
                <div className="flex flex-col justify-between space-y-4">
                    <div className="bg-[#131B2A] border border-slate-800 rounded-xl p-5 shadow-lg flex-1 relative min-h-[180px]">
                        <h3 className="text-xs font-bold text-[#4FC3F7] font-mono uppercase mb-3 flex items-center gap-2">
                            <ShieldCheck size={14} /> AI Risk Assessment
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-300">
                            {typedExplanation}
                            {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-[#4FC3F7] animate-pulse align-middle"></span>}
                        </p>
                    </div>
                    
                    <div className="bg-[#131B2A] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-mono uppercase mb-1">Probability of Default</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold font-mono ${data.probability_of_default > 10 ? 'text-[#FF3A3A]' : (data.probability_of_default > 3 ? 'text-[#F59E0B]' : 'text-[#00FF87]')}`}>
                                    {data.probability_of_default.toFixed(2)}%
                                </span>
                                {data.probability_of_default > 10 ? <TrendingUp className="text-[#FF3A3A] w-5 h-5" /> : <TrendingDown className="text-[#00FF87] w-5 h-5" />}
                            </div>
                        </div>
                        {data.probability_of_default > 10 && (
                            <div className="bg-[#FF3A3A]/20 border border-[#FF3A3A]/50 p-2 rounded-full animate-pulse">
                                <AlertTriangle className="text-[#FF3A3A] w-6 h-6" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
