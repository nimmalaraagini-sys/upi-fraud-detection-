import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, ShieldCheck, Filter, Search, Play, Pause, ArrowUpRight, Zap, RefreshCw } from "lucide-react";
import { TransactionPayload, AnalysisResult } from "../types";
import { evaluateRiskEngine } from "../utils/fraudEngine";

interface FeedItem {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  channel: string;
  riskScore: number;
  decision: "ALLOW" | "STEP_UP_2FA" | "COOLING_PERIOD" | "BLOCK_AND_FREEZE";
  flagReason?: string;
  fullPayload: TransactionPayload;
}

interface LiveTransactionFeedProps {
  onInspectTransaction: (tx: TransactionPayload) => void;
}

export const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({ onInspectTransaction }) => {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "MODERATE" | "SAFE">("ALL");
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const sampleNames = [
    { sender: "amit.kumar@okaxis", senderName: "Amit Kumar" },
    { sender: "deepa.r@okhdfcbank", senderName: "Deepa R" },
    { sender: "rohit.sen@oksbi", senderName: "Rohit Sen" },
    { sender: "kavita.j@paytm", senderName: "Kavita Joshi" },
    { sender: "naveen.v@ybl", senderName: "Naveen V" }
  ];

  const sampleReceivers = [
    { receiver: "fresh_mart_pos@icici", name: "Fresh Mart Store", cat: "merchant" as const, age: 7200 },
    { receiver: "fast_loan_agent99@ybl", name: "Instant Loan Agent", cat: "unknown" as const, age: 3 },
    { receiver: "swiggy_orders@hdfcbank", name: "Swiggy Food Order", cat: "merchant" as const, age: 14000 },
    { receiver: "lottery_winner_claim@airtel", name: "Fake Lottery Prize Helpdesk", cat: "unknown" as const, age: 1 },
    { receiver: "anand.sharma@okaxis", name: "Anand Sharma (Friend)", cat: "individual" as const, age: 800 }
  ];

  const [feed, setFeed] = useState<FeedItem[]>(() => {
    return [
      {
        id: "TXN_7749021",
        timestamp: "10 seconds ago",
        sender: "amit.kumar@okaxis",
        receiver: "lottery_winner_claim@airtel",
        amount: 25000,
        channel: "collect_request",
        riskScore: 88,
        decision: "BLOCK_AND_FREEZE",
        flagReason: "Fake collect request to a 1-hour old stranger account with screen sharing on",
        fullPayload: {
          transactionId: "TXN_7749021",
          timestamp: new Date().toISOString(),
          senderVpa: "amit.kumar@okaxis",
          senderName: "Amit Kumar",
          senderAccountAgeDays: 500,
          receiverVpa: "lottery_winner_claim@airtel",
          receiverName: "Fake Lottery Prize Helpdesk",
          receiverCategory: "unknown",
          receiverAccountAgeHours: 1,
          amount: 25000,
          userAvgMonthlyAmount: 2000,
          userMaxHistoricalAmount: 15000,
          frequencyLast10Mins: 3,
          frequencyLast24Hours: 4,
          channel: "collect_request",
          deviceTrusted: true,
          deviceChangedRecently: false,
          isEmulatedOrRooted: false,
          screenShareAppActive: true,
          locationCity: "Delhi",
          distanceFromHomeKm: 2,
          unusualHour: false
        }
      },
      {
        id: "TXN_7749020",
        timestamp: "24 seconds ago",
        sender: "deepa.r@okhdfcbank",
        receiver: "swiggy_orders@hdfcbank",
        amount: 420,
        channel: "qr_code",
        riskScore: 8,
        decision: "ALLOW",
        flagReason: "Normal routine food payment",
        fullPayload: {
          transactionId: "TXN_7749020",
          timestamp: new Date().toISOString(),
          senderVpa: "deepa.r@okhdfcbank",
          senderName: "Deepa R",
          senderAccountAgeDays: 700,
          receiverVpa: "swiggy_orders@hdfcbank",
          receiverName: "Swiggy Food Order",
          receiverCategory: "merchant",
          receiverAccountAgeHours: 14000,
          amount: 420,
          userAvgMonthlyAmount: 3500,
          userMaxHistoricalAmount: 25000,
          frequencyLast10Mins: 1,
          frequencyLast24Hours: 2,
          channel: "qr_code",
          deviceTrusted: true,
          deviceChangedRecently: false,
          isEmulatedOrRooted: false,
          screenShareAppActive: false,
          locationCity: "Bengaluru",
          distanceFromHomeKm: 3,
          unusualHour: false
        }
      },
      {
        id: "TXN_7749019",
        timestamp: "45 seconds ago",
        sender: "rohit.sen@oksbi",
        receiver: "fast_loan_agent99@ybl",
        amount: 45000,
        channel: "payment_link",
        riskScore: 78,
        decision: "COOLING_PERIOD",
        flagReason: "Unregistered loan agent sent a WhatsApp link to a new device",
        fullPayload: {
          transactionId: "TXN_7749019",
          timestamp: new Date().toISOString(),
          senderVpa: "rohit.sen@oksbi",
          senderName: "Rohit Sen",
          senderAccountAgeDays: 450,
          receiverVpa: "fast_loan_agent99@ybl",
          receiverName: "Instant Loan Agent",
          receiverCategory: "unknown",
          receiverAccountAgeHours: 3,
          amount: 45000,
          userAvgMonthlyAmount: 1800,
          userMaxHistoricalAmount: 12000,
          frequencyLast10Mins: 1,
          frequencyLast24Hours: 1,
          channel: "payment_link",
          deviceTrusted: false,
          deviceChangedRecently: true,
          isEmulatedOrRooted: false,
          screenShareAppActive: false,
          locationCity: "Mumbai",
          distanceFromHomeKm: 140,
          unusualHour: false
        }
      }
    ];
  });

  // Simulated live event feed every 4.5 seconds
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const senderObj = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const receiverObj = sampleReceivers[Math.floor(Math.random() * sampleReceivers.length)];
      const isSus = receiverObj.cat === "unknown" && Math.random() > 0.4;
      const isNight = Math.random() > 0.85;

      const randomAmount = isSus
        ? Math.floor(12000 + Math.random() * 65000)
        : Math.floor(150 + Math.random() * 2500);

      const channelType = isSus
        ? (Math.random() > 0.5 ? "collect_request" : "payment_link")
        : (Math.random() > 0.5 ? "qr_code" : "direct_vpa");

      const txPayload: TransactionPayload = {
        transactionId: `TXN_${Math.floor(7749000 + Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        senderVpa: senderObj.sender,
        senderName: senderObj.senderName,
        senderAccountAgeDays: Math.floor(100 + Math.random() * 800),
        receiverVpa: receiverObj.receiver,
        receiverName: receiverObj.name,
        receiverCategory: receiverObj.cat,
        receiverAccountAgeHours: receiverObj.age,
        amount: randomAmount,
        userAvgMonthlyAmount: 2500,
        userMaxHistoricalAmount: 20000,
        frequencyLast10Mins: isSus ? Math.floor(3 + Math.random() * 3) : 1,
        frequencyLast24Hours: isSus ? 5 : 2,
        channel: channelType,
        deviceTrusted: !isSus,
        deviceChangedRecently: isSus && Math.random() > 0.5,
        isEmulatedOrRooted: false,
        screenShareAppActive: isSus && Math.random() > 0.6,
        locationCity: isSus ? "Unusual City" : "Home City",
        distanceFromHomeKm: isSus ? Math.floor(600 + Math.random() * 800) : 5,
        unusualHour: isNight
      };

      const evalResult = evaluateRiskEngine(txPayload);

      const newItem: FeedItem = {
        id: txPayload.transactionId,
        timestamp: "Just now",
        sender: txPayload.senderVpa,
        receiver: txPayload.receiverVpa,
        amount: txPayload.amount,
        channel: txPayload.channel,
        riskScore: evalResult.riskScore,
        decision: evalResult.decision,
        flagReason: evalResult.triggeredRules[0]?.name || evalResult.summaryReason,
        fullPayload: txPayload
      };

      setFeed((prev) => [newItem, ...prev.slice(0, 24)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filtered feed
  const filteredFeed = feed.filter((item) => {
    if (filter === "CRITICAL" && item.decision !== "BLOCK_AND_FREEZE") return false;
    if (filter === "MODERATE" && item.decision !== "COOLING_PERIOD" && item.decision !== "STEP_UP_2FA") return false;
    if (filter === "SAFE" && item.decision !== "ALLOW") return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.sender.toLowerCase().includes(q) ||
        item.receiver.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalVolume = feed.reduce((acc, curr) => acc + curr.amount, 0);
  const blockedCount = feed.filter(f => f.decision === "BLOCK_AND_FREEZE").length;
  const blockedRatio = Math.round((blockedCount / (feed.length || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Detection Speed</span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">14 ms</p>
          <span className="text-[10px] text-slate-500">Instant real-time check</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Money Scanned</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">₹{totalVolume.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-slate-500">{feed.length} recent transactions</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Scams Blocked</span>
          <p className="text-xl font-bold font-mono text-rose-700 mt-0.5">{blockedRatio}%</p>
          <span className="text-[10px] text-slate-500">{blockedCount} dangerous attempts stopped</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">System Status</span>
          <p className="text-xl font-bold font-mono text-indigo-700 mt-0.5">Active</p>
          <span className="text-[10px] text-slate-500">Protecting UPI accounts</span>
        </div>
      </div>

      {/* Control Bar: Filters & Stream toggle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isStreaming
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isStreaming ? "Pause Live Feed" : "Resume Feed"}
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded-md font-semibold ${filter === "ALL" ? "bg-white text-indigo-700 font-bold shadow-2xs" : "text-slate-600"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("CRITICAL")}
              className={`px-2.5 py-1 rounded-md font-semibold ${filter === "CRITICAL" ? "bg-rose-50 text-rose-700 font-bold border border-rose-300" : "text-slate-600"}`}
            >
              Blocked
            </button>
            <button
              onClick={() => setFilter("MODERATE")}
              className={`px-2.5 py-1 rounded-md font-semibold ${filter === "MODERATE" ? "bg-amber-50 text-amber-800 font-bold border border-amber-300" : "text-slate-600"}`}
            >
              Check
            </button>
            <button
              onClick={() => setFilter("SAFE")}
              className={`px-2.5 py-1 rounded-md font-semibold ${filter === "SAFE" ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-300" : "text-slate-600"}`}
            >
              Safe
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search UPI ID or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredFeed.length} payments being checked</span>
          <span className="italic text-indigo-600 font-medium">Click any payment to test in Risk Simulator</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
          {filteredFeed.map((item) => {
            const isBlocked = item.decision === "BLOCK_AND_FREEZE";
            const isStepUp = item.decision === "COOLING_PERIOD" || item.decision === "STEP_UP_2FA";

            return (
              <div
                key={item.id}
                onClick={() => onInspectTransaction(item.fullPayload)}
                className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isBlocked
                      ? "bg-rose-50 border border-rose-200 text-rose-600"
                      : isStepUp
                      ? "bg-amber-50 border border-amber-200 text-amber-600"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-600"
                  }`}>
                    {isBlocked ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{item.id}</span>
                      <span className="text-slate-400 font-normal">· {item.timestamp}</span>
                      <span className="capitalize px-2 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-600 border border-slate-200">
                        {item.channel.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-slate-700 font-mono text-[11px] truncate max-w-sm">
                      <span className="text-slate-500">{item.sender}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="text-slate-900 font-semibold">{item.receiver}</span>
                    </div>
                    {item.flagReason && (
                      <p className="text-[11px] text-amber-800">
                        Notice: {item.flagReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-slate-900">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] font-mono">
                      Risk:{" "}
                      <span className={isBlocked ? "text-rose-700 font-bold" : isStepUp ? "text-amber-700 font-bold" : "text-emerald-700 font-bold"}>
                        {item.riskScore}/100
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 border ${
                    isBlocked
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : isStepUp
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {isBlocked ? "BLOCKED" : isStepUp ? "EXTRA OTP" : "SAFE"}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredFeed.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No transactions matching the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
