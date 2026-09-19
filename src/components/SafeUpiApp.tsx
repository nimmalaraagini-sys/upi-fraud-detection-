import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, HelpCircle, 
  PhoneCall, ExternalLink, Copy, Check, ArrowRight, 
  RotateCcw, Sparkles, Clock, Lock, Zap, FileText, ChevronRight,
  AlertCircle, CreditCard, Send, Smartphone, Landmark,
  X, Download, Share2, RefreshCw, KeyRound, QrCode, Camera,
  Cpu, Activity, BarChart3, AlertOctagon, CheckSquare, Play
} from "lucide-react";
import { BankHelplineModal } from "./BankHelplineModal";
import { TransactionScreenshotUploader } from "./TransactionScreenshotUploader";
import { QrCodeScannerModal, DecodedUpiQr } from "./QrCodeScannerModal";
import { RiskMeterAndExplainability, RiskFactorItem } from "./RiskMeterAndExplainability";
import { ScreenshotScanResult } from "../types";
import { TRANSLATIONS } from "../utils/translations";
import { ScamSimulatorAndAwareness } from "./ScamSimulatorAndAwareness";
import { RecoveryTrackerHub } from "./RecoveryTrackerHub";
import { TransactionRiskDashboard } from "./TransactionRiskDashboard";
import { TechnicalJuryModal } from "./TechnicalJuryModal";
import { InteractiveDemoModal } from "./InteractiveDemoModal";
import { downloadDemoVideoHtml } from "../utils/downloadDemoAssets";

export type ScreenState = 
  | "HOME" 
  | "CHECKING" 
  | "RESULT_APPROVED" 
  | "RESULT_REVIEW" 
  | "RESULT_BLOCKED" 
  | "CONFIRMED_BY_ME" 
  | "RECOVERY_FLOW"
  | "PIN_ENTRY"
  | "PAYMENT_SUCCESS";

export interface RecentCheck {
  id: string;
  amount: number;
  recipient: string;
  time: string;
  status: "approved" | "reviewed" | "blocked" | "confirmed";
  label: string;
  reasons?: string[];
  utr?: string;
}

interface SafeUpiAppProps {
  onOpenTraceback?: () => void;
  onOpenHowToUse?: () => void;
  onOpenSafetyRules?: () => void;
}

