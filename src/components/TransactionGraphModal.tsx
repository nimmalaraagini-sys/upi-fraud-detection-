import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Share2, Search, Filter, AlertTriangle, ShieldAlert,
  ArrowRight, CheckCircle2, Info, Lock, Smartphone, CreditCard,
  Building, RefreshCw, X, Eye, Zap
} from "lucide-react";

export type NodeType = "User" | "Account" | "Device" | "UPI ID" | "Merchant" | "Agent" | "Recipient" | "Transaction";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  riskStatus: "safe" | "suspicious" | "flagged";
  details: { [key: string]: string | number };
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: "Paid" | "Received" | "Logged In" | "Used Device" | "Transferred" | "Credited" | "Cashed Out";
  amount?: number;
  isSuspicious?: boolean;
}

const SAMPLE_NODES: GraphNode[] = [
  { id: "u1", label: "User A (Student)", type: "User", riskStatus: "safe", details: { Mobile: "+91 98765 11201", Kyc: "Tier 1 Verified", Joined: "2024" }, x: 60, y: 70 },
  { id: "u2", label: "User B (Merchant)", type: "User", riskStatus: "safe", details: { Mobile: "+91 98112 44902", Kyc: "GST Verified", Joined: "2023" }, x: 60, y: 160 },
  { id: "u3", label: "User C (Senior)", type: "User", riskStatus: "suspicious", details: { Mobile: "+91 94401 88319", Kyc: "Senior Citizen", Flag: "Active Call Vishing" }, x: 60, y: 250 },
  { id: "d1", label: "Device #8841", type: "Device", riskStatus: "safe", details: { OS: "Android 14", Fingerprint: "hw_sha256:7a9e..." }, x: 190, y: 50 },
  { id: "tx1", label: "Txn #901 (₹9.5k)", type: "Transaction", riskStatus: "suspicious", details: { Amount: "₹9,500", Velocity: "Rapid", Type: "P2P" }, x: 220, y: 110 },
  { id: "tx2", label: "Txn #902 (₹14k)", type: "Transaction", riskStatus: "suspicious", details: { Amount: "₹14,000", Velocity: "Rapid", Type: "P2P" }, x: 220, y: 170 },
  { id: "tx3", label: "Txn #903 (₹22k)", type: "Transaction", riskStatus: "flagged", details: { Amount: "₹22,000", Velocity: "Rapid", Type: "P2P" }, x: 220, y: 230 },
  { id: "mule", label: "Recipient X (Hub Mule)", type: "Recipient", riskStatus: "flagged", details: { VPA: "clearing.mule99@ybl", InDegree: "14 unlinked senders", Complaints: "4 NCRP 1930 flags" }, x: 420, y: 160 },
  { id: "ag1", label: "Agent Kiosk 402", type: "Agent", riskStatus: "suspicious", details: { AgentId: "BC_HYD_402", Location: "Secunderabad", TurnoverSpike: "400%" }, x: 420, y: 270 },
  { id: "out1", label: "ATM ICCW Cashout", type: "Account", riskStatus: "flagged", details: { Channel: "Cardless ATM (MCC 6011)", TimeToDrain: "180 seconds" }, x: 580, y: 160 }
];

const SAMPLE_EDGES: GraphEdge[] = [
  { from: "u1", to: "d1", label: "Logged In" },
  { from: "u1", to: "tx1", label: "Transferred", amount: 9500 },
  { from: "u2", to: "tx2", label: "Transferred", amount: 14000 },
  { from: "u3", to: "tx3", label: "Transferred", amount: 22000, isSuspicious: true },
  { from: "tx1", to: "mule", label: "Received", amount: 9500, isSuspicious: true },
  { from: "tx2", to: "mule", label: "Received", amount: 14000, isSuspicious: true },
  { from: "tx3", to: "mule", label: "Received", amount: 22000, isSuspicious: true },
  { from: "mule", to: "out1", label: "Cashed Out", amount: 45500, isSuspicious: true },
  { from: "mule", to: "ag1", label: "Transferred", isSuspicious: true }
];

