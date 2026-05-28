import React, { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useSimulation } from "../context/SimulationContext";
import { TrendingUp, Award, Calendar, Percent } from "lucide-react";

interface DataPoint {
  dateStr: string;
  displayDate: string;
  cumulativeProfit: number;
  dailyProfit: number;
  eventLabel?: string;
}

export const ProfitChart: React.FC = () => {
  const { profile, transactions, themeConfig, getThemeStyles } = useSimulation();
  const theme = getThemeStyles(themeConfig.primaryColor);

  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("7d");

  // Get hex color for recharts based on active primary theme
  const getThemeHexColor = (color: string) => {
    switch (color) {
      case "emerald": return "#059669";
      case "rose": return "#e11d48";
      case "violet": return "#7c3aed";
      case "amber": return "#d97706";
      case "slate": return "#475569";
      default: return "#2563eb"; // blue
    }
  };

  const chartColor = getThemeHexColor(themeConfig.primaryColor);

  // Safely parse current date or default to anchor
  const anchorDateStr = "2026-05-23";
  const anchorDate = new Date(anchorDateStr);

  const chartData = useMemo(() => {
    const periodInDays = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 45;
    const finalProfit = profile.profitAmount || 0;
    const points: DataPoint[] = [];

    // Filter relevant user transactions
    const userTx = transactions.filter(
      (tx) => tx.userEmail === profile.email && tx.status === "Approved"
    );

    // Let's generate historical points back-propagating from the current total profit
    for (let i = periodInDays - 1; i >= 0; i--) {
      const currentDate = new Date(anchorDate);
      currentDate.setDate(anchorDate.getDate() - i);

      const dStr = currentDate.toISOString().split("T")[0];
      const displayStr = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Calculate a base compounding curve over the generation period
      // Standard smooth compounding curve matching the plans expected profits
      // Formula: profit = finalProfit * (1 - e ^ (-k * fraction)) / (1 - e ^ -k)
      // Or simple organic step compounding
      const progressFraction = (periodInDays - 1 - i) / (periodInDays - 1 || 1);
      
      // Let's add an organic fluctuation so it looks realistic
      const organicFactor = Math.sin(progressFraction * Math.PI * 1.5) * 0.05 + progressFraction * 1.05;
      const normalizedFraction = Math.max(0, Math.min(1, organicFactor));
      
      let calculatedCumulative = finalProfit * normalizedFraction;

      // Adjust to fit EXACTLY finalProfit on the last day
      if (i === 0) {
        calculatedCumulative = finalProfit;
      }

      // Check if we have transactions on this exact day to mark as Milestone Events
      const matchedEvents = userTx.filter((t) => t.date && t.date.startsWith(dStr));
      let eventLabel = undefined;
      let extraAdjustment = 0;

      if (matchedEvents.length > 0) {
        // Summarize event names
        const depositCount = matchedEvents.filter((e) => e.type === "deposit").length;
        const withdrawCount = matchedEvents.filter((e) => e.type === "withdrawal").length;
        const labels: string[] = [];
        if (depositCount > 0) labels.push(`${depositCount} Deposit(s) Approved`);
        if (withdrawCount > 0) labels.push(`${withdrawCount} Withdrawal(s) cleared`);
        eventLabel = labels.join(" & ");
        
        // Add high-fidelity transaction influence to curve
        const sumAmounts = matchedEvents.reduce((sum, e) => sum + e.amount, 0);
        extraAdjustment = sumAmounts * 0.01; // subtle feedback slope on chart
      }

      const pointYield = calculatedCumulative + extraAdjustment;

      points.push({
        dateStr: dStr,
        displayDate: displayStr,
        cumulativeProfit: parseFloat(pointYield.toFixed(2)),
        dailyProfit: 0, // calculated next
        eventLabel,
      });
    }

    // Populate daily profit differences
    for (let j = 0; j < points.length; j++) {
      if (j === 0) {
        points[j].dailyProfit = parseFloat((points[j].cumulativeProfit * 0.1).toFixed(2));
      } else {
        const diff = points[j].cumulativeProfit - points[j - 1].cumulativeProfit;
        points[j].dailyProfit = parseFloat((diff < 0 ? 0 : diff).toFixed(2));
      }
    }

    return points;
  }, [profile.profitAmount, transactions, profile.email, timeframe]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = profile.profitAmount || 0;
    const sampleSize = chartData.length;
    const averageDaily = sampleSize > 0 ? total / sampleSize : 0;
    
    // Growth percentage calculation based on mock baseline
    const initialAmt = chartData[0]?.cumulativeProfit || 100;
    const finalAmt = chartData[sampleSize - 1]?.cumulativeProfit || 100;
    const growthPercent = initialAmt > 0 ? ((finalAmt - initialAmt) / initialAmt) * 100 : 0;

    return {
      totalFormatted: total.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      avgFormatted: averageDaily.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      growthFormatted: growthPercent.toFixed(1),
    };
  }, [profile.profitAmount, chartData]);

  return (
    <div id="profit-growth-widget" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <TrendingUp size={15} className={theme.primaryText} />
            Profit Growth Analytics
          </h3>
          <p className="text-[10.5px] text-slate-400 font-medium">
            Cumulative live returns generated through the PH TRADE UNION cooperative trading desk.
          </p>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-lg shrink-0 w-fit self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeframe("7d")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              timeframe === "7d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("30d")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              timeframe === "30d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("all")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              timeframe === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All Growth
          </button>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-3.5 space-y-0.5">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <Award size={10} className="text-amber-500" />
            Total Profit
          </div>
          <p className="text-sm sm:text-base font-black text-slate-900">
            ₱{stats.totalFormatted}
          </p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-3.5 space-y-0.5">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <Calendar size={10} className="text-blue-500" />
            Avg Daily Returns
          </div>
          <p className="text-sm sm:text-base font-black text-emerald-600">
            ₱{stats.avgFormatted}
          </p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-3.5 space-y-0.5">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <Percent size={10} className="text-violet-500" />
            Growth Rate
          </div>
          <p className="text-sm sm:text-base font-black text-slate-950">
            +{stats.growthFormatted}%
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "600" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "600" }}
              tickFormatter={(v) => `₱${Math.round(v).toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DataPoint;
                  return (
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-3 shadow-xl max-w-xs space-y-2">
                      <p className="text-[10px] font-bold font-mono text-slate-405 border-b border-slate-800 pb-1.5 uppercase">
                        📅 {data.dateStr}
                      </p>
                      <div className="space-y-1">
                        <div className="text-[11px] flex justify-between gap-12">
                          <span className="text-slate-400">Cumulative Profit:</span>
                          <span className="font-extrabold text-[#10b981]">
                            ₱{data.cumulativeProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-[11px] flex justify-between gap-12">
                          <span className="text-slate-400">Day-over-Day Yield:</span>
                          <span className="font-extrabold text-white">
                            +₱{data.dailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      {data.eventLabel && (
                        <div className="bg-blue-950/40 text-blue-400 border border-blue-900/40 p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tight text-center">
                          🌟 {data.eventLabel}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeProfit"
              stroke={chartColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#0f172a] text-white p-3.5 rounded-xl flex items-center justify-between border border-slate-850">
        <p className="text-[9.5px] font-medium text-slate-400 leading-relaxed max-w-xs sm:max-w-md">
          🔒 <span className="font-extrabold text-slate-350 bg-slate-800 px-1 py-0.5 rounded text-[8.5px] uppercase mr-1">Smart Yield Oracle</span>
          Compound ledger updates are audited in real-time. Payout increments match your active{" "}
          <span className="font-bold text-white underline">{profile.investmentPlan || "Silver Starter Plan"}</span>.
        </p>
        <span className="text-[10px] font-mono text-emerald-505 font-bold animate-pulse shrink-0">
          ● RECYCLED ACTIVE
        </span>
      </div>
    </div>
  );
};
