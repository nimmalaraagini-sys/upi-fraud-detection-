import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert, Smartphone, CreditCard, Radio, Users,
  AlertTriangle, ArrowRight, Play, CheckCircle2, X,
  Clock, Activity, AlertOctagon, HelpCircle, Lock,
  RefreshCw, TrendingUp, Info, Shield, Layers, Ban
} from "lucide-react";

export type AttackPatternType = 
  | "ACCOUNT_TAKEOVER" 
  | "WALLET_CREDIT_ABUSE" 
  | "SIM_SWAP_CASHOUT" 
  | "AGENT_RECIPIENT_COLLUSION";

export interface AttackPatternDetail {
  id: AttackPatternType;
  title: string;
  badge: string;
  icon: typeof ShieldAlert;
  color: string;
  accentBorder: string;
  summary: string;
  keySignals: string[];
  concreteScenario: {
    title: string;
    flow: string[];
    telemetry: { label: string; value: string; status: "warn" | "fail" | "ok" }[];
    simulatedTransaction: {
      type: string;
      amount: number;
      recipient: string;
      riskScore: number;
      decision: "REFER" | "DECLINE" | "ACCEPT";
    };
  };
  detectionLogic: string;
  mitigationAction: string;
  regulatoryGuidance: string;
}

export const ATTACK_PATTERNS: AttackPatternDetail[] = [
  {
    id: "ACCOUNT_TAKEOVER",
    title: "1. Account Takeover (ATO)",
    badge: "Credential Compromise",
    icon: Smartphone,
    color: "from-rose-500/20 to-orange-500/20",
    accentBorder: "border-rose-500/40",
    summary: "Detects unauthorized takeover when credentials or PIN are reset, followed immediately by binding to an untrusted device hardware token and executing high-value liquidation.",
    keySignals: [
      "New device hardware fingerprint enrolled < 24 hours ago",
      "UPI PIN / security credential reset event recorded",
      "Sudden high-value transfer (5× to 10× user's habitual monthly average)",
      "Unfamiliar recipient added with zero historical transactions",
      "Abnormal transaction velocity (multiple rapid queries before transfer)"
    ],
    concreteScenario: {
      title: "Compromised Device Token & Immediate ₹75,000 Drain",
      flow: [
        "Victim clicks a fake utility bill phishing APK",
        "Attacker initiates UPI PIN reset using OTP intercepted via SMS listener",
        "Attacker enrolls their own phone hardware token",
        "Attempts instant ₹75,000 P2P transfer to mule account"
      ],
      telemetry: [
        { label: "Hardware Enclave Signature", value: "New Hardware ID (Mismatch)", status: "fail" },
        { label: "PIN Reset Elapsed Time", value: "14 minutes ago", status: "fail" },
        { label: "Historical Baseline", value: "Avg ₹3,200 (Spike: ₹75,000)", status: "warn" },
        { label: "Geo-IP Anomaly", value: "Hyderabad -> Jamtara (1,200 km jump)", status: "fail" }
      ],
      simulatedTransaction: {
        type: "P2P Transfer",
        amount: 75000,
        recipient: "clearing.drain99@ybl",
        riskScore: 94,
        decision: "DECLINE"
      }
    },
    detectionLogic: "Composite boolean trigger: `NEW_DEVICE && CREDENTIAL_RESET_WINDOW_LT_48H && AMOUNT_GT_BASELINE_3X`. Forces an automatic pause and mandatory face biometric challenge.",
    mitigationAction: "PAUSE / REFER: Temporary 4-hour cooling freeze on outbound debits, SMS alert dispatched to registered number, mandatory biometric re-verification.",
    regulatoryGuidance: "Complies with RBI Circular on Digital Payment Security Controls (Section 4.2 - Enhanced Authentication for Device Re-binding)."
  },
  {
    id: "WALLET_CREDIT_ABUSE",
    title: "2. Wallet Credit Abuse & Rapid Cash-Out",
    badge: "Stolen Fund Layering",
    icon: CreditCard,
    color: "from-amber-500/20 to-orange-500/20",
    accentBorder: "border-amber-500/40",
    summary: "Catches money-mule laundering loops where prepaid wallets or UPI credit lines receive sudden high-value deposits followed immediately by total cash-out liquidation.",
    keySignals: [
      "Sudden large wallet credit (e.g. ₹50,000) from an unverified source",
      "Rapid cash-out attempt (e.g. ₹48,000) within 180 seconds of credit",
      "Abnormal velocity: Wallet dormancy broken by 100% balance withdrawal",
      "Repeated credit / cash-out cycle pattern across linked accounts",
      "Zero merchant or utility spend; wallet utilized purely as a pass-through transit conduit"
    ],
    concreteScenario: {
      title: "₹50,000 Inbound Credit Followed by ₹48,000 Immediate Cash-Out",
      flow: [
        "Mule account receives ₹50,000 credit from a fraud victim",
        "Balance stays in wallet for only 42 seconds",
        "User requests immediate ₹48,000 Cash-Out to a third-party non-KYC account",
        "Attempts to leave remaining ₹2,000 to fly under complete zero-balance sweeps"
      ],
      telemetry: [
        { label: "Wallet Holding Duration", value: "42 seconds", status: "fail" },
        { label: "Inbound Credit Amount", value: "₹50,000", status: "warn" },
        { label: "Outbound Cash-Out Amount", value: "₹48,000 (96% liquidation)", status: "fail" },
        { label: "Merchant Spend Ratio", value: "0.0% (Zero utility)", status: "warn" }
      ],
      simulatedTransaction: {
        type: "Cash-Out",
        amount: 48000,
        recipient: "crypto.p2p.cashout@paytm",
        riskScore: 89,
        decision: "REFER"
      }
    },
    detectionLogic: "Velocity decay function: `TIME_SINCE_WALLET_CREDIT < 300s && CASHOUT_RATIO > 0.85`. Triggers automated lock until source fund origin is cryptographically reconciled.",
    mitigationAction: "HOLD PAYMENT: Enforces mandatory 30-minute anti-layering holding escrow on funds originating from first-time inbound UPI transfers.",
    regulatoryGuidance: "Master Direction on PPIs (Prepaid Payment Instruments) - Mandatory anti-money laundering monitoring on cash-out velocity."
  },
  {
    id: "SIM_SWAP_CASHOUT",
    title: "3. SIM-Swap Risk & Telecom Anomaly",
    badge: "Telco Vulnerability",
    icon: Radio,
    color: "from-purple-500/20 to-indigo-500/20",
    accentBorder: "border-purple-500/40",
    summary: "Flags transactions originating shortly after an authorized telco SIM-swap or IMSI change event, preventing scammers with cloned numbers from draining bank accounts.",
    keySignals: [
      "Simulated SIM-swap security event indicator (IMSI / ICCID rotation)",
      "Re-registration on a different cellular base-band transceiver",
      "Rapid high-value transaction executed within 6 hours of SIM activation",
      "Unusual recipient outside the user's historical contact graph",
      "Simultaneous attempts to block victim's incoming alert calls"
    ],
    concreteScenario: {
      title: "IMSI Serial Rotation Followed by Immediate ₹30,000 Transfer",
      flow: [
        "Criminal executes fraudulent SIM swap at a local telecom kiosk",
        "Victim's phone loses cellular signal (No Service)",
        "Criminal activates UPI app on cloned SIM",
        "Attempts immediate ₹30,000 transfer before victim contacts bank"
      ],
      telemetry: [
        { label: "SIM IMSI Status", value: "Changed 3 hours ago (Simulated)", status: "fail" },
        { label: "Network Carrier", value: "Airtel 5G (New Cell Tower ID)", status: "warn" },
        { label: "Outbound Transaction Velocity", value: "First transfer post-swap", status: "fail" },
        { label: "Device Binding Token", value: "Revoked prior token", status: "warn" }
      ],
      simulatedTransaction: {
        type: "Bank Transfer",
        amount: 30000,
        recipient: "mule_gold_trader@icici",
        riskScore: 91,
        decision: "DECLINE"
      }
    },
    detectionLogic: "Telco signal sync: `SIM_SWAP_AGE < 48H && FIRST_TRANSACTION_FLAG == TRUE`. *Prototype notice: Simulated signals in demo mode; production requires authorized telecom provider API integration.*",
    mitigationAction: "BLOCK & FREEZE: Immediate 48-hour cooling period for financial debits following any SIM-swap signal. Mandatory in-branch or video KYC to unlock.",
    regulatoryGuidance: "DoT & RBI Joint Advisory on Telecom SIM-Swap Frauds in Digital Banking."
  },
  {
    id: "AGENT_RECIPIENT_COLLUSION",
    title: "4. Agent / Recipient Collusion",
    badge: "Syndicate Network",
    icon: Users,
    color: "from-cyan-500/20 to-blue-500/20",
    accentBorder: "border-cyan-500/40",
    summary: "Graph relationship engine identifying circular transaction patterns, funneling clusters, and suspicious syndicates between multiple users, agents, and common mule recipients.",
    keySignals: [
      "Multiple distinct user accounts transferring funds to the same suspicious recipient",
      "Unusual agent transaction velocity exceeding normal footfall capacity",
      "Circular transaction loops (User A -> Agent B -> User C -> User A)",
      "Shared device hardware fingerprints across nominally independent accounts",
      "Geographic clustering of fraud complaints centered around a single agent terminal"
    ],
    concreteScenario: {
      title: "Funneling Cluster: 3 Distinct Users Funneling to Single Mule Recipient X",
      flow: [
        "User A (Student) sends ₹9,500 to Recipient X",
        "User B (Merchant) sends ₹14,000 to Recipient X within 12 minutes",
        "User C (Senior Citizen) sends ₹22,000 to Recipient X",
        "Recipient X executes immediate ATM cashout or offshore crypto bridge"
      ],
      telemetry: [
        { label: "Graph In-Degree Anomaly", value: "3 unrelated senders in 20 mins", status: "fail" },
        { label: "Relationship Link Strength", value: "Zero prior mutual interactions", status: "warn" },
        { label: "Shared Wi-Fi BSSID", value: "Matched cybercafe IP subnet", status: "fail" },
        { label: "Recipient Complaint Count", value: "4 active NCRP 1930 flags", status: "fail" }
      ],
      simulatedTransaction: {
        type: "P2P Transfer",
        amount: 22000,
        recipient: "recipient_x_syndicate@axis",
        riskScore: 96,
        decision: "DECLINE"
      }
    },
    detectionLogic: "Multi-party graph clustering: `IN_DEGREE_SPIKE > 5 && ENTITY_ENTROPY < 0.2`. Flags as: *'Potentially suspicious relationship pattern detected'* (maintains non-defamatory compliance standards).",
    mitigationAction: "SYSTEMIC FREEZE: Escalates entire entity cluster to the AI Fraud Investigation Case Center; places destination VPA into centralized 1930 quarantine.",
    regulatoryGuidance: "FIU-IND Anti-Money Laundering Red Flag Indicators for Mule Account Networks."
  }
];

