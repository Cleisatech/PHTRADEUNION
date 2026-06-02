import React, { useState, useEffect } from "react";
import { useSimulation } from "../context/SimulationContext";
import { TrendingUp, User, ShieldCheck, HelpCircle, Activity, Landmark, LogOut, LogIn } from "lucide-react";

export const Header: React.FC = () => {
  const { currentView, setView, profile, isLoggedIn, isLocalMode, logout, themeConfig, getThemeStyles } = useSimulation();
  const theme = getThemeStyles(themeConfig.primaryColor);

  // Simulated ticker prices with values and change percents
  const [prices, setPrices] = useState({
    psei: { val: 6750.94, chg: 0.84 },
    usdPhp: { val: 58.132, chg: 2.41 },
    btcUsd: { val: 67482, chg: 1.82 },
    ethUsd: { val: 3541, chg: 1.10 },
    gold: { val: 2634.42, chg: 0.31 },
    bpi: { val: 127.87, chg: 0.55 },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPrices((p) => {
        const pseiDiff = (Math.random() - 0.49) * 4.4;
        const usdPhpDiff = (Math.random() - 0.5) * 0.015;
        const btcUsdDiff = (Math.random() - 0.45) * 22; // bias slightly upward for bullish action
        const ethUsdDiff = (Math.random() - 0.46) * 2.5;
        const goldDiff = (Math.random() - 0.5) * 0.4;
        const bpiDiff = (Math.random() - 0.49) * 0.08;

        const newPsei = +(p.psei.val + pseiDiff).toFixed(2);
        const newUsdPhp = +(p.usdPhp.val + usdPhpDiff).toFixed(3);
        const newBtcUsd = +(p.btcUsd.val + btcUsdDiff).toFixed(0);
        const newEthUsd = +(p.ethUsd.val + ethUsdDiff).toFixed(0);
        const newGold = +(p.gold.val + goldDiff).toFixed(2);
        const newBpi = +(p.bpi.val + bpiDiff).toFixed(2);

        const newPseiChg = +(p.psei.chg + (pseiDiff / p.psei.val) * 100).toFixed(2);
        const newUsdPhpChg = +(p.usdPhp.chg + (usdPhpDiff / p.usdPhp.val) * 100).toFixed(3);
        const newBtcUsgChg = +(p.btcUsd.chg + (btcUsdDiff / p.btcUsd.val) * 100).toFixed(3);
        const newEthUsdChg = +(p.ethUsd.chg + (ethUsdDiff / p.ethUsd.val) * 100).toFixed(3);
        const newGoldChg = +(p.gold.chg + (goldDiff / p.gold.val) * 100).toFixed(3);
        const newBpiChg = +(p.bpi.chg + (bpiDiff / p.bpi.val) * 100).toFixed(3);

        return {
          psei: { val: newPsei, chg: newPseiChg },
          usdPhp: { val: newUsdPhp, chg: newUsdPhpChg },
          btcUsd: { val: newBtcUsd, chg: newBtcUsgChg },
          ethUsd: { val: newEthUsd, chg: newEthUsdChg },
          gold: { val: newGold, chg: newGoldChg },
          bpi: { val: newBpi, chg: newBpiChg },
        };
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const renderTickerList = () => (
    <div className="flex items-center gap-10 shrink-0 select-none pb-0.5" style={{ paddingRight: "2.5rem" }}>
      <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        LIVE
      </span>
      <span className="text-slate-400 font-semibold tracking-wide">SESSION OPEN</span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        PSEi <span className="font-semibold text-white">{prices.psei.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>{" "}
        <span className={`${prices.psei.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.psei.chg >= 0 ? "+" : ""}{prices.psei.chg.toFixed(2)}%
        </span>
      </span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        USD/PHP <span className="font-semibold text-white">{prices.usdPhp.val.toFixed(3)}</span>{" "}
        <span className={`${prices.usdPhp.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.usdPhp.chg >= 0 ? "+" : ""}{prices.usdPhp.chg.toFixed(2)}%
        </span>
      </span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        BTC/USD <span className="font-semibold text-white">₱{(prices.btcUsd.val * prices.usdPhp.val).toLocaleString(undefined, {maximumFractionDigits:0})}</span>{" "}
        <span className={`${prices.btcUsd.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.btcUsd.chg >= 0 ? "+" : ""}{prices.btcUsd.chg.toFixed(2)}%
        </span>
      </span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        ETH/USD <span className="font-semibold text-white">₱{(prices.ethUsd.val * prices.usdPhp.val).toLocaleString(undefined, {maximumFractionDigits:0})}</span>{" "}
        <span className={`${prices.ethUsd.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.ethUsd.chg >= 0 ? "+" : ""}{prices.ethUsd.chg.toFixed(2)}%
        </span>
      </span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        GOLD <span className="font-semibold text-white">${prices.gold.val.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>{" "}
        <span className={`${prices.gold.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.gold.chg >= 0 ? "+" : ""}{prices.gold.chg.toFixed(2)}%
        </span>
      </span>
      
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">
        BPI <span className="font-semibold text-white">₱{prices.bpi.val.toFixed(2)}</span>{" "}
        <span className={`${prices.bpi.chg >= 0 ? "text-emerald-400" : "text-rose-400"} font-medium`}>
          {prices.bpi.chg >= 0 ? "+" : ""}{prices.bpi.chg.toFixed(2)}%
        </span>
      </span>
    </div>
  );

  return (
    <header className="w-full bg-[#0a1128] text-white select-none z-50">
      {/* Real-time Ticker Bar */}
      <div className="w-full bg-[#040817] border-b border-slate-800 py-1.5 overflow-hidden select-none">
        <div className="animate-marquee flex whitespace-nowrap text-[10px] font-mono items-center">
          {renderTickerList()}
          {renderTickerList()}
        </div>
      </div>

      {/* Main navigation header logo/controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand logo */}
        <div 
          onClick={() => setView("landing")} 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 group transition-all"
        >
          <div className={`h-9 w-9 ${theme.primaryBg} rounded-full flex items-center justify-center font-bold text-white shadow-md ${theme.shadowPrimary} group-hover:scale-105 transition-transform`}>
            {themeConfig.logoEmoji}
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 uppercase font-sans">
              {themeConfig.siteName}
              <span className={`px-1.5 py-0.5 font-mono text-[9px] font-bold rounded uppercase ${theme.badgeBgText}`}>
                PRO
              </span>
              {isLocalMode && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold rounded border border-amber-500/20 uppercase tracking-widest animate-pulse">
                  Simulated
                </span>
              )}
            </h1>
            <p className="text-[9px] text-slate-400 uppercase font-mono tracking-widest leading-none">
              SEC-BSP REGULATED
            </p>
          </div>
        </div>

        {/* View switching panel - Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-300">
          <button 
            onClick={() => setView("landing")} 
            className={`hover:text-blue-400 transition-colors cursor-pointer ${currentView === "landing" ? "text-blue-500" : ""}`}
          >
            Markets
          </button>
          <a href="#compliance" className="hover:text-blue-400 transition-colors">Compliance</a>
          <a href="#payouts" className="hover:text-blue-400 transition-colors">Settlements</a>
          <a href="#wallets" className="hover:text-blue-400 transition-colors">Supported Wallets</a>
          
          <button 
            onClick={() => {
              if (isLoggedIn) {
                setView("user_dashboard");
              } else {
                setView("login");
              }
            }} 
            className={`hover:text-blue-400 transition-colors py-2 flex items-center gap-1.5 cursor-pointer ${
              ["user_dashboard", "withdraw", "deposit", "profile"].includes(currentView) ? "text-blue-500 font-semibold" : ""
            }`}
          >
            <Activity size={15} />
            My Dashboard
          </button>
        </nav>

        {/* Action Controls: Access dashboards instantly without login flows for perfect preview convenience */}
        <div className="flex items-center gap-2.5">
          {/* Quick toggle list */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  setView("user_dashboard");
                } else {
                  setView("login");
                }
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                ["user_dashboard", "withdraw", "deposit", "profile"].includes(currentView)
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isLoggedIn && profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="h-4 w-4 rounded-full object-cover border border-white/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={13} />
              )}
              {isLoggedIn ? profile.name : "Sign In"}
            </button>
            {isLoggedIn && profile?.role && ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(profile.role) && (
              <button
                onClick={() => {
                  setView("admin_dashboard");
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "admin_dashboard"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck size={13} />
                Admin Portal
              </button>
            )}
          </div>

          {/* Conditional auth button */}
          {isLoggedIn ? (
            <button
              onClick={() => logout()}
              className="md:inline-flex hidden items-center gap-1 bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setView("signup")}
              className={`md:inline-flex hidden bg-gradient-to-r ${theme.primaryGradient} text-white font-medium text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer`}
            >
              Open Account
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
