import React from "react";
import { ShieldAlert, ShieldCheck, PhoneCall, Activity, BookOpen, Search, ArrowRight, HelpCircle, Layers } from "lucide-react";

interface HeaderProps {
  activeTab: "simulator" | "scenarios" | "feed" | "matrix" | "traceback";
  setActiveTab: (tab: "simulator" | "scenarios" | "feed" | "matrix" | "traceback") => void;
  onOpenAwareness: () => void;
  onOpenHowToUse: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenAwareness,
  onOpenHowToUse
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                UPI Scam Detector
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Smart Money Guard
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
                Live Protection Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Check if a payment is safe, avoid fake scams, and learn how to get your money back
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Light Theme) */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "simulator"
                  ? "bg-white text-indigo-700 font-bold shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Check Payment Risk
            </button>
            <button
              id="tab-scenarios"
              onClick={() => setActiveTab("scenarios")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "scenarios"
                  ? "bg-white text-indigo-700 font-bold shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Real Scam Examples
            </button>
            <button
              id="tab-feed"
              onClick={() => setActiveTab("feed")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "feed"
                  ? "bg-white text-indigo-700 font-bold shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Live Network Stream
            </button>
            <button
              id="tab-traceback"
              onClick={() => setActiveTab("traceback")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "traceback"
                  ? "bg-white text-cyan-700 font-bold shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Trace Lost Money
            </button>
            <button
              id="tab-matrix"
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "matrix"
                  ? "bg-white text-purple-700 font-bold shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              How Rules Work
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* How to use button */}
            <button
              id="btn-how-to-use"
              onClick={onOpenHowToUse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-all text-xs font-bold shadow-xs"
              title="Learn how to use this app & check any UPI payment"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>How to Use</span>
            </button>

            {/* 1930 Cyber helpline button */}
            <button
              id="btn-cyber-helpline"
              onClick={onOpenAwareness}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all text-xs font-bold shadow-xs"
              title="Helpline: Call 1930 if you lost money in a scam"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
              <span>Helpline: 1930</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
