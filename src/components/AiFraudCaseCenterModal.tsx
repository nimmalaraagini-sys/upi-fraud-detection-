import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, ShieldAlert, Sparkles, CheckCircle2, Clock,
  AlertTriangle, ArrowRight, UserCheck, Search, Filter,
  Share2, Copy, Check, Download, AlertOctagon, HelpCircle,
  FolderOpen, MessageSquare, Bot, X
} from "lucide-react";

export type CaseStatus = "OPEN" | "UNDER REVIEW" | "REFERRED" | "RESOLVED" | "CLOSED";

export interface FraudCaseItem {
  caseId: string;
  user: string;
  transactionId: string;
  amount: number;
  riskScore: number;
  attackPattern: string;
  evidence: string[];
  timeline: { time: string; event: string }[];
  relatedTransactions: string[];
  riskFactors: string[];
  investigationStatus: CaseStatus;
  resolutionStatus: string;
  isEligibleForAutoClosure?: boolean;
}

export const SAMPLE_FRAUD_CASES: FraudCaseItem[] = [
  {
    caseId: "CASE-2026-9041",
    user: "Rahul Sharma",
    transactionId: "TXN-884910",
    amount: 45000,
    riskScore: 92,
    attackPattern: "Account Takeover + Rapid Liquidation",
    evidence: [
      "Hardware device token changed 14 mins prior to checkout",
      "SMS OTP credential reset logged on unknown handset",
      "Immediate outbound transfer to newly created VPA",
      "Session IP resolved to proxy node in Eastern Europe"
    ],
    timeline: [
      { time: "10:14:02 AM", event: "SMS OTP generated for credential reset" },
      { time: "10:15:18 AM", event: "New hardware fingerprint enrolled (OnePlus -> Unknown Linux)" },
      { time: "10:28:44 AM", event: "Transfer request ₹45,000 to supreme_court_bail@sbi" },
      { time: "10:28:45 AM", event: "SafeUPI Interception Point triggered -> Decision: DECLINE" }
    ],
    relatedTransactions: ["TXN-884908 (₹1 Test query)", "TXN-884905 (Balance enquiry)"],
    riskFactors: ["NEW_DEVICE", "UNUSUAL_AMOUNT_10X", "CREDENTIAL_RESET_WINDOW", "SUSPICIOUS_KEYWORD"],
    investigationStatus: "UNDER REVIEW",
    resolutionStatus: "Outbound funds held in temporary lien; victim contacted via registered telephony.",
    isEligibleForAutoClosure: false
  },
  {
    caseId: "CASE-2026-9042",
    user: "Sunita Reddy",
    transactionId: "TXN-719302",
    amount: 48000,
    riskScore: 88,
    attackPattern: "Wallet Credit Abuse (Layering Conduit)",
    evidence: [
      "Wallet received ₹50,000 inbound deposit from unverified entity",
      "Outbound cashout of ₹48,000 initiated after 42 seconds",
      "Zero historical utility or merchant payment track record"
    ],
    timeline: [
      { time: "02:11:10 PM", event: "Inbound UPI credit ₹50,000 received" },
      { time: "02:11:52 PM", event: "Cashout intent ₹48,000 dispatched to non-KYC account" },
      { time: "02:11:53 PM", event: "SafeUPI Velocity Decay trigger -> Decision: REFER" }
    ],
    relatedTransactions: ["TXN-719300 (Inbound deposit ₹50,000)"],
    riskFactors: ["WALLET_CREDIT_ABUSE", "RAPID_CASHOUT_42S", "ZERO_MERCHANT_RATIO"],
    investigationStatus: "OPEN",
    resolutionStatus: "Nodal officer review requested; holding period active.",
    isEligibleForAutoClosure: false
  },
  {
    caseId: "CASE-2026-9043",
    user: "Vikram Malhotra",
    transactionId: "TXN-610283",
    amount: 1450,
    riskScore: 24,
    attackPattern: "Benign Routine Transaction (False Positive Review)",
    evidence: [
      "User paid trusted grocery merchant on regular commute route",
      "Hardware token matched 2-year established profile",
      "Amount within 1-sigma standard deviation"
    ],
    timeline: [
      { time: "08:30:12 AM", event: "QR scanned at Apollo Pharmacy" },
      { time: "08:30:13 AM", event: "SafeUPI Interception Point cleared -> Decision: ACCEPT" }
    ],
    relatedTransactions: ["TXN-590122 (Prior weekly refill)"],
    riskFactors: ["ESTABLISHED_PAYEE", "NORMAL_VELOCITY"],
    investigationStatus: "RESOLVED",
    resolutionStatus: "Cleared by automated rule engine with zero consumer friction.",
    isEligibleForAutoClosure: true
  }
];

