import React, { useState, useEffect } from "react";
import { useSimulation } from "../context/SimulationContext";
import { PHILIPPINE_BANKS } from "../data/mockData";
import { 
  ArrowLeft, Landmark, ArrowUpRight, ArrowDownLeft, ShieldAlert,
  Sliders, User, Key, Wallet, Phone, Mail, HelpCircle, CheckCircle, 
  Clock, TrendingUp, Award, Calendar, Percent, ShieldCheck, 
  Check, MoreVertical, CreditCard, Activity, Bell, MessageSquare, 
  Upload, ChevronRight, Settings, Info, Lock
} from "lucide-react";
import { ProfitChart } from "./ProfitChart";
import { motion, AnimatePresence } from "motion/react";

export const UserDashboard: React.FC = () => {
  const { 
    profile, 
    transactions, 
    currentView, 
    setView, 
    submitWithdrawal, 
    updateProfile,
    kycFields = [],
    submitKycVerification,
    themeConfig,
    getThemeStyles
  } = useSimulation();

  const theme = getThemeStyles(themeConfig.primaryColor);
  const kycStatus = profile.kycStatus || "None";
  
  const isAdminRole = profile?.role && ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(profile.role);

  if (isAdminRole) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner border border-slate-200">
          <span className="text-4xl text-slate-400">🛡️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Authorized Account</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Administrative accounts are restricted from accessing client trading environments to preserve system integrity. Please coordinate via the central Admin Portal.
          </p>
        </div>
        <button
          onClick={() => setView("admin_dashboard")}
          className={`px-8 py-3.5 rounded-xl font-extrabold uppercase tracking-widest text-xs shadow-md transition-all active:scale-95 text-white bg-slate-900 border border-slate-700 hover:bg-slate-800`}
        >
          ➔ Proceed to Admin Portal
        </button>
      </div>
    );
  }

  // Internal routing states for nested views: "main" | "deposit" | "withdraw" | "profile"
  const [panel, setPanel] = useState<"main" | "deposit" | "withdraw" | "profile">("main");

  // KYC States
  const [kycAnswers, setLocalKycAnswers] = useState<Record<string, string>>({});
  const [kycError, setKycError] = useState("");
  const [selectedKycFile, setSelectedKycFile] = useState<Record<string, string>>({});

  // Withdrawal form states
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [holderName, setHolderName] = useState<string>(profile.name);
  const [accountNo, setAccountNo] = useState<string>(profile.accountNumber);
  const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
  const [withdrawSearch, setWithdrawSearch] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Profile form states
  const [profileName, setProfileName] = useState(profile.name);
  const [profilePhone, setProfilePhone] = useState(profile.phone);
  const [profileBank, setProfileBank] = useState(profile.bankName);
  const [profileAccName, setProfileAccName] = useState(profile.accountName);
  const [profileAccNo, setProfileAccNo] = useState(profile.accountNumber);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEffects);
  const [hapticEnabled, setHapticEnabled] = useState(profile.hapticFeedback);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileImage, setProfileImage] = useState(profile.profileImageUrl || "");
  const [dragOver, setDragOver] = useState(false);

  // Sync state variables with profile context on change
  useEffect(() => {
    setProfileName(profile.name || "");
    setProfilePhone(profile.phone || "");
    setProfileBank(profile.bankName || "");
    setProfileAccName(profile.accountName || "");
    setProfileAccNo(profile.accountNumber || "");
    setSoundEnabled(!!profile.soundEffects);
    setHapticEnabled(!!profile.hapticFeedback);
    setProfileImage(profile.profileImageUrl || "");
  }, [profile]);

  // Detailed selected transaction for modal/drawer view (to view regulatory charges/reasons)
  const [focusedTxId, setFocusedTxId] = useState<string | null>(null);

  // Search filtered banks list on withdraw
  const filteredBanks = PHILIPPINE_BANKS.filter((b) =>
    b.name.toLowerCase().includes(withdrawSearch.toLowerCase())
  );

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");
    setWithdrawSuccess(false);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 100) {
      setWithdrawError("Minimum withdrawal is ₱100.00");
      return;
    }

    if (!selectedBank) {
      setWithdrawError("Please select receiving bank or e-wallet");
      return;
    }

    if (!holderName.trim()) {
      setWithdrawError("Please state recipient account holder name");
      return;
    }

    if (!accountNo.trim()) {
      setWithdrawError("Please input recipient account number");
      return;
    }

    // Submit withdrawal to our Simulation state
    const ok = submitWithdrawal(amt, selectedBank, holderName, accountNo);
    if (ok) {
      setWithdrawSuccess(true);
      setWithdrawAmount("");
      // Redirect back after a tiny delay
      setTimeout(() => {
        setWithdrawSuccess(false);
        setPanel("main");
      }, 2500);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        bankName: profileBank,
        accountName: profileAccName,
        accountNumber: profileAccNo,
        soundEffects: soundEnabled,
        hapticFeedback: hapticEnabled,
        profileImageUrl: profileImage
      });

      setProfileSuccess("Information saved securely.");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err: any) {
      console.error("Save profile error: ", err);
    }
  };

  const generatePresetAvatar = (colorStart: string, colorEnd: string, textColor: string = "#ffffff") => {
    const initials = profileName ? profileName.substring(0, 2).toUpperCase() : "PH";
    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colorStart};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colorEnd};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad)" stroke="#ffffff" stroke-width="2" />
        <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
      </svg>`;
    const base64Svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgText)));
    setProfileImage(base64Svg);
  };

  const generateEmojiAvatar = (emoji: string, bgColor: string) => {
    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="${bgColor}" />
        <text x="50%" y="55%" font-size="45" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      </svg>`;
    const base64Svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgText)));
    setProfileImage(base64Svg);
  };

  // Helper colors for transaction statuses with modern tone pairings
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Processing": return "bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
      case "Declined": return "bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "Verification Required": return "bg-rose-500 text-white shadow-sm border border-rose-600 animate-pulse";
      default: return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  // Get active color configuration for dynamic accents
  const getPrimaryHexColor = (color: string) => {
    switch (color) {
      case "emerald": return "bg-emerald-600 hover:bg-emerald-700 text-white";
      case "rose": return "bg-rose-600 hover:bg-rose-700 text-white";
      case "violet": return "bg-violet-600 hover:bg-violet-700 text-white";
      case "amber": return "bg-amber-600 hover:bg-amber-700 text-white";
      case "slate": return "bg-slate-700 hover:bg-slate-800 text-white";
      default: return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  const getPrimaryTextColor = (color: string) => {
    switch (color) {
      case "emerald": return "text-emerald-600";
      case "rose": return "text-rose-600";
      case "violet": return "text-violet-600";
      case "amber": return "text-amber-600";
      case "slate": return "text-slate-700";
      default: return "text-blue-600";
    }
  };

  const getPrimaryBorderColor = (color: string) => {
    switch (color) {
      case "emerald": return "focus:border-emerald-500 focus:ring-emerald-500/20";
      case "rose": return "focus:border-rose-500 focus:ring-rose-500/20";
      case "violet": return "focus:border-violet-500 focus:ring-violet-500/20";
      case "amber": return "focus:border-amber-500 focus:ring-amber-500/20";
      case "slate": return "focus:border-slate-500 focus:ring-slate-500/20";
      default: return "focus:border-blue-500 focus:ring-blue-500/20";
    }
  };

  const btnHexBgClass = getPrimaryHexColor(themeConfig.primaryColor);
  const textThemeColor = getPrimaryTextColor(themeConfig.primaryColor);

  return (
    <div id="user-dashboard-root" className="min-h-[calc(100vh-76px)] bg-[#f8fafc] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Decorative Floating Ambient Soft Lights for Premium Feel */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-400/8 blur-[130px] rounded-full pointer-events-none" />
      <div className={`absolute bottom-1/4 right-1/4 w-[350px] h-[350px] ${themeConfig.primaryColor === 'rose' ? 'bg-rose-500/6' : 'bg-emerald-500/6'} blur-[110px] rounded-full pointer-events-none`} />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* -------------------- BREADCRUMB / NAV BACK HEADER -------------------- */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {panel !== "main" ? (
              <motion.button 
                key="back"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setPanel("main")} 
                className="group flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
                id="btn-back-to-dashboard"
              >
                <div className="h-7 w-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:border-slate-350 transition-all">
                  <ArrowLeft size={13} className="text-slate-600" />
                </div>
                Back to Workspace
              </motion.button>
            ) : (
              <motion.div 
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${textThemeColor} bg-current animate-pulse`} />
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  Secured Trade Terminal
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Shortcuts Deck when not in main view */}
          {panel !== "main" && (
            <button
              onClick={() => setPanel("main")}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Overview Deck
            </button>
          )}
        </div>

        {/* -------------------- MAIN DASHBOARD VIEW -------------------- */}
        <AnimatePresence mode="wait">
          {panel === "main" && (
            <motion.div
              key="main-deck"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Premium Welcome Card Header */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all">
                <div className="flex items-center gap-4">
                  {profile.profileImageUrl ? (
                    <div className="relative shrink-0">
                      <img
                        src={profile.profileImageUrl}
                        alt={profile.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md bg-white block"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                  ) : (
                    <div className="relative shrink-0">
                      <div className={`h-14 w-14 rounded-full bg-gradient-to-tr ${theme.primaryGradient} text-white flex items-center justify-center font-black text-base border-2 border-white shadow-md`}>
                        {profile.name ? profile.name.substring(0, 2).toUpperCase() : "PH"}
                      </div>
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                      Hello, {profile.name}
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${theme.badgeBgText} tracking-wider`}>
                        VIP
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span>Email: <span className="font-semibold text-slate-600">{profile.email}</span></span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1"><Lock size={10} className="text-slate-400" /> Secure Sandbox Session</span>
                    </p>
                  </div>
                </div>

                {/* Navigation tools inside card list */}
                <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
                  <button
                    onClick={() => setPanel("profile")}
                    className="bg-white border border-slate-200/85 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-97"
                    id="btn-profile-settings"
                  >
                    <Sliders size={13} className="text-slate-500" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => setView("landing")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-97"
                    id="btn-terminal-view"
                  >
                    📊 Trading Desk Terminal
                  </button>
                </div>
              </div>

              {/* 2-COLUMN GRID (Portfolio Deck on Left, Dispatches Ledger on Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT PORTFOLIO CARD AND METRICS (8/12 units on large screens) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Visually Stunning Balance Banner Card */}
                  <div className={`relative overflow-hidden bg-gradient-to-r ${theme.primaryGradient} text-white rounded-3xl p-6 sm:p-8 shadow-xl ${theme.shadowPrimary} transition-all group`}>
                    
                    {/* SVG Abstract Line Accents under Gradient */}
                    <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <path d="M0,150 C150,110 250,190 500,120 L500,200 L0,200 Z" fill="rgba(255,255,255,0.2)"></path>
                        <path d="M0,130 C120,70 300,160 500,90 L500,200 L0,200 Z" fill="rgba(255,255,255,0.1)"></path>
                      </svg>
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest block font-extrabold">
                            Total Settlement Liquidity
                          </span>
                          <p className="text-3xl sm:text-4.5xl font-black tracking-tight leading-none">
                            ₱{profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                          <Wallet size={20} className="text-white" />
                        </div>
                      </div>

                      {/* Action buttons inside premium balance block */}
                      <div className="grid grid-cols-2 gap-3.5 pt-1">
                        <button
                          onClick={() => setPanel("deposit")}
                          className={`bg-white ${theme.btnWhiteText} ${theme.btnWhiteHover} font-extrabold py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white`}
                          id="btn-deposit-trigger"
                        >
                          <ArrowUpRight size={14} className="stroke-[3px]" />
                          Deposit Capital
                        </button>
                        <button
                          onClick={() => setPanel("withdraw")}
                          className="border border-white/20 bg-white/10 hover:bg-white/15 text-white font-extrabold py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          id="btn-withdraw-trigger"
                        >
                          <ArrowDownLeft size={14} className="stroke-[3px]" />
                          Withdraw Capital
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bento Grid Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Active Allocation */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all duration-300 relative overflow-hidden group">
                      <div className="space-y-1.5 relative z-10">
                        <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest block">
                          Active Capital Allocation
                        </span>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">
                          ₱{profile.investmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Earning yields dynamically
                        </span>
                      </div>
                      <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg shrink-0 border border-indigo-100 group-hover:scale-105 transition-transform duration-300">
                        📈
                      </div>
                    </div>

                    {/* Accumulated Profit */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all duration-300 relative overflow-hidden group">
                      <div className="space-y-1.5 relative z-10">
                        <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest block">
                          Audited Profit Returns
                        </span>
                        <p className="text-xl font-bold text-emerald-600 tracking-tight">
                          ₱{profile.profitAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-emerald-500/90 font-medium block">
                          {profile.investmentPlan || "Silver Starter Plan"}
                        </span>
                      </div>
                      <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                        💰
                      </div>
                    </div>

                  </div>

                  {/* Profit Chart display element */}
                  <div id="chart-section" className="transition-all">
                    <ProfitChart />
                  </div>
                </div>

                {/* RIGHT SYSTEM DISPATCH LEDGER (5/12 units on large screens) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Ledger Container Card */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs flex flex-col h-full hover:border-slate-300/90 transition-all duration-300">
                    
                    <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 tracking-wide uppercase">
                          Recent Dispatches
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">Real-time settlement history feed</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
                        LIVE LEDGER
                      </span>
                    </div>

                    {transactions.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3">
                        <span className="text-2xl">⏳</span>
                        <p className="max-w-xs font-semibold leading-relaxed">
                          No transaction records matched. Use "Withdraw Capital" above to generate a settlement request.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[580px] custom-scrollbar">
                        {transactions.map((tx) => (
                          <div 
                            key={tx.id} 
                            onClick={() => setFocusedTxId(focusedTxId === tx.id ? null : tx.id)}
                            className={`p-4 hover:bg-slate-50 transition-all cursor-pointer border-l-3 ${
                              tx.type === 'deposit' ? 'border-l-emerald-500' : 'border-l-blue-500'
                            } ${focusedTxId === tx.id ? "bg-slate-50/70" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex gap-2.5">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm mt-0.5 shrink-0 ${
                                  tx.type === "deposit" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-55 text-blue-600 border border-blue-105"
                                }`}>
                                  {tx.type === "deposit" ? "📥" : "📤"}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">
                                      {tx.type === "withdrawal" ? "Capital Clearance" : "Funds Approval"}
                                    </h4>
                                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider ${getStatusColor(tx.status)}`}>
                                      {tx.status}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] text-slate-400 font-mono block">
                                    {tx.bankName} • {tx.date}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                  ₱{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <span className="text-[8px] text-slate-350 font-mono hidden sm:inline uppercase tracking-wider block">ID: {tx.id.split('-').slice(-1)[0]}</span>
                              </div>
                            </div>

                            {/* Expanded Warning Clearance alert details */}
                            <AnimatePresence>
                              {focusedTxId === tx.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-3 text-xs">
                                    
                                    {/* Alert Box Title */}
                                    <div className="flex items-start gap-2 text-slate-800">
                                      <ShieldAlert className="text-rose-600 flex-shrink-0 mt-0.5" size={15} />
                                      <div>
                                        <h5 className="font-extrabold text-[10.5px] text-slate-805 uppercase tracking-wide">
                                          Audit & Clearance Record
                                        </h5>
                                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                                          Dispatch coordinates registered securely under ID: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{tx.id}</span>
                                        </p>
                                      </div>
                                    </div>

                                    {/* Expanded information fields */}
                                    <div className="border-t border-slate-200/80 pt-2.5 space-y-1.5 text-[10px] text-slate-600">
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Recipient Account Holder:</span>
                                        <span className="font-bold text-slate-800">{tx.accountName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Receiving Bank/E-Wallet:</span>
                                        <span className="font-bold text-slate-800">{tx.bankName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Bank Account Number:</span>
                                        <span className="font-bold text-slate-800 font-mono">{tx.accountNumber}</span>
                                      </div>

                                      {tx.statusReason && (
                                        <div className="mt-2 pt-2 border-t border-slate-150">
                                          <p className="font-extrabold text-slate-700 text-[9.5px] uppercase tracking-wider block mb-1">Status Reason:</p>
                                          <span className="bg-rose-500/10 text-rose-700 font-bold px-2 py-0.5 rounded text-[9.5px]">
                                            {tx.statusReason}
                                          </span>
                                        </div>
                                      )}

                                      {tx.companyNote && (
                                        <div className="mt-2.5 bg-white p-2 text-[10px] text-slate-550 border border-slate-150 rounded-lg">
                                          <span className="font-black text-rose-850 text-[8.5px] uppercase font-mono block mb-0.5">🏦 Internal Dispatch Note:</span>
                                          {tx.companyNote}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* -------------------- DEPOSIT VIEW -------------------- */}
          {panel === "deposit" && (
            <motion.div
              key="deposit-deck"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-7 shadow-xs hover:border-slate-350 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Capital Ledger Deposit</h3>
                <p className="text-slate-400 text-xs font-semibold leading-none uppercase tracking-widest">
                  Secure Wallet Replenishment Protocol
                </p>
              </div>

              <div className="py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center max-w-lg w-full mx-auto space-y-4">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xs border border-emerald-100">
                  📥
                </div>
                <div className="space-y-1.5 text-center">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide">
                    Coordinate Deposit Protocol
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {themeConfig?.depositMessage || "To comply with Anti-Money Laundering and Cyber-security regulations, manual trade capital ledger replenishment and banking settlement routing is guided coordinates by Mateo."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  type="button"
                  onClick={() => setPanel("main")}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Return to Workspace
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('chat_command', { detail: 'open_chat' }))}
                  className={`w-full sm:w-auto ${btnHexBgClass} font-extrabold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex gap-1 items-center justify-center`}
                >
                  ➔ {themeConfig?.depositButtonText || "MATEO LIVE CHAT (TERMINAL)"}
                </button>
              </div>
            </motion.div>
          )}

          {/* -------------------- WITHDRAW CAPITAL VIEW (GATED BY KYC) -------------------- */}
          {panel === "withdraw" && kycStatus !== "Approved" && (
            <motion.div
              key="withdraw-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-300 max-w-2xl mx-auto"
            >
              <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Identity KYC Verification Gate</h3>
                <span className={`text-[9.5px] font-mono font-bold px-2.5 py-1 rounded-full tracking-wider uppercase border ${
                  kycStatus === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  {kycStatus} Review
                </span>
              </div>

              {kycStatus === "Pending" ? (
                <div className="p-6 sm:p-10 text-center space-y-7">
                  <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl border border-amber-200 animate-pulse shrink-0">
                    ⏳
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">KYC Review In Progress</h3>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                      Your identity documents are securely locked in our regulatory appraisal queue. Verification officials will approve your registration parameters shortly (approx. 2–12 hours).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 text-left border border-slate-150 rounded-2xl max-w-md mx-auto space-y-2.5">
                    <span className="font-mono text-[9px] text-slate-400 block font-black uppercase tracking-wider">Submitted parameters</span>
                    {kycFields.map((field) => (
                      <div key={field.id} className="text-xs flex justify-between border-b border-dashed border-slate-200 pb-1.5 last:border-0 last:pb-0 font-medium">
                        <span className="text-slate-450">{field.label}:</span>
                        <span className="font-extrabold text-slate-800">{profile.kycAnswers?.[field.id] || "Completed file upload"}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPanel("main")}
                    className={`w-full max-w-xs mx-auto ${btnHexBgClass} font-extrabold uppercase tracking-widest text-xs py-3.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer`}
                  >
                    ➔ Back to Main Desk
                  </button>
                </div>
              ) : (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-850">
                    <span className="text-xl shrink-0">🔒</span>
                    <div>
                      <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-amber-900">AML and Cash-out Clearance Guard</h4>
                      <p className="mt-1 text-amber-700 font-medium">
                        To fulfill Philippines Securities and exchange requirements and BSP integrity standards, all participant ledger lines must register verified Government Identification prior to capital liquidation clearances.
                      </p>
                    </div>
                  </div>

                  {kycStatus === "Rejected" && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800 space-y-1.5 animate-bounce-soft">
                      <h5 className="font-extrabold uppercase text-[10px] flex items-center gap-1.5">❌ Submission Rejected By Auditor</h5>
                      <p className="text-rose-700 italic bg-white/80 p-3 rounded-lg border border-rose-100 leading-relaxed font-semibold">
                        "{profile.kycRejectReason || "Documents provided were illegible, faded, or expired."}"
                      </p>
                      <p className="text-rose-650 font-medium pt-1">Please provide clear, valid document scans below to re-submit clearance.</p>
                    </div>
                  )}

                  {kycError && (
                    <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">
                      ⚠️ {kycError}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setKycError("");
                      
                      const answers: Record<string, string> = {};
                      for (const f of kycFields) {
                        const val = kycAnswers[f.id]?.trim();
                        if (f.required && !val) {
                          setKycError(`Please complete/upload required field: ${f.label}`);
                          return;
                        }
                        if (val) {
                          answers[f.id] = val;
                        }
                      }

                      submitKycVerification(answers);
                    }}
                    className="space-y-4.5"
                  >
                    {kycFields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 flex justify-between uppercase tracking-wider">
                          <span>{field.label} {field.required && <span className="text-rose-500">*</span>}</span>
                        </label>

                        {field.type === "select" ? (
                          <div className="relative">
                            <select
                              value={kycAnswers[field.id] || ""}
                              onChange={(e) => setLocalKycAnswers({ ...kycAnswers, [field.id]: e.target.value })}
                              className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl outline-none p-3.5 text-slate-800 text-xs font-semibold appearance-none transition-all duration-200 focus:bg-white ${getPrimaryBorderColor(themeConfig.primaryColor)}`}
                            >
                              <option value="">{field.placeholder || "Select Choice..."}</option>
                              {(field.options || []).map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                            <span className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                          </div>
                        ) : field.type === "file_placeholder" ? (
                          <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50/90 transition-all rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center justify-center space-y-2 overflow-hidden min-h-[110px]">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setLocalKycAnswers({ ...kycAnswers, [field.id]: file.name });
                                  setSelectedKycFile({ ...selectedKycFile, [field.id]: URL.createObjectURL(file) });
                                } else {
                                  setLocalKycAnswers({ ...kycAnswers, [field.id]: "id_verification_card.png" });
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {selectedKycFile[field.id] ? (
                              <div className="flex flex-col items-center space-y-1.5 animate-scale">
                                <img src={selectedKycFile[field.id]} alt="Selfie preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm" />
                                <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">✓ {kycAnswers[field.id]}</span>
                              </div>
                            ) : (
                              <>
                                <span className="text-2xl filter drop-shadow-sm">📷</span>
                                <span className="text-xs text-slate-700 font-extrabold">{field.placeholder || "Tap or drag scan file here to attach"}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Supports photographic scans JPEG, PNG</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            placeholder={field.placeholder || "Enter Verification details"}
                            value={kycAnswers[field.id] || ""}
                            onChange={(e) => setLocalKycAnswers({ ...kycAnswers, [field.id]: e.target.value })}
                            className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl outline-none p-3.5 text-xs text-slate-800 font-semibold transition-all duration-200 focus:bg-white ${getPrimaryBorderColor(themeConfig.primaryColor)}`}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      className={`w-full ${btnHexBgClass} font-extrabold uppercase tracking-widest text-xs py-4 rounded-xl shadow-md transition-all text-center cursor-pointer active:scale-98`}
                    >
                      ✓ Submit Regulatory Clearance ➔
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* -------------------- WITHDRAW CAPITAL VIEW -------------------- */}
          {panel === "withdraw" && kycStatus === "Approved" && (
            <motion.div
              key="withdraw-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-300 max-w-2xl mx-auto"
            >
              <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Withdraw Capital Proceed</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Clear settlement proceeds instantly</p>
                </div>
                <span className="text-[9px] font-mono font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  SECURITY VERIFIED
                </span>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-5.5">
                
                {withdrawError && (
                  <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">
                    ⚠️ {withdrawError}
                  </div>
                )}

                {withdrawSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                     ✓ Withdrawal dispatched successfully. Logging into trade archives ledger...
                  </div>
                )}

                {/* Amount field */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 flex justify-between uppercase tracking-wider">
                    <span>Clearance Amount (PHP)</span>
                    <span className="font-mono text-slate-400 tracking-wider">Proceed indicator</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 font-black text-sm">₱</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl outline-none p-4 pl-10 text-slate-900 font-black text-sm transition-all focus:bg-white focus:border-slate-350"
                    />
                  </div>

                  {/* Preset helpers */}
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(amt.toString())}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 p-2.5 rounded-xl text-xs font-bold text-slate-700 transition-all active:scale-95 cursor-pointer"
                      >
                        ₱{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9.5px] text-slate-400 font-medium">Minimum threshold requirement: ₱100.00. Automatic routing dispatch lines.</p>
                </div>

                {/* philippines banks selects */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Target Settlement Destination</label>
                  
                  <button
                    type="button"
                    onClick={() => setIsBankMenuOpen(!isBankMenuOpen)}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-left outline-none text-xs flex justify-between items-center text-slate-800 font-semibold cursor-pointer shadow-xs transition-all"
                  >
                    <span>
                      {selectedBank ? PHILIPPINE_BANKS.find((b) => b.id === selectedBank)?.name : "Select bank or e-wallet account..."}
                    </span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </button>

                  <AnimatePresence>
                    {isBankMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-2xl max-h-60 overflow-y-auto p-3"
                      >
                        <input
                          type="text"
                          placeholder="Search e-wallets or commercial banks..."
                          value={withdrawSearch}
                          onChange={(e) => setWithdrawSearch(e.target.value)}
                          className="w-full bg-slate-55 outline-none text-xs border border-slate-150 p-2.5 rounded-xl mb-2.5 focus:border-slate-350 transition-all"
                        />
                        <div className="space-y-1">
                          {filteredBanks.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setSelectedBank(b.id);
                                setIsBankMenuOpen(false);
                              }}
                              className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <span>{b.name}</span>
                              <span className={`${b.color} text-[8.5px] font-mono px-2 py-0.5 rounded font-black tracking-widest`}>
                                {b.logoText}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Holder Name */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Recipient Account Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Juan Dela Cruz"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl outline-none p-3.5 text-xs text-slate-800 font-semibold focus:bg-white"
                  />
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Recipient Account Number (routing ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. 0917 123 4567"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl outline-none p-3.5 text-xs text-slate-800 font-semibold focus:bg-white"
                  />
                </div>

                {/* Submit withdrawal action */}
                <button
                  type="submit"
                  className={`w-full ${btnHexBgClass} font-extrabold uppercase tracking-widest text-xs py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer active:scale-98`}
                  id="btn-withdraw-submit"
                >
                  Clear & Dispatch Funds ➔
                </button>

                {/* explanatory information parameters */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-[10.5px] text-slate-500 leading-relaxed font-medium">
                  <span className="font-extrabold text-slate-700 block uppercase font-mono tracking-widest text-[9.5px]">🏦 Routing Settlement Framework:</span>
                  <ol className="list-decimal pl-4.5 space-y-1.5 font-sans">
                    <li>Withdrawal proceeds are immediately deducted from the wallet indicator lines.</li>
                    <li>Accounts ledger coordinates are passed with end-to-end security audits.</li>
                    <li>Funds dispatches will be settled in commercial logs within selected windows.</li>
                    <li>Clearance updates are available on the dispatches timeline panel instantly.</li>
                  </ol>
                </div>

              </form>
            </motion.div>
          )}

          {/* -------------------- PROFILE SETTINGS VIEW -------------------- */}
          {panel === "profile" && (
            <motion.div
              key="profile-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-slate-350 transition-all duration-300"
            >
              <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Participant Profile</h3>
                  <p className="text-[10px] text-slate-400 font-medium font-mono uppercase">VIP Settings Module</p>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                  PORTAL SECURED
                </span>
              </div>

              <form onSubmit={handleProfileSave} className="p-6 space-y-6.5">
                
                {profileSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
                    ✓ {profileSuccess}
                  </div>
                )}

                {/* Profile Picture Uploader area */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Profile Avatar Controls</h4>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* AVATAR BOX DISPLAY */}
                    <div className="relative shrink-0 transition-transform hover:scale-105 duration-300 group">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile Preview"
                          className="h-24 w-24 rounded-full object-cover border-4 border-slate-100 shadow-md bg-white block"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`h-24 w-24 rounded-full bg-gradient-to-tr ${theme.primaryGradient} text-white flex items-center justify-center font-black text-2xl border-4 border-slate-100 shadow-md`}>
                          {profileName ? profileName.substring(0, 2).toUpperCase() : "PH"}
                        </div>
                      )}
                      
                      {profileImage && (
                        <button
                          type="button"
                          onClick={() => setProfileImage("")}
                          className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md text-sm font-black leading-none w-6.5 h-6.5 flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove Image"
                        >
                          &times;
                        </button>
                      )}
                    </div>

                    {/* UPLOADER CHIPS AND DRAG BOX */}
                    <div className="flex-1 w-full space-y-4.5">
                      
                      {/* Drag & Drop zone */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("Please select an image under 2MB to keep syncing efficient.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setProfileImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition-colors duration-300 ${
                          dragOver ? "border-indigo-600 bg-indigo-50/55" : "border-slate-200 hover:border-slate-350 bg-slate-50/50"
                        }`}
                        onClick={() => document.getElementById("avatar-trigger")?.click()}
                      >
                        <input
                          type="file"
                          id="avatar-trigger"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Please select an image under 2MB to keep syncing efficient.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  setProfileImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-xs font-extrabold text-slate-800 block">Drag profile picture files here, or tap to browse</span>
                        <span className="text-[10px] text-slate-405 block mt-1">Supports common web images scale up to 2MB</span>
                      </div>

                      {/* Brand Solid Colors */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono block">
                          🌟 QUICK LUXURY BRAND SOLID COLORS:
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#059669", "#059669")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-emerald-600 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Emerald
                          </button>
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#2563eb", "#2563eb")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-blue-600 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Sapphire
                          </button>
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#d97706", "#d97706")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-amber-600 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Golden
                          </button>
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#7c3aed", "#7c3aed")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-violet-600 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Velvet
                          </button>
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#e11d48", "#e11d48")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-rose-600 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Crimson
                          </button>
                          <button
                            type="button"
                            onClick={() => generatePresetAvatar("#334155", "#334155")}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-slate-700 shadow-xs hover:brightness-105 cursor-pointer"
                          >
                            Obsidian
                          </button>
                        </div>
                      </div>

                      {/* Micro Badge generator */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono block">
                          🎨 CHOOSE EMOJI BADGE AVATAR PRESET:
                        </span>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {[
                            { emoji: "📈", label: "Profit", bg: "#eff6ff" },
                            { emoji: "💼", label: "Union", bg: "#f0fdf4" },
                            { emoji: "💰", label: "Wealth", bg: "#fffbeb" },
                            { emoji: "👑", label: "Crown", bg: "#faf5ff" },
                            { emoji: "🦁", label: "Lion", bg: "#fff7ed" },
                            { emoji: "🦅", label: "Eagle", bg: "#f8fafc" },
                          ].map((b) => (
                            <button
                              key={b.emoji}
                              type="button"
                              onClick={() => generateEmojiAvatar(b.emoji, b.bg)}
                              className="h-8.5 w-8.5 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-base hover:bg-slate-55 transition-colors shadow-xs hover:scale-105 cursor-pointer"
                              title={b.label}
                            >
                              {b.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Personal Settings */}
                <div className="space-y-4 pt-2.5">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Participant Credentials</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block">Participant ID Coordinates</label>
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full bg-slate-100 cursor-not-allowed border border-slate-200/60 rounded-xl p-3.5 text-xs text-slate-400 font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block">Verified Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-semibold focus:bg-white focus:ring-1 focus:ring-offset-0 ${getPrimaryBorderColor(themeConfig.primaryColor)} outline-none transition-all`}
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block font-sans">Contact phone number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-semibold focus:bg-white focus:ring-1 focus:ring-offset-0 ${getPrimaryBorderColor(themeConfig.primaryColor)} outline-none transition-all`}
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Settlements */}
                <div className="space-y-4 pt-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Default Banking Settlement Coordinates</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block">Commercial Bank Name</label>
                      <input
                        type="text"
                        value={profileBank}
                        onChange={(e) => setProfileBank(e.target.value)}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-semibold focus:bg-white ${getPrimaryBorderColor(themeConfig.primaryColor)} outline-none transition-all`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block">Default Account Owner Name</label>
                        <input
                          type="text"
                          value={profileAccName}
                          onChange={(e) => setProfileAccName(e.target.value)}
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-semibold focus:bg-white ${getPrimaryBorderColor(themeConfig.primaryColor)} outline-none transition-all`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-450 uppercase font-extrabold text-[10px] tracking-wider block">Account Number / Gcash Wallet phone</label>
                        <input
                          type="text"
                          value={profileAccNo}
                          onChange={(e) => setProfileAccNo(e.target.value)}
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-semibold focus:bg-white ${getPrimaryBorderColor(themeConfig.primaryColor)} outline-none transition-all`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggle indicators */}
                <div className="space-y-4 pt-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Interactive Preferences</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">Ledger Sound Effects</span>
                        <span className="text-[10px] text-slate-400 font-medium">Bleep confirmations instantly</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className={`h-5.5 w-5.5 border-slate-200 rounded text-${themeConfig.primaryColor}-600 focus:ring-${themeConfig.primaryColor}-500 cursor-pointer`}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">Instant Haptic Feedback</span>
                        <span className="text-[10px] text-slate-400 font-medium">Vibration trigger on approvals</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={hapticEnabled}
                        onChange={(e) => setHapticEnabled(e.target.checked)}
                        className={`h-5.5 w-5.5 border-slate-200 rounded text-${themeConfig.primaryColor}-600 focus:ring-${themeConfig.primaryColor}-500 cursor-pointer`}
                      />
                    </div>

                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPanel("main")}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`w-2/3 ${btnHexBgClass} font-extrabold uppercase tracking-widest text-xs py-4 rounded-xl shadow-md transition-all text-center cursor-pointer active:scale-98`}
                  >
                    Save Changes secure ➔
                  </button>
                </div>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
