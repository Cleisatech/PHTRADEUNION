import React, { useState, useEffect } from "react";
import { useSimulation } from "../context/SimulationContext";
import { RANDOM_FIRST_NAMES, RANDOM_LAST_NAMES, RANDOM_PAYOUT_METHODS } from "../data/mockData";
import { 
  TrendingUp, ArrowUpRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Download, FileText, Sparkles, Building, Landmark, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 1,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: quadOut
      const easePercentage = percentage * (2 - percentage);
      const currentVal = startValue + easePercentage * (endValue - startValue);
      setCount(currentVal);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export const LandingPage: React.FC = () => {
  const { setView, themeConfig, getThemeStyles } = useSimulation();
  const theme = getThemeStyles(themeConfig?.primaryColor || "blue");

  // Dynamic Live Payout Settled Toast State
  const [livePayout, setLivePayout] = useState({
    name: "f***t",
    platform: "Maya",
    amount: "₱29,580",
    timeAgo: "Just now"
  });

  const [currency, setCurrency] = useState<"PHP" | "USD">("PHP");

  // Dynamic Payout List for Carousel
  const [settledPayouts, setSettledPayouts] = useState([
    { id: 1, name: "Maria Santos", platform: "GCash", amount: "₱45,320.00", roi: "+15.2% ROI", date: "01-18", status: "Settled", tenor: "3 MO" },
    { id: 2, name: "Juan Dela Cruz", platform: "CO-OP", amount: "₱28,750.00", roi: "+17.5% ROI", date: "01-15", status: "Settled", tenor: "2 MO" },
    { id: 3, name: "Ana Reyes", platform: "BDO", amount: "₱72,400.00", roi: "+12.3% ROI", date: "01-12", status: "Settled", tenor: "4 MO" },
  ]);

  // Rotator effect for Live Settled Toast
  useEffect(() => {
    const interval = setInterval(() => {
      const randomFirstName = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
      const firstLetter = randomFirstName[0].toLowerCase();
      const lastLetter = randomFirstName[randomFirstName.length - 1].toLowerCase();
      const maskedName = `${firstLetter}***${lastLetter}`;
      
      const randomPlatform = RANDOM_PAYOUT_METHODS[Math.floor(Math.random() * RANDOM_PAYOUT_METHODS.length)];
      const randomAmountVal = Math.floor(Math.random() * 85000) + 5000;
      const formattedAmount = `₱${randomAmountVal.toLocaleString()}`;

      setLivePayout({
        name: maskedName,
        platform: randomPlatform,
        amount: formattedAmount,
        timeAgo: "Just now"
      });

      // Also dynamically prepend onto our settled record list to show live activity!
      setSettledPayouts((prev) => {
        const newRecord = {
          id: Date.now(),
          name: `${randomFirstName} ${RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)]}`,
          platform: randomPlatform,
          amount: `${formattedAmount}.00`,
          roi: `+${(Math.random() * 8 + 10).toFixed(1)}% ROI`,
          date: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace("/", "-"),
          status: "Settled",
          tenor: `${[1, 2, 3, 6][Math.floor(Math.random() * 4)]} MO`
        };
        return [newRecord, ...prev.slice(0, 2)];
      });

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 font-sans leading-normal overflow-x-hidden select-none">
      
      {/* ⚠️ Top Regulatory Banner notice */}
      <section className="w-full bg-blue-50 py-2 border-b border-blue-100 flex items-center justify-center text-xs text-blue-800 font-medium px-4 gap-2">
        <Sparkles size={13} className="text-blue-600 animate-spin" />
        菲律宾机构资本认证 — SEC licensed, BSP regulated multi-currency trading deck.
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        
        {/* Left Column Description */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-7">
          <span className={`font-mono text-xs uppercase font-bold ${theme.primaryText} tracking-widest flex items-center gap-2`}>
            <span className={`block h-2 w-2 rounded-full ${theme.primaryBg} animate-pulse`} />
            🇵🇭 Philippine Institutional Trading Desk • Est. 2019
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] font-sans">
            Where Filipino capital meets <span className={`${theme.primaryText}`}>institutional alpha.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl">
            A regulated, multi-asset trading desk built for the Philippines. SEC-registered, BSP-supervised, and trusted by <span className="font-semibold text-slate-800">50,000+ investors</span> managing live positions in equities, FX, commodities, and digital assets — settled directly to your local bank or e-wallet.
          </p>

          {/* Quick Metrics Bar with Currency Toggle */}
          <div className="space-y-3 max-w-xl">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100/80 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Global Desk Metrics</span>
              
              <div className="flex items-center gap-1.5 bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/50">
                <button
                  onClick={() => setCurrency("PHP")}
                  className={`px-2.5 py-1 text-[9px] font-mono font-black rounded-md transition-all uppercase cursor-pointer ${
                    currency === "PHP"
                      ? "bg-white text-slate-900 shadow-xs scale-102"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  PHP (₱)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-2.5 py-1 text-[9px] font-mono font-black rounded-md transition-all uppercase cursor-pointer ${
                    currency === "USD"
                      ? "bg-white text-slate-900 shadow-xs scale-102"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-y border-slate-200 py-5">
              <div>
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">AUM</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                  <AnimatedCounter
                    key={`aum-${currency}`}
                    value={currency === "PHP" ? 2.5 : 45.5}
                    prefix={currency === "PHP" ? "₱" : "$"}
                    suffix={currency === "PHP" ? "B+" : "M+"}
                    decimals={1}
                  />
                </p>
                <p className="text-slate-500 text-[10px]">under management</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">24H VOL</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                  <AnimatedCounter
                    key={`vol-${currency}`}
                    value={currency === "PHP" ? 48.2 : 876.4}
                    prefix={currency === "PHP" ? "₱" : "$"}
                    suffix={currency === "PHP" ? "M" : "K"}
                    decimals={1}
                  />
                </p>
                <p className="text-slate-500 text-[10px]">executed trades</p>
              </div>
              <div>
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">WIN RATE</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 font-sans">
                  <AnimatedCounter
                    key="win-rate"
                    value={94.2}
                    prefix=""
                    suffix="%"
                    decimals={1}
                  />
                </p>
                <p className="text-slate-500 text-[10px]">🏆 last 90 days</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={() => setView("signup")}
              className={`${theme.primaryBg} ${theme.hoverBg} text-white font-bold tracking-wide uppercase text-xs px-8 py-4 rounded-xl shadow-xl ${theme.shadowPrimary} active:scale-95 transition-all text-center cursor-pointer`}
            >
              Open A Live Account ➔
            </button>
            <button
              onClick={() => setView("login")}
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold tracking-wide uppercase text-xs px-8 py-4 rounded-xl active:scale-95 transition-all text-center cursor-pointer"
            >
              Access Terminal
            </button>
          </div>

          <div className="flex items-center gap-5 text-slate-500 text-xs font-mono pt-1">
            <span className="flex items-center gap-1.5">⏱️ 1,000 MIN</span>
            <span className="flex items-center gap-1.5">⚡ 24H PAYOUT</span>
            <span className="flex items-center gap-1.5">🛡️ NO HIDDEN FEES</span>
          </div>
        </div>

        {/* Right Column Layout: Simulated Live Trading App, matching the screenshot perfectly */}
        <div className="lg:col-span-5 relative w-full flex justify-center items-center">
          
          {/* BACKGROUND glow elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* DYNAMIC LIVE PAYOUT SETTLED TOAST - TOP RIGHT AS PER SCREENSHOT */}
          <div className="absolute -top-6 right-0 z-40 w-64 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 p-3.5 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="bg-emerald-500/15 text-emerald-400 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                PAYOUT SETTLED
              </span>
              <span className="text-[10px] text-slate-500 font-mono">TXN-Live</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={livePayout.name}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{livePayout.name} • {livePayout.platform}</h4>
                  <p className="text-lg font-black text-emerald-400">{livePayout.amount}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-400 font-mono block">💰 Paid sent</span>
                  <span className="text-[9px] text-slate-500 block">Just now</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* PRIMARY GRAPHICS TRADING BOX */}
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Window bar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-[10px] font-mono text-slate-400 ml-2">ITR Terminal v5.2 • PSE.LIVE</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest font-mono">
                ● LIVE
              </span>
            </div>

            {/* Portfolio detail */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Portfolio Value</span>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-slate-900">₱125,430.50</p>
                  <span className="text-xs font-semibold text-emerald-500 font-mono">+12.5%</span>
                </div>
                <p className="text-[9px] text-slate-500 font-mono leading-none">24H CHANGE DETECTED</p>
              </div>

              {/* Sparkline graphics area */}
              <div className="h-24 w-full bg-slate-50 rounded-xl relative overflow-hidden flex items-end p-2 border border-slate-100">
                {/* SVG Line representation chart */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 80 Q 20 60, 40 70 T 80 30 T 100 20 L 100 100 L 0 100 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0 80 Q 20 60, 40 70 T 80 30 T 100 20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="20" r="3.5" fill="#3b82f6" className="animate-pulse" />
                </svg>
                
                {/* Grid markings */}
                <div className="absolute right-2 top-2 flex flex-col gap-1 text-[8px] font-mono text-slate-400 text-right">
                  <span>₱125K</span>
                  <span>₱120K</span>
                  <span>₱115K</span>
                </div>
              </div>

              {/* Quick trade assets statistics list */}
              <div className="grid grid-cols-3 gap-2.5 pt-1.5">
                <div className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-100 text-center transition-colors">
                  <span className="text-[9px] font-mono text-slate-400 block">BTC/USD</span>
                  <span className="text-[11px] font-extrabold text-slate-800">67,482</span>
                  <span className="text-[9px] font-mono text-emerald-500 block font-bold">+2.4%</span>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-100 text-center transition-colors">
                  <span className="text-[9px] font-mono text-slate-400 block">ETH/USD</span>
                  <span className="text-[11px] font-extrabold text-slate-800">3,541</span>
                  <span className="text-[9px] font-mono text-emerald-500 block font-bold">+1.8%</span>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-100 text-center transition-colors">
                  <span className="text-[9px] font-mono text-slate-400 block">VOL/PHP</span>
                  <span className="text-[11px] font-extrabold text-slate-800">56.23</span>
                  <span className="text-[9px] font-mono text-red-500 block font-bold">-0.12%</span>
                </div>
              </div>

              {/* Footer specs */}
              <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex flex-col">
                  <span>ACTIVE</span>
                  <span className="font-extrabold text-slate-800">3</span>
                </div>
                <div className="flex flex-col text-center">
                  <span>WIN RATE</span>
                  <span className="font-extrabold text-emerald-600">94.2%</span>
                </div>
                <div className="flex flex-col text-right">
                  <span>TOTAL P&L</span>
                  <span className="font-extrabold text-emerald-600">+₱15,430</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GIANT HIGH CONTRAST INVEST & E-WALLETS PROMO BANNER AS REQUESTED */}
      <section className="bg-[#0f172a] text-white py-14 relative overflow-hidden">
        {/* Abstract background graphics pattern to simulate bills or gold */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0a0f1d] to-[#040815] pointer-events-none" />
        <div className="absolute top-0 right-0 h-96 w-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center flex flex-col items-center">
          
          <div className="bg-blue-500/15 text-blue-400 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-flex items-center gap-1.5 border border-blue-500/20">
            🥇 INTRODUCING THE FILIPINO POWER-TIER YIELD Desk
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 line-clamp-2 md:max-w-3xl">
            INVEST & EARN <br className="sm:hidden" /> IN THE PHILIPPINES!
          </h2>
          
          {/* Mock Money & Wallet Presentation visual badge row */}
          <div className="flex items-center gap-4 justify-center py-5">
            <span className="text-5xl shadow-2xl animate-bounce">💵</span>
            <span className="text-5xl shadow-2xl delay-100 animate-bounce">📈</span>
            <span className="text-5xl shadow-2xl delay-200 animate-bounce">🏦</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full pt-4">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500/30 transition-all">
              <p className="text-amber-400 text-3xl font-black mb-1">₱1,000</p>
              <h4 className="text-sm font-bold text-white mb-1">Start Small & Safe</h4>
              <p className="text-xs text-slate-400">Minimal commitment to test exact live alpha trading clearance.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500/30 transition-all">
              <p className="text-emerald-400 text-3xl font-black mb-1">24-Hours</p>
              <h4 className="text-sm font-bold text-white mb-1">Payout/Settlements</h4>
              <p className="text-xs text-slate-400">Instant withdraw processing to any Philippine e-wallet or bank.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500/30 transition-all">
              <p className="text-blue-400 text-3xl font-black mb-1">100% Secure</p>
              <h4 className="text-sm font-bold text-white mb-1">BSP / SEC Regulated</h4>
              <p className="text-xs text-slate-400">Rest secured with deep cryptographic compliance and audit.</p>
            </div>
          </div>

          <button
            onClick={() => setView("signup")}
            className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider uppercase text-xs px-10 py-4.5 rounded-xl transition-all shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 cursor-pointer"
          >
            MESSAGE US NOW ➔
          </button>
        </div>
      </section>

      {/* COMPLIANCE GRID BLOCK AS SCREENSHOT */}
      <section id="compliance" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 bg-white">
        <div className="text-center space-y-3 mb-14">
          <span className="font-mono text-blue-600 uppercase text-xs font-bold tracking-widest block">// REGULATORY</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Fully licensed in the Republic of the Philippines</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Audited compliance — Segregated client funds — Filed with all relevant authorities. Enjoy complete safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-shadow relative overflow-hidden bg-slate-50">
            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
              🏆 Verified
            </span>
            <div className="h-11 w-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold mb-4">
              🏛️
            </div>
            <h3 className="font-bold text-slate-800 text-sm">SEC</h3>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">Securities & Exchange Commission</p>
            <p className="text-xs text-slate-500 mb-4">REG • CS202512345. Full verification clearing profile.</p>
            
            <a href="#" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline bg-white py-1 px-2.5 rounded border border-slate-200">
              <Download size={12} />
              SEC-Certificate-2026.pdf
            </a>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-shadow relative overflow-hidden bg-slate-50">
            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
              🏆 Verified
            </span>
            <div className="h-11 w-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold mb-4">
              🛡️
            </div>
            <h3 className="font-bold text-slate-800 text-sm">BSP</h3>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">Bangko Sentral ng Pilipinas</p>
            <p className="text-xs text-slate-500 mb-4">REG • bsp-01-2026. Approved local currency payout channels.</p>
            
            <a href="#" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline bg-white py-1 px-2.5 rounded border border-slate-200">
              <Download size={12} />
              BSP-FinancialLicense.pdf
            </a>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-shadow relative overflow-hidden bg-slate-50">
            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
              🏆 Verified
            </span>
            <div className="h-11 w-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold mb-4">
              ⚖️
            </div>
            <h3 className="font-bold text-slate-800 text-sm">AMLC</h3>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">Anti-Money Laundering Council</p>
            <p className="text-xs text-slate-500 mb-4">REG • FULL COMPLIANCE. Registered with AMLC criteria for risk reduction.</p>
            
            <a href="#" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline bg-white py-1 px-2.5 rounded border border-slate-200">
              <Download size={12} />
              AMLC-RegCertificate.pdf
            </a>
          </div>

          {/* Card 4 */}
          <div className="border border-slate-200 rounded-xl p-5 hover:shadow-xl transition-shadow relative overflow-hidden bg-slate-50">
            <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
              🏆 Verified
            </span>
            <div className="h-11 w-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold mb-4">
              🔏
            </div>
            <h3 className="font-bold text-slate-800 text-sm">ISO 27001</h3>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">Information Security Standard</p>
            <p className="text-xs text-slate-500 mb-4">REG • CERTIFIED. Encrypted, highly isolated asset ledgers.</p>
            
            <a href="#" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline bg-white py-1 px-2.5 rounded border border-slate-200">
              <Download size={12} />
              ISO-27001-2024.pdf
            </a>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6 font-mono">
          * CONFIDENTIAL COMPLIANCE FILED REGISTER WITH LOCAL PHILIPPINES COUNTERPARTS. DETAILED SPECIFICATION REGISTERED TO MEMBERS PORTALS.
        </p>
      </section>

      {/* VERIFIED PAYOUTS ON DISK DISPLAY CARD GRID */}
      <section id="payouts" className="bg-[#f1f5f9] border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3 mb-14">
            <span className="font-mono text-blue-600 uppercase text-xs font-bold tracking-widest block">// CLIENT EXECUTION</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified payouts, on the record.</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Every settlement below is on-chain in our internal ledger and reconciled with partner banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settledPayouts.map((pay) => (
              <div key={pay.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <span className="block h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {pay.status}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">TXN-{pay.id.toString().substring(0,6)}</span>
                </div>

                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wide">Net Payout</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-2xl font-black text-emerald-600">{pay.amount}</p>
                  <span className="text-[11px] font-mono font-bold text-emerald-600">{pay.roi}</span>
                </div>

                <div className="grid grid-cols-3 gap-1 border-t border-slate-100 py-3 text-[10px] font-mono text-slate-500 mb-4">
                  <div>
                    <span>PRINCIPAL</span>
                    <p className="font-bold text-slate-800">₱30,000</p>
                  </div>
                  <div>
                    <span>TENOR</span>
                    <p className="font-bold text-slate-800">{pay.tenor}</p>
                  </div>
                  <div className="text-right">
                    <span>DATE</span>
                    <p className="font-bold text-slate-800">{pay.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {pay.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11px]">{pay.name}</h4>
                      <p className="text-[9px] text-slate-400 font-mono">{pay.platform} • PH</p>
                    </div>
                  </div>
                  
                  {/* Rating mock stars */}
                  <div className="text-xs text-amber-500 flex font-sans">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Settlement Blotter statistics bar */}
          <div className="mt-12 bg-slate-900 text-white rounded-2xl grid grid-cols-1 md:grid-cols-3 border border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-center py-7 shadow-lg">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Weekly Settlement Blotter</p>
              <h3 className="text-2xl font-black text-emerald-400">₱15,432,500</h3>
              <p className="text-xs text-slate-400">Paid this week</p>
            </div>
            <div className="py-5 md:py-0">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Processing Success</p>
              <h3 className="text-2xl font-black text-white">2,847</h3>
              <p className="text-xs text-slate-400">Successful payouts</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Processing ETA</p>
              <h3 className="text-2xl font-black text-white">24H</h3>
              <p className="text-xs text-secondary-text">Avg. clearance dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* REAL REVEAL RESULTS IMAGE SECTION AND TESTIMONIALS */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="font-mono text-blue-600 uppercase text-xs font-bold tracking-widest block">// TESTIMONIALS</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Real results, real Filipinos.</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Verified withdrawals from members across the archipelago.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform relative group">
              <div className="h-48 bg-gradient-to-br from-blue-700 to-indigo-900 relative flex items-center justify-center p-6 border-b border-slate-800">
                <span className="text-6xl absolute opacity-20 select-none">🇵🇭</span>
                <div className="text-center z-10">
                  <p className="text-slate-300 text-xs uppercase tracking-widest mb-1 font-mono">Withdrawal Success!</p>
                  <h3 className="text-3xl font-black text-emerald-400">₱12,000.00</h3>
                  <span className="text-xs bg-slate-950/40 py-1 px-2.5 rounded-full mt-1.5 inline-block font-mono">Via GCash</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-white text-base">"Kumita na ako!"</h4>
                <p className="text-slate-400 text-xs mt-2 italic leading-relaxed">
                  "At first standard subukang lagyan ng ₱1,000 tapos automatic nakita ko ang pagtaas up to ₱12,000. Secured and really easy to transact with the manager Mateo!"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Angelica Rivera</span>
                  <span className="text-slate-500 font-mono">Cavite • Verified User</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform relative group">
              <div className="h-48 bg-gradient-to-br from-indigo-700 to-purple-900 relative flex items-center justify-center p-6 border-b border-slate-800">
                <span className="text-6xl absolute opacity-20 select-none">🇵🇭</span>
                <div className="text-center z-10">
                  <p className="text-slate-300 text-xs uppercase tracking-widest mb-1 font-mono">Withdrawal Success!</p>
                  <h3 className="text-3xl font-black text-emerald-400">₱25,500.00</h3>
                  <span className="text-xs bg-slate-950/40 py-1 px-2.5 rounded-full mt-1.5 inline-block font-mono">Via Maya</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-white text-base">"Sulit ang Kita!"</h4>
                <p className="text-slate-400 text-xs mt-2 italic leading-relaxed">
                  "No generic requirements, direct withdrawal clearance instructions within minutes, super grateful to the team at PH Trade Union for keeping it professional."
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Robert Fernandez</span>
                  <span className="text-slate-500 font-mono">Iloilo City • Verified User</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform relative group">
              <div className="h-48 bg-gradient-to-br from-blue-800 to-slate-900 relative flex items-center justify-center p-6 border-b border-slate-800">
                <span className="text-6xl absolute opacity-20 select-none">🇵🇭</span>
                <div className="text-center z-10">
                  <p className="text-slate-300 text-xs uppercase tracking-widest mb-1 font-mono">Withdrawal Success!</p>
                  <h3 className="text-3xl font-black text-emerald-400">₱38,000.00</h3>
                  <span className="text-xs bg-slate-950/40 py-1 px-2.5 rounded-full mt-1.5 inline-block font-mono">Via BDO</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-white text-base">"Napakadali!"</h4>
                <p className="text-slate-400 text-xs mt-2 italic leading-relaxed">
                  "With basic setup inside thirty minutes, live charts to track. All transactions are clean and instantly supported. Best local terminal bar none."
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Diana Althea</span>
                  <span className="text-slate-500 font-mono">Metro Manila • Verified User</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED CHANNELS WALL INTEGRATION AS SCREENSHOT */}
      <section id="wallets" className="bg-[#f8fafc] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="font-mono text-blue-600 uppercase text-xs font-bold tracking-widest block">// COMPATIBLE RAILS</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settle in PHP, instantly.</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Settle, invest, or withdraw to any major Philippine e-wallet or commercial bank. No conversion delays.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
            {[
              { name: "GCash", logo: "🔵", type: "E-Wallet" },
              { name: "Maya", logo: "🟢", type: "E-Wallet" },
              { name: "BDO", logo: "🏢", type: "Commercial Bank" },
              { name: "BPI", logo: "🏛️", type: "Commercial Bank" },
              { name: "Metrobank", logo: "🏦", type: "Commercial Bank" },
              { name: "UnionBank", logo: "🟠", type: "Commercial Bank" },
              { name: "Landbank", logo: "🌾", type: "State Bank" },
              { name: "RCBC", logo: "💰", type: "Commercial Bank" },
              { name: "Security Bank", logo: "🔒", type: "Commercial Bank" },
              { name: "GoTyme", logo: "🌀", type: "Digital Bank" },
              { name: "Tonik", logo: "🟣", type: "Digital Bank" },
              { name: "Coins.ph", logo: "🟡", type: "Crypto Rail" },
            ].map((rail, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-xs hover:shadow-md hover:border-blue-500/25 transition-all">
                <span className="text-3xl block mb-2">{rail.logo}</span>
                <h4 className="font-extrabold text-slate-800 text-xs">{rail.name}</h4>
                <span className="text-[9px] font-mono text-slate-400 block uppercase mt-0.5">{rail.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW-TO / START TODAY */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-blue-500/20">
              ⚡ STEP-BY-STEP SPEED onboarding
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Position your <br className="hidden sm:inline" /> capital today.
            </h2>
            <p className="text-slate-400 text-sm max-w-lg">
              Begin building high-performance yield immediately. Sign up, settle your custom account coordinates with Mateo, and watch your allocation deploy safely.
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white h-7 w-7 rounded-full flex items-center justify-center font-bold font-mono text-xs mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold">Register Wallet Credentials</h4>
                  <p className="text-xs text-slate-400">Register name coordinates corresponding strictly with GCash/BPI.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white h-7 w-7 rounded-full flex items-center justify-center font-bold font-mono text-xs mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold">Obtain Deposit Routing</h4>
                  <p className="text-xs text-slate-400">Coordinate coordinates with relationship manager Mateo inside support chat.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white h-7 w-7 rounded-full flex items-center justify-center font-bold font-mono text-xs mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold">Initiate Instant Yield</h4>
                  <p className="text-xs text-slate-400">Withdraw or allocate yield proceeds securely at any clearance timeframe.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-800/50 border border-slate-700/60 p-7 rounded-2xl md:max-w-md w-full flex flex-col justify-center space-y-4 shadow-xl">
            <h3 className="font-extrabold text-lg text-white">Create New Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock access to the most powerful trading desk in the Philippines. Zero fees on starting allocations.
            </p>
            
            <input 
              type="text" 
              placeholder="Full Name (aligned with bank ID)" 
              className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={() => setView("signup")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg shadow-lg active:scale-95 transition-all text-center cursor-pointer"
            >
              Get Free Allocation Credentials ➔
            </button>
            <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
              🔒 Bank-grade encrypted credential portal.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-900">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              📈 PH TRADE UNION
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Licensed multi-asset trading and financial dispatch portal supervised by SEC regulation CS202512345, enabling cryptographic yield allocations.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">NAVIGATE</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setView("landing")} className="hover:text-white transition-colors">Markets Home</button></li>
              <li><button onClick={() => setView("user_dashboard")} className="hover:text-white transition-colors">User Terminal</button></li>
              <li><a href="#compliance" className="hover:text-white transition-colors">Regulatory Filing</a></li>
              <li><a href="#wallets" className="hover:text-white transition-colors">Supported E-Wallets</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">LEGAL</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure statement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SEC / BSP filing credentials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">CONTACT INFO</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              📍 Makati City, Metro Manila, Philippines<br />
              📞 +63 (2) 8888-1234<br />
              ✉️ support@phtradeunion.online
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PH Trade Union Inc. All rights reserved. Registered in the Philippines.</p>
          <div className="flex gap-4 font-mono text-[10px] text-slate-600">
            <span>SEC CS202512345</span>
            <span>BSP SUPERVISED</span>
            <span>AMLC COMPLIANT</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
