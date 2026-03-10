import React, { useState, useEffect } from 'react';
import { Upload, ChevronRight, Activity, ShieldCheck, FileText, Cpu, Zap, Eye } from 'lucide-react';

// Pure CSS Particles Component for the cinematic background
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <div 
                key={i} 
                className="absolute bg-white/10 rounded-full animate-float"
                style={{
                    width: Math.random() * 4 + 1 + 'px',
                    height: Math.random() * 4 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 10 + 5 + 's',
                    animationDelay: Math.random() * 5 + 's'
                }}
            />
        ))}
    </div>
);

// Animated Ticker Component
const TickerLine = () => {
    const symbols = [
        "TATASTL: AAA (820)", "ADANIGR: BBB (680)", "HDFCB: AAA (890)", "RELI: AA (790)", 
        "PAYTM: CCC (450)", "ZOMATO: AA (750)", "INFY: AAA (850)", "WIPRO: AA (770)"
    ];
    
    return (
        <div className="w-full bg-[#131B2A] border-b border-slate-800 overflow-hidden py-1.5 flex items-center font-mono text-[10px] uppercase font-bold">
            <div className="flex whitespace-nowrap animate-ticker">
                {[...Array(4)].map((_, idx) => (
                    <React.Fragment key={idx}>
                        {symbols.map((sym, i) => {
                            const isGreen = parseInt(sym.split('(')[1]) > 700;
                            return (
                                <span key={`${idx}-${i}`} className="mx-6 flex items-center">
                                    <span className="text-slate-400 mr-2">{sym.split(':')[0]}</span>
                                    <span className={isGreen ? 'text-[#00FF87]' : 'text-[#FF3A3A]'}>
                                        {isGreen ? '▲' : '▼'} {sym.split(':')[1]}
                                    </span>
                                </span>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// Animated Number Counter
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quad
            const easeOut = progress * (2 - progress);
            setCount(Math.floor(easeOut * end));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function HeroScreen({ onStartApp }) {
    return (
        <div className="min-h-screen bg-[#0A0A0F] text-slate-200 font-sans relative overflow-hidden flex flex-col items-center">
            <TickerLine />
            <Particles />
            
            {/* Ambient Lighting */}
            <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-[#00FF87]/10 rounded-[100%] blur-[120px] pointer-events-none"></div>

            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@500;700&display=swap');
                .font-syne { font-family: 'Syne', sans-serif; }
                .font-plex { font-family: 'IBM Plex Mono', monospace; }
                
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .animate-float { animation: float infinite linear; }
                
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker { animation: ticker 30s linear infinite; }
                
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}} />

            <div className="relative z-10 max-w-6xl w-full px-6 pt-24 pb-12 flex flex-col items-center text-center">
                
                {/* Logo & Headline */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-[#131B2A]/50 mb-8 backdrop-blur-sm">
                    <Activity className="text-[#00FF87] w-4 h-4 animate-pulse" />
                    <span className="text-xs font-plex tracking-widest text-[#00FF87] uppercase">The Future of B2B Credit Origination</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight leading-none mb-6">
                    Intelli-Credit<span className="text-[#00FF87]">.</span>
                </h1>
                
                <p className="max-w-3xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12">
                    Automate entire Credit Appraisal Memos (CAM). Our hybrid AI/ML engine fuses <span className="text-white">Anthropic Extraction</span>, <span className="text-white">Scikit-Learn Risk Modeling</span>, and <span className="text-white">SHAP Forensics</span> to underwrite Indian corporates in seconds.
                </p>

                {/* Primary Interaction Zone */}
                <div 
                    onClick={onStartApp}
                    className="group relative cursor-pointer"
                >
                    {/* Glowing effect behind the button/dropzone */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF87] to-[#4FC3F7] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                    
                    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-12 py-10 bg-[#0A0A0F] border border-slate-700 rounded-2xl overflow-hidden hover:border-[#00FF87]/50 transition-all z-10">
                        <Upload className="w-12 h-12 text-[#00FF87] mb-4 group-hover:-translate-y-1 transition-transform" />
                        <h3 className="text-2xl font-syne text-white mb-2">Upload CMA Data or Audited Financials</h3>
                        <p className="text-slate-400 text-sm font-plex mb-6">PDF strictly restricted. Encrypted AI routing.</p>
                        
                        <div className="flex items-center gap-2 text-[#00FF87] font-bold font-plex uppercase tracking-widest text-sm bg-[#00FF87]/10 px-6 py-3 rounded-xl group-hover:bg-[#00FF87] group-hover:text-black transition-colors">
                            Enter Application Gateway <ChevronRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Statistics Bar restored as requested */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-y border-slate-800 py-10 px-4">
                    {[
                        { num: 2.4, suffix: "T", label: "₹ Decisions Analyzed" },
                        { num: 98.7, suffix: "%", label: "OCR Accuracy Rate" },
                        { num: 1.2, suffix: "s", label: "Avg Processing Time" },
                        { num: 6, suffix: "", label: "Macro Fraud Vectors" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <h4 className="text-4xl md:text-5xl font-plex font-bold text-white mb-2">
                                <AnimatedCounter end={stat.num} suffix={stat.suffix} />
                            </h4>
                            <p className="text-xs font-plex uppercase tracking-widest text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
