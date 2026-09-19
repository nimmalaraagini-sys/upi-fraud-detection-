import React from "react";
import { Cpu, Layers, ShieldCheck, AlertTriangle, BookOpen, CheckCircle, Lock } from "lucide-react";

export const RulesMatrixModal: React.FC = () => {
  const rules = [
    {
      code: "RULE_SCREENS_01",
      name: "Screen Sharing App Detected (AnyDesk / TeamViewer)",
      category: "Phone Security",
      impact: "+45 pts",
      severity: "CRITICAL",
      description: "Detects if a screen-sharing app is running. Scammers use this to see your UPI PIN while you type it.",
      remedy: "Disconnects the payment immediately and warns you to close the screen-sharing app."
    },
    {
      code: "RULE_COLLECT_02",
      name: "Fake 'Receive Money' Request Trap",
      category: "Payment Type",
      impact: "+35 pts",
      severity: "HIGH",
      description: "A collect request from a stranger. Scammers trick you into believing entering your UPI PIN will receive money, when in reality it debits your account.",
      remedy: "Shows a large warning: 'YOU ARE SENDING MONEY, NOT RECEIVING IT!' and blocks the request."
    },
    {
      code: "RULE_NEW_BENEF_03",
      name: "Large Payment to Brand New Account (<24 hrs old)",
      category: "Receiver Trust",
      impact: "+30 pts",
      severity: "CRITICAL",
      description: "Sending ₹10,000+ to an account created just hours ago. Scammers create temporary accounts to quickly grab money.",
      remedy: "Holds the payment for 4 hours to protect your funds and verify the receiver."
    },
    {
      code: "RULE_INTEGRITY_04",
      name: "Modified or Unsafe Phone Operating System",
      category: "Phone Security",
      impact: "+30 pts",
      severity: "CRITICAL",
      description: "The payment app is running on a modified or rooted device where malicious spyware could steal your bank PIN.",
      remedy: "Blocks payments until the app is run on an official, secure phone."
    },
    {
      code: "RULE_VELOCITY_05",
      name: "Too Many Rapid Payments in 10 Minutes",
      category: "Payment Speed",
      impact: "+28 pts",
      severity: "HIGH",
      description: "4 or more payments attempted back-to-back within 10 minutes, typical when scammers are rushing to drain an account.",
      remedy: "Temporarily pauses payments and asks for fingerprint or face verification."
    },
    {
      code: "RULE_DEVICE_09",
      name: "Payment on New Phone Right After SIM Change",
      category: "Phone Check",
      impact: "+25 pts",
      severity: "HIGH",
      description: "A payment from a new phone within 24 hours of changing SIM cards (a common sign of SIM-swap scams).",
      remedy: "Limits payments to ₹5,000 for the first 24 hours per safety guidelines."
    },
    {
      code: "RULE_AMOUNT_06",
      name: "Amount Is 2x Higher Than Your Usual Highest Payment",
      category: "Payment Amount",
      impact: "+25 pts",
      severity: "HIGH",
      description: "The payment amount is more than double the highest payment you have ever made from this account.",
      remedy: "Asks for a bank OTP or NetBanking password to verify it's really you."
    },
    {
      code: "RULE_LOCATION_08",
      name: "Sudden Location Jump (>500 km away)",
      category: "Location Check",
      impact: "+18 pts",
      severity: "MEDIUM",
      description: "Payment initiated from a city hundreds of kilometers away without regular travel signals.",
      remedy: "Verifies mobile network roaming status before releasing payment."
    },
    {
      code: "RULE_TIME_07",
      name: "Unusual Late Night Transfer (1 AM - 5 AM)",
      category: "Time Check",
      impact: "+15 pts",
      severity: "MEDIUM",
      description: "A large transfer during late night hours when you are normally asleep.",
      remedy: "Pauses payment for a short 15-minute confirmation delay."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          How Our Safety System Protects Your Money
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          We combine instant safety rules with smart pattern detection to stop scammers in milliseconds before any money leaves your bank.
        </p>
      </div>

      {/* 3 Pillars Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">1. Instant Red Flags</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stops dangerous actions right away (like AnyDesk screen sharing, fake collect requests, or modified phone software).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">2. Smart Behavior Check</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Catches unusual activity, like sending 10x more money than your monthly habit, rapid back-to-back transfers, or payments at 3 AM.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">3. Clear Advice & Action</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explains in simple words why the payment was stopped and gives you direct emergency numbers (like Helpline 1930) to stay safe.
          </p>
        </div>
      </div>

      {/* Rules Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Safety Rules & Protection Actions
          </h3>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
            {rules.length} Active Safety Checks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Safety Rule</th>
                <th className="p-3">Category</th>
                <th className="p-3">Danger Level</th>
                <th className="p-3">Risk Added</th>
                <th className="p-3">What It Catches</th>
                <th className="p-3">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((r) => (
                <tr key={r.code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                    <div>{r.name}</div>
                    <div className="text-[10px] font-mono text-indigo-600 font-normal">{r.code}</div>
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{r.category}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      r.severity === "CRITICAL"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : r.severity === "HIGH"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-rose-600 whitespace-nowrap">{r.impact}</td>
                  <td className="p-3 text-slate-600 max-w-xs leading-relaxed">{r.description}</td>
                  <td className="p-3 text-slate-700 max-w-xs leading-relaxed font-medium">{r.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
