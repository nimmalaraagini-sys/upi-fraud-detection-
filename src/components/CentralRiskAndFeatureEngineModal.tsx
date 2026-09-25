import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, Sliders, CheckCircle2, AlertTriangle, ShieldCheck,
  Zap, Activity, Database, Smartphone, Radio, Users,
  CreditCard, UserCheck, Layers, FileCode, Check, RefreshCw, X
} from "lucide-react";

export interface FeatureCategory {
  id: string;
  name: string;
  count: number;
  icon: typeof Cpu;
  color: string;
  features: {
    name: string;
    type: string;
    sampleValue: string | number | boolean;
    importanceWeight: number; // 0 - 1
    description: string;
  }[];
}

export const ML_FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "sim",
    name: "SIM Features",
    count: 4,
    icon: Radio,
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    features: [
      { name: "sim_swap_age_hours", type: "integer", sampleValue: 720, importanceWeight: 0.88, description: "Hours elapsed since latest IMSI / ICCID carrier re-provisioning" },
      { name: "sim_binding_status", type: "enum", sampleValue: "VALIDATED", importanceWeight: 0.74, description: "Hardware SIM cryptographically paired with host operating system" },
      { name: "roaming_carrier_match", type: "boolean", sampleValue: true, importanceWeight: 0.45, description: "Home telecom operator matched against local base station transceiver" },
      { name: "sim_serial_hash", type: "string", sampleValue: "sha256:e3b0c442...", importanceWeight: 0.62, description: "Privacy-preserving hashed identifier of subscriber module" }
    ]
  },
  {
    id: "device",
    name: "Device Features",
    count: 5,
    icon: Smartphone,
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    features: [
      { name: "device_age_days", type: "integer", sampleValue: 240, importanceWeight: 0.78, description: "Days since this hardware token first registered with SafeUPI" },
      { name: "device_change_flag", type: "boolean", sampleValue: false, importanceWeight: 0.85, description: "Binary indicator whether active device differs from habitual profile" },
      { name: "hardware_keystore_backed", type: "boolean", sampleValue: true, importanceWeight: 0.92, description: "Keys protected inside Android Keymaster / Apple Secure Enclave" },
      { name: "os_emulation_detected", type: "boolean", sampleValue: false, importanceWeight: 0.95, description: "Detection of QEMU, BlueStacks, or rooted developer kernel" },
      { name: "screen_mirroring_active", type: "boolean", sampleValue: false, importanceWeight: 0.91, description: "Active MediaProjection or remote desktop overlay (AnyDesk/TeamViewer)" }
    ]
  },
  {
    id: "wallet",
    name: "Wallet Features",
    count: 4,
    icon: CreditCard,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    features: [
      { name: "inbound_credit_recency_sec", type: "integer", sampleValue: 4200, importanceWeight: 0.84, description: "Seconds elapsed since the latest wallet balance replenishment" },
      { name: "cashout_liquidation_ratio", type: "float", sampleValue: 0.12, importanceWeight: 0.89, description: "Ratio of requested outbound cashout relative to total wallet balance" },
      { name: "historical_merchant_spend_ratio", type: "float", sampleValue: 0.86, importanceWeight: 0.65, description: "Proportion of wallet turnover spent on verified merchant goods" },
      { name: "dormancy_break_flag", type: "boolean", sampleValue: false, importanceWeight: 0.72, description: "Indicates sudden liquidation following > 60 days of inactivity" }
    ]
  },
  {
    id: "agent",
    name: "Agent Features",
    count: 4,
    icon: Users,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    features: [
      { name: "agent_terminal_velocity_1h", type: "integer", sampleValue: 14, importanceWeight: 0.75, description: "Total count of disbursements processed at this physical agent terminal" },
      { name: "agent_kyc_tier", type: "string", sampleValue: "TIER_3_ENTERPRISE", importanceWeight: 0.60, description: "Institutional background verification status of business correspondent" },
      { name: "repeated_transfers_ratio", type: "float", sampleValue: 0.08, importanceWeight: 0.82, description: "Ratio of reciprocal payments occurring between familiar agent pairs" },
      { name: "agent_complaint_incident_score", type: "float", sampleValue: 0.02, importanceWeight: 0.90, description: "Historical complaint density registered with 1930 NCRP" }
    ]
  },
  {
    id: "account",
    name: "Account Features",
    count: 4,
    icon: UserCheck,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    features: [
      { name: "account_vintage_days", type: "integer", sampleValue: 730, importanceWeight: 0.68, description: "Days since bank savings or current account was opened" },
      { name: "pin_reset_elapsed_hours", type: "integer", sampleValue: 1800, importanceWeight: 0.87, description: "Hours elapsed since user last reset their 4 or 6 digit UPI PIN" },
      { name: "account_standing_status", type: "enum", sampleValue: "NORMAL_ACTIVE", importanceWeight: 0.70, description: "Lien or debit freeze flag from nodal bank branch" },
      { name: "average_monthly_turnover", type: "float", sampleValue: 45000, importanceWeight: 0.55, description: "Baseline historical average monthly credit volume" }
    ]
  },
  {
    id: "kyc_identity",
    name: "KYC / Identity Features",
    count: 3,
    icon: Layers,
    color: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    features: [
      { name: "aadhaar_otp_link_verified", type: "boolean", sampleValue: true, importanceWeight: 0.91, description: "Three-tier authentication verified against registered mobile" },
      { name: "pan_seeding_status", type: "enum", sampleValue: "SEEDED_VERIFIED", importanceWeight: 0.64, description: "Tax identification seeded with CBDT national registry" },
      { name: "identity_entropy_score", type: "float", sampleValue: 0.05, importanceWeight: 0.77, description: "Consistency score across name spelling across accounts" }
    ]
  },
  {
    id: "transaction",
    name: "Transaction Features",
    count: 5,
    icon: Activity,
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    features: [
      { name: "amount_inr", type: "float", sampleValue: 2450.00, importanceWeight: 0.82, description: "Current transfer value in Indian Rupees" },
      { name: "amount_deviation_sigma", type: "float", sampleValue: 0.45, importanceWeight: 0.86, description: "Standard deviations away from user's historical spend mean" },
      { name: "transaction_type", type: "enum", sampleValue: "P2P_TRANSFER", importanceWeight: 0.62, description: "Categorization: P2P, Cash-Out, Merchant, Wallet, QR, Collect, Bank" },
      { name: "channel_sub_type", type: "enum", sampleValue: "DIRECT_PUSH", importanceWeight: 0.75, description: "Direct intent push vs reverse collect debit request" },
      { name: "hour_of_day", type: "integer", sampleValue: 14, importanceWeight: 0.58, description: "Time of initiation (0-23) checking for late-night vulnerabilities" }
    ]
  },
  {
    id: "merchant",
    name: "Merchant Features",
    count: 3,
    icon: ShieldCheck,
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    features: [
      { name: "gst_registered_merchant", type: "boolean", sampleValue: true, importanceWeight: 0.79, description: "Verified GSTIN number linked to merchant virtual payment address" },
      { name: "merchant_chargeback_ratio", type: "float", sampleValue: 0.003, importanceWeight: 0.88, description: "Ratio of historical consumer dispute claims" },
      { name: "mcc_code", type: "integer", sampleValue: 5411, importanceWeight: 0.50, description: "Merchant Category Code (e.g. 5411 Grocery, 6011 ATM Cashout)" }
    ]
  },
  {
    id: "recipient",
    name: "Recipient Features",
    count: 4,
    icon: UserCheck,
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    features: [
      { name: "is_new_beneficiary", type: "boolean", sampleValue: false, importanceWeight: 0.83, description: "True if sender has zero prior transactions with this handle" },
      { name: "recipient_account_age_hours", type: "integer", sampleValue: 4320, importanceWeight: 0.80, description: "Hours elapsed since beneficiary VPA was first registered" },
      { name: "mule_blacklist_match", type: "boolean", sampleValue: false, importanceWeight: 0.98, description: "Cryptographic hash match against 1930 NCRP mule database" },
      { name: "keyword_anomaly_flag", type: "boolean", sampleValue: false, importanceWeight: 0.85, description: "Contains suspicious keywords ('refund', 'bail', 'customs', 'kyc')" }
    ]
  },
  {
    id: "network",
    name: "Network Features",
    count: 4,
    icon: Radio,
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    features: [
      { name: "tls_certificate_pinned", type: "boolean", sampleValue: true, importanceWeight: 0.94, description: "Mitigates proxy interceptors and rogue public Wi-Fi MITM injection" },
      { name: "ip_asn_reputation", type: "string", sampleValue: "RESIDENTIAL_BROADBAND", importanceWeight: 0.71, description: "Categorization: Datacenter/VPN proxy vs genuine cellular carrier" },
      { name: "session_transition_anomaly", type: "boolean", sampleValue: false, importanceWeight: 0.83, description: "Abrupt IP leap during active checkout session" },
      { name: "privacy_mac_identifier", type: "string", sampleValue: "mac_hash:7a9f...", importanceWeight: 0.65, description: "Privacy-preserving anonymized client network identifier" }
    ]
  },
  {
    id: "behavior",
    name: "Behavior Features",
    count: 4,
    icon: Activity,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    features: [
      { name: "touch_keystroke_jitter_ms", type: "float", sampleValue: 34.2, importanceWeight: 0.67, description: "Biometric typing cadence detecting automated script injection" },
      { name: "ui_interaction_speed_ratio", type: "float", sampleValue: 1.05, importanceWeight: 0.72, description: "Human reading speed vs inhumanly instantaneous clickbot behavior" },
      { name: "active_cellular_call_state", type: "boolean", sampleValue: false, importanceWeight: 0.95, description: "Detects live voice call indicative of vishing intimidation" },
      { name: "clipboard_vpa_paste_flag", type: "boolean", sampleValue: false, importanceWeight: 0.78, description: "VPA pasted directly from external Telegram or WhatsApp message" }
    ]
  }
];