interface FourMajorAttackPatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePattern: (pattern: AttackPatternDetail) => void;
}

export const FourMajorAttackPatternsModal: React.FC<FourMajorAttackPatternsModalProps> = ({
  isOpen,
  onClose,
  onSimulatePattern
}) => {
  const [selectedPattern, setSelectedPattern] = useState<AttackPatternDetail>(ATTACK_PATTERNS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Four Major Mobile Money Attack Patterns
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 3 & 26 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specialized real-time detection modules addressing the primary vectors of digital payment financial crime.
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

        {/* 4 Cards Grid at the Top */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {ATTACK_PATTERNS.map((pattern) => {
            const isSelected = selectedPattern.id === pattern.id;
            const IconComponent = pattern.icon;
            return (
              <div
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                  isSelected
                    ? `bg-gradient-to-br ${pattern.color} ${pattern.accentBorder} shadow-lg ring-1 ring-white/20`
                    : "bg-slate-850/70 border-slate-800 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComponent className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-200">
                    {pattern.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  {pattern.title.replace(/^\d+\.\s*/, "")}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {pattern.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspection Body of Selected Pattern */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[55vh] scrollbar-thin">
          
          {/* Title & High-Level Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-850/90 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  {selectedPattern.title}
                </h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {selectedPattern.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {selectedPattern.summary}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSimulatePattern(selectedPattern)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-cyan-950 flex items-center gap-2 shrink-0 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulate Attack in Interception Engine</span>
            </button>
          </div>

          {/* Concrete Attack Flow & Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Left: Step-by-Step Scenario */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block font-mono">
                Real-World Attack Sequence:
              </span>
              <strong className="text-white text-xs block font-semibold">
                {selectedPattern.concreteScenario.title}
              </strong>
              <div className="space-y-1.5 pt-1">
                {selectedPattern.concreteScenario.flow.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sensor Telemetry Signals */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block font-mono">
                Sensor & Network Telemetry Captured:
              </span>
              <div className="space-y-1.5 pt-1">
                {selectedPattern.concreteScenario.telemetry.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-850/80 border border-slate-800">
                    <span className="text-slate-300 font-medium">{t.label}</span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.status === "fail" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : t.status === "warn" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {t.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Collusion Graph Visualization (If AGENT_RECIPIENT_COLLUSION is selected) */}
          {selectedPattern.id === "AGENT_RECIPIENT_COLLUSION" && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  Graph Relationship Visualizer (Funneling Cluster):
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  "Potentially suspicious relationship pattern detected"
                </span>
              </div>

              {/* Graphic Flow SVG */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 500 130" className="w-full max-w-lg h-28 overflow-visible">
                  {/* Senders */}
                  <g transform="translate(40, 20)">
                    <rect width="90" height="24" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="45" y="16" fill="#f8fafc" fontSize="10" textAnchor="middle" fontWeight="bold">User A (₹9.5k)</text>
                  </g>
                  <g transform="translate(40, 55)">
                    <rect width="90" height="24" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="45" y="16" fill="#f8fafc" fontSize="10" textAnchor="middle" fontWeight="bold">User B (₹14k)</text>
                  </g>
                  <g transform="translate(40, 90)">
                    <rect width="90" height="24" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="45" y="16" fill="#f8fafc" fontSize="10" textAnchor="middle" fontWeight="bold">User C (₹22k)</text>
                  </g>

                  {/* Connecting Lines */}
                  <path d="M 130 32 L 230 65" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 130 67 L 230 67" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 130 102 L 230 69" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Recipient X (Hub Mule) */}
                  <g transform="translate(230, 45)">
                    <rect width="115" height="42" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                    <text x="57" y="18" fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">Recipient X</text>
                    <text x="57" y="32" fill="#fda4af" fontSize="9" textAnchor="middle" fontFamily="monospace">Syndicate Mule</text>
                  </g>

                  {/* Outbound Arrow to Cashout */}
                  <path d="M 345 66 L 410 66" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow)" />

                  {/* Off-ramp */}
                  <g transform="translate(410, 48)">
                    <rect width="80" height="36" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                    <text x="40" y="16" fill="#e0e7ff" fontSize="9" textAnchor="middle" fontWeight="bold">ATM Cashout</text>
                    <text x="40" y="28" fill="#a5b4fc" fontSize="8" textAnchor="middle">/ Crypto Bridge</text>
                  </g>
                </svg>
              </div>
            </div>
          )}

          {/* Detection Logic & Regulatory Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-cyan-400 block text-[11px] font-bold">
                ⚙️ Algorithmic Detection Logic:
              </strong>
              <p className="text-[11px] text-slate-300 leading-snug font-mono bg-slate-950 p-2 rounded-xl border border-slate-800">
                {selectedPattern.detectionLogic}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-emerald-400 block text-[11px] font-bold">
                🛡️ Recommended Mitigation Action:
              </strong>
              <p className="text-[11px] text-slate-300 leading-snug">
                {selectedPattern.mitigationAction}
              </p>
              <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                <strong>Standard:</strong> {selectedPattern.regulatoryGuidance}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            SECURE SHIELD · Active Intelligence Defense Matrix
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
