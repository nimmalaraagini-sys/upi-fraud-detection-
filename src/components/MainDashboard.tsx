import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  CreditCard,
  QrCode,
  AlertTriangle,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Upload,
  Camera,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  PhoneCall,
  FileText,
  AlertOctagon,
  Info,
  Check,
  X,
  Smartphone,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  Sun,
  Moon,
  Palette,
  Globe,
  Database,
  Activity,
  FileCheck,
  Radio,
  Building,
  CheckCircle,
  FileWarning,
  Loader2,
  Sliders,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  Cpu,
  Users
} from "lucide-react";
import { SafeUpiLogo } from "./SafeUpiLogo";
import { SafeUpiAiChat } from "./SafeUpiAiChat";
import jsQR from "jsqr";
import { evaluateRiskEngine, scanTransactionScreenshot } from "../utils/fraudEngine";
import { muleRegistry } from "../utils/muleRegistry";
import { QrCodeScannerModal, DecodedUpiQr } from "./QrCodeScannerModal";
import { TransactionScreenshotUploader } from "./TransactionScreenshotUploader";
import { TransactionRiskDashboard } from "./TransactionRiskDashboard";
import { SupportedLang, MULTI_TRANSLATIONS } from "../utils/translations";
import { regionalVoice, IndianLanguage } from "../utils/regionalVoice";
import { PresentationDeck } from "./PresentationDeck";
import { ProjectDocumentationModal } from "./ProjectDocumentationModal";
import { MongoDatabaseHubModal } from "./MongoDatabaseHubModal";
import { PaymentSecurityStatusGauge } from "./PaymentSecurityStatusGauge";
import { TransactionInterceptionModal, InterceptionCheckData, TransactionType } from "./TransactionInterceptionModal";
import { FourMajorAttackPatternsModal, AttackPatternDetail } from "./FourMajorAttackPatternsModal";
import { CentralRiskAndFeatureEngineModal } from "./CentralRiskAndFeatureEngineModal";
import { AiFraudCaseCenterModal } from "./AiFraudCaseCenterModal";
import { DecisionLogsAndAuditTrailModal } from "./DecisionLogsAndAuditTrailModal";
import { TransactionGraphModal } from "./TransactionGraphModal";
import { DeploymentArchitectureModal } from "./DeploymentArchitectureModal";

interface MainDashboardProps {
  user: {
    name: string;
    mobile: string;
    email: string;
  };
  onLogout: () => void;
}

type DashboardTab = "home" | "pay" | "scan" | "history" | "detection" | "screenshot" | "scams" | "recovery";

