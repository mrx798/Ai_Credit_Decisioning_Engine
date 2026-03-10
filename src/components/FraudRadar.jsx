import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldAlert, AlertOctagon, ChevronDown, ShieldCheck, FileSearch, ArrowRight } from 'lucide-react';

export default function FraudRadar({ fraudData }) {
    const [expandedFlag, setExpandedFlag] = useState(null);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    // Provide extremely visually striking mock data if no props provided OR map from live Demo engine
    const data = fraudData ? {
        fraud_score: fraudData.score || 0,
        radar_data: fraudData.radar || [],
        flags: fraudData.alerts || []
    } : {
        fraud_score: 75,
        radar_data: [
            { subject: "Growth Anomaly", A: 85, fullMark: 100 },
            { subject: "Network Risk", A: 90, fullMark: 100 },
            { subject: "Cash Manipulation", A: 45, fullMark: 100 },
            { subject: "Promoter Risk", A: 70, fullMark: 100 },
            { subject: "Tax Compliance", A: 20, fullMark: 100 },
            { subject: "Legal Scrutiny", A: 10, fullMark: 100 }
        ],
        flags: [
            {
                id: "F1",
                dimension: "Network Risk",
                title: "High Related-Party Tx (42%)",
                severity: "HIGH",
                evidence: "Value extracted from Notes to Accounts Section 18. Audited schedule indicates ₹45Cr funneled to Bharat Trading Co (Shell entity) without clear operational backing.",
                points: 35
            },
            {
                id: "F2",
                dimension: "Growth Anomaly",
                title: "Unbacked Revenue Spike (180% YoY)",
                severity: "HIGH",
                evidence: "P&L shows massive 180% growth but Balance Sheet Fixed Assets remain flat (+2%). High risk of circular/paper trading operations inflations.",
                points: 30
            },
            {
                id: "F3",
                dimension: "Promoter Risk",
                title: "Director in 6 entities",
                severity: "MEDIUM",
                evidence: "MCA Registry API cross-reference shows Director holding board seats in multiple defunct/struck-off entities in Gujarat.",
                points: 10
            }
        ]
    };

    const isHighRisk = data.fraud_score > 60;

    return (
        <div className={`bg-[#0A0A0F] border ${isHighRisk ? 'border-[#FF3A3A]/50' : 'border-[#00FF87]/50'} p-6 rounded-2xl w-full text-slate-200 font-sans shadow-2xl relative overflow-hidden transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Ambient Pulsing Background for High Risk */}
            {isHighRisk && (
                <div className="absolute inset-0 bg-[#FF3A3A]/5 animate-pulse pointer-events-none"></div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isHighRisk ? <AlertOctagon className="text-[#FF3A3A]" /> : <ShieldCheck className="text-[#00FF87]" />} 
                        Real-Time Fraud Detection
                    </h2>
                    <p className="text-sm text-slate-400 font-mono mt-1">6-Dimensional Forensic Heuristics Overlay</p>
                </div>
                
                <div className={`px-5 py-3 rounded-xl border-2 flex items-center gap-3 backdrop-blur-md ${isHighRisk ? 'border-[#FF3A3A] text-[#FF3A3A] bg-[#FF3A3A]/10 shadow-[0_0_20px_rgba(255,58,58,0.3)]' : 'border-[#00FF87] text-[#00FF87] bg-[#00FF87]/10'}`}>
                    <div className="text-right">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-300">Fraud Probability</p>
                        <p className="text-2xl font-bold font-mono leading-none">{data.fraud_score}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                
                {/* 1. Radar Spider Chart */}
                <div className="h-[350px] bg-black/40 border border-slate-800 rounded-xl relative group flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radar_data}>
                            <PolarGrid stroke="#1E293B" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                            <Radar 
                                name="Risk Exposure" 
                                dataKey="A" 
                                stroke={isHighRisk ? "#FF3A3A" : "#00FF87"} 
                                fill={isHighRisk ? "#FF3A3A" : "#00FF87"} 
                                fillOpacity={0.4} 
                                isAnimationActive={true}
                                animationDuration={1500}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0A0A0F', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: isHighRisk ? "#FF3A3A" : "#00FF87" }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                    
                    {/* Center Core Pulse effect */}
                    {isHighRisk && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF3A3A] rounded-full animate-ping opacity-75 pointer-events-none"></div>
                    )}
                </div>

                {/* 2. Flag Accordion List */}
                <div className="flex flex-col h-[350px]">
                    <h3 className="text-sm font-bold text-slate-400 font-mono uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Triggered Forensic Flags ({data.flags.length})</h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {data.flags && data.flags.length > 0 ? data.flags.map((flag, index) => (
                            <div 
                                key={flag.id || index} 
                                className={`border rounded-lg overflow-hidden transition-all duration-300 ${expandedFlag === (flag.id || index) ? 'bg-[#131B2A] border-slate-600' : 'bg-black/40 border-slate-800 hover:border-slate-600'}`}
                            >
                                <div 
                                    className="p-3 flex justify-between items-center cursor-pointer select-none"
                                    onClick={() => setExpandedFlag(expandedFlag === (flag.id || index) ? null : (flag.id || index))}
                                >
                                    <div className="flex items-center gap-3">
                                        {flag.severity === "HIGH" ? (
                                            <ShieldAlert className="text-[#FF3A3A] w-5 h-5" />
                                        ) : (
                                            <AlertOctagon className="text-[#F59E0B] w-5 h-5" />
                                        )}
                                        <div>
                                            <div className="text-xs text-slate-500 font-mono">{flag.dimension}</div>
                                            <div className="text-sm font-bold text-slate-200">{flag.title}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-xs font-bold px-2 py-0.5 rounded ${flag.severity === 'HIGH' ? 'bg-[#FF3A3A]/20 text-[#FF3A3A]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                                            {flag.severity}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${expandedFlag === (flag.id || index) ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                
                                <div 
                                    className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${expandedFlag === (flag.id || index) ? 'max-h-40 py-3 border-t border-slate-800' : 'max-h-0 py-0'}`}
                                >
                                    <h4 className="flex items-center gap-1 text-[#4FC3F7] text-xs font-bold uppercase mb-1">
                                        <FileSearch size={12} /> Source Evidence snippet
                                    </h4>
                                    <p className="text-sm text-slate-400 italic">"{flag.evidence}"</p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <ShieldCheck className="w-12 h-12 text-[#00FF87]/50 mb-2" />
                                <p className="text-sm">No significant anomaly flags detected.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Call to Action for High Risk */}
                    {isHighRisk && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <button className="w-full bg-[#FF3A3A] hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF3A3A]/20 transform hover:scale-[1.02]">
                                Refer to Human Compliance Team <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
