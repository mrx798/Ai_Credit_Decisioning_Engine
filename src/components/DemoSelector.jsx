import React from 'react';
import { DEMO_COMPANIES } from '../data/demoCompanies';
import { PlaySquare, Database, AlertOctagon, TrendingUp, Cpu } from 'lucide-react';

export default function DemoSelector({ onSelect }) {
    const getCompanyIcon = (id) => {
        if (id === 'stressed_nbfc') return <AlertOctagon size={18} className="text-[#FF3A3A] group-hover:animate-pulse" />;
        if (id === 'tata_steel') return <Database size={18} className="text-[#4FC3F7]" />;
        if (id === 'zomato') return <TrendingUp size={18} className="text-[#00FF87]" />;
        return <Cpu size={18} className="text-slate-400" />;
    };

    return (
        <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl w-full text-slate-200 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4FC3F7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlaySquare className="text-[#00FF87]" /> Live Hackathon Demo Selector
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xl">
                        Instantly populate the deterministic ML, Risk, and Fraud engines with pre-verified Indian corporate data. Skips OCR latency for seamless stage presentations.
                    </p>
                </div>
                <div className="px-3 py-1 bg-[#131B2A] border border-slate-700 rounded text-xs font-mono text-slate-400">
                    STATUS: <span className="text-[#00FF87] animate-pulse">WARM STANDBY</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {DEMO_COMPANIES.map(company => (
                    <button
                        key={company.id}
                        onClick={() => onSelect(company)}
                        className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between h-full group
                            ${company.id === 'stressed_nbfc' 
                                ? 'border-[#FF3A3A]/40 hover:border-[#FF3A3A] bg-[#FF3A3A]/5 hover:bg-[#FF3A3A]/10 shadow-[0_0_15px_rgba(255,58,58,0)] hover:shadow-[0_0_15px_rgba(255,58,58,0.2)]' 
                                : 'border-[#4FC3F7]/40 hover:border-[#4FC3F7] bg-[#4FC3F7]/5 hover:bg-[#4FC3F7]/10 shadow-[0_0_15px_rgba(79,195,247,0)] hover:shadow-[0_0_15px_rgba(79,195,247,0.2)]'
                            }
                        `}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white leading-tight pr-2">{company.name}</h4>
                                {getCompanyIcon(company.id)}
                            </div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">{company.sector}</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-tight border-t border-slate-800/50 pt-2">{company.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