export const MainDashboard: React.FC<MainDashboardProps> = ({ user, onLogout }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isMongoHubOpen, setIsMongoHubOpen] = useState(false);

  // Dual Role Mode: End-User Payment Experience vs Enterprise Security Operations Center (SOC)
  const [userRoleMode, setUserRoleMode] = useState<"USER" | "SOC">("USER");

  // Section 2: 7 Supported Transaction Categories
  const [selectedTxnType, setSelectedTxnType] = useState<TransactionType>("P2P Transfer");

  // Enterprise Cybersecurity Modals (Section 1, 3, 4, 8, 12, 16, 20, 28)
  const [isInterceptionModalOpen, setIsInterceptionModalOpen] = useState(false);
  const [interceptionData, setInterceptionData] = useState<InterceptionCheckData | null>(null);
  const [isAttackPatternsModalOpen, setIsAttackPatternsModalOpen] = useState(false);
  const [isCentralEngineModalOpen, setIsCentralEngineModalOpen] = useState(false);
  const [isCaseCenterModalOpen, setIsCaseCenterModalOpen] = useState(false);
  const [isDecisionLogsModalOpen, setIsDecisionLogsModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Profile modal states
  const [activeProfileTab, setActiveProfileTab] = useState<"profile" | "security" | "settings" | null>(null);

  // -------------------------------------------------------------
  // MULTI-LANGUAGE ENGINE (English, Telugu, Hindi, Tamil, Kannada, Marathi)
  // -------------------------------------------------------------
  const [currentLang, setCurrentLang] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem("safeupi_language");
      if (saved && ["en", "te", "hi", "ta", "kn", "mr"].includes(saved)) {
        return saved as SupportedLang;
      }
    } catch (e) {
      console.warn("Could not read stored language", e);
    }
    return "en";
  });

  const t = MULTI_TRANSLATIONS[currentLang] || MULTI_TRANSLATIONS.en;

  const handleLanguageChange = (newLang: SupportedLang) => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem("safeupi_language", newLang);
    } catch (e) {
      console.warn("Could not save language", e);
    }
    const langToVoiceMap: Record<SupportedLang, IndianLanguage> = {
      en: "en-IN",
      te: "te-IN",
      "te-en": "en-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      kn: "kn-IN",
      mr: "mr-IN"
    };
    if (langToVoiceMap[newLang]) {
      regionalVoice.setLanguage(langToVoiceMap[newLang]);
    }
  };

  // -------------------------------------------------------------
  // BACKEND PERSISTENT DATABASE & TELEMETRY
  // -------------------------------------------------------------
  const [dbConnected, setDbConnected] = useState(true);
  const [dbStats, setDbStats] = useState({
    totalTransactions: 5,
    blockedCount: 2,
    totalProtectedAmount: 43500,
    muleRegistryCount: 6,
    activeComplaints: 1,
    lastUpdated: new Date().toISOString()
  });
  const [threatIntelAlerts, setThreatIntelAlerts] = useState<any[]>([]);

  // Mule Search Tool State
  const [muleSearchQuery, setMuleSearchQuery] = useState("");
  const [muleSearchResults, setMuleSearchResults] = useState<any[] | null>(null);
  const [isSearchingMule, setIsSearchingMule] = useState(false);

  // 1930 Cybercrime Complaint Filing State
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintSuspectVpa, setComplaintSuspectVpa] = useState("");
  const [complaintAmount, setComplaintAmount] = useState("");
  const [complaintType, setComplaintType] = useState("Collect Request Phishing");
  const [complaintNotes, setComplaintNotes] = useState("");
  const [complaintSuccessDocket, setComplaintSuccessDocket] = useState<{ id: string; docketNumber: string } | null>(null);
  const [isFilingComplaint, setIsFilingComplaint] = useState(false);

  // -------------------------------------------------------------
  // PAYMENT FLOW STATE
  // -------------------------------------------------------------
  const [payVpa, setPayVpa] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [paymentPhase, setPaymentPhase] = useState<"form" | "checking" | "result" | "pin" | "success">("form");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isAuthorizingPin, setIsAuthorizingPin] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("HDFC Bank · A/c XX4921");
  const [pendingPaymentData, setPendingPaymentData] = useState<{
    merchant: string;
    vpa: string;
    amount: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    riskScore: number;
  } | null>(null);
  const [checkProgress, setCheckProgress] = useState(0);
  const [isWhyScoreOpen, setIsWhyScoreOpen] = useState(false);
  
  // Payment check evaluation result
  const [currentEval, setCurrentEval] = useState<{
    riskScore: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    message: string;
    factors: { label: string; impact: number; desc: string }[];
    reasons: string[];
    recommendations: string[];
  }>({
    riskScore: 18,
    riskLevel: "LOW",
    title: "No major suspicious signals detected",
    message: "Beneficiary and transaction velocity match safe baseline parameters.",
    factors: [
      { label: "Beneficiary information", impact: 0, desc: "Verified merchant / established contact" },
      { label: "Transaction amount", impact: 5, desc: "Within usual daily spending pattern" },
      { label: "Behavioural signals", impact: 3, desc: "Standard daytime user flow" },
      { label: "Security signals", impact: 10, desc: "No remote screen-sharing tools detected" },
    ],
    reasons: [],
    recommendations: ["Always double-check recipient display name", "Never disclose UPI PIN for receiving funds"]
  });

  // Dynamic real-time risk assessment for Payment Security Status Gauge
  const livePaymentRisk = useMemo(() => {
    const amt = parseFloat(payAmount) || 0;
    const vpa = (payVpa || "").toLowerCase().trim();
    let score = 10;
    
    if (vpa.includes("support") || vpa.includes("refund") || vpa.includes("lottery") || vpa.includes("kyc") || vpa.includes("urgent") || vpa.includes("bail") || vpa.includes("cbi")) {
      score += 48;
    } else if (vpa.includes("army") || vpa.includes("desk99") || vpa.includes("pass") || vpa.includes("olx")) {
      score += 38;
    }
    if (amt >= 20000) {
      score += 30;
    } else if (amt >= 8000) {
      score += 20;
    } else if (amt >= 2000) {
      score += 10;
    }
    if (muleRegistry && (muleRegistry.isMuleVpa(vpa) || vpa.includes("refund.desk99") || vpa.includes("urgent.kyc"))) {
      score += 48;
    }

    const finalScore = Math.min(99, Math.max(8, score));
    const level: "low" | "medium" | "high" = finalScore <= 30 ? "low" : finalScore <= 70 ? "medium" : "high";
    return { score: finalScore, level };
  }, [payVpa, payAmount]);

  // -------------------------------------------------------------
  // QR SCANNER STATE
  // -------------------------------------------------------------
  const [qrScanning, setQrScanning] = useState(false);
  const [scannedPayee, setScannedPayee] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // -------------------------------------------------------------
  // SCREENSHOT ANALYSIS STATE
  // -------------------------------------------------------------
  const [screenshotAnalyzing, setScreenshotAnalyzing] = useState(false);
  const [screenshotResult, setScreenshotResult] = useState<{
    riskScore: number;
    status: string;
    factors: string[];
    evidence: string;
  } | null>(null);

  // -------------------------------------------------------------
  // SCAM SIMULATOR STATE
  // -------------------------------------------------------------
  const [selectedScamId, setSelectedScamId] = useState<string>("collect_scam");

  // -------------------------------------------------------------
  // TRANSACTION HISTORY STATE (Persistent in localStorage)
  // -------------------------------------------------------------
  const [historyFilter, setHistoryFilter] = useState<"ALL" | "SAFE" | "WARNING" | "BLOCKED">("ALL");
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("safeupi_transactions");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load stored transactions", e);
    }
    return [
      {
        id: "TXN-90214",
        merchant: "Swiggy Food Delivery",
        vpa: "swiggy.orders@icici",
        date: "Today, 1:15 PM",
        amount: "₹450",
        status: "Completed",
        riskLevel: "LOW",
        riskScore: 12,
      },
      {
        id: "TXN-88192",
        merchant: "Unknown Merchant (OLX Refund Trap)",
        vpa: "refund.desk99@ybl",
        date: "Yesterday, 6:40 PM",
        amount: "₹8,500",
        status: "Blocked",
        riskLevel: "HIGH",
        riskScore: 87,
      },
      {
        id: "TXN-87410",
        merchant: "Sharma Kirana Store",
        vpa: "sharmastore@paytm",
        date: "20 Sep, 11:20 AM",
        amount: "₹1,240",
        status: "Completed",
        riskLevel: "LOW",
        riskScore: 18,
      },
      {
        id: "TXN-86992",
        merchant: "KYC Fast Service Verification",
        vpa: "urgent.kyc.update@airtel",
        date: "19 Sep, 9:05 PM",
        amount: "₹35,000",
        status: "Blocked",
        riskLevel: "HIGH",
        riskScore: 94,
      },
      {
        id: "TXN-85401",
        merchant: "New Landlord Rent",
        vpa: "srinivas.rent@hdfc",
        date: "18 Sep, 10:00 AM",
        amount: "₹18,500",
        status: "Completed",
        riskLevel: "MEDIUM",
        riskScore: 48,
      },
    ];
  });

  // Real-time protection toggles
  const [isScreenShareDetected, setIsScreenShareDetected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  // Synchronize with backend database on mount
  useEffect(() => {
    const initBackendData = async () => {
      try {
        const [healthRes, txRes, statsRes, threatRes] = await Promise.allSettled([
          fetch("/api/health").then((r) => r.json()),
          fetch("/api/transactions").then((r) => r.json()),
          fetch("/api/database/stats").then((r) => r.json()),
          fetch("/api/threat-intel").then((r) => r.json()),
        ]);

        if (healthRes.status === "fulfilled" && healthRes.value?.status === "healthy") {
          setDbConnected(true);
        }

        if (txRes.status === "fulfilled" && txRes.value?.transactions?.length > 0) {
          setTransactions(txRes.value.transactions);
          try {
            localStorage.setItem("safeupi_transactions", JSON.stringify(txRes.value.transactions));
          } catch (e) {
            console.warn(e);
          }
        }

        if (statsRes.status === "fulfilled" && statsRes.value) {
          setDbStats(statsRes.value);
        }

        if (threatRes.status === "fulfilled" && threatRes.value?.alerts) {
          setThreatIntelAlerts(threatRes.value.alerts);
        }
      } catch (err) {
        console.warn("Backend API sync: utilizing resilient local ledger", err);
      }
    };

    initBackendData();
  }, []);

  // Helper to persist transaction record to both local state and backend database
  const recordTransaction = (newTx: {
    merchant: string;
    vpa: string;
    amount: string;
    status: "Completed" | "Blocked";
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    riskScore: number;
  }) => {
    try {
      const rawAmt = typeof newTx.amount === "string" ? newTx.amount.replace(/[^0-9.]/g, "") : String(newTx.amount || "0");
      const formattedAmt = `₹${parseFloat(rawAmt || "0").toLocaleString("en-IN")}`;
      const safeMerchant = String(newTx.merchant || "Verified Merchant").trim();
      const safeVpa = String(newTx.vpa || "payment@upi").trim();
      const safeStatus = newTx.status || "Completed";
      const safeRiskLevel = newTx.riskLevel || "LOW";
      const safeRiskScore = Number(newTx.riskScore) || 12;

      const newEntry = {
        id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
        merchant: safeMerchant,
        vpa: safeVpa,
        date: "Just now",
        amount: formattedAmt,
        status: safeStatus,
        riskLevel: safeRiskLevel,
        riskScore: safeRiskScore,
      };
      setTransactions((prev: any[]) => {
        const updated = [newEntry, ...(Array.isArray(prev) ? prev : [])];
        try {
          localStorage.setItem("safeupi_transactions", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to persist transactions", e);
        }
        return updated;
      });

      // Real backend database persistence
      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: safeMerchant,
          vpa: safeVpa,
          amount: parseFloat(rawAmt || "0") || 0,
          status: safeStatus,
          riskLevel: safeRiskLevel,
          riskScore: safeRiskScore,
          category: safeStatus === "Blocked" ? "Blocked Fraud Threat" : "Verified Payment",
          notes: `Recorded via SafeUPI Shield (Risk Score: ${safeRiskScore})`
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            fetch("/api/database/stats")
              .then((r) => r.json())
              .then((s) => setDbStats(s))
              .catch(() => {});
          }
        })
        .catch((e) => console.warn("Background backend sync note:", e));
    } catch (e) {
      console.warn("recordTransaction caught error:", e);
    }
  };

  // Real-Time Risk & Fraud Evaluation Engine Check
  const runSecurityCheck = async (vpa: string, amt: string) => {
    setPaymentPhase("checking");
    setCheckProgress(25);

    const cleanVpa = vpa.trim().toLowerCase();
    const numericAmt = parseFloat(amt) || 0;

    // 1. Query live community mule registry (offline SHA-256 + 1930 registry)
    const muleMatch = await muleRegistry.checkVpa(cleanVpa);

    const timer1 = setTimeout(() => setCheckProgress(65), 350);
    const timer2 = setTimeout(() => setCheckProgress(90), 700);

    const timer3 = setTimeout(() => {
      setCheckProgress(100);

      const isSusKeywords =
        cleanVpa.includes("refund") ||
        cleanVpa.includes("kyc") ||
        cleanVpa.includes("olx") ||
        cleanVpa.includes("lottery") ||
        cleanVpa.includes("desk") ||
        cleanVpa.includes("police") ||
        cleanVpa.includes("customs");

      // Run mathematically grounded scoring & rule violations
      const result = evaluateRiskEngine({
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString(),
        senderVpa: `${(user.mobile || "9876543210").replace(/\D/g, "")}@safeupi`,
        senderName: user.name,
        senderAccountAgeDays: 365,
        receiverVpa: cleanVpa,
        receiverName: cleanVpa.split("@")[0].replace(/[._-]/g, " "),
        receiverCategory: isSusKeywords ? "unknown" : cleanVpa.includes("swiggy") || cleanVpa.includes("store") || cleanVpa.includes("merchant") ? "merchant" : "individual",
        receiverAccountAgeHours: isSusKeywords ? 12 : 720,
        amount: numericAmt,
        userAvgMonthlyAmount: 4500,
        userMaxHistoricalAmount: 25000,
        frequencyLast10Mins: 1,
        frequencyLast24Hours: 3,
        channel: cleanVpa.includes("refund") ? "collect_request" : "direct_vpa",
        deviceTrusted: true,
        deviceChangedRecently: false,
        isEmulatedOrRooted: false,
        screenShareAppActive: isScreenShareDetected,
        locationCity: "Hyderabad",
        distanceFromHomeKm: 2,
        unusualHour: new Date().getHours() < 5,
        activePhoneCall: isCallActive,
        muleBlacklistHit: Boolean(muleMatch) || isSusKeywords,
      });

      const score = Math.min(100, Math.max(0, result.riskScore));
      const level: "LOW" | "MEDIUM" | "HIGH" =
        score >= 70 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";

      const factors = result.factors.map((f) => ({
        label: f.factor,
        impact: f.weight,
        desc: f.explanation,
      }));

      const reasons = result.triggeredRules.map((r) => `${r.name}: ${r.description}`);
      if (reasons.length === 0 && level === "LOW") {
        reasons.push("Beneficiary verified with zero reported complaints in national registry");
        reasons.push("Hardware keystore verified and amount is within habitual profile");
      }

      setCurrentEval({
        riskScore: score,
        riskLevel: level,
        title:
          level === "HIGH"
            ? "Pause Before You Pay"
            : level === "MEDIUM"
            ? "Moderate Risk Warning"
            : "No major suspicious signals detected",
        message:
          result.summaryReason ||
          (level === "HIGH"
            ? "Multiple high-risk fraud triggers detected matching active cybercrime advisories."
            : level === "MEDIUM"
            ? "Higher than usual payment to an unverified beneficiary."
            : "SafeUPI verified the beneficiary reputation and device integrity."),
        factors: factors.length > 0 ? factors : [
          { label: "Beneficiary reputation", impact: 0, desc: "Clean verification" },
          { label: "Transaction amount", impact: 5, desc: "Within usual spending profile" }
        ],
        reasons,
        recommendations:
          result.safetyTips.length > 0
            ? result.safetyTips
            : [
                "Always double-check recipient display name",
                "Never enter your UPI PIN to receive money",
              ],
      });

      // Voice alert in the user's selected regional language
      if (score >= 70) {
        regionalVoice.speakAlert("STOP_SCAM");
      } else if (score >= 35) {
        regionalVoice.speakAlert("COLLECT_TRAP");
      } else {
        regionalVoice.speakAlert("SAFE");
      }

      // Populate Section 10 Interception Checkpoint Data
      const interceptionPayload: InterceptionCheckData = {
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
        amount: numericAmt,
        type: selectedTxnType,
        recipient: cleanVpa,
        recipientName: cleanVpa.split("@")[0].replace(/[._-]/g, " "),
        timestamp: new Date().toLocaleTimeString(),
        riskScore: score,
        mlRiskPercent: Math.min(99, Math.max(10, Math.round(result.mlScoreComponent || (score * 0.95)))),
        deviceRisk: isScreenShareDetected ? "HIGH" : "LOW",
        networkRisk: cleanVpa.includes("desk99") ? "HIGH" : "LOW",
        recipientRisk: isSusKeywords || muleMatch ? "HIGH" : "LOW",
        decision: score >= 70 ? "DECLINE" : score >= 35 ? "REFER" : "ACCEPT",
        rulesTriggered: result.triggeredRules.map((r) => ({
          code: r.name,
          label: r.name,
          severity: (r.name.includes("MULE") || r.name.includes("DESK") ? "CRITICAL" : "HIGH") as "CRITICAL" | "HIGH",
          description: r.description,
        })),
        validations: {
          passed: score < 70,
          checks: [
            { name: "Recipient VPA Structure", ok: cleanVpa.includes("@"), detail: cleanVpa.includes("@") ? "Valid UPI handle format" : "Invalid syntax" },
            { name: "Mule Blacklist Registry", ok: !muleMatch && !isSusKeywords, detail: muleMatch ? "Matched NCRP 1930 flag" : "No complaint records found" },
            { name: "Device Keystore Integrity", ok: !isScreenShareDetected, detail: isScreenShareDetected ? "Screen sharing / mirror active" : "Hardware enclave verified" },
            { name: "Transaction Velocity Horizon", ok: numericAmt < 20000, detail: numericAmt >= 20000 ? "High value velocity check" : "Habitual spend limit" }
          ],
        },
        explainableAiFactors: factors.map((f) => ({
          factor: f.label,
          impact: `+${f.impact}`,
          humanReason: f.desc,
        })),
        auditTrail: [
          { time: "10:31:20.104", step: "Payment request intercepted at gateway", status: "ok", latencyMs: 2 },
          { time: "10:31:20.107", step: "Pre-flight validations & VPA syntax verified", status: "ok", latencyMs: 3 },
          { time: "10:31:20.111", step: "Device hardware fingerprint & call sensor queried", status: isCallActive ? "warn" : "ok", latencyMs: 4 },
          { time: "10:31:20.116", step: "Heuristic rule evaluation matrix processed", status: reasons.length > 0 ? "warn" : "ok", latencyMs: 5 },
          { time: "10:31:20.120", step: "Ensemble ML risk score generated", status: score >= 70 ? "fail" : "ok", latencyMs: 4 },
          { time: "10:31:20.122", step: `Final decision rendered: ${score >= 70 ? "DECLINE" : score >= 35 ? "REFER" : "ACCEPT"}`, status: score >= 70 ? "fail" : "ok", latencyMs: 2 }
        ],
        processingTimeMs: 18,
      };

      setInterceptionData(interceptionPayload);
      setIsInterceptionModalOpen(true);
      setPaymentPhase("result");
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // -------------------------------------------------------------
  // NPCI OFFICIAL UPI PIN AUTHORIZATION & KEYPAD HANDLER
  // -------------------------------------------------------------
  const handlePinKeypad = (digit: string) => {
    if (isAuthorizingPin) return;
    setPinError(null);
    if (digit === "BACK") {
      setEnteredPin((prev) => prev.slice(0, -1));
      return;
    }
    if (digit === "CLEAR") {
      setEnteredPin("");
      return;
    }
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        submitUpiPin(nextPin);
      }
    }
  };

  const submitUpiPin = (pinToVerify?: string) => {
    const pin = pinToVerify !== undefined ? pinToVerify : enteredPin;
    if (pin.length < 4) {
      setPinError("Please enter all 4 digits of your UPI PIN.");
      return;
    }
    setIsAuthorizingPin(true);
    setPinError(null);

    // Simulate official NPCI / Bank Core Banking System authorization with zero-PII token
    setTimeout(() => {
      setIsAuthorizingPin(false);
      const data = pendingPaymentData || {
        merchant: (payVpa.includes("@") ? payVpa.split("@")[0] : payVpa).replace(/[._-]/g, " ") || "Verified Merchant",
        vpa: payVpa || "swiggy.orders@icici",
        amount: payAmount || "450",
        riskLevel: currentEval?.riskLevel || "LOW",
        riskScore: currentEval?.riskScore || 12,
      };

      recordTransaction({
        merchant: data.merchant,
        vpa: data.vpa,
        amount: data.amount,
        status: "Completed",
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
      });

      setEnteredPin("");
      setPaymentPhase("success");
    }, 850);
  };

  // Keyboard shortcut listener for desktop testing
  useEffect(() => {
    if (paymentPhase !== "pin") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAuthorizingPin) return;
      if (e.key >= "0" && e.key <= "9") {
        handlePinKeypad(e.key);
      } else if (e.key === "Backspace") {
        handlePinKeypad("BACK");
      } else if (e.key === "Escape") {
        setPaymentPhase("result");
      } else if (e.key === "Enter" && enteredPin.length === 4) {
        submitUpiPin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paymentPhase, enteredPin, isAuthorizingPin]);

  // -------------------------------------------------------------
  // MULE REGISTRY DIRECT API SEARCH
  // -------------------------------------------------------------
  const executeDirectMuleSearch = async (query: string) => {
    setIsSearchingMule(true);
    try {
      const res = await fetch(`/api/mule-registry?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMuleSearchResults(data.results || []);
    } catch (e) {
      console.warn("Mule search fetch error", e);
      setMuleSearchResults([]);
    } finally {
      setIsSearchingMule(false);
    }
  };

  const handleMuleSearch = () => {
    if (!muleSearchQuery.trim()) return;
    executeDirectMuleSearch(muleSearchQuery.trim());
  };

  // -------------------------------------------------------------
  // 1930 CYBERCRIME COMPLAINT SUBMISSION (Real Backend DB API)
  // -------------------------------------------------------------
  const handleFileComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSuspectVpa.trim() || !complaintAmount.trim()) return;

    setIsFilingComplaint(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspectVpa: complaintSuspectVpa.trim(),
          amount: parseFloat(complaintAmount) || 0,
          category: complaintType,
          description: complaintNotes.trim() || "Reported via SafeUPI Golden Hour Incident Hub",
          complainantName: user.name,
          complainantPhone: user.mobile,
        })
      });
      const data = await res.json();
      if (data.success && data.complaint) {
        setComplaintSuccessDocket({
          id: data.complaint.id,
          docketNumber: data.complaint.docketNumber
        });
        // refresh server stats
        fetch("/api/database/stats")
          .then((r) => r.json())
          .then((s) => setDbStats(s))
          .catch(() => {});
      }
    } catch (err) {
      console.warn("Complaint filing error", err);
    } finally {
      setIsFilingComplaint(false);
    }
  };

  // Preset quick fill tests for reviewers
  const loadPaymentScenario = (type: "safe" | "medium" | "olx" | "kyc") => {
    setPaymentPhase("form");
    if (type === "safe") {
      setPayVpa("swiggy.orders@icici");
      setPayAmount("450");
      setPayNote("Dinner Order");
    } else if (type === "medium") {
      setPayVpa("srinivas.rent@hdfc");
      setPayAmount("18500");
      setPayNote("House Rent October");
    } else if (type === "olx") {
      setPayVpa("refund.desk99@ybl");
      setPayAmount("8500");
      setPayNote("OLX Laptop Advance Refund");
    } else {
      setPayVpa("urgent.kyc.update@paytm");
      setPayAmount("35000");
      setPayNote("Aadhaar KYC Re-activation");
    }
  };

  // Run screenshot analyzer mock
  const handleAnalyzeScreenshot = (sampleType?: string) => {
    setScreenshotAnalyzing(true);
    setScreenshotResult(null);

    setTimeout(() => {
      setScreenshotAnalyzing(false);
      if (sampleType === "genuine") {
        setScreenshotResult({
          riskScore: 14,
          status: "Genuine Receipt",
          factors: [
            "Official NPCI UTR reference number format matches standard 12-digit format",
            "Bank logo and typography alignment match authentic Google Pay receipt",
            "Timestamp and transaction fee structure are coherent"
          ],
          evidence: "Low fraud probability. Verified authentic payment acknowledgment."
        });
      } else {
        setScreenshotResult({
          riskScore: 76,
          status: "Suspicious",
          factors: [
            "Inbound collect request disguised as 'Payment Received' notice",
            "Font mismatch and altered transaction ID digits detected",
            "Urgent request to 'Enter PIN to accept cashback ₹8,500'",
            "Mule UPI address reported in multiple cyber fraud advisories"
          ],
          evidence: "Potentially suspicious based on the available screenshot signals."
        });
      }
    }, 1400);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vpa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.includes(searchQuery);

    if (!matchesSearch) return false;
    if (historyFilter === "ALL") return true;
    if (historyFilter === "SAFE") return t.riskLevel === "LOW";
    if (historyFilter === "WARNING") return t.riskLevel === "MEDIUM";
    if (historyFilter === "BLOCKED") return t.riskLevel === "HIGH";
    return true;
  });

  // Scam awareness database
  const SCAMS_DATABASE = [
    {
      id: "fake_qr",
      title: "Fake QR Code Scam",
      tag: "QR Quishing",
      scenario: "You are at a local grocery shop or restaurant. A scammer has pasted a rogue QR sticker directly over the store owner's genuine shop QR.",
      whatScammerTries: "Diverts your payment directly to an untraceable mule bank account instead of the shop merchant.",
      warningSigns: [
        "QR sticker looks peeling, uneven, or pasted over another code",
        "Recipient name shown on your payment screen doesn't match shop name",
        "Shopkeeper says they didn't receive the payment notification"
      ],
      whatUserShouldDo: [
        "Verify the shopkeeper's registered business name before authorizing",
        "Scan using SafeUPI to verify merchant reputation beforehand",
        "Alert the merchant immediately if a sticker is overlapping"
      ]
    },
    {
      id: "collect_scam",
      title: "Fake Refund / Collect Scam",
      tag: "OLX & Marketplace",
      scenario: "You post an item for sale on OLX/Facebook Marketplace. A buyer claims they want to pay advance money and sends a 'Collect Request' or barcode.",
      whatScammerTries: "Tricks you into believing you must enter your UPI PIN to 'receive' or 'claim' the incoming payment.",
      warningSigns: [
        "Buyer asks you to 'Accept Request' or 'Authorize PIN' to receive money",
        "Notification says 'Collect Request from XYZ for ₹8,500'",
        "Caller insists that entering PIN is standard bank procedure for receiving"
      ],
      whatUserShouldDo: [
        "NEVER enter your UPI PIN to receive money. Receiving funds requires zero action!",
        "Decline the collect request immediately on your payment app",
        "Block and report the fraudster's mobile number on 1930"
      ]
    },
    {
      id: "remote_access",
      title: "Remote Access Screen-Share Scam",
      tag: "AnyDesk / TeamViewer",
      scenario: "Someone calls claiming to be from your bank, electricity board, or telecom, saying your KYC is expired and services will be terminated in 1 hour.",
      whatScammerTries: "Instructs you to install AnyDesk, RustDesk, or TeamViewer QuickSupport to 'assist you', enabling them to watch you type your PIN and passwords.",
      warningSigns: [
        "Caller tells you to install a screen-sharing app from Play Store",
        "Asks you to read aloud the 9-digit remote connection code",
        "Urges you to make a nominal ₹10 test transfer to 'verify KYC'"
      ],
      whatUserShouldDo: [
        "Immediately hang up. No bank or utility ever asks for screen sharing",
        "Uninstall any newly downloaded remote apps immediately",
        "Turn off Wi-Fi/Mobile Data and contact your bank to freeze UPI"
      ]
    },
    {
      id: "sim_swap",
      title: "SIM Swap / eSIM Scam",
      tag: "Telecom Hijack",
      scenario: "You receive calls pretending to be Airtel/Jio offering 5G upgrades, followed by prompt requests to forward an SMS with 'SIM <number>' to 121.",
      whatScammerTries: "Transfers your phone number to a blank SIM card in their possession, intercepting all bank OTPs and resetting your UPI accounts.",
      warningSigns: [
        "Caller requests your 20-digit SIM card ICCID number or eSIM QR code",
        "Sudden total loss of cellular signal ('No Service') without explanation",
        "Bank SMS notifications received on email regarding device change"
      ],
      whatUserShouldDo: [
        "Never forward carrier upgrade codes or share eSIM QR emails",
        "If signal drops unexpectedly, immediately contact carrier from another phone",
        "Temporarily freeze your net banking and UPI access via bank helpline"
      ]
    },
    {
      id: "phishing_quishing",
      title: "Phishing & Fake Electricity Bills",
      tag: "Malicious APKs",
      scenario: "You receive an urgent SMS: 'Dear Customer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer at XXXXX'.",
      whatScammerTries: "Prompts you to click a link downloading a malicious .apk file that intercepts all inbound bank SMS messages.",
      warningSigns: [
        "Message sent from personal mobile numbers (+91...) instead of official headers (e.g., AD-BESCOM, VK-TSSPDCL)",
        "Severe artificial urgency threatening disconnection in a few hours",
        "Link ends with `.apk` or redirects to an unofficial web domain"
      ],
      whatUserShouldDo: [
        "Check your bill status only on the official state electricity utility portal",
        "Never install apps distributed outside Google Play Store / Apple App Store",
        "Delete the message and report the sender number on Sanchar Saathi (Chakshu)"
      ]
    }
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      themeMode === "dark" 
        ? "bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950" 
        : "bg-slate-100 text-slate-900 selection:bg-indigo-600 selection:text-white"
    }`}>
      
      {/* ========================================================= */}
      {/* TOP NAVBAR (SECTION 6) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#0c1322]/95 backdrop-blur-xl text-white border-b border-indigo-500/20 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setActiveTab("home")}
            className="cursor-pointer select-none"
          >
            <SafeUpiLogo size="md" lightText={true} />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, VPA, merchants..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Language Selector, DB Status, AI Assistant, Theme Switcher, Quick Logout & Notifications */}
          <div className="flex items-center gap-2">

            {/* Multi-Language Selector Dropdown (Language Check Before Pay) */}
            <div className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 transition-all shadow-xs" title="Language Check Before Pay / భాషను ఎంచుకోండి / Language Marandi">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] font-bold text-cyan-300 hidden md:inline whitespace-nowrap">Language Check:</span>
              <select
                id="header-language-select"
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLang)}
                className="bg-transparent text-xs font-bold text-cyan-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Language Check Before Pay"
              >
                <option value="en" className="bg-slate-900 text-white">English (Check Before Pay)</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Check Before Pay)</option>
                <option value="te-en" className="bg-slate-900 text-white">Telugu-English (Check Before Pay)</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Check Before Pay)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Check Before Pay)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Check Before Pay)</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी (Check Before Pay)</option>
              </select>
            </div>

            {/* MongoDB Database Hub Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsMongoHubOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title={currentLang === "te" ? "MongoDB & డేటాబేస్ హబ్ తెరవండి" : "MongoDB & Database Hub"}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">MongoDB Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Real-time Protection Status Badge / Shield Hub */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 text-xs font-semibold"
              title={currentLang === "te" ? "రియల్-టైమ్ సేఫ్టీ షీల్డ్ యాక్టివ్‌గా ఉంది" : currentLang === "te-en" ? "Real-time Safety Shield Active Ga Vundi" : "Real-Time Risk Shield Active"}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang === "te" ? "షీల్డ్ యాక్టివ్" : currentLang === "te-en" ? "Shield Active" : "Shield Active"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            {/* Theme Switcher */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
            >
              {themeMode === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline text-slate-200">Dark</span>
                </>
              )}
            </button>

            {/* Role Switcher: User View vs SOC Analyst View (Section 30 & 31) */}
            <button
              type="button"
              onClick={() => setUserRoleMode(userRoleMode === "USER" ? "SOC" : "USER")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                userRoleMode === "SOC"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white border-purple-400 shadow-purple-900/40 ring-1 ring-purple-300/40"
                  : "bg-slate-850 hover:bg-slate-800 text-cyan-300 border-cyan-500/40"
              }`}
              title="Toggle between User Mode & Enterprise SOC Operations Center"
            >
              {userRoleMode === "SOC" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-200" />
                  <span>SOC Analyst Mode</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>User View</span>
                </>
              )}
            </button>

            {/* Presentation Deck / Pitch Deck (5 Layers) */}
            <button
              type="button"
              onClick={() => setIsDeckOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="SafeUPI Presentation Deck (5 Connected Layers Architecture & Pitch Slides)"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Pitch Deck (5 Layers)</span>
            </button>

            {/* Project Documentation & PDF Download Modal */}
            <button
              type="button"
              onClick={() => setIsDocModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="SafeUPI Project Documentation & PDF Report Download"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Docs & PDF</span>
            </button>

            {/* Multilingual AI Copilot Trigger */}
            <button
              type="button"
              onClick={() => setIsAiChatOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              title="Ask SafeUPI AI Assistant in English, Telugu, Hindi, etc."
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-pulse" />
            </button>

            {/* Quick Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Sign out of SafeUPI"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl text-slate-100 py-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                      Security Notifications (2)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer">
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                    <div className="p-3.5 hover:bg-slate-800/60 flex items-start gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-white">High Risk Transfer Blocked</p>
                        <p className="text-slate-400 mt-0.5">Collect request of ₹8,500 from refund.desk99@ybl was intercepted.</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">Yesterday, 6:40 PM</span>
                      </div>
                    </div>
                    <div className="p-3.5 hover:bg-slate-800/60 flex items-start gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-white">Device Keystore Audited</p>
                        <p className="text-slate-400 mt-0.5">Zero remote screen-mirroring apps active. Device is safe.</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">Today, 8:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold hidden sm:inline">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl text-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.mobile}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProfileTab("profile");
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProfileTab("security");
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Security</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProfileTab("settings");
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Logout to Login Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Sub-navigation Bar for Fast Screen Switching */}
        {/* Main Tab Navigation Bar */}
        <div className="bg-[#080d1a] border-t border-slate-800/80 px-4">
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none text-xs">
            {[
              { id: "home", label: currentLang === "te" ? "హోమ్ (డ్యాష్‌బోర్డ్)" : currentLang === "te-en" ? "Home (Dashboard)" : "Dashboard" },
              { id: "pay", label: currentLang === "te" ? "డబ్బు పంపండి" : currentLang === "te-en" ? "Send Money" : "Send Money" },
              { id: "scan", label: currentLang === "te" ? "QR స్కాన్ & పే" : currentLang === "te-en" ? "Scan & Pay" : "Scan & Pay" },
              { id: "detection", label: currentLang === "te" ? "మోసాల గుర్తింపు కేంద్రం" : currentLang === "te-en" ? "Fraud Detection Center" : "Fraud Detection Center" },
              { id: "screenshot", label: currentLang === "te" ? "స్క్రీన్‌షాట్ తనిఖీ" : currentLang === "te-en" ? "Screenshot Check" : "Screenshot Check" },
              { id: "scams", label: currentLang === "te" ? "స్కామ్ సిమ్యులేటర్" : currentLang === "te-en" ? "Scam Simulator" : "Scam Simulator" },
              { id: "recovery", label: currentLang === "te" ? "1930 రికవరీ హబ్" : currentLang === "te-en" ? "Recovery Hub (1930)" : "Recovery Hub (1930)" },
              { id: "history", label: currentLang === "te" ? "లావాదేవీల చరిత్ర" : currentLang === "te-en" ? "Transaction History" : "Transactions" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as DashboardTab);
                  if (tab.id === "pay") {
                    setPaymentPhase("form");
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECURE SHIELD ENTERPRISE CYBERSECURITY COMMAND BAR */}
        {/* ========================================================= */}
        <div className="bg-[#050913] border-t border-cyan-500/20 px-4 py-2 text-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* Tagline & Team Identity */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest">
                SAFEUPI · CHECK BEFORE YOU PAY
              </span>
              <span className="text-[11px] text-slate-400">
                Team: <strong className="text-white">SECURE SHIELD</strong> · Theme: <span className="text-cyan-300 font-medium">Smart Technologies / Cybersecurity</span>
              </span>
            </div>

            {/* Specialized Cyber Operations Triggers */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setIsAttackPatternsModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Account Takeover, Wallet Credit Abuse, SIM-Swap Cashout, Collusion"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>4 Attack Patterns</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCentralEngineModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="11 Feature Categories, Configurable Rule Matrix, Feature Vector JSON"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>ML Features & Rules</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCaseCenterModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="AI Case Management, Incident Timelines, STR/SAR Compliance Drafts"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Fraud Cases (SAR)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGraphModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-teal-950/60 hover:bg-teal-900 border border-teal-500/40 text-teal-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Node-Link Graph Entity Analysis for Circular & Funneling Networks"
              >
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Collusion Graph</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDecisionLogsModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Microsecond Execution Audit Trails & Decision History"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Decision Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setIsArchitectureModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Microservice Topology, Cloud/On-Prem Deployment, Prototype Disclaimers"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Architecture</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN BODY AREA */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ======================================================= */}
        {/* VIEW 1: HOME DASHBOARD (SECTIONS 6, 7, 8) */}
        {/* ======================================================= */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentLang === "te" ? `శుభోదయం, ${user.name}` : `Good morning, ${user.name}`}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {currentLang === "te" ? "సురక్షితంగా ఉండండి. చెల్లించే ముందు తనిఖీ చేయండి." : currentLang === "te-en" ? "Safe ga undandi. Check before you pay." : "Stay protected. Check before you pay."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {currentLang === "te" ? "రక్షణ యాక్టివ్" : currentLang === "te-en" ? "Protection Active" : "Protection Active"}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  NPCI Verified Shield
                </span>
              </div>
            </div>

            {/* SECTION 7: SECURITY STATUS CARD ("You’re Protected") */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Left: Shield & Status */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="w-9 h-9 text-sky-400 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {currentLang === "te" ? "మీరు రక్షించబడ్డారు" : currentLang === "te-en" ? "Meeru Protected Ga Unnaru" : "You're Protected"}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                      {currentLang === "te" 
                        ? "SafeUPI మీ పేమెంట్ రిస్క్ సిగ్నల్స్‌ను నిరంతరం పర్యవేక్షిస్తుంది. UPI పిన్ ఎంటర్ చేసే ముందే ప్రతి లావాదేవీ తనిఖీ చేయబడుతుంది." 
                        : currentLang === "te-en" 
                        ? "SafeUPI mee payment risk signals ni monitor chestondi. UPI PIN enter chese mundhe transaction check chestundi." 
                        : "SafeUPI is monitoring your payment risk signals in real-time. Every outgoing transfer is analyzed before PIN authorization."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {currentLang === "te" ? "జీరో-PII ప్రైవసీ రక్షణ" : "Zero-PII Cryptographic Privacy"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {currentLang === "te" ? "ప్రీ-ట్రాన్సాక్షన్ రిస్క్ గేజ్" : "Pre-Transaction Risk Gauge"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {currentLang === "te" ? "జాతీయ సైబర్ 1930 రికవరీ హబ్" : "National Cyber 1930 Integration"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPhase("form");
                      setActiveTab("pay");
                      loadPaymentScenario("safe");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentLang === "te" ? "సురక్షిత చెల్లింపు చేయండి" : currentLang === "te-en" ? "Protected Payment Cheyyandi" : "Send Protected Payment"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("detection");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Inspect Threat Radar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* REAL-TIME CYBER THREAT & TELEMETRY PANEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      {currentLang === "te" ? "రియల్-టైమ్ సైబర్ సెక్యూరిటీ టెలిమెట్రీ" : "Live Cyber Threat Intelligence & Telemetry"}
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentLang === "te" ? (
                        <>సేఫ్‌యూపీఐ రిస్క్ ఇంజిన్ · <span className="font-mono text-cyan-300">జీరో-లేటెన్సీ క్లయింట్-ఎడ్జ్ రక్షణ</span></>
                      ) : (
                        <>SafeUPI Risk Engine · <span className="font-mono text-cyan-300">Client-Edge Zero-Latency Protection</span></>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/database/stats").then((r) => r.json()).then((s) => setDbStats(s)).catch(() => {});
                      fetch("/api/transactions").then((r) => r.json()).then((d) => {
                        if (d.transactions) setTransactions(d.transactions);
                      }).catch(() => {});
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={currentLang === "te" ? "టెలిమెట్రీని రిఫ్రెష్ చేయండి" : "Refresh Telemetry"}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{currentLang === "te" ? "రిఫ్రెష్" : "Refresh"}</span>
                  </button>
                </div>
              </div>

              {/* 4 Real Telemetry Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentLang === "te" ? "రక్షించబడిన నిధులు" : "Protected Funds"}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400 mt-1 block">
                    ₹{dbStats.totalProtectedAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {currentLang === "te" ? "మోసాల నుండి ఆపబడిన మొత్తం" : "Saved from fraud transfers"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentLang === "te" ? "బ్లాక్ చేయబడిన మోసాలు" : "Fraud Blocked"}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-rose-400 mt-1 block">
                    {dbStats.blockedCount} {currentLang === "te" ? "ఆపబడ్డాయి" : "Blocked"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {currentLang === "te" ? "ప్రీ-ఆథ్ పిన్ ఉచ్చులు నిలిపివేయబడ్డాయి" : "Pre-auth PIN traps stopped"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentLang === "te" ? "మ్యూల్ రిజిస్ట్రీ" : "Mule Registry"}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-sky-400 mt-1 block">
                    {dbStats.muleRegistryCount} {currentLang === "te" ? "ఖాతాలు" : "Accounts"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {currentLang === "te" ? "I4C / 1930 కమ్యూనిటీ జాబితా" : "I4C / 1930 community list"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentLang === "te" ? "యాక్టివ్ 1930 డాకెట్స్" : "Active 1930 Dockets"}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-400 mt-1 block">
                    {dbStats.activeComplaints} {currentLang === "te" ? "నమోదయ్యాయి" : "Filed"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {currentLang === "te" ? "గోల్డెన్ అవర్ ఫ్రీజ్ యాక్టివ్" : "Golden hour freeze active"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 8: QUICK ACTIONS (4 ATTRACTIVE CARDS) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Quick Payment Actions
                </h3>
                <span className="text-xs text-slate-500">
                  Click any card to start
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Action 1: Pay */}
                <div
                  onClick={() => {
                    setActiveTab("pay");
                    setPaymentPhase("form");
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900 text-base">{currentLang === "te" ? "చెల్లించండి" : currentLang === "te-en" ? "Pay" : "Pay"}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentLang === "te" ? "సురక్షిత చెల్లింపు" : currentLang === "te-en" ? "Payment Cheyyandi" : "Make a Payment"}</p>
                  </div>
                </div>

                {/* Action 2: Scan & Pay */}
                <div
                  onClick={() => setActiveTab("scan")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900 text-base">{currentLang === "te" ? "స్కాన్ & పే" : currentLang === "te-en" ? "Scan & Pay" : "Scan & Pay"}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentLang === "te" ? "QR కోడ్ స్కాన్ చేయండి" : currentLang === "te-en" ? "QR Code Scan Cheyyandi" : "Scan QR Code"}</p>
                  </div>
                </div>

                {/* Action 3: Check Risk */}
                <div
                  onClick={() => setActiveTab("detection")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900 text-base">{currentLang === "te" ? "రిస్క్ చెక్" : currentLang === "te-en" ? "Check Risk" : "Check Risk"}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentLang === "te" ? "లావాదేవీ తనిఖీ" : currentLang === "te-en" ? "Transaction Check Cheyyandi" : "Check Transaction"}</p>
                  </div>
                </div>

                {/* Action 4: Report Fraud */}
                <div
                  onClick={() => setActiveTab("recovery")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-rose-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900 text-base">{currentLang === "te" ? "మోసం రిపోర్ట్" : currentLang === "te-en" ? "Report Fraud" : "Report Fraud"}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{currentLang === "te" ? "1930 హెల్ప్‌లైన్ & రికవరీ" : currentLang === "te-en" ? "1930 Helpline & Recovery" : "Helpline 1930 & Recovery"}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Recent Activity Mini-List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Protected Payments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspected by SafeUPI risk engine
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  View All Transactions →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        tx.riskLevel === "HIGH" 
                          ? "bg-rose-100 text-rose-700" 
                          : tx.riskLevel === "MEDIUM" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {tx.riskLevel === "HIGH" ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{tx.merchant}</p>
                        <p className="text-xs text-slate-500 font-mono">{tx.vpa} • {tx.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 text-sm">{tx.amount}</span>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.riskLevel === "HIGH"
                            ? "bg-rose-100 text-rose-700"
                            : tx.riskLevel === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {tx.riskLevel === "HIGH" ? "🔴 High Risk" : tx.riskLevel === "MEDIUM" ? "🟡 Warning" : "🟢 Low Risk"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 2: PAYMENT SCREEN & SECURITY CHECK (SECTIONS 9 & 10) */}
        {/* ======================================================= */}
        {activeTab === "pay" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Send Money
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Every transaction passes through SafeUPI risk intelligence before PIN authorization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                ← Back
              </button>
            </div>

            {/* Form State */}
            {paymentPhase === "form" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                
                {/* Frequent Beneficiary Directory */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Frequent Payees & Contacts:
                    </span>
                    <span className="text-[10px] text-slate-400">Tap to select</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => loadPaymentScenario("safe")}
                      className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      <span className="text-emerald-600 block text-[10px] font-bold">🟢 VERIFIED</span>
                      <span>Swiggy ₹450</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPaymentScenario("medium")}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      <span className="text-amber-600 block text-[10px] font-bold">🟡 UNUSUAL</span>
                      <span>House Rent ₹18,500</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPaymentScenario("olx")}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      <span className="text-rose-600 block text-[10px] font-bold">🔴 FLAGGED</span>
                      <span>OLX Collect ₹8,500</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPaymentScenario("kyc")}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      <span className="text-rose-600 block text-[10px] font-bold">🔴 BLOCKED</span>
                      <span>Suspicious VPA ₹35,000</span>
                    </button>
                  </div>
                </div>

                {/* Section 3 & 26: Four Major Attack Pattern Presets */}
                <div className="p-3.5 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-200 font-semibold">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      Four Major Attack Pattern Presets (Section 3 & 26):
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAttackPatternsModalOpen(true)}
                      className="text-[10px] text-purple-300 hover:text-white font-bold underline cursor-pointer"
                    >
                      Inspect All 4 Patterns →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTxnType("P2P Transfer");
                        setPayVpa("supreme_court_bail@sbi");
                        setPayAmount("45000");
                        setPayNote("Urgent bail liquidation");
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-750 hover:border-rose-400/60 text-left text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="text-rose-400 block text-[10px] font-bold">1. ACCOUNT TAKEOVER</span>
                      <span className="text-[11px]">₹45k Phishing Drain</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTxnType("Cash-Out");
                        setPayVpa("crypto.p2p.cashout@paytm");
                        setPayAmount("48000");
                        setPayNote("Rapid wallet cashout");
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/50 border border-slate-750 hover:border-amber-400/60 text-left text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="text-amber-400 block text-[10px] font-bold">2. WALLET ABUSE</span>
                      <span className="text-[11px]">₹48k Rapid Cash-out</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTxnType("Bank Transfer");
                        setPayVpa("mule_gold_trader@icici");
                        setPayAmount("30000");
                        setPayNote("SIM swap drain");
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-purple-950/50 border border-slate-750 hover:border-purple-400/60 text-left text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="text-purple-400 block text-[10px] font-bold">3. SIM-SWAP DRAIN</span>
                      <span className="text-[11px]">₹30k Cloned IMSI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTxnType("P2P Transfer");
                        setPayVpa("recipient_x_syndicate@axis");
                        setPayAmount("22000");
                        setPayNote("Collusion cluster deposit");
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950/50 border border-slate-750 hover:border-cyan-400/60 text-left text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
                    >
                      <span className="text-cyan-400 block text-[10px] font-bold">4. COLLUSION RING</span>
                      <span className="text-[11px]">₹22k Mule Cluster</span>
                    </button>
                  </div>
                </div>

                {/* Live Animated Payment Security Status Gauge & Safety Templates */}
                <PaymentSecurityStatusGauge
                  score={livePaymentRisk.score}
                  riskLevel={livePaymentRisk.level}
                  amount={parseFloat(payAmount) || 0}
                  recipient={payVpa || "No recipient entered"}
                  timeStr="02:00 PM"
                  onApplyPreset={(inputs) => {
                    setPayVpa(inputs.recipient);
                    setPayAmount(inputs.amount.toString());
                    if (inputs.isCollectRequest) {
                      setPayNote("Collect request test");
                    }
                  }}
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!payVpa || !payAmount) return;
                    runSecurityCheck(payVpa, payAmount);
                  }}
                  className="space-y-4"
                >
                  {/* Section 2: 7 Supported Transaction Categories */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Transaction Category (Centralized SafeUPI Risk Engine):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                      {[
                        "P2P Transfer",
                        "Cash-Out",
                        "Merchant Payment",
                        "Wallet Credit",
                        "QR Payment",
                        "Collect/Payment Request",
                        "Bank Transfer"
                      ].map((txnType) => (
                        <button
                          key={txnType}
                          type="button"
                          onClick={() => setSelectedTxnType(txnType as TransactionType)}
                          className={`px-2 py-2 rounded-xl font-bold text-[10px] transition-all cursor-pointer text-center truncate ${
                            selectedTxnType === txnType
                              ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {txnType}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UPI ID / Mobile */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      UPI ID / Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={payVpa}
                        onChange={(e) => setPayVpa(e.target.value)}
                        placeholder="e.g. merchant@icici or 9876543210@paytm"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-extrabold text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        placeholder="0.00"
                        min={1}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-bold text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={payNote}
                      onChange={(e) => setPayNote(e.target.value)}
                      placeholder="e.g. Groceries, Rent, Dinner"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Security Notice & Language Check Before Pay */}
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-blue-900 font-semibold">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>SafeUPI Risk Interceptor: Active</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-[10px] font-bold">
                        <Globe className="w-3 h-3 text-cyan-600" />
                        Language Check Before Pay: {currentLang === "te" ? "తెలుగు" : currentLang === "te-en" ? "Telugu-English" : currentLang === "hi" ? "हिन्दी" : currentLang === "ta" ? "தமிழ்" : currentLang === "kn" ? "ಕನ್ನಡ" : currentLang === "mr" ? "मराठी" : "English"}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Evaluates recipient VPA, velocity, reverse collect traps, and reads aloud safety advisory in your chosen language before asking for your UPI PIN.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Checking Animation Phase */}
            {paymentPhase === "checking" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs space-y-6">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  <Shield className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Checking transaction security...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Analyzing recipient virtual address reputation, historical chargebacks, device telemetry, and collect fraud signals.
                  </p>
                </div>

                <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${checkProgress}%` }}
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {checkProgress < 40
                    ? "Validating recipient VPA registry..."
                    : checkProgress < 80
                    ? "Evaluating transaction velocity & device integrity..."
                    : "Finalizing risk score index..."}
                </div>
              </div>
            )}

            {/* Result State (LOW RISK or HIGH RISK) */}
            {paymentPhase === "result" && (
              <div className="space-y-6">
                
                {/* SECTION 9: LOW RISK STATE */}
                {currentEval.riskLevel === "LOW" && (
                  <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in zoom-in-95">
                    
                    {/* Header Banner */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                            🟢 LOW RISK
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            Score: {currentEval.riskScore} / 100
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                          {currentEval.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {currentEval.message}
                        </p>
                      </div>
                    </div>

                    {/* Circular Risk Score Mini Badge */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          Beneficiary: {payVpa}
                        </span>
                        <span className="text-xs text-slate-600">
                          Amount: ₹{payAmount}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700">{currentEval.riskScore}</span>
                        <span className="text-xs text-slate-400 block font-medium">/ 100 Risk</span>
                      </div>
                    </div>

                    {/* Expandable "Why this score?" */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setIsWhyScoreOpen(!isWhyScoreOpen)}
                        className="w-full p-4 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                      >
                        <span>Why this score?</span>
                        {isWhyScoreOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isWhyScoreOpen && (
                        <div className="p-4 bg-white space-y-2.5 divide-y divide-slate-100 text-xs">
                          {currentEval.factors.map((f, i) => (
                            <div key={i} className="pt-2 first:pt-0 flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-800">{f.label}</p>
                                <p className="text-[11px] text-slate-400">{f.desc}</p>
                              </div>
                              <span className="font-mono text-xs font-bold text-emerald-600">
                                +{f.impact}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targetVpa = (payVpa || "swiggy.orders@icici").trim();
                          const targetMerchant = (targetVpa.includes("@") ? targetVpa.split("@")[0] : targetVpa).replace(/[._-]/g, " ") || "Verified Merchant";
                          setPendingPaymentData({
                            merchant: targetMerchant,
                            vpa: targetVpa,
                            amount: payAmount || "450",
                            riskLevel: "LOW",
                            riskScore: currentEval?.riskScore || 12,
                          });
                          setEnteredPin("");
                          setPinError(null);
                          setPaymentPhase("pin");
                        }}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Proceed to Payment (Enter UPI PIN)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentPhase("form")}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* SECTION 10: HIGH RISK WARNING SCREEN */}
                {currentEval.riskLevel === "HIGH" && (
                  <div className="bg-white border-2 border-rose-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in zoom-in-95">
                    
                    {/* Header Banner */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <AlertOctagon className="w-8 h-8 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
                            🔴 HIGH RISK
                          </span>
                          <span className="text-xs font-mono font-bold text-rose-700">
                            Risk Score: {currentEval.riskScore} / 100
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-rose-950 mt-1">
                          Pause Before You Pay
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          We detected multiple suspicious signals in this transaction.
                        </p>
                      </div>
                    </div>

                    {/* Target Payment Summary */}
                    <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">Recipient VPA: {payVpa}</span>
                        <span className="text-slate-600">Attempted Amount: ₹{payAmount}</span>
                      </div>
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        High Fraud Signature
                      </span>
                    </div>

                    {/* Detected Reasons as Individual Cards */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                        Detected Warning Signals:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentEval.reasons.map((reason, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-xl flex items-start gap-2 text-xs font-semibold text-rose-900"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 11: RISK GAUGE & FACTOR BREAKDOWN */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Why is this risky? (Factor Breakdown)</span>
                        <span className="text-xs font-mono font-bold text-rose-600">Total: {currentEval.riskScore} / 100</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {currentEval.factors.map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-slate-600">{factor.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 sm:w-36 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-rose-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, (factor.impact / 30) * 100)}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-slate-800 w-8 text-right">
                                +{factor.impact}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* "What should you do?" Section */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        What should you do?
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        <li>1. Verify the recipient through independent direct call.</li>
                        <li>2. Confirm why you are making the payment. (Receiving funds never requires a PIN).</li>
                        <li>3. Do not share your UPI PIN or accept inbound collect requests.</li>
                        <li>4. Cancel if anything feels suspicious.</li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targetVpa = (payVpa || "refund.desk99@ybl").trim();
                          const targetMerchant = (targetVpa.includes("@") ? targetVpa.split("@")[0] : targetVpa).replace(/[._-]/g, " ") || "Suspicious Recipient";
                          recordTransaction({
                            merchant: `${targetMerchant} (Threat Intercepted)`,
                            vpa: targetVpa,
                            amount: payAmount || "8500",
                            status: "Blocked",
                            riskLevel: "HIGH",
                            riskScore: currentEval?.riskScore || 88,
                          });
                          setPaymentPhase("form");
                          setPayVpa("");
                          setPayAmount("");
                        }}
                        className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel Payment (Fraud Prevented)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("WARNING: SafeUPI strongly recommends NOT proceeding with this transfer as high-risk fraud flags were detected. Are you sure you wish to review?")) {
                            setPaymentPhase("form");
                          }
                        }}
                        className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer transition-colors"
                      >
                        Review Transaction
                      </button>
                    </div>
                  </div>
                )}

                {/* Medium Risk Warning State */}
                {currentEval.riskLevel === "MEDIUM" && (
                  <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in zoom-in-95">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                          🟡 MEDIUM RISK
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          {currentEval.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {currentEval.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const targetVpa = (payVpa || "srinivas.rent@hdfc").trim();
                          const targetMerchant = (targetVpa.includes("@") ? targetVpa.split("@")[0] : targetVpa).replace(/[._-]/g, " ") || "Recipient";
                          setPendingPaymentData({
                            merchant: targetMerchant,
                            vpa: targetVpa,
                            amount: payAmount || "18500",
                            riskLevel: "MEDIUM",
                            riskScore: currentEval?.riskScore || 52,
                          });
                          setEnteredPin("");
                          setPinError(null);
                          setPaymentPhase("pin");
                        }}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Proceed with Caution (Enter UPI PIN)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentPhase("form")}
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ======================================================= */}
            {/* NPCI OFFICIAL UPI PIN ENTRY SCREEN (Layer 4 Pre-Debit Verification) */}
            {/* ======================================================= */}
            {paymentPhase === "pin" && (
              <div className="bg-white border-2 border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 max-w-md mx-auto animate-in zoom-in-95 text-slate-900">
                {/* Official Bank & NPCI Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shadow-2xs">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{selectedBank}</p>
                      <p className="text-[10px] text-slate-500 font-mono">NPCI Unified Payments Interface (UPI 2.0)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PROTECTED GATE
                  </span>
                </div>

                {/* Recipient & Amount Breakdown */}
                <div className="text-center space-y-1 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Debit Amount</span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    ₹{parseFloat(String(payAmount || "0").replace(/[^0-9.]/g, "")).toLocaleString("en-IN") || "0"}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 truncate max-w-xs mx-auto pt-0.5">
                    Paying to: <span className="font-mono text-indigo-600 font-bold">{payVpa}</span>
                  </div>
                </div>

                {/* PIN Instruction & 4 Masked Dots */}
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ENTER 4-DIGIT UPI PIN</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-2">
                    {[0, 1, 2, 3].map((index) => {
                      const isFilled = enteredPin.length > index;
                      const isCurrent = enteredPin.length === index && !isAuthorizingPin;
                      return (
                        <div
                          key={index}
                          className={`w-5 h-5 rounded-full transition-all flex items-center justify-center ${
                            isFilled
                              ? "bg-indigo-600 scale-110 shadow-sm shadow-indigo-500/40"
                              : isCurrent
                              ? "bg-indigo-100 border-2 border-indigo-500 animate-pulse"
                              : "bg-slate-100 border border-slate-300"
                          }`}
                        />
                      );
                    })}
                  </div>

                  {pinError && (
                    <p className="text-xs text-rose-600 font-bold animate-bounce">
                      {pinError}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-400">
                    Use physical keyboard or keypad below (Demo PIN: enter any 4 digits, e.g. <span className="font-mono font-bold text-indigo-600">1234</span>)
                  </p>
                </div>

                {/* Safe Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      disabled={isAuthorizingPin}
                      onClick={() => handlePinKeypad(digit)}
                      className="py-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 border border-slate-200 text-lg font-bold text-slate-800 transition-all shadow-2xs hover:border-indigo-300 cursor-pointer disabled:opacity-50"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={isAuthorizingPin}
                    onClick={() => handlePinKeypad("CLEAR")}
                    className="py-3.5 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 text-xs font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    disabled={isAuthorizingPin}
                    onClick={() => handlePinKeypad("0")}
                    className="py-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 border border-slate-200 text-lg font-bold text-slate-800 transition-all shadow-2xs hover:border-indigo-300 cursor-pointer disabled:opacity-50"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    disabled={isAuthorizingPin}
                    onClick={() => handlePinKeypad("BACK")}
                    className="py-3.5 rounded-2xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-sm font-bold text-slate-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    ⌫
                  </button>
                </div>

                {/* Authorize / Submit Action */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    disabled={isAuthorizingPin || enteredPin.length !== 4}
                    onClick={() => submitUpiPin()}
                    className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      enteredPin.length === 4 && !isAuthorizingPin
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
                        : "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                    }`}
                  >
                    {isAuthorizingPin ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authorizing with NPCI CBS...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize Payment (₹{payAmount || "0"})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isAuthorizingPin}
                    onClick={() => {
                      setEnteredPin("");
                      setPinError(null);
                      setPaymentPhase("result");
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Back to Security Review
                  </button>
                </div>

                {/* SafeUPI Pre-Auth Sentinel Guarantee */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Protected by SafeUPI Pre-Auth Sentinel · Zero-PII Security</span>
                </div>
              </div>
            )}

            {/* Payment Finalized Success State */}
            {paymentPhase === "success" && (
              <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xs space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    NPCI UPI TRANSACTION CONFIRMED
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                    Payment Successful
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    ₹{parseFloat(String(payAmount || "0").replace(/[^0-9.]/g, "")).toLocaleString("en-IN")} transferred securely to <span className="font-mono font-bold text-slate-900">{payVpa}</span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-sm mx-auto text-xs text-slate-600 space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Debited From:</span>
                    <span className="font-semibold text-slate-800">{selectedBank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">UPI PIN Status:</span>
                    <span className="font-mono font-bold text-emerald-700">● ● ● ● (Verified)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Reference UTR:</span>
                    <span className="font-mono font-bold text-slate-800">UTR{Date.now().toString().slice(-10)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Security Check:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      PASSED (Zero-PII)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPhase("form");
                      setPayVpa("");
                      setPayAmount("");
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    Send Another Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPhase("form");
                      setPayVpa("");
                      setPayAmount("");
                      setActiveTab("home");
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 3: SCAN & PAY (SECTION 12) */}
        {/* ======================================================= */}
        {activeTab === "scan" && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Scan a UPI QR code
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Position the QR code inside the frame to inspect merchant reputation
              </p>
            </div>

            {/* Camera Viewfinder UI */}
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col items-center justify-center min-h-[380px]">
              
              {/* Corner Brackets Viewfinder */}
              <div className="relative w-64 h-64 border-2 border-dashed border-sky-400/60 rounded-2xl flex items-center justify-center overflow-hidden">
                {/* Laser Scanning Bar */}
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-bounce" />

                {/* Center Camera Icon or Decoded Payee */}
                {scannedPayee ? (
                  <div className="text-center p-4 bg-slate-900/90 rounded-xl border border-sky-400/40">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-white block">QR Code Recognized</span>
                    <span className="text-[11px] font-mono text-sky-300">{scannedPayee}</span>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                    <span className="text-xs font-mono">Align QR inside box</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Launch Live Camera / Upload Scanner</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  Supports device camera scanning or QR image upload with zero-PII validation
                </p>
              </div>

              {/* Verified Merchant Quick Pay */}
              <div className="mt-6 w-full pt-4 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-400 text-center">
                  Quick Pay to Verified Merchants:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScannedPayee("sharmastore@paytm");
                      setTimeout(() => {
                        setActiveTab("pay");
                        setPayVpa("sharmastore@paytm");
                        setPayAmount("320");
                        runSecurityCheck("sharmastore@paytm", "320");
                      }, 400);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    🟢 Safe Kirana Store (₹320)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScannedPayee("swiggy@icici");
                      setTimeout(() => {
                        setActiveTab("pay");
                        setPayVpa("swiggy@icici");
                        setPayAmount("250");
                        runSecurityCheck("swiggy@icici", "250");
                      }, 400);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    🟢 Swiggy Merchant (₹250)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScannedPayee("refund.desk99@ybl");
                      setTimeout(() => {
                        setActiveTab("pay");
                        setPayVpa("refund.desk99@ybl");
                        setPayAmount("8500");
                        runSecurityCheck("refund.desk99@ybl", "8500");
                      }, 400);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-xs text-rose-200 border border-rose-800 cursor-pointer"
                  >
                    🔴 Tampered Sticker QR (₹8,500)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 4: TRANSACTION HISTORY (SECTION 13) */}
        {/* ======================================================= */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Transaction History
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Inspect completed transfers and prevented fraud incidents
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                {(["ALL", "SAFE", "WARNING", "BLOCKED"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setHistoryFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      historyFilter === filter
                        ? "bg-white text-blue-600 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No transactions found matching your filter.
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        tx.status === "Blocked"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {tx.status === "Blocked" ? <XCircle className="w-6 h-6 text-rose-600" /> : <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{tx.merchant}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === "Blocked" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{tx.vpa} • {tx.date}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                      <span className="font-extrabold text-slate-900 text-base">{tx.amount}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        tx.riskLevel === "HIGH"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : tx.riskLevel === "MEDIUM"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {tx.riskLevel === "HIGH" ? "🔴 High Risk" : tx.riskLevel === "MEDIUM" ? "🟡 Medium Risk" : "🟢 Low Risk"} ({tx.riskScore}/100)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 5: FRAUD DETECTION CENTER (SECTION 14) */}
        {/* ======================================================= */}
        {activeTab === "detection" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Fraud Detection Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Core cybersecurity modules safeguarding your UPI payments
              </p>
            </div>

            {/* 3 Major Cards (Section 14) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Live Risk Check */}
              <div 
                onClick={() => {
                  setActiveTab("pay");
                  setPaymentPhase("form");
                }}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Live Risk Check
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Analyze a transaction before payment. Evaluate recipient virtual addresses against known mule registries.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Start Live Check</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Screenshot Analysis */}
              <div 
                onClick={() => setActiveTab("screenshot")}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Screenshot Analysis
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload a payment screenshot for analysis. Detect spoofed payment confirmations, altered UTRs, and collect trap notices.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Upload Screenshot</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Scam Simulator */}
              <div 
                onClick={() => setActiveTab("scams")}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Scam Simulator
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Learn how common scams work. Interactive breakdowns of QR Quishing, OLX Collect traps, and Remote AnyDesk hijacking.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Explore Scenarios</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Deep Security Forensics & Risk Inspector */}
            <div className="pt-2">
              <TransactionRiskDashboard
                currentLang={currentLang}
                onInspectItem={(item) => {
                  const cleanedVpa = item.recipient.includes("(")
                    ? item.recipient.split("(")[1].replace(")", "").trim()
                    : item.recipient;
                  setPayVpa(cleanedVpa);
                  setPayAmount(String(item.amount));
                  setActiveTab("pay");
                  setPaymentPhase("form");
                  runSecurityCheck(cleanedVpa, String(item.amount));
                }}
              />
            </div>

            {/* LIVE I4C & NPCI MULE ACCOUNT REGISTRY SEARCH ENGINE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      I4C & NPCI Mule Account Verification Query
                    </h3>
                    <p className="text-xs text-slate-500">
                      Check any UPI ID or mobile against the live national mule database
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                  Live API: /api/mule-registry
                </span>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="mule-search-vpa"
                    type="text"
                    value={muleSearchQuery}
                    onChange={(e) => setMuleSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleMuleSearch();
                      }
                    }}
                    placeholder="Enter UPI ID (e.g. refund.desk99@ybl, urgent.kyc@airtel, swiggy@icici)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleMuleSearch}
                  disabled={isSearchingMule}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
                >
                  {isSearchingMule ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Querying DB...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Registry</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset quick test queries */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold">Quick Test VPAs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMuleSearchQuery("refund.desk99@ybl");
                    executeDirectMuleSearch("refund.desk99@ybl");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono text-[11px] cursor-pointer"
                >
                  refund.desk99@ybl (Mule)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMuleSearchQuery("urgent.kyc.update@airtel");
                    executeDirectMuleSearch("urgent.kyc.update@airtel");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono text-[11px] cursor-pointer"
                >
                  urgent.kyc.update@airtel (Mule)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMuleSearchQuery("swiggy.orders@icici");
                    executeDirectMuleSearch("swiggy.orders@icici");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-mono text-[11px] cursor-pointer"
                >
                  swiggy.orders@icici (Verified)
                </button>
              </div>

              {/* Search Results Display */}
              {muleSearchResults !== null && (
                <div className="pt-2 animate-in fade-in">
                  {muleSearchResults.length > 0 ? (
                    <div className="space-y-3">
                      {muleSearchResults.map((mule, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            mule.riskLevel === "CRITICAL"
                              ? "bg-rose-50/70 border-rose-300"
                              : "bg-emerald-50/70 border-emerald-300"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">
                                {mule.accountHolder}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                mule.riskLevel === "CRITICAL"
                                  ? "bg-rose-600 text-white"
                                  : "bg-emerald-600 text-white"
                              }`}>
                                {mule.riskLevel === "CRITICAL" ? "Blacklisted Mule" : "Verified Merchant"}
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                ({mule.bankName})
                              </span>
                            </div>
                            <div className="text-xs text-slate-700 font-mono">
                              VPA: <strong>{mule.vpa}</strong> · Linked Mobile: {mule.phone}
                            </div>
                            <p className="text-xs text-slate-600">
                              <strong>Modus Operandi:</strong> {mule.modusOperandi}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-xs text-slate-500">Risk Score</div>
                              <div className={`text-xl font-black ${
                                mule.riskScore >= 70 ? "text-rose-600" : "text-emerald-600"
                              }`}>
                                {mule.riskScore}%
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPayVpa(mule.vpa);
                                setPayAmount("1000");
                                setActiveTab("pay");
                                setPaymentPhase("form");
                                runSecurityCheck(mule.vpa, "1000");
                              }}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Test in Shield
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-950">
                          No Mule Blacklist Match Found
                        </p>
                        <p className="text-xs text-emerald-800">
                          &quot;{muleSearchQuery}&quot; has not been reported in the current I4C 1930 community mule registry.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* LIVE NATIONAL CYBER THREAT ADVISORIES */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Live Cybercrime Threat Intel Advisories
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time warning bulletins issued by Indian Cybercrime Coordination Centre (I4C)
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-400/30 shrink-0">
                  {threatIntelAlerts.length || 3} Active Advisories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {(threatIntelAlerts.length > 0 ? threatIntelAlerts : [
                  {
                    id: "THREAT-2025-01",
                    title: "Electricity Disconnection Phishing APK",
                    threatLevel: "HIGH",
                    category: "Malicious APK",
                    summary: "Fraudulent SMS threatening power cut tonight urging download of 'BijliBill.apk'.",
                    advisory: "Never install APKs from SMS. State electricity boards do not send APK links."
                  },
                  {
                    id: "THREAT-2025-02",
                    title: "Counterfeit QR Merchant Stickers",
                    threatLevel: "CRITICAL",
                    category: "Tampered QR",
                    summary: "Physical adhesive QR stickers placed over genuine merchant standees in tea stalls.",
                    advisory: "Always verify recipient store name matches merchant board before entering UPI PIN."
                  },
                  {
                    id: "THREAT-2025-03",
                    title: "Telegram Part-Time Rating Scam",
                    threatLevel: "MEDIUM",
                    category: "Prepaid Task",
                    summary: "Victims offered ₹500 for hotel reviews, later coerced into VIP crypto/UPI investments.",
                    advisory: "Legitimate businesses never demand security deposits for daily rating tasks."
                  }
                ]).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          alert.threatLevel === "CRITICAL"
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}>
                          {alert.threatLevel} RISK
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {alert.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-2 leading-snug">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {alert.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-750 text-[11px] text-cyan-300">
                      <strong>Protocol:</strong> {alert.advisory}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 6: SCREENSHOT ANALYSIS (SECTION 15) */}
        {/* ======================================================= */}
        {activeTab === "screenshot" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Payment Screenshot Inspector
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                AI & OCR analysis to detect collect-request traps, altered UTRs, and spoofed payment confirmations in real-time.
              </p>
            </div>

            <TransactionScreenshotUploader
              isOpenDefault={true}
              onApplyExtractedPayload={(payload) => {
                if (payload.receiverVpa) setPayVpa(payload.receiverVpa);
                if (payload.amount) setPayAmount(String(payload.amount));
                if (payload.notesOrRemarks) setPayNote(payload.notesOrRemarks);
                setActiveTab("pay");
                runSecurityCheck(payload.receiverVpa || "unknown@upi", String(payload.amount || "1000"));
              }}
            />
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 7: SCAM AWARENESS SIMULATOR (SECTION 16) */}
        {/* ======================================================= */}
        {activeTab === "scams" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Learn Before You Lose
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Understand how fraudsters manipulate UPI payment steps and learn simple defense protocols
              </p>
            </div>

            {/* 5 Scam Cards Selection Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {SCAMS_DATABASE.map((scam) => (
                <button
                  key={scam.id}
                  type="button"
                  onClick={() => setSelectedScamId(scam.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedScamId === scam.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                    selectedScamId === scam.id ? "text-sky-200" : "text-blue-600"
                  }`}>
                    {scam.tag}
                  </span>
                  <span className="text-xs font-bold block mt-1 leading-tight">
                    {scam.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Scam Interactive Breakdown (Scenario ↓ Scammer tries ↓ Warning signs ↓ What user should do) */}
            {(() => {
              const currentScam = SCAMS_DATABASE.find((s) => s.id === selectedScamId) || SCAMS_DATABASE[0];
              return (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Interactive Breakdown
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {currentScam.title}
                    </h3>
                  </div>

                  {/* Step 1: Scenario */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Scenario
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {currentScam.scenario}
                    </p>
                  </div>

                  <div className="flex justify-center text-slate-300">
                    <span>↓</span>
                  </div>

                  {/* Step 2: What the scammer tries */}
                  <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                      What the scammer tries
                    </span>
                    <p className="text-sm text-rose-900 leading-relaxed font-semibold">
                      {currentScam.whatScammerTries}
                    </p>
                  </div>

                  <div className="flex justify-center text-slate-300">
                    <span>↓</span>
                  </div>

                  {/* Step 3: Warning signs */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Warning signs
                    </span>
                    <ul className="space-y-1 text-xs text-amber-950 font-medium">
                      {currentScam.warningSigns.map((sign, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center text-slate-300">
                    <span>↓</span>
                  </div>

                  {/* Step 4: What the user should do */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      What you should do
                    </span>
                    <ul className="space-y-1 text-xs text-emerald-950 font-semibold">
                      {currentScam.whatUserShouldDo.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 8: FRAUD RECOVERY HUB (SECTION 17) */}
        {/* ======================================================= */}
        {activeTab === "recovery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Fraud Recovery Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Official emergency incident guidance and Golden Hour bank freeze protocols
              </p>
            </div>

            {/* Top Emergency-Style But Calm Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-400/30">
                  Golden Hour Protocol
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  Think you&apos;ve been scammed?
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-md">
                  Report within 2 to 4 hours to maximize your chances of freezing funds before the fraudster withdraws them from an ATM.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setComplaintSuccessDocket(null);
                    setComplaintSuspectVpa("");
                    setComplaintAmount("");
                    setComplaintNotes("");
                    setIsComplaintModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileWarning className="w-4 h-4" />
                  <span>File 1930 Cyber Complaint</span>
                </button>

                <a
                  href="tel:1930"
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 1930 (Helpline)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("recovery-steps-guide");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Recovery Guide</span>
                </button>
              </div>
            </div>

            {/* 5-Step Process (Section 17) */}
            <div id="recovery-steps-guide" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                Step-by-Step Incident Response
              </h3>

              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Secure your account
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Immediately disable UPI transactions via your bank&apos;s mobile banking app or SMS &ldquo;BLOCK UPI&rdquo; to your bank&apos;s emergency number. Change your UPI PIN and email passwords.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Collect transaction details
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Save the 12-digit UTR (Unique Transaction Reference) number, debit timestamp, beneficiary UPI ID, screenshot of the conversation, and caller&apos;s phone number.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Prepare incident information
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Summarize the exact sequence: whether you clicked a link, installed AnyDesk, scanned a QR code, or accepted a collect request.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Follow the appropriate reporting process
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Call 1930 immediately or log in to <strong>cybercrime.gov.in</strong> to submit a formal complaint under Financial Fraud. Request the operator to freeze the recipient mule account.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Track your case/reference information
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Note down your Acknowledgement Docket Number from 1930. Provide this docket number to your home bank branch manager to request a formal dispute chargeback under RBI guidelines.
                    </p>
                  </div>
                </div>

              </div>

              {/* Official 1930 Guidance Footer */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <strong className="block text-blue-950 font-bold">1930 / Official Reporting Guidance</strong>
                  <span>Operated by Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs.</span>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* FLOATING MULTILINGUAL AI ASSISTANT BUTTON */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsAiChatOpen(true)}
          className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-900/30 ring-2 ring-blue-400/40 flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105"
          title="Ask SafeUPI AI Assistant in any regional language"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">AI Assistant</span>
            <span className="text-[10px] text-sky-200 block">Telugu, Hindi & English</span>
          </div>
        </button>
      </div>

      {/* Multilingual AI Chat Modal */}
      <SafeUpiAiChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentLang={currentLang}
      />

      {/* 1930 CYBERCRIME COMPLAINT FILING MODAL (Connects to Real Backend Database) */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <FileWarning className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    File 1930 Cyber Fraud Incident
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Initiates Golden Hour freeze protocol & logs official 1930 incident docket
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComplaintModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {complaintSuccessDocket ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-950">
                  {currentLang === "te" ? "1930 ఇన్సిడెంట్ డాకెట్ నమోదైంది" : "1930 Incident Docket Generated"}
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {currentLang === "te" 
                    ? "మీ సైబర్ క్రైమ్ ఫిర్యాదు అధికారికంగా నమోదు చేయబడింది మరియు గోల్డెన్ అవర్ ఫ్రీజ్ ప్రారంభించబడింది."
                    : "Your formal complaint has been filed and an official emergency tracking docket has been generated for Golden Hour freeze."}
                </p>
                <div className="p-3 bg-white border border-emerald-300 rounded-xl font-mono text-xs font-bold text-slate-900">
                  Docket ID: <span className="text-blue-600">{complaintSuccessDocket.docketNumber}</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  Record ID: {complaintSuccessDocket.id} · Golden Hour Freeze Dispatched
                </div>
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFileComplaint} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Suspect Beneficiary UPI ID / VPA *
                  </label>
                  <input
                    id="complaint-suspect-vpa"
                    type="text"
                    required
                    value={complaintSuspectVpa}
                    onChange={(e) => setComplaintSuspectVpa(e.target.value)}
                    placeholder="e.g. refund.desk99@ybl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Disputed Amount (₹) *
                    </label>
                    <input
                      id="complaint-amount"
                      type="number"
                      required
                      value={complaintAmount}
                      onChange={(e) => setComplaintAmount(e.target.value)}
                      placeholder="e.g. 8500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Incident Category *
                    </label>
                    <select
                      id="complaint-category"
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Collect Request Phishing">Collect Request Trap</option>
                      <option value="Tampered QR Code">Tampered QR Sticker</option>
                      <option value="Fake Electricity APK">Electricity APK Trap</option>
                      <option value="Remote AnyDesk Scam">Remote App (AnyDesk)</option>
                      <option value="Telegram Rating Fraud">Task Investment Fraud</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brief Modus Operandi / Notes
                  </label>
                  <textarea
                    id="complaint-notes"
                    rows={2}
                    value={complaintNotes}
                    onChange={(e) => setComplaintNotes(e.target.value)}
                    placeholder="Describe how the fraudster contacted you (e.g. sent OLX QR code, claimed to be bank manager)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 block">Complainant Information:</span>
                  <span className="text-slate-600 block">
                    {user.name} ({user.mobile}) · Linked Device: Hardware Keystore Verified
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComplaintModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFilingComplaint}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isFilingComplaint ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging Incident...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>{currentLang === "te" ? "ఫిర్యాదు నమోదు చేయండి" : "File Official Complaint"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Profile / Security / Settings Modal */}
      {activeProfileTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {activeProfileTab === "profile" ? "My Profile" : activeProfileTab === "security" ? "Security Settings" : "Account Settings"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveProfileTab(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Registered User</span>
                <span className="font-bold text-slate-900 text-sm">{user.name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Mobile Number</span>
                <span className="font-mono font-bold text-slate-900">{user.mobile}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="font-medium text-slate-900">{user.email}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">SafeUPI Zero-PII Shield is Active</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveProfileTab(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner Modal with Live Camera & File Upload */}
      <QrCodeScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onQrScanned={(data: DecodedUpiQr) => {
          setIsQrModalOpen(false);
          setScannedPayee(data.vpa);
          setPayVpa(data.vpa);
          const amt = data.amount ? String(data.amount) : "500";
          setPayAmount(amt);
          setPayNote(data.note || "QR Code Payment");
          setActiveTab("pay");
          runSecurityCheck(data.vpa, amt);
        }}
      />

      {/* Presentation Deck / 5 Connected Layers Modal */}
      {isDeckOpen && (
        <PresentationDeck onClose={() => setIsDeckOpen(false)} />
      )}

      {/* Project Documentation & PDF Report Modal */}
      {isDocModalOpen && (
        <ProjectDocumentationModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
        />
      )}

      {/* MongoDB Database Hub Modal */}
      {isMongoHubOpen && (
        <MongoDatabaseHubModal
          isOpen={isMongoHubOpen}
          onClose={() => setIsMongoHubOpen(false)}
          currentLang={currentLang}
        />
      )}

      {/* SECTION 1, 9, 10, 27: REAL-TIME TRANSACTION INTERCEPTION CHECKPOINT MODAL */}
      <TransactionInterceptionModal
        isOpen={isInterceptionModalOpen}
        data={interceptionData}
        onClose={() => setIsInterceptionModalOpen(false)}
        onCancel={() => {
          setIsInterceptionModalOpen(false);
          setPaymentPhase("form");
        }}
        onProceedToPin={() => {
          setIsInterceptionModalOpen(false);
          const cleanVpa = interceptionData?.recipient || payVpa || "unknown@upi";
          const numericAmt = interceptionData?.amount || parseFloat(payAmount) || 0;
          setPendingPaymentData({
            merchant: (cleanVpa.includes("@") ? cleanVpa.split("@")[0] : cleanVpa).replace(/[._-]/g, " ") || "Verified Payee",
            vpa: cleanVpa,
            amount: String(numericAmt),
            riskLevel: currentEval.riskLevel,
            riskScore: currentEval.riskScore,
          });
          setEnteredPin("");
          setPinError(null);
          setPaymentPhase("pin");
        }}
        onOpenInvestigation={() => {
          setIsInterceptionModalOpen(false);
          setIsCaseCenterModalOpen(true);
        }}
        isUserViewSimple={userRoleMode === "USER"}
      />

      {/* SECTION 3 & 26: FOUR MAJOR ATTACK PATTERNS MODAL */}
      <FourMajorAttackPatternsModal
        isOpen={isAttackPatternsModalOpen}
        onClose={() => setIsAttackPatternsModalOpen(false)}
        onSimulatePattern={(pattern) => {
          setIsAttackPatternsModalOpen(false);
          setActiveTab("pay");
          setSelectedTxnType(pattern.concreteScenario.simulatedTransaction.type as TransactionType);
          setPayVpa(pattern.concreteScenario.simulatedTransaction.recipient);
          setPayAmount(String(pattern.concreteScenario.simulatedTransaction.amount));
          runSecurityCheck(
            pattern.concreteScenario.simulatedTransaction.recipient,
            String(pattern.concreteScenario.simulatedTransaction.amount)
          );
        }}
      />

      {/* SECTION 4, 5, 7, 8: CENTRAL RISK & ML FEATURE ENGINE MODAL */}
      <CentralRiskAndFeatureEngineModal
        isOpen={isCentralEngineModalOpen}
        onClose={() => setIsCentralEngineModalOpen(false)}
      />

      {/* SECTION 12, 13, 14, 15: AI FRAUD CASE CENTER & COMPLIANCE DRAFTS MODAL */}
      <AiFraudCaseCenterModal
        isOpen={isCaseCenterModalOpen}
        onClose={() => setIsCaseCenterModalOpen(false)}
        initialTxnId={interceptionData?.transactionId}
      />

      {/* SECTION 16 & 17: DECISION LOGS & AUDIT TRAILS MODAL */}
      <DecisionLogsAndAuditTrailModal
        isOpen={isDecisionLogsModalOpen}
        onClose={() => setIsDecisionLogsModalOpen(false)}
      />

      {/* SECTION 20: TRANSACTION GRAPH & RELATIONSHIP ANALYSIS MODAL */}
      <TransactionGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
      />

      {/* SECTION 28 & 33: DEPLOYMENT ARCHITECTURE & PROTOTYPE BOUNDARIES MODAL */}
      <DeploymentArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SafeUPI</span>
            <span>· &ldquo;Check Before You Pay&rdquo;</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Developed by <strong>Team Secure Shield</strong></span>
            <span>•</span>
            <a href="tel:1930" className="text-rose-600 hover:underline font-bold">
              Helpline: 1930
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
