import React, { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, PhoneCall, ExternalLink, Download, 
  Printer, CheckCircle2, Clock, FileText, ChevronRight, AlertTriangle, 
  Landmark, ArrowUpRight, Copy, Check, PlusCircle 
} from "lucide-react";
import { TRANSLATIONS, MULTI_TRANSLATIONS, SupportedLang } from "../utils/translations";

export interface RecoveryCase {
  caseId: string;
  amount: number;
  recipientVpa: string;
  utrNumber: string;
  bankName: string;
  incidentDate: string;
  currentStage: number; // 1 to 5
  ackNumber?: string;
  notes: string;
}

export const RecoveryTrackerHub: React.FC<{ 
  onOpenBankModal?: () => void;
  currentLang?: SupportedLang;
}> = ({ onOpenBankModal, currentLang = "en" }) => {
  const t = MULTI_TRANSLATIONS[currentLang] || MULTI_TRANSLATIONS.en;

  const [cases, setCases] = useState<RecoveryCase[]>([
    {
      caseId: "UPI-2026-8812",
      amount: 14500,
      recipientVpa: "scam.refund@axis",
      utrNumber: "428910992314",
      bankName: "State Bank of India (SBI)",
      incidentDate: "17 Sep 2026, 02:15 AM",
      currentStage: 3,
      ackNumber: "CYB-2026-TEL-9941",
      notes: "Destination bank (Axis Bank) account frozen under Section 102 CrPC via 1930 portal ticket."
    }
  ]);

  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [copiedAck, setCopiedAck] = useState(false);
  const [isLoggingNew, setIsLoggingNew] = useState(false);

  // New Case Form state
  const [newAmount, setNewAmount] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newUtr, setNewUtr] = useState("");
  const [newBank, setNewBank] = useState("HDFC Bank");
  const [newNotes, setNewNotes] = useState("");

  const currentCase = cases[activeCaseIdx] || cases[0];

  const stages = [
    { num: 1, title: t.stage1ReportCreated, desc: currentLang === "te" ? "లావాదేవీ వివరాలు మరియు డిజిటల్ సాక్ష్యాలు రూపొందించబడ్డాయి" : "Structured incident details and digital timestamps prepared" },
    { num: 2, title: t.stage2BankContacted, desc: currentLang === "te" ? "యూపీఐ రీఫండ్ / ఛార్జ్‌బ్యాక్ కోసం పంపిన బ్యాంక్‌ను హెచ్చరించారు" : "Originating bank alerted to initiate UPI chargeback request" },
    { num: 3, title: t.stage3ComplaintSubmitted, desc: currentLang === "te" ? "జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్ (1930) అక్నాలెడ్జ్‌మెంట్ నమోదైంది" : "National Cyber Crime Reporting Portal acknowledgement registered" },
    { num: 4, title: t.stage4Investigation, desc: currentLang === "te" ? "మోసపూరిత ఖాతాను గుర్తించి నోడల్ ఆఫీసర్ స్తంభింపజేస్తున్నారు" : "Destination beneficiary bank identifying and freezing mule accounts" },
    { num: 5, title: t.stage5RecoveryUpdate, desc: currentLang === "te" ? "కోర్టు / బ్యాంక్ ఆదేశాలతో వెనక్కి జమ చేయడం" : "Judicial refund mandate / magistrate order for reverse credit" }
  ];

  const handleAdvanceStage = (caseIdx: number) => {
    setCases(prev => prev.map((c, idx) => {
      if (idx === caseIdx && c.currentStage < 5) {
        return { ...c, currentStage: c.currentStage + 1 };
      }
      return c;
    }));
  };

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newRecipient) return;

    const newCaseObj: RecoveryCase = {
      caseId: `UPI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: parseFloat(newAmount) || 5000,
      recipientVpa: newRecipient,
      utrNumber: newUtr || `42${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      bankName: newBank,
      incidentDate: new Date().toLocaleString(),
      currentStage: 1,
      notes: newNotes || "Initial report filed via SafeUPI Emergency Recovery."
    };

    setCases([newCaseObj, ...cases]);
    setActiveCaseIdx(0);
    setIsLoggingNew(false);
    setNewAmount("");
    setNewRecipient("");
    setNewUtr("");
    setNewNotes("");
  };

  const handlePrintComplaint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-rose-800/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
              <span>{t.recoveryTrackerTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {t.recoveryTrackerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 mt-1 max-w-xl">
              {currentLang === "te" 
                ? "లావాదేవీ ఆధారాలను సేకరించండి, బ్యాంక్ & 1930 హెల్ప్‌లైన్‌కు ఫిర్యాదు చేసి రికవరీ పురోగతిని ట్రాక్ చేయండి."
                : currentLang === "hi"
                ? "लेनदेन साक्ष्य व्यवस्थित करें, बैंक और 1930 हेल्पलाइन पर शिकायत करें और रिकवरी की प्रगति ट्रैक करें।"
                : "Organize transaction evidence, file with Bank & 1930 Helpline, and track step-by-step account freeze progress."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggingNew(!isLoggingNew)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-rose-700" />
            <span>{isLoggingNew ? (currentLang === "te" ? "యాక్టివ్ కేసులు చూడండి" : "View Active Cases") : (currentLang === "te" ? "డబ్బు నష్టాన్ని నివేదించండి" : "Report Lost Money")}</span>
          </button>
        </div>
      </div>

      {/* New Incident Logger Form (Conditional) */}
      {isLoggingNew && (
        <form onSubmit={handleCreateNewCase} className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 animate-in fade-in">
          <div className="border-b border-rose-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span>Log a New UPI Fraud Loss</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the transaction details to generate an official complaint dossier for 1930 Cyber Cell.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount Lost (₹) *
              </label>
              <input
                type="number"
                required
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scammer UPI ID / Beneficiary *
              </label>
              <input
                type="text"
                required
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="e.g. fraudpay@ybl"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                UPI Reference / UTR Number (12 Digits)
              </label>
              <input
                type="text"
                value={newUtr}
                onChange={(e) => setNewUtr(e.target.value)}
                placeholder="e.g. 428901239845"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Debited Bank
              </label>
              <select
                value={newBank}
                onChange={(e) => setNewBank(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-rose-600"
              >
                <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Incident Summary (What happened?)
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Received fake OLX QR code, scammer urged to enter PIN for advance payment."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-rose-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsLoggingNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs"
            >
              Create Recovery Case File
            </button>
          </div>
        </form>
      )}

      {/* Case Overview & Progress Tracker Card */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        {/* Case ID Badge & Quick Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-200">
                Case #{currentCase.caseId}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentCase.incidentDate}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              ₹{currentCase.amount.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-slate-600 ml-2">
                sent to <strong className="text-slate-800">{currentCase.recipientVpa}</strong>
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintComplaint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{currentLang === "te" ? "పోలీస్ ఫిర్యాదు ముద్రించండి" : "Print Police Complaint"}</span>
            </button>

            <a
              href="tel:1930"
              className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{currentLang === "te" ? "1930 కు కాల్ చేయండి" : "Dial 1930"}</span>
            </a>
          </div>
        </div>

        {/* 5 Stages Stepper */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {t.caseStatus} · 5 Stages
          </span>

          <div className="space-y-2.5">
            {stages.map((stage) => {
              const isDone = currentCase.currentStage >= stage.num;
              const isCurrent = currentCase.currentStage === stage.num;

              return (
                <div
                  key={stage.num}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isCurrent
                      ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                      : isDone
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-slate-50/70 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {isDone ? <Check className="w-4 h-4" /> : stage.num}
                    </div>

                    <div>
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                        <span>{stage.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 animate-pulse">
                            {currentLang === "te" ? "ప్రక్రియలో ఉంది" : "In Progress"}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>

                  {isCurrent && stage.num < 5 && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(activeCaseIdx)}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold shrink-0 cursor-pointer"
                    >
                      {currentLang === "te" ? "పూర్తయినట్లు గుర్తించండి" : "Mark Completed"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reference & Evidence Details Box */}
        <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 font-mono text-xs text-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">{t.upiRefId}</span>
            <span className="font-bold text-slate-900">{currentCase.utrNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">{t.fromBankText}</span>
            <span className="font-medium text-slate-800">{currentCase.bankName}</span>
          </div>
          {currentCase.ackNumber && (
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">{currentLang === "te" ? "1930 అక్నాలెడ్జ్‌మెంట్ నంబర్:" : "1930 Acknowledgement #:"}</span>
              <span className="font-bold text-emerald-800">{currentCase.ackNumber}</span>
            </div>
          )}
          <div className="pt-2 border-t border-rose-100 font-sans text-[11px] text-slate-600">
            <strong>{t.noteText}</strong> {currentCase.notes}
          </div>
        </div>

        {/* Realism Disclaimer on Recovery */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
          <strong className="font-bold text-slate-900 block mb-0.5">
            {currentLang === "te" ? "పారదర్శకత గమనిక:" : "Important Transparency Note:"}
          </strong>
          {currentLang === "te" 
            ? "SafeUPI అధికారిక బ్యాంకింగ్ మరియు 1930 సైబర్ క్రైమ్ విభాగాలకు సమగ్ర సాక్ష్యాధారాల నివేదికను వెంటనే తయారు చేస్తుంది. మొదటి 24 గంటలలో ఫిర్యాదు చేయడం వలన నేరగాళ్ల ఖాతాలు స్తంభింపజేయబడే అవకాశాలు గణనీయంగా పెరుగుతాయి."
            : "SafeUPI facilitates automated evidence collation and structured reporting to official banking and cyber crime authorities. While reporting within 24 hours drastically improves freeze rates of beneficiary accounts, recovery relies on bank and judicial cooperation under RBI circulars."}
        </div>
      </div>
    </div>
  );
};