export const RULE_ENGINE_RULES = [
  { code: "NEW_BENEFICIARY", name: "New Beneficiary Detection", baseWeight: 12, enabled: true, category: "Recipient" },
  { code: "UNUSUAL_AMOUNT", name: "High Amount Profile Spike (> 3x)", baseWeight: 28, enabled: true, category: "Amount" },
  { code: "RAPID_TRANSACTIONS", name: "Velocity Anomaly (< 60s bursts)", baseWeight: 35, enabled: true, category: "Velocity" },
  { code: "NEW_DEVICE", name: "Unrecognized Device Hardware Fingerprint", baseWeight: 22, enabled: true, category: "Device" },
  { code: "DEVICE_MISMATCH", name: "Keystore Token Cryptographic Mismatch", baseWeight: 45, enabled: true, category: "Device" },
  { code: "NETWORK_ANOMALY", name: "Proxy / VPN / Session Interception Attempt", baseWeight: 30, enabled: true, category: "Network" },
  { code: "QR_MISMATCH", name: "QR Decoded VPA Differs from Display Text", baseWeight: 48, enabled: true, category: "QR" },
  { code: "SIM_SWAP_SIGNAL", name: "Telco SIM Re-binding within 48 Hours", baseWeight: 42, enabled: true, category: "SIM" },
  { code: "WALLET_CREDIT_ABUSE", name: "Deposit Immediately Followed by Cashout", baseWeight: 45, enabled: true, category: "Wallet" },
  { code: "CASH_OUT_VELOCITY", name: "Micro-Structuring Smurfing Bursts", baseWeight: 38, enabled: true, category: "Velocity" },
  { code: "ACCOUNT_TAKEOVER_SIGNAL", name: "PIN Reset + Immediate Transfer Intent", baseWeight: 50, enabled: true, category: "Account" },
  { code: "AGENT_BEHAVIOR_ANOMALY", name: "Multiple Unrelated Victims Funneling to Node", baseWeight: 48, enabled: true, category: "Agent" },
  { code: "TIMESTAMP_ANOMALY", name: "Late Night Coercion Window (1 AM - 5 AM)", baseWeight: 16, enabled: true, category: "Timing" },
  { code: "MULTIPLE_FAILED_ATTEMPTS", name: "Prior Security Step-Up Denials (> 2)", baseWeight: 40, enabled: true, category: "Behavior" }
];

export const CentralRiskAndFeatureEngineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"features" | "rules" | "vector">("features");
  const [selectedCategory, setSelectedCategory] = useState<string>("sim");
  const [rules, setRules] = useState(RULE_ENGINE_RULES);
  const [copiedVector, setCopiedVector] = useState(false);

  if (!isOpen) return null;

  const currentCat = ML_FEATURE_CATEGORIES.find(c => c.id === selectedCategory) || ML_FEATURE_CATEGORIES[0];

  const toggleRule = (code: string) => {
    setRules(prev => prev.map(r => r.code === code ? { ...r, enabled: !r.enabled } : r));
  };

  const sampleVectorJson = JSON.stringify({
    timestamp: new Date().toISOString(),
    engine: "SAFEUPI_HYBRID_RISK_ENGINE_v4",
    features: {
      sim_swap_age_hours: 720,
      device_age_days: 240,
      device_change_flag: false,
      hardware_keystore_backed: true,
      inbound_credit_recency_sec: 4200,
      cashout_liquidation_ratio: 0.12,
      account_vintage_days: 730,
      pin_reset_elapsed_hours: 1800,
      amount_inr: 2450.00,
      amount_deviation_sigma: 0.45,
      is_new_beneficiary: false,
      mule_blacklist_match: false,
      tls_certificate_pinned: true,
      active_cellular_call_state: false
    },
    ml_confidence_percent: 94.2,
    composite_risk_score: 14,
    decision_classification: "ACCEPT",
    regulatory_threshold_disclaimer: "SafeUPI prototype scoring; not official RBI/NPCI thresholds."
  }, null, 2);

  const handleCopyVector = () => {
    navigator.clipboard.writeText(sampleVectorJson);
    setCopiedVector(true);
    setTimeout(() => setCopiedVector(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Central Risk Engine & Prebuilt ML Feature Layer
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 4, 5, 7, 8 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                11 Feature Categories, Configurable Heuristic Rule Engine, and Prototype Risk Index (0–100).
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
            onClick={() => setActiveTab("features")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "features" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Prebuilt ML Features (11 Categories)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "rules" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurable Rule Engine ({rules.length} Rules)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vector")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "vector" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Feature Vector (Dev / Admin View)</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
          
          {/* TAB 1: 11 ML FEATURE CATEGORIES */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {ML_FEATURE_CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSel ? "bg-cyan-600 text-white shadow-sm" : "bg-slate-850 hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  );
                })}
              </div>

              {/* Selected Category Features Table */}
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {currentCat.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                      {currentCat.features.length} Engineered Features
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Computed Pre-Inference &lt; 2ms
                  </span>
                </div>

                <div className="space-y-2">
                  {currentCat.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-cyan-300">{feat.name}</strong>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {feat.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {feat.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-mono">Feature Weight</span>
                          <strong className="text-indigo-400 font-mono text-xs">
                            {(feat.importanceWeight * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div className="p-1.5 px-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800">
                          {String(feat.sampleValue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIGURABLE RULE ENGINE */}
          {activeTab === "rules" && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <span>⚡ <strong>Heuristic Rule Matrix:</strong> Deterministic checks run concurrently before the ML ensemble model is invoked.</span>
                <span className="font-mono text-slate-400">Total: {rules.filter(r => r.enabled).length} Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {rules.map((rule) => (
                  <div
                    key={rule.code}
                    className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-white text-xs">{rule.code}</strong>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {rule.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 block mt-0.5">{rule.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Weight: +{rule.baseWeight} pts</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRule(rule.code)}
                      className={`px-3 py-1 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                        rule.enabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {rule.enabled ? "ACTIVE" : "BYPASSED"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE FEATURE VECTOR (DEV / ADMIN VIEW) */}
          {activeTab === "vector" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Engine Pipeline: Transaction Input -&gt; Feature Extraction -&gt; Normalized Vector
                </span>
                <button
                  type="button"
                  onClick={handleCopyVector}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedVector ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
                  <span>{copiedVector ? "Copied" : "Copy Feature Vector JSON"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-80 scrollbar-thin leading-relaxed">
                {sampleVectorJson}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Output: Risk Score 0–100 (0–30 Low, 31–70 Medium, 71–100 High) · Prototype Thresholds
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