export const TransactionGraphModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(SAMPLE_NODES[7]); // Recipient X

  if (!isOpen) return null;

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
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Transaction Graph & Relationship Analysis
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Section 20 Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-entity graph analysis detecting circular transactions, syndicates, and rapid funneling to common recipients.
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

        {/* Notice Banner */}
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300 px-5">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Compliance Standard:</strong> Highlighted relationship patterns are labeled as <em>"Potentially suspicious relationship pattern"</em> to preserve regulatory fairness.</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">10 Nodes · 9 Edges</span>
        </div>

        {/* Interactive Graph Canvas + Inspector */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[65vh] scrollbar-thin">
          
          {/* Visual SVG Graph Canvas */}
          <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-850">
              <span>Interactive Graph Visualizer (Click any node to inspect telemetry)</span>
              <span className="text-rose-400">🔴 High-Risk Funnel Detected</span>
            </div>

            <svg viewBox="0 0 680 340" className="w-full h-80 overflow-visible select-none">
              {/* Edges */}
              {SAMPLE_EDGES.map((edge, i) => {
                const src = SAMPLE_NODES.find(n => n.id === edge.from);
                const dst = SAMPLE_NODES.find(n => n.id === edge.to);
                if (!src || !dst) return null;
                return (
                  <g key={i}>
                    <line
                      x1={src.x + 40}
                      y1={src.y + 15}
                      x2={dst.x + 40}
                      y2={dst.y + 15}
                      stroke={edge.isSuspicious ? "#f43f5e" : "#475569"}
                      strokeWidth={edge.isSuspicious ? "2.5" : "1.5"}
                      strokeDasharray={edge.isSuspicious ? "4,4" : "none"}
                    />
                    {edge.amount && (
                      <text
                        x={(src.x + dst.x) / 2 + 40}
                        y={(src.y + dst.y) / 2 + 10}
                        fill={edge.isSuspicious ? "#fecdd3" : "#94a3b8"}
                        fontSize="8"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        ₹{edge.amount.toLocaleString("en-IN")}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {SAMPLE_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const nodeFill = node.riskStatus === "flagged"
                  ? "#4c0519"
                  : node.riskStatus === "suspicious"
                  ? "#451a03"
                  : "#0f172a";

                const nodeStroke = node.riskStatus === "flagged"
                  ? "#f43f5e"
                  : node.riskStatus === "suspicious"
                  ? "#f59e0b"
                  : "#38bdf8";

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <rect
                      width="105"
                      height="34"
                      rx="8"
                      fill={nodeFill}
                      stroke={nodeStroke}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      filter={isSelected ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))" : "none"}
                    />
                    <text
                      x="52"
                      y="15"
                      fill="#f8fafc"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                    <text
                      x="52"
                      y="26"
                      fill={node.riskStatus === "flagged" ? "#fca5a5" : "#94a3b8"}
                      fontSize="7"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.type} · {node.riskStatus.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Inspector Panel */}
          <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-3">
            <div className="pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Entity Telemetry Inspector:</span>
              <h3 className="text-sm font-extrabold text-white mt-0.5">{selectedNode.label}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Type: {selectedNode.type}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  selectedNode.riskStatus === "flagged" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : selectedNode.riskStatus === "suspicious" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {selectedNode.riskStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Properties */}
            <div className="space-y-1.5 text-xs">
              {Object.entries(selectedNode.details).map(([k, v]) => (
                <div key={k} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">{k}</span>
                  <span className="font-mono text-slate-200 font-bold text-[11px]">{String(v)}</span>
                </div>
              ))}
            </div>

            {/* Collusion Pattern Analysis */}
            {selectedNode.id === "mule" && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1">
                <strong className="block font-bold">⚠️ Funneling Syndicate Pattern:</strong>
                <p className="text-[11px] leading-tight">
                  3 separate victims transferred a cumulative ₹45,500 within a 20-minute window, followed by an immediate ₹45,500 ATM cardless cash-out intent.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Graph Engine: Dynamic Multi-Hop Clustering · Automated Collusion Detection
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
