import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileText, Clock, Search, Filter, ShieldCheck, ShieldAlert,
  AlertTriangle, CheckCircle2, ArrowRight, Download, Eye,
  RefreshCw, Check, Copy, X
} from "lucide-react";

export interface DecisionLogEntry {
  transactionId: string;
  timestamp: string;
  type: string;
  amount: number;
  recipient: string;
  rulesTriggeredCount: number;
  mlScore: number;
  finalScore: number;
  decision: "ACCEPT" | "DECLINE" | "REFER";
  primaryReason: string;
  auditTrail: { time: string; event: string; status: "ok" | "warn" | "fail" }[];
}

export const SAMPLE_DECISION_LOGS: DecisionLogEntry[] = [
  {
    transactionId: "TXN12345",
    timestamp: "10:32:15 AM",
    type: "P2P Transfer",
    amount: 40000,
    recipient: "example.mule@ybl",
    rulesTriggeredCount: 4,
    mlScore: 82,
    finalScore: 87,
    decision: "REFER",
    primaryReason: "New device + unusual amount + recipient anomaly",
    auditTrail: [
      { time: "10:31:20", event: "Transaction request received from mobile client", status: "ok" },
      { time: "10:31:21", event: "Recipient VPA validated against national directory", status: "warn" },
      { time: "10:31:21", event: "Device hardware keystore signature verified", status: "warn" },
      { time: "10:31:22", event: "Deterministic heuristic rules evaluated (4 triggered)", status: "fail" },
      { time: "10:31:22", event: "ML ensemble risk score generated (82% probability)", status: "fail" },
      { time: "10:31:23", event: "Composite Risk Score computed = 87/100 (HIGH)", status: "fail" },
      { time: "10:31:23", event: "Risk Decision rendered = REFER", status: "warn" },
      { time: "10:31:24", event: "User notification & security checkpoint rendered in UI", status: "ok" }
    ]
  },
  {
    transactionId: "TXN12346",
    timestamp: "10:35:40 AM",
    type: "Merchant Payment",
    amount: 380,
    recipient: "swiggy@icici",
    rulesTriggeredCount: 0,
    mlScore: 8,
    finalScore: 10,
    decision: "ACCEPT",
    primaryReason: "Verified food merchant + habitual purchase window + known hardware",
    auditTrail: [
      { time: "10:35:38", event: "Transaction request received", status: "ok" },
      { time: "10:35:39", event: "GST registered merchant signature validated", status: "ok" },
      { time: "10:35:39", event: "Device token validated", status: "ok" },
      { time: "10:35:40", event: "Rules evaluated (0 triggered)", status: "ok" },
      { time: "10:35:40", event: "ML score generated (8%)", status: "ok" },
      { time: "10:35:40", event: "Risk = 10 -> Decision = ACCEPT", status: "ok" }
    ]
  },
  {
    transactionId: "TXN12347",
    timestamp: "11:02:18 AM",
    type: "Cash-Out",
    amount: 48000,
    recipient: "crypto.swap@paytm",
    rulesTriggeredCount: 5,
    mlScore: 92,
    finalScore: 94,
    decision: "DECLINE",
    primaryReason: "Rapid cashout following large wallet credit + blacklisted mule handle",
    auditTrail: [
      { time: "11:02:14", event: "Outbound cash-out intent received", status: "ok" },
      { time: "11:02:15", event: "Wallet velocity check failed (< 60s credit interval)", status: "fail" },
      { time: "11:02:16", event: "1930 NCRP mule database hash matched", status: "fail" },
      { time: "11:02:17", event: "ML score generated (92%)", status: "fail" },
      { time: "11:02:18", event: "Risk = 94 -> Decision = DECLINE (Lien applied)", status: "fail" }
    ]
  }
];

export const DecisionLogsAndAuditTrailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedTxnId, setSelectedTxnId] = useState<string>("TXN12345");
  const [filterDecision, setFilterDecision] = useState<string>("ALL");

  if (!isOpen) return null;

  const filtered = SAMPLE_DECISION_LOGS.filter(log => {
    if (filterDecision === "ALL") return true;
    return log.decision === filterDecision;
  });

  const selectedLog = SAMPLE_DECISION_LOGS.find(l => l.transactionId === selectedTxnId) || SAMPLE_DECISION_LOGS[0];

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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Decision Logs & Transaction Audit Trails
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 16 & 17 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable chronological audit record of every algorithmic decision, triggered rule, and latency timestamp.
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

        {/* Filter Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-bold">Filter By Decision:</span>
          <div className="flex items-center gap-1.5">
            {["ALL", "ACCEPT", "REFER", "DECLINE"].map((dec) => (
              <button
                key={dec}
                type="button"
                onClick={() => setFilterDecision(dec)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  filterDecision === dec
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "bg-slate-850 hover:bg-slate-800 text-slate-400"
                }`}
              >
                {dec}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: Table + Selected Audit Trail */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
          
          {/* Decision Logs Table (Section 16) */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Rules</th>
                  <th className="p-3">ML / Score</th>
                  <th className="p-3">Decision</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filtered.map((log) => {
                  const isSel = log.transactionId === selectedLog.transactionId;
                  return (
                    <tr
                      key={log.transactionId}
                      onClick={() => setSelectedTxnId(log.transactionId)}
                      className={`cursor-pointer transition-colors ${
                        isSel ? "bg-slate-800/80" : "bg-slate-900/60 hover:bg-slate-850"
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-cyan-300">{log.transactionId}</td>
                      <td className="p-3 text-slate-400 font-mono">{log.timestamp}</td>
                      <td className="p-3 text-slate-300">{log.type}</td>
                      <td className="p-3 font-bold text-white">₹{log.amount.toLocaleString("en-IN")}</td>
                      <td className="p-3 font-mono text-amber-300">{log.rulesTriggeredCount} triggered</td>
                      <td className="p-3 font-mono">
                        <span className="text-indigo-400">{log.mlScore}%</span> / <strong className="text-white">{log.finalScore}</strong>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.decision === "ACCEPT" ? "bg-emerald-500/20 text-emerald-300"
                          : log.decision === "REFER" ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {log.decision}
                        </span>
                      </td>
                      <td className="p-3 text-cyan-400 font-semibold text-[11px]">
                        {isSel ? "Active" : "Inspect →"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Transaction-Level Audit Trail (Section 17) */}
          <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Microsecond Execution Audit Trail:
                </span>
                <h4 className="text-xs font-extrabold text-white">
                  {selectedLog.transactionId} · {selectedLog.primaryReason}
                </h4>
              </div>
              <span className="font-mono text-xs text-cyan-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-750">
                Decision: {selectedLog.decision}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {selectedLog.auditTrail.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-400 text-[11px]">{step.time}</span>
                    <span className="text-slate-200">{step.event}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    step.status === "ok" ? "bg-emerald-500/15 text-emerald-300"
                    : step.status === "warn" ? "bg-amber-500/15 text-amber-300"
                    : "bg-rose-500/15 text-rose-300"
                  }`}>
                    {step.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Every risk decision creates an immutable audit record for compliance & investigations.
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
