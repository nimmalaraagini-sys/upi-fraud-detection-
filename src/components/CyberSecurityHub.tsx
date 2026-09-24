import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Wifi,
  Radio,
  Clock,
  Activity,
  Layers,
  FileCheck,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  CreditCard,
  Building,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  UserCheck,
  Share2,
  FileText,
  DollarSign,
  TrendingUp,
  Cpu,
  RefreshCw,
  Search,
  Eye,
  Sliders,
  Copy,
  Check
} from "lucide-react";
import { SupportedLang } from "../utils/translations";

interface CyberSecurityHubProps {
  user: {
    name: string;
    mobile: string;
    email: string;
  };
  currentLang: SupportedLang;
  onNavigateToPay?: () => void;
  onNavigateToRecovery?: () => void;
  onTriggerDemoScenario?: (scenarioNum: 1 | 2 | 3 | 4) => void;
}

export type SecurityHubSection = 
  | "overview" 
  | "network_mitm" 
  | "device_mac" 
  | "timestamp_analysis" 
  | "relationship_graph" 
  | "read_write_audit" 
  | "identity_aadhaar" 
  | "bank_profile" 
  | "check_anything" 
  | "regulatory_cbdc" 
  | "admin_ops";

export const CyberSecurityHub: React.FC<CyberSecurityHubProps> = ({
  user,
  currentLang,
  onNavigateToPay,
  onNavigateToRecovery,
  onTriggerDemoScenario
}) => {
  const [activeSection, setActiveSection] = useState<SecurityHubSection>("overview");

  // Emergency Lock State (Requirement 25)
  const [isEmergencyLockActive, setIsEmergencyLockActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem("safeupi_emergency_lock") === "true";
    } catch {
      return false;
    }
  });

  const toggleEmergencyLock = () => {
    const newState = !isEmergencyLockActive;
    setIsEmergencyLockActive(newState);
    try {
      localStorage.setItem("safeupi_emergency_lock", String(newState));
    } catch (e) {
      console.warn("Storage lock save error", e);
    }
  };

  // MITM Anomaly Simulation State (Requirement 6)
  const [mitmSimState, setMitmSimState] = useState<"IDLE" | "MONITORING" | "ALERT">("IDLE");
  const [mitmDetailsShown, setMitmDetailsShown] = useState<boolean>(false);

  // Device Security State (Requirement 7)
  const [deviceSecurityScore, setDeviceSecurityScore] = useState<number>(82);

  // Bank accounts state (Requirement 2)
  const [primaryBankId, setPrimaryBankId] = useState<string>("bank-1");
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: "bank-1",
      bankName: "HDFC Bank Ltd",
      accountNumber: "XXXX XXXX 4521",
      ifsc: "HDFC0001234",
      vpa: `${user.mobile ? user.mobile.replace(/\D/g, "") : "9876543210"}@okhdfcbank`,
      status: "Verified",
      isPrimary: true,
      dailyLimit: "₹1,00,000",
      securityTier: "High (Zero-PII Tokenized)"
    },
    {
      id: "bank-2",
      bankName: "State Bank of India",
      accountNumber: "XXXX XXXX 8904",
      ifsc: "SBIN0004512",
      vpa: `${user.name.toLowerCase().replace(/\s+/g, ".")}@oksbi`,
      status: "Verified",
      isPrimary: false,
      dailyLimit: "₹50,000",
      securityTier: "Standard Bio-Protected"
    }
  ]);

  const [newBankModalOpen, setNewBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState("ICICI Bank");
  const [newBankAcc, setNewBankAcc] = useState("XXXX XXXX 3390");

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `bank-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newBankAcc,
      ifsc: `${newBankName.slice(0, 4).toUpperCase()}0009988`,
      vpa: `${user.name.toLowerCase().replace(/\s+/g, "")}${Math.floor(10 + Math.random() * 90)}@upi`,
      status: "Verified",
      isPrimary: false,
      dailyLimit: "₹25,000",
      securityTier: "Protected"
    };
    setBankAccounts([...bankAccounts, newEntry]);
    setNewBankModalOpen(false);
  };

  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState([
    { id: "ben-1", name: "Rahul Sharma (Brother)", vpa: "rahul.sharma@okaxis", bank: "Axis Bank", verified: true, addedDaysAgo: 140 },
    { id: "ben-2", name: "Swiggy Orders", vpa: "swiggy.orders@icici", bank: "ICICI Merchant", verified: true, addedDaysAgo: 45 },
    { id: "ben-3", name: "Unknown Merchant KYC", vpa: "urgent.refund.kyc@paytm", bank: "Paytm Payments Bank", verified: false, addedDaysAgo: 1 }
  ]);

  // Check Anything unified feature (Requirement 26)
  const [checkAnythingType, setCheckAnythingType] = useState<"vpa" | "qr" | "screenshot" | "sms" | "payment_request">("vpa");
  const [checkQuery, setCheckQuery] = useState("");
  const [checkResult, setCheckResult] = useState<{
    status: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
    score: number;
    title: string;
    explanation: string;
    indicators: string[];
  } | null>(null);

  const handleCheckAnything = () => {
    if (!checkQuery.trim()) return;
    const lower = checkQuery.toLowerCase();

    if (lower.includes("kyc") || lower.includes("refund") || lower.includes("lottery") || lower.includes("win") || lower.includes("police")) {
      setCheckResult({
        status: "HIGH_RISK",
        score: 91,
        title: "High Risk Cyber Scam Indicator",
        explanation: "Contains high-danger keyword matching known impersonation campaigns and urgent collect requests.",
        indicators: [
          "Impersonation keyword detected ('KYC' / 'Refund' / 'Police')",
          "Recipient VPA has no authorized merchant certification",
          "Blacklisted pattern flagged in National Cyber 1930 NCRP database"
        ]
      });
    } else if (lower.includes("olx") || lower.includes("advance") || lower.includes("deposit")) {
      setCheckResult({
        status: "SUSPICIOUS",
        score: 64,
        title: "Suspicious Payment Request",
        explanation: "Advance deposit request for unverified marketplace transaction. Exercise extreme caution.",
        indicators: [
          "Unverified individual payee account created recently",
          "Potential advance-fee marketplace trap",
          "No verified business GSTIN or legal entity profile"
        ]
      });
    } else {
      setCheckResult({
        status: "SAFE",
        score: 14,
        title: "Safe & Verified Recipient Profile",
        explanation: "Verified payee handle with authentic reputation, valid domain handle, and no historical fraud complaints.",
        indicators: [
          "Payee handle format is legitimate NPCI PSP compliant",
          "Clean historical reputation with zero fraud complaints",
          "Recipient banking entity verified"
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* EMERGENCY LOCK BANNER (Requirement 25) */}
      {/* ========================================================= */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
        isEmergencyLockActive 
          ? "bg-rose-950/90 border-rose-500 text-rose-100 shadow-xl shadow-rose-950/50" 
          : "bg-slate-900 border-slate-800 text-slate-300"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isEmergencyLockActive 
                ? "bg-rose-600 text-white animate-pulse" 
                : "bg-slate-800 text-slate-300 border border-slate-700"
            }`}>
              {isEmergencyLockActive ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isEmergencyLockActive ? "EMERGENCY LOCK IS ACTIVE" : "EMERGENCY PROTECTION LOCK"}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isEmergencyLockActive ? "bg-rose-500 text-white" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {isEmergencyLockActive ? "LOCKED" : "READY"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isEmergencyLockActive
                  ? "All outgoing payments in the prototype are paused. Recent transactions are secured. Official reporting and evidence lockers are primed."
                  : "Activate instant lockdown if your phone is compromised, screen-sharing apps are detected, or you suspect unauthorized transactions."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleEmergencyLock}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                isEmergencyLockActive
                  ? "bg-white text-rose-950 hover:bg-slate-100"
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
              }`}
            >
              {isEmergencyLockActive ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Deactivate Lock</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>ACTIVATE EMERGENCY LOCK</span>
                </>
              )}
            </button>
            {isEmergencyLockActive && onNavigateToRecovery && (
              <button
                type="button"
                onClick={onNavigateToRecovery}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Open Recovery Center
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 DEMO SCENARIOS BAR (Requirement 38) */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#101b38] to-[#14234b] border border-cyan-500/30 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                Requirement 38: Live Evaluation
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Four Official Demo Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Click any scenario to simulate the full SafeUPI pipeline (Rule Engine + ML Engine + Network Check).
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono self-start md:self-auto">
            SafeUPI Prototype Risk Model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          
          {/* Scenario 1 */}
          <div
            onClick={() => onTriggerDemoScenario ? onTriggerDemoScenario(1) : null}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-emerald-400 uppercase text-[10px]">Scenario 1</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Risk: 18/100
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">SAFE PAYMENT</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ₹450 Groceries / Swiggy orders. Verified merchant handle & trusted history.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-semibold group-hover:text-emerald-300">
              <span>Test Safe Flow</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scenario 2 */}
          <div
            onClick={() => onTriggerDemoScenario ? onTriggerDemoScenario(2) : null}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-400 uppercase text-[10px]">Scenario 2</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Risk: 64/100
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">SUSPICIOUS PAYMENT</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ₹18,500 Unverified individual payee. Higher than normal amount for new recipient.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-semibold group-hover:text-amber-300">
              <span>Test Warning Flow</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scenario 3 */}
          <div
            onClick={() => onTriggerDemoScenario ? onTriggerDemoScenario(3) : null}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-rose-500/50 hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-rose-400 uppercase text-[10px]">Scenario 3</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Risk: 91/100
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">HIGH-RISK PAYMENT</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                ₹35,000 KYC scam trap with screen sharing active & urgent payment pressure.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-rose-400 font-semibold group-hover:text-rose-300">
              <span>Triggers "Pause Before Pay"</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scenario 4 */}
          <div
            onClick={() => onTriggerDemoScenario ? onTriggerDemoScenario(4) : null}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/50 hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-indigo-400 uppercase text-[10px]">Scenario 4</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Case Tracking
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">FRAUD RECOVERY</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Amount Lost: <strong className="text-amber-300 font-mono">₹40,00,000</strong> (Demo Reference Case). 1930 NCRP Docket & fund traceback.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 font-semibold group-hover:text-indigo-300">
              <span>Inspect Recovery Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-MODULE SELECTOR BUTTONS */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs border-b border-slate-800">
        {[
          { id: "overview", label: "Security Center Overview" },
          { id: "network_mitm", label: "Network & MITM Monitor" },
          { id: "device_mac", label: "Device & Address Security" },
          { id: "timestamp_analysis", label: "Timestamp Behavior" },
          { id: "relationship_graph", label: "Transaction Graph" },
          { id: "read_write_audit", label: "Read/Write Audit Timeline" },
          { id: "identity_aadhaar", label: "Identity & Aadhaar" },
          { id: "bank_profile", label: "Bank Accounts & VPA" },
          { id: "check_anything", label: "Check Anything Center" },
          { id: "regulatory_cbdc", label: "Regulatory & Digital Rupee" },
          { id: "admin_ops", label: "Admin Security Operations" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as SecurityHubSection)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. OVERVIEW: SAFEUPI SECURITY CENTER (Requirement 24) */}
      {/* ========================================================= */}
      {activeSection === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                  <ShieldCheck className="w-7 h-7 text-cyan-400" />
                  SAFEUPI SECURITY CENTER
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Holistic posture evaluation across device integrity, network channels, and transaction streams.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-mono block">Overall Safety Score</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">94 / 100</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
                  A+
                </div>
              </div>
            </div>

            {/* 4 Pillars Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Account Security</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strong
                  </span>
                </div>
                <div className="text-lg font-bold text-white">2FA + Biometrics</div>
                <p className="text-[11px] text-slate-400">Zero sensitive banking credentials stored on client</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Device Security</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="text-lg font-bold text-white">Hardware Key Trusted</div>
                <p className="text-[11px] text-slate-400">Privacy-preserving device session fingerprint active</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">UPI Security</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Protected
                  </span>
                </div>
                <div className="text-lg font-bold text-white">Zero-PII Token</div>
                <p className="text-[11px] text-slate-400">Pre-payment risk scoring blocks collect requests</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Recent Alerts</span>
                  <span className="text-cyan-400 font-bold">2 Monitored</span>
                </div>
                <div className="text-lg font-bold text-white">Zero Active Breaches</div>
                <p className="text-[11px] text-slate-400">Network certificate anomaly simulated in test runner</p>
              </div>
            </div>

            {/* Active Sessions & Linked Accounts Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    Active Device Sessions (2 Devices)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Auto-Sync</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Pixel 8 Pro (Current Device)</p>
                      <p className="text-[10px] text-slate-400">Hyderabad, Telangana • Active Session</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Primary</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">MacBook Pro (Chrome Desktop)</p>
                      <p className="text-[10px] text-slate-400">Authorized Web Console • Logged in 2 hrs ago</p>
                    </div>
                    <button type="button" className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold cursor-pointer">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    Linked Bank Accounts (Masked)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveSection("bank_profile")}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    Manage →
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {bankAccounts.map((b) => (
                    <div key={b.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{b.bankName} ({b.accountNumber})</p>
                        <p className="text-[10px] text-slate-400 font-mono">{b.vpa}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.isPrimary ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                      }`}>
                        {b.isPrimary ? "Primary" : "Secondary"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. NETWORK & MITM ATTACK MONITOR (Requirement 6) */}
      {/* ========================================================= */}
      {activeSection === "network_mitm" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Cyber Defense Module 6
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Wifi className="w-6 h-6 text-sky-400" />
                  NETWORK SECURITY MONITOR (MITM Detection)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Monitors application endpoint certificates, DNS resolution integrity, payload modification, and session integrity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMitmSimState("ALERT");
                  setMitmDetailsShown(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600/30 border border-rose-500/50 hover:bg-rose-600/50 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                Simulate MITM Attack
              </button>
              <button
                type="button"
                onClick={() => {
                  setMitmSimState("MONITORING");
                  setMitmDetailsShown(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Reset Monitor
              </button>
            </div>
          </div>

          {/* MITM Attack Alert Box (Requirement 6) */}
          {mitmSimState === "ALERT" && (
            <div className="p-5 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-100 shadow-xl space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    ⚠ SECURITY ALERT: Man-in-the-Middle Anomaly Detected
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-200 mt-1">
                    Transaction information changed during the payment session. SafeUPI recommends reviewing the payment before continuing.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl text-xs space-y-1 font-mono">
                <div className="text-rose-300 font-bold">Detected MITM Signals:</div>
                <div className="text-slate-300">• Unexpected communication endpoint routed via untrusted proxy</div>
                <div className="text-slate-300">• Recipient VPA altered from "store@icici" to "hacker.relay99@ybl" mid-flight</div>
                <div className="text-slate-300">• TLS certificate pinning checksum mismatch</div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMitmSimState("MONITORING")}
                  className="px-4 py-2.5 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  [Cancel Payment]
                </button>
                <button
                  type="button"
                  onClick={() => setMitmDetailsShown(!mitmDetailsShown)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  [Review Details]
                </button>
              </div>
            </div>
          )}

          {/* Live Network Signals Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-mono">TLS Certificate Pinning</span>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Valid (SHA-256 NPCI)
              </div>
              <p className="text-[11px] text-slate-400">Zero proxy tampering detected in active socket</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Session Integrity</span>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Authenticated
              </div>
              <p className="text-[11px] text-slate-400">Session ID matched with authorized biometric token</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Transaction Payload Consistency</span>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Synchronized
              </div>
              <p className="text-[11px] text-slate-400">Zero in-flight modification of payee address</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 italic">
            * Note: SafeUPI prototype monitors application-layer network signals. It does not claim that the prototype can detect every possible MITM attack.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DEVICE & ADDRESS SECURITY (Requirement 7) */}
      {/* ========================================================= */}
      {activeSection === "device_mac" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Cyber Defense Module 7
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-cyan-400" />
                  DEVICE & ADDRESS SECURITY (MAC / Spoofing Anomaly)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Monitors privacy-preserving hardware signatures, session transitions, and address change patterns.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-mono block">Device Security Score</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">{deviceSecurityScore} / 100</span>
            </div>
          </div>

          {/* Anomaly Score Card (Requirement 7 format) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">Current Device Diagnostic Status:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">⚠ New device registered</span>
                  <span className="text-[10px] text-slate-400">Pixel 8 added 2 days ago</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">⚠ Network changed</span>
                  <span className="text-[10px] text-slate-400">Switched to Mobile 5G</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 block">✓ Session authenticated</span>
                  <span className="text-[10px] text-slate-400">Zero spoofing tokens detected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-cyan-400">Privacy Safeguard:</strong> SafeUPI strictly utilizes privacy-preserving session hashes instead of harvesting sensitive raw MAC addresses or hardware IMEI.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TIMESTAMP & TRANSACTION BEHAVIOR ANALYSIS (Requirement 8) */}
      {/* ========================================================= */}
      {activeSection === "timestamp_analysis" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cyber Defense Module 8
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-amber-400" />
                  TIMESTAMP & TRANSACTION BEHAVIOR ANALYSIS
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Detects sudden burst payments, velocity spikes, and high-frequency transfers indicative of coercive scams.
              </p>
            </div>
          </div>

          {/* Timestamp Specimen Box (Requirement 8 example) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Previous Transaction</span>
                <span className="text-sm font-bold text-white">10:42:15 AM</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Amount: ₹250</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Current Attempt</span>
                <span className="text-sm font-bold text-cyan-400">10:43:08 AM</span>
                <span className="text-[10px] text-amber-300 block mt-0.5">Amount: ₹35,000</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Time Gap</span>
                <span className="text-sm font-bold text-rose-400">53 Seconds</span>
                <span className="text-[10px] text-rose-300 block mt-0.5">Sudden 140x value jump</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Risk Factor</span>
                <span className="text-sm font-bold text-rose-400">Rapid transaction activity</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">+28 risk score penalty</span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <strong>Velocity Engine Analysis:</strong> High velocity payment requests under 2 minutes with high values are typical of "Digital Arrest" and coercive caller impersonation. SafeUPI pauses execution for explicit user confirmation.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. USER → TRANSACTION → RECIPIENT GRAPH (Requirement 9) */}
      {/* ========================================================= */}
      {activeSection === "relationship_graph" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Forensic Visualization Module 9
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-400" />
                  USER → TRANSACTION → RECIPIENT RELATIONSHIP GRAPH
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Graph analysis exposing suspicious recipient layering, mule hops, and off-ramp accounts.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
              Simulated Graph Topology
            </span>
          </div>

          {/* Interactive Topology Graph Visualizer */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Payment Relationship Graph (Suspicious Transfer Detection)
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative py-4">
              
              {/* Node 1: User */}
              <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 text-center w-full md:w-44 shadow-lg">
                <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  YOU
                </div>
                <div className="font-black text-white text-xs">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Masked Bank Account</div>
                <div className="mt-2 text-[10px] font-bold text-emerald-400">Source of Funds</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">UPI Payment</span>
                <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse my-1 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-500 font-mono">₹35,000</span>
              </div>

              {/* Node 2: Transaction */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 text-center w-full md:w-44 shadow-lg">
                <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs mb-2">
                  TXN
                </div>
                <div className="font-black text-white text-xs">TXN-49201</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">SafeUPI Inspection</div>
                <div className="mt-2 text-[10px] font-bold text-rose-400">High Risk Flagged</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">Hop 1</span>
                <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse my-1 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-500 font-mono">3 mins</span>
              </div>

              {/* Node 3: Recipient Mule */}
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-center w-full md:w-44 shadow-lg">
                <div className="w-10 h-10 mx-auto rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  MULE
                </div>
                <div className="font-black text-white text-xs">refund.desk99@ybl</div>
                <div className="text-[10px] text-rose-300 font-mono mt-0.5">1st Mule Layer</div>
                <div className="mt-2 text-[10px] font-bold text-rose-400">NCRP 1930 Lien Frozen</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-rose-400 font-bold">Hop 2</span>
                <ArrowRight className="w-5 h-5 text-rose-400 animate-pulse my-1 rotate-90 md:rotate-0" />
                <span className="text-[9px] text-slate-500 font-mono">Layering</span>
              </div>

              {/* Node 4: Off-Ramp */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-center w-full md:w-44 shadow-lg">
                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs mb-2">
                  CRYPTO
                </div>
                <div className="font-black text-white text-xs">P2P Crypto Off-Ramp</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">USDT Address</div>
                <div className="mt-2 text-[10px] font-bold text-amber-400">Traced on Chain</div>
              </div>

            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            * Note: Graph relationships in prototype utilize simulated data to demonstrate analytical topology without accessing private inter-bank clearing feeds.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. READ/WRITE TRANSACTION MONITORING (Requirement 10) */}
      {/* ========================================================= */}
      {activeSection === "read_write_audit" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Audit Protocol Module 10
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  READ / WRITE TRANSACTION MONITORING & AUDIT TIMELINE
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Continuous ledger tracking discrete application lifecycle events: READ (lookups) vs WRITE (state commits).
              </p>
            </div>
          </div>

          {/* Audit Timeline Component (Requirement 10 format) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chronological Audit Trail (Microsecond Precision)
            </h4>

            <div className="space-y-3 font-mono text-xs">
              
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">READ</span>
                  <span className="text-slate-300">Recipient information retrieved (Swiggy Merchant)</span>
                </div>
                <span className="text-slate-500 text-[11px]">10:31:20</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">READ</span>
                  <span className="text-slate-300">Account verification & NPCI resolution</span>
                </div>
                <span className="text-slate-500 text-[11px]">10:31:22</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">WRITE</span>
                  <span className="text-slate-300">Payment request initiated (₹35,000 KYC Collect)</span>
                </div>
                <span className="text-slate-500 text-[11px]">10:31:24</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">SECURITY CHECK</span>
                  <span className="text-rose-200 font-bold">HIGH RISK DETECTED (Score: 91/100)</span>
                </div>
                <span className="text-rose-400 text-[11px]">10:31:25</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">PAYMENT GATE</span>
                  <span className="text-slate-300 font-bold">PAYMENT BLOCKED / PENDING USER REVIEW</span>
                </div>
                <span className="text-slate-500 text-[11px]">10:31:26</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. IDENTITY VERIFICATION & AUTHORIZED AADHAAR (Requirement 5) */}
      {/* ========================================================= */}
      {activeSection === "identity_aadhaar" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Compliance Module 5
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                  IDENTITY VERIFICATION (Authorized Aadhaar Verification)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Zero-Knowledge privacy architecture. SafeUPI never requests, stores, or transmits raw Aadhaar numbers or unencrypted OTPs.
              </p>
            </div>
          </div>

          {/* Verification Progression Card (Requirement 5 Flow) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verification Pipeline Flow:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Step 1</span>
                <span className="text-xs font-bold text-slate-200">Phone Number</span>
                <span className="text-[10px] text-emerald-400 block mt-1">✓ Verified</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Step 2</span>
                <span className="text-xs font-bold text-slate-200">Authorized Aadhaar Verification</span>
                <span className="text-[10px] text-emerald-400 block mt-1">✓ Tokenized</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Step 3</span>
                <span className="text-xs font-bold text-slate-200">Bank Account Verification</span>
                <span className="text-[10px] text-emerald-400 block mt-1">✓ NPCI Verified</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Step 4</span>
                <span className="text-xs font-bold text-slate-200">Verified Profile</span>
                <span className="text-[10px] text-emerald-400 block mt-1">✓ Zero-PII Profile</span>
              </div>
            </div>

            {/* Masked Identity Profile Card (Requirement 5 format) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-400 font-bold mb-2">Masked User Credentials Display:</div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Identity:</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mobile:</span>
                <span className="text-white font-bold">
                  {user.mobile ? `******${user.mobile.slice(-4)}` : "******4821"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Bank:</span>
                <span className="text-white font-bold">XXXX4521</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. BANK ACCOUNT & UPI PROFILE (Requirement 2) */}
      {/* ========================================================= */}
      {activeSection === "bank_profile" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Fintech Architecture Module 2
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                  BANK ACCOUNTS & UPI PROFILE MANAGEMENT
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Manage linked bank accounts, primary selection, and beneficiary security tiers with masked card tokens.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNewBankModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
            >
              + Link New Bank Account
            </button>
          </div>

          {/* Linked Bank Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className={`p-5 rounded-2xl border transition-all ${
                  account.isPrimary
                    ? "bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-950 border-cyan-500/50 shadow-md"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white text-sm">{account.bankName}</span>
                  </div>
                  {account.isPrimary ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      PRIMARY ACCOUNT
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setBankAccounts(bankAccounts.map(b => ({
                          ...b,
                          isPrimary: b.id === account.id
                        })));
                      }}
                      className="text-xs text-slate-400 hover:text-cyan-400 font-semibold cursor-pointer"
                    >
                      Set as Primary
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Account Number:</span>
                    <span className="font-mono text-white font-bold">{account.accountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Linked UPI ID:</span>
                    <span className="font-mono text-cyan-300">{account.vpa}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Security Tier:</span>
                    <span className="text-emerald-400 font-semibold">{account.securityTier}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Bank Modal */}
          {newBankModalOpen && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Link Bank Account (Simulation)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Select Bank</label>
                  <select
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Masked Account Number</label>
                  <input
                    type="text"
                    value={newBankAcc}
                    onChange={(e) => setNewBankAcc(e.target.value)}
                    placeholder="XXXX XXXX 3390"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddBank}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Confirm & Link
                </button>
                <button
                  type="button"
                  onClick={() => setNewBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            * Note: In production mode, bank linkage occurs exclusively via NPCI Authorized PSP protocols. SafeUPI never retains or transmits raw credentials.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. CHECK ANYTHING: UNIFIED SCAM DETECTION (Requirement 26) */}
      {/* ========================================================= */}
      {activeSection === "check_anything" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Universal Scanner Module 26
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-cyan-400" />
                  CHECK ANYTHING SCAM DETECTION CENTER
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Scan QR code, enter UPI ID, test suspicious SMS message, or evaluate payment requests under one unified shield.
              </p>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {[
              { id: "vpa", label: "Check UPI ID" },
              { id: "qr", label: "Scan QR Code" },
              { id: "screenshot", label: "Upload Screenshot" },
              { id: "sms", label: "Check Message / SMS" },
              { id: "payment_request", label: "Check Payment Request" }
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  setCheckAnythingType(btn.id as any);
                  setCheckResult(null);
                  if (btn.id === "vpa") setCheckQuery("refund.fast.kyc@paytm");
                  else if (btn.id === "sms") setCheckQuery("Dear user, your electricity bill will be disconnected tonight. Call officer at 9876543210 or pay via UPI.");
                  else if (btn.id === "payment_request") setCheckQuery("OLX buyer requesting ₹5000 deposit via collect request");
                  else setCheckQuery("swiggy.orders@icici");
                }}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  checkAnythingType === btn.id
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Query Input */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={checkQuery}
                onChange={(e) => setCheckQuery(e.target.value)}
                placeholder="Enter UPI VPA, paste SMS, or describe payment request..."
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleCheckAnything}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Inspect Now
              </button>
            </div>
          </div>

          {/* Result Card */}
          {checkResult && (
            <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in ${
              checkResult.status === "HIGH_RISK"
                ? "bg-rose-950/80 border-rose-500 text-rose-100"
                : checkResult.status === "SUSPICIOUS"
                ? "bg-amber-950/80 border-amber-500 text-amber-100"
                : "bg-emerald-950/80 border-emerald-500 text-emerald-100"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  checkResult.status === "HIGH_RISK"
                    ? "bg-rose-500 text-white"
                    : checkResult.status === "SUSPICIOUS"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-500 text-slate-950"
                }`}>
                  {checkResult.status.replace("_", " ")}
                </span>
                <span className="font-mono text-sm font-bold">
                  Risk Score: {checkResult.score} / 100
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{checkResult.title}</h4>
              <p className="text-xs text-slate-200">{checkResult.explanation}</p>

              <div className="space-y-1 text-xs font-mono pt-2 border-t border-white/10">
                <div className="font-bold">Flagged Indicators:</div>
                {checkResult.indicators.map((ind, i) => (
                  <div key={i} className="text-slate-300">• {ind}</div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 10. REGULATORY & DIGITAL RUPEE / CBDC READY (Requirements 22 & 23) */}
      {/* ========================================================= */}
      {activeSection === "regulatory_cbdc" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Regulatory & Future Architecture 22 & 23
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Building className="w-6 h-6 text-indigo-400" />
                  REGULATORY & SAFETY CENTER / DIGITAL RUPEE (CBDC) READY
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                RBI guidelines, Zero-Liability circulars, Cyber Helpline 1930 integration, and future-ready CBDC token safeguards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* RBI Regulatory Awareness */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                RBI Circular on Customer Protection & Zero-Liability
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li><strong className="text-white">Zero Liability:</strong> If reported within 3 working days of unauthorized electronic fraud.</li>
                <li><strong className="text-white">Limited Liability:</strong> Maximum ₹10,000 for basic savings accounts if reported between 4 to 7 days.</li>
                <li><strong className="text-white">10-Day Credit Rule:</strong> Bank must reverse the contested funds within 10 days of formal submission.</li>
              </ul>
              <div className="pt-2">
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:underline"
                >
                  <span>National Cyber Crime Helpline: 1930 (I4C MHA)</span>
                </a>
              </div>
            </div>

            {/* Digital Rupee / CBDC Ready Architecture */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  Digital Rupee Security (CBDC Support — Future Integration)
                </h4>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  Modular
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                SafeUPI’s modular architecture is designed to integrate Reserve Bank of India Digital Rupee (e₹-R) tokens once public APIs open for cybersecurity agents:
              </p>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="p-2 rounded bg-slate-900">• CBDC Token Ownership Cryptographic Attestation</div>
                <div className="p-2 rounded bg-slate-900">• Offline Peer-to-Peer Double-Spend Heuristics</div>
                <div className="p-2 rounded bg-slate-900">• Programmable Escrow Fraud Interception Gateways</div>
              </div>
            </div>

          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            * Note: SafeUPI is a cybersecurity defense layer; it is not an RBI-authorized banking institution. Real CBDC transactions require authorized test environments.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 11. ADMIN / SECURITY OPERATIONS DASHBOARD (Requirement 33) */}
      {/* ========================================================= */}
      {activeSection === "admin_ops" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Role-Based Access: Security Analyst
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-rose-400" />
                  ADMIN & SECURITY OPERATIONS DASHBOARD (SOC Console)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Telemetry overview for cybersecurity operations: fraud alerts, high-risk VPAs, recovery workflows, and threat metrics without exposing sensitive PII.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              SOC Live Feed: Online
            </span>
          </div>

          {/* SOC Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Fraud Alerts (24h)</span>
              <span className="text-2xl font-black text-rose-400 font-mono">14</span>
              <span className="text-[10px] text-slate-500 block mt-1">100% Intercepted</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">High-Risk Transactions</span>
              <span className="text-2xl font-black text-amber-400 font-mono">38</span>
              <span className="text-[10px] text-slate-500 block mt-1">Under golden hour review</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Reported QR Codes</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">92</span>
              <span className="text-[10px] text-slate-500 block mt-1">Appended to mule registry</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Recovery Cases Managed</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">₹48,20,000</span>
              <span className="text-[10px] text-slate-500 block mt-1">Assisted across 1930 dockets</span>
            </div>
          </div>

          {/* Reported Threat Feed */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Reported Threat Queue (Sanitized Zero-PII):
            </h4>
            <div className="divide-y divide-slate-800 text-xs font-mono">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold">ALERT-802:</span> AnyDesk Screen-Share active during ₹35,000 KYC transfer
                </div>
                <span className="text-slate-500">2 mins ago</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">ALERT-801:</span> QR payload mismatched merchant GST name at fuel pump
                </div>
                <span className="text-slate-500">14 mins ago</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-bold">ALERT-800:</span> Sudden 20x burst frequency on newly linked device
                </div>
                <span className="text-slate-500">41 mins ago</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
