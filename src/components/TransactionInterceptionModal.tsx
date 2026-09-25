import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon,
  Clock, ArrowRight, X, Check, Lock, ChevronDown, ChevronUp,
  Cpu, Activity, Zap, RefreshCw, Smartphone, Wifi, Users,
  FileCheck, FileText, Ban, CheckCircle2, AlertCircle, HelpCircle
} from "lucide-react";

export type TransactionType = 
  | "P2P Transfer"
  | "Cash-Out"
  | "Merchant Payment"
  | "Wallet Credit"
  | "QR Payment"
  | "Collect/Payment Request"
  | "Bank Transfer";

export interface InterceptionCheckData {
  transactionId: string;
  amount: number;
  type: TransactionType;
  recipient: string;
  recipientName?: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  mlRiskPercent: number; // e.g. 82%
  deviceRisk: "LOW" | "MEDIUM" | "HIGH";
  networkRisk: "LOW" | "MEDIUM" | "HIGH";
  recipientRisk: "LOW" | "MEDIUM" | "HIGH";
  decision: "ACCEPT" | "DECLINE" | "REFER";
  rulesTriggered: {
    code: string;
    label: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description: string;
  }[];
  validations: {
    passed: boolean;
    checks: { name: string; ok: boolean; detail: string }[];
  };
  explainableAiFactors: {
    factor: string;
    impact: string;
    humanReason: string;
  }[];
  auditTrail: {
    time: string;
    step: string;
    status: "ok" | "warn" | "fail";
    latencyMs: number;
  }[];
  processingTimeMs?: number;
}

interface TransactionInterceptionModalProps {
  isOpen: boolean;
  data: InterceptionCheckData | null;
  onClose: () => void;
  onProceedToPin: () => void;
  onCancel: () => void;
  onOpenInvestigation?: (txnId: string) => void;
  isUserViewSimple?: boolean;
}

