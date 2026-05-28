import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { ChatMessage } from "../types";
import { useSimulation } from "../context/SimulationContext";

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { profile } = useSimulation();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "welcome",
        role: "manager",
        content: `Mabuhay! I am Mateo, your Senior Account Relationship Manager here at PH Trade Union. 🇵🇭 If you have any inquiries regarding your wallet balance, making a secure deposit, or processing any pending withdrawals, feel free to ask me here!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      // Structure messages list into clean client history for the backend Express router
      const historyPayload = chatHistory.slice(1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        content: msg.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach manager agent");
      }

      const data = await res.json();
      
      const managerMsg: ChatMessage = {
        id: `mgr-${Date.now()}`,
        role: "manager",
        content: data.reply || "I am currently coordinating with the backend clearance desk. Please verify your details shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, managerMsg]);
    } catch (err) {
      console.error(err);
      // Nice intelligent fallback answer structure in case Gemini Key is not configured yet
      setTimeout(() => {
        const errorFallback: ChatMessage = {
          id: `mgr-err-${Date.now()}`,
          role: "manager",
          content: `To process your inquiry with top-tier security, please coordinate with our support desk. Please note that all bank-to-bank settlements require active verification. Reach out with GCash or Maya coordinates for immediate support.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatHistory((prev) => [...prev, errorFallback]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group relative border-2 border-white/20"
        >
          <span className="absolute -top-1 -right-1 bg-red-500 h-2.5 w-2.5 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 bg-red-500 h-2.5 w-2.5 rounded-full" />
          <MessageSquare className="h-6 w-6" />
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Chat with Mateo (Manager)
          </span>
        </button>
      )}

      {/* Expandable Chat Client Box */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[370px] h-[500px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 transform scale-100 animate-in fade-in-50 slide-in-from-bottom-5">
          {/* Main header layout */}
          <div className="bg-gradient-to-r from-[#0a1128] to-[#12224d] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white relative">
                👨‍💼
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-1.5 text-white">
                  Manager Mateo
                  <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                </h3>
                <span className="text-[10px] text-slate-300 flex items-center gap-1">
                  PH Trade Relationship Expert • Active
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat log body */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 text-xs">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {msg.role !== "user" && (
                  <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs">
                    👨‍💼
                  </div>
                )}
                <div>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className={`text-[10px] text-slate-400 mt-1 block ${msg.role === "user" ? "text-right" : ""}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 max-w-[80%] mr-auto items-center text-slate-400">
                <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  👨‍💼
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-[10.5px]">Mateo is typing...</span>
                  <Loader2 size={13} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Secure compliance disclaimer banner */}
          <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-150 text-[10px] text-slate-500 text-center select-none font-mono flex items-center justify-center gap-1">
            🏦 SEC-BSP Regulated Cryptographic Advisor Routing
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Mateo about your withdrawal, deposits..."
              className="flex-1 outline-none text-xs text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:border-blue-500 transition-colors"
            />
            <button
               type="submit"
               disabled={!message.trim() || isLoading}
               className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