export const AiFraudCaseCenterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialTxnId?: string;
}> = ({ isOpen, onClose, initialTxnId }) => {
  const [cases, setCases] = useState<FraudCaseItem[]>(SAMPLE_FRAUD_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialTxnId ? (cases.find(c => c.transactionId === initialTxnId)?.caseId || cases[0].caseId) : cases[0].caseId
  );
  const [activeTab, setActiveTab] = useState<"cases" | "investigator" | "compliance">("cases");
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  if (!isOpen) return null;

  const currentCase = cases.find(c => c.caseId === selectedCaseId) || cases[0];

  const handleUpdateStatus = (newStatus: CaseStatus) => {
    setCases(prev => prev.map(c => c.caseId === currentCase.caseId ? { ...c, investigationStatus: newStatus } : c));
  };

  const complianceDraftText = `================================================================================
COMPLIANCE DRAFT — HUMAN REVIEW REQUIRED
CONFIDENTIAL / NOT FOR AUTOMATED REGULATORY TRANSMISSION
================================================================================
REPORTING ENTITY: SafeUPI Smart Interception Core (Prototype)
INCIDENT REFERENCE ID: ${currentCase.caseId}
TRANSACTION IDENTIFIER: ${currentCase.transactionId}
DATE & TIMESTAMP: ${new Date().toISOString()}

1. SUBJECT PARTICULARS:
   - Primary Account Holder: ${currentCase.user}
   - Disputed Amount: INR ${currentCase.amount.toLocaleString("en-IN")}
   - Evaluated Risk Score: ${currentCase.riskScore}/100

2. SUSPICIOUS PATTERN CLASSIFICATION:
   - Primary Threat Vector: ${currentCase.attackPattern}
   - Algorithmic Flags: ${currentCase.riskFactors.join(", ")}

3. INVESTIGATIVE SUMMARY & NARRATIVE:
   On ${currentCase.timeline[0]?.time || "the reported date"}, the automated SafeUPI risk engine intercepted an outbound transaction request of INR ${currentCase.amount.toLocaleString("en-IN")}. Digital evidence indicates: ${currentCase.evidence.join("; ")}.

4. ACTIONS TAKEN & INTERVENTION STATUS:
   Current Disposition: ${currentCase.investigationStatus}
   Remediation: ${currentCase.resolutionStatus}

5. COMPLIANCE REVIEWER SIGN-OFF:
   [ ] Investigating Officer Review Completed
   [ ] Evidence Locker Integrity Verified
   [ ] Approved for Escalation to Nodal Authority / FIU STR Docket
   
DISCLAIMER: This document is an AI-assisted investigative draft prepared for internal human review. It does NOT constitute an official statutory filing with law enforcement or regulatory bodies without explicit compliance officer authorization.
================================================================================`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(complianceDraftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Fraud Case Center & AI Investigator
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 12, 13, 14, 15 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end case tracking, AI-assisted timelines, compliance drafts (SAR/STR), and low-risk closure automation.
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("cases")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "cases" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Case Management ({cases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("investigator")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "investigator" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Fraud Investigator Copilot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("compliance")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "compliance" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Compliance Drafts (STR / SAR)</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
          
          {/* TAB 1: CASE MANAGEMENT */}
          {activeTab === "cases" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Cases List Sidebar */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Select Incident Case:
                </span>
                {cases.map((c) => {
                  const isSel = c.caseId === currentCase.caseId;
                  return (
                    <div
                      key={c.caseId}
                      onClick={() => setSelectedCaseId(c.caseId)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 text-left ${
                        isSel
                          ? "bg-slate-800 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30"
                          : "bg-slate-850/60 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-300">{c.caseId}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          c.investigationStatus === "OPEN" ? "bg-rose-500/20 text-rose-300"
                          : c.investigationStatus === "UNDER REVIEW" ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                        }`}>
                          {c.investigationStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{c.user}</span>
                        <strong className="text-slate-200">₹{c.amount.toLocaleString("en-IN")}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{c.attackPattern}</span>
                    </div>
                  );
                })}
              </div>

              {/* Case Details View */}
              <div className="md:col-span-2 space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white">{currentCase.caseId}</h3>
                        <span className="font-mono text-xs text-slate-400">Txn: {currentCase.transactionId}</span>
                      </div>
                      <span className="text-xs text-indigo-400 font-semibold">{currentCase.attackPattern}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Status:</span>
                      <select
                        value={currentCase.investigationStatus}
                        onChange={(e) => handleUpdateStatus(e.target.value as CaseStatus)}
                        className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-xl px-2.5 py-1 text-white cursor-pointer"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="UNDER REVIEW">UNDER REVIEW</option>
                        <option value="REFERRED">REFERRED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  {/* Low Risk Automation Pill (Section 15) */}
                  {currentCase.isEligibleForAutoClosure && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ELIGIBLE FOR AUTOMATED CLOSURE REVIEW
                      </span>
                      <span className="text-[10px] text-slate-400">Low risk + 0 active alerts</span>
                    </div>
                  )}

                  {/* Evidence Items */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Digital Evidence Locker:</span>
                    <div className="space-y-1">
                      {currentCase.evidence.map((ev, i) => (
                        <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Incident Chronology Timeline:</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {currentCase.timeline.map((step, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-slate-850">
                          <span className="text-slate-400">{step.time}</span>
                          <span className="text-slate-200">{step.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI FRAUD INVESTIGATOR COPILOT */}
          {activeTab === "investigator" && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-between text-xs text-purple-200">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>AI Investigator Directive:</strong> Assists forensic analysts in building case narratives, linking related entities, and prioritizing reviews. AI outputs are non-binding and human-reviewable.</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Automated Forensic Analysis for {currentCase.caseId}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setAiGenerating(true);
                      setTimeout(() => setAiGenerating(false), 900);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiGenerating ? "Synthesizing Evidence..." : "Regenerate AI Narrative"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-cyan-400 font-mono">1. Forensic Summary:</strong>{" "}
                    The transaction was triggered following a rapid re-binding of hardware token credentials within a 14-minute window. An unfamiliar device fingerprint paired with a 10× deviation from average monthly spending suggests high probability of credential takeover.
                  </p>
                  <p>
                    <strong className="text-amber-400 font-mono">2. Correlated Entities:</strong>{" "}
                    Two prior non-financial telemetry queries ({currentCase.relatedTransactions.join(", ")}) occurred in rapid succession, which is a recognized signature of automated balance harvesting scripts.
                  </p>
                  <p>
                    <strong className="text-emerald-400 font-mono">3. Recommended Action:</strong>{" "}
                    Maintain debit lien on beneficiary account under Section 102 CrPC, alert originating branch nodal officer, and dispatch verified SMS challenge to genuine registered telephone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI COMPLIANCE DRAFTS (SECTION 14) */}
          {activeTab === "compliance" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  COMPLIANCE DRAFT — HUMAN REVIEW REQUIRED (Never automatically filed)
                </span>
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDraft ? "Copied to Clipboard" : "Copy STR / SAR Narrative"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-80 scrollbar-thin leading-relaxed">
                {complianceDraftText}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Audit Ready · PII Protected · Zero-Fabrication Evidence Chain
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
