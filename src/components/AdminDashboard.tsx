import React, { useState } from "react";
import { useSimulation } from "../context/SimulationContext";
import { Transaction, TransactionStatus, InvestmentPlan, SupportTicket, UserProfile, KycFormField } from "../types";
import { 
  ShieldCheck, ShieldAlert, Edit2, CheckCircle2, XCircle, AlertCircle, 
  Search, RefreshCw, Landmark, HelpCircle, Save, Plus, Trash2, Calendar, 
  Percent, DollarSign, FileText, Settings, Home, Users, ArrowUpRight, ArrowDownLeft, 
  UserSquare2, MessageSquare, Key, Fingerprint, Eye, Send, Sliders, Check, CircleAlert, MonitorSmartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const AdminDashboard: React.FC = () => {
  const { 
    transactions, 
    updateTransaction, 
    setView,
    investmentPlans,
    addInvestmentPlan,
    updateInvestmentPlan,
    deleteInvestmentPlan,
    users = [],
    kycFields = [],
    themeConfig,
    updateThemeConfig,
    updateUserKycStatus,
    updateKycFields,
    creditDebitUser,
    tickets = [],
    addTicketReply,
    updateTicketStatus,
    deleteTicket,
    updateUserRole,
    getThemeStyles
  } = useSimulation();

  const theme = getThemeStyles();

  // Tab state matching user requirements:
  // Overview, Manage Users, Manage Deposit, Manage Withdrawal, Kyc, Tickets, Manage Role, Site Settings
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "deposits" | "withdrawals" | "kyc" | "tickets" | "roles" | "settings"
  >("overview");

  // Filter Search strings
  const [userSearch, setUserSearch] = useState("");
  const [txSearch, setTxSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");

  // Transaction Editing State
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<TransactionStatus>("Pending");
  const [statusReason, setStatusReason] = useState("");
  const [companyNote, setCompanyNote] = useState("");
  const [alertSuccess, setAlertSuccess] = useState("");

  // User Adjustment Drawer/Modal State
  const [adjustingUser, setAdjustingUser] = useState<UserProfile | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>("");
  const [adjustCategory, setAdjustCategory] = useState<"balance" | "investmentAmount" | "profitAmount">("balance");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [adjustMemo, setAdjustMemo] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState("");

  // Simulated Deposit manual state
  const [showSimulateDeposit, setShowSimulateDeposit] = useState(false);
  const [simDepEmail, setSimDepEmail] = useState("");
  const [simDepAmount, setSimDepAmount] = useState("");
  const [simDepBank, setSimDepBank] = useState("UnionBank of the Philippines");
  const [simDepAcctName, setSimDepAcctName] = useState("");
  const [simDepAcctNo, setSimDepAcctNo] = useState("");
  const [simDepSuccess, setSimDepSuccess] = useState("");

  // Support Tickets interactive selection
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState<"ALL" | "Open" | "In Progress" | "Resolved" | "Closed">("ALL");

  // Role Access Management state
  const [editingRoleUser, setEditingRoleUser] = useState<UserProfile | null>(null);
  const [newRoleVal, setNewRoleVal] = useState<UserProfile["role"]>("User");
  const [roleSuccess, setRoleSuccess] = useState("");

  // Site Settings Extended state
  const [brandName, setBrandName] = useState(themeConfig?.siteName || "PH TRADE UNION");
  const [brandEmoji, setBrandEmoji] = useState(themeConfig?.logoEmoji || "📈");
  const [brandColor, setBrandColor] = useState(themeConfig?.primaryColor || "blue");
  const [brandFont, setBrandFont] = useState(themeConfig?.fontFamily || "Inter");
  const [siteMaintenance, setSiteMaintenance] = useState(false);
  const [baseInterestRate, setBaseInterestRate] = useState("10");
  const [minDepositLimit, setMinDepositLimit] = useState("1000");
  const [brandSuccess, setBrandSuccess] = useState("");

  // KYC field config state
  const [isAddingKycField, setIsAddingKycField] = useState(false);
  const [kycfLabel, setKycfLabel] = useState("");
  const [kycfType, setKycfType] = useState<"text" | "number" | "select" | "file_placeholder">("text");
  const [kycfPlaceholder, setKycfPlaceholder] = useState("");
  const [kycfRequired, setKycfRequired] = useState(true);
  const [kycfOptions, setKycfOptions] = useState("");
  const [kycRejectingUser, setKycRejectingUser] = useState<UserProfile | null>(null);
  const [kycRejectNote, setKycRejectNote] = useState("");

  // Helper selectors
  const handleUpdateTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTxId) return;
    updateTransaction(editingTxId, newStatus, statusReason, companyNote);
    setAlertSuccess("Transaction clearance level updated!");
    setTimeout(() => {
      setAlertSuccess("");
      setEditingTxId(null);
    }, 1500);
  };

  const handleManualAddDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email.trim().toLowerCase() === simDepEmail.trim().toLowerCase());
    if (!foundUser) {
      alert("No registered user found with this coordinate email address.");
      return;
    }
    const amt = parseFloat(simDepAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Specify a valid positive numerical amount.");
      return;
    }

    // Direct simulation credit as deposit
    creditDebitUser(foundUser.email, "credit", "balance", amt, `Simulated Bank Transfer: ${simDepBank}`);
    setSimDepSuccess(`Successfully logged and credited manual deposit of ₱${amt.toLocaleString()} to ${foundUser.name}!`);
    setTimeout(() => {
      setSimDepSuccess("");
      setShowSimulateDeposit(false);
      setSimDepEmail("");
      setSimDepAmount("");
    }, 2000);
  };

  // Status mapping colors UI elements
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Processing": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Declined": return "bg-rose-50 text-rose-700 border border-rose-200";
      case "Verification Required": return "bg-rose-600 text-white border border-rose-700 font-bold animate-pulse";
      default: return "bg-slate-55 text-slate-700";
    }
  };

  // Sidebar navigation elements definitions
  const navItems = [
    { id: "overview", label: "Overview panel", icon: Home, count: null },
    { id: "users", label: "Manage Clients", icon: Users, count: users.length },
    { id: "deposits", label: "Manage Deposits", icon: ArrowDownLeft, count: transactions.filter(t => t.type === "deposit" && t.status === "Pending").length || null },
    { id: "withdrawals", label: "Manage Withdrawals", icon: ArrowUpRight, count: transactions.filter(t => t.type === "withdrawal" && t.status === "Pending").length || null },
    { id: "kyc", label: "Compliance & KYC", icon: ShieldCheck, count: users.filter(u => u.kycStatus === "Pending").length || null },
    { id: "tickets", label: "Support Tickets Desk", icon: MessageSquare, count: tickets.filter(t => t.status === "Open" || t.status === "In Progress").length || null },
    { id: "roles", label: "Manage Admin Roles", icon: Key, count: users.filter(u => u.role && u.role !== "User").length || null },
    { id: "settings", label: "Site & Branding Config", icon: Settings, count: null },
  ] as const;

  // Calculable admin statistics
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  const totalActiveInvestment = users.reduce((sum, u) => sum + (u.investmentAmount || 0), 0);
  const totalProfitPool = users.reduce((sum, u) => sum + (u.profitAmount || 0), 0);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f8fafc] text-indigo-950 flex flex-col lg:flex-row relative">
      
      {/* LEFT NAVIGATION SIDEBAR (Desktop) / TOP SCROLL BAR (Mobile) */}
      <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col flex-shrink-0 z-10 font-sans">
        
        {/* Desk operator section header */}
        <div className="p-5 border-b border-rose-100/60 flex items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold text-sm ${theme.shadowPrimary}`}>
              ⚡
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">Clearance Desk</p>
              <h3 className="text-xs font-black text-slate-800 uppercase">SYS_OPERATOR (1)</h3>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
        </div>

        {/* Navigation lists */}
        <div className="lg:flex-1 p-3 space-y-1 lg:max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-none hidden lg:block">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left py-3 px-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wide flex items-center justify-between transition-all group cursor-pointer ${
                  isActive 
                    ? `${theme.primaryBg} text-white shadow-lg ${theme.shadowPrimary}`
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-500/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={`transition-all ${isActive ? "scale-110" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{item.id === "settings" ? themeConfig.siteName + " Settings" : item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 font-bold"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Horizontal scrollbar buttons specifically optimized for touch or small mobile frames */}
        <div className="lg:hidden flex overflow-x-auto p-2 gap-1.5 bg-white whitespace-nowrap scrollbar-none border-b border-slate-150">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-2 px-3.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? `${theme.primaryBg} text-white shadow-sm`
                    : "bg-slate-50 border border-slate-200 text-slate-600"
                }`}
              >
                <item.icon size={14} />
                <span>{item.id === "settings" ? "Site Settings" : item.label.split(" ")[0]}</span>
                {item.count !== null && (
                  <span className={`px-1.5 py-0.1 ml-1 rounded text-[9px] ${isActive ? "bg-white/35 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick swap button to return to terminal client dashboard */}
        <div className="p-4 border-t border-slate-100 hidden lg:block bg-slate-50/50">
          <button
            onClick={() => setView("user_dashboard")}
            className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-sans font-extrabold uppercase tracking-wide text-[10px] py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <MonitorSmartphone size={13} />
            Visit Client Terminal
          </button>
        </div>

      </div>

      {/* CORE CONTENT DOCKS */}
      <div className="flex-1 p-4 sm:p-7 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">

        {/* Global Success messages */}
        {adjustSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 rounded-lg text-xs font-semibold animate-bounce shadow">
            ✓ Logged Adjustment: {adjustSuccess}
          </div>
        )}
        {brandSuccess && (
          <div className="p-3 bg-indigo-50 text-indigo-800 border-l-4 border-indigo-500 rounded-lg text-xs font-semibold animate-pulse shadow">
            ⚙ {brandSuccess}
          </div>
        )}

        {/* -------------------- VIEW 1: OVERVIEW METRIC DECORATIONS -------------------- */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${theme.primaryText} flex items-center gap-1.5`}>
                  <span className={`h-2 h-2 w-2 rounded-full ${theme.primaryBg} animate-pulse`} />
                  Institutional Alpha Analytics Terminal
                </span>
                <h1 className="text-2xl font-black text-slate-900 uppercase">System Overview</h1>
                <p className="text-xs text-slate-400">Consolidated analytics reports, capital flows, and queued dispatch operations.</p>
              </div>

              {/* Action shortcuts */}
              <div className="flex gap-2.5">
                <button 
                  onClick={() => {
                    setView("user_dashboard");
                  }} 
                  className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wide py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                >
                  📥 Switch to Client Portal
                </button>
                <button 
                  onClick={() => {
                    setActiveTab("settings");
                  }} 
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wide py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sliders size={13} /> Setting presets
                </button>
              </div>
            </div>

            {/* Core statistics Bento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow">
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 rounded-bl-full flex items-center justify-center opacity-40 transition-transform group-hover:scale-110">
                  <Landmark className="text-blue-500 mr-2 mb-2" size={18} />
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Total Dispatched Volume</span>
                <p className="text-xl font-black text-slate-900 mt-1.5">₱{totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">From {transactions.length} ledger operations</span>
              </div>

              <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow">
                <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-50 rounded-bl-full flex items-center justify-center opacity-40">
                  <DollarSign className="text-emerald-500 mr-2 mb-2" size={18} />
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Total Clients Balance</span>
                <p className="text-xl font-black text-slate-900 mt-1.5">₱{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <span className="text-[10px] font-mono text-emerald-600 block mt-1 font-semibold">Active Capital Reserves</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:shadow">
                <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-50 rounded-bl-full flex items-center justify-center opacity-40">
                  <Percent className="text-indigo-500 mr-2 mb-2" size={18} />
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Trading Desk Pool</span>
                <p className="text-xl font-black text-slate-900 mt-1.5">₱{totalActiveInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">Generating Accrued Profits</span>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-16 w-16 bg-slate-800 rounded-bl-full flex items-center justify-center opacity-50">
                  <ShieldCheck className="text-rose-400 mr-2 mb-2" size={18} />
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Compliance Status</span>
                <p className="text-lg font-black text-rose-400 mt-1.5">SEC Verified Core</p>
                <span className="text-[10px] font-mono text-slate-300 block mt-1">BSP anti-corruption logic active</span>
              </div>

            </div>

            {/* Aesthetic interactive line chart using styled SVG for robust zero-dependency rendering */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Liquidity Trend & Outflows (7 Days)</h3>
                  <p className="text-[11px] text-slate-400">Weekly institutional wire analysis and clearing performance.</p>
                </div>
                <div className="flex gap-4 font-sans text-[10px] font-extrabold uppercase">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Wires Approved
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Pending clearance
                  </span>
                </div>
              </div>

              {/* Responsive SVG Layout graph */}
              <div className="h-64 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-2 relative flex flex-col justify-between">
                
                {/* Visual grid markings */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-45">
                  <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-slate-400 text-right">₱500k</div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-slate-400 text-right">₱250k</div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-slate-400 text-right">₱100k</div>
                  <div className="border-b border-dashed border-slate-200 w-full text-[9px] font-mono text-slate-400 text-right">₱0.00</div>
                </div>

                {/* SVG Curve lines */}
                <svg className="h-full w-full relative z-10" viewBox="0 0 100 30" preserveAspectRatio="none">
                  {/* Fill Area gradient */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Approved Curve */}
                  <path 
                    d="M 0 25 Q 15 12 30 18 T 60 8 T 80 5 T 100 12" 
                    fill="url(#chartGrad)" 
                    strokeWidth="1.2" 
                    stroke="#2563eb" 
                  />
                  {/* Pending Curve */}
                  <path 
                    d="M 0 28 Q 15 22 30 25 T 60 19 T 80 22 T 100 15" 
                    fill="none" 
                    strokeWidth="1" 
                    stroke="#d97706" 
                    strokeDasharray="1,1" 
                  />
                  
                  {/* Aesthetic dots points */}
                  <circle cx="30" cy="18" r="1.5" fill="#2563eb" />
                  <circle cx="60" cy="8" r="1.5" fill="#2563eb" />
                  <circle cx="80" cy="5" r="1.5" fill="#2563eb" />
                </svg>

                {/* X-Axis scale */}
                <div className="flex justify-between text-[9px] font-mono text-slate-400 px-2 mt-1">
                  <span>Mon (May 17)</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun (Today)</span>
                </div>

              </div>
            </div>

            {/* Quick action simulation grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dynamic live simulation controller box */}
              <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono">
                    <CircleAlert size={11} /> Simulator shortcut
                  </div>
                  <h3 className="font-extrabold text-[#1e3a8a] text-sm uppercase tracking-wide">Live Settlement Alert Test</h3>
                  <p className="text-xs text-[#1e40af] leading-relaxed">
                    Set a target transaction status to <span className="font-bold">"Verification Required"</span> with reason <span className="font-mono bg-blue-150 rounded px-1">"MANAGEMENT CHARGES REQUIRED"</span>. Then visit the customer console to see the real-time blocking fee prompt!
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setActiveTab("withdrawals")} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-[10px] uppercase px-4 py-2.5 rounded-lg ml-auto transition-all cursor-pointer"
                  >
                    Configure Settlements ➔
                  </button>
                </div>
              </div>

              {/* KYC quick settings manager box */}
              <div className="bg-[#fdf2f8] border border-pink-100 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono">
                    🛡️ Compliance Manager
                  </div>
                  <h3 className="font-extrabold text-[#831843] text-sm uppercase tracking-wide">Manage Custom KYC Inputs</h3>
                  <p className="text-xs text-[#9d174d] leading-relaxed">
                    Add required compliance fields like <span className="font-bold">"SSS Photo"</span> or <span className="font-bold">"Tax Tin"</span> dynamic fields, immediately forcing registration to demand verification files before client approval!
                  </p>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => setActiveTab("kyc")} 
                    className="bg-pink-600 hover:bg-pink-700 text-white font-sans font-bold text-[10px] uppercase px-4 py-2.5 rounded-lg ml-auto transition-all cursor-pointer"
                  >
                    Open KYC Fields Builder ➔
                  </button>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 2: MANAGE USERS -------------------- */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  👥 Client Portfolios Manager
                </h1>
                <p className="text-xs text-slate-400">Direct modification controls for balances, investment states, and account credentials.</p>
              </div>

              {/* Account details search filter */}
              <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clients, email, role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl outline-none py-2 px-3 pl-9 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* List of Registered Accounts Grid/Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-400 font-mono tracking-wider text-[10px] uppercase border-b border-slate-100">
                    <tr>
                      <th className="p-4">Trader Name & Contacts</th>
                      <th className="p-4">Operational Role</th>
                      <th className="p-4">Balance</th>
                      <th className="p-4">Active Pool</th>
                      <th className="p-4">Accrued Profits</th>
                      <th className="p-4">KYC Clearance</th>
                      <th className="p-4 text-center">Desk Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {users.filter(u => {
                      const str = `${u.name} ${u.email} ${u.role || ""}`.toLowerCase();
                      return str.includes(userSearch.toLowerCase());
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-slate-400 font-bold whitespace-nowrap">
                          No registered traders found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      users.filter(u => {
                        const str = `${u.name} ${u.email} ${u.role || ""}`.toLowerCase();
                        return str.includes(userSearch.toLowerCase());
                      }).map((u) => (
                        <tr key={u.email} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4">
                            <p className="font-extrabold text-slate-900 text-[13px]">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.email} • {u.phone}</p>
                          </td>
                          <td className="p-4 font-bold font-sans">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] border border-blue-100 uppercase font-mono tracking-wider">
                              {u.role || "User"}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-905">
                            ₱{(u.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            ₱{(u.investmentAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-semibold text-emerald-600">
                            ₱{(u.profitAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">
                            <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                              u.kycStatus === "Approved" ? "bg-emerald-100 text-emerald-800" :
                              u.kycStatus === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                            }`}>
                              {u.kycStatus || "None"}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setAdjustingUser(u);
                                  setAdjustAmount("");
                                  setAdjustMemo("");
                                }}
                                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-550 text-white font-sans text-[10px] font-bold rounded uppercase cursor-pointer"
                              >
                                Modify Balance
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRoleUser(u);
                                  setNewRoleVal(u.role || "User");
                                }}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-[10px] font-bold rounded uppercase cursor-pointer"
                              >
                                Change Role
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BALANCE ADJUSTMENT ACTION BAR DRAWER (RENDERED CONDITIONALLY) */}
            <AnimatePresence>
              {adjustingUser && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  className="bg-white border border-slate-205 rounded-2xl p-6 shadow-xl max-w-xl mx-auto"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                      💰 Adjust Client Ledger Portfolio
                    </h3>
                    <button 
                      onClick={() => setAdjustingUser(null)} 
                      className="text-slate-405 hover:text-slate-700 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Executing corrections will automatically credit or debit the respective parameters inside <span className="font-semibold">{adjustingUser.name}'s</span> trade balance. An audit entry is registered inside transactions.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const amt = parseFloat(adjustAmount);
                      if (isNaN(amt) || amt <= 0) {
                        alert("Please specify a valid numeric size.");
                        return;
                      }
                      creditDebitUser(adjustingUser.email, adjustType, adjustCategory, amt, adjustMemo);
                      setAdjustSuccess(`Ledger updated for ${adjustingUser.name}!`);
                      setAdjustingUser(null);
                      setTimeout(() => setAdjustSuccess(""), 1500);
                    }}
                    className="space-y-4 text-xs font-sans"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-extrabold text-slate-700">Modification Strategy</label>
                        <select
                          value={adjustType}
                          onChange={(e) => setAdjustType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none"
                        >
                          <option value="credit">Credit (+) Allocate Inflows</option>
                          <option value="debit">Debit (-) Log Outflow Charge</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="font-extrabold text-slate-700">Account Target Sector</label>
                        <select
                          value={adjustCategory}
                          onChange={(e) => setAdjustCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none"
                        >
                          <option value="balance">Main balance account (₱)</option>
                          <option value="investmentAmount">Active Trade Pool (₱)</option>
                          <option value="profitAmount">Accrued profits (₱)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-700">Amount to Alter (PHP ₱)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5000"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        className="w-full bg-slate-55 border border-slate-200 rounded-lg p-3 text-slate-900 font-extrabold outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-700">Custom note memo (Audit logs / Reason)</label>
                      <input
                        type="text"
                        placeholder="e.g. Profit settlement correction or BSP manual wires integration"
                        value={adjustMemo}
                        onChange={(e) => setAdjustMemo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 outline-none"
                      />
                    </div>

                    <div className="flex gap-2.5 justify-end pt-3">
                      <button 
                        type="button" 
                        onClick={() => setAdjustingUser(null)} 
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-extrabold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className={`px-6 py-2 ${theme.primaryBg} text-white font-extrabold rounded-lg shadow-md hover:brightness-105`}
                      >
                        Execute ledger update
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* -------------------- VIEW 3: MANAGE DEPOSIT -------------------- */}
        {activeTab === "deposits" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-sans">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🏦 Client Deposits Ledger
                </h1>
                <p className="text-xs text-slate-400 font-sans">Approve digital wire transfers, GCash payments, and simulated bank operations.</p>
              </div>

              {/* Action shortcut trigger simulated deposit */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSimulateDeposit(!showSimulateDeposit)}
                  className="bg-emerald-650 hover:bg-emerald-700 bg-emerald-600 text-white font-bold uppercase tracking-wide text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
                >
                  <Plus size={14} /> Log Manual Deposit Wire
                </button>
              </div>
            </div>

            {/* Simulated Deposit Panel */}
            <AnimatePresence>
              {showSimulateDeposit && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md overflow-hidden"
                >
                  <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800 mb-3 block border-b pb-2">
                    ✍ Simulator: Create Manual Deposit for Account
                  </h3>
                  {simDepSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 font-semibold mb-3 rounded-lg text-xs">
                      {simDepSuccess}
                    </div>
                  )}
                  <form onSubmit={handleManualAddDeposit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Client Email Coordinates</label>
                      <select
                        required
                        value={simDepEmail}
                        onChange={(e) => {
                          const picked = e.target.value;
                          setSimDepEmail(picked);
                          const userObj = users.find(u => u.email === picked);
                          if (userObj) setSimDepAcctName(userObj.name);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg"
                      >
                        <option value="">-- Choose Trader Account --</option>
                        {users.map(u => (
                          <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Deposit Amount (₱)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10000"
                        value={simDepAmount}
                        onChange={(e) => setSimDepAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Bank Gateway</label>
                      <select
                        value={simDepBank}
                        onChange={(e) => setSimDepBank(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg"
                      >
                        <option value="UnionBank of the Philippines">UnionBank of the Philippines</option>
                        <option value="BDO Unibank">BDO Unibank</option>
                        <option value="Bank of the Philippine Islands (BPI)">BPI Bank</option>
                        <option value="GCash Gateway">GCash QR Account</option>
                        <option value="PayMaya Corporate">Maya QR Wallet</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase p-2.5 rounded-lg shadow cursor-pointer text-xs"
                      >
                        🚀 Credit & Log Transfer
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List Table of Deposit Type transactions */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500 block">Digital Wire Inflow Audit Log ({transactions.filter(t => t.type === "deposit").length})</span>
                <div className="relative max-w-xs w-2/3 md:w-1/3">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search deposits..."
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-1.5 pl-7 text-[11px]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f8fafc] text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-4">Reference Key</th>
                      <th className="p-4">Investor Account</th>
                      <th className="p-4">Recipient Bank Pathway</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Amount Recieved</th>
                      <th className="p-4">Clearing status</th>
                      <th className="p-4 text-center">Desk action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {transactions
                      .filter(t => t.type === "deposit")
                      .filter(t => t.userName.toLowerCase().includes(txSearch.toLowerCase()) || t.id.toLowerCase().includes(txSearch.toLowerCase()))
                      .length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-slate-400 font-bold font-sans">
                            No deposit wire transfers found matching your query.
                          </td>
                        </tr>
                      ) : (
                        transactions
                          .filter(t => t.type === "deposit")
                          .filter(t => t.userName.toLowerCase().includes(txSearch.toLowerCase()) || t.id.toLowerCase().includes(txSearch.toLowerCase()))
                          .map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-mono font-bold text-[#1e293b]">{t.id}</td>
                              <td className="p-4">
                                <p className="font-extrabold text-slate-900">{t.userName}</p>
                                <p className="text-[10px] text-slate-405 font-mono">{t.userEmail}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-slate-800">{t.bankName}</p>
                                <span className="text-[10px] text-slate-400">Manual / QR Transfer</span>
                              </td>
                              <td className="p-4 text-slate-500 font-mono text-[10.5px]">{t.date}</td>
                              <td className="p-4 font-black text-slate-900">₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="p-4">
                                <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold font-mono ${getStatusBadge(t.status)}`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    setEditingTxId(t.id);
                                    setNewStatus(t.status);
                                    setStatusReason(t.statusReason || "");
                                    setCompanyNote(t.companyNote || "");
                                  }}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-white hover:brightness-105 active:scale-95 transition-all rounded font-mono text-[10px] font-bold cursor-pointer"
                                >
                                  Update Clearance Status
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                  </tbody>
                </table>
              </div>

            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 4: MANAGE WITHDRAWAL -------------------- */}
        {activeTab === "withdrawals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-sans">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🏧 Client Withdrawals Ledger
                </h1>
                <p className="text-xs text-slate-400 font-sans">Authorize payouts, verify bank numbers, check compliance verification level, and manage withdrawal delays.</p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl outline-none py-2 px-3 pl-9 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Withdrawals block guide card */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex gap-3.5 items-start">
              <CircleAlert className="text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" size={17} />
              <div className="space-y-1">
                <h4 className="font-extrabold text-[#78350f] text-xs uppercase">Compliance Security Control Panel:</h4>
                <p className="text-xs text-[#92400e] leading-relaxed">
                  Traders with pending transactions can be set to <span className="font-extrabold text-red-700">"Verification Required"</span> to lock their assets and prompt anti-money laundering steps or transfer fee collection prompts inside their dashboard in real-time.
                </p>
              </div>
            </div>

            {/* List Table of Withdrawal Type transactions */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500 block">Outflow Settlement Requests ({transactions.filter(t => t.type === "withdrawal").length})</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f8fafc] text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-4">Inquiry Code</th>
                      <th className="p-4">Client Portfolio</th>
                      <th className="p-4">Target Bank Details</th>
                      <th className="p-4">Date Submited</th>
                      <th className="p-4">Amount Requested</th>
                      <th className="p-4">Sec. Status</th>
                      <th className="p-4 text-center font-mono">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions
                      .filter(t => t.type === "withdrawal")
                      .filter(t => t.userName.toLowerCase().includes(txSearch.toLowerCase()) || t.id.toLowerCase().includes(txSearch.toLowerCase()))
                      .length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-10 text-center text-slate-400 font-bold font-sans">
                            No active withdrawal payout requests found.
                          </td>
                        </tr>
                      ) : (
                        transactions
                          .filter(t => t.type === "withdrawal")
                          .filter(t => t.userName.toLowerCase().includes(txSearch.toLowerCase()) || t.id.toLowerCase().includes(txSearch.toLowerCase()))
                          .map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-mono font-bold text-[#1e293b]">{t.id}</td>
                              <td className="p-4">
                                <p className="font-extrabold text-slate-900">{t.userName}</p>
                                <p className="text-[10px] text-slate-405 font-mono">{t.userEmail}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-extrabold text-slate-800">{t.bankName}</p>
                                <span className="text-[10px] text-slate-450 font-mono">{t.accountName} • {t.accountNumber}</span>
                              </td>
                              <td className="p-4 text-slate-500 font-mono text-[10.5px]">{t.date}</td>
                              <td className="p-4 font-black text-slate-900">₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="p-4">
                                <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold font-mono ${getStatusBadge(t.status)}`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    setEditingTxId(t.id);
                                    setNewStatus(t.status);
                                    setStatusReason(t.statusReason || "");
                                    setCompanyNote(t.companyNote || "");
                                  }}
                                  className="px-2.5 py-1 bg-red-650 bg-slate-900 hover:bg-slate-850 text-white rounded font-mono text-[10px] font-bold cursor-pointer"
                                >
                                  Clearance Action ➔
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                  </tbody>
                </table>
              </div>

            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 5: KYC AND COMPLIANCE -------------------- */}
        {activeTab === "kyc" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🛡️ KYC Clearance & Compliance Desk
                </h1>
                <p className="text-xs text-slate-400">Manage client identities, verification rules, and customize fields dynamically.</p>
              </div>
            </div>

            {/* KYC Pending verification lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white border border-slate-205 rounded-2xl p-5 shadow-xs">
                <h3 className="font-black text-slate-800 uppercase tracking-wide text-xs mb-4 flex items-center gap-1.5 border-b pb-2">
                  📁 Pending Verification Accounts ({users.filter(u => u.kycStatus === "Pending").length})
                </h3>

                <div className="space-y-4">
                  {users.filter(u => u.kycStatus === "Pending").length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-sans text-xs">
                      All submitted KYC documents are currently cleared! No pending verifications.
                    </div>
                  ) : (
                    users.filter(u => u.kycStatus === "Pending").map(u => (
                      <div key={u.email} className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 font-sans space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-[10.5px] text-slate-500 font-mono">{u.email} • {u.phone}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-800 font-mono font-bold text-[9px] px-2 py-0.5 rounded tracking-wide uppercase">
                            Awaiting Compliance Check
                          </span>
                        </div>

                        {/* KYC Answers */}
                        {u.kycAnswers && (
                          <div className="bg-white border border-slate-150 rounded-lg p-3 space-y-2">
                            <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Answers Grid:</p>
                            {Object.entries(u.kycAnswers).map(([key, val]) => (
                              <div key={key} className="flex justify-between items-start text-xs border-b border-slate-50 pb-1.5 last:border-b-0">
                                <span className="font-bold text-slate-500 uppercase text-[10px]">{kycFields.find(f=>f.id === key)?.label || key}:</span>
                                <span className="text-slate-900 font-extrabold max-w-[280px] break-all">{val}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Approve or reject actions trigger */}
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => {
                              setKycRejectingUser(u);
                              setKycRejectNote("");
                            }}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-sans text-[10.5px] font-bold rounded uppercase cursor-pointer"
                          >
                            State Decline Note
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Approve KYC identification documents for ${u.name}?`)) {
                                updateUserKycStatus(u.email, "Approved");
                              }
                            }}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-505 text-white font-sans text-[10.5px] font-extrabold rounded uppercase cursor-pointer"
                          >
                            ✓ Accept Compliance Docs
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reject dialog */}
                {kycRejectingUser && (
                  <div className="mt-4 p-4 border border-rose-200 bg-rose-50/20 rounded-xl space-y-3 text-xs">
                    <p className="font-bold text-rose-850 uppercase">Decline KYC uploads for {kycRejectingUser.name}:</p>
                    <textarea
                      placeholder="e.g. ID card blur, SSS coordinates unmatched, selfie verification too distant."
                      value={kycRejectNote}
                      onChange={(e) => setKycRejectNote(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-2.5"
                    />
                    <div className="flex justify-end gap-2.5">
                      <button onClick={() => setKycRejectingUser(null)} className="px-3 py-1 bg-slate-100 rounded">Cancel</button>
                      <button 
                        onClick={() => {
                          if (!kycRejectNote) {
                            alert("Specify a decline reason.");
                            return;
                          }
                          updateUserKycStatus(kycRejectingUser.email, "Rejected", kycRejectNote);
                          setKycRejectingUser(null);
                        }} 
                        className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded uppercase"
                      >
                        File decline
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* KYC Dynamic parameters form fields list */}
              <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-800 uppercase tracking-wide text-xs flex items-center justify-between border-b pb-2">
                  ⚙️ Dynamic KYC Questions Builder
                </h3>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The client onboarding system draws fields defined here. Alter, add, or require files dynamically to increase compliance friction!
                </p>

                {/* Field configurations */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {kycFields.map((field) => (
                    <div key={field.id} className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-md p-2 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-800">{field.label}</p>
                        <span className="text-[9.5px] font-mono text-slate-400 capitalize">{field.type} • {field.required ? "Required" : "Optional"}</span>
                      </div>
                      <button
                        onClick={() => {
                          const filtr = kycFields.filter(f => f.id !== field.id);
                          updateKycFields(filtr);
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add dynamic field expand form */}
                {!isAddingKycField ? (
                  <button
                    onClick={() => {
                      setIsAddingKycField(true);
                      setKycfLabel("");
                      setKycfPlaceholder("");
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 font-bold uppercase tracking-wide p-2.5 rounded-xl font-sans text-[10px] text-slate-705 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={11} /> Create custom KYC requirement
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!kycfLabel.trim()) return;
                      const slug = kycfLabel.trim().toLowerCase().replace(/[^a-z0-0]/g, "_");
                      const opt = kycfOptions ? kycfOptions.split(",").map(o=>o.trim()) : undefined;
                      const newFl: KycFormField = {
                        id: slug,
                        label: kycfLabel,
                        type: kycfType,
                        required: kycfRequired,
                        placeholder: kycfPlaceholder,
                        options: opt
                      };
                      updateKycFields([...kycFields, newFl]);
                      setIsAddingKycField(false);
                      setKycfLabel("");
                    }}
                    className="p-3 bg-slate-50 rounded-xl space-y-2.5 text-xs font-sans border border-slate-150"
                  >
                    <div className="space-y-1">
                      <label className="font-extrabold text-slate-700">Client Field Label</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SSS Identification scan"
                        value={kycfLabel}
                        onChange={(e) => setKycfLabel(e.target.value)}
                        className="w-full bg-white border rounded p-1.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1 block">
                        <label className="font-extrabold text-slate-700">Input Typology</label>
                        <select
                          value={kycfType}
                          onChange={(e) => setKycfType(e.target.value as any)}
                          className="w-full bg-white border rounded p-1.5"
                        >
                          <option value="text">Single Text Box</option>
                          <option value="number">Numeric coordinates</option>
                          <option value="select">Dropdown list choices</option>
                          <option value="file_placeholder">Simulated Identity Scan Attachment</option>
                        </select>
                      </div>

                      <div className="space-y-1 block">
                        <label className="font-extrabold text-slate-700">Requirements Check</label>
                        <select
                          value={kycfRequired ? "yes" : "no"}
                          onChange={(e) => setKycfRequired(e.target.value === "yes")}
                          className="w-full bg-white border rounded p-1.5"
                        >
                          <option value="yes">Mandatory</option>
                          <option value="no">Optional</option>
                        </select>
                      </div>
                    </div>

                    {kycfType === "select" && (
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-700">Dropdown Choices (Comma separated list)</label>
                        <input
                          type="text"
                          placeholder="UMID, PASSPORT, SSS ID"
                          value={kycfOptions}
                          onChange={(e) => setKycfOptions(e.target.value)}
                          className="w-full bg-white border rounded p-1.5"
                        />
                      </div>
                    )}

                    <div className="flex gap-1.5 pt-1 justify-end">
                      <button type="button" onClick={() => setIsAddingKycField(false)} className="px-2 py-1 bg-white border rounded">Cancel</button>
                      <button type="submit" className="px-3 py-1 bg-slate-900 text-white rounded font-bold uppercase text-[10px]">Save field</button>
                    </div>

                  </form>
                )}

              </div>

            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 6: TICKETS DESK -------------------- */}
        {activeTab === "tickets" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🎟️ Customer Support Desk
                </h1>
                <p className="text-xs text-slate-400">Review user complaints, compose responses, and change ticket statuses.</p>
              </div>

              {/* Status categories filter */}
              <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                {(["ALL", "Open", "In Progress", "Resolved", "Closed"] as const).map(flt => (
                  <button
                    key={flt}
                    onClick={() => setTicketStatusFilter(flt)}
                    className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider font-extrabold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      ticketStatusFilter === flt
                        ? `${theme.primaryBg} text-white shadow-xs`
                        : "bg-white border text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            {/* Split screen Support Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Inbox Column list */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col max-h-[500px]">
                <div className="p-3 bg-slate-50 border-b border-slate-100 relative">
                  <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Inbox tickets..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 pl-8 text-xs text-slate-800 outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-72">
                  {tickets
                    .filter(t => ticketStatusFilter === "ALL" || t.status === ticketStatusFilter)
                    .filter(t => `${t.subject} ${t.userName} ${t.id}`.toLowerCase().includes(ticketSearch.toLowerCase()))
                    .length === 0 ? (
                      <p className="p-10 text-center text-slate-400 text-xs font-bold font-sans">No tickets match this filter selection.</p>
                    ) : (
                      tickets
                        .filter(t => ticketStatusFilter === "ALL" || t.status === ticketStatusFilter)
                        .filter(t => `${t.subject} ${t.userName} ${t.id}`.toLowerCase().includes(ticketSearch.toLowerCase()))
                        .map(t => {
                          const isSel = selectedTicketId === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTicketId(t.id)}
                              className={`w-full text-left p-4 flex flex-col gap-2 transition-colors cursor-pointer ${
                                isSel ? "bg-slate-50 border-l-4 " + theme.primaryBorder : "hover:bg-slate-50/50"
                              }`}
                            >
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="font-bold text-slate-400">{t.id}</span>
                                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                                  t.priority === "Critical" ? "bg-red-100 text-red-700 animate-pulse" :
                                  t.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {t.priority}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                                <p className="text-[10.5px] text-slate-500">{t.userName}</p>
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-sans">
                                <span className="text-slate-400">{t.createdAt.split(" ")[0]}</span>
                                <span className={`px-2 py-0.5 rounded-full uppercase font-mono font-bold font-extrabold text-[8px] tracking-wide ${
                                  t.status === "Open" ? "bg-red-50 text-red-600 border border-red-100" :
                                  t.status === "In Progress" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                  "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                            </button>
                          );
                        })
                    )}
                </div>
              </div>

              {/* Right Message detailing panel */}
              <div className="lg:col-span-7 bg-white border border-slate-205 rounded-2xl p-5 shadow-xs flex flex-col justify-between max-h-[500px]">
                {selectedTicket ? (
                  <div className="flex flex-col h-full justify-between gap-4 overflow-hidden">
                    
                    {/* Header meta */}
                    <div className="border-b border-rose-50 pb-3 flex justify-between items-start gap-4 flex-shrink-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{selectedTicket.id}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.1 rounded uppercase ${
                            selectedTicket.status === "Open" ? "bg-red-100 text-red-800" :
                            selectedTicket.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                          }`}>
                            {selectedTicket.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">{selectedTicket.subject}</h3>
                        <p className="text-[11px] text-slate-450 font-sans">Submitted by: <span className="font-bold text-slate-700">{selectedTicket.userName}</span> ({selectedTicket.userEmail})</p>
                      </div>

                      {/* Manual change Ticket status selector */}
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => {
                          updateTicketStatus(selectedTicket.id, e.target.value as any);
                        }}
                        className="bg-slate-50 border border-slate-200 p-2 rounded text-xs outline-none font-bold"
                      >
                        <option value="Open">Status: Open</option>
                        <option value="In Progress">Status: In Progress</option>
                        <option value="Resolved">Status: Resolved</option>
                        <option value="Closed">Status: Closed</option>
                      </select>
                    </div>

                    {/* Timeline conversational Thread */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                      
                      {/* Original inquiries message */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10.5px] font-mono text-slate-400 font-bold border-b pb-1">
                          <span>{selectedTicket.userName}</span>
                          <span>{selectedTicket.createdAt}</span>
                        </div>
                        <p className="font-sans text-slate-800 leading-relaxed font-semibold self-start whitespace-pre-line">{selectedTicket.message}</p>
                      </div>

                      {/* Dynamic loop historical replies */}
                      {selectedTicket.replies.map((rep) => {
                        const isAdmin = rep.sender === "admin";
                        return (
                          <div 
                            key={rep.id} 
                            className={`rounded-xl p-3.5 border flex flex-col gap-1.5 max-w-[90%] font-sans leading-relaxed ${
                              isAdmin 
                                ? "bg-indigo-50/50 border-indigo-150 rounded-tr-none ml-auto" 
                                : "bg-white border-slate-200 rounded-tl-none mr-auto"
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold gap-6 border-b pb-0.5">
                              <span className={isAdmin ? "text-indigo-700" : ""}>{rep.senderName}</span>
                              <span>{rep.createdAt}</span>
                            </div>
                            <p className="font-semibold text-slate-800 whitespace-pre-line">{rep.message}</p>
                          </div>
                        );
                      })}

                    </div>

                    {/* Write text message response footer */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!ticketReplyText.trim()) return;
                        addTicketReply(selectedTicket.id, ticketReplyText.trim(), "admin");
                        setTicketReplyText("");
                      }}
                      className="flex gap-2.5 border-t pt-3 flex-shrink-0"
                    >
                      <input
                        type="text"
                        placeholder="Type customized desk operators response here..."
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        className="flex-1 bg-slate-55 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 outline-none"
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2.5 ${theme.primaryBg} text-white font-extrabold uppercase rounded-xl shadow-md tracking-wider flex items-center gap-1 cursor-pointer`}
                      >
                        <Send size={12} />
                        Reply
                      </button>
                    </form>

                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold font-sans">
                    No Support Ticket coordinates exist in inbox. Choose options or simulation.
                  </div>
                )}
              </div>

            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 7: MANAGE ROLE ACCESS -------------------- */}
        {activeTab === "roles" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🔑 Role Clearance & Access Controls
                </h1>
                <p className="text-xs text-slate-400 font-sans">Set administration operational clearance tiers, modify system credentials, and restrict actions.</p>
              </div>
            </div>

            {/* Static Permission Matrix Overview Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs font-sans">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-wide mb-3 block border-b pb-2">
                📂 Administrative Clearance Matrix
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Operations permissions associated with standard default clearance roles loaded on server launch:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] font-sans">
                  <thead className="bg-[#f8fafc] text-slate-405 font-mono text-[9px] uppercase border-b border-slate-100">
                    <tr>
                      <th className="p-3 font-bold">Clearance Role Target</th>
                      <th className="p-3 text-center">Approve Settlements</th>
                      <th className="p-3 text-center">Audit KYC documents</th>
                      <th className="p-3 text-center">Tweak corporate settings</th>
                      <th className="p-3 text-center">Reply Support Tickets</th>
                      <th className="p-3 text-center">Re-allocate Ledger Balances</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold selection:bg-slate-350">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-[#9333ea]">⚡ System Owner</td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto select-none" /></td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto select-none" /></td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto select-none" /></td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-[#3b82f6]">💼 Finance Admin</td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-[#10b981]">🛡️ Compliance Admin</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-[#f59e0b]">💬 Support Admin</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                      <td className="p-3 text-center text-emerald-600"><Check size={14} className="mx-auto" /></td>
                      <td className="p-3 text-center text-slate-300">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick role changer dropdown selector */}
            <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-xs font-sans">
              <h3 className="font-extrabold text-slate-800 uppercase text-xs tracking-wide mb-3 block border-b pb-2">
                ✍️ Fast Administrative Assignment Panel
              </h3>
              {roleSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 font-semibold mb-3 rounded-lg text-xs">
                  {roleSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
                <div className="space-y-1 block">
                  <label className="font-extrabold text-slate-700">Select Target User account:</label>
                  <select
                    className="w-full bg-slate-50 border p-3 rounded-lg"
                    onChange={(e) => {
                      const email = e.target.value;
                      const uobj = users.find(u => u.email === email);
                      setEditingRoleUser(uobj || null);
                      if (uobj) setNewRoleVal(uobj.role || "User");
                    }}
                  >
                    <option value="">-- Pick Registered Account --</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>{u.name} ({u.email}) - Current: {u.role || "User"}</option>
                    ))}
                  </select>
                </div>

                {editingRoleUser && (
                  <>
                    <div className="space-y-1 block">
                      <label className="font-extrabold text-slate-700">Assign New Role Clearance Class</label>
                      <select
                        value={newRoleVal}
                        onChange={(e) => setNewRoleVal(e.target.value as any)}
                        className="w-full bg-slate-50 border p-3 rounded-lg font-bold"
                      >
                        <option value="User">Standard User (Trade Investor)</option>
                        <option value="Support Admin">Support Admin (Compliance Level 1)</option>
                        <option value="Compliance Admin">Compliance Admin (KYC Approver)</option>
                        <option value="Finance Admin">Finance Admin (Settlement Agent)</option>
                        <option value="System Owner">System Owner (Unlimited Access)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (!editingRoleUser) return;
                          updateUserRole(editingRoleUser.email, newRoleVal);
                          setRoleSuccess(`Clearance Level class set to ${newRoleVal} for ${editingRoleUser.name}!`);
                          setEditingRoleUser(null);
                          setTimeout(() => setRoleSuccess(""), 1500);
                        }}
                        className={`w-full ${theme.primaryBg} text-white font-extrabold uppercase p-3 rounded-lg shadow cursor-pointer`}
                      >
                        🚀 Update clearances
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* -------------------- VIEW 8: SITE BRADING SETTINGS -------------------- */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  🎨 Theme & Corporate Settings Builder
                </h1>
                <p className="text-xs text-slate-400 font-sans">Corporate styling parameters, site names rules, interest configurations multipliers, and system maintenance switches.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-sans">
              
              {/* Branding and style configuration */}
              <div className="lg:col-span-2 bg-white border border-slate-205 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-wide mb-2 block border-b pb-2">
                  🎨 Visual Theme accents configurations
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateThemeConfig({
                      siteName: brandName,
                      logoEmoji: brandEmoji,
                      primaryColor: brandColor as any,
                      fontFamily: brandFont as any
                    });
                    setBrandSuccess("Branding settings saved successfully! Page elements auto-adapted.");
                    setTimeout(() => setBrandSuccess(""), 2000);
                  }}
                  className="space-y-4 text-xs font-sans"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 block">
                      <label className="font-extrabold text-slate-755">Corporate Title Name</label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg font-bold"
                      />
                    </div>
                    <div className="space-y-1 block">
                      <label className="font-extrabold text-slate-755">Launcher Emoji Logo</label>
                      <input
                        type="text"
                        required
                        value={brandEmoji}
                        onChange={(e) => setBrandEmoji(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 block">
                      <label className="font-extrabold text-slate-700">Theme Base Primary Accent Color</label>
                      <select
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg font-bold capitalize"
                      >
                        <option value="blue">Blue Minimal Desk</option>
                        <option value="emerald">Emerald Institutional</option>
                        <option value="rose">Rose Dynamic Apex</option>
                        <option value="violet">Violet High-Alpha Premium</option>
                        <option value="amber">Amber Bold Capitalist</option>
                        <option value="slate">Slate Swiss Modernist</option>
                      </select>
                    </div>

                    <div className="space-y-1 block">
                      <label className="font-extrabold text-slate-700">Operational Font Pairings Tyface</label>
                      <select
                        value={brandFont}
                        onChange={(e) => setBrandFont(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 outline-none p-2.5 rounded-lg font-bold"
                      >
                        <option value="Inter">Inter (Swiss Clean UI)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech Modernist)</option>
                        <option value="Outfit">Outfit (Display Rounded Elegant)</option>
                        <option value="Playfair Display">Playfair Display (Serif Opulence)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Symmetric Mono)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex justify-end">
                    <button
                      type="submit"
                      className={`px-6 py-2.5 ${theme.primaryBg} text-white font-extrabold uppercase rounded-lg shadow-md cursor-pointer hover:brightness-105`}
                    >
                      ✓ Save Core Branding changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Extended limits parameter switches settings */}
              <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-xs space-y-4 text-xs font-sans">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-wide mb-2 block border-b pb-2">
                  ⚙️ Regional limits & rules overrides
                </h3>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg">
                    <div>
                      <p className="font-extrabold text-slate-800">Operational Mode Maintenance</p>
                      <span className="text-[10px] text-slate-400">Force offline maintenance block screen</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteMaintenance}
                      onChange={(e) => setSiteMaintenance(e.target.checked)}
                      className="h-4 w-4 text-indigo-650 rounded cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 block">
                    <label className="font-extrabold text-slate-700">Default Investment Plan ROI Bounds (%)</label>
                    <input
                      type="number"
                      value={baseInterestRate}
                      onChange={(e) => setBaseInterestRate(e.target.value)}
                      className="w-full bg-slate-55 border p-2.5 rounded-lg font-bold"
                    />
                  </div>

                  <div className="space-y-1 block">
                    <label className="font-extrabold text-slate-700">Minimum Registered Wallet Deposit Limits</label>
                    <input
                      type="number"
                      value={minDepositLimit}
                      onChange={(e) => setMinDepositLimit(e.target.value)}
                      className="w-full bg-slate-55 border p-2.5 rounded-lg font-bold"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setBrandSuccess("Advanced system parameters synchronized successfully!");
                      setTimeout(() => setBrandSuccess(""), 1500);
                    }}
                    className="w-full bg-slate-900 shadow-sm text-white font-bold uppercase p-2.5 text-center block rounded-lg cursor-pointer hover:bg-slate-850 text-[10.5px]"
                  >
                    Save Rules overrides
                  </button>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* -------------------- MAIN DIALOG MODAL: STATUS ACTION OVERRIDE -------------------- */}
      <AnimatePresence>
        {editingTxId && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden"
            >
              
              <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Clearance Status Action Desk</h3>
                  <p className="text-[10px] text-slate-400">Override reference code: {editingTxId}</p>
                </div>
                <button 
                  onClick={() => setEditingTxId(null)} 
                  className="text-slate-400 text-lg hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateTxSubmit} className="p-5 space-y-4 text-xs font-sans">
                {alertSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-850 border border-emerald-100 rounded-lg">
                    {alertSuccess}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Clearing Status Option</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TransactionStatus)}
                    className="w-full bg-slate-50 border p-3 rounded-lg font-bold text-slate-800"
                  >
                    <option value="Pending">Pending Audit</option>
                    <option value="Processing font-bold">Processing Dispatch Wire</option>
                    <option value="Approved">Approved / Cleared Asset Outflow</option>
                    <option value="Declined">Declined / Void operation</option>
                    <option value="Verification Required">Verification Required (Collect Custom Fee Prompt)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Decline / Verification Prompt Theme State</label>
                  <input
                    type="text"
                    placeholder="e.g. BSP SYSTEM MANAGEMENT CHARGES OF ₱4,500.00 REQUIRED"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full bg-slate-51 border p-3 rounded-lg font-extrabold text-slate-900 uppercase placeholder:normal-case placeholder:font-normal outline-none"
                  />
                  <p className="text-[9.5px] text-slate-400 leading-normal">Prints dynamic alert block headers in corporate red inside the customer portal.</p>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Company Clear Instruction Message to Investor</label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific e-wallet coordinates and GCash wire details to settle required clearing charges."
                    value={companyNote}
                    onChange={(e) => setCompanyNote(e.target.value)}
                    className="w-full bg-slate-50 border p-3 rounded-lg font-semibold leading-relaxed"
                  />
                  <p className="text-[9.5px] text-slate-400">Detailed instructions telling client how to manually settle charges.</p>
                </div>

                <div className="flex gap-2.5 justify-end pt-3 border-t">
                  <button 
                    type="button" 
                    onClick={() => setEditingTxId(null)} 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold uppercase cursor-pointer"
                  >
                    Cancel Action
                  </button>
                  <button 
                    type="submit" 
                    className={`px-6 py-2 ${theme.primaryBg} text-white font-extrabold uppercase rounded-lg shadow-md cursor-pointer`}
                  >
                    🚀 Lock Status updates
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
