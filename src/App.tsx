import React from "react";
import { SimulationProvider, useSimulation } from "./context/SimulationContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginAuth } from "./components/LoginAuth";
import { SupportChat } from "./components/SupportChat";
import { AnimatePresence, motion } from "motion/react";

const MainAppContent: React.FC = () => {
  const { currentView, isLoggedIn, themeConfig } = useSimulation();

  const getFontFamilyStyle = (font: string) => {
    switch (font) {
      case "Space Grotesk": return { fontFamily: "'Space Grotesk', sans-serif" };
      case "Outfit": return { fontFamily: "'Outfit', sans-serif" };
      case "Playfair Display": return { fontFamily: "'Playfair Display', serif" };
      case "JetBrains Mono": return { fontFamily: "'JetBrains Mono', monospace" };
      default: return { fontFamily: "'Inter', sans-serif" };
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen bg-slate-50 text-slate-800 select-none relative"
      style={getFontFamilyStyle(themeConfig?.fontFamily || "Inter")}
    >
      <Header />

      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <LandingPage />
            </motion.div>
          )}

          {currentView === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <LoginAuth initialMode="login" />
            </motion.div>
          )}

          {currentView === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <LoginAuth initialMode="signup" />
            </motion.div>
          )}

          {["user_dashboard", "withdraw", "deposit", "profile"].includes(currentView) && (
            <motion.div
              key="user_dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isLoggedIn ? (
                <UserDashboard />
              ) : (
                <LoginAuth initialMode="login" />
              )}
            </motion.div>
          )}

          {currentView === "admin_dashboard" && (
            <motion.div
              key="admin_dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Senior Account Relationship Manager Support Client Widget */}
      <SupportChat />
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <MainAppContent />
    </SimulationProvider>
  );
}
