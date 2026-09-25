import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Layers, Server, Shield, Database, Lock, Cpu, Globe,
  AlertTriangle, CheckCircle2, FileText, Ban, ExternalLink, X
} from "lucide-react";

export const DeploymentArchitectureModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"architecture" | "limitations">("architecture");

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
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Deployment Architecture & Prototype Boundaries
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 28 & 33 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modular microservice blueprint, cloud/on-prem portability, and essential regulatory boundaries.
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
            onClick={() => setActiveTab("architecture")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "architecture" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Modular System Architecture (Section 28)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("limitations")}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "limitations" ? "bg-slate-800 text-cyan-300 border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-rose-400" />
            <span>Prototype Disclaimers & Limitations (Section 33)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
          
          {/* TAB 1: MODULAR ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <span className="text-cyan-400 font-bold block">SAFEUPI MODULAR PLATFORM TOPOLOGY:</span>
                <pre className="text-[11px] text-cyan-200/90 leading-relaxed overflow-x-auto">
{`SAFEUPI
│
├── Frontend Client Layer
│   └── React + TypeScript + Vite + Motion (Tailwind CSS, Zero-PII UI)
│
├── API Gateway & Zero-Trust Session Firewall
│   └── Rate Limiter, TLS Certificate Pinning, Request Sanitization
│
├── Authentication & Identity Core
│   └── 3-Tier Multi-Channel OTP (Aadhaar -> Mobile SMS -> Bank Call IVR)
│
├── Transaction Interception Gateway
│   └── Pre-Settlement Decision Checkpoint (P2P, Cash-Out, Merchant, Wallet, QR, Collect)
│
├── Central Risk Engine
│   ├── Prebuilt Feature Engineering Layer (11 Feature Categories)
│   ├── Heuristic Rule Evaluation Matrix (14 Deterministic Anomaly Rules)
│   ├── Pre-Flight Validation Engine (Recipient, Type, Account, QR)
│   └── Ensemble ML Inference Model (Probability Scoring & Categorization)
│
├── Security & Telemetry Monitors
│   ├── Device Hardware Security (Hardware Token Keystore, Root/Emulation)
│   ├── Network & MITM Monitor (Session Drift, Proxy/VPN, Privacy MAC)
│   └── QR & Screenshot Cryptographic Verification
│
├── Relationship & Forensics Core
│   ├── Behavior & Velocity Engine (Decay Curves, Late-Night Penalties)
│   ├── Graph Collusion Engine (Multi-party Syndicates, In-Degree Funneling)
│   ├── AI Fraud Investigator (Forensic Timeline Synthesis, Evidence Locker)
│   └── Emergency Recovery Center (1930 NCRP Docket Generator)
│
└── Persistence & Audit Store
    ├── MongoDB Atlas (Collections: transactions, complaints, audit_logs, verifications)
    └── Immutable Microsecond Audit Trail Logger`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <strong className="text-cyan-300 block">Cloud Native</strong>
                  <p className="text-slate-400 text-[11px]">Containerized for AWS EKS, GCP Cloud Run, or Azure Kubernetes Service.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <strong className="text-purple-300 block">On-Premises Ready</strong>
                  <p className="text-slate-400 text-[11px]">Can run air-gapped inside private bank datacenters without third-party LLM dependencies.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <strong className="text-emerald-300 block">Digital Rupee (CBDC)</strong>
                  <p className="text-slate-400 text-[11px]">Designed with token-level metadata hooks for future e-Rupee programmable smart contracts.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROTOTYPE LIMITATIONS (SECTION 33) */}
          {activeTab === "limitations" && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-1 text-rose-200">
                <strong className="text-rose-400 text-xs font-bold block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Mandatory Prototype Limitations & Regulatory Boundaries
                </strong>
                <p className="text-[11px] leading-relaxed">
                  The SafeUPI application functions as a high-fidelity cybersecurity prototype and simulation demonstrator. Real-world commercial deployment requires formal integration with certified UPI Payment System Providers (PSPs), acquiring banks, NPCI, and relevant statutory regulators.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "1. No Access to UPI PIN or Private Banking Secrets",
                    desc: "SafeUPI NEVER accesses, captures, logs, or stores a user's UPI PIN, card CVV, net-banking passwords, or decrypted biometric secrets. PIN entry is solely delegated to the NPCI Common Library (CL) sandbox."
                  },
                  {
                    title: "2. Prototype Simulation of Interception",
                    desc: "Transaction interception is simulated within this prototype application. SafeUPI does NOT claim the ability to intercept live transactions across third-party UPI apps (PhonePe, Google Pay, Paytm) without bank/PSP-level SDK licensing."
                  },
                  {
                    title: "3. Simulated Telecom SIM Records",
                    desc: "SIM-swap anomaly signals demonstrated in this prototype are simulated. Direct access to live cellular carrier IMSI/ICCID telemetry requires authorized agreements with Department of Telecommunications (DoT) and licensed telecom operators."
                  },
                  {
                    title: "4. No Direct NPCI or RBI Authorization Claim",
                    desc: "SafeUPI is built by Team SECURE SHIELD as an independent smart technology solution. Risk scores (0-100) are prototype research thresholds and should NOT be construed as official RBI or NPCI regulatory standards."
                  },
                  {
                    title: "5. Recovery Assistance Without Guarantees",
                    desc: "The Recovery Center assists victims with 1930 NCRP complaint formatting and Golden Hour evidence assembly. SafeUPI never guarantees fund recovery or automated bank account unfreezing."
                  },
                  {
                    title: "6. No Automated Regulatory Filings",
                    desc: "All AI-generated compliance narratives (STR/SAR drafts) are clearly marked 'HUMAN REVIEW REQUIRED'. SafeUPI never automatically submits filings to Financial Intelligence Unit (FIU-IND) without compliance officer review."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-1">
                    <strong className="text-white font-bold block text-[11px]">{item.title}</strong>
                    <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            SECURE SHIELD · Ethical Fintech Cybersecurity Architecture
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
