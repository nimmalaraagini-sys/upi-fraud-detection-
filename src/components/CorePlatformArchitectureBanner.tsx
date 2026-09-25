import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Zap, Eye, QrCode, 
  Smartphone, FileCheck, Users, Clock, Layers, Sparkles, 
  PhoneCall, Shield, Activity, Cpu, AlertTriangle
} from "lucide-react";

interface CorePlatformArchitectureBannerProps {
  userRoleMode: "USER" | "SOC";
  onToggleRole: (role: "USER" | "SOC") => void;
  onOpenInterception: () => void;
  onOpenAttackPatterns: () => void;
  onOpenCentralEngine: () => void;
  onOpenCaseCenter: () => void;
  onOpenGraph: () => void;
  onOpenDecisionLogs: () => void;
  onOpenArchitecture: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenQrScanner: () => void;
}

export const CorePlatformArchitectureBanner: React.FC<CorePlatformArchitectureBannerProps> = ({
  userRoleMode,
  onToggleRole,
  onOpenInterception,
  onOpenAttackPatterns,
  onOpenCentralEngine,
  onOpenCaseCenter,
  onOpenGraph,
  onOpenDecisionLogs,
  onOpenArchitecture,
  onNavigateTab,
  onOpenQrScanner
}) => {
  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-slate-950 p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Center Stem: SAFEUPI CORE PLATFORM */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-black tracking-widest uppercase shadow-sm">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>SAFEUPI CORE PLATFORM</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2 flex-wrap">
          <span>&ldquo;CHECK BEFORE YOU PAY&rdquo;</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Team: SECURE SHIELD
          </span>
        </h2>
        
        <p className="text-xs text-slate-400 max-w-xl">
          Unified Dual-Engine Architecture: Real-time user payment protection paired with enterprise-grade Security Operations Center telemetry.
        </p>

        {/* Visual Vertical Stem */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-slate-600 mt-1" />
      </div>

      {/* Branching Split Bar */}
      <div className="relative z-10 hidden sm:block w-full max-w-3xl mx-auto mb-6">
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500/60 via-slate-600 to-purple-500/60 relative">
          {/* Left Arrow Connector */}
          <div className="absolute left-1/4 -top-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_10px_#06b6d4]" />
          {/* Right Arrow Connector */}
          <div className="absolute right-1/4 -top-1.5 w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-900 shadow-[0_0_10px_#a855f7]" />
        </div>
      </div>

      {/* Two Main Pillars Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* ========================================================================= */}
        {/* PILLAR 1: USER PAYMENT EXPERIENCE */}
        {/* ========================================================================= */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            userRoleMode === "USER"
              ? "bg-slate-900/90 border-cyan-500/60 ring-1 ring-cyan-500/40 shadow-xl shadow-cyan-950/40"
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-90 hover:opacity-100"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-cyan-500/20 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <span className="text-base">👤</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
                    User Payment Experience
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Consumer Defense Layer</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleRole("USER")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                  userRoleMode === "USER"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {userRoleMode === "USER" ? "● Active View" : "Switch View"}
              </button>
            </div>

            {/* List of 6 Core Specifications */}
            <ul className="space-y-2 text-xs">
              <li 
                onClick={() => onNavigateTab("pay")}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">Check Before You Pay Flow</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold opacity-80 group-hover:opacity-100">Launch →</span>
              </li>

              <li 
                onClick={() => onNavigateTab("pay")}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">7 Transaction Categories (P2P, Cashout, etc.)</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold opacity-80 group-hover:opacity-100">View 7 Types →</span>
              </li>

              <li 
                onClick={onOpenInterception}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">Real-Time Interception Point (18 ms)</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Simulate
                </span>
              </li>

              <li 
                onClick={() => onNavigateTab("fraud_detection")}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">Simple Human Explanation (&ldquo;Why?&rdquo;)</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold opacity-80 group-hover:opacity-100">Waterfall →</span>
              </li>

              <li 
                onClick={onOpenQrScanner}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">QR & Screenshot Security Scanner</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold opacity-80 group-hover:opacity-100">Scan QR →</span>
              </li>

              <li 
                onClick={() => onNavigateTab("recovery")}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">1930 Golden Hour Emergency Recovery</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  Recovery Hub
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Client-Edge Zero-PII Defense</span>
            <span className="font-mono text-cyan-300 font-bold">100% On-Device Check</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PILLAR 2: SOC SECURITY OPERATIONS CENTER */}
        {/* ========================================================================= */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
            userRoleMode === "SOC"
              ? "bg-slate-900/90 border-purple-500/60 ring-1 ring-purple-500/40 shadow-xl shadow-purple-950/40"
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-90 hover:opacity-100"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-purple-500/20 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <span className="text-base">🛡️</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                    SOC Security Operations Center
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Enterprise Intelligence Tier</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleRole("SOC")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                  userRoleMode === "SOC"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30"
                }`}
              >
                {userRoleMode === "SOC" ? "● Active View" : "Switch View"}
              </button>
            </div>

            {/* List of 6 Core Specifications */}
            <ul className="space-y-2 text-xs">
              <li 
                onClick={onOpenAttackPatterns}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">4 Major Attack Patterns Center</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  ATO / Sim / Collusion
                </span>
              </li>

              <li 
                onClick={onOpenCentralEngine}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">Central ML Feature Engine (11 Categories)</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-bold opacity-80 group-hover:opacity-100">Vector JSON →</span>
              </li>

              <li 
                onClick={onOpenCaseCenter}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">AI Fraud Case Center (SAR/STR Drafts)</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Case Center
                </span>
              </li>

              <li 
                onClick={onOpenGraph}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">Collusion Graph Engine (Node-Link)</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-bold opacity-80 group-hover:opacity-100">Graph View →</span>
              </li>

              <li 
                onClick={onOpenDecisionLogs}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">Microsecond Execution Audit Trails</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-bold opacity-80 group-hover:opacity-100">Audit Logs →</span>
              </li>

              <li 
                onClick={onOpenArchitecture}
                className="p-2 rounded-xl bg-slate-850/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-200 group-hover:text-purple-200">Deployment Topology & Disclaimers</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-bold opacity-80 group-hover:opacity-100">Topology →</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Human-Review Compliance Enforced</span>
            <span className="font-mono text-purple-300 font-bold">Confidential Internal SOC</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
