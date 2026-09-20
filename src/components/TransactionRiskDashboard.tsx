import React, { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  Search, Filter, TrendingUp, Calendar, ArrowUpRight, 
  CreditCard, Activity, Download, Eye, RefreshCw 
} from "lucide-react";
import { TRANSLATIONS, MULTI_TRANSLATIONS, SupportedLang } from "../utils/translations";

export interface DashboardTransactionItem {
  id: string;
  time: string;
  recipient: string;
  amount: number;
  status: "safe" | "suspicious" | "fraud";
  riskScore: number;
  mlScore: number;
  ruleScore: number;
  factors: string[];
}

const SAMPLE_TRANSACTIONS: DashboardTransactionItem[] = [
  {
    id: "tx-901",
    time: "Today, 11:15 AM",
    recipient: "unverified.lottery@ybl",
    amount: 38000,
    status: "fraud",
    riskScore: 92,
    mlScore: 94,
    ruleScore: 88,
    factors: ["Untrusted new device", "Sudden 35× amount spike", "Flagged recipient VPA"]
  },
  {
    id: "tx-902",
    time: "Today, 10:45 AM",
    recipient: "rohit.kumar@okhdfcbank",
    amount: 7500,
    status: "suspicious",
    riskScore: 62,
    mlScore: 60,
    ruleScore: 68,
    factors: ["First-time beneficiary", "Unusual nighttime transaction hour"]
  },
  {
    id: "tx-903",
    time: "Today, 10:12 AM",
    recipient: "Swiggy Delivery (swiggy@icici)",
    amount: 380,
    status: "safe",
    riskScore: 10,
    mlScore: 8,
    ruleScore: 14,
    factors: ["Frequent established payee", "Standard daytime purchase", "Registered hardware"]
  },
  {
    id: "tx-904",
    time: "Today, 09:30 AM",
    recipient: "Airtel Prepaid Recharge",
    amount: 719,
    status: "safe",
    riskScore: 14,
    mlScore: 12,
    ruleScore: 18,
    factors: ["Routine telecom utility bill", "Known recipient handle"]
  },
  {
    id: "tx-905",
    time: "Yesterday, 11:48 PM",
    recipient: "crypto.swap@paytm",
    amount: 25000,
    status: "fraud",
    riskScore: 89,
    mlScore: 91,
    ruleScore: 85,
    factors: ["High velocity: 8 transactions in 1 hour", "Unusual 2 AM window", "Mule VPA pattern"]
  },
  {
    id: "tx-906",
    time: "Yesterday, 04:20 PM",
    recipient: "Apollo Pharmacy",
    amount: 1420,
    status: "safe",
    riskScore: 15,
    mlScore: 12,
    ruleScore: 22,
    factors: ["Verified merchant QR", "Normal spend bracket"]
  },
  {
    id: "tx-907",
    time: "15 Sep, 02:10 AM",
    recipient: "quick.loan.care@axl",
    amount: 12000,
    status: "suspicious",
    riskScore: 68,
    mlScore: 72,
    ruleScore: 60,
    factors: ["Remote screen sharing pattern detected", "Unregistered UPI ID"]
  }
];

