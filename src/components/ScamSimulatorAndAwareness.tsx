import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

interface ScamScenario {
  id: string;
  title: string;
  category: "Fake Screenshot" | "QR Scam" | "Screen Share APK" | "Refund / Customer Care";
  sender: string;
  situation: string;
  evidenceText: string;
  correctAction: "verify" | "reject" | "report";
  options: {
    id: "trust" | "verify" | "report";
    label: string;
    description: string;
  }[];
  explanation: string;
  keySafetyTip: string;
}

const SCENARIOS: ScamScenario[] = [
  {
    id: "fake_screen_1",
    title: "OLX Buyer sends Payment Screenshot",
    category: "Fake Screenshot",
    sender: "Buyer on WhatsApp: +91 98490 XXXXX",
    situation: "You are selling your bicycle for ₹6,500. The buyer sends a screenshot showing 'Payment Successful - ₹6,500 sent to your UPI ID' and asks you to immediately hand over the bicycle to their delivery guy.",
    evidenceText: "Screenshot font looks slightly blurred around the amount '₹6,500' and your bank balance SMS has not arrived yet.",
    correctAction: "verify",
    options: [
      { id: "trust", label: "Trust screenshot", description: "Hand over the bicycle because the screenshot has a green tick." },
      { id: "verify", label: "Check bank balance first", description: "Open your bank app directly to verify actual credit." },
      { id: "report", label: "Report as fake fraud", description: "Block the user and flag the fake screenshot to SafeUPI." }
    ],
    explanation: "Fake payment generator apps create realistic payment screens in seconds. Never rely on a screenshot or green tick—always check your actual bank account balance or statement before releasing goods.",
    keySafetyTip: "Screenshots can be fabricated with ease. Only trust credits visible inside your official banking application."
  },
  {
    id: "qr_receive_trap",
    title: "Scan QR Code to 'Receive' Prize Money",
    category: "QR Scam",
    sender: "SMS: 'Reward Points Cashback'",
    situation: "You receive a message claiming you won a ₹3,000 lottery cashback. The caller instructs: 'Open your UPI app, scan this QR code, and enter your 6-digit UPI PIN to claim your refund directly into your bank.'",
    evidenceText: "QR payload shows: upi://pay?pa=cashbackrewards@ybl&am=3000&pn=ClaimReward",
    correctAction: "report",
    options: [
      { id: "trust", label: "Scan & Enter PIN", description: "Enter UPI PIN quickly so the money transfers into your account." },
      { id: "verify", label: "Ask bank customer care", description: "Wait and call your branch." },
      { id: "report", label: "Refuse & Report Scam", description: "Never scan QR or enter PIN to receive money!" }
    ],
    explanation: "Fundamental UPI Golden Rule: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering your PIN always deducts money from your account.",
    keySafetyTip: "PIN is for paying, not receiving. If anyone asks for your PIN to send you money, it is 100% a scam."
  },
  {
    id: "screen_share_apk",
    title: "Bank KYC Support asking for 'AnyDesk' App",
    category: "Screen Share APK",
    sender: "Caller posing as Bank Nodal Officer",
    situation: "A caller claims your UPI ID is expiring in 2 hours due to pending KYC. They ask you to install an app like 'QuickSupport' or 'AnyDesk' to help you complete live video KYC from home.",
    evidenceText: "Caller insists: 'Just share the 9-digit code displayed on screen so our bank officer can verify your settings.'",
    correctAction: "report",
    options: [
      { id: "trust", label: "Install app & share code", description: "Follow instructions to avoid your UPI account being blocked." },
      { id: "verify", label: "Open app in mute", description: "Install it but don't enter bank details." },
      { id: "report", label: "Disconnect & Report to 1930", description: "Bank employees never ask you to install remote screen sharing software." }
    ],
    explanation: "Remote access tools (AnyDesk, TeamViewer, RustDesk) allow scammers to watch your screen in real time, capturing OTPs and bank credentials while you type.",
    keySafetyTip: "Never install remote desktop apps at the instruction of unknown callers, even if they claim to be from your bank or police."
  }
];

export const ScamSimulatorAndAwareness: React.FC = () => {
  const t = TRANSLATIONS;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<"trust" | "verify" | "report" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const scenario = SCENARIOS[selectedIdx];

  const handleSelectOption = (choice: "trust" | "verify" | "report") => {
    setUserChoice(choice);
    setShowResult(true);
    if (choice === scenario.correctAction || (choice === "report" && scenario.correctAction === "verify")) {
      setScore(prev => prev + 1);
    }
    setCompletedCount(prev => Math.max(prev, selectedIdx + 1));
  };

  const handleNext = () => {
    setUserChoice(null);
    setShowResult(false);
    setSelectedIdx((prev) => (prev + 1) % SCENARIOS.length);
  };

  const isCorrect = userChoice === scenario.correctAction || (userChoice === "report" && scenario.correctAction === "verify");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-rose-800/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Interactive Cyber Scam Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Scam Detection Hands-on Lab
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 mt-1 max-w-xl">
              Put yourself in common UPI fraud situations. Test your instincts before real money is at stake.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15 min-w-[120px]">
            <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block">
              Awareness Score
            </span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {score} / {SCENARIOS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-200">
              {scenario.category}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Scenario {selectedIdx + 1} of {SCENARIOS.length}
            </span>
          </div>
          <button
            onClick={() => {
              setUserChoice(null);
              setShowResult(false);
              setSelectedIdx(0);
              setScore(0);
            }}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900">
            {scenario.title}
          </h3>

          <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 text-xs text-slate-800 space-y-1.5">
            <div className="font-semibold text-rose-900 flex items-center gap-1">
              <span>👤 Sender Context:</span>
              <span className="font-normal text-slate-700">{scenario.sender}</span>
            </div>
            <p className="leading-relaxed">{scenario.situation}</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Noticeable Clue:</strong>
              <span>{scenario.evidenceText}</span>
            </div>
          </div>
        </div>

        {/* User Choice Options */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            What action would you take?
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {scenario.options.map((opt) => (
              <button
                key={opt.id}
                disabled={showResult}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                  userChoice === opt.id
                    ? isCorrect
                      ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300"
                      : "bg-rose-50 border-rose-400 ring-2 ring-rose-300"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{opt.description}</div>
                </div>
                {userChoice === opt.id && (
                  <span className="shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Feedback Card */}
        {showResult && (
          <div className={`p-4 rounded-2xl border animate-in fade-in space-y-2.5 text-xs ${
            isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
          }`}>
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Correct Security Decision! +1 Point</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Risky Choice! You could have lost money.</span>
                </>
              )}
            </div>

            <p className="leading-relaxed">{scenario.explanation}</p>

            <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-start gap-2 font-medium text-slate-800">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Golden Rule:</strong> {scenario.keySafetyTip}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 Golden Security Awareness Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">1</span>
            <span>No PIN to Receive</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            UPI PIN is strictly for authenticating outgoing debits. You never enter a PIN to receive refunds or prizes.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">2</span>
            <span>Verify Beneficiary Name</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Before entering PIN, check the registered banking name on the UPI prompt—not just the nickname or phone number.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">3</span>
            <span>1930 Golden 24 Hours</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dial 1930 within the first 24 hours to freeze destination mule accounts before scammers can withdraw cash at ATMs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">4</span>
            <span>Reject Remote Screen Apps</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Never install AnyDesk or QuickSupport at the request of anyone claiming to be bank or courier customer care.
          </p>
        </div>
      </div>
    </div>
  );
};