export const SafeUpiApp: React.FC<SafeUpiAppProps> = ({
  onOpenTraceback,
  onOpenHowToUse,
  onOpenSafetyRules
}) => {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("HOME");

  // Main App Navigation: Pay & Check, Screenshot/QR Verify, Dashboard & History, Recovery Tracker, Scam Simulator
  const [mainTab, setMainTab] = useState<"pay" | "verify" | "dashboard" | "recovery" | "simulator">("pay");

  // Static English Translations
  const t = TRANSLATIONS;

  // Technical Jury Modal View State
  const [isJuryModalOpen, setIsJuryModalOpen] = useState<boolean>(false);

  // Interactive Demo Video Walkthrough State
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState<boolean>(false);

  // Dual-Engine Scores (70% ML Random Forest + 30% Deterministic Rule Engine)
  const [mlScore, setMlScore] = useState<number>(54);
  const [ruleScore, setRuleScore] = useState<number>(66);

  // Sub-mode: "pay" (In-app Live Payment Transmitter) vs "check" (Pre-payment checker)
  const [activeTabMode, setActiveTabMode] = useState<"pay" | "check">("pay");

  // Payment Form Inputs
  const [amount, setAmount] = useState<number>(5000);
  const [recipient, setRecipient] = useState<string>("friend@upi");
  const [paymentNote, setPaymentNote] = useState<string>("Personal transfer");
  const [selectedBank, setSelectedBank] = useState<string>("HDFC Bank (•••• 4021)");
  const [timeStr, setTimeStr] = useState<string>("02:00 AM");
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false);
  const [isNewRecipient, setIsNewRecipient] = useState<boolean>(false);

  // QR Scanner State
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [scannedQrNotification, setScannedQrNotification] = useState<string | null>(null);

  // Risk Score & Explainability State
  const [currentRiskScore, setCurrentRiskScore] = useState<number>(58);
  const [currentRiskFactors, setCurrentRiskFactors] = useState<RiskFactorItem[]>([]);

  // 3-Tier Recovery State ("instant" = stopped before money left, "recent" = < 24h, "delayed" = > 24h)
  const [recoveryTier, setRecoveryTier] = useState<"instant" | "recent" | "delayed">("recent");
  const [reportedConfirmed, setReportedConfirmed] = useState<boolean>(false);

  // Handle QR code scanner payload
  const handleQrScanned = (data: DecodedUpiQr) => {
    setRecipient(data.vpa);
    if (data.amount && data.amount > 0) {
      setAmount(data.amount);
    }
    if (data.note) {
      setPaymentNote(data.note);
    }
    setActiveTabMode("pay");
    setScannedQrNotification(`Scanned QR: ${data.name} (${data.vpa})`);
    setTimeout(() => {
      setScannedQrNotification(null);
    }, 6000);
  };

  // UPI PIN Entry State
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [completedUtr, setCompletedUtr] = useState<string>("");

  // Active checking animation step
  const [checkingProgress, setCheckingProgress] = useState<number>(3); // 1 to 5 dots
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [copiedTxnDetails, setCopiedTxnDetails] = useState<boolean>(false);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);

  // Active check reasons
  const [currentReasons, setCurrentReasons] = useState<string[]>([]);
  const [generatedTxnId, setGeneratedTxnId] = useState<string>("UPI-4289-8832");

  // Recent checks / payments list (Screen 6)
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>([
    {
      id: "chk-1",
      amount: 250,
      recipient: "Swiggy",
      time: "01:15 PM",
      status: "approved",
      label: "Normal · Paid",
      reasons: ["Sent on your usual device, at a normal time."],
      utr: "425988102941"
    },
    {
      id: "chk-2",
      amount: 4800,
      recipient: "unknown@axis",
      time: "11:42 PM",
      status: "confirmed",
      label: "Confirmed by you",
      reasons: ["Amount higher than usual ₹400", "Night time transfer"]
    },
    {
      id: "chk-3",
      amount: 9999,
      recipient: "support_refund99@upi",
      time: "03:10 AM",
      status: "blocked",
      label: "Blocked Before Send",
      reasons: ["Amount 20x your usual", "Sent to a UPI ID flagged by other users"]
    }
  ]);

  // Handle checking logic
  const handleStartCheck = () => {
    setCurrentScreen("CHECKING");
    setCheckingProgress(2);

    const timer1 = setTimeout(() => setCheckingProgress(4), 280);
    const timer2 = setTimeout(() => {
      setCheckingProgress(5);
      evaluateAndShowResult();
    }, 720);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Evaluate rule logic in friendly terms
  const evaluateAndShowResult = () => {
    const randomTxn = `UPI-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTxnId(randomTxn);

    const isLateNight = timeStr.toLowerCase().includes("am") && (
      timeStr.startsWith("01") || timeStr.startsWith("02") || timeStr.startsWith("03") || timeStr.startsWith("04") || timeStr.startsWith("1") || timeStr.startsWith("2") || timeStr.startsWith("3") || timeStr.startsWith("4")
    );

    const isHighAmount = amount >= 8000;
    const isModerateAmount = amount > 2000 && amount < 8000;
    const isFlaggedRecipient = recipient.toLowerCase().includes("support") || recipient.toLowerCase().includes("refund") || recipient.toLowerCase().includes("lottery") || recipient.toLowerCase().includes("new@");

    // Version C — Blocked (rare, only when very certain)
    if ((isHighAmount && (isNewDevice || isFlaggedRecipient)) || (isFlaggedRecipient && isNewDevice)) {
      const reasons = [
        amount >= 8000 ? `Amount ${Math.round(amount / 400)}× your usual` : "Sudden unusually high transfer amount",
        isFlaggedRecipient ? "Sent to a UPI ID flagged by other users" : "Immediate transfer to an unrecognized account",
        isNewDevice ? "Attempted right after logging in from a new device" : "Sent at unusual late night hour"
      ];
      setCurrentReasons(reasons);
      const calcMl = Math.min(98, 88 + (isHighAmount ? 5 : 0) + (isNewDevice ? 4 : 0));
      const calcRules = Math.min(99, 86 + (isFlaggedRecipient ? 8 : 0) + (amount > 10000 ? 5 : 0));
      const calcCombined = Math.round(0.70 * calcMl + 0.30 * calcRules);
      setMlScore(calcMl);
      setRuleScore(calcRules);
      setCurrentRiskScore(calcCombined);
      setCurrentRiskFactors([
        {
          name: "Recipient risk profile",
          impact: 42,
          type: "risk",
          humanExplanation: isFlaggedRecipient 
            ? "Beneficiary VPA has multiple unresolved cyber fraud dispute tickets" 
            : "Recipient account was activated very recently with zero verified history"
        },
        {
          name: "Unusual amount spike",
          impact: 34,
          type: "risk",
          humanExplanation: `₹${amount.toLocaleString("en-IN")} is significantly higher than your typical ₹400 transaction baseline`
        },
        {
          name: "Device & environment shift",
          impact: 22,
          type: "risk",
          humanExplanation: isNewDevice 
            ? "First transaction initiated immediately following new device registration" 
            : "Transaction initiated during high-risk nighttime window (after 1:00 AM)"
        },
        {
          name: "Bank network connection",
          impact: -6,
          type: "safe",
          humanExplanation: "Official UPI switch connection verified"
        }
      ]);
      setRecoveryTier("instant");
      setCurrentScreen("RESULT_BLOCKED");

      addRecentCheck(amount, recipient, timeStr, "blocked", "Blocked", reasons);
      return;
    }

    // Version B — Review (friendly check-in)
    if (isNewDevice || isNewRecipient || isLateNight || isModerateAmount) {
      const reasons = [];
      const factors: RiskFactorItem[] = [];

      if (amount > 1000) {
        reasons.push(`₹${amount.toLocaleString("en-IN")} is higher than your usual ₹400`);
        factors.push({
          name: "Amount above daily average",
          impact: 28,
          type: "risk",
          humanExplanation: `₹${amount.toLocaleString("en-IN")} is roughly ${Math.round(amount / 400)}× your usual daytime transfer size`
        });
      }
      if (isLateNight) {
        reasons.push(`It's ${timeStr} — you usually pay during the day`);
        factors.push({
          name: "Nighttime timing",
          impact: 18,
          type: "risk",
          humanExplanation: `Initiated at ${timeStr}, whereas 94% of your payments happen between 9 AM and 9 PM`
        });
      }
      if (isNewDevice) {
        reasons.push("It's from a device we haven't seen before");
        factors.push({
          name: "Unfamiliar hardware",
          impact: 24,
          type: "risk",
          humanExplanation: "New device fingerprint detected without historical login footprint"
        });
      }
      if (isNewRecipient && reasons.length < 3) {
        reasons.push(`First time sending money to ${recipient}`);
        factors.push({
          name: "First-time payee",
          impact: 16,
          type: "risk",
          humanExplanation: `No previous peer payment history to ${recipient}`
        });
      }
      if (reasons.length === 0) {
        reasons.push(`Payment pattern differs from your weekly habit`);
        factors.push({
          name: "Pattern deviation",
          impact: 15,
          type: "risk",
          humanExplanation: "Cadence differs from typical weekly payment schedule"
        });
      }

      // Safe mitigating factors
      factors.push({
        name: "Standard UPI handle",
        impact: -12,
        type: "safe",
        humanExplanation: "Valid NPCI-recognized banking provider handle"
      });
      factors.push({
        name: "Verified bank registration",
        impact: -10,
        type: "safe",
        humanExplanation: "Account verified against registered bank phone number"
      });

      setCurrentReasons(reasons);
      const calcMl = Math.min(76, Math.max(48, 52 + (isLateNight ? 10 : 0) + (isNewDevice ? 8 : 0)));
      const calcRules = Math.min(78, Math.max(50, 58 + (isNewRecipient ? 10 : 0) + (isModerateAmount ? 6 : 0)));
      const calcCombined = Math.round(0.70 * calcMl + 0.30 * calcRules);
      setMlScore(calcMl);
      setRuleScore(calcRules);
      setCurrentRiskScore(calcCombined);
      setCurrentRiskFactors(factors);
      setRecoveryTier("recent");
      setCurrentScreen("RESULT_REVIEW");
      addRecentCheck(amount, recipient, timeStr, "reviewed", "Review requested", reasons);
      return;
    }

    // Version A — Approved
    setCurrentReasons([
      `₹${amount.toLocaleString("en-IN")} to ${recipient} looks normal.`,
      "Sent on your usual device, at a normal time."
    ]);
    const calcMl = Math.min(18, Math.max(5, Math.round(6 + (amount > 1000 ? 3 : 0))));
    const calcRules = Math.min(22, Math.max(8, Math.round(10 + (amount > 1000 ? 4 : 0))));
    const calcCombined = Math.round(0.70 * calcMl + 0.30 * calcRules);
    setMlScore(calcMl);
    setRuleScore(calcRules);
    setCurrentRiskScore(calcCombined);
    setCurrentRiskFactors([
      {
        name: "Frequent & trusted recipient",
        impact: -22,
        type: "safe",
        humanExplanation: `Consistent payment relationship with ${recipient}`
      },
      {
        name: "Normal habit & timing",
        impact: -18,
        type: "safe",
        humanExplanation: "Time of day matches typical transaction history"
      },
      {
        name: "Expected spend bracket",
        impact: -16,
        type: "safe",
        humanExplanation: `₹${amount.toLocaleString("en-IN")} aligns closely with routine everyday transactions`
      },
      {
        name: "Known hardware device",
        impact: -14,
        type: "safe",
        humanExplanation: "Initiated from your primary verified smartphone"
      }
    ]);
    setCurrentScreen("RESULT_APPROVED");
    addRecentCheck(amount, recipient, timeStr, "approved", "Normal", [
      `₹${amount.toLocaleString("en-IN")} to ${recipient} looks normal.`
    ]);
  };

  const addRecentCheck = (
    amt: number, 
    rec: string, 
    time: string, 
    status: RecentCheck["status"], 
    label: string, 
    reasons: string[],
    utr?: string
  ) => {
    setRecentChecks((prev) => [
      {
        id: `chk-${Date.now()}`,
        amount: amt,
        recipient: rec,
        time: time,
        status,
        label,
        reasons,
        utr
      },
      ...prev.slice(0, 5)
    ]);
  };

  // Quick Presets to let users easily test the three scenarios
  const loadPreset = (type: "safe" | "review" | "blocked") => {
    if (type === "safe") {
      setAmount(250);
      setRecipient("Swiggy");
      setTimeStr("01:15 PM");
      setIsNewDevice(false);
      setIsNewRecipient(false);
      setPaymentNote("Lunch order");
    } else if (type === "review") {
      setAmount(5000);
      setRecipient("friend@upi");
      setTimeStr("02:00 AM");
      setIsNewDevice(true);
      setIsNewRecipient(true);
      setPaymentNote("Urgent loan");
    } else {
      setAmount(9999);
      setRecipient("support_refund99@upi");
      setTimeStr("03:30 AM");
      setIsNewDevice(true);
      setIsNewRecipient(true);
      setPaymentNote("Lottery processing fee");
    }
  };

  // Handle Screenshot extraction
  const handleScreenshotExtracted = (scan: ScreenshotScanResult) => {
    if (scan.detectedAmount) setAmount(scan.detectedAmount);
    if (scan.receiverVpa) setRecipient(scan.receiverVpa);
    setIsUploaderOpen(false);
  };

  // Handle PIN button click in keypad
  const handleKeypadPress = (digit: string) => {
    if (digit === "BACK") {
      setEnteredPin((prev) => prev.slice(0, -1));
      setPinError(null);
      return;
    }
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setPinError(null);
      if (nextPin.length === 4) {
        // Automatically submit PIN after 4 digits
        executePaymentTransmission(nextPin);
      }
    }
  };

  // Transmit payment after PIN validation
  const executePaymentTransmission = (pinToVerify: string) => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      const generatedUtr = `4259${Math.floor(10000000 + Math.random() * 90000000)}`;
      setCompletedUtr(generatedUtr);
      setCurrentScreen("PAYMENT_SUCCESS");
      setEnteredPin("");

      // Record in recent checks as completed
      addRecentCheck(
        amount, 
        recipient, 
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        "approved", 
        "Paid Successfully", 
        ["SafeUPI verified & transmitted without risk"],
        generatedUtr
      );
    }, 900);
  };

  // Copy complaint details
  const handleCopyComplaintDetails = () => {
    const text = `COMPLAINT TRANSACTION DETAILS:
- Transaction ID: ${generatedTxnId}
- Disputed Amount: INR ${amount.toLocaleString("en-IN")}
- Recipient UPI: ${recipient}
- Timestamp: ${timeStr}, 17 Sep 2026
- Status: Flagged as unusual / potential unauthorized debit
- Intercepted by: SafeUPI Payment Guard`;

    navigator.clipboard.writeText(text);
    setCopiedTxnDetails(true);
    setTimeout(() => setCopiedTxnDetails(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-stone-50/50 to-rose-100/40 text-slate-800 font-sans pb-16">
      {/* Top Deep Rose Brand Header Bar */}
      <header className="border-b border-rose-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div 
            onClick={() => { setCurrentScreen("HOME"); setMainTab("pay"); }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-700 to-rose-900 text-white flex items-center justify-center shadow-md shadow-rose-900/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-rose-950 tracking-tight">SafeUPI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Pre-Transmit Guard
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden md:inline">
                  Random Forest + Rules
                </span>
              </div>
              <p className="text-[11px] text-rose-800/70 hidden sm:block font-medium">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Quick Utility Links with Deep Rose Accents */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs w-full sm:w-auto justify-end">
            {/* Interactive Demo Video Walkthrough */}
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Watch 6-Part Interactive Live Demo Walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Demo Video</span>
            </button>

            {/* Jury / Technical View Toggle */}
            <button
              onClick={() => setIsJuryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Inspect ML Feature Vector and Random Forest Decision Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-700" />
              <span>{t.technicalJuryView}</span>
            </button>

            {onOpenHowToUse && (
              <button
                onClick={onOpenHowToUse}
                className="px-2.5 py-1.5 rounded-xl text-rose-900 hover:text-rose-950 hover:bg-rose-50 font-semibold transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">How it works</span>
              </button>
            )}

            <button
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold hover:brightness-110 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Scan any UPI QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t.scanQr}</span>
            </button>
          </div>
        </div>

        {/* Global Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 pb-2.5 pt-1 overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-rose-50/60 p-1 rounded-2xl border border-rose-200/80 min-w-max">
            <button
              onClick={() => { setMainTab("pay"); setCurrentScreen("HOME"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "pay"
                  ? "bg-white text-rose-950 shadow-xs border border-rose-200"
                  : "text-rose-900 hover:bg-rose-100/60"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.navPay}</span>
            </button>

            <button
              onClick={() => setMainTab("verify")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "verify"
                  ? "bg-white text-rose-950 shadow-xs border border-rose-200"
                  : "text-rose-900 hover:bg-rose-100/60"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.navVerify}</span>
            </button>

            <button
              onClick={() => setMainTab("dashboard")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "dashboard"
                  ? "bg-white text-rose-950 shadow-xs border border-rose-200"
                  : "text-rose-900 hover:bg-rose-100/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.navDashboard}</span>
            </button>

            <button
              onClick={() => setMainTab("recovery")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "recovery"
                  ? "bg-white text-rose-950 shadow-xs border border-rose-200"
                  : "text-rose-900 hover:bg-rose-100/60"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.navRecovery}</span>
            </button>

            <button
              onClick={() => setMainTab("simulator")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "simulator"
                  ? "bg-white text-rose-950 shadow-xs border border-rose-200"
                  : "text-rose-900 hover:bg-rose-100/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>{t.navLearn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
        {/* TAB 1: PAY & CHECK TRANSMITTER */}
        {mainTab === "pay" && (
          <div className="max-w-xl mx-auto">
            {/* =========================================================================
                SCREEN 1: HOME / MAKE A PAYMENT OR CHECK A PAYMENT
               ========================================================================= */}
        {currentScreen === "HOME" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Deep Rose Hero Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-rose-700 via-rose-800 to-rose-900 text-white shadow-lg shadow-rose-800/25 mb-1">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-950 tracking-tight">
                SafeUPI
              </h1>
              <p className="text-sm font-bold text-rose-800">
                Your friendly payment guard
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                &ldquo;Before you pay, SafeUPI quietly checks — and tells you in plain words if something feels off.&rdquo;
              </p>
            </div>

            {/* QR Code Scanner CTA Card */}
            <div className="bg-gradient-to-r from-rose-800 via-rose-900 to-rose-950 rounded-2xl p-3.5 text-white shadow-md flex items-center justify-between gap-3 border border-rose-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-200 shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>Scan UPI QR Code</span>
                    <span className="text-[9px] bg-rose-500/30 text-rose-200 px-1.5 py-0.2 rounded-md font-mono">Camera / URI</span>
                  </h3>
                  <p className="text-[11px] text-rose-200/90 leading-tight">
                    Scan merchant or peer QR with instant risk verification
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-950 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-rose-700" />
                <span>Open Scanner</span>
              </button>
            </div>

            {/* Scanned QR Notification Alert */}
            {scannedQrNotification && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2 animate-in fade-in shadow-xs">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{scannedQrNotification}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setScannedQrNotification(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* In-App Action Mode Switcher: "Send / Pay via UPI" vs "Check a Payment" */}
            <div className="bg-white/95 border border-rose-200 rounded-2xl p-1.5 shadow-sm flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTabMode("pay")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTabMode === "pay"
                    ? "bg-rose-700 text-white shadow-sm shadow-rose-700/20"
                    : "text-rose-900 hover:bg-rose-50/80"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pay via UPI (Safe Send)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabMode("check")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTabMode === "check"
                    ? "bg-rose-700 text-white shadow-sm shadow-rose-700/20"
                    : "text-rose-900 hover:bg-rose-50/80"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Check a Payment Only</span>
              </button>
            </div>

            {/* Quick Demo Scenario Switcher Pills with Deep Rose Styling */}
            <div className="bg-white border border-rose-200/90 rounded-2xl p-3.5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-rose-900 px-1 font-semibold">
                <span>Quick demo tests:</span>
                <button
                  onClick={() => setIsUploaderOpen(!isUploaderOpen)}
                  className="text-rose-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>📷 Scan Screenshot</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset("safe")}
                  className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                    amount === 250 && recipient === "Swiggy"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300 shadow-2xs"
                      : "bg-rose-50/40 text-slate-700 border-rose-100 hover:bg-emerald-50/50"
                  }`}
                >
                  <span className="block text-[10px] text-emerald-700 font-bold">Approved</span>
                  ₹250 Swiggy
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset("review")}
                  className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                    amount === 5000 && recipient === "friend@upi"
                      ? "bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300 shadow-2xs"
                      : "bg-rose-50/40 text-slate-700 border-rose-100 hover:bg-amber-50/50"
                  }`}
                >
                  <span className="block text-[10px] text-amber-800 font-bold">Review Check</span>
                  ₹5,000 Night
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset("blocked")}
                  className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                    amount === 9999
                      ? "bg-rose-100 text-rose-950 border-rose-300 ring-1 ring-rose-400 shadow-2xs"
                      : "bg-rose-50/40 text-slate-700 border-rose-100 hover:bg-rose-100/50"
                  }`}
                >
                  <span className="block text-[10px] text-rose-700 font-bold">Blocked Scam</span>
                  ₹9,999 Trap
                </button>
              </div>

              {/* Optional Screenshot scan box */}
              {isUploaderOpen && (
                <div className="pt-2 border-t border-rose-100">
                  <TransactionScreenshotUploader 
                    onScanExtracted={handleScreenshotExtracted} 
                    onApplyExtractedPayload={(_payload, scan) => handleScreenshotExtracted(scan)}
                  />
                </div>
              )}
            </div>

            {/* Live Demo Video & Feature Guide Banner with Download */}
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-500/30 rounded-2xl p-3.5 sm:p-4 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">
                      App Feature Tour & Demo Video
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Live Pitch Walkthrough
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Interactive 6-part video breakdown: Pre-Transmit AI, Scam Detection, Receipt Forensics & 1930 Recovery Hub.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDemoVideoOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Demo Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadDemoVideoHtml()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Download offline demo video player HTML5 file"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Card: Live Payment or Verification Form */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {activeTabMode === "pay" ? "Transmit Safe Payment" : "Checking a payment?"}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      SafeUPI Shield Active
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTabMode === "pay" 
                      ? "SafeUPI checks for risk before your money is transmitted." 
                      : "Enter a few details and we'll take a look."}
                  </p>
                </div>
              </div>

              {/* One question per line, plain English */}
              <div className="space-y-4">
                {/* Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-800 shrink-0">
                    Amount (₹)
                  </label>
                  <div className="relative flex-1 sm:max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-rose-600 text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      placeholder="e.g. 5000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-rose-50/40 border border-rose-200 text-slate-900 font-extrabold text-base focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* To (UPI ID) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-800 shrink-0">
                    To (UPI ID)
                  </label>
                  <div className="flex-1 sm:max-w-xs flex items-center gap-2">
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="friend@upi or phone number"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50/40 border border-rose-200 text-slate-900 font-mono text-xs font-semibold focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      title="Scan UPI QR Code"
                      className="p-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-200 transition-colors shrink-0 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-rose-800" />
                    </button>
                  </div>
                </div>

                {/* In Pay Mode: Debiting Bank & Note */}
                {activeTabMode === "pay" && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <label className="text-sm font-bold text-slate-800 shrink-0">
                        Pay From Bank
                      </label>
                      <div className="flex-1 sm:max-w-xs relative">
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50/40 border border-rose-200 text-slate-900 text-xs font-semibold focus:bg-white focus:border-rose-600 focus:outline-none appearance-none"
                        >
                          <option value="HDFC Bank (•••• 4021)">HDFC Bank (•••• 4021)</option>
                          <option value="State Bank of India (•••• 8102)">State Bank of India (•••• 8102)</option>
                          <option value="ICICI Bank (•••• 1194)">ICICI Bank (•••• 1194)</option>
                          <option value="Kotak Mahindra Bank (•••• 5521)">Kotak Mahindra Bank (•••• 5521)</option>
                        </select>
                        <Landmark className="w-3.5 h-3.5 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <label className="text-sm font-bold text-slate-800 shrink-0">
                        Add Note
                      </label>
                      <input
                        type="text"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="What is this payment for?"
                        className="flex-1 sm:max-w-xs px-3.5 py-2.5 rounded-2xl bg-rose-50/40 border border-rose-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-rose-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-800 shrink-0">
                    Time
                  </label>
                  <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                    <input
                      type="text"
                      value={timeStr}
                      onChange={(e) => setTimeStr(e.target.value)}
                      placeholder="02:00 AM"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50/40 border border-rose-200 text-slate-900 font-medium text-xs focus:bg-white focus:border-rose-600 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                      className="shrink-0 px-2.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-[11px] font-bold text-rose-800"
                      title="Set to right now"
                    >
                      Now
                    </button>
                  </div>
                </div>

                {/* New device? radio */}
                <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                  <span className="text-sm font-bold text-slate-800">
                    New device?
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newDevice"
                        checked={isNewDevice === true}
                        onChange={() => setIsNewDevice(true)}
                        className="accent-rose-700 w-4 h-4 cursor-pointer"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newDevice"
                        checked={isNewDevice === false}
                        onChange={() => setIsNewDevice(false)}
                        className="accent-rose-700 w-4 h-4 cursor-pointer"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* New recipient? radio */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    New recipient?
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newRecipient"
                        checked={isNewRecipient === true}
                        onChange={() => setIsNewRecipient(true)}
                        className="accent-rose-700 w-4 h-4 cursor-pointer"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newRecipient"
                        checked={isNewRecipient === false}
                        onChange={() => setIsNewRecipient(false)}
                        className="accent-rose-700 w-4 h-4 cursor-pointer"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Primary Action Button (Deep Rose, generous padding, high prominence) */}
              <div className="pt-2">
                <button
                  type="button"
                  id="btn-check-this-payment"
                  onClick={handleStartCheck}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 hover:from-rose-800 hover:to-rose-950 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {activeTabMode === "pay" ? (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Proceed to Pay ₹{amount.toLocaleString("en-IN")} via SafeUPI</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Check this payment</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust text at the bottom, small and grey */}
              <div className="pt-3 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-500 text-center">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  Quietly checks before transmitting money
                </span>
                <span className="hidden sm:inline text-rose-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Checks take less than a second
                </span>
              </div>
            </div>

            {/* =========================================================================
                SCREEN 6: RECENT CHECKS & TRANSMITTED PAYMENTS
               ========================================================================= */}
            <div className="bg-white border border-rose-200/80 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                    Recent checks & payments
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {recentChecks.length} entries
                </span>
              </div>

              <div className="divide-y divide-rose-50 space-y-1">
                {recentChecks.map((item) => {
                  const isApproved = item.status === "approved";
                  const isBlocked = item.status === "blocked";
                  const isConfirmed = item.status === "confirmed";

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setAmount(item.amount);
                        setRecipient(item.recipient);
                        setTimeStr(item.time);
                        handleStartCheck();
                      }}
                      className="pt-2.5 first:pt-0 flex items-center justify-between py-2 px-1.5 rounded-xl hover:bg-rose-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">
                          {isApproved ? "✅" : isBlocked ? "🚫" : "⚠️"}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="text-rose-950 font-extrabold">₹{item.amount.toLocaleString("en-IN")}</span>
                            <span className="text-slate-400 font-normal">→</span>
                            <span className="text-slate-700 font-medium">{item.recipient}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                            <span>{item.time}</span>
                            {item.utr && (
                              <span className="text-emerald-700 font-semibold font-mono">UTR: {item.utr}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isApproved
                            ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : isBlocked
                            ? "bg-[#FFEBEE] text-[#B71C1C]"
                            : "bg-[#FFF8E1] text-[#B26A00]"
                        }`}>
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-rose-300 group-hover:text-rose-600 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: "CHECKING…" (Loading State) - Under a second
           ========================================================================= */}
        {currentScreen === "CHECKING" && (
          <div className="bg-white border border-rose-200 rounded-3xl p-10 shadow-sm text-center space-y-6 my-8 animate-in fade-in duration-150">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-100 to-rose-200 text-rose-800 border border-rose-200 shadow-sm animate-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-rose-950 tracking-tight">
                Taking a quick look before transmitting…
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Checking recipient history, timing pattern, and device safety
              </p>
            </div>

            {/* Calm animated dots in Deep Rose */}
            <div className="flex items-center justify-center gap-2 text-2xl font-mono text-rose-700 select-none py-2">
              <span className={checkingProgress >= 1 ? "opacity-100 scale-125 transition-all text-rose-700" : "opacity-20 text-rose-300"}>●</span>
              <span className={checkingProgress >= 2 ? "opacity-100 scale-125 transition-all text-rose-700" : "opacity-20 text-rose-300"}>●</span>
              <span className={checkingProgress >= 3 ? "opacity-100 scale-125 transition-all text-rose-700" : "opacity-20 text-rose-300"}>●</span>
              <span className={checkingProgress >= 4 ? "opacity-100 scale-125 transition-all text-rose-700" : "opacity-20 text-rose-300"}>●</span>
              <span className={checkingProgress >= 5 ? "opacity-100 scale-125 transition-all text-rose-700" : "opacity-20 text-rose-300"}>●</span>
            </div>

            <p className="text-[11px] text-rose-800/80 font-medium">
              🔒 SafeUPI verifies without transmitting your money
            </p>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: RESULT CARD (VERSION A — APPROVED)
            Color: soft green (#2E7D32 on #E8F5E9)
           ========================================================================= */}
        {currentScreen === "RESULT_APPROVED" && (
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6 text-[#2E7D32] animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="text-4xl block mb-2">✅</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1B5E20]">
                Looks good!
              </h2>
            </div>

            <div className="space-y-2 text-sm leading-relaxed text-[#2E7D32] font-medium">
              <p>
                ₹{amount.toLocaleString("en-IN")} to {recipient} looks normal.
              </p>
              <p>
                Sent on your usual device, at a normal time.
              </p>
              <p className="pt-2 font-bold text-[#1B5E20]">
                You&apos;re all set.
              </p>
            </div>

            {/* Visual Risk Meter & Explainability Breakdown */}
            <div className="bg-white/90 rounded-2xl p-4 border border-emerald-200 shadow-2xs">
              <RiskMeterAndExplainability
                score={currentRiskScore || 12}
                riskLevel="low"
                userMessage={`₹${amount.toLocaleString("en-IN")} to ${recipient} looks normal.`}
                recommendedAction="Safe to proceed"
                factors={currentRiskFactors}
                amount={amount}
                recipient={recipient}
                timeStr={timeStr}
                isNewDevice={isNewDevice}
                isNewRecipient={isNewRecipient}
              />
            </div>

            <div className="pt-2 space-y-2.5">
              {/* If in Pay Mode: button to proceed to UPI PIN & transmit */}
              {activeTabMode === "pay" ? (
                <button
                  type="button"
                  id="btn-enter-upi-pin"
                  onClick={() => setCurrentScreen("PIN_ENTRY")}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Enter UPI PIN to Transmit ₹{amount.toLocaleString("en-IN")}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentScreen("HOME")}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
                >
                  Done
                </button>
              )}

              <div className="text-center pt-1">
                <button
                  onClick={() => setCurrentScreen("HOME")}
                  className="text-xs text-[#2E7D32]/90 hover:text-[#1B5E20] font-semibold underline cursor-pointer"
                >
                  Back to SafeUPI Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: RESULT CARD (VERSION B — REVIEW / THE FRIENDLY CHECK-IN)
            Color: warm amber (#B26A00 on #FFF8E1)
           ========================================================================= */}
        {currentScreen === "RESULT_REVIEW" && (
          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6 text-[#B26A00] animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="text-4xl block mb-2">🤔</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#795548]">
                Quick check on this one
              </h2>
            </div>

            <p className="text-sm font-medium text-[#B26A00] leading-relaxed">
              This payment looks a bit different from your usual pattern.
            </p>

            {/* Reasons List */}
            <div className="space-y-2 bg-white/70 rounded-2xl p-4 border border-[#FFE082]/60">
              <span className="text-xs font-bold text-[#8D4F00] uppercase tracking-wider block">
                We noticed:
              </span>
              <ul className="space-y-2 text-xs font-medium text-[#795548]">
                {currentReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B26A00] font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Risk Meter & Explainability Breakdown */}
            <div className="bg-white/95 rounded-2xl p-4 border border-amber-200 shadow-2xs">
              <RiskMeterAndExplainability
                score={currentRiskScore || 58}
                riskLevel="medium"
                userMessage="This payment looks a bit different from your usual pattern."
                recommendedAction="Verify with recipient before proceeding"
                factors={currentRiskFactors}
                amount={amount}
                recipient={recipient}
                timeStr={timeStr}
                isNewDevice={isNewDevice}
                isNewRecipient={isNewRecipient}
              />
            </div>

            <div className="space-y-3 pt-1">
              <p className="text-sm font-bold text-[#795548] text-center">
                Was this really you?
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  id="btn-yes-this-was-me"
                  onClick={() => {
                    addRecentCheck(amount, recipient, timeStr, "confirmed", "Confirmed by you", currentReasons);
                    if (activeTabMode === "pay") {
                      setCurrentScreen("PIN_ENTRY");
                    } else {
                      setCurrentScreen("CONFIRMED_BY_ME");
                    }
                  }}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{activeTabMode === "pay" ? "Yes, continue to Pay" : "Yes, this was me"}</span>
                </button>

                <button
                  type="button"
                  id="btn-no-something-wrong"
                  onClick={() => {
                    setRecoveryTier("recent");
                    setCurrentScreen("RECOVERY_FLOW");
                  }}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-[#B71C1C] border border-[#FFCDD2] font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>No, something&apos;s wrong</span>
                </button>
              </div>
            </div>

            {/* Reassurance at the bottom */}
            <div className="pt-2 border-t border-[#FFE082]/70 text-center space-y-0.5 text-xs text-[#8D4F00]">
              <p className="font-bold">Your money hasn&apos;t been transmitted yet.</p>
              <p className="opacity-90">Nothing is charged until you confirm.</p>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: RESULT CARD (VERSION C — BLOCKED / RARE, ONLY WHEN VERY CERTAIN)
            Color: calm red (#B71C1C on #FFEBEE), never all-caps
           ========================================================================= */}
        {currentScreen === "RESULT_BLOCKED" && (
          <div className="bg-[#FFEBEE] border border-[#FFCDD2] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6 text-[#B71C1C] animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="text-4xl block mb-2">🛡️</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#B71C1C]">
                We paused this for your safety
              </h2>
            </div>

            <p className="text-sm font-medium text-[#B71C1C] leading-relaxed">
              This one matches patterns we see in reported fraud cases. We intercepted it before transmitting.
            </p>

            {/* Reasons List */}
            <div className="space-y-2 bg-white/70 rounded-2xl p-4 border border-[#FFCDD2]/60">
              <span className="text-xs font-bold text-[#8A1313] uppercase tracking-wider block">
                Reasons:
              </span>
              <ul className="space-y-2 text-xs font-medium text-[#8A1313]">
                {currentReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B71C1C] font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Risk Meter & Explainability Breakdown */}
            <div className="bg-white/95 rounded-2xl p-4 border border-rose-200 shadow-2xs">
              <RiskMeterAndExplainability
                score={currentRiskScore || 92}
                riskLevel="high"
                userMessage="High probability risk pattern detected. Paused before transmission."
                recommendedAction="Do not authorize · Call bank or Cyber Crime 1930"
                factors={currentRiskFactors}
                amount={amount}
                recipient={recipient}
                timeStr={timeStr}
                isNewDevice={isNewDevice}
                isNewRecipient={isNewRecipient}
              />
            </div>

            {/* Action Buttons: Never dead ends, always path to help */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-[#8A1313] block">
                Here&apos;s what we can do:
              </span>

              <button
                type="button"
                onClick={() => {
                  setRecoveryTier("instant");
                  setCurrentScreen("RECOVERY_FLOW");
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>See Recovery Options & Help</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 border border-rose-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-rose-700" />
                <span>Call bank fraud helpline</span>
              </button>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>File a complaint (cybercrime.gov.in)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  addRecentCheck(amount, recipient, timeStr, "confirmed", "Confirmed by you", currentReasons);
                  if (activeTabMode === "pay") {
                    setCurrentScreen("PIN_ENTRY");
                  } else {
                    setCurrentScreen("CONFIRMED_BY_ME");
                  }
                }}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-[#8A1313] hover:bg-white/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Actually, this was me (Override)</span>
              </button>
            </div>

            {/* Reassurance footer */}
            <div className="pt-3 border-t border-[#FFCDD2]/70 text-center text-xs text-[#8A1313] font-medium">
              We&apos;re here. You&apos;re not alone. No money left your account.
            </div>
          </div>
        )}

        {/* =========================================================================
            IN-APP UPI PIN ENTRY SCREEN (Pre-transmission verification gate)
           ========================================================================= */}
        {currentScreen === "PIN_ENTRY" && (
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200 max-w-md mx-auto">
            <div className="text-center space-y-1.5 border-b border-rose-100 pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 mb-1">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Enter 4-Digit UPI PIN
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-900">
                <span>Paying ₹{amount.toLocaleString("en-IN")}</span>
                <span>to</span>
                <span className="font-mono text-slate-800">{recipient}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Debiting from: {selectedBank}
              </p>
            </div>

            {/* Masked PIN Indicator */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all ${
                    enteredPin.length > index
                      ? "bg-rose-700 scale-110 shadow-xs"
                      : "bg-rose-100 border border-rose-300"
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-bold text-center">
                {pinError}
              </p>
            )}

            {/* Safe Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 rounded-2xl bg-rose-50/70 hover:bg-rose-100 active:bg-rose-200 text-lg font-bold text-slate-900 transition-colors shadow-2xs"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="py-3 rounded-2xl bg-rose-50/70 hover:bg-rose-100 active:bg-rose-200 text-lg font-bold text-slate-900 transition-colors shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("BACK")}
                className="py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-xs font-bold text-rose-900 transition-colors"
              >
                ⌫
              </button>
            </div>

            {/* Loading transmission notice */}
            {isTransmitting ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-800 animate-pulse pt-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Transmitting securely to recipient bank...</span>
              </div>
            ) : (
              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-rose-700" />
                  Protected by SafeUPI pre-transmission integrity check
                </span>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PAYMENT SUCCESS RECEIPT (After secure transmission)
           ========================================================================= */}
        {currentScreen === "PAYMENT_SUCCESS" && (
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                ₹{amount.toLocaleString("en-IN")}
              </h2>
              <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
                <span>Payment Successful</span>
              </p>
              <p className="text-xs text-slate-500">
                Paid to <strong className="text-slate-800">{recipient}</strong>
              </p>
            </div>

            {/* Receipt Summary Card with Deep Rose & Emerald highlights */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">UPI Ref ID (UTR):</span>
                <span className="font-mono font-bold text-slate-900">{completedUtr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">From Bank:</span>
                <span className="font-medium text-slate-800">{selectedBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Note:</span>
                <span className="font-medium text-slate-800">{paymentNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-mono text-slate-700">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-rose-200/60">
                <span className="text-slate-500">Security Check:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Safe Before Transmission
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`SafeUPI Receipt: Paid ₹${amount} to ${recipient}. UTR: ${completedUtr}`);
                  setCopiedUtr(true);
                  setTimeout(() => setCopiedUtr(false), 2000);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-rose-700" />}
                <span>{copiedUtr ? "Receipt Details Copied!" : "Copy Receipt Details"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                Done · Pay Someone Else
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: "YES, THIS WAS ME" (Confirmation Screen)
           ========================================================================= */}
        {currentScreen === "CONFIRMED_BY_ME" && (
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6 text-[#2E7D32] animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="text-4xl block mb-2">✅</span>
              <h2 className="text-2xl font-bold tracking-tight text-[#1B5E20]">
                Thanks for confirming!
              </h2>
            </div>

            <div className="space-y-2 text-sm leading-relaxed text-[#2E7D32] font-medium">
              <p>
                We&apos;ve let this payment through.
              </p>
              <p>
                We&apos;ll remember this device and won&apos;t bother you next time.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: "NO, SOMETHING'S WRONG" (Recovery Flow - Tiered Recovery UI)
           ========================================================================= */}
        {currentScreen === "RECOVERY_FLOW" && (
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="border-b border-rose-100 pb-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                Emergency Report & Recover
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                We&apos;ve got your back
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                What happened? Select your situation so we can take the fastest possible action.
              </p>
            </div>

            {/* Situation Tier Selector */}
            <div className="bg-rose-50/70 p-1.5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row gap-1">
              <button
                type="button"
                onClick={() => setRecoveryTier("instant")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  recoveryTier === "instant"
                    ? "bg-white text-rose-950 shadow-xs border border-rose-200 ring-1 ring-rose-300"
                    : "text-rose-800 hover:bg-rose-100/60"
                }`}
              >
                <span>🛡️ Blocked Before Left</span>
              </button>
              <button
                type="button"
                onClick={() => setRecoveryTier("recent")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  recoveryTier === "recent"
                    ? "bg-white text-rose-950 shadow-xs border border-rose-200 ring-1 ring-rose-300"
                    : "text-rose-800 hover:bg-rose-100/60"
                }`}
              >
                <span>⏱️ Money Left &lt;24h</span>
              </button>
              <button
                type="button"
                onClick={() => setRecoveryTier("delayed")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  recoveryTier === "delayed"
                    ? "bg-white text-rose-950 shadow-xs border border-rose-200 ring-1 ring-rose-300"
                    : "text-rose-800 hover:bg-rose-100/60"
                }`}
              >
                <span>📞 Money Left &gt;24h</span>
              </button>
            </div>

            {/* Tier 1: Blocked Before Money Left */}
            {recoveryTier === "instant" && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-950">
                      We stopped this. Your money is safe.
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Because SafeUPI intercepted this check before transmission, <strong>no money ever left your bank account</strong>. Your account balance is completely untouched.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1 font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Beneficiary blocked on your SafeUPI profile</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5">
                    We&apos;ve flagged {recipient} so future transmission attempts to this VPA will be blocked instantly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentScreen("HOME")}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Thanks, got it</span>
                </button>
              </div>
            )}

            {/* Tier 2: Money Left < 24 Hours (Golden 24-Hour Recovery Window) */}
            {recoveryTier === "recent" && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide mb-1">
                      Golden 24-Hour Recovery Window
                    </div>
                    <h3 className="text-base font-extrabold text-amber-950">
                      This went through. Let&apos;s report it fast.
                    </h3>
                    <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                      The first 24 hours decide everything — in most UPI scam rings, money moves across multiple &ldquo;mule accounts&rdquo;. If reported now, the destination bank account can still be frozen before cash withdrawal.
                    </p>
                  </div>
                </div>

                {/* Priority 1-Tap Helplines for Instant Freeze */}
                <div className="space-y-2">
                  <a
                    href="tel:1930"
                    className="w-full py-3.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial 1930 Cyber Fraud Helpline (Immediate Account Freeze)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
                    <span>Call Your Bank Fraud Desk Immediately</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tier 3: Money Left > 24 Hours (Escalation & Formal Investigation) */}
            {recoveryTier === "delayed" && (
              <div className="bg-rose-50/80 border border-rose-300 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-200 text-rose-900 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-rose-950">
                      This went through earlier.
                    </h3>
                    <p className="text-xs text-rose-900/90 mt-1 leading-relaxed">
                      Report it to your bank&apos;s fraud helpline immediately. Use the button below to call them. Recovery becomes harder after 72 hours, but official police and cyber crime records establish legal claim for chargeback under RBI guidelines.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(true)}
                    className="py-3 px-3 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Bank Desk</span>
                  </button>

                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>File Cyber Police FIR</span>
                  </a>
                </div>
              </div>
            )}

            {/* Step-by-Step Action Helplines */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Official Helplines &amp; Verification
              </span>

              {/* Step 1: Bank Fraud Desk */}
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-800 uppercase block">
                    Step 1
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Call your bank now
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Bank fraud helpline</span>
                </button>
              </div>

              {/* Step 2: Cyber Crime Portal */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                    Step 2
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Report to the government
                  </span>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>cybercrime.gov.in</span>
                </a>
              </div>

              {/* Step 3: NPCI Helpline */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">
                    Step 3
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Call NPCI UPI helpline
                  </span>
                </div>
                <a
                  href="tel:18001201740"
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 font-mono"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>1800-120-1740</span>
                </a>
              </div>
            </div>

            {/* Prepared Complaint Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">
                We&apos;ve prepared your complaint with the transaction details:
              </span>

              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 font-mono text-xs text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Txn ID:</span>
                  <span className="font-bold text-slate-900">{generatedTxnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-slate-900">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient VPA:</span>
                  <span className="text-slate-800">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="text-slate-800">{timeStr}, 17 Sep 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reason:</span>
                  <span className="text-rose-800 font-semibold">{currentReasons[0] || "unusual transaction pattern"}</span>
                </div>

                <div className="pt-2 border-t border-rose-100">
                  <button
                    type="button"
                    onClick={handleCopyComplaintDetails}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 font-sans font-bold text-xs text-rose-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedTxnDetails ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-rose-700" />}
                    <span>{copiedTxnDetails ? "Details copied to clipboard!" : "Copy details to paste in cyber portal"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recovery honesty line */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              &ldquo;We&apos;ll help you report this right away. Recovery depends on how quickly the bank can act, and unfortunately we can&apos;t guarantee it — but acting in the next 24 hours gives you the best chance.&rdquo;
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {onOpenTraceback && (
                <button
                  type="button"
                  onClick={onOpenTraceback}
                  className="flex-1 py-3 px-4 rounded-2xl bg-rose-100/70 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Trace Money Trail & Bank Letter</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        )}
          </div>
        )}

        {/* TAB 2: VERIFY SCREENSHOT & QR CODE */}
        {mainTab === "verify" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Payment Screenshot & QR Verification Studio
                    </h2>
                    <p className="text-xs text-slate-500">
                      Detect forged payment receipts, malicious QR redirects, and edited transaction proofs
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant QR Scanner Button */}
              <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-rose-200">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      Real-Time Camera QR Scanner
                    </h3>
                    <p className="text-xs text-rose-200">
                      Scan any paper or screen UPI QR code for instant signature check
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrScannerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-extrabold text-xs shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Open Camera
                </button>
              </div>

              {/* Screenshot Uploader Component with Built-in OCR and Tamper Detection */}
              <TransactionScreenshotUploader 
                isOpenDefault={true}
                onScanExtracted={handleScreenshotExtracted}
                onApplyExtractedPayload={(_payload, scan) => {
                  handleScreenshotExtracted(scan);
                  setMainTab("pay");
                  setCurrentScreen("HOME");
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION RISK DASHBOARD */}
        {mainTab === "dashboard" && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
            <TransactionRiskDashboard />
          </div>
        )}

        {/* TAB 4: RECOVERY TRACKER HUB */}
        {mainTab === "recovery" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <RecoveryTrackerHub 
              onOpenBankModal={() => setIsBankModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 5: SCAM SIMULATOR & AWARENESS */}
        {mainTab === "simulator" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <ScamSimulatorAndAwareness />
          </div>
        )}
      </main>

      {/* QR Code Camera / URI Scanner Modal */}
      <QrCodeScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onQrScanned={handleQrScanned}
      />

      {/* Bank Helpline Modal */}
      <BankHelplineModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />

      {/* Technical Jury & ML Deep Dive Modal */}
      <TechnicalJuryModal
        isOpen={isJuryModalOpen}
        onClose={() => setIsJuryModalOpen(false)}
        mlScore={mlScore}
        ruleScore={ruleScore}
        combinedScore={currentRiskScore}
        isNewDevice={isNewDevice}
        isNewRecipient={isNewRecipient}
        amount={amount}
        recipient={recipient}
        timeStr={timeStr}
      />

      {/* Interactive Demo Video Modal */}
      <InteractiveDemoModal
        isOpen={isDemoVideoOpen}
        onClose={() => setIsDemoVideoOpen(false)}
        onNavigateTab={(tab) => {
          setMainTab(tab);
          setCurrentScreen("HOME");
        }}
      />
    </div>
  );
};
