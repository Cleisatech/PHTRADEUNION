import React, { useState } from "react";
import { useSimulation } from "../context/SimulationContext";
import { 
  Mail, Lock, User, Phone, Globe, DollarSign, ArrowRight, ArrowLeft, 
  Eye, EyeOff, ShieldCheck, Sparkles, TrendingUp, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginAuthProps {
  initialMode?: "login" | "signup";
}

export const LoginAuth: React.FC<LoginAuthProps> = ({ initialMode = "login" }) => {
  const { login, signup, setView, investmentPlans, themeConfig, getThemeStyles } = useSimulation();
  const theme = getThemeStyles(themeConfig?.primaryColor || "blue");

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Form states - Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [currency, setCurrency] = useState("PHP (₱)");
  const [selectedPlanId, setSelectedPlanId] = useState(investmentPlans[0]?.id || "");
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");

  const countries = [
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Hong Kong", flag: "🇭🇰" },
    { name: "Taiwan", flag: "🇹🇼" },
    { name: "Japan", flag: "🇯🇵" }
  ];

  const currencies = [
    { code: "PHP (₱)", symbol: "₱" },
    { code: "USD ($)", symbol: "$" },
    { code: "SGD (S$)", symbol: "S$" },
    { code: "MYR (RM)", symbol: "RM" },
    { code: "GBP (£)", symbol: "£" },
    { code: "EUR (€)", symbol: "€" },
    { code: "HKD (HK$)", symbol: "HK$" },
    { code: "JPY (¥)", symbol: "¥" }
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter your account email credentials.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.message);
      } else {
        setView("user_dashboard");
      }
    } catch (err: any) {
      setLoginError(err.message || "Something went wrong during verify.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!name.trim()) {
      setSignupError("Full name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSignupError("Please enter a valid email address coordinates.");
      return;
    }
    if (!phone.trim()) {
      setSignupError("Phone number is required.");
      return;
    }
    if (password.length < 5) {
      setSignupError("Password must be at least 5 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setSignupStep(2);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    const selectedPlan = investmentPlans.find(p => p.id === selectedPlanId);

    setLoading(true);
    try {
      const res = await signup({
        name,
        email,
        phone,
        password,
        country,
        currency,
        investmentPlan: selectedPlan ? selectedPlan.name : "",
        balance: selectedPlan ? selectedPlan.minDeposit : 0, // Set starting simulate balance based on min investment deposit!
        investmentAmount: selectedPlan ? selectedPlan.minDeposit : 0
      });

      if (!res.success) {
        setSignupError(res.message);
      } else {
        setView("user_dashboard");
      }
    } catch (err: any) {
      setSignupError(err.message || "An account creation error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const currentSelectedPlan = investmentPlans.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f8fafc] text-slate-800 font-sans flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Banner header inside card */}
        <div className="bg-[#0f172a] text-white p-6 relative overflow-hidden text-center border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient from-blue-900/30 to-[#0f172a] opacity-50" />
          <div className="relative z-10 space-y-1">
            <span className="font-mono text-[9px] uppercase font-bold text-blue-400 tracking-widest flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              PHILIPPINE INSTITUTIONAL TRADING DESK
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              {mode === "login" ? "SEC Secure Login" : "Open Yield Account"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login" 
                ? "Enter your secure credentials to coordinate with your terminal manager."
                : `Step ${signupStep} of 2 — Account configuration`
              }
            </p>
          </div>
        </div>

        {/* Dynamic content forms */}
        <div className="p-6 sm:p-8 flex-1">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                {loginError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100 animate-shake">
                    ⚠️ {loginError}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Account Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Secure Pin / Password</label>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={loginShowPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {loginShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${theme.primaryBg} ${theme.hoverBg} text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all text-center cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "AUTHENTICATING SECURITY..." : "Access Terminal Login ➔"}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Don't have an institutional account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setSignupStep(1);
                        setSignupError("");
                      }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="signup-stages"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {signupError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100">
                    ⚠️ {signupError}
                  </div>
                )}

                {signupStep === 1 ? (
                  <form onSubmit={handleNextStep} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Cleisa Tech"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. user@domain.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +63 (917) 123-4567"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Create Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={signupShowPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 5 characters"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setSignupShowPassword(!signupShowPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {signupShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={signupShowPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Retype password"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 pl-9.5 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full ${theme.primaryBg} ${theme.hoverBg} text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                    >
                      Continue to Details
                      <ArrowRight size={14} />
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-500">
                        Already have an institutional account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setLoginError("");
                          }}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    
                    {/* Country Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Globe size={13} className="text-blue-500" />
                        Select Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 text-xs text-slate-805 font-semibold"
                      >
                        {countries.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Currency Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <DollarSign size={13} className="text-emerald-500" />
                        Select Account Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 text-xs text-slate-805 font-semibold"
                      >
                        {currencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Investment Plan Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <TrendingUp size={13} className="text-indigo-500" />
                        Select Investment Plan
                      </label>
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none p-3 text-xs text-slate-805 font-semibold"
                      >
                        {investmentPlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} ({plan.roi}% ROI)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic Selected Plan Details */}
                    {currentSelectedPlan && (
                      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-extrabold ${theme.primaryText} uppercase tracking-tight text-[11px]`}>
                            {currentSelectedPlan.name} Specs:
                          </span>
                          <span className="bg-slate-200/60 text-slate-700 font-mono font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                            {currentSelectedPlan.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                          {currentSelectedPlan.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono border-t border-slate-200/50 pt-2 text-slate-500">
                          <div>
                            <span>ROI RETRIEVAL</span>
                            <p className="font-bold text-emerald-600">+{currentSelectedPlan.roi}% Net Yield</p>
                          </div>
                          <div>
                            <span>MINIMUM ALLOCATION</span>
                            <p className="font-bold text-slate-800">
                              {currencies.find(c => c.code === currency)?.symbol || "₱"}{currentSelectedPlan.minDeposit.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        Back
                      </button>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-2/3 ${theme.primaryBg} ${theme.hoverBg} text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-lg active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {loading ? "OPENING ACCOUNT..." : "CREATE ACCOUNT ➔"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security disclaimer */}
        <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-100 text-[10.5px] text-slate-400 font-sans leading-relaxed text-center">
          🛡️ This portal uses Bank-level SSL encryptions and is fully SEC and BSP supervised for anti-money laundering and cryptographic currency clearances.
        </div>
      </div>
    </div>
  );
};