export const TransactionInterceptionModal: React.FC<TransactionInterceptionModalProps> = ({
  isOpen,
  data,
  onClose,
  onProceedToPin,
  onCancel,
  onOpenInvestigation,
  isUserViewSimple = true
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(!isUserViewSimple);
  const [activeTab, setActiveTab] = useState<"decision" | "rules" | "features" | "audit">("decision");

  if (!isOpen || !data) return null;

  const {
    transactionId,
    amount,
    type,
    recipient,
    riskScore,
    mlRiskPercent,
    deviceRisk,
    networkRisk,
    recipientRisk,
    decision,
    rulesTriggered,
    validations,
    explainableAiFactors,
    auditTrail,
    processingTimeMs = 18
  } = data;

  const isBlocked = decision === "DECLINE";
  const isReferred = decision === "REFER";
  const isAccepted = decision === "ACCEPT";

  // Decision Theme
  const theme = isBlocked
    ? {
        border: "border-rose-500/50",
        badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        headerBg: "from-rose-950/90 via-slate-900 to-rose-950/80",
        icon: AlertOctagon,
        iconColor: "text-rose-400",
        title: "PAYMENT STOPPED — HIGH RISK BLOCKED",
        desc: "Multiple high-risk security signals detected matching active financial cybercrime patterns."
      }
    : isReferred
    ? {
        border: "border-amber-500/50",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        headerBg: "from-amber-950/90 via-slate-900 to-amber-950/80",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        title: "PAYMENT REFERRED FOR REVIEW",
        desc: "Suspicious transaction parameters require additional security verification before debit."
      }
    : {
        border: "border-emerald-500/50",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        headerBg: "from-emerald-950/90 via-slate-900 to-emerald-950/80",
        icon: ShieldCheck,
        iconColor: "text-emerald-400",
        title: "PAYMENT VERIFIED — SAFE TO PROCEED",
        desc: "SafeUPI verified beneficiary reputation, hardware integrity, and spend baseline."
      };

  const DecisionIcon = theme.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl bg-slate-900 border ${theme.border} rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto`}
      >
        {/* Top Header Bar */}
        <div className={`p-5 bg-gradient-to-r ${theme.headerBg} border-b border-white/10 relative`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                isBlocked ? "bg-rose-500/20 border-rose-500/40"
                : isReferred ? "bg-amber-500/20 border-amber-500/40"
                : "bg-emerald-500/20 border-emerald-500/40"
              }`}>
                <DecisionIcon className={`w-6 h-6 ${theme.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                    SAFEUPI SECURITY CHECKPOINT
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/10 text-slate-300 border border-white/15">
                    ⏱️ {processingTimeMs} ms (Prototype measurement)
                  </span>
                </div>
                <h2 className="text-lg font-black text-white tracking-tight mt-0.5">
                  {theme.title}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  {theme.desc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prototype Simulation Disclosure */}
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center justify-between">
            <span>🛡️ <strong>Prototype Simulation Point:</strong> Evaluating transaction before settlement via centralized rule & ML engine.</span>
            <span className="font-mono text-slate-400">ID: {transactionId}</span>
          </div>
        </div>

        {/* ==============================================================
            SECTION 10: TRANSACTION DECISION SCREEN CARDS
           ============================================================== */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          
          {/* Key Parameters 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Amount</span>
              <span className="text-base font-extrabold text-white">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Type</span>
              <span className="text-xs font-bold text-cyan-300 truncate block mt-0.5">{type}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Risk Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-base font-black ${
                  riskScore >= 71 ? "text-rose-400" : riskScore >= 31 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {riskScore}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">/100 ({riskScore >= 71 ? "HIGH" : riskScore >= 31 ? "MEDIUM" : "LOW"})</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Rules Fired</span>
              <span className="text-base font-extrabold text-amber-300">{rulesTriggered.length} Rules</span>
            </div>
          </div>

          {/* Recipient Details & Sub-Risk Matrix */}
          <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Recipient VPA:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                  {recipient}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badgeBg}`}>
                DECISION: {decision}
              </span>
            </div>

            {/* Sub-Risk Matrix (Section 10) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ML Probability</span>
                <strong className="text-indigo-400 font-mono">{mlRiskPercent}%</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Device Risk</span>
                <strong className={deviceRisk === "HIGH" ? "text-rose-400" : deviceRisk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}>
                  {deviceRisk}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Network Risk</span>
                <strong className={networkRisk === "HIGH" ? "text-rose-400" : networkRisk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}>
                  {networkRisk}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Recipient Risk</span>
                <strong className={recipientRisk === "HIGH" ? "text-rose-400" : recipientRisk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}>
                  {recipientRisk}
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 6: VALIDATION ENGINE BADGE */}
          <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {validations.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-bold text-white">
                Validation Engine: {validations.passed ? "VALIDATIONS PASSED" : "VALIDATION WARNING"}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {validations.checks.filter(c => c.ok).length} of {validations.checks.length} pre-checks cleared
            </span>
          </div>

          {/* Simple Explanation View for Normal Users (Section 11 & Section 30) */}
          <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                Why this recommendation? (Explainable AI)
              </h4>
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{showTechnicalDetails ? "Hide Technical Details" : "View Security Details"}</span>
                {showTechnicalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {explainableAiFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-white">{factor.factor}:</span>{" "}
                    <span>{factor.humanReason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details Tabs (Rules Triggered, Prebuilt ML Features, Audit Trail) */}
          <AnimatePresence>
            {showTechnicalDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                {/* Tab switcher */}
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("decision")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === "decision" ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Triggered Rules ({rulesTriggered.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("audit")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === "audit" ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Audit Trail (Microseconds)
                  </button>
                </div>

                {/* Sub-view: Triggered Rules */}
                {activeTab === "decision" && (
                  <div className="space-y-2">
                    {rulesTriggered.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No anomaly rules triggered for this baseline transaction.</p>
                    ) : (
                      rulesTriggered.map((rule, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <div>
                              <strong className="font-mono text-cyan-300 block">{rule.code}</strong>
                              <span className="text-slate-300 text-[11px]">{rule.description}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            rule.severity === "CRITICAL" ? "bg-rose-500/20 text-rose-300"
                            : rule.severity === "HIGH" ? "bg-orange-500/20 text-orange-300"
                            : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {rule.severity}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-view: Audit Trail (Section 17) */}
                {activeTab === "audit" && (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {auditTrail.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-slate-850">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{item.time}</span>
                          <span className="text-slate-200">{item.step}</span>
                        </div>
                        <span className="text-cyan-400 text-[10px]">+{item.latencyMs}ms</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Action Footer (Section 10 buttons) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {isBlocked ? (
              <span className="text-rose-400 font-bold">⚠️ High risk policy blocks this transfer to protect your funds.</span>
            ) : isReferred ? (
              <span className="text-amber-400 font-bold">Review beneficiary credentials or escalate to AI forensics.</span>
            ) : (
              <span className="text-emerald-400 font-bold">Pre-check cleared. Proceed to secure PIN authorization.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel Payment
            </button>

            {isReferred && onOpenInvestigation && (
              <button
                type="button"
                onClick={() => onOpenInvestigation(transactionId)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-colors cursor-pointer"
              >
                Review Details & AI Case
              </button>
            )}

            {!isBlocked && (
              <button
                type="button"
                onClick={onProceedToPin}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enter UPI PIN (₹{amount.toLocaleString("en-IN")})</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
