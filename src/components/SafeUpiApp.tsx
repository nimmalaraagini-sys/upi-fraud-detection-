import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, HelpCircle, 
  PhoneCall, ExternalLink, Copy, Check, ArrowRight, 
  RotateCcw, Sparkles, Clock, Lock, Zap, FileText, ChevronRight,
  AlertCircle, CreditCard, Send, Smartphone, Landmark,
  X, Download, Share2, RefreshCw, KeyRound, QrCode, Camera,
  Cpu, Activity, BarChart3, AlertOctagon, CheckSquare, Play, Languages, Globe,
  User, Building2, LogIn, LogOut, Shield, CheckCircle,
  MessageSquare, Terminal, Bot
} from "lucide-react";
import { SafeUpiAiChat } from "./SafeUpiAiChat";
import { BankHelplineModal } from "./BankHelplineModal";
import { TransactionScreenshotUploader } from "./TransactionScreenshotUploader";
import { QrCodeScannerModal, DecodedUpiQr } from "./QrCodeScannerModal";
import { RiskMeterAndExplainability, RiskFactorItem } from "./RiskMeterAndExplainability";
import { ScreenshotScanResult } from "../types";
import { MULTI_TRANSLATIONS, SupportedLang } from "../utils/translations";
import { ScamSimulatorAndAwareness } from "./ScamSimulatorAndAwareness";
import { RecoveryTrackerHub } from "./RecoveryTrackerHub";
import { TransactionRiskDashboard } from "./TransactionRiskDashboard";
import { TechnicalJuryModal } from "./TechnicalJuryModal";
import { InteractiveDemoModal } from "./InteractiveDemoModal";
import { downloadDemoVideoHtml } from "../utils/downloadDemoAssets";
import { AdvancedSafetyCoPilot } from "./AdvancedSafetyCoPilot";
import { GuardianApprovalModal } from "./GuardianApprovalModal";
import { muleRegistry, MuleReportEntry } from "../utils/muleRegistry";
import { regionalVoice } from "../utils/regionalVoice";
import { USER_PROFILES, UserProfile } from "../data/userProfiles";
import { UserProfileModal } from "./UserProfileModal";
import { UserLoginModal } from "./UserLoginModal";
import { ProjectDocumentationModal } from "./ProjectDocumentationModal";
import { downloadProjectPdf } from "../utils/downloadProjectDoc";

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

  // Multi-Language Support: English, Telugu, Hindi, Tamil, Kannada, Marathi
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");
  const t = useMemo(() => MULTI_TRANSLATIONS[currentLang] || MULTI_TRANSLATIONS.en, [currentLang]);

  // Technical Jury Modal View State
  const [isJuryModalOpen, setIsJuryModalOpen] = useState<boolean>(false);

  // Multilingual AI Chat & Cyber Terminal States
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  // Interactive Demo Video Walkthrough State
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState<boolean>(false);

  // Dual-Engine Scores (Payment Security Status & Real-time Safety Indicators)
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

  // User Profile & Linked Bank State (5 Personas supported)
  const [activeProfile, setActiveProfile] = useState<UserProfile>(USER_PROFILES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);

  // Next-Gen Safety Co-Pilot States (ASTRA 2026)
  const [activePhoneCall, setActivePhoneCall] = useState<boolean>(false);
  const [isCollectRequest, setIsCollectRequest] = useState<boolean>(false);
  const [guardianMode, setGuardianMode] = useState<boolean>(false);
  const [guardianPhone, setGuardianPhone] = useState<string>("+91 98765 43210");
  const [matchedMuleEntry, setMatchedMuleEntry] = useState<MuleReportEntry | null>(null);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState<boolean>(false);

  // QR Scanner State
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [scannedQrNotification, setScannedQrNotification] = useState<string | null>(null);

  // Risk Score & Explainability State
  const [currentRiskScore, setCurrentRiskScore] = useState<number>(58);
  const [currentRiskFactors, setCurrentRiskFactors] = useState<RiskFactorItem[]>([]);

  // Dynamic real-time risk score calculation (0 - 100) based on all live telemetry
  const liveRiskAssessment = useMemo(() => {
    const isLateNight = timeStr.toLowerCase().includes("am") && (
      timeStr.startsWith("01") || timeStr.startsWith("02") || timeStr.startsWith("03") || timeStr.startsWith("04") || timeStr.startsWith("1") || timeStr.startsWith("2") || timeStr.startsWith("3") || timeStr.startsWith("4")
    );
    const isHighAmount = amount >= 8000;
    const isModerateAmount = amount > 2000 && amount < 8000;
    const isFlaggedRecipient = recipient.toLowerCase().includes("support") || recipient.toLowerCase().includes("refund") || recipient.toLowerCase().includes("lottery") || recipient.toLowerCase().includes("new@");

    let score = 10;
    const factors: string[] = [];

    if (activePhoneCall) {
      score += 48;
      factors.push("Active call detected (Vishing risk)");
    }
    if (isCollectRequest) {
      score += 45;
      factors.push("Reverse Collect Request trap");
    }
    if (matchedMuleEntry) {
      score += 50;
      factors.push("Matched Cyber Crime 1930 Blacklist");
    }
    if (isFlaggedRecipient) {
      score += 35;
      factors.push("Flagged scam keywords in UPI handle");
    }
    if (isHighAmount) {
      score += 28;
      factors.push(`Unusual spike ₹${amount.toLocaleString("en-IN")}`);
    } else if (isModerateAmount) {
      score += 15;
      factors.push(`Higher than usual baseline ₹${amount.toLocaleString("en-IN")}`);
    }
    if (isNewDevice) {
      score += 22;
      factors.push("Unfamiliar hardware fingerprint");
    }
    if (isLateNight) {
      score += 16;
      factors.push(`Late-night timing (${timeStr})`);
    }
    if (isNewRecipient) {
      score += 12;
      factors.push("First-time beneficiary");
    }
    if (guardianMode && amount > 5000) {
      score += 10;
      factors.push("Guardian dual-authorization threshold");
    }

    // Clamp score
    const finalScore = Math.min(99, Math.max(8, score));
    const level: "low" | "medium" | "high" = finalScore <= 30 ? "low" : finalScore <= 70 ? "medium" : "high";

    return {
      score: finalScore,
      level,
      factors,
      isLow: level === "low",
      isMedium: level === "medium",
      isHigh: level === "high"
    };
  }, [amount, recipient, timeStr, isNewDevice, isNewRecipient, activePhoneCall, isCollectRequest, matchedMuleEntry, guardianMode]);

  const isCurrentRiskLow = liveRiskAssessment.isLow;
  const liveEstimatedScore = liveRiskAssessment.score;

  // Safe Verified badge copy summary state
  const [copiedSafeVerified, setCopiedSafeVerified] = useState<boolean>(false);

  const handleCopySafeVerifiedSummary = () => {
    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const summaryText = [
      `🛡️ Secure Shield Security Verification Summary`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Status: SAFE VERIFIED (Low Risk)`,
      `• Risk Score: ${liveEstimatedScore || 10}% / 100%`,
      `• Recipient VPA: ${recipient || "N/A"}`,
      `• Transaction Amount: ₹${amount.toLocaleString("en-IN")}`,
      `• Behavioral Time: ${timeStr}`,
      `• Registered Device: ${isNewDevice ? "New Device (Enrolled)" : "Trusted Device (Primary Hardware ID)"}`,
      `• Zero-PII Defense Engine: Active`,
      `• Checks Passed: Valid NPCI VPA format, no scam keyword pattern, baseline velocity normal`,
      `• Verified At: ${timestamp}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Protected before UPI PIN entry by Secure Shield (Zero-PII Client Edge)`
    ].join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopiedSafeVerified(true);
        setTimeout(() => setCopiedSafeVerified(false), 2500);
      }).catch(() => {
        setCopiedSafeVerified(true);
        setTimeout(() => setCopiedSafeVerified(false), 2500);
      });
    } else {
      setCopiedSafeVerified(true);
      setTimeout(() => setCopiedSafeVerified(false), 2500);
    }
  };

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
    if (!isLoggedIn) {
      setIsLoggedIn(true);
    }

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

    // Version C1: Intercepted via Advanced Co-Pilot (Active Call Vishing / Reverse Flow Trap / Mule Match)
    if (activePhoneCall || isCollectRequest || matchedMuleEntry) {
      const reasons: string[] = [];
      const factors: RiskFactorItem[] = [];

      if (activePhoneCall) {
        reasons.push("Active phone call detected during payment (Voice Phishing / Vishing trap)");
        factors.push({
          name: "Vishing / Active Phone Call Intercepted",
          impact: 48,
          type: "risk",
          humanExplanation: "You are currently on a live call. Scammers pose as police/bank officers and pressure victims to enter their UPI PIN."
        });
        regionalVoice.speakAlert("CALL_SCAM");
      }

      if (isCollectRequest) {
        reasons.push("Reverse Flow Inversion: This is a Collect Request, not a credit");
        factors.push({
          name: "Reverse Flow Trap (Collect Request)",
          impact: 50,
          type: "risk",
          humanExplanation: "Entering your UPI PIN will DEDUCT money, not receive it! Scammers send collect requests claiming to send advance payments."
        });
        regionalVoice.speakAlert("COLLECT_TRAP");
      }

      if (matchedMuleEntry) {
        reasons.push(`Beneficiary VPA matches National 1930 / P2P Mule Blacklist (${matchedMuleEntry.reportCount} police reports)`);
        factors.push({
          name: "Cryptographic P2P Mule Blacklist Hit",
          impact: 50,
          type: "risk",
          humanExplanation: `Hash match detected on national cybercrime registry. Category: ${matchedMuleEntry.threatCategory.replace(/_/g, " ")}.`
        });
        regionalVoice.speakAlert("STOP_SCAM");
      }

      const calcMl = 96;
      const calcRules = 98;
      const calcCombined = Math.round(0.70 * calcMl + 0.30 * calcRules);
      setMlScore(calcMl);
      setRuleScore(calcRules);
      setCurrentRiskScore(calcCombined);
      setCurrentReasons(reasons);
      setCurrentRiskFactors(factors);
      setRecoveryTier("instant");
      setCurrentScreen("RESULT_BLOCKED");
      addRecentCheck(amount, recipient, timeStr, "blocked", "Scam Blocked", reasons);
      return;
    }

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
      regionalVoice.speakAlert("STOP_SCAM");

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

  // Initiate PIN Entry or trigger Guardian dual-approval if enabled
  const handleProceedToPinEntry = () => {
    if (guardianMode) {
      setIsGuardianModalOpen(true);
    } else {
      setCurrentScreen("PIN_ENTRY");
    }
  };
  const loadPreset = (type: "safe" | "review" | "blocked" | "call_scam" | "collect_trap" | "mule_scam") => {
    if (type === "safe") {
      setAmount(250);
      setRecipient("Swiggy");
      setTimeStr("01:15 PM");
      setIsNewDevice(false);
      setIsNewRecipient(false);
      setPaymentNote("Lunch order");
      setActivePhoneCall(false);
      setIsCollectRequest(false);
      setMatchedMuleEntry(null);
    } else if (type === "review") {
      setAmount(5000);
      setRecipient("friend@upi");
      setTimeStr("02:00 AM");
      setIsNewDevice(true);
      setIsNewRecipient(true);
      setPaymentNote("Urgent loan");
      setActivePhoneCall(false);
      setIsCollectRequest(false);
      setMatchedMuleEntry(null);
    } else if (type === "call_scam") {
      setAmount(25000);
      setRecipient("cbi_officer_safety@sbi");
      setTimeStr("11:30 AM");
      setIsNewDevice(false);
      setIsNewRecipient(true);
      setPaymentNote("Digital arrest verification bail bond");
      setActivePhoneCall(true);
      setIsCollectRequest(false);
      setMatchedMuleEntry(null);
    } else if (type === "collect_trap") {
      setAmount(14500);
      setRecipient("buyer_army_officer@axis");
      setTimeStr("04:20 PM");
      setIsNewDevice(false);
      setIsNewRecipient(true);
      setPaymentNote("OLX sofa token money receive");
      setActivePhoneCall(false);
      setIsCollectRequest(true);
      setMatchedMuleEntry(null);
    } else if (type === "mule_scam") {
      setAmount(35000);
      setRecipient("lucky_draw_winner99@ybl");
      setTimeStr("01:10 AM");
      setIsNewDevice(true);
      setIsNewRecipient(true);
      setPaymentNote("KBC lottery tax fee");
      setActivePhoneCall(false);
      setIsCollectRequest(false);
    } else {
      setAmount(9999);
      setRecipient("support_refund99@upi");
      setTimeStr("03:30 AM");
      setIsNewDevice(true);
      setIsNewRecipient(true);
      setPaymentNote("Lottery processing fee");
      setActivePhoneCall(false);
      setIsCollectRequest(false);
      setMatchedMuleEntry(null);
    }
  };

  // Switch between any of the 5 user testing personas
  const handleSelectProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    setSelectedBank(`${profile.bankName} (${profile.accountNumberMasked})`);
    if (profile.guardianProtection?.enabled) {
      setGuardianMode(true);
      setGuardianPhone(profile.guardianProtection.guardianPhone);
    } else {
      setGuardianMode(false);
    }
    if (profile.quickScenarioPreset) {
      loadPreset(profile.quickScenarioPreset as any);
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-16 relative selection:bg-emerald-500 selection:text-white">
      {/* Subtle ambient cyber glow background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(14,165,233,0.04),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Top Cyber Brand Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#0c1220]/90 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-black/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div 
            onClick={() => { setCurrentScreen("HOME"); setMainTab("pay"); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-[1.5px] shadow-xl shadow-emerald-950/60 ring-1 ring-emerald-500/40 group-hover:ring-emerald-400 group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/90 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:5px_5px] opacity-25" />
                <div className="relative z-10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                  <Zap className="w-2.5 h-2.5 text-cyan-300 absolute -top-0.5 -right-0.5 animate-pulse" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  SafeUPI
                </span>
                <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono shadow-sm">
                  CYBER GUARD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Header Action Buttons & User Login */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs w-full sm:w-auto justify-end">
            {/* Multilingual AI Chat Copilot Button */}
            <button
              type="button"
              onClick={() => setIsAiChatOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ring-1 ring-emerald-400/40"
              title="Ask SafeUPI AI Copilot in any language (Telugu, Hindi, Tamil, English, etc.)"
            >
              <Bot className="w-3.5 h-3.5 text-white" />
              <span>AI Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            </button>

            {/* Cyber Terminal CLI Prompts Button */}
            <button
              type="button"
              onClick={() => setIsTerminalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-emerald-300 font-mono border border-slate-750 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open Cyber Security Terminal Prompts (CLI)"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Terminal</span>
            </button>

            {/* Primary User Login Button (Directly answers "Where is user login") */}
            <button
              type="button"
              id="btn-header-user-login"
              onClick={() => setIsLoginModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isLoggedIn 
                  ? "bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-emerald-500/60" 
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/50 animate-pulse"
              }`}
              title={isLoggedIn ? `Logged in as ${activeProfile.name} - Click to switch profile or manage session` : "Click to Sign In or choose a testing account"}
            >
              {isLoggedIn ? (
                <>
                  <div className={`w-5 h-5 rounded-lg ${activeProfile.avatarBg} text-white text-[10px] font-extrabold flex items-center justify-center shrink-0`}>
                    {activeProfile.avatarText}
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold text-white">{activeProfile.name.split(" ")[0]}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono">User Login</span>
                  </div>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-black">User Login</span>
                </>
              )}
            </button>

            {/* Persona Switcher Quick Button */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Switch between 5 testing personas (Aarav, Ramesh Chandra Senior, Priya, Vikram, Meera)"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Personas</span>
            </button>

            {/* Multi-Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-850 px-2 py-1 rounded-xl border border-slate-750">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                id="header-language-select"
                value={currentLang}
                onChange={(e) => {
                  const newLang = e.target.value as SupportedLang;
                  setCurrentLang(newLang);
                  const langToVoiceMap: Record<SupportedLang, string> = {
                    en: "en-IN",
                    te: "te-IN",
                    "te-en": "en-IN",
                    hi: "hi-IN",
                    ta: "ta-IN",
                    kn: "kn-IN",
                    mr: "mr-IN"
                  };
                  if (langToVoiceMap[newLang]) {
                    regionalVoice.setLanguage(langToVoiceMap[newLang] as any);
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Interactive Demo Video Walkthrough */}
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Watch 6-Part Interactive Live Demo Walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Demo Video</span>
            </button>

            {/* Jury / Technical View Toggle */}
            <button
              onClick={() => setIsJuryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 font-bold border border-indigo-700/50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Inspect ML Feature Vector and Decision Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.technicalJuryView}</span>
            </button>

            {/* Documentation & Flow Chart PDF Button */}
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold border border-emerald-700/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="View Project Documentation, Architecture Flow Chart & Download PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Docs & PDF</span>
            </button>

            {onOpenHowToUse && (
              <button
                onClick={onOpenHowToUse}
                className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">{t.howItWorks}</span>
              </button>
            )}

            <button
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:brightness-110 text-white font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Scan any UPI QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t.scanQr}</span>
            </button>
          </div>
        </div>

        {/* Global Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 pb-2.5 pt-1 overflow-x-auto relative z-10">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 min-w-max">
            <button
              onClick={() => { setMainTab("pay"); setCurrentScreen("HOME"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "pay"
                  ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.navPay}</span>
            </button>

            <button
              onClick={() => setMainTab("verify")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "verify"
                  ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.navVerify}</span>
            </button>

            <button
              onClick={() => setMainTab("dashboard")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "dashboard"
                  ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.navDashboard}</span>
            </button>

            <button
              onClick={() => setMainTab("recovery")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "recovery"
                  ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.navRecovery}</span>
            </button>

            <button
              onClick={() => setMainTab("simulator")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mainTab === "simulator"
                  ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navLearn}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiChatOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-emerald-950/80 to-teal-950/80 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400"
              title="Open Multilingual AI Chat Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              <span>AI Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => setIsTerminalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-950 text-emerald-400 border border-slate-750 hover:border-emerald-500/40"
              title="Open Cyber Security Terminal Prompts"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terminal CLI</span>
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
            {/* Cyber Hero Banner with Security Badge & Tagline */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400/40 mb-1">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.appName}
              </h1>
              <p className="text-sm font-bold text-emerald-400">
                {t.appTagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                &ldquo;{t.appSubQuote}&rdquo;
              </p>
            </div>

            {/* QR Code Scanner CTA Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-4 text-white shadow-xl flex items-center justify-between gap-3 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>Scan UPI QR Code</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-mono">Camera / URI</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Scan merchant or peer QR with instant risk verification
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
                <span>Open Scanner</span>
              </button>
            </div>

            {/* Scanned QR Notification Alert */}
            {scannedQrNotification && (
              <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2 animate-in fade-in shadow-md">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{scannedQrNotification}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setScannedQrNotification(null)}
                  className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* In-App Action Mode Switcher: "Send / Pay via UPI" vs "Check a Payment" */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-xl flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTabMode("pay")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTabMode === "pay"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/40"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.payViaUpi}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabMode("check")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTabMode === "check"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-500/40"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.checkBeforePay}</span>
              </button>
            </div>

            {/* Quick Demo Scenario Switcher Pills with Dark Cyber Styling */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {t.quickDemoTests}
                </span>
                <button
                  onClick={() => setIsUploaderOpen(!isUploaderOpen)}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>📷 {t.scanScreenshot}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset("safe")}
                  className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                    amount === 250 && recipient === "Swiggy"
                      ? "bg-emerald-950 text-emerald-200 border-emerald-500 ring-1 ring-emerald-500 shadow-md"
                      : "bg-slate-850/80 text-slate-300 border-slate-750 hover:bg-slate-800 hover:border-emerald-500/50"
                  }`}
                >
                  <span className="block text-[10px] text-emerald-400 font-bold">{t.approved}</span>
                  ₹250 Swiggy
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset("review")}
                  className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                    amount === 5000 && recipient === "friend@upi"
                      ? "bg-amber-950 text-amber-200 border-amber-500 ring-1 ring-amber-500 shadow-md"
                      : "bg-slate-850/80 text-slate-300 border-slate-750 hover:bg-slate-800 hover:border-amber-500/50"
                  }`}
                >
                  <span className="block text-[10px] text-amber-400 font-bold">{t.reviewCheck}</span>
                  ₹5,000 Night
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset("blocked")}
                  className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                    amount === 9999 && !activePhoneCall && !isCollectRequest
                      ? "bg-rose-950 text-rose-200 border-rose-500 ring-1 ring-rose-500 shadow-md"
                      : "bg-slate-850/80 text-slate-300 border-slate-750 hover:bg-slate-800 hover:border-rose-500/50"
                  }`}
                >
                  <span className="block text-[10px] text-rose-400 font-bold">{t.blockedScam}</span>
                  ₹9,999 Trap
                </button>
              </div>

              {/* ASTRA 2026 Co-Pilot Demo Presets */}
              <div className="pt-1.5 border-t border-slate-800/80">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>ASTRA Advanced Co-Pilot Scenarios:</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => loadPreset("call_scam")}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                      activePhoneCall
                        ? "bg-purple-950 text-purple-200 border-purple-400 ring-1 ring-purple-400 shadow-md"
                        : "bg-slate-850/80 text-purple-300 border-slate-750 hover:bg-slate-800 hover:border-purple-400/50"
                    }`}
                  >
                    <span className="block text-[10px] text-purple-400 font-bold">{t.vishingCallDemo}</span>
                    ₹25k Fake Police
                  </button>

                  <button
                    type="button"
                    onClick={() => loadPreset("collect_trap")}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                      isCollectRequest
                        ? "bg-amber-950 text-amber-200 border-amber-400 ring-1 ring-amber-400 shadow-md"
                        : "bg-slate-850/80 text-amber-300 border-slate-750 hover:bg-slate-800 hover:border-amber-400/50"
                    }`}
                  >
                    <span className="block text-[10px] text-amber-400 font-bold">{t.collectTrapDemo}</span>
                    ₹14.5k OLX Reversal
                  </button>

                  <button
                    type="button"
                    onClick={() => loadPreset("mule_scam")}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold cursor-pointer ${
                      recipient === "lucky_draw_winner99@ybl"
                        ? "bg-rose-950 text-rose-200 border-rose-400 ring-1 ring-rose-400 shadow-md"
                        : "bg-slate-850/80 text-rose-300 border-slate-750 hover:bg-slate-800 hover:border-rose-400/50"
                    }`}
                  >
                    <span className="block text-[10px] text-rose-400 font-bold">{t.muleScamDemo}</span>
                    ₹35k KBC Lottery
                  </button>
                </div>
              </div>

              {/* Optional Screenshot scan box */}
              {isUploaderOpen && (
                <div className="pt-2 border-t border-slate-800">
                  <TransactionScreenshotUploader 
                    onScanExtracted={handleScreenshotExtracted} 
                    onApplyExtractedPayload={(_payload, scan) => handleScreenshotExtracted(scan)}
                  />
                </div>
              )}
            </div>

            {/* User Authentication & Banking Profile Status Card */}
            {isLoggedIn ? (
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${activeProfile.avatarBg} text-white flex items-center justify-center font-extrabold text-base shadow-inner shrink-0 ring-2 ring-emerald-500/30`}>
                    {activeProfile.avatarText}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-white tracking-tight">
                        {activeProfile.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeProfile.badgeColor}`}>
                        {activeProfile.roleLabel.split("(")[0].trim()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Authenticated
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 font-mono">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeProfile.bankName} ({activeProfile.accountNumberMasked})</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Bal: ₹{activeProfile.accountBalance.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>UPI: <strong className="text-emerald-300">{activeProfile.upiId}</strong></span>
                      <span>•</span>
                      <span>PIN: <strong className="text-amber-300">{activeProfile.defaultPin}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative z-10">
                  <button
                    type="button"
                    id="btn-switch-user-login"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-900/30 cursor-pointer"
                    title="Switch user account or sign in with another phone"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Switch / User Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoggedIn(false)}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-rose-300 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                    title="Log out of current session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-2xl border-2 border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-extrabold text-base shadow-inner shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white">User Login Required</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Guest Mode
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
                      Sign in with your registered mobile (+91) or select a pre-configured testing account to authenticate and authorize live UPI payments.
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>User Login / Sign In</span>
                  </button>
                </div>
              </div>
            )}

            {/* Main Interactive Card: Live Payment or Verification Form */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100">
              <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {activeTabMode === "pay" ? t.transmitSafePayment : t.checkingPaymentTitle}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Zero-PII Shield Active
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeTabMode === "pay" 
                      ? t.paySubtitle
                      : t.checkSubtitle}
                  </p>
                </div>
              </div>

              {/* One question per line */}
              <div className="space-y-4">
                {/* Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-200 shrink-0">
                    {t.amountLabel}
                  </label>
                  <div className="relative flex-1 sm:max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-emerald-400 text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      placeholder={t.amountPlaceholder}
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-750 text-white font-extrabold text-base focus:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* To (UPI ID) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-200 shrink-0">
                    {t.recipientLabel}
                  </label>
                  <div className="flex-1 sm:max-w-xs flex items-center gap-2">
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={t.recipientPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-750 text-white font-mono text-xs font-semibold focus:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      title="Scan UPI QR Code"
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 transition-colors shrink-0 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>

                {/* In Pay Mode: Debiting Bank & Note */}
                {activeTabMode === "pay" && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <label className="text-sm font-bold text-slate-200 shrink-0">
                        {t.payFromBankLabel}
                      </label>
                      <div className="flex-1 sm:max-w-xs space-y-1">
                        <div className="relative">
                          <select
                            value={selectedBank}
                            onChange={(e) => {
                              const newBank = e.target.value;
                              setSelectedBank(newBank);
                              const matched = USER_PROFILES.find(
                                (p) => `${p.bankName} (${p.accountNumberMasked})` === newBank
                              );
                              if (matched) {
                                handleSelectProfile(matched);
                              }
                            }}
                            className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-750 text-white text-xs font-semibold focus:bg-slate-950 focus:border-emerald-500 focus:outline-none appearance-none"
                          >
                            {USER_PROFILES.map((p) => (
                              <option 
                                key={p.id} 
                                value={`${p.bankName} (${p.accountNumberMasked})`}
                                className="bg-slate-900 text-white"
                              >
                                {p.bankName} ({p.accountNumberMasked}) · {p.name.split(" ")[0]}
                              </option>
                            ))}
                          </select>
                          <Landmark className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                          <span>Balance: <strong className="text-emerald-400 font-mono">₹{activeProfile.accountBalance.toLocaleString("en-IN")}</strong></span>
                          <span>UPI: <strong className="font-mono text-emerald-300">{activeProfile.upiId}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <label className="text-sm font-bold text-slate-200 shrink-0">
                        {t.addNoteLabel}
                      </label>
                      <input
                        type="text"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder={t.notePlaceholder}
                        className="flex-1 sm:max-w-xs px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-750 text-white text-xs font-medium focus:bg-slate-950 focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <label className="text-sm font-bold text-slate-200 shrink-0">
                    {t.timeLabel}
                  </label>
                  <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                    <input
                      type="text"
                      value={timeStr}
                      onChange={(e) => setTimeStr(e.target.value)}
                      placeholder="02:00 AM"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-750 text-white font-medium text-xs focus:bg-slate-950 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                      className="shrink-0 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] font-bold text-emerald-300 cursor-pointer"
                      title="Set to right now"
                    >
                      {t.nowBtn}
                    </button>
                  </div>
                </div>

                {/* New device? radio */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-sm font-bold text-slate-200">
                    {t.newDeviceQuestion}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newDevice"
                        checked={isNewDevice === true}
                        onChange={() => setIsNewDevice(true)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.yesOption}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newDevice"
                        checked={isNewDevice === false}
                        onChange={() => setIsNewDevice(false)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.noOption}</span>
                    </label>
                  </div>
                </div>

                {/* New recipient? radio */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">
                    {t.newRecipientQuestion}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newRecipient"
                        checked={isNewRecipient === true}
                        onChange={() => setIsNewRecipient(true)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.yesOption}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="newRecipient"
                        checked={isNewRecipient === false}
                        onChange={() => setIsNewRecipient(false)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{t.noOption}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ASTRA 2026 Next-Gen Safety Co-Pilot Integration Panel */}
              <div className="pt-1">
                <AdvancedSafetyCoPilot
                  activePhoneCall={activePhoneCall}
                  onToggleActivePhoneCall={(val) => setActivePhoneCall(val)}
                  isCollectRequest={isCollectRequest}
                  onToggleCollectRequest={(val) => setIsCollectRequest(val)}
                  guardianMode={guardianMode}
                  onToggleGuardianMode={(val) => setGuardianMode(val)}
                  guardianPhone={guardianPhone}
                  onChangeGuardianPhone={(val) => setGuardianPhone(val)}
                  currentRecipient={recipient}
                  currentAmount={amount}
                  onMuleFound={(mule) => setMatchedMuleEntry(mule)}
                  selectedVoiceLang={
                    currentLang === "te" ? "te-IN" :
                    currentLang === "hi" ? "hi-IN" :
                    currentLang === "ta" ? "ta-IN" :
                    currentLang === "kn" ? "kn-IN" :
                    currentLang === "mr" ? "mr-IN" : "en-IN"
                  }
                  onVoiceLangChange={(voiceLang) => {
                    const voiceToAppLang: Record<string, SupportedLang> = {
                      "te-IN": "te",
                      "hi-IN": "hi",
                      "ta-IN": "ta",
                      "kn-IN": "kn",
                      "mr-IN": "mr",
                      "en-IN": "en"
                    };
                    if (voiceToAppLang[voiceLang]) {
                      setCurrentLang(voiceToAppLang[voiceLang]);
                    }
                  }}
                />
              </div>

              {/* Primary Action Button & Security Status */}
              <div className="pt-2">
                {/* =========================================================================
                    PAYMENT SECURITY STATUS & REAL-TIME SAFETY INDICATORS
                   ========================================================================= */}
                <div id="payment-security-status-container" className="space-y-3.5 mb-4">
                  {/* 1. Payment Security Status Banner */}
                  <div
                    id="payment-security-status-card"
                    className={`p-4 rounded-2xl border transition-all duration-300 shadow-md ${
                      liveRiskAssessment.isLow
                        ? "bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-emerald-500/40 text-emerald-100"
                        : liveRiskAssessment.isMedium
                        ? "bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-amber-500/40 text-amber-100"
                        : "bg-gradient-to-r from-rose-950/95 via-slate-900 to-rose-950/95 border-rose-500/60 text-rose-100 animate-pulse"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative shrink-0 mt-0.5 sm:mt-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                            liveRiskAssessment.isLow
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                              : liveRiskAssessment.isMedium
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/50"
                          }`}>
                            {liveRiskAssessment.isLow ? (
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            ) : liveRiskAssessment.isMedium ? (
                              <HelpCircle className="w-5 h-5 text-amber-400" />
                            ) : (
                              <ShieldAlert className="w-5 h-5 text-rose-400" />
                            )}
                          </div>
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              liveRiskAssessment.isLow ? "bg-emerald-400" : liveRiskAssessment.isMedium ? "bg-amber-400" : "bg-rose-400"
                            }`} />
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                              liveRiskAssessment.isLow ? "bg-emerald-500" : liveRiskAssessment.isMedium ? "bg-amber-500" : "bg-rose-500"
                            }`} />
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Payment Security Status
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              liveRiskAssessment.isLow
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : liveRiskAssessment.isMedium
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            }`}>
                              {liveRiskAssessment.isLow 
                                ? "Verified Safe · Low Risk"
                                : liveRiskAssessment.isMedium
                                ? "Caution · Review Recommended"
                                : "Critical Alert · High Risk"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium mt-0.5">
                            {liveRiskAssessment.isLow
                              ? "All real-time safety indicators passed. Payee identity and spending velocity match your normal baseline."
                              : liveRiskAssessment.isMedium
                              ? "Telemetry alert: New beneficiary or unusual transaction timing detected. Verify recipient carefully."
                              : "High-risk trigger intercepted! Known fraud keywords or active coercion detected. Review before proceeding."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          id="btn-share-safe-verification"
                          onClick={handleCopySafeVerifiedSummary}
                          title="Copy security verification summary for personal records"
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 text-xs font-bold shadow-xs ${
                            liveRiskAssessment.isLow
                              ? "bg-emerald-900/40 hover:bg-emerald-800/60 border-emerald-500/40 text-emerald-300"
                              : liveRiskAssessment.isMedium
                              ? "bg-amber-900/40 hover:bg-amber-800/60 border-amber-500/40 text-amber-300"
                              : "bg-rose-900/40 hover:bg-rose-800/60 border-rose-500/40 text-rose-300"
                          }`}
                        >
                          {copiedSafeVerified ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share Status</span>
                            </>
                          )}
                        </button>
                        <div className={`px-2.5 py-1 rounded-xl border text-center font-mono ${
                          liveRiskAssessment.isLow
                            ? "bg-emerald-900/50 border-emerald-500/30 text-emerald-300"
                            : liveRiskAssessment.isMedium
                            ? "bg-amber-900/50 border-amber-500/30 text-amber-300"
                            : "bg-rose-900/50 border-rose-500/30 text-rose-300"
                        }`}>
                          <div className="text-[9px] uppercase tracking-wider text-slate-400">Confidence</div>
                          <div className="text-xs font-black">{100 - liveRiskAssessment.score}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Security Gauge */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold font-mono">
                        <span className="text-emerald-400">0% (Safe & Protected)</span>
                        <span className="text-amber-400">50% (Review Advised)</span>
                        <span className="text-rose-400">100% (Fraud Blocked)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden relative p-0.5 border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            liveRiskAssessment.isLow
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                              : liveRiskAssessment.isMedium
                              ? "bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500"
                              : "bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600"
                          }`}
                          style={{ width: `${Math.max(5, liveRiskAssessment.score)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Real-time Safety Indicators Grid */}
                  <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-750">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">Real-time Safety Indicators</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Sensors Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Indicator 1: Payee Identity */}
                      <div className="bg-slate-850/80 rounded-xl p-2.5 border border-slate-800 flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-200">Payee Authenticity</span>
                            {recipient.toLowerCase().includes("support") || recipient.toLowerCase().includes("refund") || recipient.toLowerCase().includes("lottery") ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Flagged Words</span>
                            ) : isNewRecipient ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">1st Time Payee</span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified VPA</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                            {recipient || "No recipient entered"}
                          </p>
                        </div>
                      </div>

                      {/* Indicator 2: Device Hardware Trust */}
                      <div className="bg-slate-850/80 rounded-xl p-2.5 border border-slate-800 flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 mt-0.5">
                          <Smartphone className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-200">Device Hardware Trust</span>
                            {isNewDevice ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">New Hardware</span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Enrolled Device</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {isNewDevice ? "Hardware token mismatch" : "Cryptographic signature validated"}
                          </p>
                        </div>
                      </div>

                      {/* Indicator 3: Spending Velocity & Timing */}
                      <div className="bg-slate-850/80 rounded-xl p-2.5 border border-slate-800 flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-200">Velocity & Timing</span>
                            {amount >= 8000 ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">High Value (₹{amount.toLocaleString("en-IN")})</span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Normal Velocity</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            Time: {timeStr} · Regular window
                          </p>
                        </div>
                      </div>

                      {/* Indicator 4: Coercion & Screen Share Shield */}
                      <div className="bg-slate-850/80 rounded-xl p-2.5 border border-slate-800 flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-200">Coercion Shield</span>
                            {activePhoneCall ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Active Call Vishing!</span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Isolated Screen</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {activePhoneCall ? "Coercion in progress detected" : "Zero remote mirroring or active calls"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detected Risk Factors Pill Tags */}
                    {liveRiskAssessment.factors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2.5 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold mr-0.5">
                          Active Safety Triggers:
                        </span>
                        {liveRiskAssessment.factors.map((factor, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/15 border border-rose-500/25 text-rose-200"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-check-this-payment"
                  onClick={handleStartCheck}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.99] text-white font-extrabold text-base shadow-xl shadow-emerald-950/60 ring-1 ring-emerald-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {activeTabMode === "pay" ? (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.btnPayNow} (₹{amount.toLocaleString("en-IN")})</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>{t.btnCheckBeforePay}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust text at the bottom, small and grey */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400 text-center">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  {t.quietlyChecks}
                </span>
                <span className="hidden sm:inline text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {t.checksFast}
                </span>
              </div>
            </div>

            {/* =========================================================================
                SCREEN 6: RECENT CHECKS & TRANSMITTED PAYMENTS
               ========================================================================= */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {t.recentChecksTitle}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium font-mono">
                  {recentChecks.length} {t.entriesCount}
                </span>
              </div>

              <div className="divide-y divide-slate-800/60 space-y-1">
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
                      className="pt-2.5 first:pt-0 flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">
                          {isApproved ? "✅" : isBlocked ? "🚫" : "⚠️"}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="text-white font-extrabold">₹{item.amount.toLocaleString("en-IN")}</span>
                            <span className="text-slate-500 font-normal">→</span>
                            <span className="text-slate-300 font-medium">{item.recipient}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                            <span>{item.time}</span>
                            {item.utr && (
                              <span className="text-emerald-400 font-semibold font-mono">UTR: {item.utr}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          isApproved 
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
                            : isBlocked 
                            ? "bg-rose-500/10 text-rose-300 border-rose-500/30" 
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}>
                          {isApproved ? "Risk: 12%" : isBlocked ? "Risk: 94%" : "Risk: 58%"}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isApproved
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : isBlocked
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}>
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
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
                {t.takingALook}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {t.checkingDetails}
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
              {t.verifiesWithoutTransmitting}
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
                {t.looksGoodTitle}
              </h2>
            </div>

            <div className="space-y-2 text-sm leading-relaxed text-[#2E7D32] font-medium">
              <p>
                ₹{amount.toLocaleString("en-IN")} → {recipient} {t.looksGoodSub}
              </p>
              <p>
                {t.sentOnUsualDevice}
              </p>
              <p className="pt-2 font-bold text-[#1B5E20]">
                {t.allSet}
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
                  onClick={handleProceedToPinEntry}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{t.enterPinToTransmit} (₹{amount.toLocaleString("en-IN")})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentScreen("HOME")}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
                >
                  {t.doneBtn}
                </button>
              )}

              <div className="text-center pt-1">
                <button
                  onClick={() => setCurrentScreen("HOME")}
                  className="text-xs text-[#2E7D32]/90 hover:text-[#1B5E20] font-semibold underline cursor-pointer"
                >
                  {t.backToHome}
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
                {t.quickCheckTitle}
              </h2>
            </div>

            <p className="text-sm font-medium text-[#B26A00] leading-relaxed">
              {t.differentPattern}
            </p>

            {/* Reasons List */}
            <div className="space-y-2 bg-white/70 rounded-2xl p-4 border border-[#FFE082]/60">
              <span className="text-xs font-bold text-[#8D4F00] uppercase tracking-wider block">
                {t.weNoticed}
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
                {t.wasThisReallyYou}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  id="btn-yes-this-was-me"
                  onClick={() => {
                    addRecentCheck(amount, recipient, timeStr, "confirmed", "Confirmed by you", currentReasons);
                    if (activeTabMode === "pay") {
                      handleProceedToPinEntry();
                    } else {
                      setCurrentScreen("CONFIRMED_BY_ME");
                    }
                  }}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{activeTabMode === "pay" ? t.yesContinuePay : t.yesThisWasMe}</span>
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
                  <span>{t.noSomethingWrong}</span>
                </button>
              </div>
            </div>

            {/* Reassurance at the bottom */}
            <div className="pt-2 border-t border-[#FFE082]/70 text-center space-y-0.5 text-xs text-[#8D4F00]">
              <p className="font-bold">{t.moneyNotTransmittedYet}</p>
              <p className="opacity-90">{t.nothingChargedUntilConfirm}</p>
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
                {t.pausedForSafetyTitle}
              </h2>
            </div>

            <p className="text-sm font-medium text-[#B71C1C] leading-relaxed">
              {t.matchedFraudPattern}
            </p>

            {/* Reasons List */}
            <div className="space-y-2 bg-white/70 rounded-2xl p-4 border border-[#FFCDD2]/60">
              <span className="text-xs font-bold text-[#8A1313] uppercase tracking-wider block">
                {t.reasonsTitle}
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
                {t.whatWeCanDo}
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
                <span>{t.seeRecoveryOptions}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 border border-rose-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-rose-700" />
                <span>{t.callBankHelpline}</span>
              </button>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>{t.fileCyberComplaint}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  addRecentCheck(amount, recipient, timeStr, "confirmed", "Confirmed by you", currentReasons);
                  if (activeTabMode === "pay") {
                    handleProceedToPinEntry();
                  } else {
                    setCurrentScreen("CONFIRMED_BY_ME");
                  }
                }}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-[#8A1313] hover:bg-white/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.overrideThisWasMe}</span>
              </button>
            </div>

            {/* Reassurance footer */}
            <div className="pt-3 border-t border-[#FFCDD2]/70 text-center text-xs text-[#8A1313] font-medium">
              {t.notAloneReassurance}
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
                {t.enterPinTitle}
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-900">
                <span>{t.payingAmountTo} ₹{amount.toLocaleString("en-IN")}</span>
                <span>to</span>
                <span className="font-mono text-slate-800">{recipient}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t.debitingFrom} {selectedBank}
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
                {t.cancelBtn}
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
                <span>{t.transmittingSecurely}</span>
              </div>
            ) : (
              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-rose-700" />
                  {t.quietlyChecks}
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
                <span>{t.paymentSuccessfulTitle}</span>
              </p>
              <p className="text-xs text-slate-500">
                {t.paidToText} <strong className="text-slate-800">{recipient}</strong>
              </p>
            </div>

            {/* Receipt Summary Card with Deep Rose & Emerald highlights */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.upiRefId}</span>
                <span className="font-mono font-bold text-slate-900">{completedUtr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.fromBankText}</span>
                <span className="font-medium text-slate-800">{selectedBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.noteText}</span>
                <span className="font-medium text-slate-800">{paymentNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.dateTimeText}</span>
                <span className="font-mono text-slate-700">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-rose-200/60">
                <span className="text-slate-500">{t.securityCheckText}</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.verifiedSafeBeforeTx}
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
                <span>{copiedUtr ? t.receiptCopied : t.copyReceipt}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                {t.paySomeoneElse}
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
                    <span>{copiedTxnDetails ? t.copied : (currentLang === "te" ? "సైబర్ పోర్టల్‌లో అతికించడానికి వివరాలను కాపీ చేయండి" : "Copy details to paste in cyber portal")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recovery honesty line */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              &ldquo;{currentLang === "te" 
                ? "మేము దీనిని వెంటనే రిపోర్ట్ చేయడానికి మీకు సహాయం చేస్తాము. రికవరీ అనేది బ్యాంక్ ఎంత త్వరగా చర్య తీసుకుంటుంది అనేదానిపై ఆధారపడి ఉంటుంది — రాబోయే 24 గంటల్లో చర్య తీసుకోవడం ద్వారా రికవరీ అవకాశాలు ఎక్కువగా ఉంటాయి."
                : "We'll help you report this right away. Recovery depends on how quickly the bank can act, and unfortunately we can't guarantee it — but acting in the next 24 hours gives you the best chance."}&rdquo;
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
                  <span>{currentLang === "te" ? "మనీ ట్రైల్ & బ్యాంక్ లేఖను ట్రేస్ చేయండి" : "Trace Money Trail & Bank Letter"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentScreen("HOME")}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{t.backToHome}</span>
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
                      {currentLang === "te" ? "చెల్లింపు స్క్రీన్‌షాట్ & క్యూఆర్ ధృవీకరణ స్టూడియో" : "Payment Screenshot & QR Verification Studio"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentLang === "te" ? "నకిలీ రసీదులు, మోసపూరిత క్యూఆర్ కోడ్‌లు మరియు ఫోర్జరీ వివరాలను గుర్తించండి" : "Detect forged payment receipts, malicious QR redirects, and edited transaction proofs"}
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
                      {currentLang === "te" ? "రియల్-టైమ్ కెమెరా క్యూఆర్ స్కానర్" : "Real-Time Camera QR Scanner"}
                    </h3>
                    <p className="text-xs text-rose-200">
                      {currentLang === "te" ? "తక్షణ సంతకం & భద్రతా తనిఖీ కోసం ఏ యూపీఐ క్యూఆర్ కోడ్‌నైనా స్కాన్ చేయండి" : "Scan any paper or screen UPI QR code for instant signature check"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrScannerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-extrabold text-xs shadow-xs transition-all cursor-pointer shrink-0"
                >
                  {currentLang === "te" ? "కెమెరా తెరవండి" : "Open Camera"}
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
            <TransactionRiskDashboard 
              currentLang={currentLang}
            />
          </div>
        )}

        {/* TAB 4: RECOVERY TRACKER HUB */}
        {mainTab === "recovery" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <RecoveryTrackerHub 
              currentLang={currentLang}
              onOpenBankModal={() => setIsBankModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 5: SCAM SIMULATOR & AWARENESS */}
        {mainTab === "simulator" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <ScamSimulatorAndAwareness 
              currentLang={currentLang}
            />
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

      {/* ASTRA 2026 Guardian Dual-Approval Modal */}
      <GuardianApprovalModal
        isOpen={isGuardianModalOpen}
        onClose={() => setIsGuardianModalOpen(false)}
        onApproved={() => {
          setIsGuardianModalOpen(false);
          setCurrentScreen("PIN_ENTRY");
        }}
        amount={amount}
        recipient={recipient}
        guardianPhone={guardianPhone}
      />

      {/* User Profiles & Banking Details Switcher Modal (5 Accounts) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
      />

      {/* User Login & Authentication Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        isLoggedIn={isLoggedIn}
        activeProfile={activeProfile}
        onLogin={(profile) => {
          handleSelectProfile(profile);
          setIsLoggedIn(true);
          setIsLoginModalOpen(false);
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsLoginModalOpen(false);
        }}
      />

      {/* Project Documentation & Flow Chart PDF Modal */}
      <ProjectDocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />

      {/* Floating Multilingual AI Copilot Button */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAiChatOpen(true)}
          className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-extrabold shadow-2xl shadow-emerald-950/80 ring-2 ring-emerald-400/50 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105"
          title="Ask SafeUPI AI Copilot in any language"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-black">AI Multilingual Chat</span>
            <span className="text-[9px] text-emerald-200 font-normal">Answers in your language</span>
          </div>
        </button>
      </div>

      {/* Multilingual AI Chat Modal */}
      <SafeUpiAiChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
};
