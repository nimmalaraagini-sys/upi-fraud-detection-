import React, { useState } from "react";
import { 
  Search, ShieldAlert, ArrowRight, CheckCircle2, Clock, 
  AlertTriangle, Database, FileText, PhoneCall, Copy, Check,
  Layers, RefreshCw, Lock, DollarSign, Activity
} from "lucide-react";

interface HopNode {
  step: number;
  entity: string;
  bankOrNetwork: string;
  vpaOrAddress: string;
  amount: number;
  status: "DEBITED" | "FROZEN_LIEN" | "PARTIALLY_FROZEN" | "CASHOUT_CRYPTO" | "TRACED_ON_CHAIN";
  timeOffset: string;
  actionTaken: string;
}

export const FundTracebackSimulator: React.FC = () => {
  // Input parameters
  const [rrn, setRrn] = useState("428901829301");
  const [amount, setAmount] = useState(48500);
  const [victimVpa, setVictimVpa] = useState("priya.nair@oksbi");
  const [victimBank, setVictimBank] = useState("State Bank of India");
  const [minutesElapsed, setMinutesElapsed] = useState(35); // 35 minutes into the Golden Hour
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic recovery odds calculation based on elapsed time & RBI protocols
  const calculateRecoveryOdds = (mins: number) => {
    if (mins <= 60) return { pct: 92, label: "EXCELLENT CHANCE (First 60 Minutes - Act Now!)", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300" };
    if (mins <= 180) return { pct: 68, label: "MODERATE CHANCE (Scammers moving money between banks)", color: "text-amber-800", bg: "bg-amber-50 border-amber-300" };
    if (mins <= 360) return { pct: 41, label: "DIFFICULT (Money is being converted to crypto)", color: "text-orange-800", bg: "bg-orange-50 border-orange-300" };
    return { pct: 18, label: "VERY HARD (Cash withdrawn at ATMs)", color: "text-rose-700", bg: "bg-rose-50 border-rose-300" };
  };

  const odds = calculateRecoveryOdds(minutesElapsed);

  // RBI liability determination in plain English
  const daysElapsed = Math.floor(minutesElapsed / (60 * 24));
  const rbiLiability = daysElapsed <= 3 
    ? { 
        text: "YOU ARE NOT LIABLE TO PAY (100% Refund Guarantee)", 
        sub: "Because you reported within 3 days, RBI rules mandate your bank must refund your money within 10 working days.", 
        badge: "bg-emerald-600 text-white font-bold" 
      }
    : daysElapsed <= 7
    ? { 
        text: "LIMITED LIABILITY (Maximum ₹10,000 loss)", 
        sub: "Reported within 4 to 7 days. Your bank covers the rest of the loss.", 
        badge: "bg-amber-500 text-white font-bold" 
      }
    : { 
        text: "BANK REVIEW REQUIRED", 
        sub: "Reported after 7 days. You may need to escalate to the RBI Banking Ombudsman.", 
        badge: "bg-rose-600 text-white font-bold" 
      };

  // Multi-hop fund trail in simple terms
  const hops: HopNode[] = [
    {
      step: 0,
      entity: "Your Bank Account",
      bankOrNetwork: victimBank,
      vpaOrAddress: victimVpa,
      amount: amount,
      status: "DEBITED",
      timeOffset: "0 min (Scam happens)",
      actionTaken: "Money was deducted from your account via UPI."
    },
    {
      step: 1,
      entity: "Scammer's 1st Bank Account (Mule)",
      bankOrNetwork: "Kotak Mahindra Bank",
      vpaOrAddress: "fast_refund_support99@kotak",
      amount: amount,
      status: minutesElapsed <= 45 ? "FROZEN_LIEN" : "PARTIALLY_FROZEN",
      timeOffset: "3 mins later",
      actionTaken: minutesElapsed <= 45 
        ? "Cyber Helpline 1930 sent an instant freeze order. Money is 100% LOCKED in this account!"
        : "Scammer withdrew part of the money before the freeze order arrived."
    },
    {
      step: 2,
      entity: "Scammer's 2nd Bank Account (Layering)",
      bankOrNetwork: "Canara Bank / Quick Transfer",
      vpaOrAddress: "suraj.yadav.student@cnrb",
      amount: Math.round(amount * 0.6),
      status: minutesElapsed <= 90 ? "FROZEN_LIEN" : "PARTIALLY_FROZEN",
      timeOffset: "9 mins later",
      actionTaken: "Police freeze notice sent to Canara Bank to stop remaining funds."
    },
    {
      step: 3,
      entity: "Online Crypto Exchange / Cash Out",
      bankOrNetwork: "Crypto USDT Blockchain",
      vpaOrAddress: "TX9z...W8mK (Crypto Wallet)",
      amount: Math.round(amount * 0.4),
      status: minutesElapsed > 120 ? "CASHOUT_CRYPTO" : "TRACED_ON_CHAIN",
      timeOffset: "18 mins later",
      actionTaken: "Crypto wallet flagged on police databases so the scammer cannot sell it."
    }
  ];

  const handleSimulateNew = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleCopyGrievance = () => {
    const letter = `To: The Branch Manager / Nodal Officer
Bank: ${victimBank}

SUBJECT: Urgent Complaint - Unauthorized UPI Scam Transaction (Request for Refund under RBI Guidelines)

Dear Branch Manager,

I am writing to report a fraudulent UPI transaction that was deducted from my account without my valid authorization:

- Bank Reference Number (UTR / RRN): ${rrn}
- Disputed Amount: INR ${amount.toLocaleString("en-IN")}
- My UPI ID: ${victimVpa}
- Time of Reporting: Within ${minutesElapsed} minutes of the incident
- Cyber Crime Complaint ID: 1930-ACK-${rrn.slice(0, 8)}

As per the Reserve Bank of India (RBI) rules on "Customer Protection - Limiting Liability of Customers in Unauthorised Electronic Banking Transactions":
1. Since I have notified the bank within 3 days of this unauthorized transaction, I have ZERO CUSTOMER LIABILITY.
2. The bank is required by RBI to provide a full shadow credit / refund within 10 working days.
3. An official stop-payment / freeze request has also been filed through the National Cyber Crime Helpline (1930).

Please immediately freeze the receiver's account, reverse this unauthorized debit of INR ${amount.toLocaleString("en-IN")}, and confirm receipt of this letter.

Sincerely,
Account Holder (${victimVpa})`;

    navigator.clipboard.writeText(letter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Trace Lost Money & How to Get It Back
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            See where stolen money goes, why the first 60 minutes ("Golden Hour") are crucial, and generate an official refund request letter for your bank under RBI rules.
          </p>
        </div>

        <button
          onClick={handleSimulateNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
          Refresh Money Trail
        </button>
      </div>

      {/* Inputs & Golden Hour Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Search className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Enter Details of Lost Money
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount of Money Lost (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-slate-900 font-mono text-base font-bold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Transaction Ref No. (UTR / RRN)
              </label>
              <input
                type="text"
                value={rrn}
                onChange={(e) => setRrn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your Bank Name
              </label>
              <input
                type="text"
                value={victimBank}
                onChange={(e) => setVictimBank(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Your UPI ID
            </label>
            <input
              type="text"
              value={victimVpa}
              onChange={(e) => setVictimVpa(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none"
            />
          </div>

          {/* Time Elapsed Interactive Slider (0 to 360 mins) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                How long ago did this happen?
              </span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {minutesElapsed} mins ago
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="360"
              step="5"
              value={minutesElapsed}
              onChange={(e) => setMinutesElapsed(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Just now</span>
              <span className="text-emerald-700 font-bold">Within 60 mins (Best Time)</span>
              <span>3 hours</span>
              <span className="text-rose-700 font-semibold">6 hours+</span>
            </div>
          </div>

          {/* Recovery Likelihood Card */}
          <div className={`p-4 rounded-xl border ${odds.bg} space-y-2 shadow-2xs`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Chance of Recovering Money
              </span>
              <span className={`text-base font-mono font-extrabold ${odds.color}`}>
                {odds.pct}% Probability
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  odds.pct > 75 ? "bg-emerald-600" : odds.pct > 40 ? "bg-amber-500" : "bg-rose-600"
                }`}
                style={{ width: `${odds.pct}%` }}
              />
            </div>
            <p className="text-xs text-slate-700">
              Status: <strong className="text-slate-900">{odds.label}</strong>
            </p>
          </div>
        </div>

        {/* Right Column: Multi-Hop Trail Graph (7 cols) */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Step-by-Step Money Trail
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Where your money moves
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {hops.map((hop) => {
              const isLien = hop.status === "FROZEN_LIEN";
              const isCrypto = hop.status === "CASHOUT_CRYPTO" || hop.status === "TRACED_ON_CHAIN";

              return (
                <div key={hop.step} className="relative pl-8 space-y-1">
                  {/* Step bullet */}
                  <div className={`absolute left-1 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isLien
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-100"
                      : isCrypto
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-100"
                      : "bg-slate-600 text-white"
                  }`}>
                    {hop.step}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900">
                        {hop.entity}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500">{hop.timeOffset}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isLien 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : isCrypto
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-200 text-slate-700"
                        }`}>
                          {isLien ? "ACCOUNT FROZEN" : hop.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-700 flex flex-wrap items-center gap-2">
                      <span className="text-indigo-700 font-semibold">{hop.bankOrNetwork}</span>
                      <span>·</span>
                      <span className="text-slate-500 truncate max-w-xs">{hop.vpaOrAddress}</span>
                      <span className="ml-auto font-bold text-slate-900">₹{hop.amount.toLocaleString("en-IN")}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 leading-tight">
                      {hop.actionTaken}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RBI Customer Protection Status Banner */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${rbiLiability.badge}`}>
                {rbiLiability.text}
              </span>
              <p className="text-[11px] text-slate-600 mt-1">
                {rbiLiability.sub}
              </p>
            </div>
            <button
              onClick={handleCopyGrievance}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
            >
              {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLetter ? "Letter Copied!" : "Copy Bank Refund Letter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