export const TransactionRiskDashboard: React.FC<{ 
  onInspectItem?: (item: DashboardTransactionItem) => void;
  currentLang?: SupportedLang;
}> = ({ onInspectItem, currentLang = "en" }) => {
  const t = MULTI_TRANSLATIONS[currentLang] || MULTI_TRANSLATIONS.en;
  const [filter, setFilter] = useState<"all" | "safe" | "suspicious" | "fraud">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<DashboardTransactionItem | null>(null);

  // Filtered transactions
  const filteredList = SAMPLE_TRANSACTIONS.filter((tx) => {
    if (filter !== "all" && tx.status !== filter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        tx.recipient.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q) ||
        tx.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-rose-200/90 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {currentLang === "te" ? "మొత్తం విశ్లేషించినవి" : "Total Analyzed"}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            1,248
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Activity className="w-3 h-3 text-rose-600" />
            {currentLang === "te" ? "లైవ్ యూపీఐ చెక్కులు" : "Live UPI checks"}
          </span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            {currentLang === "te" ? "సురక్షిత లావాదేవీలు" : "Safe Transactions"}
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            1,092
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            87.5% · {currentLang === "te" ? "ధృవీకరించబడింది" : "Verified OK"}
          </span>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            {currentLang === "te" ? "అనుమానాస్పద లావాదేవీలు" : "Suspicious Flagged"}
          </span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            106
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            8.5% · {currentLang === "te" ? "పరిశీలన కోరబడింది" : "Review prompted"}
          </span>
        </div>

        <div className="bg-white border border-rose-300 rounded-2xl p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
            {currentLang === "te" ? "బ్లాక్ చేయబడిన మోసాలు" : "Fraud Blocked"}
          </span>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">
            50
          </div>
          <span className="text-[11px] text-rose-600 font-medium">
            4.0% · {currentLang === "te" ? "₹18.4లక్షలు రక్షించబడ్డాయి" : "Saved ₹18.4L"}
          </span>
        </div>
      </div>

      {/* Behavioral & Daily Velocity Visual Bar Chart */}
      <div className="bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-700" />
              <span>{currentLang === "te" ? "వారంవారీ రిస్క్ & ఫ్రాడ్ పంపిణీ ట్రెండ్" : "Weekly Risk & Fraud Distribution Trend"}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {currentLang === "te" ? "గత 7 రోజుల్లో ML + రూల్స్ ద్వారా విశ్లేషించబడిన లావాదేవీలు" : "Transactions monitored over the past 7 days with combined ML + Rule scoring"}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {t.statusSafe}
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.statusSuspicious}
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> {t.statusFraud}
            </span>
          </div>
        </div>

        {/* CSS Scaled Bar Chart */}
        <div className="grid grid-cols-7 gap-2 pt-2 text-center text-[11px] font-bold text-slate-600">
          {[
            { day: currentLang === "te" ? "సోమ" : "Mon", safe: 140, susp: 12, fraud: 4 },
            { day: currentLang === "te" ? "మంగళ" : "Tue", safe: 165, susp: 15, fraud: 6 },
            { day: currentLang === "te" ? "బుధ" : "Wed", safe: 190, susp: 18, fraud: 9 },
            { day: currentLang === "te" ? "గురు" : "Thu", safe: 155, susp: 11, fraud: 5 },
            { day: currentLang === "te" ? "శుక్ర" : "Fri", safe: 210, susp: 22, fraud: 12 },
            { day: currentLang === "te" ? "శని" : "Sat", safe: 180, susp: 19, fraud: 8 },
            { day: currentLang === "te" ? "ఆది" : "Sun", safe: 52, susp: 9, fraud: 6 }
          ].map((bar, idx) => {
            const total = bar.safe + bar.susp + bar.fraud;
            return (
              <div key={idx} className="space-y-1.5 flex flex-col items-center">
                <div className="w-full h-28 bg-slate-100 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 gap-0.5 border border-slate-200/80">
                  <div 
                    style={{ height: `${(bar.fraud / 250) * 100}%` }} 
                    className="w-full bg-rose-600 rounded-xs" 
                    title={`Fraud: ${bar.fraud}`}
                  />
                  <div 
                    style={{ height: `${(bar.susp / 250) * 100}%` }} 
                    className="w-full bg-amber-500 rounded-xs" 
                    title={`Suspicious: ${bar.susp}`}
                  />
                  <div 
                    style={{ height: `${(bar.safe / 250) * 100}%` }} 
                    className="w-full bg-emerald-500 rounded-xs" 
                    title={`Safe: ${bar.safe}`}
                  />
                </div>
                <span>{bar.day}</span>
                <span className="text-[10px] text-slate-400 font-mono">{total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filterable Transaction History Section */}
      <div className="bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {currentLang === "te" ? "లావాదేవీల ధృవీకరణ చరిత్ర" : "Transaction Verification History"}
            </h3>
            <p className="text-xs text-slate-500">
              {currentLang === "te" ? "రియల్-టైమ్ రిస్క్ స్కోర్లతో లావాదేవీలను శోధించండి" : "Search and filter analyzed transactions with real-time risk scores"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === "te" ? "యూపీఐ ఐడీ లేదా మొత్తాన్ని వెతకండి..." : "Search UPI ID or amount..."}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-rose-600"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {(["all", "safe", "suspicious", "fraud"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl transition-all capitalize cursor-pointer ${
                filter === mode
                  ? "bg-rose-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mode === "all" ? (currentLang === "te" ? "అన్నీ (1,248)" : "All (1,248)") : mode === "safe" ? (currentLang === "te" ? "🟢 సురక్షితం (1,092)" : "🟢 Safe (1,092)") : mode === "suspicious" ? (currentLang === "te" ? "🟡 అనుమానాస్పదం (106)" : "🟡 Suspicious (106)") : (currentLang === "te" ? "🔴 మోసం (50)" : "🔴 Fraud (50)")}
            </button>
          ))}
        </div>

        {/* Transaction Items List */}
        <div className="space-y-2 pt-1">
          {filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-200 transition-all cursor-pointer bg-white space-y-2 hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    item.status === "safe"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "suspicious"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-rose-100 text-rose-900"
                  }`}>
                    {item.status === "safe" ? <CheckCircle2 className="w-5 h-5" /> : item.status === "suspicious" ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>

                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {item.recipient}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {item.time} · ID: {item.id}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-slate-900 font-mono">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    item.status === "safe"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : item.status === "suspicious"
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "bg-rose-50 text-rose-900 border border-rose-200"
                  }`}>
                    Risk: {item.riskScore}%
                  </span>
                </div>
              </div>

              {/* Accordion Explanations when clicked */}
              {selectedItem?.id === item.id && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
                    <span>🤖 ML Score: <strong>{item.mlScore}%</strong></span>
                    <span>🛡️ Rule Score: <strong>{item.ruleScore}/100</strong></span>
                    <span>⚖️ Combined: <strong>{item.riskScore}%</strong></span>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 text-[11px] block">Triggered Risk Indicators:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      {item.factors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
